import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Activity, BellRing, Bug, LayoutGrid, LogOut, ShieldCheck, UserCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

const initialColonies = [
  {
    id: 1,
    name: 'Ana Koloni 01',
    location: 'Güney Bahçe',
    strength: 'Çok güçlü',
    health: 'İyi',
    queenAge: '1 yıl',
    honey: 18,
    brood: 'Dengeli',
    food: 'İyi',
    temperature: 'Normal',
    lastInspection: '2 saat önce',
    notes: 'Bal üretimi düzenli. Sürüler aktif.',
    inspectionLogs: [
      { id: 1, title: 'Sabah kontrolü', detail: 'Çalışma aktivitesi yüksek. Besleme yeterli.', time: 'Bugün 07:30' }
    ]
  },
  {
    id: 2,
    name: 'Ana Koloni 02',
    location: 'Doğu Arıhane',
    strength: 'Orta',
    health: 'Dikkat',
    queenAge: '8 ay',
    honey: 11,
    brood: 'Azalmış',
    food: 'Orta',
    temperature: 'Düşük',
    lastInspection: 'Bugün sabah',
    notes: 'Besleme takibi devam ediyor.',
    inspectionLogs: [
      { id: 2, title: 'Öğle takibi', detail: 'Besleme ve su ihtiyacı değerlendirildi.', time: 'Bugün 12:10' }
    ]
  },
  {
    id: 3,
    name: 'Ana Koloni 03',
    location: 'Kuzey Çardak',
    strength: 'Güçlü',
    health: 'İyi',
    queenAge: '2 yıl',
    honey: 22,
    brood: 'Güçlü',
    food: 'İyi',
    temperature: 'Normal',
    lastInspection: 'Dün',
    notes: 'Yüksek verim, düzenli kontrol gerekli.',
    inspectionLogs: [
      { id: 3, title: 'Haftalık kontrol', detail: 'Kovan temizliği ve kontrol tamamlandı.', time: 'Dün 18:00' }
    ]
  }
]

