"use client";

import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import { Button } from "@/components/ui/button";
import {
  PlacesByLocationResponse,
  PlaceWithDetails,
} from "@/lib/api/unifiedLocationApi.type";
import { useMainPageStore } from "@/stores/useMainPageStore";
import { useGeoLocationStore } from "@/stores/useGeoLocation";
import { Home } from "lucide-react";
import Spinner from "@/app/_ui/shared/Spinner";
import { MARKER_SRC } from "@/constants/markerSrc";
import { buildPlaceDetailQuery } from "@/utils/buildQueryString";

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

  if (isError)
    return (
      <div className="flex h-[50vh] w-full items-center justify-center bg-gray-50 text-sm text-gray-500 md:h-full md:w-2/3">
        지도를 불러오는 데 문제가 발생했어요.
      </div>
    );

  if (isLoading)
    return (
      <div
        className="relative h-[50vh] w-full bg-gray-100 md:h-full md:w-2/3"
        ref={ref}
        {...props}
      >
        <div className="flex h-full w-full items-center justify-center">
          <Spinner />
        </div>
      </div>
    );

  return (
    <div
      className="relative h-[50vh] w-full md:h-full md:w-2/3"
      ref={ref}
      {...props}
    >
      {/* 카카오 지도 */}
      <Map
        center={map.center}
        level={4}
        ref={setMapRef}
        className="h-full w-full"
      >
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

      {/* 지도 중심 이동 버튼 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (geoLocation && map.ref) {
            map.ref.panTo(
              new kakao.maps.LatLng(geoLocation.lat, geoLocation.lng),
            );
          }
        }}
        className="absolute top-4 left-4 z-10 bg-white shadow-md hover:cursor-pointer hover:bg-gray-100"
      >
        <Home size={16} />
        지도 중심 이동
      </Button>
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
      onClick={() =>
        router.push(`/detail/${place.id}?${buildPlaceDetailQuery(place)}`)
      }
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
