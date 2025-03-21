"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DesktopMenu() {
  const pathname = usePathname();

  return (
    <>
      <li>
        <Link
          href="/"
          className={pathname === "/" ? "text-emerald-600" : undefined}
        >
          병원 약국 찾기
        </Link>
      </li>
      <li>
        <Link
          href="/emergency"
          className={pathname === "/emergency" ? "text-emerald-600" : undefined}
        >
          응급실 정보
        </Link>
      </li>
    </>
  );
}
