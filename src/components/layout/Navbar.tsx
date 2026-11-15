'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface NavbarProps {
  showAuthButtons?: boolean
  user?: any
}

export default function Navbar({ showAuthButtons = true, user }: NavbarProps) {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    if (user) {
      setCurrentUser(user)
    } else {
      checkUser()
    }
  }, [user])

  // PWA install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt')
        }
        setDeferredPrompt(null)
        setShowInstallPrompt(false)
      })
    }
  }

  const checkUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser) {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()
      setCurrentUser(userData)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-green-600">
            Doc<strong className="text-gray-600">Salam</strong>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link href="/doctors" className="text-green-600 font-bold animate-pulse hover:text-green-700">
              Trouvez un médecin
            </Link>
            <Link href="/about" className="text-black font-bold hover:text-green-600">
              À propos
            </Link>
            <Link href="/services" className="text-black font-bold hover:text-green-600">
              Services
            </Link>
            <a href="https://wa.me/+224613147070" className="text-black font-bold hover:text-green-600">
              Contact
            </a>
            <Link href="/auth/login" className="text-black font-bold hover:text-green-600">
              Connexion
            </Link>
          </div>

          {/* Auth Buttons or User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {showInstallPrompt && (
              <button
                onClick={handleInstallClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold flex items-center text-sm"
              >
                <i className="fas fa-download mr-2"></i>
                Installer
              </button>
            )}
            {currentUser ? (
              <>
                <Link href="/notifications" className="text-gray-600 hover:text-green-700 relative">
                  <i className="fas fa-bell text-xl"></i>
                </Link>
                <span className="text-gray-600">
                  {currentUser.role === 'DOCTOR' ? 'Dr. ' : ''}{currentUser.first_name}
                </span>
                {currentUser.role === 'PATIENT' && (
                  <Link href="/dashboard/patient" className="text-green-600 hover:text-green-700">
                    Dashboard
                  </Link>
                )}
                {currentUser.role === 'DOCTOR' && (
                  <Link href="/dashboard/doctor" className="text-green-600 hover:text-green-700">
                    Dashboard
                  </Link>
                )}
                {currentUser.role === 'ADMIN' && (
                  <Link href="/dashboard/admin" className="text-green-600 hover:text-green-700">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700"
                >
                  Déconnexion
                </button>
              </>
            ) : showAuthButtons ? (
              <>
                <Link href="/doctors" className="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-gray-700 font-semibold">
                  Prendre Rendez-vous <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            {showInstallPrompt && (
              <button
                onClick={handleInstallClick}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center"
              >
                <i className="fas fa-download mr-2"></i>
                Installer l'application
              </button>
            )}
            <Link href="/doctors" className="block text-green-600 font-bold animate-pulse">
              Trouvez un médecin
            </Link>
            <Link href="/about" className="block hover:text-green-600">
              À propos
            </Link>
            <Link href="/services" className="block hover:text-green-600">
              Services
            </Link>
            <a href="https://wa.me/+224613147070" className="block hover:text-green-600">
              Contact
            </a>
            <Link href="/auth/login" className="block hover:text-green-600">
              Connexion
            </Link>
            {currentUser ? (
              <>
                <div className="border-t pt-4">
                  <Link href="/notifications" className="block text-gray-600 hover:text-green-700 mb-2">
                    <i className="fas fa-bell mr-2"></i>
                    Notifications
                  </Link>
                  <p className="text-gray-600 mb-2">
                    {currentUser.role === 'DOCTOR' ? 'Dr. ' : ''}{currentUser.first_name}
                  </p>
                  {currentUser.role === 'PATIENT' && (
                    <Link href="/dashboard/patient" className="block text-green-600 hover:text-green-700 mb-2">
                      Dashboard
                    </Link>
                  )}
                  {currentUser.role === 'DOCTOR' && (
                    <Link href="/dashboard/doctor" className="block text-green-600 hover:text-green-700 mb-2">
                      Dashboard
                    </Link>
                  )}
                  {currentUser.role === 'ADMIN' && (
                    <Link href="/dashboard/admin" className="block text-green-600 hover:text-green-700 mb-2">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block text-red-600 hover:text-red-700"
                  >
                    Déconnexion
                  </button>
                </div>
              </>
            ) : showAuthButtons ? (
              <div className="border-t pt-4 space-y-2">
                <Link href="/doctors" className="block bg-gray-600 text-white px-6 py-4 rounded-lg hover:bg-gray-700 font-semibold text-center">
                  Prendre Rendez-vous <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </nav>
  )
}