const statusStyles = {
  İyi: { background: '#dcfce7', color: '#166534' },
  Dikkat: { background: '#fef3c7', color: '#92400e' },
  Riskli: { background: '#fee2e2', color: '#b91c1c' }
}

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authUser, setAuthUser] = useState(null)
  const [profileName, setProfileName] = useState('')
  const [profilePhone, setProfilePhone] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')
  const [colonies, setColonies] = useState(initialColonies)
  const [activeView, setActiveView] = useState('overview')
  const [selectedColonyId, setSelectedColonyId] = useState(1)
  const [newColony, setNewColony] = useState({ name: '', location: '', strength: 'Güçlü', health: 'İyi', queenAge: '', honey: '10', brood: 'Dengeli', food: 'İyi', temperature: 'Normal', notes: '' })
  const [inspection, setInspection] = useState({ title: '', detail: '', health: 'İyi', food: 'İyi', temperature: 'Normal' })
  const [reminders, setReminders] = useState([
    { id: 1, title: 'Besleme kontrolü', detail: 'Ana Koloni 02 için şurup takvimi', priority: 'Yüksek', done: false },
    { id: 2, title: 'Haftalık kontrol', detail: 'Kovan temizliği ve hava akışı kontrolü', priority: 'Orta', done: false },
    { id: 3, title: 'Ana arı kontrolü', detail: 'Ana arı canlılığı ve yavru durumu', priority: 'Yüksek', done: true }
  ])
  const [newReminder, setNewReminder] = useState({ title: '', detail: '', priority: 'Orta' })
  const [backupMessage, setBackupMessage] = useState('')

  useEffect(() => {
    let active = true

    const initialize = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.replace('/login')
        return
      }

      if (!active) return
      setAuthUser(session.user)
      setProfileName(session.user.user_metadata?.full_name || session.user.email || '')
      setProfilePhone(session.user.user_metadata?.phone || '')
      setLoading(false)
    }

    initialize()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.replace('/login')
        return
      }

      setAuthUser(session.user)
      setProfileName(session.user.user_metadata?.full_name || session.user.email || '')
      setProfilePhone(session.user.user_metadata?.phone || '')
    })

    return () => {
      active = false
      authListener?.subscription?.unsubscribe?.()
    }
  }, [router])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const storedColonies = window.localStorage.getItem('bee-colonies')
    const storedProfile = window.localStorage.getItem('bee-profile')

    if (storedColonies) {
      try {
        const parsed = JSON.parse(storedColonies)
        if (Array.isArray(parsed) && parsed.length) {
          setColonies(parsed)
          setSelectedColonyId(parsed[0].id)
        }
      } catch {
        window.localStorage.removeItem('bee-colonies')
      }
    }

    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile)
        setProfileName(parsedProfile.name || '')
        setProfilePhone(parsedProfile.phone || '')
      } catch {
        window.localStorage.removeItem('bee-profile')
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('bee-colonies', JSON.stringify(colonies))
    }
  }, [colonies])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('bee-profile', JSON.stringify({ name: profileName, phone: profilePhone }))
    }
  }, [profileName, profilePhone])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedReminders = window.localStorage.getItem('bee-reminders')
      if (storedReminders) {
        try {
          const parsed = JSON.parse(storedReminders)
          if (Array.isArray(parsed)) {
            setReminders(parsed)
          }
        } catch {
          window.localStorage.removeItem('bee-reminders')
        }
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('bee-reminders', JSON.stringify(reminders))
    }
  }, [reminders])

  const totalHoney = useMemo(() => colonies.reduce((sum, colony) => sum + Number(colony.honey || 0), 0), [colonies])
  const healthyColonies = useMemo(() => colonies.filter((colony) => colony.health === 'İyi').length, [colonies])
  const alertingColonies = useMemo(() => colonies.filter((colony) => colony.health !== 'İyi').length, [colonies])
  const pendingReminders = useMemo(() => reminders.filter((item) => !item.done).length, [reminders])
  const selectedColony = colonies.find((colony) => colony.id === selectedColonyId) || colonies[0] || null

  const handleProfileSave = async (event) => {
    event.preventDefault()
    setSavingProfile(true)
    setProfileMessage('')
    setProfileError('')

    const { error } = await supabase.auth.updateUser({ data: { full_name: profileName, phone: profilePhone } })

    if (error) {
      setProfileError(error.message || 'Profil güncellenemedi.')
    } else {
      setProfileMessage('Profil bilgileri başarıyla güncellendi.')
    }

    setSavingProfile(false)
  }

  const handlePasswordReset = async () => {
    if (!authUser?.email) return
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/update-password` : undefined
    const { error } = await supabase.auth.resetPasswordForEmail(authUser.email, redirectTo ? { redirectTo } : undefined)

    if (error) {
      setProfileError(error.message || 'Şifre sıfırlama e-postası gönderilemedi.')
    } else {
      setProfileMessage('Şifre sıfırlama bağlantısı e-postanıza gönderildi.')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  const updateColonyField = (id, field, value) => {
    setColonies((current) => current.map((colony) => colony.id === id ? { ...colony, [field]: value } : colony))
  }

  const handleAddColony = (event) => {
    event.preventDefault()
    if (!newColony.name || !newColony.location) return

    const nextColony = {
      id: Date.now(),
      name: newColony.name,
      location: newColony.location,
      strength: newColony.strength,
      health: newColony.health,
      queenAge: newColony.queenAge || 'Yeni',
      honey: Number(newColony.honey || 0),
      brood: newColony.brood,
      food: newColony.food,
      temperature: newColony.temperature,
      lastInspection: 'Az önce eklendi',
      notes: newColony.notes || 'Yeni koloniyi izlemeye başladınız.',
      inspectionLogs: [{ id: Date.now(), title: 'Koloni eklendi', detail: 'Yeni takip kaydı oluşturuldu.', time: 'Şimdi' }]
    }

    setColonies((current) => [nextColony, ...current])
    setSelectedColonyId(nextColony.id)
    setNewColony({ name: '', location: '', strength: 'Güçlü', health: 'İyi', queenAge: '', honey: '10', brood: 'Dengeli', food: 'İyi', temperature: 'Normal', notes: '' })
    setActiveView('colonies')
  }

  const handleInspectionSave = (event) => {
    event.preventDefault()
    if (!selectedColony || !inspection.title) return

    const entry = {
      id: Date.now(),
      title: inspection.title,
      detail: inspection.detail || 'Kontrol kaydı eklendi.',
      time: 'Şimdi'
    }

    setColonies((current) => current.map((colony) => colony.id === selectedColony.id ? {
      ...colony,
      health: inspection.health,
      food: inspection.food,
      temperature: inspection.temperature,
      lastInspection: 'Şimdi',
      inspectionLogs: [entry, ...(colony.inspectionLogs || [])].slice(0, 6)
    } : colony))

    setInspection({ title: '', detail: '', health: 'İyi', food: 'İyi', temperature: 'Normal' })
  }

  const handleAddReminder = (event) => {
    event.preventDefault()
    if (!newReminder.title) return

    setReminders((current) => [{ id: Date.now(), title: newReminder.title, detail: newReminder.detail || 'Takip planı eklendi.', priority: newReminder.priority, done: false }, ...current])
    setNewReminder({ title: '', detail: '', priority: 'Orta' })
  }

  const toggleReminder = (id) => {
    setReminders((current) => current.map((item) => item.id === id ? { ...item, done: !item.done } : item))
  }

  const handleExportData = () => {
    const payload = { colonies, reminders, profile: { name: profileName, phone: profilePhone } }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'ariligim-verileri.json'
    link.click()
    URL.revokeObjectURL(url)
    setBackupMessage('Verileriniz başarıyla indirildi.')
  }

  const handleImportData = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        if (parsed?.colonies) setColonies(parsed.colonies)
        if (parsed?.reminders) setReminders(parsed.reminders)
        if (parsed?.profile) {
          setProfileName(parsed.profile.name || '')
          setProfilePhone(parsed.profile.phone || '')
        }
        setBackupMessage('Veriler başarıyla yüklendi.')
      } catch {
        setBackupMessage('Dosya okunamadı. Lütfen geçerli bir yedek dosyası seçin.')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  if (loading) {
    return (
      <div style={pageShellStyle}>
        <div style={loadingCardStyle}>Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div style={pageShellStyle}>
      <div style={dashboardCardStyle}>
        <div style={headerStyle}>
          <div>
            <p style={eyebrowStyle}>ARILIĞIM • Profesyonel Arılık Yönetimi</p>
            <h1 style={titleStyle}>Koloni takibini mobil uygulama gibi yönetin.</h1>
            <p style={subtitleStyle}>Sağlık, besleme, sıcaklık ve bakım planlarını tek ekrandan takip edin.</p>
          </div>
          <button type="button" onClick={handleLogout} style={ghostButtonStyle}><LogOut size={16} style={{ marginRight: '6px' }} />Çıkış</button>
        </div>

        <div style={navRowStyle}>
          <button type="button" onClick={() => setActiveView('overview')} style={{ ...pillButtonStyle, background: activeView === 'overview' ? '#2563eb' : '#eef2ff', color: activeView === 'overview' ? '#fff' : '#334155' }}><LayoutGrid size={16} style={{ marginRight: '6px' }} />Genel Bakış</button>
          <button type="button" onClick={() => setActiveView('colonies')} style={{ ...pillButtonStyle, background: activeView === 'colonies' ? '#2563eb' : '#eef2ff', color: activeView === 'colonies' ? '#fff' : '#334155' }}><Bug size={16} style={{ marginRight: '6px' }} />Koloniler</button>
          <button type="button" onClick={() => setActiveView('inspect')} style={{ ...pillButtonStyle, background: activeView === 'inspect' ? '#2563eb' : '#eef2ff', color: activeView === 'inspect' ? '#fff' : '#334155' }}><Activity size={16} style={{ marginRight: '6px' }} />Kontrol</button>
          <button type="button" onClick={() => setActiveView('tasks')} style={{ ...pillButtonStyle, background: activeView === 'tasks' ? '#2563eb' : '#eef2ff', color: activeView === 'tasks' ? '#fff' : '#334155' }}><BellRing size={16} style={{ marginRight: '6px' }} />Hatırlatıcılar</button>
          <button type="button" onClick={() => setActiveView('profile')} style={{ ...pillButtonStyle, background: activeView === 'profile' ? '#2563eb' : '#eef2ff', color: activeView === 'profile' ? '#fff' : '#334155' }}><UserCircle2 size={16} style={{ marginRight: '6px' }} />Profil</button>
        </div>

        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <span style={statLabelStyle}>Toplam Koloni</span>
            <strong style={statValueStyle}>{colonies.length}</strong>
          </div>
          <div style={statCardStyle}>
            <span style={statLabelStyle}>Sağlıklı Koloni</span>
            <strong style={statValueStyle}>{healthyColonies}</strong>
          </div>
          <div style={statCardStyle}>
            <span style={statLabelStyle}>Dikkat Gerekli</span>
            <strong style={statValueStyle}>{alertingColonies}</strong>
          </div>
          <div style={statCardStyle}>
            <span style={statLabelStyle}>Toplam Bal</span>
            <strong style={statValueStyle}>{totalHoney} kg</strong>
          </div>
          <div style={statCardStyle}>
            <span style={statLabelStyle}>Bekleyen Hatırlatıcı</span>
            <strong style={statValueStyle}>{pendingReminders}</strong>
          </div>
        </div>

        {activeView === 'overview' && (
          <div style={contentGridStyle}>
            <div style={panelStyle}>
              <h2 style={panelTitleStyle}>Bugünkü arılık durumu</h2>
              <ul style={listStyle}>
                <li>Kolonilerde aktif uçuş gözlemlendi.</li>
                <li>Besleme ve su takibi güncellendi.</li>
                <li>Bal verimi haftalık artış gösteriyor.</li>
              </ul>
            </div>
            <div style={panelStyle}>
              <h2 style={panelTitleStyle}><ShieldCheck size={16} style={{ marginRight: '6px' }} />Hızlı görevler</h2>
              <ul style={listStyle}>
                <li>Öğleden sonra bir kolonide besleme ekle.</li>
                <li>İki kolonide sıcaklık kontrolü yap.</li>
                <li>Çiftlik notlarını güncelle.</li>
              </ul>
            </div>
            <div style={panelStyle}>
              <h2 style={panelTitleStyle}><BellRing size={16} style={{ marginRight: '6px' }} />Bugünkü hatırlatıcılar</h2>
              <div style={{ display: 'grid', gap: '8px' }}>
                {reminders.filter((item) => !item.done).slice(0, 3).map((item) => (
                  <div key={item.id} style={{ border: '1px solid #dbeafe', borderRadius: '12px', padding: '10px', background: '#fff' }}>
                    <strong style={{ color: '#0f172a' }}>{item.title}</strong>
                    <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '12px' }}>{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'colonies' && (
          <div style={{ display: 'grid', gap: '16px' }}>
            <form onSubmit={handleAddColony} style={panelStyle}>
              <h2 style={panelTitleStyle}>Yeni koloni ekle</h2>
              <div style={detailGridStyle}>
                <label style={fieldLabelStyle}>Koloni adı<input value={newColony.name} onChange={(event) => setNewColony({ ...newColony, name: event.target.value })} style={inputStyle} /></label>
                <label style={fieldLabelStyle}>Konum<input value={newColony.location} onChange={(event) => setNewColony({ ...newColony, location: event.target.value })} style={inputStyle} /></label>
                <label style={fieldLabelStyle}>Durum<select value={newColony.health} onChange={(event) => setNewColony({ ...newColony, health: event.target.value })} style={selectStyle}><option value="İyi">İyi</option><option value="Dikkat">Dikkat</option><option value="Riskli">Riskli</option></select></label>
                <label style={fieldLabelStyle}>Güç<select value={newColony.strength} onChange={(event) => setNewColony({ ...newColony, strength: event.target.value })} style={selectStyle}><option value="Güçlü">Güçlü</option><option value="Orta">Orta</option><option value="Zayıf">Zayıf</option></select></label>
                <label style={fieldLabelStyle}>Ana arı yaşı<input value={newColony.queenAge} onChange={(event) => setNewColony({ ...newColony, queenAge: event.target.value })} style={inputStyle} /></label>
                <label style={fieldLabelStyle}>Bal (kg)<input type="number" value={newColony.honey} onChange={(event) => setNewColony({ ...newColony, honey: event.target.value })} style={inputStyle} /></label>
                <label style={fieldLabelStyle}>Yavruluk<select value={newColony.brood} onChange={(event) => setNewColony({ ...newColony, brood: event.target.value })} style={selectStyle}><option value="Dengeli">Dengeli</option><option value="Azalmış">Azalmış</option><option value="Güçlü">Güçlü</option></select></label>
                <label style={fieldLabelStyle}>Besleme<select value={newColony.food} onChange={(event) => setNewColony({ ...newColony, food: event.target.value })} style={selectStyle}><option value="İyi">İyi</option><option value="Orta">Orta</option><option value="Zayıf">Zayıf</option></select></label>
              </div>
              <label style={fieldLabelStyle}>Notlar<textarea value={newColony.notes} onChange={(event) => setNewColony({ ...newColony, notes: event.target.value })} style={textareaStyle} rows={3} /></label>
              <button type="submit" style={primaryButtonStyle}>Koloni Ekle</button>
            </form>

            <div style={coloniesGridStyle}>
              {colonies.map((colony) => (
                <button key={colony.id} type="button" onClick={() => { setSelectedColonyId(colony.id); setActiveView('inspect') }} style={{ ...colonyCardStyle, textAlign: 'left', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <div>
                      <h3 style={{ margin: '0', fontSize: '18px', color: '#0f172a' }}>{colony.name}</h3>
                      <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>{colony.location}</p>
                    </div>
                    <span style={{ ...statusBadgeStyle, ...statusStyles[colony.health] }}>{colony.health}</span>
                  </div>

                  <div style={detailGridStyle}>
                    <div><span style={detailLabelStyle}>Güç</span><strong style={detailValueStyle}>{colony.strength}</strong></div>
                    <div><span style={detailLabelStyle}>Bal</span><strong style={detailValueStyle}>{colony.honey} kg</strong></div>
                    <div><span style={detailLabelStyle}>Yavruluk</span><strong style={detailValueStyle}>{colony.brood}</strong></div>
                    <div><span style={detailLabelStyle}>Besleme</span><strong style={detailValueStyle}>{colony.food}</strong></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeView === 'inspect' && selectedColony && (
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={panelStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                <div>
                  <h2 style={panelTitleStyle}>{selectedColony.name}</h2>
                  <p style={{ margin: '0', color: '#64748b' }}>{selectedColony.location}</p>
                </div>
                <span style={{ ...statusBadgeStyle, ...statusStyles[selectedColony.health] }}>{selectedColony.health}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginTop: '12px' }}>
                <div style={miniCardStyle}><span style={detailLabelStyle}>Ana arı yaşı</span><strong style={detailValueStyle}>{selectedColony.queenAge}</strong></div>
                <div style={miniCardStyle}><span style={detailLabelStyle}>Sıcaklık</span><strong style={detailValueStyle}>{selectedColony.temperature}</strong></div>
                <div style={miniCardStyle}><span style={detailLabelStyle}>Besleme</span><strong style={detailValueStyle}>{selectedColony.food}</strong></div>
                <div style={miniCardStyle}><span style={detailLabelStyle}>Yavruluk</span><strong style={detailValueStyle}>{selectedColony.brood}</strong></div>
              </div>
            </div>

            <form onSubmit={handleInspectionSave} style={panelStyle}>
              <h2 style={panelTitleStyle}>Yeni kontrol kaydı</h2>
              <div style={{ display: 'grid', gap: '10px' }}>
                <label style={fieldLabelStyle}>Başlık<input value={inspection.title} onChange={(event) => setInspection({ ...inspection, title: event.target.value })} style={inputStyle} /></label>
                <label style={fieldLabelStyle}>Detay<textarea value={inspection.detail} onChange={(event) => setInspection({ ...inspection, detail: event.target.value })} style={textareaStyle} rows={3} /></label>
                <label style={fieldLabelStyle}>Durum<select value={inspection.health} onChange={(event) => setInspection({ ...inspection, health: event.target.value })} style={selectStyle}><option value="İyi">İyi</option><option value="Dikkat">Dikkat</option><option value="Riskli">Riskli</option></select></label>
                <label style={fieldLabelStyle}>Besleme<select value={inspection.food} onChange={(event) => setInspection({ ...inspection, food: event.target.value })} style={selectStyle}><option value="İyi">İyi</option><option value="Orta">Orta</option><option value="Zayıf">Zayıf</option></select></label>
                <label style={fieldLabelStyle}>Sıcaklık<select value={inspection.temperature} onChange={(event) => setInspection({ ...inspection, temperature: event.target.value })} style={selectStyle}><option value="Normal">Normal</option><option value="Düşük">Düşük</option><option value="Yüksek">Yüksek</option></select></label>
                <button type="submit" style={primaryButtonStyle}>Kontrol Kaydını Ekle</button>
              </div>
            </form>

            <div style={panelStyle}>
              <h2 style={panelTitleStyle}>Son kayıtlar</h2>
              <div style={{ display: 'grid', gap: '10px' }}>
                {(selectedColony.inspectionLogs || []).map((log) => (
                  <div key={log.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ color: '#0f172a' }}>{log.title}</strong>
                      <span style={{ color: '#64748b', fontSize: '12px' }}>{log.time}</span>
                    </div>
                    <p style={{ margin: '6px 0 0', color: '#475569', fontSize: '13px' }}>{log.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'tasks' && (
          <div style={{ display: 'grid', gap: '16px' }}>
            <form onSubmit={handleAddReminder} style={panelStyle}>
              <h2 style={panelTitleStyle}>Yeni hatırlatıcı ekle</h2>
              <div style={{ display: 'grid', gap: '10px' }}>
                <label style={fieldLabelStyle}>Başlık<input value={newReminder.title} onChange={(event) => setNewReminder({ ...newReminder, title: event.target.value })} style={inputStyle} /></label>
                <label style={fieldLabelStyle}>Detay<textarea value={newReminder.detail} onChange={(event) => setNewReminder({ ...newReminder, detail: event.target.value })} style={textareaStyle} rows={3} /></label>
                <label style={fieldLabelStyle}>Öncelik<select value={newReminder.priority} onChange={(event) => setNewReminder({ ...newReminder, priority: event.target.value })} style={selectStyle}><option value="Yüksek">Yüksek</option><option value="Orta">Orta</option><option value="Düşük">Düşük</option></select></label>
                <button type="submit" style={primaryButtonStyle}>Hatırlatıcı Ekle</button>
              </div>
            </form>
            <div style={panelStyle}>
              <h2 style={panelTitleStyle}>Planlı işler</h2>
              <div style={{ display: 'grid', gap: '10px' }}>
                {reminders.map((item) => (
                  <button key={item.id} type="button" onClick={() => toggleReminder(item.id)} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px', textAlign: 'left', background: item.done ? '#f0fdf4' : '#fff', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' }}>
                      <strong style={{ color: '#0f172a', textDecoration: item.done ? 'line-through' : 'none' }}>{item.title}</strong>
                      <span style={{ color: item.priority === 'Yüksek' ? '#b91c1c' : item.priority === 'Orta' ? '#92400e' : '#2563eb', fontSize: '12px', fontWeight: 700 }}>{item.priority}</span>
                    </div>
                    <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '12px' }}>{item.detail}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'profile' && (
          <div style={contentGridStyle}>
            <div style={panelStyle}>
              <h2 style={panelTitleStyle}>Profil bilgileri</h2>
              <form onSubmit={handleProfileSave} style={{ display: 'grid', gap: '12px' }}>
                <label style={fieldLabelStyle}>Ad Soyad<input value={profileName} onChange={(event) => setProfileName(event.target.value)} style={inputStyle} /></label>
                <label style={fieldLabelStyle}>Telefon<input value={profilePhone} onChange={(event) => setProfilePhone(event.target.value)} style={inputStyle} /></label>
                <label style={fieldLabelStyle}>E-posta<input value={authUser?.email || ''} readOnly style={{ ...inputStyle, background: '#f8fafc' }} /></label>
                <button type="submit" disabled={savingProfile} style={primaryButtonStyle}>{savingProfile ? 'Kaydediliyor...' : 'Profili Güncelle'}</button>
              </form>
              {profileMessage ? <p style={successTextStyle}>{profileMessage}</p> : null}
              {profileError ? <p style={errorTextStyle}>{profileError}</p> : null}
            </div>

            <div style={panelStyle}>
              <h2 style={panelTitleStyle}>Hesap yönetimi</h2>
              <p style={{ color: '#64748b', lineHeight: 1.6 }}>Şifre güncelleme ve güvenlik ayarlarını yönetmek için hızlı erişim.</p>
              <button type="button" onClick={handlePasswordReset} style={secondaryButtonStyle}>Şifre Sıfırlama Gönder</button>
              <button type="button" onClick={handleLogout} style={ghostButtonStyle}>Oturumu Kapat</button>
              <div style={{ marginTop: '12px', display: 'grid', gap: '10px' }}>
                <button type="button" onClick={handleExportData} style={primaryButtonStyle}>Verileri Dışa Aktar</button>
                <label style={{ ...ghostButtonStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  Verileri İçe Aktar
                  <input type="file" accept="application/json" onChange={handleImportData} style={{ display: 'none' }} />
                </label>
                {backupMessage ? <p style={{ margin: 0, color: '#166534', fontSize: '13px' }}>{backupMessage}</p> : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const pageShellStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #dbeafe 45%, #fef3c7 100%)',
  padding: '16px',
  boxSizing: 'border-box'
}

const dashboardCardStyle = {
  maxWidth: '1180px',
  margin: '0 auto',
  background: 'rgba(255,255,255,0.96)',
  borderRadius: '28px',
  boxShadow: '0 24px 70px rgba(15,23,42,0.14)',
  padding: '20px'
}

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '16px',
  marginBottom: '16px',
  flexWrap: 'wrap'
}

const eyebrowStyle = {
  margin: '0 0 6px',
  color: '#2563eb',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  fontSize: '12px'
}

const titleStyle = {
  margin: '0 0 8px',
  color: '#0f172a',
  fontSize: '24px',
  lineHeight: 1.25
}

const subtitleStyle = {
  margin: 0,
  color: '#64748b',
  fontSize: '14px',
  lineHeight: 1.6
}

const navRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginBottom: '16px'
}

const pillButtonStyle = {
  border: 'none',
  padding: '10px 12px',
  borderRadius: '999px',
  fontWeight: 700,
  cursor: 'pointer'
}

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: '10px',
  marginBottom: '16px'
}

const statCardStyle = {
  background: 'linear-gradient(135deg, #eff6ff, #f8fafc)',
  border: '1px solid #dbeafe',
  borderRadius: '16px',
  padding: '12px',
  display: 'grid',
  gap: '4px'
}

const statLabelStyle = {
  color: '#64748b',
  fontSize: '12px'
}

const statValueStyle = {
  color: '#0f172a',
  fontSize: '20px'
}

const contentGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '14px'
}

const panelStyle = {
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '18px',
  padding: '14px'
}

const panelTitleStyle = {
  margin: '0 0 10px',
  color: '#0f172a',
  fontSize: '17px'
}

const listStyle = {
  margin: 0,
  paddingLeft: '16px',
  color: '#475569',
  lineHeight: 1.7
}

const coloniesGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '12px'
}

const colonyCardStyle = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: '16px',
  padding: '12px',
  display: 'grid',
  gap: '10px',
  width: '100%'
}

const miniCardStyle = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '10px'
}

const statusBadgeStyle = {
  borderRadius: '999px',
  padding: '6px 10px',
  fontSize: '11px',
  fontWeight: 700,
  whiteSpace: 'nowrap'
}

const detailGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '8px'
}

const detailLabelStyle = {
  display: 'block',
  color: '#64748b',
  fontSize: '11px',
  marginBottom: '2px'
}

const detailValueStyle = {
  color: '#0f172a',
  fontSize: '13px',
  fontWeight: 700
}

const fieldLabelStyle = {
  display: 'grid',
  gap: '6px',
  color: '#334155',
  fontSize: '13px',
  fontWeight: 600
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '12px',
  border: '1px solid #cbd5e1',
  boxSizing: 'border-box'
}

const selectStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '12px',
  border: '1px solid #cbd5e1',
  boxSizing: 'border-box',
  background: '#fff'
}

const textareaStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '12px',
  border: '1px solid #cbd5e1',
  boxSizing: 'border-box',
  resize: 'vertical'
}

const primaryButtonStyle = {
  border: 'none',
  borderRadius: '12px',
  padding: '10px 14px',
  background: 'linear-gradient(90deg, #2563eb, #38bdf8)',
  color: '#fff',
  fontWeight: 700,
  cursor: 'pointer'
}

const secondaryButtonStyle = {
  border: 'none',
  borderRadius: '12px',
  padding: '10px 14px',
  background: '#0f172a',
  color: '#fff',
  fontWeight: 700,
  cursor: 'pointer',
  marginBottom: '10px'
}

const ghostButtonStyle = {
  border: '1px solid #cbd5e1',
  borderRadius: '12px',
  padding: '10px 14px',
  background: '#fff',
  color: '#334155',
  fontWeight: 700,
  cursor: 'pointer'
}

const loadingCardStyle = {
  maxWidth: '420px',
  margin: '80px auto',
  background: '#fff',
  borderRadius: '24px',
  padding: '24px',
  textAlign: 'center',
  boxShadow: '0 20px 50px rgba(15,23,42,0.12)'
}

const successTextStyle = {
  color: '#166534',
  marginTop: '8px',
  fontSize: '14px'
}

const errorTextStyle = {
  color: '#b91c1c',
  marginTop: '8px',
  fontSize: '14px'
}
