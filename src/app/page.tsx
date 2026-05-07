import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getRestaurants } from '@/lib/actions/restaurant'
import Header from '@/components/layout/Header'
import FoodIcons from '@/components/features/FoodIcons'
import type { RestaurantWithStats } from '@/types'

const CATEGORIES = ['전체', '한식', '중식', '일식', '분식', '카페', '양식', '기타']

const CATEGORY_STYLE: Record<string, { bg: string; emoji: string }> = {
  한식: { bg: '#0f0e23', emoji: '🍜' },
  중식: { bg: '#0f0e23', emoji: '🥟' },
  일식: { bg: '#0a0a1a', emoji: '🍱' },
  분식: { bg: '#13100a', emoji: '🍢' },
  카페: { bg: '#0d1530', emoji: '☕' },
  양식: { bg: '#0a1520', emoji: '🍝' },
  기타: { bg: '#0f0e23', emoji: '🍽️' },
}

function StarRow({ rating }: { rating: number }) {
  const filled = Math.round(rating)
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= filled ? '#f59e0b' : '#1e1b4b', fontSize: 12 }}>★</span>
      ))}
    </span>
  )
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const params = await searchParams
  const category = params?.category
  const restaurants = await getRestaurants(category)
  const totalReviews = restaurants.reduce((s, r) => s + r.review_count, 0)
  const ratedRestaurants = restaurants.filter(r => r.avg_rating)
  const avgRating = ratedRestaurants.length > 0
    ? (ratedRestaurants.reduce((s, r) => s + (r.avg_rating ?? 0), 0) / ratedRestaurants.length).toFixed(1)
    : '-'

  return (
    <div style={{ minHeight: '100vh', background: '#07060f', fontFamily: "'Apple SD Gothic Neo', sans-serif" }}>
      <Header user={user} />

      <div style={{ position: 'relative', overflow: 'hidden', padding: '52px 20px 40px', textAlign: 'center', borderBottom: '1px solid rgba(99,102,241,0.12)' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)', backgroundSize: '36px 36px' }} />
        <div style={{ position: 'absolute', width: 320, height: 320, top: -100, left: -80, background: 'radial-gradient(circle,rgba(79,70,229,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 260, height: 260, bottom: -80, right: -60, background: 'radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <FoodIcons />

        <div style={{ position: 'relative', zIndex: 4, maxWidth: 600, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px solid rgba(99,102,241,0.22)', borderRadius: 5, padding: '4px 12px', marginBottom: 20, fontSize: 10, color: '#818cf8', letterSpacing: '1.2px', fontWeight: 600 }}>
            <span style={{ width: 5, height: 5, borderRadius: 1, background: '#6366f1', display: 'inline-block' }} />
            STAGE SELECT — 오늘 뭐 먹을지 고르세요
          </div>
          <p style={{ fontSize: 10, color: '#3730a3', letterSpacing: '2.5px', fontWeight: 600, marginBottom: 8 }}>KANGNAM UNIV. FOOD GUIDE</p>
          <h1 style={{ fontSize: 34, fontWeight: 700, color: '#fff', lineHeight: 1.1, letterSpacing: '-1px', marginBottom: 10 }}>
            학교 앞 맛집,<br />
            <span style={{ color: '#818cf8', textShadow: '0 0 24px rgba(99,102,241,0.4)' }}>학생이 직접</span> 검증했어요
          </h1>
          <p style={{ fontSize: 13, color: '#3730a3', lineHeight: 1.75, marginBottom: 28 }}>
            강남대 학생들이 발로 뛰며 찾은 진짜 맛집만 올라와요<br />
            별점과 솔직한 후기로 오늘 점심을 정하세요
          </p>
          <div style={{ display: 'flex', maxWidth: 360, margin: '0 auto 28px', border: '1px solid rgba(99,102,241,0.13)', borderRadius: 9, overflow: 'hidden' }}>
            {[{ n: String(restaurants.length), l: '맛집' }, { n: String(totalReviews), l: '리뷰' }, { n: avgRating + '★', l: '평균' }].map((s, i) => (
              <div key={i} style={{ flex: 1, padding: '12px 6px', textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(99,102,241,0.08)' : 'none' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#818cf8' }}>{s.n}</div>
                <div style={{ fontSize: 9, color: '#312e81', letterSpacing: '0.8px', textTransform: 'uppercase', fontWeight: 600, marginTop: 3 }}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <a href="#list" style={{ textDecoration: 'none' }}>
              <button style={{ background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: '#fff', border: 'none', borderRadius: 9, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 18px rgba(99,102,241,0.25)' }}>
                🍽️ 맛집 탐색 시작
              </button>
            </a>
            {!user && (
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'transparent', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 9, padding: '11px 22px', fontSize: 14, cursor: 'pointer' }}>
                  회원가입
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div id="list" style={{ background: '#07060f', borderBottom: '1px solid rgba(99,102,241,0.1)', padding: '12px 20px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', gap: 8, width: '100%' }}>
          {CATEGORIES.map(cat => {
            const isOn = (!category && cat === '전체') || category === cat
            return (
              <Link key={cat} href={cat === '전체' ? '/' : `/?category=${cat}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                <button style={{ padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, border: isOn ? 'none' : '1px solid rgba(99,102,241,0.2)', background: isOn ? '#6366f1' : 'transparent', color: isOn ? '#fff' : '#818cf8', cursor: 'pointer' }}>
                  {cat}
                </button>
              </Link>
            )
          })}
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 20px' }}>
        {restaurants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
            <p style={{ fontSize: 16, color: '#818cf8', marginBottom: 8 }}>아직 등록된 맛집이 없어요</p>
            {user
              ? <Link href="/restaurants/new"><button style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 9, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 12 }}>첫 맛집 등록하기</button></Link>
              : <Link href="/login"><button style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 9, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 12 }}>로그인 후 등록하기</button></Link>
            }
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {restaurants.map((r: RestaurantWithStats) => {
              const s = CATEGORY_STYLE[r.category] ?? CATEGORY_STYLE['기타']
              return (
                <Link key={r.id} href={`/restaurants/${r.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#1a1833', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 14, overflow: 'hidden', cursor: 'pointer' }}>
                    {r.image_url ? (
                      <img src={r.image_url} alt={r.name} style={{ width: '100%', height: 130, objectFit: 'cover' }} />
                    ) : (
                      <div style={{ height: 130, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, position: 'relative' }}>
                        {s.emoji}
                        <span style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, border: '1px solid rgba(99,102,241,0.3)' }}>
                          {r.category}
                        </span>
                      </div>
                    )}
                    <div style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#e0e7ff', marginBottom: 4 }}>{r.name}</div>
                      {r.address && <div style={{ fontSize: 11, color: '#4f46e5', marginBottom: 6 }}>📍 {r.address}</div>}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          {r.avg_rating !== null
                            ? <><StarRow rating={r.avg_rating} /><span style={{ fontSize: 12, color: '#818cf8', marginLeft: 2 }}>{r.avg_rating.toFixed(1)}</span></>
                            : <span style={{ fontSize: 12, color: '#4f46e5' }}>리뷰 없음</span>
                          }
                        </div>
                        <span style={{ fontSize: 11, color: '#4f46e5' }}>리뷰 {r.review_count}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
