"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlignJustify } from "lucide-react";

export default function MobileMenu() {
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="메뉴 열기" className="cursor-pointer">
        <AlignJustify size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        className="w-40 rounded-xl border bg-white py-2 shadow-lg"
      >
        <DropdownMenuItem asChild>
          <Link
            href="/"
            className={`block w-full cursor-pointer rounded-md px-3 py-2 text-sm font-medium ${pathname === "/" ? "font-bold text-emerald-600" : "hover:bg-emerald-50"}`}
          >
            병원 약국 찾기
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/emergency"
            className={`block w-full cursor-pointer rounded-md px-3 py-2 text-sm font-medium ${pathname === "/emergency" ? "font-bold text-emerald-600" : "hover:bg-emerald-50"}`}
          >
            응급실 정보
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
