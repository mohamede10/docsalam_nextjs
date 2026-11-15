'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function FormationsPage() {
  const [formations, setFormations] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFormation, setSelectedFormation] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchFormations()
    checkUser()
  }, [])

  const fetchFormations = async () => {
    const { data } = await supabase
      .from('formations')
      .select('*')
      .gte('end_date', new Date().toISOString())
      .order('start_date', { ascending: true })

    if (data) setFormations(data)
    setLoading(false)
  }

  const checkUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser) {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()
      setUser(userData)
    }
  }

  const handleRegister = async (formation: any) => {
    if (!user) {
      window.location.href = '/auth/login'
      return
    }

    setSelectedFormation(formation)
    setShowModal(true)
  }

  const confirmRegistration = async () => {
    if (!user || !selectedFormation) return

    const { error } = await supabase
      .from('formation_registrations')
      .insert({
        formation_id: selectedFormation.id,
        user_id: user.id,
        status: 'PENDING'
      })

    if (error) {
      alert('Erreur lors de l\'inscription: ' + error.message)
    } else {
      alert('Inscription réussie! Vous recevrez une confirmation par email.')
      setShowModal(false)
      setSelectedFormation(null)
    }
  }

  const checkIfRegistered = (formationId: string) => {
    return formations.find(f => f.id === formationId)?.registrations?.some(
      (reg: any) => reg.user_id === user?.id
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            <i className="fas fa-graduation-cap mr-3"></i>
            Formations Médicales
          </h1>
          <p className="text-xl">
            Développez vos compétences avec nos formations professionnelles
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : formations.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <i className="fas fa-book-open text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600">Aucune formation disponible pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formations.map((formation) => {
              const isRegistered = checkIfRegistered(formation.id)
              return (
                <div key={formation.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl text-blue-600">
                      <i className="fas fa-graduation-cap"></i>
                    </div>
                    {isRegistered && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        Inscrit
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold mb-2">{formation.title}</h3>

                  {formation.description && (
                    <p className="text-gray-600 mb-4">{formation.description}</p>
                  )}

                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <p>
                      <i className="fas fa-calendar-alt mr-2"></i>
                      Début: {new Date(formation.start_date).toLocaleDateString('fr-FR')}
                    </p>
                    {formation.end_date && (
                      <p>
                        <i className="fas fa-calendar-check mr-2"></i>
                        Fin: {new Date(formation.end_date).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                    <p className="text-lg font-semibold text-blue-600">
                      <i className="fas fa-euro-sign mr-2"></i>
                      {Number(formation.price).toFixed(2)} €
                    </p>
                  </div>

                  <button
                    onClick={() => handleRegister(formation)}
                    disabled={isRegistered}
                    className={`w-full py-2 rounded-lg font-semibold ${
                      isRegistered
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isRegistered ? 'Déjà inscrit' : 'S\'inscrire'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {showModal && selectedFormation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Confirmer l'inscription</h2>
            <div className="mb-6">
              <p className="text-gray-600 mb-2">
                <strong>Formation:</strong> {selectedFormation.title}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Prix:</strong> {Number(selectedFormation.price).toFixed(2)} €
              </p>
              <p className="text-gray-600">
                <strong>Dates:</strong> du {new Date(selectedFormation.start_date).toLocaleDateString('fr-FR')}
                {selectedFormation.end_date && ` au ${new Date(selectedFormation.end_date).toLocaleDateString('fr-FR')}`}
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedFormation(null)
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={confirmRegistration}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
