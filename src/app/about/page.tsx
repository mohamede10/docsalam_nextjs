import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <img src="/img/02.jpg" alt="DocSalam" className="w-full h-full object-cover" />
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
                <Link href="/doctors" className="bg-green-600 text-white px-8 py-4 rounded-full hover:bg-green-700 font-semibold">
                  <i className="fas fa-search mr-2"></i> Chercher un Médecin
                </Link>
                <Link href="/doctors" className="bg-gray-600 text-white px-8 py-4 rounded-full hover:bg-gray-700 font-semibold">
                  <i className="fas fa-calendar-plus mr-2"></i> Prendre Rendez-vous
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-2 gap-4">
            <img src="/img/19.png" alt="Medical" className="rounded-lg shadow-lg" />
            <img src="/img/14.jpg" alt="Medical" className="rounded-lg shadow-lg mt-8" />
            <img src="/img/12.jpg" alt="Medical" className="rounded-lg shadow-lg" />
            <img src="/img/200.png" alt="Medical" className="rounded-lg shadow-lg mt-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-6 text-black">
              <span className="text-green-600">DocSalam</span> &nbsp;votre&nbsp;
              <span className="text-green-600">SANTÉ</span>
            </h1>
            <p className="text-gray-700 text-justify mb-6">
              Est une plateforme innovante de mise en relation entre patients et professionnels de santé. 
              Elle facilite l'accès aux soins en permettant de trouver rapidement un praticien adapté, 
              de prendre rendez-vous en ligne, et de bénéficier d'un suivi personnalisé.
            </p>
            <p className="text-gray-700 text-justify mb-6">
              <strong>En Afrique</strong>, le système de santé fait face à de nombreux défis structurels et organisationnels. 
              Malgré les efforts engagés par les autorités publiques et les partenaires techniques, 
              l'accès équitable à des soins de qualité demeure limité, en particulier dans les zones rurales 
              et périurbaines. Les inégalités géographiques, la faible densité de professionnels de santé, 
              le manque de spécialisation, ainsi que les longues files d'attente dans les centres de soins, 
              compromettent la prise en charge rapide et efficace des patients.
            </p>
            <p className="text-gray-700 text-justify mb-6">
              Par ailleurs, l'accès à l'information médicale reste souvent difficile, et de nombreux citoyens 
              manquent de repères pour s'orienter vers les bons services de santé. Les outils numériques sont 
              encore peu exploités dans ce secteur, alors même que l'utilisation des smartphones et d'Internet 
              est en forte croissance dans le pays, notamment chez les jeunes et en milieu urbain.
            </p>
            <p className="text-gray-700 text-justify mb-6">
              Face à ces constats, <strong className="text-green-600">DocSalam</strong> se positionne comme une solution 
              innovante et adaptée au contexte guinéen, visant à moderniser l'accès aux soins tout en tenant 
              compte des réalités locales. La plateforme permettra :
            </p>
            <ul className="text-gray-700 space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Aux patients, de trouver rapidement un professionnel de santé disponible, de prendre rendez-vous en ligne ou en téléconsultation, et de gérer plus efficacement leur suivi médical.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Aux professionnels de santé, d'optimiser leur gestion de planning, de gagner en visibilité, et d'améliorer la qualité de leur service via des outils numériques simples et accessibles.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Aux acteurs de santé publique, de mieux coordonner les soins, de renforcer la prévention, et de collecter des données utiles pour la planification sanitaire.</span>
              </li>
            </ul>
            <p className="text-gray-700 text-justify">
              <strong className="text-green-600">DocSalam</strong> ambitionne de devenir un pont numérique entre les patients 
              et le système de santé, en misant sur des solutions accessibles, sécurisées et inclusives, 
              en particulier pour les jeunes, les femmes enceintes, les personnes vivant en zones enclavées, 
              ou les malades chroniques.
            </p>
            <p className="text-gray-700 text-justify mt-6">
              Cette plateforme s'inscrit dans la dynamique de transformation numérique engagée en 
              <strong className="text-gray-900">Guinée</strong> et répond aux objectifs de développement durable, 
              notamment en matière de santé pour tous et de réduction des inégalités d'accès aux soins.
            </p>
          </div>
        </div>
      </div>

      {/* Objectifs, Missions, Vision */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Pourquoi <span className="text-green-600">DocSalam</span> ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Objectifs */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold text-blue-600 mb-6">
                <i className="fas fa-bullseye text-blue-600 mr-2"></i>Objectifs
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                  <span className="text-gray-700">Faciliter l'accès aux soins pour tous</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                  <span className="text-gray-700">Offrir une plateforme sécurisée de téléconsultation</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                  <span className="text-gray-700">Améliorer la coordination entre patients et professionnels</span>
                </li>
              </ul>
            </div>

            {/* Missions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold text-blue-600 mb-6">
                <i className="fas fa-tasks text-blue-600 mr-2"></i>Missions
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                  <span className="text-gray-700">Proposer des consultations en ligne avec des spécialistes</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                  <span className="text-gray-700">Assurer un suivi personnalisé des patients</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                  <span className="text-gray-700">Offrir un accès facile aux laboratoires et services d'urgence</span>
                </li>
              </ul>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold text-blue-600 mb-6">
                <i className="fas fa-eye text-blue-600 mr-2"></i>Vision
              </h3> 
              <ul className="space-y-3">
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                  <span className="text-gray-700">Devenir la référence numérique des soins de santé en Guinée</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                  <span className="text-gray-700">Moderniser l'accès aux soins tout en respectant les réalités locales</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                  <span className="text-gray-700">Promouvoir la prévention et le bien-être pour tous</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Valeurs */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Nos Valeurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center bg-gray-50 rounded-lg p-6">
            <i className="fas fa-heart text-4xl text-red-500 mb-4"></i>
            <h3 className="text-xl font-semibold text-red-700 mb-2">Empathie</h3>
            <p className="text-gray-600">Mettre le patient au cœur de notre action.</p>
          </div>
          <div className="text-center bg-gray-50 rounded-lg p-6">
            <i className="fas fa-shield-alt text-4xl text-blue-600 mb-4"></i>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">Sécurité</h3>
            <p className="text-gray-600">Garantir la confidentialité et la sécurité des données médicales.</p>
          </div>
          <div className="text-center bg-gray-50 rounded-lg p-6">
            <i className="fas fa-globe text-4xl text-green-600 mb-4"></i>
            <h3 className="text-xl font-semibold text-green-700 mb-2">Accessibilité</h3>
            <p className="text-gray-600">Rendre les soins disponibles pour tous, même dans les zones reculées.</p>
          </div>
          <div className="text-center bg-gray-50 rounded-lg p-6">
            <i className="fas fa-lightbulb text-4xl text-yellow-500 mb-4"></i>
            <h3 className="text-xl font-semibold text-yellow-600 mb-2">Innovation</h3>
            <p className="text-gray-600">Proposer des solutions numériques adaptées au contexte local.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
