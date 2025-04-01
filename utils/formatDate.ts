/**
 * 주어진 날짜 문자열을 기준으로 현재 시간과의 차이를 계산하여,
 * '방금 전', '5분 전', '2일 전', '1년 전'과 같은 한국어 표현으로 반환합니다.
 *
 * @param dateString - ISO 형식의 날짜 문자열 (예: "2024-03-31T12:00:00Z")
 * @returns 현재로부터 경과한 시간을 한국어 표현으로 반환 (예: "3시간 전", "2일 전")
 *
 * @example
 * // 현재 시간이 2025-04-01T00:00:00Z인 경우
 * getTimeAgo("2025-03-31T23:00:00Z"); // "1시간 전"
 */
export const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "방금 전";
  }

  const units = [
    { limit: 60 * 60, divisor: 60, label: "분" }, // < 1시간
    { limit: 60 * 60 * 24, divisor: 60 * 60, label: "시간" }, // < 1일
    { limit: 60 * 60 * 24 * 30, divisor: 60 * 60 * 24, label: "일" }, // < 1개월
    { limit: 60 * 60 * 24 * 365, divisor: 60 * 60 * 24 * 30, label: "개월" }, // < 1년
    { limit: Infinity, divisor: 60 * 60 * 24 * 365, label: "년" }, // 그 이상
  ];

  const unit =
    units.find((u) => diffInSeconds < u.limit) || units[units.length - 1];
  const value = Math.floor(diffInSeconds / unit.divisor);

  return `${value}${unit.label} 전`;
};
