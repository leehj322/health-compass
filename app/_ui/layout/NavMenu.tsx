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

interface MenuProps {
  menuList: {
    label: string;
    href: string;
    highlightPaths: string[];
  }[];
}

export default function NavMenu({ menuList }: MenuProps) {
  return (
    <>
      <div className="hidden items-center gap-6 md:flex">
        <DesktopMenu menuList={menuList} />
      </div>

      <li className="flex items-center justify-center md:hidden">
        <MobileMenu menuList={menuList} />
      </li>
    </>
  );
}

function DesktopMenu({ menuList }: MenuProps) {
  const pathname = usePathname();

  return (
    <>
      {menuList.map((menu) => {
        const isActive =
          pathname === menu.href ||
          menu.highlightPaths?.some((path) => pathname.startsWith(path));

        return (
          <li key={menu.href}>
            <Link
              href={menu.href}
              className={isActive ? "text-emerald-600" : undefined}
            >
              {menu.label}
            </Link>
          </li>
        );
      })}
    </>
  );
}

function MobileMenu({ menuList }: MenuProps) {
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
        {menuList.map((menu) => {
          const isActive =
            pathname === menu.href ||
            menu.highlightPaths?.some((path) => pathname.startsWith(path));

          return (
            <DropdownMenuItem key={menu.href} asChild>
              <Link
                href={menu.href}
                className={`block w-full cursor-pointer rounded-md px-3 py-2 text-sm font-medium ${isActive ? "font-bold text-emerald-600" : "hover:bg-emerald-50"}`}
              >
                {menu.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
