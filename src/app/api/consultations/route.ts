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
    const patientId = searchParams.get('patientId')
    const doctorId = searchParams.get('doctorId')

    let query = supabase.from('consultations').select('*')

    if (patientId) {
      query = query.eq('patient_id', patientId)
    }

    if (doctorId) {
      query = query.eq('doctor_id', doctorId)
    }

    // If no filters, only return consultations for the current user
    if (!patientId && !doctorId) {
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (userData?.role === 'DOCTOR') {
        query = query.eq('doctor_id', user.id)
      } else {
        query = query.eq('patient_id', user.id)
      }
    }

    const { data, error } = await query.order('date', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Fetch related user data
    const consultationsWithUsers = await Promise.all(
      data.map(async (consultation) => {
        const [doctor, patient] = await Promise.all([
          supabase.from('users').select('*').eq('id', consultation.doctor_id).single(),
          supabase.from('users').select('*').eq('id', consultation.patient_id).single()
        ])

        return {
          ...consultation,
          doctor: doctor.data,
          patient: patient.data,
        }
      })
    )

    return NextResponse.json({ data: consultationsWithUsers })
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

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData?.role !== 'DOCTOR') {
      return NextResponse.json({ error: 'Forbidden - Only doctors can create consultations' }, { status: 403 })
    }

    const body = await request.json()
    const { patientId, notes, diagnosis, prescriptions } = body

    if (!patientId) {
      return NextResponse.json({ error: 'Missing patient ID' }, { status: 400 })
    }

    const { data, error } = await supabase.from('consultations').insert({
      patient_id: patientId,
      doctor_id: user.id,
      date: new Date().toISOString(),
      notes,
      diagnosis,
      prescriptions
    }).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
