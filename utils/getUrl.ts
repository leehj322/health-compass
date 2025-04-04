/**
 * 애플리케이션의 현재 실행 환경에 따라 적절한 베이스 URL을 반환합니다.
 *
 * 반환 우선순위:
 * 1. NEXT_PUBLIC_SITE_URL (프로덕션 환경에서 직접 설정한 도메인)
 * 2. NEXT_PUBLIC_VERCEL_URL (Vercel에서 자동 설정된 Preview 도메인)
 * 3. 기본값: http://localhost:3000 (로컬 개발 환경)
 *
 * 반환된 URL은 `http/https`로 시작하며, 마지막에 `/`가 붙도록 보정됩니다.
 *
 * @returns 환경에 맞는 애플리케이션의 base URL (trailing slash 포함)
 */
export function getUrl() {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:3000";

  url = url.startsWith("http") ? url : `https://${url}`;
  url = url.endsWith("/") ? url : `${url}/`;

  return url;
}
