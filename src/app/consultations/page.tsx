'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function ConsultationsPage() {
  const [user, setUser] = useState<any>(null)
  const [consultations, setConsultations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null)
  const [formData, setFormData] = useState({
    notes: '',
    diagnosis: '',
    prescriptions: '',
  })

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchConsultations()
    }
  }, [user])

  const checkUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      window.location.href = '/auth/login'
      return
    }

    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    setUser(userData)
  }

  const fetchConsultations = async () => {
    let query = supabase.from('consultations').select('*')

    if (user.role === 'DOCTOR') {
      query = query.eq('doctor_id', user.id)
    } else {
      query = query.eq('patient_id', user.id)
    }

    const { data } = await query.order('date', { ascending: false })

    if (data) {
      // Fetch related user data
      const consultationsWithUsers = await Promise.all(
        data.map(async (consultation) => {
          const { data: doctor } = await supabase
            .from('users')
            .select('*')
            .eq('id', consultation.doctor_id)
            .single()

          const { data: patient } = await supabase
            .from('users')
            .select('*')
            .eq('id', consultation.patient_id)
            .single()

          return {
            ...consultation,
            doctor,
            patient,
          }
        })
      )

      setConsultations(consultationsWithUsers)
    }
    setLoading(false)
  }

  const openCreateModal = (appointment?: any) => {
    if (user.role !== 'DOCTOR') {
      alert('Seuls les médecins peuvent créer des consultations')
      return
    }

    setSelectedConsultation(appointment)
    setFormData({
      notes: appointment?.notes || '',
      diagnosis: '',
      prescriptions: '',
    })
    setShowModal(true)
  }

  const saveConsultation = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedConsultation) {
      // Create new consultation
      const { error } = await supabase.from('consultations').insert({
        patient_id: selectedConsultation?.patient_id,
        doctor_id: user.id,
        date: new Date().toISOString(),
        notes: formData.notes,
        diagnosis: formData.diagnosis,
        prescriptions: formData.prescriptions,
      })

      if (error) {
        alert('Erreur lors de la création: ' + error.message)
      } else {
        alert('Consultation créée avec succès!')
        setShowModal(false)
        fetchConsultations()
      }
    } else {
      // Update existing consultation
      const { error } = await supabase
        .from('consultations')
        .update({
          notes: formData.notes,
          diagnosis: formData.diagnosis,
          prescriptions: formData.prescriptions,
        })
        .eq('id', selectedConsultation.id)

      if (error) {
        alert('Erreur lors de la mise à jour: ' + error.message)
      } else {
        alert('Consultation mise à jour avec succès!')
        setShowModal(false)
        fetchConsultations()
      }
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {user.role === 'DOCTOR' ? 'Mes Consultations' : 'Historique des Consultations'}
          </h1>
          {user.role === 'DOCTOR' && (
            <button
              onClick={() => openCreateModal()}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              <i className="fas fa-plus mr-2"></i>
              Nouvelle Consultation
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : consultations.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <i className="fas fa-file-medical text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600">Aucune consultation enregistrée</p>
          </div>
        ) : (
          <div className="space-y-6">
            {consultations.map((consultation) => (
              <div
                key={consultation.id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {user.role === 'DOCTOR' ? (
                        <>
                          Patient: {consultation.patient?.first_name} {consultation.patient?.last_name}
                        </>
                      ) : (
                        <>
                          Dr. {consultation.doctor?.first_name} {consultation.doctor?.last_name}
                        </>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500">
                      <i className="fas fa-calendar-alt mr-2"></i>
                      {new Date(consultation.date).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  {user.role === 'DOCTOR' && (
                    <button
                      onClick={() => {
                        setSelectedConsultation(consultation)
                        setFormData({
                          notes: consultation.notes || '',
                          diagnosis: consultation.diagnosis || '',
                          prescriptions: consultation.prescriptions || '',
                        })
                        setShowModal(true)
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <i className="fas fa-edit mr-2"></i>
                      Modifier
                    </button>
                  )}
                </div>

                {consultation.diagnosis && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      <i className="fas fa-stethoscope mr-2"></i>
                      Diagnostic
                    </h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded">{consultation.diagnosis}</p>
                  </div>
                )}

                {consultation.prescriptions && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      <i className="fas fa-prescription mr-2"></i>
                      Prescriptions
                    </h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded whitespace-pre-line">
                      {consultation.prescriptions}
                    </p>
                  </div>
                )}

                {consultation.notes && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      <i className="fas fa-sticky-note mr-2"></i>
                      Notes
                    </h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded">{consultation.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {selectedConsultation?.id ? 'Modifier la Consultation' : 'Nouvelle Consultation'}
            </h2>

            <form onSubmit={saveConsultation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnostic
                </label>
                <textarea
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Décrivez le diagnostic..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prescriptions
                </label>
                <textarea
                  value={formData.prescriptions}
                  onChange={(e) => setFormData({ ...formData, prescriptions: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={5}
                  placeholder="Listez les médicaments et dosages..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Notes supplémentaires..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setSelectedConsultation(null)
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
