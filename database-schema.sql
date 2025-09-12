-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create polls table
CREATE TABLE IF NOT EXISTS polls (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_public BOOLEAN DEFAULT TRUE,
  allow_multiple_votes BOOLEAN DEFAULT FALSE,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create poll_options table
CREATE TABLE IF NOT EXISTS poll_options (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  text TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(poll_id, order_index)
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  voter_ip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(poll_id, user_id) -- Prevent duplicate votes from same user
);

-- Create poll_analytics table
CREATE TABLE IF NOT EXISTS poll_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE UNIQUE,
  total_votes INTEGER DEFAULT 0,
  unique_voters INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_polls_creator_id ON polls(creator_id);
CREATE INDEX IF NOT EXISTS idx_polls_is_public ON polls(is_public);
CREATE INDEX IF NOT EXISTS idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX IF NOT EXISTS idx_votes_poll_id ON votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for polls
CREATE POLICY "Anyone can view public polls" ON polls
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own polls" ON polls
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Authenticated users can create polls" ON polls
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own polls" ON polls
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own polls" ON polls
  FOR DELETE USING (auth.uid() = creator_id);

-- RLS Policies for poll_options
CREATE POLICY "Anyone can view options for public polls" ON poll_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM polls
      WHERE polls.id = poll_options.poll_id
      AND polls.is_public = true
    )
  );

CREATE POLICY "Users can view options for their own polls" ON poll_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM polls
      WHERE polls.id = poll_options.poll_id
      AND polls.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can create options for their own polls" ON poll_options
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM polls
      WHERE polls.id = poll_options.poll_id
      AND polls.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can update options for their own polls" ON poll_options
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM polls
      WHERE polls.id = poll_options.poll_id
      AND polls.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete options for their own polls" ON poll_options
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM polls
      WHERE polls.id = poll_options.poll_id
      AND polls.creator_id = auth.uid()
    )
  );

-- RLS Policies for votes
CREATE POLICY "Anyone can view votes for public polls" ON votes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM polls
      WHERE polls.id = votes.poll_id
      AND polls.is_public = true
    )
  );

CREATE POLICY "Users can view votes for their own polls" ON votes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM polls
      WHERE polls.id = votes.poll_id
      AND polls.creator_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert votes" ON votes
  FOR INSERT WITH CHECK (true);

-- RLS Policies for poll_analytics
CREATE POLICY "Anyone can view analytics for public polls" ON poll_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM polls
      WHERE polls.id = poll_analytics.poll_id
      AND polls.is_public = true
    )
  );

CREATE POLICY "Users can view analytics for their own polls" ON poll_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM polls
      WHERE polls.id = poll_analytics.poll_id
      AND polls.creator_id = auth.uid()
    )
  );

-- Function to update poll analytics
CREATE OR REPLACE FUNCTION update_poll_analytics(poll_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO poll_analytics (poll_id, total_votes, unique_voters, updated_at)
  VALUES (
    poll_id,
    (SELECT COUNT(*) FROM votes WHERE votes.poll_id = update_poll_analytics.poll_id),
    (SELECT COUNT(DISTINCT COALESCE(user_id::text, voter_ip)) FROM votes WHERE votes.poll_id = update_poll_analytics.poll_id),
    NOW()
  )
  ON CONFLICT (poll_id) DO UPDATE SET
    total_votes = EXCLUDED.total_votes,
    unique_voters = EXCLUDED.unique_voters,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to update vote counts on poll_options
CREATE OR REPLACE FUNCTION update_option_votes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE poll_options SET votes = votes + 1 WHERE id = NEW.option_id;
    PERFORM update_poll_analytics(NEW.poll_id);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE poll_options SET votes = votes - 1 WHERE id = OLD.option_id;
    PERFORM update_poll_analytics(OLD.poll_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update vote counts
CREATE TRIGGER update_option_votes_trigger
  AFTER INSERT OR DELETE ON votes
  FOR EACH ROW EXECUTE FUNCTION update_option_votes();

-- Function to handle user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
