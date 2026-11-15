'use client'

import { useState, useEffect } from 'react'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if user already dismissed the prompt
    const wasDismissed = localStorage.getItem('pwa-install-dismissed')
    if (wasDismissed) {
      setDismissed(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt')
        }
        setDeferredPrompt(null)
        setShowPrompt(false)
      })
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setDismissed(true)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  if (!showPrompt || dismissed) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-up">
      <div className="bg-white rounded-lg shadow-2xl p-6 border border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-mobile-alt text-white text-xl"></i>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Installer DocSalam</h3>
              <p className="text-sm text-gray-600">Accès rapide hors ligne</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <p className="text-sm text-gray-700 mb-4">
          Installez l'application DocSalam sur votre appareil pour un accès rapide et une expérience hors ligne optimisée.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={handleInstall}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold transition-colors"
          >
            <i className="fas fa-download mr-2"></i>
            Installer
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  )
}
