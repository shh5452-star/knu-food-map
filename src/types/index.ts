export type Category = '한식' | '중식' | '일식' | '분식' | '카페' | '양식' | '기타'

export type Restaurant = {
  id: string
  author_id: string
  name: string
  category: Category
  address: string | null
  description: string | null
  image_url: string | null
  created_at: string
}

export type RestaurantWithStats = Restaurant & {
  avg_rating: number | null
  review_count: number
}

export type Review = {
  id: string
  restaurant_id: string
  author_id: string
  author_email: string
  rating: number
  content: string
  created_at: string
}

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }
