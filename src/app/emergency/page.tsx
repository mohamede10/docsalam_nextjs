'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function EmergencyPage() {
  const [services, setServices] = useState<any[]>([])
  const [filterType, setFilterType] = useState('')
  const [filterCountry, setFilterCountry] = useState('')
  const [countries, setCountries] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
    fetchCountries()
  }, [])

  const fetchServices = async () => {
    const { data } = await supabase
      .from('emergency_services')
      .select('*')
      .eq('status', 'OPEN')
      .order('type')

    if (data) setServices(data)
    setLoading(false)
  }

  const fetchCountries = async () => {
    const { data } = await supabase
      .from('emergency_services')
      .select('location')
      .not('location', 'is', null)

    if (data) {
      const uniqueCountries = [...new Set(data.map((s: any) => s.location?.split(',')[0]?.trim()))]
      setCountries(uniqueCountries.filter(Boolean))
    }
  }

  const filteredServices = services.filter(service => {
    if (filterType && service.type !== filterType) return false
    if (filterCountry && !service.location?.includes(filterCountry)) return false
    return true
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PHARMACY': return 'fa-prescription-bottle'
      case 'CLINIC': return 'fa-clinic-medical'
      case 'HOSPITAL': return 'fa-hospital'
      case 'AMBULANCE': return 'fa-ambulance'
      default: return 'fa-first-aid'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PHARMACY': return 'text-green-600'
      case 'CLINIC': return 'text-blue-600'
      case 'HOSPITAL': return 'text-red-600'
      case 'AMBULANCE': return 'text-orange-600'
      default: return 'text-purple-600'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'PHARMACY': return 'Pharmacie'
      case 'CLINIC': return 'Clinique'
      case 'HOSPITAL': return 'Hôpital'
      case 'AMBULANCE': return 'Ambulance'
      default: return 'Autre'
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            <i className="fas fa-exclamation-triangle mr-3"></i>
            Services d'Urgence
          </h1>
          <p className="text-xl">
            Trouvez rapidement les services d'urgence près de chez vous
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de service
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Tous les types</option>
                <option value="PHARMACY">Pharmacie</option>
                <option value="CLINIC">Clinique</option>
                <option value="HOSPITAL">Hôpital</option>
                <option value="AMBULANCE">Ambulance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localisation
              </label>
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Toutes les localisations</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterType('')
                  setFilterCountry('')
                }}
                className="w-full bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 font-semibold"
              >
                <i className="fas fa-times mr-2"></i> Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Emergency Alert */}
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8">
          <div className="flex items-center">
            <i className="fas fa-phone-alt text-2xl mr-4"></i>
            <div>
              <p className="font-bold">En cas d'urgence vitale, composez le 15</p>
              <p className="text-sm">Numéro d'urgence médical</p>
            </div>
          </div>
        </div>

        {/* Services List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600">Aucun service d'urgence trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`text-4xl ${getTypeColor(service.type)}`}>
                    <i className={`fas ${getTypeIcon(service.type)}`}></i>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {service.hours}
                  </span>
                </div>

                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-2">{getTypeLabel(service.type)}</p>

                {service.address && (
                  <p className="text-sm text-gray-500 mb-2">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    {service.address}
                  </p>
                )}

                {service.location && (
                  <p className="text-sm text-gray-500 mb-2">
                    <i className="fas fa-globe mr-2"></i>
                    {service.location}
                  </p>
                )}

                {service.phone && (
                  <a
                    href={`tel:${service.phone}`}
                    className="block text-red-600 hover:text-red-700 mb-2"
                  >
                    <i className="fas fa-phone mr-2"></i>
                    {service.phone}
                  </a>
                )}

                {service.website && (
                  <a
                    href={service.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-700"
                  >
                    <i className="fas fa-globe mr-2"></i>
                    Visiter le site web
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
