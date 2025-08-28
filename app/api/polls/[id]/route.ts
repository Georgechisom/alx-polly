import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const pollId = params.id

    // TODO: Implement poll fetching with options
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select(`
        *,
        poll_options (*)
      `)
      .eq('id', pollId)
      .single()

    if (pollError) {
      return NextResponse.json({ error: pollError.message }, { status: 404 })
    }

    return NextResponse.json({ poll })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pollId = params.id
    const body = await request.json()

    // Check if user owns the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('creator_id')
      .eq('id', pollId)
      .single()

    if (pollError || poll.creator_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // TODO: Implement poll update logic
    const { data: updatedPoll, error: updateError } = await supabase
      .from('polls')
      .update({
        title: body.title,
        description: body.description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pollId)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ poll: updatedPoll })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pollId = params.id

    // Check if user owns the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('creator_id')
      .eq('id', pollId)
      .single()

    if (pollError || poll.creator_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // TODO: Implement poll deletion logic
    const { error: deleteError } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Poll deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
