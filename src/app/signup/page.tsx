'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setSuccess('')
    if (password !== confirm) { setError('비밀번호가 일치하지 않습니다.'); return }
    if (password.length < 6) { setError('비밀번호는 6자 이상이어야 합니다.'); return }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message) } else { setSuccess('가입 확인 이메일이 발송되었습니다. 이메일 인증 후 로그인해주세요.') }
    setLoading(false)
  }

  const inp: React.CSSProperties = { width: '100%', background: '#1e1b4b', border: '1px solid #312e81', borderRadius: 9, padding: '11px 14px', fontSize: 14, color: '#e0e7ff', outline: 'none', boxSizing: 'border-box' }
  const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: '#818cf8', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: 6 }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0e23', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, background: '#6366f1', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 14px' }}>🍽️</div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#e0e7ff', letterSpacing: '-0.5px', margin: '0 0 6px' }}>함께해요!</h1>
          <p style={{ fontSize: 13, color: '#6366f1', margin: 0 }}>강남대 맛집 커뮤니티에 가입하세요</p>
        </div>

        <div style={{ background: '#1a1833', border: '1px solid #312e81', borderRadius: 16, padding: 28 }}>
          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>📬</div>
              <p style={{ fontSize: 14, color: '#a5b4fc', marginBottom: 20, lineHeight: 1.6 }}>{success}</p>
              <Link href="/login"><button style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>로그인 하러 가기</button></Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><label style={lbl}>이메일</label><input type="email" style={inp} placeholder="student@knu.ac.kr" value={email} onChange={e => setEmail(e.target.value)} required /></div>
              <div><label style={lbl}>비밀번호</label><input type="password" style={inp} placeholder="6자 이상" value={password} onChange={e => setPassword(e.target.value)} required /></div>
              <div><label style={lbl}>비밀번호 확인</label><input type="password" style={inp} placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} required /></div>
              {error && <p style={{ fontSize: 13, color: '#f87171', margin: 0 }}>{error}</p>}
              <button type="submit" disabled={loading} style={{ width: '100%', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, padding: 13, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 4 }}>
                {loading ? '가입 중...' : '회원가입'}
              </button>
            </form>
          )}
          {!success && (
            <p style={{ textAlign: 'center', fontSize: 13, color: '#6366f1', marginTop: 18 }}>
              이미 계정이 있으신가요?{' '}
              <Link href="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>로그인</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
