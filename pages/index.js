import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '50px auto', width: '200px' }}>
      <h1>Hoşgeldiniz</h1>
      <Link href="/login">Giriş Yap</Link>
      <Link href="/signup">Kayıt Ol</Link>
      <Link href="/reset-password">Şifremi Unuttum</Link>
    </div>
  )
}
