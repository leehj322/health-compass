"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";

export default function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="메뉴 열기" className="cursor-pointer">
        <Image
          src="/default-profile.png"
          alt="프로필 이미지"
          width={32}
          height={32}
          className="rounded-full object-cover object-center"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        className="w-40 rounded-xl border bg-white py-2 shadow-lg"
      >
        <DropdownMenuItem asChild>
          <Link
            className="block w-full cursor-pointer rounded-md px-3 py-2 text-sm font-medium hover:bg-emerald-50"
            href="/mypage"
          >
            내 정보 관리
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button className="block w-full cursor-pointer rounded-md px-3 py-2 text-sm font-medium hover:bg-emerald-50">
            로그아웃
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
