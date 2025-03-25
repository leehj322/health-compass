import { useState, useEffect } from "react";
import { useMainPageStore } from "@/stores/useMainPageStore";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Filter, Moon, Music, Gift, BookOpen } from "lucide-react";
import AddressSearchModal from "./AddressSearchModal";
import { useDebouncedValue } from "@/hooks/useDebounce";

export default function NearbyFilter() {
  const { filterGroups, setFilterGroups } = useMainPageStore();
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [distance, setDistance] = useState(filterGroups.distance || 1);
  const debouncedDistance = useDebouncedValue(distance, 500);

  // zustand의 상태값과 useState 값의 동기화
  useEffect(() => {
    if (filterGroups.distance !== distance) {
      setDistance(filterGroups.distance);
    }
  }, [filterGroups.distance]);

  // zustand의 상태값과 디바운스된 값의 동기화, API요청 발생
  useEffect(() => {
    if (debouncedDistance !== filterGroups.distance) {
      setFilterGroups("distance", debouncedDistance);
    }
  }, [debouncedDistance, filterGroups.distance]);

  return (
    <div className="space-y-4 border-b p-4">
      {/* 내 위치 기준 버튼 + 필터 토글 버튼 */}
      <div className="flex w-full gap-2">
        <AddressSearchModal />
        <Button
          variant="outline"
          size="sm"
          className="h-9 hover:cursor-pointer"
          onClick={() => setIsFilterVisible((prev) => !prev)}
        >
          <Filter size={16} />
        </Button>
      </div>
      {isFilterVisible && (
        <>
          {/* 거리 필터 */}
          <div>
            <p className="mb-1 text-sm font-medium">거리 (km)</p>
            <Slider
              defaultValue={[1]}
              max={5}
              step={0.5}
              onValueChange={(value) => setDistance(value[0])}
              className="hover:cursor-pointer"
            />
            <p className="mt-2 text-sm text-emerald-600">{distance} km</p>
          </div>

          {/* 영업시간 필터 */}
          <div className="space-y-2">
            <p className="text-sm font-medium">영업 시간</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilterGroups("night", (prev) => !prev);
                  setFilterGroups("nightTime", 6);
                }}
                className={`flex items-center gap-1 hover:cursor-pointer ${
                  filterGroups.night && "text-emerald-600"
                }`}
              >
                <Moon size={16} />
                야간 (6시 이후)
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterGroups("saturday", (prev) => !prev)}
                className={`flex items-center gap-1 hover:cursor-pointer ${
                  filterGroups.saturday && "text-emerald-600"
                }`}
              >
                <Music size={16} />
                토요일
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterGroups("sunday", (prev) => !prev)}
                className={`flex items-center gap-1 hover:cursor-pointer ${
                  filterGroups.sunday && "text-emerald-600"
                }`}
              >
                <BookOpen size={16} />
                일요일
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterGroups("holiday", (prev) => !prev)}
                className={`flex items-center gap-1 hover:cursor-pointer ${
                  filterGroups.holiday && "text-emerald-600"
                }`}
              >
                <Gift size={16} />
                공휴일
              </Button>
            </div>

            {/* 시간대 선택 (야간 버튼이 클릭된 경우에만 활성화) */}
            {filterGroups.night && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">시간대 선택</p>
                  <p className="text-xs text-gray-400">
                    ※ 6시 이전은 선택할 수 없습니다
                  </p>
                </div>
                <Slider
                  defaultValue={[6]}
                  max={12}
                  min={5}
                  step={1}
                  onValueChange={(value) => {
                    setFilterGroups("nightTime", Math.max(value[0], 6)); // 6시 이후만 입력값 가능
                  }}
                  className="hover:cursor-pointer"
                />
                <p className="mt-2 text-sm text-emerald-600">
                  {filterGroups.nightTime}시 이후
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
