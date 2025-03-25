"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import {
  PlacesByLocationResponse,
  PlaceWithDetails,
} from "@/lib/api/unifiedLocationApi.type";
import { useMainPageStore } from "@/stores/useMainPageStore";
import { useGeoLocationStore } from "@/stores/useGeoLocation";

const MARKER_OPTIONS = [
  { id: "hospital", label: "병원" },
  { id: "pharmacy", label: "약국" },
];

const MARKER_SRC = {
  me: "/markers/home.png",
  hospital: "/markers/hospital.png",
  pharmacy: "/markers/pharmacy.png",
};

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
  const { map, activeTab } = useMainPageStore();
  const { geoLocation } = useGeoLocationStore();
  const [isLoading, isError] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_JS_API_KEY!,
  });

  // geoLocation값이 바뀌면 지도의 중앙을 업데이트
  useEffect(() => {
    if (geoLocation) {
      map.setCenter({
        lat: geoLocation.lat,
        lng: geoLocation.lng,
      });
    }
  }, [geoLocation]);

  // Map이 마운트 되면서 ref가 할당될 때 실행되는 콜백 ref
  const setMapRef = useCallback(
    (element: kakao.maps.Map | null) => {
      // map.ref가 null이 아닐 때 까지만 실행
      if (element && element !== map.ref) {
        map.setRef(element);
      }
    },
    [map.ref], // if 문에서 비교를 위한 deps
  );

  return (
    <div
      className="relative h-[50vh] w-full md:h-full md:w-2/3"
      ref={ref}
      {...props}
    >
      {/* 카카오 지도 */}
      <Map center={map.center} ref={setMapRef} className="h-full w-full">
        {geoLocation && (
          <MapMarker
            position={{ lat: geoLocation.lat, lng: geoLocation.lng }}
            title="내 위치"
            image={{
              src: MARKER_SRC["me"],
              size: {
                width: 40,
                height: 40,
              },
            }}
          />
        )}
        {activeTab === "hospital" && hospitals && (
          <MapMarkers places={hospitals.places} variant="hospital" />
        )}
        {activeTab === "pharmacy" && pharmacies && (
          <MapMarkers places={pharmacies.places} variant="pharmacy" />
        )}
      </Map>

      {/* 지도 위 마커 타입 필터 */}
      <MarkerFilter />
    </div>
  );
}

interface MapMarkersProps {
  places: PlaceWithDetails[];
  variant: "hospital" | "pharmacy" | "me";
}

function MapMarkers({ places, variant }: MapMarkersProps) {
  const router = useRouter();

  return places.map((place) => (
    <MapMarker
      key={place.id}
      position={{ lat: Number(place.y), lng: Number(place.x) }}
      title={place.place_name}
      onClick={() => router.push(`/clinic/${place.id}`)}
      image={{
        src: MARKER_SRC[variant],
        size: {
          width: 40,
          height: 40,
        },
      }}
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
