'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult, Review } from '@/types'

async function requireUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return { supabase, user }
}

export async function createReview(restaurantId: string, formData: FormData): Promise<ActionResult> {
  try {
    const { supabase, user } = await requireUser()

    const rating = parseInt(formData.get('rating') as string)
    const content = (formData.get('content') as string).trim()

    if (!rating || rating < 1 || rating > 5) {
      return { success: false, error: '별점을 선택해주세요. (1~5점)' }
    }
    if (!content) {
      return { success: false, error: '리뷰 내용을 입력해주세요.' }
    }

    const { error } = await supabase.from('reviews').insert({
      restaurant_id: restaurantId,
      author_id: user.id,
      author_email: user.email,
      rating,
      content,
    })

    if (error) return { success: false, error: error.message }

    revalidatePath(`/restaurants/${restaurantId}`)
    return { success: true, data: undefined }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteReview(reviewId: string, restaurantId: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireUser()
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId)
    if (error) return { success: false, error: error.message }
    revalidatePath(`/restaurants/${restaurantId}`)
    return { success: true, data: undefined }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function getReviews(restaurantId: string): Promise<Review[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false })
  return data ?? []
}
