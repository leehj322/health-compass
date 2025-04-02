// Session Storage에 Login 후 이동할 페이지를 저장하기 위해 사용하는 유틸

const AUTH_SESSION_ROUTE_KEY = "auth_prev_route";

export function saveAuthSessionRoute(path: string) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(AUTH_SESSION_ROUTE_KEY, path);
  }
}

export function getAuthSessionRoute(): string | null {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(AUTH_SESSION_ROUTE_KEY);
  }
  return null;
}

export function clearAuthSessionRoute() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(AUTH_SESSION_ROUTE_KEY);
  }
}
