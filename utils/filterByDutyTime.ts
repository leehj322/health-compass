import { PlacesByLocationResponse } from "@/lib/api/unifiedLocationApi.type";

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
