import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' && router.pathname !== '/update-password') {
        router.replace('/update-password')
      }
    })

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined)
    }

    return () => {
      authListener?.subscription?.unsubscribe?.()
    }
  }, [router])

  return <>
    <Component {...pageProps} />
  </>
}
