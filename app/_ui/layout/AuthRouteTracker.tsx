"use client";

import {
  getAuthSessionRoute,
  saveAuthSessionRoute,
} from "@/lib/authSessionRoute";
import { usePathname, useSearchParams } from "next/navigation";

const AUTH_PAGES = ["/auth/signin", "/auth/signup", "/auth/verify-email"];

// Session Storage에 Login 후 이동할 페이지를 저장하기 위해 사용하는 layout
export default function AuthRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.toString();
  const fullPath = search ? `${pathname}?${search}` : pathname;

  const prevPath = getAuthSessionRoute();
  if (!prevPath) {
    saveAuthSessionRoute("/");
  }

  const isAuthPage = AUTH_PAGES.some((authPath) =>
    fullPath.startsWith(authPath),
  );

  if (isAuthPage) return null;

  saveAuthSessionRoute(fullPath);
  return null;
}
