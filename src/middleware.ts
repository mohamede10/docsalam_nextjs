import { createClient } from '@/utils/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes
  const protectedPaths = ['/dashboard', '/profile', '/payments', '/consultations', '/messages', '/notifications']
  const adminPaths = ['/admin']
  const doctorPaths = ['/dashboard/doctor']
  const patientPaths = ['/dashboard/patient']

  const isProtectedRoute = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))
  const isAdminRoute = adminPaths.some(path => request.nextUrl.pathname.startsWith(path))
  const isDoctorRoute = doctorPaths.some(path => request.nextUrl.pathname.startsWith(path))
  const isPatientRoute = patientPaths.some(path => request.nextUrl.pathname.startsWith(path))

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (isAdminRoute && user) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  if (isDoctorRoute && user) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData?.role !== 'DOCTOR') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  if (isPatientRoute && user) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData?.role !== 'PATIENT') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
