-- 모든 사용자는 모든 프로필을 조회 가능하게
create policy "Allow authenticated users to read all profiles"
on profiles for select
using (true);