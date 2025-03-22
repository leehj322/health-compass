import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface KakaoMapProps {
  markerFilter?: {
    selectedMarker: "hospital" | "pharmacy";
    onChange: (value: "hospital" | "pharmacy") => void;
  };
  ref?: React.RefObject<HTMLDivElement | null>;
}

export default function KakaoMap({ markerFilter, ref }: KakaoMapProps) {
  return (
    <div className="relative h-[50vh] w-full md:h-full md:w-2/3" ref={ref}>
      {/* KakaoMap 컴포넌트로 대체 */}
      <div className="flex h-full w-full items-center justify-center bg-gray-200">
        <span className="text-gray-500">Kakao Map Placeholder</span>
      </div>

      {/* 지도 위 마커 타입 필터 */}
      {markerFilter && (
        <div className="absolute top-4 left-4 z-10 flex space-x-2 rounded-xl bg-white p-2 shadow-md">
          <RadioGroup
            value={markerFilter.selectedMarker}
            onValueChange={markerFilter.onChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                id="hospital"
                value="hospital"
                className="cursor-pointer"
              />
              <Label htmlFor="hospital" className="cursor-pointer text-sm">
                병원
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                id="pharmacy"
                value="pharmacy"
                className="cursor-pointer"
              />
              <Label htmlFor="pharmacy" className="cursor-pointer text-sm">
                약국
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}
    </div>
  );
}
