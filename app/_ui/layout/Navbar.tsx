import Link from "next/link";
import NavMenu from "./NavMenu";
import UserMenu from "./UserMenu";
import { CircleHelp, Bell, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const MENU_LIST = [
  { label: "병원 약국 찾기", href: "/", highlightPaths: ["/clinic"] },
  { label: "응급실 정보", href: "/emergency", highlightPaths: [] },
  { label: "자유게시판", href: "/board", highlightPaths: [] },
];

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

          {user ? (
            <div
              title="유저 메뉴"
              aria-label="유저 메뉴"
              className="flex items-center justify-center pl-1"
            >
              <UserMenu />
            </div>
          ) : (
            <Link href="/auth/signin" title="로그인" aria-label="로그인">
              <LogIn size={20} />
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
