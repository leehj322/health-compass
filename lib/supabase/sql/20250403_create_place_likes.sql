-- ================================================
-- 좋아요 기록 테이블 생성 및 설정
-- ================================================

-- 좋아요 기록 테이블 생성
CREATE TABLE public.place_likes (
  place_id text NOT NULL,                       -- 대상 장소 ID
  account_id uuid NOT NULL,                     -- 좋아요를 누른 계정 ID
  created_at timestamptz NOT NULL DEFAULT now(), -- 좋아요를 누른 시각
  PRIMARY KEY (place_id, account_id),           -- 한 계정이 한 장소에 대해 중복 좋아요를 못하게 함
  FOREIGN KEY (account_id) REFERENCES auth.users(id) ON DELETE CASCADE  -- 계정 참조, 삭제 시 연동
);

-- ================================================
-- 행 수준 보안(RLS) 설정
-- ================================================

-- 좋아요 테이블에 RLS 활성화
ALTER TABLE public.place_likes ENABLE ROW LEVEL SECURITY;

-- SELECT 정책: 모든 사용자가 좋아요 기록을 조회할 수 있도록 허용
CREATE POLICY "Allow all selects" ON public.place_likes
  FOR SELECT
  USING (true);

-- 좋아요 등록(INSERT) 정책: 현재 로그인한 사용자의 account_id만 허용
CREATE POLICY "Allow individual insert" ON public.place_likes
  FOR INSERT
  WITH CHECK (account_id = auth.uid());

-- 좋아요 취소(DELETE) 정책: 현재 로그인한 사용자의 account_id와 일치하는 경우에만 삭제 허용
CREATE POLICY "Allow individual delete" ON public.place_likes
  FOR DELETE
  USING (account_id = auth.uid());
