import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function UpdatePassword() {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        console.log('Password recovery mode aktif')
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const translateAuthMessage = (message = '') => {
    const normalized = message.toLowerCase()

    if (normalized.includes('password should be at least')) return 'Şifre en az 6 karakter olmalıdır.'
    if (normalized.includes('new password should be different')) return 'Yeni şifre eski şifreden farklı olmalıdır.'
    if (normalized.includes('for security purposes')) return 'Güvenlik nedeniyle bu işlemi kısa süre içinde tekrar isteyemezsiniz.'

    return message || 'Bir hata oluştu.'
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setMessageType('')

    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setMessageType('error')
      setMessage('Hata: ' + translateAuthMessage(error.message))
      setLoading(false)
    } else {
      setMessageType('success')
      setMessage('Şifre başarıyla güncellendi! Ana sayfaya yönlendiriliyorsunuz...')
      setTimeout(() => router.push('/'), 1500)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <form onSubmit={handleUpdate}>
        <h2>Yeni Şifre Belirle</h2>
        <input
          type="password"
          placeholder="Yeni şifre"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'İşleniyor...' : 'Şifreyi Güncelle'}
        </button>
        <p style={{ color: messageType === 'error' ? '#dc2626' : '#0f766e' }}>{message}</p>
      </form>
    </div>
  )
}
