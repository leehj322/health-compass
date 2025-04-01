-- 댓글 읽기: 누구나 조회 가능
create policy "Allow public read access to comments"
on public.comments for select
using (true);