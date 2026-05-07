'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createReview } from '@/lib/actions/review'

const HINTS = ['', '별로예요 😞', '그저 그래요 😐', '괜찮아요 🙂', '좋아요 😊', '최고예요! 🤩']

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resolvedId, setResolvedId] = useState('')
  if (!resolvedId) { params.then(({ id }) => setResolvedId(id)) }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!rating) { setError('별점을 선택해주세요.'); return }
    setError(''); setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.set('rating', String(rating))
    const result = await createReview(resolvedId, formData)
    if (!result.success) { setError(result.error); setLoading(false); return }
    router.push(`/restaurants/${resolvedId}`); router.refresh()
  }

  const inp: React.CSSProperties = { width: '100%', background: '#1e1b4b', border: '1px solid #312e81', borderRadius: 9, padding: '11px 14px', fontSize: 14, color: '#e0e7ff', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }
  const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: '#818cf8', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0e23', padding: '32px 20px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <Link href={resolvedId ? `/restaurants/${resolvedId}` : '/'} style={{ fontSize: 13, color: '#818cf8', textDecoration: 'none', display: 'inline-block', marginBottom: 20 }}>← 식당 페이지로</Link>
        <div style={{ background: '#1a1833', border: '1px solid #312e81', borderRadius: 16, padding: 28 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#e0e7ff', letterSpacing: '-0.4px', margin: '0 0 24px' }}>⭐ 리뷰 작성</h1>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={lbl}>별점 *</label>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                {[1,2,3,4,5].map(star => (
                  <button key={star} type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 36, lineHeight: 1, color: (hover || rating) >= star ? '#f59e0b' : '#312e81', transition: 'color 0.1s, transform 0.1s', transform: (hover || rating) >= star ? 'scale(1.1)' : 'scale(1)' }}>
                    ★
                  </button>
                ))}
              </div>
              {(hover || rating) > 0 && (
                <p style={{ fontSize: 13, color: '#a5b4fc', margin: 0 }}>{HINTS[hover || rating]}</p>
              )}
            </div>
            <div>
              <label style={lbl}>리뷰 내용 *</label>
              <textarea name="content" rows={5} style={inp} placeholder="솔직한 방문 후기를 남겨주세요 😊" required />
            </div>
            {error && <p style={{ fontSize: 13, color: '#f87171', margin: 0 }}>{error}</p>}
            <button type="submit" disabled={loading || !resolvedId} style={{ width: '100%', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, padding: 13, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              {loading ? '등록 중...' : '리뷰 등록하기'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
