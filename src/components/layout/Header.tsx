'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Header({ user }: { user: User | null }) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50" style={{ background: '#1e1b4b', borderBottom: '1px solid #312e81' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: '#6366f1', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🍽️</div>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#e0e7ff', letterSpacing: '-0.4px' }}>KNU 맛집</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user ? (
            <>
              <Link href="/restaurants/new" style={{ textDecoration: 'none' }}>
                <button style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  + 맛집 등록
                </button>
              </Link>
              <button onClick={handleLogout} style={{ background: 'transparent', color: '#818cf8', border: '1px solid #312e81', borderRadius: 8, padding: '7px 14px', fontSize: 13, cursor: 'pointer' }}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'transparent', color: '#a5b4fc', border: 'none', padding: '7px 14px', fontSize: 13, cursor: 'pointer' }}>로그인</button>
              </Link>
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <button style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>회원가입</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
