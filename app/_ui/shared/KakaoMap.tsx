"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const MARKER_OPTIONS = [
  { id: "hospital", label: "병원" },
  { id: "pharmacy", label: "약국" },
];

interface MarkerFilter {
  selectedMarker: "hospital" | "pharmacy";
  onChange: (value: "hospital" | "pharmacy") => void;
}

interface KakaoMapProps extends React.ComponentProps<"div"> {
  markerFilter?: MarkerFilter;
}

export default function KakaoMap({
  markerFilter,
  ref,
  ...props
}: KakaoMapProps) {
  return (
    <div
      className="relative h-[50vh] w-full md:h-full md:w-2/3"
      ref={ref}
      {...props}
    >
      {/* KakaoMap 컴포넌트로 대체 */}
      <div className="flex h-full w-full items-center justify-center bg-gray-200">
        <span className="text-gray-500">Kakao Map Placeholder</span>
      </div>

      {/* 지도 위 마커 타입 필터 */}
      {markerFilter && <MarkerFilter markerFilter={markerFilter} />}
    </div>
  );
}

interface MarkerFilterProps {
  markerFilter: MarkerFilter;
}

function MarkerFilter({ markerFilter }: MarkerFilterProps) {
  return (
    <div className="absolute top-4 left-4 z-10 flex space-x-2 rounded-xl bg-white p-2 shadow-md">
      <RadioGroup
        value={markerFilter.selectedMarker}
        onValueChange={markerFilter.onChange}
      >
        {MARKER_OPTIONS.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem
              key={option.id}
              id={option.id}
              value={option.id}
              className="cursor-pointer"
            />
            <Label htmlFor={option.id} className="cursor-pointer text-sm">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
