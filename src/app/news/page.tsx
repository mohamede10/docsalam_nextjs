'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function NewsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
      .order('published_at', { ascending: false })

    if (data) setAnnouncements(data)
    setLoading(false)
  }

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            <i className="fas fa-newspaper mr-3"></i>
            Actualités & Annonces
          </h1>
          <p className="text-xl">
            Restez informé des dernières nouvelles de DocSalam
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <i className="fas fa-newspaper text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600">Aucune annonce pour le moment</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-purple-600"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {announcement.title}
                  </h2>
                  {isExpired(announcement.expires_at) && (
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                      Expiré
                    </span>
                  )}
                </div>

                {announcement.description && (
                  <p className="text-gray-600 mb-4 whitespace-pre-line">
                    {announcement.description}
                  </p>
                )}

                <div className="flex items-center text-sm text-gray-500">
                  <i className="fas fa-calendar-alt mr-2"></i>
                  Publié le {new Date(announcement.published_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  {announcement.expires_at && (
                    <>
                      <span className="mx-2">•</span>
                      <i className="fas fa-hourglass-end mr-2"></i>
                      Expire le {new Date(announcement.expires_at).toLocaleDateString('fr-FR')}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
