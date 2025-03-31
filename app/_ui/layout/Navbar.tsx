import Link from "next/link";
import NavMenu from "./NavMenu";
import AuthMenu from "./AuthMenu";
import { CircleHelp, Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queries/queryKeys";

const MENU_LIST = [
  { label: "병원 약국 찾기", href: "/", highlightPaths: ["/clinic"] },
  { label: "응급실 정보", href: "/emergency", highlightPaths: [] },
  { label: "자유게시판", href: "/board", highlightPaths: [] },
];

export default async function Navbar() {
  const supabase = await createClient();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.user.all,
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
    staleTime: 60 * 1000,
  });

  const dehydrateState = dehydrate(queryClient);

  return (
    <nav className="sticky top-0 z-50 flex h-20 items-center justify-between bg-white px-6 py-6 shadow-sm md:px-20">
      <div className="text-xl font-bold md:text-2xl">
        <Link href="/">
          <span className="text-emerald-600">건강</span> 나침반
        </Link>
      </div>
      <ul className="flex items-center gap-4 font-semibold md:gap-6">
        {/* 메뉴 리스트 (모바일의 경우 드롭다운) */}
        <NavMenu menuList={MENU_LIST} />

        {/* 아이콘 형태 메뉴 (데스크탑, 모바일 동일) */}
        <li className="flex gap-3">
          <button
            className="hover:cursor-pointer"
            title="알림"
            aria-label="알림"
          >
            <Bell size={20} />
          </button>

          <Link
            href="/help"
            title="문의하기"
            aria-label="문의하기"
            className="flex items-center justify-center"
          >
            <CircleHelp size={20} />
          </Link>

          {/* 로그인한 경우: 프로필메뉴, 로그아웃한 경우: 로그인 페이지 아이콘 */}

          <HydrationBoundary state={dehydrateState}>
            <AuthMenu />
          </HydrationBoundary>
        </li>
      </ul>
    </nav>
  );
}
