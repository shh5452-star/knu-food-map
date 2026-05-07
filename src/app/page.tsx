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

  retu
