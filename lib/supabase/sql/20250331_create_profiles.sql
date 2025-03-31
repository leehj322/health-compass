-- profiles 테이블 만들기
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null,
  avatar_url text,
  role text default 'user'
);

-- RLS(행 수준 보안) 활성화
alter table public.profiles enable row level security;

-- 본인만 접근할 수 있도록 정책 설정
create policy "Allow users to manage their own profile"
on profiles for all
using (auth.uid() = id)
with check (auth.uid() = id);
