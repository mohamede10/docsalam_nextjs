import { supabase } from './supabase'

export async function signUp(email: string, password: string, userData: any) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) return { error }

  // Create user record in our database
  const { error: dbError } = await supabase
    .from('users')
    .insert({
      id: data.user?.id,
      email,
      password, // Note: In production, use Supabase Auth only
      ...userData,
    })

  if (dbError) return { error: dbError }

  return { data }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null

  // Get user details from our database
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return userData
}
