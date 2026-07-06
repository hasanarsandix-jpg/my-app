import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ResetPassword() {
  const [email, setEmail] = useState('')

  const handleReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) {
      alert(error.message)
    } else {
      alert('Şifre sıfırlama maili gönderildi!')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '200px', margin: '50px auto' }}>
      <h1>Şifre Sıfırlama</h1>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleReset}>Mail Gönder</button>
    </div>
  )
}
