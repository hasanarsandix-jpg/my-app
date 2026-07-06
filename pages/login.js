import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert(error.message)
    } else {
      alert('Giriş başarılı!')
    }
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #1f1c2c, #928dab)'
    }}>
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.95)',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
        width: '350px',
        textAlign: 'center',
        fontFamily: 'Segoe UI, sans-serif'
      }}>
        <h1 style={{ marginBottom: '25px', color: '#1f1c2c' }}>✨ Lüks Giriş ✨</h1>
        
        <input type="email" placeholder="Email"
          style={{ marginBottom: '15px', padding: '12px', width: '100%', border: '1px solid #ccc', borderRadius: '8px' }}
          onChange={(e) => setEmail(e.target.value)} />
        
        <input type="password" placeholder="Password"
          style={{ marginBottom: '15px', padding: '12px', width: '100%', border: '1px solid #ccc', borderRadius: '8px' }}
          onChange={(e) => setPassword(e.target.value)} />
        
        <button onClick={handleLogin}
          style={{
            background: 'linear-gradient(90deg, #0070f3, #00c6ff)',
            color: '#fff', padding: '12px', width: '100%',
            border: 'none', borderRadius: '8px',
            fontWeight: 'bold', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
          🚀 Giriş Yap
        </button>
        
        <div style={{ marginTop: '20px', fontSize: '14px' }}>
          <Link href="/reset-password" style={{ marginRight: '10px', color: '#0070f3' }}>Şifremi Unuttum</Link>
          <Link href="/signup" style={{ color: '#0070f3' }}>Kayıt Ol</Link>
        </div>
      </div>
    </div>
  )
}
