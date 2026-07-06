import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'

const tabStyle = {
  flex: 1,
  border: 'none',
  padding: '10px 12px',
  borderRadius: '999px',
  cursor: 'pointer',
  fontWeight: 700,
  color: '#334155',
  background: '#e2e8f0',
  transition: 'all 0.2s ease'
}

const normalizeEmail = (value = '') => value.trim().toLowerCase()

const isValidEmail = (value = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(value))

const translateAuthMessage = (message = '') => {
  const normalized = message.toLowerCase()

  if (normalized.includes('invalid login credentials')) return 'E-posta veya şifre hatalı.'
  if (normalized.includes('email not confirmed')) return 'E-posta adresinizi doğrulamanız gerekiyor.'
  if (normalized.includes('user already registered')) return 'Bu e-posta adresi zaten kayıtlı.'
  if (normalized.includes('password should be at least')) return 'Şifre en az 6 karakter olmalıdır.'
  if (normalized.includes('signup requires')) return 'Kayıt için geçerli bir şifre girmeniz gerekiyor.'
  if (normalized.includes('new password should be different')) return 'Yeni şifre eski şifreden farklı olmalıdır.'
  if (normalized.includes('for security purposes')) return 'Güvenlik nedeniyle bu işlemi kısa süre içinde tekrar isteyemezsiniz.'
  if (normalized.includes('email is invalid')) return 'Geçersiz e-posta adresi.'
  if (normalized.includes('missing required parameter')) return 'Zorunlu alanları doldurunuz.'

  return message || 'Bir hata oluştu.'
}

export default function AuthCard({ initialTab = 'login' }) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const savedEmail = window.localStorage.getItem('auth-email') || ''
    const savedRemember = window.localStorage.getItem('auth-remember') === 'true'
    setEmail(normalizeEmail(savedEmail))
    setRemember(savedRemember)
  }, [])

  useEffect(() => {
    setMessage('')
    setMessageType('')
  }, [activeTab])

  const saveRememberChoice = (value) => {
    if (typeof window === 'undefined') return

    const normalizedEmail = normalizeEmail(email)

    if (value) {
      window.localStorage.setItem('auth-email', normalizedEmail)
      window.localStorage.setItem('auth-remember', 'true')
    } else {
      window.localStorage.removeItem('auth-email')
      window.localStorage.removeItem('auth-remember')
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const normalizedEmail = normalizeEmail(email)

    if (!isValidEmail(normalizedEmail)) {
      setMessageType('error')
      setMessage('Lütfen geçerli bir e-posta adresi girin.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password })
    if (error) {
      setMessageType('error')
      setMessage(translateAuthMessage(error.message))
    } else {
      saveRememberChoice(remember)
      setMessageType('success')
      setMessage('Giriş başarılı! Hoş geldiniz.')
    }
    setLoading(false)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const redirectTo = typeof window !== 'undefined'
      ? `${window.location.origin}/update-password`
      : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://my-app-pi-bay-aujsz5lm1h.vercel.app'}/update-password`

    const normalizedEmail = normalizeEmail(email)

    if (!isValidEmail(normalizedEmail)) {
      setMessageType('error')
      setMessage('Lütfen geçerli bir e-posta adresi girin.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: { data: { full_name: name }, emailRedirectTo: redirectTo }
    })

    if (error) {
      setMessageType('error')
      setMessage(translateAuthMessage(error.message))
    } else {
      setMessageType('success')
      setMessage('Kayıt başarılı. Lütfen e-postanızı kontrol edin.')
    }
    setLoading(false)
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const redirectTo = typeof window !== 'undefined'
      ? `${window.location.origin}/update-password`
      : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://my-app-pi-bay-aujsz5lm1h.vercel.app'}/update-password`

    const normalizedEmail = normalizeEmail(email)

    if (!isValidEmail(normalizedEmail)) {
      setMessageType('error')
      setMessage('Lütfen geçerli bir e-posta adresi girin.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, { redirectTo })
    if (error) {
      setMessageType('error')
      setMessage(translateAuthMessage(error.message))
    } else {
      setMessageType('success')
      setMessage('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 50%, #38bdf8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: 'rgba(255,255,255,0.96)', borderRadius: '24px', boxShadow: '0 20px 50px rgba(15, 23, 42, 0.3)', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔐</div>
          <h1 style={{ margin: '0 0 8px', color: '#0f172a', fontSize: '28px' }}>Hoş Geldiniz</h1>
          <p style={{ margin: 0, color: '#64748b' }}>Giriş yapın, kayıt olun veya şifrenizi yenileyin.</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <button type="button" onClick={() => setActiveTab('login')} style={{ ...tabStyle, background: activeTab === 'login' ? '#2563eb' : '#e2e8f0', color: activeTab === 'login' ? '#fff' : '#334155' }}>
            Giriş Yap
          </button>
          <button type="button" onClick={() => setActiveTab('signup')} style={{ ...tabStyle, background: activeTab === 'signup' ? '#2563eb' : '#e2e8f0', color: activeTab === 'signup' ? '#fff' : '#334155' }}>
            Kayıt Ol
          </button>
          <button type="button" onClick={() => setActiveTab('forgot')} style={{ ...tabStyle, background: activeTab === 'forgot' ? '#2563eb' : '#e2e8f0', color: activeTab === 'forgot' ? '#fff' : '#334155' }}>
            Şifremi Unuttum
          </button>
        </div>

        {activeTab === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'grid', gap: '12px' }}>
            <input type="email" placeholder="E-posta adresiniz" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
            <input type="password" placeholder="Şifreniz" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px' }}>
              <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} />
              Beni hatırla
            </label>
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? 'İşleniyor...' : 'Giriş Yap'}
            </button>
          </form>
        )}

        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} style={{ display: 'grid', gap: '12px' }}>
            <input type="text" placeholder="Adınız Soyadınız" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
            <input type="email" placeholder="E-posta adresiniz" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
            <input type="password" placeholder="Şifreniz" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? 'İşleniyor...' : 'Kayıt Ol'}
            </button>
          </form>
        )}

        {activeTab === 'forgot' && (
          <form onSubmit={handleReset} style={{ display: 'grid', gap: '12px' }}>
            <input type="email" placeholder="E-posta adresiniz" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
            </button>
          </form>
        )}

        {message ? (
          <p style={{ marginTop: '16px', color: messageType === 'error' ? '#dc2626' : '#0f766e', fontSize: '14px', textAlign: 'center' }}>{message}</p>
        ) : null}

        <div style={{ marginTop: '18px', textAlign: 'center', fontSize: '14px', color: '#475569' }}>
          <Link href="/login" style={{ color: '#2563eb', marginRight: '10px' }}>Giriş Sayfası</Link>
          <Link href="/signup" style={{ color: '#2563eb' }}>Kayıt Sayfası</Link>
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '12px',
  border: '1px solid #cbd5e1',
  outline: 'none',
  fontSize: '15px',
  boxSizing: 'border-box'
}

const buttonStyle = {
  width: '100%',
  padding: '12px 14px',
  border: 'none',
  borderRadius: '12px',
  background: 'linear-gradient(90deg, #2563eb, #38bdf8)',
  color: '#fff',
  fontWeight: 700,
  cursor: 'pointer',
  fontSize: '15px'
}
