# ALX Polly - Polling Application

A full-stack polling application built with Next.js 15, Supabase, and Shadcn/ui components.

## 🚀 Features

- **User Authentication** - Email/password authentication with Supabase
- **Poll Creation** - Create polls with multiple options and settings
- **Real-time Voting** - Live vote updates using Supabase real-time subscriptions
- **QR Code Sharing** - Generate QR codes for easy poll sharing
- **Analytics Dashboard** - View poll results and analytics
- **Responsive Design** - Mobile-first design with Tailwind CSS

## 📁 Project Structure

```
app/
├── (auth)/                 # Authentication routes (grouped)
│   ├── login/             # Login page
│   └── register/          # Registration page
├── (dashboard)/           # Protected dashboard routes (grouped)
│   ├── dashboard/         # Main dashboard
│   └── polls/            # Poll management
│       ├── create/       # Create new poll
│       ├── [id]/         # View poll details
│       │   ├── edit/     # Edit poll
│       │   └── results/  # Poll results
├── vote/[pollId]/         # Public voting interface
├── api/                   # API routes
│   ├── auth/             # Authentication endpoints
│   ├── polls/            # Poll CRUD operations
│   └── qr/               # QR code generation
├── layout.tsx            # Root layout
├── page.tsx              # Home page
└── middleware.ts         # Route protection middleware

components/
├── auth/                 # Authentication components
├── polls/                # Poll-related components
├── shared/               # Shared/common components
└── ui/                   # Shadcn/ui components

lib/
├── supabase/             # Supabase client configuration
├── validations/          # Zod validation schemas
└── utils/                # Utility functions

types/
└── index.ts              # TypeScript type definitions
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd alx-polly
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Fill in your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Supabase database**

   - Create tables using the SQL schema in the documentation
   - Enable Row Level Security (RLS)
   - Configure authentication settings

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

The application uses the following main tables:

- `profiles` - User profile information
- `polls` - Poll data and settings
- `poll_options` - Individual poll options
- `votes` - User votes
- `poll_analytics` - Poll statistics

## 🔐 Authentication Flow

1. Users can register with email/password
2. Email verification (optional)
3. Protected routes require authentication
4. Middleware handles route protection
5. Session management with Supabase

## 🎯 Key Features Implementation

### Poll Creation

- Dynamic option management
- Validation with Zod schemas
- Real-time preview

### Voting System

- Anonymous and authenticated voting
- Duplicate vote prevention
- Real-time result updates

### Analytics

- Vote counting and percentages
- User engagement metrics
- Export capabilities

## 🚀 Deployment

The app is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 📝 TODO

- [ ] Implement Supabase authentication
- [ ] Create database schema
- [ ] Add real-time subscriptions
- [ ] Implement QR code generation
- [ ] Add poll analytics
- [ ] Write tests
- [ ] Add email notifications
- [ ] Implement poll templates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
