import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getRestaurant, deleteRestaurant } from '@/lib/actions/restaurant'
import { getReviews, deleteReview } from '@/lib/actions/review'
import Header from '@/components/layout/Header'

function StarRow({ rating }: { rating: number }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? '#f59e0b' : '#312e81', fontSize: 14 }}>★</span>
      ))}
    </span>
  )
}

export default async function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const restaurant = await getRestaurant(id)
  if (!restaurant) notFound()
  const reviews = await getReviews(id)
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null

  async function handleDeleteReview(formData: FormData) {
    'use server'
    await deleteReview(formData.get('reviewId') as string, id)
  }
  async function handleDeleteRestaurant() {
    'use server'
    await deleteRestaurant(id)
    redirect('/')
  }

  const CATEGORY_EMOJI: Record<string, string> = { 한식:'🍜', 중식:'🥟', 일식:'🍱', 분식:'🍢', 카페:'☕', 양식:'🍝', 기타:'🍽️' }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0e23' }}>
      <Header user={user} />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px' }}>
        <Link href="/" style={{ fontSize: 13, color: '#818cf8', textDecoration: 'none', display: 'inline-block', marginBottom: 20 }}>← 목록으로</Link>

        {/* 식당 정보 */}
        <div style={{ background: '#1a1833', border: '1px solid #312e81', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
          {restaurant.image_url ? (
            <img src={restaurant.image_url} alt={restaurant.name} style={{ width: '100%', height: 220, objectFit: 'cover' }} />
          ) : (
            <div style={{ height: 220, background: '#1e1b4b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72 }}>
              {CATEGORY_EMOJI[restaurant.category] ?? '🍽️'}
            </div>
          )}
          <div style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <h1 style={{ fontSize: 22, fontWeight: 600, color: '#e0e7ff', letterSpacing: '-0.5px', margin: 0 }}>{restaurant.name}</h1>
                  <span style={{ background: '#312e81', color: '#a5b4fc', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99 }}>{restaurant.category}</span>
                </div>
                {restaurant.address && <p style={{ fontSize: 13, color: '#6366f1', margin: '0 0 8px' }}>📍 {restaurant.address}</p>}
                {avgRating !== null && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <StarRow rating={avgRating} />
                    <span style={{ fontSize: 14, color: '#a5b4fc', fontWeight: 600 }}>{avgRating.toFixed(1)}</span>
                    <span style={{ fontSize: 12, color: '#4f46e5' }}>({reviews.length}개 리뷰)</span>
                  </div>
                )}
                {restaurant.description && <p style={{ fontSize: 14, color: '#818cf8', margin: 0, lineHeight: 1.7 }}>{restaurant.description}</p>}
              </div>
              {user && user.id === restaurant.author_id && (
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <Link href={`/restaurants/${id}/edit`} style={{ textDecoration: 'none' }}>
                    <button style={{ background: '#1e1b4b', color: '#818cf8', border: '1px solid #312e81', borderRadius: 8, padding: '7px 14px', fontSize: 12, cursor: 'pointer' }}>수정</button>
                  </Link>
                  <form action={handleDeleteRestaurant}>
                    <button type="submit" style={{ background: '#2d0f0f', color: '#f87171', border: '1px solid #7f1d1d', borderRadius: 8, padding: '7px 14px', fontSize: 12, cursor: 'pointer' }}>삭제</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 리뷰 */}
        <div style={{ background: '#1a1833', border: '1px solid #312e81', borderRadius: 16, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#e0e7ff', margin: 0 }}>리뷰 {reviews.length}개</h2>
            {user
              ? <Link href={`/restaurants/${id}/review`} style={{ textDecoration: 'none' }}><button style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>✏️ 리뷰 작성</button></Link>
              : <Link href="/login" style={{ textDecoration: 'none' }}><button style={{ background: '#1e1b4b', color: '#818cf8', border: '1px solid #312e81', borderRadius: 8, padding: '7px 14px', fontSize: 13, cursor: 'pointer' }}>로그인 후 리뷰 작성</button></Link>
            }
          </div>
          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#4f46e5' }}>
              <p style={{ fontSize: 32, marginBottom: 10 }}>💬</p>
              <p style={{ fontSize: 14, color: '#6366f1' }}>첫 리뷰를 남겨보세요!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reviews.map(review => (
                <div key={review.id} style={{ background: '#12112a', border: '1px solid #1e1b4b', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#312e81', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#a5b4fc' }}>
                          {(review.author_email ?? '?')[0].toUpperCase()}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#c7d2fe' }}>{review.author_email}</span>
                        <StarRow rating={review.rating} />
                        <span style={{ fontSize: 12, color: '#4f46e5', marginLeft: 'auto' }}>{new Date(review.created_at).toLocaleDateString('ko-KR')}</span>
                      </div>
                      <p style={{ fontSize: 14, color: '#a5b4fc', margin: 0, lineHeight: 1.65 }}>{review.content}</p>
                    </div>
                    {user && user.id === review.author_id && (
                      <form action={handleDeleteReview} style={{ marginLeft: 12 }}>
                        <input type="hidden" name="reviewId" value={review.id} />
                        <button type="submit" style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: 12, cursor: 'pointer', padding: '4px 8px' }}>삭제</button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
