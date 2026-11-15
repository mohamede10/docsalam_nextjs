'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function PaymentsPage() {
  const [user, setUser] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchPayments()
    }
  }, [user])

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
  }

  const fetchPayments = async () => {
    const { data } = await supabase
      .from('payments')
      .select('*, appointments(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) setPayments(data)
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      case 'REFUNDED': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'STRIPE': return 'fa-credit-card'
      case 'PAYPAL': return 'fa-paypal'
      case 'ORANGE_MONEY': return 'fa-mobile-alt'
      case 'MOBILE_MONEY': return 'fa-mobile-alt'
      case 'CASH': return 'fa-money-bill'
      default: return 'fa-credit-card'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PAID': return 'Payé'
      case 'PENDING': return 'En attente'
      case 'FAILED': return 'Échoué'
      case 'REFUNDED': return 'Remboursé'
      default: return status
    }
  }

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'STRIPE': return 'Stripe'
      case 'PAYPAL': return 'PayPal'
      case 'ORANGE_MONEY': return 'Orange Money'
      case 'MOBILE_MONEY': return 'Mobile Money'
      case 'CASH': return 'Espèces'
      default: return method
    }
  }

  if (!user) {
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
        <h1 className="text-3xl font-bold mb-8">Mes Paiements</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + Number(p.amount), 0).toFixed(2)} €
            </div>
            <div className="text-gray-600">Total payé</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl font-bold text-yellow-600 mb-2">
              {payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + Number(p.amount), 0).toFixed(2)} €
            </div>
            <div className="text-gray-600">En attente</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {payments.length}
            </div>
            <div className="text-gray-600">Total transactions</div>
          </div>
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Historique des paiements</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <i className="fas fa-receipt text-4xl mb-4"></i>
              <p>Aucun paiement enregistré</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <i className={`fas ${getMethodIcon(payment.method)} text-2xl text-green-600 mr-3`}></i>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {getMethodLabel(payment.method)}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Référence: {payment.reference}
                          </p>
                        </div>
                      </div>

                      {payment.appointment && (
                        <p className="text-sm text-gray-600 mb-2">
                          <i className="fas fa-calendar-alt mr-2"></i>
                          Rendez-vous du {new Date(payment.appointment.date).toLocaleDateString('fr-FR')}
                        </p>
                      )}

                      <p className="text-sm text-gray-500">
                        <i className="fas fa-clock mr-2"></i>
                        {new Date(payment.created_at).toLocaleString('fr-FR')}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600 mb-2">
                        {Number(payment.amount).toFixed(2)} €
                      </p>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(payment.status)}`}>
                        {getStatusLabel(payment.status)}
                      </span>
                    </div>
                  </div>

                  {payment.provider_ref && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        <i className="fas fa-external-link-alt mr-2"></i>
                        Référence fournisseur: {payment.provider_ref}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Methods Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold mb-6">Méthodes de paiement acceptées</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <i className="fab fa-cc-stripe text-4xl text-blue-600 mb-2"></i>
              <p className="font-semibold">Stripe</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <i className="fab fa-paypal text-4xl text-blue-700 mb-2"></i>
              <p className="font-semibold">PayPal</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <i className="fas fa-mobile-alt text-4xl text-orange-500 mb-2"></i>
              <p className="font-semibold">Orange Money</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <i className="fas fa-money-bill text-4xl text-green-600 mb-2"></i>
              <p className="font-semibold">Espèces</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
