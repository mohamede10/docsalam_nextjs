'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

function DoctorDetailContent() {
  const params = useParams()
  const router = useRouter()
  const [doctor, setDoctor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bookingForm, setBookingForm] = useState({
    date: '',
    time: '',
    notes: '',
    videoPlatform: 'GOOGLE_MEET',
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchDoctor()
  }, [params.id])

  const fetchDoctor = async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', params.id)
      .eq('role', 'DOCTOR')
      .single()

    if (data) {
      setDoctor(data)
      setLoading(false)
    }
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setSubmitting(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    const { error } = await supabase.from('appointments').insert({
      doctor_id: params.id,
      patient_id: user.id,
      date: bookingForm.date,
      time: bookingForm.time,
      notes: bookingForm.notes,
      status: 'PENDING',
      video_platform: bookingForm.videoPlatform,
      video_status: 'PENDING',
    })

    if (error) {
      setMessage('Erreur lors de la prise de rendez-vous: ' + error.message)
    } else {
      setMessage('Rendez-vous demandé avec succès ! Un lien de vidéoconférence sera généré.')
      setBookingForm({ date: '', time: '', notes: '', videoPlatform: 'GOOGLE_MEET' })
    }

    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Médecin non trouvé</h2>
          <Link href="/doctors" className="text-green-600 hover:text-green-700">
            Retour à la liste des médecins
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-3xl font-bold text-green-600">
              Doc<strong className="text-gray-600">Salam</strong>
            </Link>
            <div className="flex space-x-4">
              <Link href="/doctors" className="text-green-600 hover:text-green-700">
                Retour aux médecins
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start mb-6">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-user-md text-4xl text-green-600"></i>
                </div>
                <div className="ml-6">
                  <h1 className="text-3xl font-bold mb-2">
                    Dr. {doctor.first_name} {doctor.last_name}
                  </h1>
                  <p className="text-xl text-green-600 font-semibold">{doctor.specialty}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <i className="fas fa-hospital w-8 text-green-600"></i>
                  <span>{doctor.hospital || 'Non spécifié'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <i className="fas fa-map-marker-alt w-8 text-green-600"></i>
                  <span>{doctor.city}, {doctor.country}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <i className="fas fa-phone w-8 text-green-600"></i>
                  <span>{doctor.phone || 'Non spécifié'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <i className="fas fa-id-card w-8 text-green-600"></i>
                  <span>Licence: {doctor.medical_license}</span>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">À propos</h3>
                <p className="text-gray-600">
                  Dr. {doctor.first_name} {doctor.last_name} est un {doctor.specialty} expérimenté 
                  exerçant à {doctor.hospital || doctor.city}. Il est dédié à fournir des soins 
                  de qualité à ses patients.
                </p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Prendre Rendez-vous</h2>

              {message && (
                <div className={`mb-4 p-3 rounded ${
                  message.includes('succès') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure
                  </label>
                  <input
                    type="time"
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plateforme vidéo
                  </label>
                  <select
                    value={bookingForm.videoPlatform}
                    onChange={(e) => setBookingForm({ ...bookingForm, videoPlatform: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="GOOGLE_MEET">Google Meet</option>
                    <option value="ZOOM">Zoom</option>
                    <option value="TEAMS">Microsoft Teams</option>
                    <option value="JITSI">Jitsi Meet</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    <i className="fas fa-info-circle mr-1"></i>
                    Un lien de vidéoconférence sera généré automatiquement
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optionnel)
                  </label>
                  <textarea
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Décrivez votre problème..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Envoi...' : 'Confirmer le rendez-vous'}
                </button>
              </form>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <i className="fas fa-info-circle mr-2"></i>
                  Le médecin confirmera votre rendez-vous dans les plus brefs délais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DoctorDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          </div>
        </div>
      </div>
    }>
      <DoctorDetailContent />
    </Suspense>
  )
}
