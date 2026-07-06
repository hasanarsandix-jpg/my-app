import { supabase } from '../lib/supabaseClient'

const handleResetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://my-app-pi-bay-aujsz5lm1h.vercel.app/update-password'
  })
  if (error) {
    console.error(error.message)
  } else {
    console.log('Şifre sıfırlama maili gönderildi!')
  }
}
