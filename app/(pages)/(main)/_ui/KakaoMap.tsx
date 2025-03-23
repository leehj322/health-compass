"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DEFAULT_GEOLOCATION } from "@/constants/defaultGeolocation";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import {
  PlacesByLocationResponse,
  PlaceWithDetails,
} from "@/lib/api/getPlacesByLocation";
import { useMainPageStore } from "@/stores/useMainPageStore";

const MARKER_OPTIONS = [
  { id: "hospital", label: "병원" },
  { id: "pharmacy", label: "약국" },
];

interface KakaoMapProps extends React.ComponentProps<"div"> {
  hospitals?: PlacesByLocationResponse;
  pharmacies?: PlacesByLocationResponse;
}

export default function KakaoMap({
  hospitals,
  pharmacies,
  ref,
  ...props
}: KakaoMapProps) {
  const { activeTab } = useMainPageStore();
  const [isLoading, isError] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_JS_API_KEY!,
  });

  return (
    <div
      className="relative h-[50vh] w-full md:h-full md:w-2/3"
      ref={ref}
      {...props}
    >
      {/* 카카오 지도 */}
      <Map
        center={{
          lat: DEFAULT_GEOLOCATION.latitude,
          lng: DEFAULT_GEOLOCATION.longitude,
        }}
        className="h-full w-full"
      >
        {activeTab === "hospital" && hospitals && (
          <MapMarkers places={hospitals.places} />
        )}
        {activeTab === "pharmacy" && pharmacies && (
          <MapMarkers places={pharmacies.places} />
        )}
      </Map>

      {/* 지도 위 마커 타입 필터 */}
      <MarkerFilter />
    </div>
  );
}

interface MapMarkersProps {
  places: PlaceWithDetails[];
}

function MapMarkers({ places }: MapMarkersProps) {
  const router = useRouter();

  return places.map((place) => (
    <MapMarker
      key={place.id}
      position={{ lat: Number(place.y), lng: Number(place.x) }}
      title={place.place_name}
      onClick={() => router.push(`/clinic/${place.id}`)}
    />
  ));
}

function MarkerFilter() {
  const { activeTab, setActiveTab } = useMainPageStore();

  return (
    <div className="absolute top-4 left-4 z-10 flex space-x-2 rounded-xl bg-white p-2 shadow-md">
      <RadioGroup
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as typeof activeTab)}
      >
        {MARKER_OPTIONS.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem
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
