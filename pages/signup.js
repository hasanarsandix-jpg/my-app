import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      alert(error.message)
    } else {
      alert('Kayıt başarılı! Lütfen giriş yapın.')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '200px', margin: '50px auto' }}>
      <h1>Sign Up</h1>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignUp}>Kayıt Ol</button>
    </div>
  )
}
