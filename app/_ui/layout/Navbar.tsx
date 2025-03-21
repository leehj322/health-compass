import Link from "next/link";
import { LogIn, CircleHelp } from "lucide-react";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex h-20 items-center justify-between bg-white px-6 py-6 shadow-sm md:px-20">
      <div className="text-xl font-bold md:text-2xl">
        <span className="text-emerald-600">건강</span> 나침반
      </div>
      <ul className="flex items-center gap-4 font-semibold md:gap-6">
        {/* 데스크탑 메뉴 */}
        <div className="hidden items-center gap-6 md:flex">
          <DesktopMenu />
        </div>

        {/* 모바일 메뉴 버튼 */}
        <li className="flex items-center justify-center md:hidden">
          <MobileMenu />
        </li>

        {/* 아이콘 형태 메뉴 (데스크탑, 모바일 동일) */}
        <li className="flex gap-3">
          <Link href="/help" aria-label="문의하기">
            <CircleHelp size={20} />
          </Link>
          <Link href="/login" aria-label="로그인">
            <LogIn size={20} />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
