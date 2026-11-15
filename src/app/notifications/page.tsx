'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function NotificationsPage() {
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchNotifications()
      
      // Subscribe to new notifications
      const subscription = supabase
        .channel(`notifications:${user.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          setNotifications(prev => [payload.new, ...prev])
        })
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
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

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) setNotifications(data)
    setLoading(false)
  }

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    if (!error) {
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      )
    }
  }

  const markAllAsRead = async () => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)

    if (!error) {
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, is_read: true }))
      )
    }
  }

  const deleteNotification = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)

    if (!error) {
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <i className="fas fa-check-double mr-2"></i>
              Tout marquer comme lu
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {notifications.length}
            </div>
            <div className="text-gray-600">Total notifications</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {unreadCount}
            </div>
            <div className="text-gray-600">Non lues</div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <i className="fas fa-bell text-4xl mb-4"></i>
              <p>Aucune notification</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                    !notification.is_read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {notification.title && (
                        <h3 className="font-semibold text-lg mb-2">
                          {notification.title}
                        </h3>
                      )}
                      <p className="text-gray-600 mb-2">{notification.message}</p>
                      <p className="text-sm text-gray-500">
                        <i className="fas fa-clock mr-2"></i>
                        {new Date(notification.created_at).toLocaleString('fr-FR')}
                      </p>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      {!notification.is_read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
