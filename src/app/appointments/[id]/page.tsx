'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

function AppointmentDetailContent() {
  const params = useParams()
  const router = useRouter()
  const [appointment, setAppointment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    fetchAppointment()
  }, [params.id])

  const fetchAppointment = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    const { data } = await supabase
      .from('appointments')
      .select(`
        *,
        doctor:users!appointments_doctor_id_fkey(
          id,
          first_name,
          last_name,
          specialty,
          hospital,
          phone
        ),
        patient:users!appointments_patient_id_fkey(
          id,
          first_name,
          last_name,
          phone
        )
      `)
      .eq('id', params.id)
      .single()

    if (data) {
      setAppointment(data)
      setLoading(false)
    }
  }

  const handleJoinVideo = async () => {
    setJoining(true)
    // Update video status to ACTIVE
    await supabase
      .from('appointments')
      .update({ video_status: 'ACTIVE' })
      .eq('id', params.id)

    // Open video link in new tab
    if (appointment.video_link) {
      window.open(appointment.video_link, '_blank')
    }
    setJoining(false)
  }

  const handleEndVideo = async () => {
    await supabase
      .from('appointments')
      .update({ video_status: 'ENDED' })
      .eq('id', params.id)
    
    setAppointment({ ...appointment, video_status: 'ENDED' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-12">
            <p className="text-gray-600">Rendez-vous non trouvé</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'GOOGLE_MEET':
        return 'fab fa-google'
      case 'ZOOM':
        return 'fas fa-video'
      case 'TEAMS':
        return 'fab fa-microsoft'
      case 'JITSI':
        return 'fas fa-video'
      default:
        return 'fas fa-video'
    }
  }

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'GOOGLE_MEET':
        return 'Google Meet'
      case 'ZOOM':
        return 'Zoom'
      case 'TEAMS':
        return 'Microsoft Teams'
      case 'JITSI':
        return 'Jitsi Meet'
      default:
        return platform
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Détails du Rendez-vous</h1>
                <p className="text-gray-600">Référence: #{appointment.id.slice(0, 8)}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                appointment.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {appointment.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 mb-2">
                  <i className="fas fa-calendar mr-2 text-green-600"></i>
                  <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString('fr-FR')}
                </p>
                <p className="text-gray-600 mb-2">
                  <i className="fas fa-clock mr-2 text-green-600"></i>
                  <strong>Heure:</strong> {appointment.time}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-2">
                  <i className="fas fa-user-md mr-2 text-blue-600"></i>
                  <strong>Médecin:</strong> Dr. {appointment.doctor?.first_name} {appointment.doctor?.last_name}
                </p>
                <p className="text-gray-600 mb-2">
                  <i className="fas fa-user mr-2 text-purple-600"></i>
                  <strong>Patient:</strong> {appointment.patient?.first_name} {appointment.patient?.last_name}
                </p>
              </div>
            </div>

            {appointment.notes && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">
                  <strong>Notes:</strong> {appointment.notes}
                </p>
              </div>
            )}
          </div>

          {/* Video Conference Section */}
          {appointment.video_link && (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <i className={`${getPlatformIcon(appointment.video_platform)} text-4xl mr-4`}></i>
                  <div>
                    <h2 className="text-2xl font-bold">Vidéoconférence</h2>
                    <p className="text-blue-100">{getPlatformName(appointment.video_platform)}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  appointment.video_status === 'ACTIVE' ? 'bg-green-400 text-green-900' :
                  appointment.video_status === 'ENDED' ? 'bg-gray-400 text-gray-900' :
                  'bg-yellow-400 text-yellow-900'
                }`}>
                  {appointment.video_status || 'PENDING'}
                </span>
              </div>

              <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
                <p className="text-sm mb-2">Lien de la vidéoconférence:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white bg-opacity-20 px-3 py-2 rounded text-sm">
                    {appointment.video_link}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(appointment.video_link)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded transition"
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                {appointment.video_status !== 'ENDED' && (
                  <button
                    onClick={handleJoinVideo}
                    disabled={joining}
                    className="flex-1 bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition disabled:opacity-50"
                  >
                    {joining ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Connexion...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-video mr-2"></i>
                        Rejoindre la réunion
                      </>
                    )}
                  </button>
                )}
                {appointment.video_status === 'ACTIVE' && (
                  <button
                    onClick={handleEndVideo}
                    className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
                  >
                    <i className="fas fa-stop mr-2"></i>
                    Terminer la réunion
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {appointment.status === 'PENDING' && (
                <button
                  onClick={async () => {
                    await supabase.from('appointments').update({ status: 'CONFIRMED' }).eq('id', appointment.id)
                    setAppointment({ ...appointment, status: 'CONFIRMED' })
                  }}
                  className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                >
                  <i className="fas fa-check mr-2"></i>
                  Confirmer
                </button>
              )}
              {appointment.status !== 'CANCELLED' && (
                <button
                  onClick={async () => {
                    await supabase.from('appointments').update({ status: 'CANCELLED' }).eq('id', appointment.id)
                    setAppointment({ ...appointment, status: 'CANCELLED' })
                  }}
                  className="bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-semibold"
                >
                  <i className="fas fa-times mr-2"></i>
                  Annuler
                </button>
              )}
              <button
                onClick={() => router.push('/messages')}
                className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
              >
                <i className="fas fa-comment mr-2"></i>
                Contacter
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function AppointmentDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <AppointmentDetailContent />
    </Suspense>
  )
}
