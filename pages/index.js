import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [activeTab, setActiveTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [remember, setRemember] = useState(false)

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else alert('Giriş başarılı!')
  }

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert('Kayıt başarılı!')
  }

  const handleReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) alert(error.message)
    else alert('Şifre sıfırlama maili gönderildi!')
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #1f1c2c, #928dab)',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.95)',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
        width: '420px',
        textAlign: 'center'
      }}>
        <h1 style={{ marginBottom: '25px', color: '#1f1c2c' }}>✨ Hoşgeldiniz ✨</h1>

        {/* Sekmeler */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
          <button onClick={() => setActiveTab('login')}
            style={{ flex: 1, padding: '10px', border: 'none', background: activeTab==='login' ? '#0070f3' : '#ccc', color: '#fff', borderRadius: '8px 0 0 8px' }}>
            Giriş Yap
          </button>
          <button onClick={() => setActiveTab('signup')}
            style={{ flex: 1, padding: '10px', border: 'none', background: activeTab==='signup' ? '#0070f3' : '#ccc', color: '#fff' }}>
            Kayıt Ol
          </button>
          <button onClick={() => setActiveTab('reset')}
            style={{ flex: 1, padding: '10px', border: 'none', background: activeTab==='reset' ? '#0070f3' : '#ccc', color: '#fff', borderRadius: '0 8px 8px 0' }}>
            Şifremi Unuttum
          </button>
        </div>

        {/* Formlar */}
        {activeTab === 'login' && (
          <div>
            <input type="email" placeholder="Email" style={{ marginBottom: '15px', padding: '12px', width: '100%', borderRadius: '8px' }} onChange={(e)=>setEmail(e.target.value)} />
            <input type="password" placeholder="Password" style={{ marginBottom: '15px', padding: '12px', width: '100%', borderRadius: '8px' }} onChange={(e)=>setPassword(e.target.value)} />
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <input type="checkbox" checked={remember} onChange={()=>setRemember(!remember)} />
              <span style={{ marginLeft: '8px' }}>Beni Hatırla</span>
            </label>
            <button onClick={handleLogin} style={{ background: 'linear-gradient(90deg,#0070f3,#00c6ff)', color:'#fff', padding:'12px', width:'100%', border:'none', borderRadius:'8px', fontWeight:'bold' }}>
              🚀 Giriş Yap
            </button>
          </div>
        )}

        {activeTab === 'signup' && (
          <div>
            <input type="text" placeholder="İsim" style={{ marginBottom: '15px', padding: '12px', width: '100%', borderRadius: '8px' }} onChange={(e)=>setName(e.target.value)} />
            <input type="email" placeholder="Email" style={{ marginBottom: '15px', padding: '12px', width: '100%', borderRadius: '8px' }} onChange={(e)=>setEmail(e.target.value)} />
            <input type="password" placeholder="Password" style={{ marginBottom: '15px', padding: '12px', width: '100%', borderRadius: '8px' }} onChange={(e)=>setPassword(e.target.value)} />
            <button onClick={handleSignUp} style={{ background: 'linear-gradient(90deg,#0070f3,#00c6ff)', color:'#fff', padding:'12px', width:'100%', border:'none', borderRadius:'8px', fontWeight:'bold' }}>
              ✨ Kayıt Ol
            </button>
          </div>
        )}

        {activeTab === 'reset' && (
          <div>
            <input type="email" placeholder="Email" style={{ marginBottom: '15px', padding: '12px', width: '100%', borderRadius: '8px' }} onChange={(e)=>setEmail(e.target.value)} />
            <button onClick={handleReset} style={{ background: 'linear-gradient(90deg,#0070f3,#00c6ff)', color:'#fff', padding:'12px', width:'100%', border:'none', borderRadius:'8px', fontWeight:'bold' }}>
              🔑 Mail Gönder
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
