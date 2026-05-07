'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message === 'Email not confirmed' ? '이메일 인증을 완료해주세요.' : '이메일 또는 비밀번호가 올바르지 않습니다.')
      setLoading(false); return
    }
    router.push('/'); router.refresh()
  }

  const inp: React.CSSProperties = { width: '100%', background: '#1e1b4b', border: '1px solid #312e81', borderRadius: 9, padding: '11px 14px', fontSize: 14, color: '#e0e7ff', outline: 'none', boxSizing: 'border-box' }
  const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: '#818cf8', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: 6 }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0e23', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, background: '#6366f1', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 14px' }}>🍽️</div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#e0e7ff', letterSpacing: '-0.5px', margin: '0 0 6px' }}>다시 오셨군요</h1>
          <p style={{ fontSize: 13, color: '#6366f1', margin: 0 }}>KNU 맛집 커뮤니티에 로그인하세요</p>
        </div>

        {/* Card */}
        <div style={{ background: '#1a1833', border: '1px solid #312e81', borderRadius: 16, padding: 28 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={lbl}>이메일</label>
              <input type="email" style={inp} placeholder="student@knu.ac.kr" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label style={lbl}>비밀번호</label>
              <input type="password" style={inp} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {error && <p style={{ fontSize: 13, color: '#f87171', margin: 0 }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ width: '100%', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, padding: 13, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 4, letterSpacing: '-0.2px' }}>
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#312e81' }}></div>
            <span style={{ fontSize: 12, color: '#4f46e5' }}>또는</span>
            <div style={{ flex: 1, height: 1, background: '#312e81' }}></div>
          </div>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#6366f1', margin: 0 }}>
            계정이 없으신가요?{' '}
            <Link href="/signup" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
