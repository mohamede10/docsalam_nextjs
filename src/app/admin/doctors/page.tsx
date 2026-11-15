'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'DOCTOR')
      .order('created_at', { ascending: false })

    if (data) setDoctors(data)
    setLoading(false)
  }

  const toggleDoctorStatus = async (doctorId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('users')
      .update({ is_active: !currentStatus })
      .eq('id', doctorId)

    if (!error) {
      fetchDoctors()
    }
  }

  const deleteDoctor = async (doctorId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce médecin?')) return

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', doctorId)

    if (!error) {
      fetchDoctors()
    } else {
      alert('Erreur lors de la suppression: ' + error.message)
    }
  }

  const filteredDoctors = doctors.filter(doctor => {
    if (filterStatus === 'active' && !doctor.is_active) return false
    if (filterStatus === 'inactive' && doctor.is_active) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={{ role: 'ADMIN', first_name: 'Admin' }} />

      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-8">Gestion des Médecins</h1>

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
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {doctors.filter(d => d.is_active).length}
            </div>
            <div className="text-gray-600">Médecins actifs</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl font-bold text-yellow-600 mb-2">
              {doctors.filter(d => !d.is_active).length}
            </div>
            <div className="text-gray-600">En attente</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {doctors.length}
            </div>
            <div className="text-gray-600">Total médecins</div>
          </div>
        </div>

        {/* Doctors List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <i className="fas fa-user-md text-4xl mb-4"></i>
              <p>Aucun médecin trouvé</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {doctor.first_name?.[0]}{doctor.last_name?.[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Dr. {doctor.first_name} {doctor.last_name}
                          </h3>
                          <p className="text-sm text-gray-500">{doctor.email}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <p>
                          <i className="fas fa-stethoscope mr-2"></i>
                          {doctor.specialty || 'Non renseigné'}
                        </p>
                        <p>
                          <i className="fas fa-hospital mr-2"></i>
                          {doctor.hospital || 'Non renseigné'}
                        </p>
                        <p>
                          <i className="fas fa-phone mr-2"></i>
                          {doctor.phone || 'Non renseigné'}
                        </p>
                        <p>
                          <i className="fas fa-map-marker-alt mr-2"></i>
                          {doctor.city}, {doctor.country}
                        </p>
                        <p>
                          <i className="fas fa-id-card mr-2"></i>
                          {doctor.medical_license || 'Non renseigné'}
                        </p>
                        <p>
                          <i className="fas fa-calendar mr-2"></i>
                          Inscrit le {new Date(doctor.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <span className={`px-3 py-1 rounded-full text-sm text-center ${
                        doctor.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {doctor.is_active ? 'Actif' : 'En attente'}
                      </span>
                      <button
                        onClick={() => toggleDoctorStatus(doctor.id, doctor.is_active)}
                        className={`px-3 py-1 rounded text-sm ${
                          doctor.is_active
                            ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {doctor.is_active ? 'Désactiver' : 'Activer'}
                      </button>
                      <button
                        onClick={() => deleteDoctor(doctor.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
