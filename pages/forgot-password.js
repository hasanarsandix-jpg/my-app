import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleResetPassword = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://my-app-pi-bay-aujsz5lm1h.vercel.app/update-password'
    })
    if (error) {
      setMessage('Hata: ' + error.message)
    } else {
      setMessage('Şifre sıfırlama maili gönderildi!')
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <form onSubmit={handleResetPassword}>
        <h2>Şifremi Unuttum</h2>
        <input
          type="email"
          placeholder="Email adresiniz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Mail Gönder</button>
        <p>{message}</p>
      </form>
    </div>
  )
}
