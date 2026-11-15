'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'PATIENT')
      .order('created_at', { ascending: false })

    if (data) setPatients(data)
    setLoading(false)
  }

  const deletePatient = async (patientId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce patient?')) return

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', patientId)

    if (!error) {
      fetchPatients()
    } else {
      alert('Erreur lors de la suppression: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={{ role: 'ADMIN', first_name: 'Admin' }} />

      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-8">Gestion des Patients</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {patients.length}
            </div>
            <div className="text-gray-600">Total patients</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {patients.filter(p => p.gender === 'MALE').length}
            </div>
            <div className="text-gray-600">Hommes</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {patients.filter(p => p.gender === 'FEMALE').length}
            </div>
            <div className="text-gray-600">Femmes</div>
          </div>
        </div>

        {/* Patients List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <i className="fas fa-users text-4xl mb-4"></i>
              <p>Aucun patient trouvé</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {patient.first_name?.[0]}{patient.last_name?.[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {patient.first_name} {patient.last_name}
                          </h3>
                          <p className="text-sm text-gray-500">{patient.email}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <p>
                          <i className="fas fa-venus-mars mr-2"></i>
                          {patient.gender === 'MALE' ? 'Homme' : patient.gender === 'FEMALE' ? 'Femme' : 'Non renseigné'}
                        </p>
                        <p>
                          <i className="fas fa-phone mr-2"></i>
                          {patient.phone || 'Non renseigné'}
                        </p>
                        <p>
                          <i className="fas fa-map-marker-alt mr-2"></i>
                          {patient.city}, {patient.country}
                        </p>
                        <p>
                          <i className="fas fa-calendar mr-2"></i>
                          Inscrit le {new Date(patient.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <span className="px-3 py-1 rounded-full text-sm text-center bg-green-100 text-green-800">
                        Actif
                      </span>
                      <button
                        onClick={() => deletePatient(patient.id)}
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
