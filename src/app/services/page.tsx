import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <img src="/img/408.jpg" alt="Services DocSalam" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl text-white">
              <h1 className="text-5xl font-bold mb-6">
                Services <span className="text-green-500">DocSalam</span>
              </h1>
              <div className="flex space-x-4">
                <Link href="/contact" className="bg-gray-600 text-white px-8 py-4 rounded-full hover:bg-gray-700 font-semibold">
                  <i className="fas fa-comments mr-2"></i> Assistance et conseils
                </Link>
                <Link href="/emergency" className="bg-green-600 text-white px-8 py-4 rounded-full hover:bg-green-700 font-semibold">
                  <i className="fas fa-ambulance mr-2"></i> Services d'urgences
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services for Patients */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">
          ✅ <span className="text-gray-800">Services pour les Patients</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href="/doctors" className="bg-gray-100 rounded-lg p-6 text-center hover:bg-blue-50 hover:shadow-lg transition-all">
            <i className="fas fa-calendar-check text-4xl text-blue-600 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Prise de rendez-vous</h3>
            <p className="text-gray-600">Consultations, téléconsultations, urgences.</p>
          </Link>
          <Link href="/messages" className="bg-gray-100 rounded-lg p-6 text-center hover:bg-blue-50 hover:shadow-lg transition-all">
            <i className="fas fa-laptop-medical text-4xl text-blue-600 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Téléconsultation sécurisée</h3>
            <p className="text-gray-600">Visio à distance avec ordonnances électroniques.</p>
          </Link>
          <Link href="/doctors" className="bg-gray-100 rounded-lg p-6 text-center hover:bg-blue-50 hover:shadow-lg transition-all">
            <i className="fas fa-search text-4xl text-blue-600 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Recherche de praticiens</h3>
            <p className="text-gray-600">Par spécialité, langue, localisation.</p>
          </Link>
          <Link href="/profile" className="bg-gray-100 rounded-lg p-6 text-center hover:bg-blue-50 hover:shadow-lg transition-all">
            <i className="fas fa-file-medical text-4xl text-blue-600 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Dossier médical</h3>
            <p className="text-gray-600">Stockage sécurisé et historique médical.</p>
          </Link>
        </div>

        {/* Services for Professionals */}
        <h2 className="text-3xl font-bold mb-8">
          ✅ <span className="text-gray-800">Services pour les Professionnels</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href="/dashboard/doctor" className="bg-gray-100 rounded-lg p-6 text-center hover:bg-green-50 hover:shadow-lg transition-all">
            <i className="fas fa-calendar-alt text-4xl text-green-600 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Agenda en ligne</h3>
            <p className="text-gray-600">Gestion et synchronisation des rendez-vous.</p>
          </Link>
          <Link href="/consultations" className="bg-gray-100 rounded-lg p-6 text-center hover:bg-green-50 hover:shadow-lg transition-all">
            <i className="fas fa-video text-4xl text-green-600 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Plateforme téléconsultation</h3>
            <p className="text-gray-600">Outil de visio sécurisé avec prescription.</p>
          </Link>
          <Link href="/messages" className="bg-gray-100 rounded-lg p-6 text-center hover:bg-green-50 hover:shadow-lg transition-all">
            <i className="fas fa-users text-4xl text-green-600 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Gestion de patientèle</h3>
            <p className="text-gray-600">Fiches patients, messagerie sécurisée.</p>
          </Link>
          <Link href="/payments" className="bg-gray-100 rounded-lg p-6 text-center hover:bg-green-50 hover:shadow-lg transition-all">
            <i className="fas fa-file-invoice-dollar text-4xl text-green-600 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Facturation</h3>
            <p className="text-gray-600">Paiements et télétransmission automatisés.</p>
          </Link>
        </div>

        {/* Services for Establishments */}
        <h2 className="text-3xl font-bold mb-8">
          ✅ <span className="text-gray-800">Services pour les Établissements</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/admin" className="bg-gray-100 rounded-lg p-6 text-center hover:bg-purple-50 hover:shadow-lg transition-all">
            <i className="fas fa-hospital text-4xl text-purple-600 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Portail de gestion</h3>
            <p className="text-gray-600">Supervision des praticiens et services.</p>
          </Link>
          <div className="bg-gray-100 rounded-lg p-6 text-center hover:bg-purple-50 hover:shadow-lg transition-all">
            <i className="fas fa-handshake text-4xl text-purple-600 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Coordination des soins</h3>
            <p className="text-gray-600">Partage sécurisé entre équipes médicales.</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-6 text-center hover:bg-purple-50 hover:shadow-lg transition-all">
            <i className="fas fa-chart-line text-4xl text-purple-600 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Statistiques</h3>
            <p className="text-gray-600">Rapports et suivi de performance.</p>
          </div>
        </div>
      </div>

      {/* Emergency Services */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-600">Urgences médicales 24/7</h2>
            <p className="text-gray-600">Trouvez rapidement un service de santé disponible à tout moment</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6 flex items-center">
              <i className="fas fa-clinic-medical text-4xl text-green-600 mr-4"></i>
              <div>
                <h3 className="text-xl font-semibold text-black mb-1">Pharmacies 24/24</h3>
                <p className="text-gray-600">Disponibles jour et nuit</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 flex items-center">
              <i className="fas fa-hospital text-4xl text-blue-600 mr-4"></i>
              <div>
                <h3 className="text-xl font-semibold text-black mb-1">Cliniques & Hôpitaux</h3>
                <p className="text-gray-600">Services d'urgence</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 flex items-center">
              <i className="fas fa-ambulance text-4xl text-red-600 mr-4"></i>
              <div>
                <h3 className="text-xl font-semibold text-black mb-1">Ambulances</h3>
                <p className="text-gray-600">Appelez rapidement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
