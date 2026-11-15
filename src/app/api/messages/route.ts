import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')

    let query = supabase.from('messages').select('*')

    if (conversationId) {
      query = query.or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${conversationId},receiver_id.eq.${conversationId}`)
    } else {
      query = query.or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    }

    const { data, error } = await query.order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Filter to only show messages between user and conversation partner
    const filtered = conversationId 
      ? data.filter((msg: any) =>
          (msg.sender_id === user.id && msg.receiver_id === conversationId) ||
          (msg.sender_id === conversationId && msg.receiver_id === user.id)
        )
      : data

    return NextResponse.json({ data: filtered })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { receiverId, content } = body

    if (!receiverId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: receiverId,
      content,
      is_read: false
    }).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
