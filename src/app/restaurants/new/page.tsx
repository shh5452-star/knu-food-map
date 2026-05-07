'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createRestaurant } from '@/lib/actions/restaurant'

const CATEGORIES = ['한식', '중식', '일식', '분식', '카페', '양식', '기타']

export default function NewRestaurantPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(''); setLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await createRestaurant(formData)
    if (!result.success) { setError(result.error); setLoading(false); return }
    router.push(`/restaurants/${result.data.id}`); router.refresh()
  }

  const inp: React.CSSProperties = { width: '100%', background: '#1e1b4b', border: '1px solid #312e81', borderRadius: 9, padding: '11px 14px', fontSize: 14, color: '#e0e7ff', outline: 'none', boxSizing: 'border-box' }
  const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: '#818cf8', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: 6 }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0e23', padding: '32px 20px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <Link href="/" style={{ textDecoration: 'none', fontSize: 13, color: '#818cf8', display: 'inline-block', marginBottom: 20 }}>← 목록으로</Link>
        <div style={{ background: '#1a1833', border: '1px solid #312e81', borderRadius: 16, padding: 28 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#e0e7ff', letterSpacing: '-0.4px', margin: '0 0 24px' }}>🍽️ 맛집 등록</h1>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div><label style={lbl}>식당 이름 *</label><input name="name" style={inp} placeholder="예: 명동칼국수" required /></div>
            <div>
              <label style={lbl}>카테고리 *</label>
              <select name="category" required style={{ ...inp, appearance: 'none' }}>
                <option value="">카테고리 선택</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={lbl}>주소</label><input name="address" style={inp} placeholder="예: 용인시 기흥구 강남로 40" /></div>
            <div>
              <label style={lbl}>한 줄 소개</label>
              <textarea name="description" rows={3} style={{ ...inp, resize: 'vertical' }} placeholder="예: 가성비 최고의 순대국밥집, 양이 많고 국물이 진해요!" />
            </div>
            <div><label style={lbl}>이미지 URL</label><input name="image_url" type="url" style={inp} placeholder="https://example.com/image.jpg" /></div>
            {error && <p style={{ fontSize: 13, color: '#f87171', margin: 0 }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ width: '100%', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, padding: 13, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 4 }}>
              {loading ? '등록 중...' : '맛집 등록하기'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
