import Link from 'next/link'

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-3xl font-bold text-green-600">
              Doc<strong className="text-gray-600">Salam</strong>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/doctors" className="text-green-600 font-semibold">
                Trouvez un médecin
              </Link>
              <Link href="/about" className="hover:text-green-600">
                À propos
              </Link>
              <Link href="/services" className="hover:text-green-600">
                Services
              </Link>
              <Link href="/contact" className="hover:text-green-600">
                Contact
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/login" className="text-green-600 hover:text-green-700">
                Connexion
              </Link>
              <Link href="/auth/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Mentions Légales</h1>
          <p className="text-xl">
            Informations légales concernant DocSalam
          </p>
        </div>
      </div>

      {/* Legal Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Éditeur du site</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="mb-2"><strong>Raison sociale :</strong> DocSalam</p>
              <p className="mb-2"><strong>Adresse :</strong> Conakry, Guinée</p>
              <p className="mb-2"><strong>Téléphone :</strong> +224 613 147 070</p>
              <p className="mb-2"><strong>Email :</strong> contact@docsalam.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Hébergement</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="mb-2"><strong>Hébergeur :</strong> Supabase</p>
              <p className="mb-2"><strong>Adresse :</strong> San Francisco, Californie, États-Unis</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Propriété intellectuelle</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-600 mb-4">
                L'ensemble du contenu de ce site (textes, images, vidéos, logos, etc.) est protégé 
                par le droit d'auteur. Toute reproduction, même partielle, est interdite sans 
                autorisation préalable de DocSalam.
              </p>
              <p className="text-gray-600">
                Les marques DocSalam et logos sont des marques déposées. Toute utilisation non 
                autorisée constitue une contrefaçon sanctionnée par le code de la propriété intellectuelle.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Protection des données personnelles</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-600 mb-4">
                DocSalam s'engage à protéger vos données personnelles conformément aux réglementations 
                en vigueur. Les données collectées sont utilisées uniquement dans le cadre des 
                services proposés.
              </p>
              <p className="text-gray-600 mb-4">
                Vous disposez d'un droit d'accès, de rectification et de suppression de vos données. 
                Pour exercer ces droits, contactez-nous à l'adresse : contact@docsalam.com
              </p>
              <p className="text-gray-600">
                Voir notre politique de confidentialité pour plus d'informations.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Cookies</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-600 mb-4">
                Ce site utilise des cookies pour améliorer votre expérience de navigation et 
                analyser le trafic. Vous pouvez configurer votre navigateur pour refuser les cookies.
              </p>
              <p className="text-gray-600">
                Les cookies utilisés sont principalement des cookies techniques nécessaires au 
                fonctionnement du site et des cookies d'analyse anonymes.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Responsabilité</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-600 mb-4">
                DocSalam s'efforce de fournir des informations exactes et à jour sur ce site. 
                Cependant, nous ne pouvons garantir l'exactitude, la complétude ou l'actualité 
                des informations diffusées.
              </p>
              <p className="text-gray-600">
                DocSalam ne peut être tenu responsable des dommages directs ou indirects résultant 
                de l'utilisation de ce site ou des informations qu'il contient.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Services médicaux</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-600 mb-4">
                DocSalam est une plateforme de mise en relation entre patients et médecins. 
                Les médecins inscrits sont responsables des consultations et diagnostics qu'ils fournissent.
              </p>
              <p className="text-gray-600">
                En cas d'urgence, contactez immédiatement les services d'urgence locaux. 
                DocSalam ne fournit pas de services d'urgence médicale.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Conditions d'utilisation</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-600 mb-4">
                L'utilisation de ce site implique l'acceptation de ces mentions légales et de nos 
                conditions d'utilisation. DocSalam se réserve le droit de modifier ces mentions 
                à tout moment.
              </p>
              <p className="text-gray-600">
                Toute utilisation frauduleuse ou abusive du site peut faire l'objet de poursuites.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 DocSalam. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
