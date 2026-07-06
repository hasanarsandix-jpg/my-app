import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert(error.message)
    } else {
      alert('Giriş başarılı!')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '200px', margin: '50px auto' }}>
      <h1>Login</h1>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <label>
        <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} />
        Beni Hatırla
      </label>
      <button onClick={handleLogin}>Giriş Yap</button>
      <Link href="/reset-password">Şifremi Unuttum</Link>
      <Link href="/signup">Kayıt Ol</Link>
    </div>
  )
}
