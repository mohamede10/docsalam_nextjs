'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    const { data } = await supabase
      .from('appointments')
      .select('*, users!appointments_patient_id_fkey(*), users!appointments_doctor_id_fkey(*)')
      .order('date', { ascending: false })

    if (data) setAppointments(data)
    setLoading(false)
  }

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId)

    if (!error) {
      fetchAppointments()
    }
  }

  const deleteAppointment = async (appointmentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous?')) return

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId)

    if (!error) {
      fetchAppointments()
    } else {
      alert('Erreur lors de la suppression: ' + error.message)
    }
  }

  const filteredAppointments = appointments.filter(apt => {
    if (filterStatus && apt.status !== filterStatus) return false
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800'
      case 'NO_SHOW': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'Confirmé'
      case 'PENDING': return 'En attente'
      case 'CANCELLED': return 'Annulé'
      case 'COMPLETED': return 'Complété'
      case 'NO_SHOW': return 'Absent'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={{ role: 'ADMIN', first_name: 'Admin' }} />

      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-8">Gestion des Rendez-vous</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filtrer par statut:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Tous</option>
              <option value="PENDING">En attente</option>
              <option value="CONFIRMED">Confirmés</option>
              <option value="COMPLETED">Complétés</option>
              <option value="CANCELLED">Annulés</option>
              <option value="NO_SHOW">Absents</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {appointments.length}
            </div>
            <div className="text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl font-bold text-yellow-600 mb-2">
              {appointments.filter(a => a.status === 'PENDING').length}
            </div>
            <div className="text-gray-600">En attente</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {appointments.filter(a => a.status === 'CONFIRMED').length}
            </div>
            <div className="text-gray-600">Confirmés</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {appointments.filter(a => a.status === 'COMPLETED').length}
            </div>
            <div className="text-gray-600">Complétés</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl font-bold text-red-600 mb-2">
              {appointments.filter(a => a.status === 'CANCELLED').length}
            </div>
            <div className="text-gray-600">Annulés</div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <i className="fas fa-calendar text-4xl mb-4"></i>
              <p>Aucun rendez-vous trouvé</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => {
                const patient = appointment.users?.find((u: any) => u.role === 'PATIENT')
                const doctor = appointment.users?.find((u: any) => u.role === 'DOCTOR')
                
                return (
                  <div
                    key={appointment.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Patient</p>
                            <p className="font-semibold">
                              {patient?.first_name} {patient?.last_name}
                            </p>
                            <p className="text-sm text-gray-600">{patient?.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Médecin</p>
                            <p className="font-semibold">
                              Dr. {doctor?.first_name} {doctor?.last_name}
                            </p>
                            <p className="text-sm text-gray-600">{doctor?.specialty}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <p>
                            <i className="fas fa-calendar-alt mr-2"></i>
                            {new Date(appointment.date).toLocaleDateString('fr-FR')}
                          </p>
                          <p>
                            <i className="fas fa-clock mr-2"></i>
                            {appointment.time}
                          </p>
                          <p>
                            <i className="fas fa-hashtag mr-2"></i>
                            Réf: {appointment.id.slice(0, 8)}
                          </p>
                        </div>

                        {appointment.notes && (
                          <p className="text-sm text-gray-600 mt-2">
                            <i className="fas fa-sticky-note mr-2"></i>
                            {appointment.notes}
                          </p>
                        )}

                        {appointment.video_link && (
                          <a
                            href={appointment.video_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green-600 hover:text-green-700 mt-2 inline-block"
                          >
                            <i className="fas fa-video mr-2"></i>
                            Lien vidéo
                          </a>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <span className={`px-3 py-1 rounded-full text-sm text-center ${getStatusColor(appointment.status)}`}>
                          {getStatusLabel(appointment.status)}
                        </span>
                        <select
                          value={appointment.status}
                          onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value)}
                          className="px-3 py-1 rounded text-sm border border-gray-300"
                        >
                          <option value="PENDING">En attente</option>
                          <option value="CONFIRMED">Confirmé</option>
                          <option value="COMPLETED">Complété</option>
                          <option value="CANCELLED">Annulé</option>
                          <option value="NO_SHOW">Absent</option>
                        </select>
                        <button
                          onClick={() => deleteAppointment(appointment.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
