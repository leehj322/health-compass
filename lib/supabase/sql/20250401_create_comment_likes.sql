-- ================================================
-- 좋아요/싫어요 기록 테이블 생성
-- ================================================

-- 개별 유저가 어떤 댓글에 좋아요 또는 싫어요를 눌렀는지 기록
create table public.comment_likes (
  id uuid primary key default gen_random_uuid(), -- 좋아요 기록 고유 ID
  comment_id uuid not null references public.comments(id) on delete cascade, -- 대상 댓글 ID
  user_id uuid not null references public.profiles(id) on delete cascade,    -- 누른 유저 ID
  is_like boolean not null,                       -- true: 좋아요, false: 싫어요
  created_at timestamp with time zone default now(), -- 누른 시각
  unique (comment_id, user_id)                    -- 한 유저가 같은 댓글에 한 번만 누를 수 있게 제한
);

-- ================================================
-- 인덱스 생성 (댓글별 좋아요 빠르게 조회)
-- ================================================

create index idx_comment_likes_comment_id 
on public.comment_likes (comment_id);

-- ================================================
-- 행 수준 보안(RLS) 설정
-- ================================================

-- 좋아요/싫어요 테이블에 RLS 활성화
alter table public.comment_likes enable row level security;

-- 모든 로그인된 유저는 좋아요/싫어요 추가 및 삭제 가능
create policy "Allow authenticated users to like or dislike"
on public.comment_likes for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
