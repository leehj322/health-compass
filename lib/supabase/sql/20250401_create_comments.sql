-- ================================================
-- 댓글 테이블 생성
-- ================================================

-- 댓글 저장용 테이블 생성
create table public.comments (
  id uuid primary key default gen_random_uuid(), -- 댓글 고유 ID (자동 생성)
  content text not null,                         -- 댓글 내용 (본문)
  user_id uuid not null references public.profiles(id) on delete cascade, -- 작성자 ID (profiles 테이블 참조)
  parent_id uuid references public.comments(id) on delete cascade,       -- 부모 댓글 ID (대댓글일 경우)
  external_institution_id text not null,         -- 외부 API에서 받은 병원/약국 ID
  created_at timestamp with time zone default now(), -- 댓글 작성 시간
  updated_at timestamp with time zone default now()  -- 댓글 수정 시간
);

-- ================================================
-- 인덱스 생성 (조회 성능 향상용)
-- ================================================

-- 댓글 최신순 정렬 시 활용
create index idx_comments_created_at 
on public.comments (created_at desc);

-- 병원/약국 ID + 최신순 정렬 시 활용
create index idx_comments_external_id_created_at 
on public.comments (external_institution_id, created_at desc);

-- ================================================
-- 행 수준 보안(RLS) 설정
-- ================================================

-- 댓글 테이블에 RLS 활성화
alter table public.comments enable row level security;

-- 댓글 작성: 로그인한 유저가 자신의 user_id로만 작성 가능
create policy "Allow users to insert comments"
on public.comments for insert
with check (auth.uid() = user_id);

-- 댓글 수정: 본인이 쓴 댓글만 수정 가능
create policy "Allow users to update their own comments"
on public.comments for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- 댓글 삭제: 본인이 쓴 댓글만 삭제 가능
create policy "Allow users to delete their own comments"
on public.comments for delete
using (auth.uid() = user_id);