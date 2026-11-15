import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { formationId } = body

    if (!formationId) {
      return NextResponse.json({ error: 'Missing formation ID' }, { status: 400 })
    }

    // Check if already registered
    const { data: existing } = await supabase
      .from('formation_registrations')
      .select('*')
      .eq('formation_id', formationId)
      .eq('user_id', user.id)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Already registered' }, { status: 400 })
    }

    const { data, error } = await supabase.from('formation_registrations').insert({
      formation_id: formationId,
      user_id: user.id,
      status: 'PENDING'
    }).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
