'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

function DoctorsContent() {
  const searchParams = useSearchParams()
  const [doctors, setDoctors] = useState<any[]>([])
  const [specialties, setSpecialties] = useState<any[]>([])
  const [countries, setCountries] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filter states
  const [filterSpecialty, setFilterSpecialty] = useState(searchParams.get('specialty') || '')
  const [filterCountry, setFilterCountry] = useState(searchParams.get('country') || '')
  const [filterCity, setFilterCity] = useState(searchParams.get('city') || '')
  const [filterActive, setFilterActive] = useState(true)

  useEffect(() => {
    fetchFilters()
    fetchDoctors()
  }, [])

  useEffect(() => {
    if (filterCountry) {
      fetchCities(filterCountry)
    }
  }, [filterCountry])

  const fetchFilters = async () => {
    const [specialtiesData, citiesData] = await Promise.all([
      supabase.from('specialties').select('*'),
      supabase.from('cities').select('country, city')
    ])

    if (specialtiesData.data) setSpecialties(specialtiesData.data)
    
    if (citiesData.data) {
      const uniqueCountries = [...new Set(citiesData.data.map((c: any) => c.country))]
      setCountries(uniqueCountries)
    }
  }

  const fetchCities = async (country: string) => {
    const { data } = await supabase
      .from('cities')
      .select('city')
      .eq('country', country)
      .order('city')

    if (data) setCities(data.map((c: any) => c.city))
  }

  const fetchDoctors = async () => {
    setLoading(true)
    
    let query = supabase
      .from('users')
      .select('*')
      .eq('role', 'DOCTOR')

    if (filterSpecialty) query = query.ilike('specialty', `%${filterSpecialty}%`)
    if (filterCountry) query = query.ilike('country', `%${filterCountry}%`)
    if (filterCity) query = query.ilike('city', `%${filterCity}%`)
    if (filterActive) query = query.eq('is_active', true)

    const { data } = await query
    if (data) setDoctors(data)
    setLoading(false)
  }

  const applyFilters = () => {
    fetchDoctors()
  }

  const resetFilters = () => {
    setFilterSpecialty('')
    setFilterCountry('')
    setFilterCity('')
    setFilterActive(true)
    fetchDoctors()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl text-black font-bold mb-8">Nos Médecins</h1>

        {/* Advanced Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-black mb-4">Filtres avancés</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spécialité
              </label>
              <select
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
                className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Toutes les spécialités</option>
                {specialties.map((spec) => (
                  <option key={spec.id} value={spec.name}>
                    {spec.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pays
              </label>
              <select
                value={filterCountry}
                onChange={(e) => {
                  setFilterCountry(e.target.value)
                  setFilterCity('')
                }}
                className="w-full text-black border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Tous les pays</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville
              </label>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full text-black border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={!filterCountry}
              >
                <option value="">Toutes les villes</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={filterActive ? 'active' : 'all'}
                onChange={(e) => setFilterActive(e.target.value === 'active')}
                className="w-full text-black border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="active">Actifs uniquement</option>
                <option value="all">Tous</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-4 mt-4">
            <button
              onClick={applyFilters}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              <i className="fas fa-search mr-2"></i>
              Rechercher
            </button>
            <button
              onClick={resetFilters}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              <i className="fas fa-times mr-2"></i>
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 text-gray-600">
          {loading ? (
            <span>Recherche en cours...</span>
          ) : (
            <span>{doctors.length} médecin(s) trouvé(s)</span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600">Aucun médecin trouvé pour votre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-user-md text-2xl text-green-600"></i>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold">
                          Dr. {doctor.first_name} {doctor.last_name}
                        </h3>
                        <p className="text-gray-600">{doctor.specialty || 'Non spécifié'}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        doctor.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {doctor.is_active ? 'Actif' : 'En attente'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>
                    <i className="fas fa-hospital mr-2"></i>
                    {doctor.hospital || 'Non spécifié'}
                  </p>
                  <p>
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    {doctor.city}, {doctor.country}
                  </p>
                  <p>
                    <i className="fas fa-phone mr-2"></i>
                    {doctor.phone || 'Non spécifié'}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Link
                    href={`/doctors/${doctor.id}`}
                    className="flex-1 bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700"
                  >
                    <i className="fas fa-calendar-plus mr-2"></i>
                    Prendre RDV
                  </Link>
                  <Link
                    href={`/messages`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <i className="fas fa-comment"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default function DoctorsPage() {
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
      <DoctorsContent />
    </Suspense>
  )
}
