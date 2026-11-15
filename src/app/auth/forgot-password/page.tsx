'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      setMessage('Erreur: ' + error.message)
    } else {
      setMessage('Un email de réinitialisation a été envoyé à votre adresse.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-600">
            <i className="fas fa-key mr-2"></i> Mot de passe oublié
          </h2>
          <p className="text-gray-600 mt-2">
            Entrez votre email pour réinitialiser votre mot de passe
          </p>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded ${
            message.includes('envoyé') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="votre@email.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50"
          >
            {loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            <Link href="/auth/login" className="text-green-600 hover:text-green-700">
              Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
