import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    
    // Test simple : essayer de récupérer les spécialités
    const { data, error } = await supabase.from('specialties').select('*').limit(1)
    
    if (error) {
      return NextResponse.json({ 
        connected: false, 
        error: error.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      connected: true, 
      message: 'Connexion Supabase réussie',
      test_data: data 
    })
  } catch (error: any) {
    return NextResponse.json({ 
      connected: false, 
      error: error.message 
    }, { status: 500 })
  }
}
