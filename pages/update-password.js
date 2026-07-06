import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleUpdate = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setMessage('Hata: ' + error.message)
    } else {
      setMessage('Şifre başarıyla güncellendi!')
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
        <button type="submit">Şifreyi Güncelle</button>
        <p>{message}</p>
      </form>
    </div>
  )
}
