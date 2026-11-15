'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function MessagesPage() {
  const [user, setUser] = useState<any>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchConversations()
    }
  }, [user])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id)
      const subscription = supabase
        .channel(`messages:${selectedConversation.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${user.id}`
        }, (payload) => {
          setMessages(prev => [...prev, payload.new])
        })
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [selectedConversation, user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

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

  const fetchConversations = async () => {
    const { data: sentMessages } = await supabase
      .from('messages')
      .select('receiver_id, users!messages_receiver_id_fkey(*)')
      .eq('sender_id', user.id)

    const { data: receivedMessages } = await supabase
      .from('messages')
      .select('sender_id, users!messages_sender_id_fkey(*)')
      .eq('receiver_id', user.id)

    const conversationMap = new Map()

    sentMessages?.forEach((msg: any) => {
      const key = msg.receiver_id
      if (!conversationMap.has(key)) {
        conversationMap.set(key, {
          id: key,
          user: msg.users,
          lastMessage: msg,
        })
      }
    })

    receivedMessages?.forEach((msg: any) => {
      const key = msg.sender_id
      if (!conversationMap.has(key)) {
        conversationMap.set(key, {
          id: key,
          user: msg.users,
          lastMessage: msg,
        })
      }
    })

    setConversations(Array.from(conversationMap.values()))
    setLoading(false)
  }

  const fetchMessages = async (conversationId: string) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .or(`sender_id.eq.${conversationId},receiver_id.eq.${conversationId}`)
      .order('created_at', { ascending: true })

    if (data) {
      const filtered = data.filter((msg: any) =>
        (msg.sender_id === user.id && msg.receiver_id === conversationId) ||
        (msg.sender_id === conversationId && msg.receiver_id === user.id)
      )
      setMessages(filtered)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id: selectedConversation.id,
        content: newMessage,
        is_read: false
      })

    if (!error) {
      setNewMessage('')
      fetchMessages(selectedConversation.id)
    }
  }

  const markAsRead = async (messageId: string) => {
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId)
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
        <h1 className="text-3xl font-bold mb-8">Messagerie</h1>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 250px)' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <i className="fas fa-comments text-4xl mb-4"></i>
                  <p>Aucune conversation</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                      selectedConversation?.id === conv.id ? 'bg-green-50' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {conv.user?.first_name?.[0]}{conv.user?.last_name?.[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {conv.user?.first_name} {conv.user?.last_name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {conv.user?.specialty || 'Patient'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {selectedConversation.user?.first_name?.[0]}{selectedConversation.user?.last_name?.[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {selectedConversation.user?.first_name} {selectedConversation.user?.last_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {selectedConversation.user?.specialty || 'Patient'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <i className="fas fa-paper-plane text-4xl mb-4"></i>
                        <p>Commencez la conversation</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.sender_id === user.id
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-800'
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender_id === user.id ? 'text-green-100' : 'text-gray-500'
                            }`}>
                              {new Date(message.created_at).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Écrivez votre message..."
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        <i className="fas fa-paper-plane"></i>
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <i className="fas fa-comments text-6xl mb-4"></i>
                    <p>Sélectionnez une conversation pour commencer</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
