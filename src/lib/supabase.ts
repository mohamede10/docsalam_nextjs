import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password: string
          first_name: string
          last_name: string
          role: 'ADMIN' | 'DOCTOR' | 'PATIENT'
          phone: string | null
          gender: 'MALE' | 'FEMALE' | null
          country: string | null
          city: string | null
          specialty: string | null
          hospital: string | null
          medical_license: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          first_name: string
          last_name: string
          role?: 'ADMIN' | 'DOCTOR' | 'PATIENT'
          phone?: string | null
          gender?: 'MALE' | 'FEMALE' | null
          country?: string | null
          city?: string | null
          specialty?: string | null
          hospital?: string | null
          medical_license?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          first_name?: string
          last_name?: string
          role?: 'ADMIN' | 'DOCTOR' | 'PATIENT'
          phone?: string | null
          gender?: 'MALE' | 'FEMALE' | null
          country?: string | null
          city?: string | null
          specialty?: string | null
          hospital?: string | null
          medical_license?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          doctor_id: string
          patient_id: string
          date: string
          time: string
          status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'
          notes: string | null
          video_link: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          doctor_id: string
          patient_id: string
          date: string
          time: string
          status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'
          notes?: string | null
          video_link?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          doctor_id?: string
          patient_id?: string
          date?: string
          time?: string
          status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'
          notes?: string | null
          video_link?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
