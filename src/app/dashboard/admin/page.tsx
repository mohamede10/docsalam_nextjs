'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    doctors: 0,
    patients: 0,
    appointments: 0,
  })
  const [pendingDoctors, setPendingDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchPendingDoctors()
  }, [])

  const fetchStats = async () => {
    const [usersCount, doctorsCount, patientsCount, appointmentsCount] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'DOCTOR'),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'PATIENT'),
      supabase.from('appointments').select('*', { count: 'exact', head: true }),
    ])

    setStats({
      users: usersCount.count || 0,
      doctors: doctorsCount.count || 0,
      patients: patientsCount.count || 0,
      appointments: appointmentsCount.count || 0,
    })
    setLoading(false)
  }

  const fetchPendingDoctors = async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'DOCTOR')
      .eq('is_active', false)

    if (data) setPendingDoctors(data)
  }

  const approveDoctor = async (userId: string) => {
    const { error } = await supabase
      .from('users')
      .update({ is_active: true })
      .eq('id', userId)

    if (!error) {
      fetchPendingDoctors()
      fetchStats()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={{ role: 'ADMIN', first_name: 'Admin' }} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stats.users}</div>
                <div className="text-gray-600">Total Utilisateurs</div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-4xl font-bold text-green-600 mb-2">{stats.doctors}</div>
                <div className="text-gray-600">Médecins</div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-4xl font-bold text-purple-600 mb-2">{stats.patients}</div>
                <div className="text-gray-600">Patients</div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-4xl font-bold text-orange-600 mb-2">{stats.appointments}</div>
                <div className="text-gray-600">Rendez-vous</div>
              </div>
            </div>

            {/* Pending Doctors */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">
                Médecins en attente de validation ({pendingDoctors.length})
              </h2>

              {pendingDoctors.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  Aucun médecin en attente de validation.
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">
                            Dr. {doctor.first_name} {doctor.last_name}
                          </h3>
                          <p className="text-gray-600">{doctor.specialty}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            <i className="fas fa-hospital mr-2"></i>
                            {doctor.hospital}
                          </p>
                          <p className="text-sm text-gray-500">
                            <i className="fas fa-id-card mr-2"></i>
                            Licence: {doctor.medical_license}
                          </p>
                          <p className="text-sm text-gray-500">
                            <i className="fas fa-phone mr-2"></i>
                            {doctor.phone}
                          </p>
                          <p className="text-sm text-gray-500">
                            <i className="fas fa-map-marker-alt mr-2"></i>
                            {doctor.city}, {doctor.country}
                          </p>
                        </div>
                        <button
                          onClick={() => approveDoctor(doctor.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          Approuver
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/admin/doctors"
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="text-center">
                  <i className="fas fa-user-md text-4xl text-green-600 mb-4"></i>
                  <h3 className="text-xl font-semibold">Gérer les Médecins</h3>
                </div>
              </Link>
              <Link
                href="/admin/patients"
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="text-center">
                  <i className="fas fa-users text-4xl text-blue-600 mb-4"></i>
                  <h3 className="text-xl font-semibold">Gérer les Patients</h3>
                </div>
              </Link>
              <Link
                href="/admin/appointments"
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="text-center">
                  <i className="fas fa-calendar text-4xl text-purple-600 mb-4"></i>
                  <h3 className="text-xl font-semibold">Tous les Rendez-vous</h3>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}
