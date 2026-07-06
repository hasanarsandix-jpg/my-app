import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function UpdatePassword() {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
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

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setMessage('Hata: ' + error.message)
      setLoading(false)
    } else {
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
        <p>{message}</p>
      </form>
    </div>
  )
}
