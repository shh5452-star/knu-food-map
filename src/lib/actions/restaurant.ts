'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult, Restaurant, RestaurantWithStats } from '@/types'

async function requireUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return { supabase, user }
}

export async function createRestaurant(formData: FormData): Promise<ActionResult<Restaurant>> {
  try {
    const { supabase, user } = await requireUser()

    const name = (formData.get('name') as string).trim()
    const category = (formData.get('category') as string).trim()
    const address = (formData.get('address') as string)?.trim() || null
    const description = (formData.get('description') as string)?.trim() || null
    const image_url = (formData.get('image_url') as string)?.trim() || null

    if (!name || !category) {
      return { success: false, error: '식당 이름과 카테고리는 필수입니다.' }
    }

    const { data, error } = await supabase
      .from('restaurants')
      .insert({ name, category, address, description, image_url, author_id: user.id })
      .select()
      .single()

    if (error) return { success: false, error: error.message }

    revalidatePath('/')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateRestaurant(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const { supabase } = await requireUser()

    const name = (formData.get('name') as string).trim()
    const category = (formData.get('category') as string).trim()
    const address = (formData.get('address') as string)?.trim() || null
    const description = (formData.get('description') as string)?.trim() || null
    const image_url = (formData.get('image_url') as string)?.trim() || null

    if (!name || !category) {
      return { success: false, error: '식당 이름과 카테고리는 필수입니다.' }
    }

    const { error } = await supabase
      .from('restaurants')
      .update({ name, category, address, description, image_url })
      .eq('id', id)

    if (error) return { success: false, error: error.message }

    revalidatePath(`/restaurants/${id}`)
    revalidatePath('/')
    return { success: true, data: undefined }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteRestaurant(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireUser()
    const { error } = await supabase.from('restaurants').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/')
    return { success: true, data: undefined }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function getRestaurants(category?: string): Promise<RestaurantWithStats[]> {
  const supabase = await createClient()

  let query = supabase
    .from('restaurants')
    .select(`
      *,
      reviews(rating)
    `)
    .order('created_at', { ascending: false })

  if (category && category !== '전체') {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error || !data) return []

  return data.map((r: Restaurant & { reviews: { rating: number }[] }) => {
    const reviews = r.reviews || []
    const avg_rating = reviews.length > 0
      ? reviews.reduce((sum: number, rv: { rating: number }) => sum + rv.rating, 0) / reviews.length
      : null
    return { ...r, avg_rating, review_count: reviews.length }
  })
}

export async function getRestaurant(id: string): Promise<Restaurant | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('restaurants').select('*').eq('id', id).single()
  return data
}
