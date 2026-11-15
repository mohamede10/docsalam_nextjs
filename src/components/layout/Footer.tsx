import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-white">
              Doc<strong className="text-green-500">Salam</strong>
            </h3>
            <p className="text-gray-400 text-justify">
              Votre santé, notre priorité. Consultez un médecin en ligne et obtenez des conseils médicaux facilement, 
              avec un accompagnement de praticiens compétents à chaque étape de votre parcours santé.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-green-500">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-green-500">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="text-gray-400 hover:text-green-500">
                  Prendre rendez-vous
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-green-500">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-green-500">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <i className="fas fa-map-marker-alt text-green-500 mr-3"></i>
                Conakry, Guinée
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt text-green-500 mr-3"></i>
                +224 613 147 070
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope text-green-500 mr-3"></i>
                contact@docsalam.com
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-green-500 border border-gray-600 rounded-full w-10 h-10 flex items-center justify-center hover:border-green-500">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 border border-gray-600 rounded-full w-10 h-10 flex items-center justify-center hover:border-green-500">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 border border-gray-600 rounded-full w-10 h-10 flex items-center justify-center hover:border-green-500">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 border border-gray-600 rounded-full w-10 h-10 flex items-center justify-center hover:border-green-500">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Partners */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Nos Partenaires</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white p-2 rounded-lg flex items-center justify-center h-16">
                <span className="text-gray-400 text-sm">Partenaire 1</span>
              </div>
              <div className="bg-white p-2 rounded-lg flex items-center justify-center h-16">
                <span className="text-gray-400 text-sm">Partenaire 2</span>
              </div>
              <div className="bg-white p-2 rounded-lg flex items-center justify-center h-16">
                <span className="text-gray-400 text-sm">Partenaire 3</span>
              </div>
              <div className="bg-white p-2 rounded-lg flex items-center justify-center h-16">
                <span className="text-gray-400 text-sm">Partenaire 4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              &copy; <a href="#" className="border-b border-gray-600 hover:border-green-500">DocSalam</a>, Tous droits réservés. 
              Développé par <a href="https://cotechservices.com" className="border-b border-gray-600 hover:border-green-500">COTECH SERVICES</a>
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/" className="text-gray-400 hover:text-green-500">
                Accueil
              </Link>
              <Link href="/legal" className="text-gray-400 hover:text-green-500">
                Mentions légales
              </Link>
              <a href="https://wa.me/+224613147070" className="text-gray-400 hover:text-green-500">
                Aide
              </a>
              <Link href="/faq" className="text-gray-400 hover:text-green-500">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
