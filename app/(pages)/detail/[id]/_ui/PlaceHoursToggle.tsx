"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { PlaceWithDetails } from "@/lib/api/unifiedLocationApi.type";
import { formatDutyTime } from "@/utils/formatDutyTime";

const DAY_LABELS = [
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
  "일요일",
  "공휴일",
];

interface PlaceHoursToggleProps {
  placeData: PlaceWithDetails;
}

export default function PlaceHoursToggle({ placeData }: PlaceHoursToggleProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="pt-2 pb-4">
      <button
        onClick={() => setIsVisible((prev) => !prev)}
        className="flex cursor-pointer items-center text-sm font-semibold text-emerald-600 focus:outline-none"
      >
        영업시간 보기
        {isVisible ? (
          <ChevronUp className="ml-1" size={16} />
        ) : (
          <ChevronDown className="ml-1" size={16} />
        )}
      </button>
      {isVisible && (
        <div className="relative mt-2 rounded-md border border-emerald-600 p-3 text-sm">
          <p className="absolute right-3 bottom-3 text-xs text-gray-500">
            출처: data.go.kr
          </p>
          <ul className="mt-1 space-y-1">
            {placeData.details ? (
              DAY_LABELS.map((label, index) => {
                const dayNum = index + 1;
                const start = placeData.details?.[`dutyTime${dayNum}s`];
                const end = placeData.details?.[`dutyTime${dayNum}c`];

                if (!start || !end)
                  return <li key={label}>{label}: 영업 종료</li>;

                return (
                  <li key={label}>
                    {label}: {formatDutyTime(start)} ~ {formatDutyTime(end)}
                  </li>
                );
              })
            ) : (
              <li>영업 시간 정보 없음</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
