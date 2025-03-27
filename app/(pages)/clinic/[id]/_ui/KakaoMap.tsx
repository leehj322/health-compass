"use client";

import { useRef } from "react";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import { PlaceWithDetails } from "@/lib/api/unifiedLocationApi.type";
import Spinner from "@/app/_ui/shared/Spinner";
import { MARKER_SRC } from "@/constants/markerSrc";
import { CATEGORY_CODE } from "@/constants/categoryCode";

interface KakaoMapProps {
  placeData: PlaceWithDetails;
}

export default function KakaoMap({ placeData }: KakaoMapProps) {
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const [isLoading, isError] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_JS_API_KEY!,
  });

  if (isError)
    return (
      <div className="flex h-72 items-center justify-center bg-gray-50 text-sm text-gray-500">
        지도를 불러오는 데 문제가 발생했어요.
      </div>
    );

  if (isLoading)
    return (
      <div className="flex h-72 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
        <div className="flex h-full w-full items-center justify-center">
          <Spinner />
        </div>
      </div>
    );

  return (
    <div className="relative flex h-72 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
      <Map
        ref={mapRef}
        center={{ lat: Number(placeData.y), lng: Number(placeData.x) }}
        level={4}
        className="h-full w-full"
      >
        <MapMarker
          title={placeData.place_name}
          position={{ lat: Number(placeData.y), lng: Number(placeData.x) }}
          image={{
            src: MARKER_SRC[
              placeData.category_group_code === CATEGORY_CODE.pharmacy
                ? "pharmacy"
                : "hospital"
            ],
            size: {
              width: 33,
              height: 33,
            },
          }}
        />
      </Map>
    </div>
  );
}
