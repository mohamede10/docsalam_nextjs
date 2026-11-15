'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    country: '',
    city: '',
    specialty: '',
    hospital: '',
    medicalLicense: '',
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    checkUser()
  }, [])

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
    setFormData({
      firstName: userData.first_name || '',
      lastName: userData.last_name || '',
      phone: userData.phone || '',
      gender: userData.gender || '',
      country: userData.country || '',
      city: userData.city || '',
      specialty: userData.specialty || '',
      hospital: userData.hospital || '',
      medicalLicense: userData.medical_license || '',
    })
    setLoading(false)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    const updateData: any = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      gender: formData.gender,
      country: formData.country,
      city: formData.city,
    }

    if (user.role === 'DOCTOR') {
      updateData.specialty = formData.specialty
      updateData.hospital = formData.hospital
      updateData.medical_license = formData.medicalLicense
    }

    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)

    if (error) {
      setMessage('Erreur lors de la mise à jour: ' + error.message)
    } else {
      setMessage('Profil mis à jour avec succès!')
      setEditing(false)
      checkUser()
    }
  }

  if (loading) {
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
        <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>

        <div className="max-w-2xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mr-4">
                {user.first_name?.[0]}{user.last_name?.[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-gray-600">{user.email}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                  user.role === 'DOCTOR' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {user.role === 'DOCTOR' ? 'Médecin' : 'Patient'}
                </span>
              </div>
            </div>

            {user.role === 'DOCTOR' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Spécialité</p>
                  <p className="font-semibold">{user.specialty || 'Non renseigné'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Hôpital/Clinique</p>
                  <p className="font-semibold">{user.hospital || 'Non renseigné'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Licence médicale</p>
                  <p className="font-semibold">{user.medical_license || 'Non renseigné'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Statut</p>
                  <p className={`font-semibold ${user.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {user.is_active ? 'Actif' : 'En attente'}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => setEditing(!editing)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              <i className="fas fa-edit mr-2"></i>
              {editing ? 'Annuler' : 'Modifier le profil'}
            </button>
          </div>

          {/* Edit Form */}
          {editing && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-6">Modifier mes informations</h3>

              {message && (
                <div className={`mb-4 p-3 rounded ${
                  message.includes('succès') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner</option>
                    <option value="MALE">Masculin</option>
                    <option value="FEMALE">Féminin</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pays
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {user.role === 'DOCTOR' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Spécialité
                      </label>
                      <input
                        type="text"
                        value={formData.specialty}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hôpital/Clinique
                      </label>
                      <input
                        type="text"
                        value={formData.hospital}
                        onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Licence médicale
                      </label>
                      <input
                        type="text"
                        value={formData.medicalLicense}
                        onChange={(e) => setFormData({ ...formData, medicalLicense: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                >
                  Enregistrer les modifications
                </button>
              </form>
            </div>
          )}

          {/* Account Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Informations du compte</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Rôle:</span>
                <span className="font-medium">{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Membre depuis:</span>
                <span className="font-medium">
                  {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
