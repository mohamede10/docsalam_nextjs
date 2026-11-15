import Link from 'next/link'

export default function FAQPage() {
  const faqs = [
    {
      question: 'Comment fonctionne DocSalam ?',
      answer: 'DocSalam est une plateforme en ligne qui vous permet de trouver des médecins, de prendre rendez-vous et de consulter à distance. Inscrivez-vous gratuitement, recherchez un médecin selon vos critères et prenez rendez-vous en quelques clics.',
    },
    {
      question: 'L\'inscription est-elle gratuite ?',
      answer: 'Oui, l\'inscription sur DocSalam est entièrement gratuite pour les patients. Les médecins peuvent également s\'inscrire gratuitement pour proposer leurs services.',
    },
    {
      question: 'Comment puis-je prendre rendez-vous ?',
      answer: 'Après vous être connecté, recherchez un médecin selon vos besoins (spécialité, localisation), cliquez sur son profil, choisissez une date et une heure disponibles, puis confirmez votre rendez-vous.',
    },
    {
      question: 'Les consultations vidéo sont-elles sécurisées ?',
      answer: 'Oui, toutes nos consultations vidéo sont chiffrées et sécurisées pour garantir la confidentialité de vos échanges avec les médecins.',
    },
    {
      question: 'Puis-je annuler mon rendez-vous ?',
      answer: 'Oui, vous pouvez annuler votre rendez-vous depuis votre dashboard patient. Il est recommandé d\'annuler au moins 24 heures à l\'avance.',
    },
    {
      question: 'Comment sont choisis les médecins sur la plateforme ?',
      answer: 'Tous les médecins sur DocSalam sont vérifiés et doivent fournir leur licence médicale valide. Notre équipe admin valide chaque inscription avant qu\'un médecin puisse accepter des rendez-vous.',
    },
    {
      question: 'Quels modes de paiement sont acceptés ?',
      answer: 'Nous acceptons plusieurs modes de paiement : carte bancaire, PayPal, Orange Money, Mobile Money et espèces selon la configuration du médecin.',
    },
    {
      question: 'Mes données médicales sont-elles confidentielles ?',
      answer: 'Absolument. Nous respectons strictement les réglementations sur la protection des données. Vos informations médicales ne sont partagées qu\'avec les médecins que vous choisissez.',
    },
    {
      question: 'Puis-je consulter un médecin d\'un autre pays ?',
      answer: 'Oui, DocSalam est disponible dans plusieurs pays. Vous pouvez consulter des médecins internationaux via nos consultations vidéo.',
    },
    {
      question: 'Que faire si j\'ai un problème technique ?',
      answer: 'Contactez notre support technique via la page Contact ou par WhatsApp. Notre équipe est disponible du lundi au vendredi de 8h à 18h.',
    },
  ]

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
          <h1 className="text-5xl font-bold mb-4">FAQ</h1>
          <p className="text-xl">
            Questions fréquentes sur DocSalam
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <details key={index} className="bg-white border-2 border-gray-200 rounded-lg p-6 group">
              <summary className="cursor-pointer font-semibold text-lg text-gray-800 flex justify-between items-center">
                {faq.question}
                <i className="fas fa-chevron-down text-green-600 group-open:rotate-180 transition-transform"></i>
              </summary>
              <p className="mt-4 text-gray-600">{faq.answer}</p>
            </details>
          ))}
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto mt-12 bg-green-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Vous n'avez pas trouvé votre réponse ?
          </h2>
          <p className="text-gray-600 mb-6">
            N'hésitez pas à nous contacter directement
          </p>
          <Link href="/contact" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700">
            Nous contacter
          </Link>
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
