-- =============================================
-- KNU 맛집 지도 - Supabase SQL 마이그레이션
-- Supabase > SQL Editor 에서 전체 복사/붙여넣기 후 실행
-- =============================================

-- 1. 테이블 생성
-- =============================================

create table if not exists restaurants (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  category    text not null check (category in ('한식','중식','일식','분식','카페','양식','기타')),
  address     text,
  description text,
  image_url   text,
  created_at  timestamptz default now() not null
);

create table if not exists reviews (
  id            uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade not null,
  author_id     uuid references auth.users(id) on delete cascade not null,
  author_email  text not null,
  rating        int not null check (rating between 1 and 5),
  content       text not null,
  created_at    timestamptz default now() not null
);

-- 2. RLS(Row Level Security) 활성화
-- =============================================

alter table restaurants enable row level security;
alter table reviews     enable row level security;

-- 3. RLS 정책
-- =============================================

-- restaurants: 누구나 조회 가능 (비로그인 포함)
create policy "누구나 맛집 조회" on restaurants
  for select using (true);

-- restaurants: 로그인 사용자만 등록
create policy "로그인 사용자 맛집 등록" on restaurants
  for insert with check (auth.uid() is not null);

-- restaurants: 본인이 등록한 것만 수정/삭제
create policy "본인 맛집 수정" on restaurants
  for update using (author_id = auth.uid());

create policy "본인 맛집 삭제" on restaurants
  for delete using (author_id = auth.uid());

-- reviews: 누구나 조회 가능
create policy "누구나 리뷰 조회" on reviews
  for select using (true);

-- reviews: 로그인 사용자만 작성
create policy "로그인 사용자 리뷰 작성" on reviews
  for insert with check (auth.uid() is not null);

-- reviews: 본인 리뷰만 삭제
create policy "본인 리뷰 삭제" on reviews
  for delete using (author_id = auth.uid());
