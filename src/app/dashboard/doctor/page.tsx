'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function DoctorDashboard() {
  const [user, setUser] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) return

    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    setUser(userData)

    const { data: appts } = await supabase
      .from('appointments')
      .select('*, users!appointments_patient_id_fkey(*)')
      .eq('doctor_id', authUser.id)
      .order('date', { ascending: true })

    if (appts) setAppointments(appts)
    setLoading(false)
  }

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId)

    if (!error) {
      fetchUserData()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard Médecin</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {appointments.length}
                </div>
                <div className="text-gray-600">Total RDV</div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  {appointments.filter((a) => a.status === 'PENDING').length}
                </div>
                <div className="text-gray-600">En attente</div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {appointments.filter((a) => a.status === 'CONFIRMED').length}
                </div>
                <div className="text-gray-600">Confirmés</div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {appointments.filter((a) => a.status === 'COMPLETED').length}
                </div>
                <div className="text-gray-600">Complétés</div>
              </div>
            </div>

            {/* Appointments List */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Rendez-vous à venir</h2>

              {appointments.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  Aucun rendez-vous prévu.
                </p>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {appointment.users?.first_name} {appointment.users?.last_name}
                          </h3>
                          <p className="text-gray-600">
                            <i className="fas fa-phone mr-2"></i>
                            {appointment.users?.phone}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            <i className="fas fa-calendar mr-2"></i>
                            {new Date(appointment.date).toLocaleDateString('fr-FR')} à {appointment.time}
                          </p>
                          {appointment.notes && (
                            <p className="text-sm text-gray-600 mt-2">
                              <i className="fas fa-sticky-note mr-2"></i>
                              {appointment.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm text-center ${
                              appointment.status === 'CONFIRMED'
                                ? 'bg-green-100 text-green-800'
                                : appointment.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : appointment.status === 'CANCELLED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {appointment.status}
                          </span>
                          {appointment.status === 'PENDING' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => updateAppointmentStatus(appointment.id, 'CONFIRMED')}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                              >
                                Confirmer
                              </button>
                              <button
                                onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                              >
                                Refuser
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}
