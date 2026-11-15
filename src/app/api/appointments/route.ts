import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Fonction pour générer un lien Google Meet
function generateGoogleMeetLink(): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  return `https://meet.google.com/${randomString}-${timestamp}`
}

// Fonction pour générer un lien Zoom (nécessiterait une clé API Zoom)
function generateZoomLink(): string {
  return `https://zoom.us/j/${Math.random().toString(36).substring(2, 11)}`
}

export async function POST(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { doctorId, date, time, notes, videoPlatform = 'GOOGLE_MEET' } = body

    // Generate reference
    const reference = `RDV-${Date.now()}`

    // Generate video link based on platform
    let videoLink: string
    switch (videoPlatform) {
      case 'GOOGLE_MEET':
        videoLink = generateGoogleMeetLink()
        break
      case 'ZOOM':
        videoLink = generateZoomLink()
        break
      default:
        videoLink = generateGoogleMeetLink()
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        doctor_id: doctorId,
        patient_id: user.id,
        date,
        time,
        notes,
        status: 'PENDING',
        video_link: videoLink,
        video_platform: videoPlatform,
        video_status: 'PENDING',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const doctorId = searchParams.get('doctorId')
    const patientId = searchParams.get('patientId')

    let query = supabase.from('appointments').select('*')

    if (doctorId) query = query.eq('doctor_id', doctorId)
    if (patientId) query = query.eq('patient_id', patientId)

    const { data, error } = await query.order('date', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { id, status, videoStatus } = body

    const updateData: any = {}
    if (status) updateData.status = status
    if (videoStatus) updateData.video_status = videoStatus

    const { data, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
