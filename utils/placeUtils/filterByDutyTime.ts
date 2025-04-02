import { PlacesByLocationResponse } from "@/lib/api/unifiedLocationApi.type";

/**
 * 지정된 근무 시간 필터 조건에 따라 장소 목록을 필터링합니다.
 *
 * 이 함수는 장소의 상세 정보(`details`) 속성 내에 있는
 * `dutyTime` 정보를 기반으로, 사용자가 설정한 조건(예: 야간 진료, 주말 진료 등)에 맞는
 * 병원 또는 약국만을 걸러냅니다.
 *
 * @param data - 필터링 대상이 되는 장소 목록과 메타 정보
 * @param filterGroups - 사용자가 선택한 필터 조건 객체
 *   - holiday: boolean, 공휴일 진료 여부 필터
 *   - sunday: boolean, 일요일 진료 여부 필터
 *   - saturday: boolean, 토요일 진료 여부 필터
 *   - night: boolean, 야간 진료 여부 필터
 *   - nightTime: number, 야간 기준 시간 (예: 8 → 20시 이후를 의미)
 *
 * @returns 필터링된 장소와 메타 정보
 */
export function filterByDutyTime(
  data: PlacesByLocationResponse | undefined,
  filterGroups: Record<string, any>,
) {
  if (!data) return;

  const { places, meta } = data;

  const filteredPlaces = places?.filter((place) => {
    const details = place?.details;
    if (!details) return false;

    const checks = [];

    if (filterGroups.holiday) {
      checks.push(details.dutyTime8s != null);
    }

    if (filterGroups.sunday) {
      checks.push(details.dutyTime7s != null);
    }

    if (filterGroups.saturday) {
      checks.push(details.dutyTime6s != null);
    }

    if (filterGroups.night) {
      const nightTimes = [
        details.dutyTime1c,
        details.dutyTime2c,
        details.dutyTime3c,
        details.dutyTime4c,
        details.dutyTime5c,
      ];
      const hasNight = nightTimes.some((time) => {
        if (!time) return false;
        const hour = parseInt(time, 10);
        return hour >= filterGroups.nightTime * 100 + 1200;
      });
      checks.push(hasNight);
    }

    return checks.every(Boolean);
  });

  return { places: filteredPlaces, meta };
}
