'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { updateRestaurant } from '@/lib/actions/restaurant'
import { createClient } from '@/lib/supabase/client'
import type { Restaurant } from '@/types'

const CATEGORIES = ['한식', '중식', '일식', '분식', '카페', '양식', '기타']

export default function EditRestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [id, setId] = useState('')
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    params.then(({ id }) => {
      setId(id)
      createClient().from('restaurants').select('*').eq('id', id).single().then(({ data }) => setRestaurant(data))
    })
  }, [params])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(''); setLoading(true)
    const result = await updateRestaurant(id, new FormData(e.currentTarget))
    if (!result.success) { setError(result.error); setLoading(false); return }
    router.push(`/restaurants/${id}`); router.refresh()
  }

  const inp: React.CSSProperties = { width: '100%', background: '#1e1b4b', border: '1px solid #312e81', borderRadius: 9, padding: '11px 14px', fontSize: 14, color: '#e0e7ff', outline: 'none', boxSizing: 'border-box' }
  const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: '#818cf8', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: 6 }

  if (!restaurant) return <div style={{ minHeight: '100vh', background: '#0f0e23', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>로딩 중...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#0f0e23', padding: '32px 20px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <Link href={`/restaurants/${id}`} style={{ fontSize: 13, color: '#818cf8', textDecoration: 'none', display: 'inline-block', marginBottom: 20 }}>← 상세 페이지로</Link>
        <div style={{ background: '#1a1833', border: '1px solid #312e81', borderRadius: 16, padding: 28 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#e0e7ff', margin: '0 0 24px' }}>✏️ 맛집 정보 수정</h1>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div><label style={lbl}>식당 이름 *</label><input name="name" style={inp} defaultValue={restaurant.name} required /></div>
            <div>
              <label style={lbl}>카테고리 *</label>
              <select name="category" defaultValue={restaurant.category} style={{ ...inp, appearance: 'none' }} required>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={lbl}>주소</label><input name="address" style={inp} defaultValue={restaurant.address ?? ''} /></div>
            <div><label style={lbl}>한 줄 소개</label><textarea name="description" rows={3} style={{ ...inp, resize: 'vertical' }} defaultValue={restaurant.description ?? ''} /></div>
            <div><label style={lbl}>이미지 URL</label><input name="image_url" type="url" style={inp} defaultValue={restaurant.image_url ?? ''} /></div>
            {error && <p style={{ fontSize: 13, color: '#f87171' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ width: '100%', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, padding: 13, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              {loading ? '저장 중...' : '수정 완료'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
