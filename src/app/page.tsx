'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function Home() {
  const [specialties, setSpecialties] = useState<any[]>([])
  const [countries, setCountries] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showCharacter, setShowCharacter] = useState(true)
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const [counters, setCounters] = useState({ doctors: 0, consultations: 0, patients: 0, completed: 0 })

  useEffect(() => {
    void fetchSpecialties()
    void fetchCountries()
    const stopCounters = animateCounters()

    // Masquer le personnage après 5 secondes.
    const characterTimer = window.setTimeout(() => {
      setShowCharacter(false)
    }, 5000)

    return () => {
      window.clearTimeout(characterTimer)
      stopCounters()
    }
  }, [])

  useEffect(() => {
    setSelectedCity('')
    setCities([])

    if (selectedCountry) {
      void fetchCities(selectedCountry)
    }
  }, [selectedCountry])

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 2)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const animateCounters = () => {
    const targets = {
      doctors: 120,
      consultations: 350,
      patients: 500,
      completed: 200,
    }
    const duration = 2000
    const steps = 50
    const interval = duration / steps
    let step = 0

    const timer = window.setInterval(() => {
      step += 1
      const progress = Math.min(step / steps, 1)

      setCounters({
        doctors: Math.round(targets.doctors * progress),
        consultations: Math.round(targets.consultations * progress),
        patients: Math.round(targets.patients * progress),
        completed: Math.round(targets.completed * progress),
      })

      if (step >= steps) {
        window.clearInterval(timer)
      }
    }, interval)

    return () => window.clearInterval(timer)
  }

  const fetchSpecialties = async () => {
    const { data, error } = await supabase
      .from('specialties')
      .select('*')
      .order('name')

    if (error) {
      console.error('Erreur lors du chargement des spécialités :', error.message)
      return
    }

    setSpecialties(data ?? [])
  }

  const fetchCountries = async () => {
    const { data, error } = await supabase
      .from('cities')
      .select('country')
      .order('country')

    if (error) {
      console.error('Erreur lors du chargement des pays :', error.message)
      return
    }

    const uniqueCountries = Array.from(
      new Set((data ?? []).map((item) => item.country).filter(Boolean))
    )
    setCountries(uniqueCountries)
  }

  const fetchCities = async (country: string) => {
    const { data, error } = await supabase
      .from('cities')
      .select('city')
      .eq('country', country)
      .order('city')

    if (error) {
      console.error('Erreur lors du chargement des villes :', error.message)
      setCities([])
      return
    }

    setCities(data ?? [])
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (selectedSpecialty) params.append('specialty', selectedSpecialty)
    if (selectedCountry) params.append('country', selectedCountry)
    if (selectedCity) params.append('city', selectedCity)
    window.location.href = `/doctors?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Floating Character */}
      {showCharacter && (
        <div className="fixed top-5 left-5 bg-white bg-opacity-95 p-4 rounded-2xl shadow-lg flex items-center gap-3 z-50 transition-all duration-1000">
          <img 
            src="https://previews.123rf.com/images/krisdog/krisdog1711/krisdog171100490/90663954-doctor-thumbs-up-cartoon-character-sign.jpg" 
            alt="Personnage DocSalam" 
            className="w-12 h-24 object-contain"
          />
          <div className="text-sm font-bold text-green-600">
            Bonjour, bienvenue chez <strong>DocSalam</strong>!<br/>
            Meilleure santé à vous!
          </div>
        </div>
      )}

      {/* Carousel */}
      <div className="relative h-[600px] overflow-hidden bg-gray-800">
        {currentSlide === 0 && (
          <div className="absolute inset-0 transition-opacity duration-500">
            <Image 
              src="/img/4040.jpg" 
              alt="Medical Banner" 
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl text-white">
                  <h1 className="text-5xl font-bold mb-6">
                    Ma SANTÉ <span className="text-green-500">DocSalam</span>
                  </h1>
                  <p className="text-xl mb-8 text-justify">
                    Vivez une expérience médicale simple et rapide. 
                    Avec <strong>DocSalam</strong>, consultez des médecins certifiés, 
                    obtenez des conseils et prenez rendez-vous en quelques clics, 
                    où que vous soyez.
                  </p>
                  <div className="flex space-x-4">
                    <Link href="/doctors" className="bg-green-600 text-white px-8 py-4 rounded-full hover:bg-green-700 font-semibold text-lg">
                      <i className="fas fa-calendar-plus mr-2"></i> Prendre Rendez-vous
                    </Link>
                    <Link href="/doctors" className="bg-gray-600 text-white px-8 py-4 rounded-full hover:bg-gray-700 font-semibold text-lg">
                      <i className="fas fa-users mr-2"></i> Voir nos Médecins
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {currentSlide === 1 && (
          <div className="absolute inset-0 transition-opacity duration-500">
            <Image 
              src="/img/medical-banner-with-doctor-wearing-goggles.jpg" 
              alt="Online Consultation" 
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl text-white">
                  <h1 className="text-5xl font-bold mb-6">Consultation en ligne</h1>
                  <p className="text-xl mb-8">
                    Accédez facilement à des médecins qualifiés depuis chez vous. 
                    Prenez rendez-vous en ligne, consultez vos résultats et recevez 
                    des conseils médicaux en toute sécurité, sans vous déplacer.
                  </p>
                  <div className="flex space-x-4">
                    <Link href="/contact" className="bg-gray-600 text-white px-8 py-4 rounded-full hover:bg-gray-700 font-semibold text-lg">
                      <i className="fas fa-comments mr-2"></i> Assistance et conseils
                    </Link>
                    <Link href="/emergency" className="bg-green-600 text-white px-8 py-4 rounded-full hover:bg-green-700 font-semibold text-lg">
                      <i className="fas fa-ambulance mr-2"></i> Services d'urgences
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-6xl mx-auto -mt-16 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Specialty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spécialité médicale
              </label>
              <div className="flex">
                <span className="bg-white border border-gray-300 rounded-l-lg px-3 flex items-center border-r-0">
                  <i className="fas fa-stethoscope text-green-600"></i>
                </span>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full border border-gray-300 rounded-r-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Toutes les spécialités</option>
                  {specialties.map((spec) => (
                    <option key={spec.id} value={spec.name}>
                      {spec.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pays
              </label>
              <div className="flex">
                <span className="bg-white border border-gray-300 rounded-l-lg px-3 flex items-center border-r-0">
                  <i className="fas fa-flag text-red-600"></i>
                </span>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full border border-gray-300 rounded-r-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Sélectionner le pays</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville
              </label>
              <div className="flex">
                <span className="bg-white border border-gray-300 rounded-l-lg px-3 flex items-center border-r-0">
                  <i className="fas fa-map-marker-alt text-red-600"></i>
                </span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full border border-gray-300 rounded-r-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={!selectedCountry}
                >
                  <option value="">Sélectionner la ville</option>
                  {cities.map((city: any, index) => (
                    <option key={index} value={city.city}>
                      {city.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
              >
                <i className="fas fa-search mr-2"></i> Rechercher
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Counters Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center mb-2">
              <i className="fas fa-user-md text-3xl text-blue-600 mr-3"></i>
              <h2 className="text-4xl font-bold text-gray-800">{Math.round(counters.doctors)}+</h2>
            </div>
            <p className="text-gray-600">Médecins connectés</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center mb-2">
              <i className="fas fa-stethoscope text-3xl text-green-600 mr-3"></i>
              <h2 className="text-4xl font-bold text-gray-800">{Math.round(counters.consultations)}+</h2>
            </div>
            <p className="text-gray-600">Consultations en ligne</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center mb-2">
              <i className="fas fa-smile-beam text-3xl text-green-600 mr-3"></i>
              <h2 className="text-4xl font-bold text-gray-800">{Math.round(counters.patients)}+</h2>
            </div>
            <p className="text-gray-600">Patients satisfaits</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center mb-2">
              <i className="fas fa-check-circle text-3xl text-green-600 mr-3"></i>
              <h2 className="text-4xl font-bold text-gray-800">{Math.round(counters.completed)}+</h2>
            </div>
            <p className="text-gray-600">Consultations terminées</p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gray-700 mb-6 text-justify">
              Avec DocSalam, prenez rendez-vous facilement avec nos médecins qualifiés 
              dans plusieurs spécialités (Cardiologie, Pédiatrie, Neurologie, etc.).<br/>
              <span className="text-green-600">✓</span> Gagnez du temps<br/>
              <span className="text-green-600">✓</span> Accédez à des médecins validés<br/>
              <span className="text-green-600">✓</span> Suivi de vos consultations en ligne
            </p>
            
            {/* Steps */}
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-orange-500 text-white p-4 rounded-r-full rounded-l-lg shadow-md">
                <div className="flex items-center">
                  <img src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" alt="Médecin" className="w-10 h-10 mr-3" />
                  <span className="font-semibold">Médecin disponible</span>
                </div>
                <span className="text-2xl font-black bg-white bg-opacity-25 w-10 h-10 rounded-full flex items-center justify-center">1</span>
              </div>
              <div className="flex items-center justify-between bg-green-600 text-white p-4 rounded-r-full rounded-l-lg shadow-md">
                <div className="flex items-center">
                  <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" alt="Carte" className="w-10 h-10 mr-3" />
                  <span className="font-semibold">Trouvez un lieu de soins</span>
                </div>
                <span className="text-2xl font-black bg-white bg-opacity-25 w-10 h-10 rounded-full flex items-center justify-center">2</span>
              </div>
              <div className="flex items-center justify-between bg-pink-600 text-white p-4 rounded-r-full rounded-l-lg shadow-md">
                <div className="flex items-center">
                  <img src="https://cdn-icons-png.flaticon.com/512/159/159832.png" alt="Appel" className="w-10 h-10 mr-3" />
                  <span className="font-semibold">Appelez DocSalam +224 613 147 070</span>
                </div>
                <span className="text-2xl font-black bg-white bg-opacity-25 w-10 h-10 rounded-full flex items-center justify-center">3</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-bold mb-4">
              <span className="text-green-600">Doc</span>
              <span className="text-gray-600">Salam</span>
              <br/>votre santé, notre priorité
            </h3>
            <p className="text-gray-700 mb-6 text-justify">
              DocSalam est une plateforme en ligne innovante de mise en relation entre 
              <strong>patients</strong> et <strong>professionnels de santé</strong>. 
              Elle facilite l'accès aux soins en permettant aux utilisateurs de 
              <strong>trouver rapidement un praticien</strong>, de 
              <strong>prendre rendez-vous en quelques clics</strong>, et de bénéficier 
              d'un accompagnement personnalisé tout au long de leur parcours.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <i className="fas fa-calendar-check text-green-600 text-xl mr-2"></i>
                <span>Rendez-vous en ligne</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-user-md text-blue-600 text-xl mr-2"></i>
                <span>Médecins certifiés</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-video text-blue-500 text-xl mr-2"></i>
                <span>Téléconsultation rapide</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-lock text-gray-800 text-xl mr-2"></i>
                <span>Plateforme sécurisée</span>
              </div>
            </div>
            <p className="text-gray-700 text-justify mb-6">
              En particulier, <strong>jeunes</strong>, <strong>femmes enceintes</strong>, 
              <strong>malades chroniques</strong> et habitants de zones éloignées 
              peuvent accéder facilement à des soins de qualité grâce à DocSalam.
            </p>
            <Link href="/about" className="inline-block bg-gray-600 text-white px-8 py-3 rounded-full hover:bg-gray-700 font-semibold shadow-lg">
              Découvrir DocSalam
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-green-600 text-white py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={() => setShowHowItWorks(!showHowItWorks)}
            className="w-full text-center text-white hover:text-green-200"
          >
            <strong className="text-xl">DocSalam comment ça marche ?</strong>
            <i className={`fas fa-chevron-${showHowItWorks ? 'up' : 'down'} ml-2`}></i>
          </button>
          
          {showHowItWorks && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-6 text-center">
              <div>
                <i className="fas fa-search text-4xl mb-3"></i>
                <h5 className="font-semibold">1. Recherchez un médecin</h5>
              </div>
              <div>
                <i className="fas fa-calendar-check text-4xl mb-3"></i>
                <h5 className="font-semibold">2. Prenez rendez-vous</h5>
              </div>
              <div>
                <i className="fas fa-laptop-medical text-4xl mb-3"></i>
                <h5 className="font-semibold">3. Consultez en ligne</h5>
              </div>
              <div>
                <i className="fas fa-file-medical text-4xl mb-3"></i>
                <h5 className="font-semibold">4. Recevez vos résultats</h5>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
