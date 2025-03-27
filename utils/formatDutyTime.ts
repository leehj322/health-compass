/**
 * "HHMM" 형식의 숫자 문자열을 "HH:MM" 형식으로 포맷합니다.
 *
 * @param time - 4자리 문자열 형식의 시간 (예: "0900", "1830"). 값이 없거나 형식이 맞지 않으면 null을 반환합니다.
 * @returns - "HH:MM" 형식으로 포맷된 문자열. 유효하지 않은 입력일 경우 null을 반환합니다.
 *
 * @example
 * formatDutyTime("0900"); // "09:00"
 * formatDutyTime("1830"); // "18:30"
 * formatDutyTime("9");    // null
 * formatDutyTime(undefined); // null
 */
export function formatDutyTime(time: string | undefined) {
  if (!time || time.length !== 4) return null;
  return `${time.slice(0, 2)}:${time.slice(2)}`;
}
