"use client";

import { useState, useEffect, useRef } from "react";
import { useMainPageStore } from "@/stores/useMainPageStore";
import ScrollToTopButton from "@/app/_ui/shared/ScrollToTopButton";
import KakaoMap from "@/app/_ui/shared/KakaoMap";
import SearchBar from "./_ui/SearchBar";
import NearbyFilter from "./_ui/NearbyFilter";
import HospitalPharmacyTabs from "./_ui/HospitalPharmacyTabs";
import { usePlacesByLocation } from "@/lib/queries/usePlaceQueries";
import { DEFAULT_GEOLOCATION } from "@/constants/defaultGeolocation";

export default function MainPage() {
  const { filterGroups, activeTab, setActiveTab } = useMainPageStore();
  const topButtonTriggerRef = useRef<HTMLDivElement | null>(null);

  const [geoLocation, setGeoLocation] = useState<GeolocationCoordinates | null>(
    null,
  );

  const { data: hospitals } = usePlacesByLocation(
    geoLocation?.latitude || DEFAULT_GEOLOCATION.latitude,
    geoLocation?.longitude || DEFAULT_GEOLOCATION.longitude,
    filterGroups.distance * 1000,
    1,
    "hospital",
    {
      enabled: !!geoLocation,
    },
  );

  const { data: pharmacies } = usePlacesByLocation(
    geoLocation?.latitude || DEFAULT_GEOLOCATION.latitude,
    geoLocation?.longitude || DEFAULT_GEOLOCATION.longitude,
    filterGroups.distance * 1000,
    1,
    "pharmacy",
    {
      enabled: !!geoLocation,
    },
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("이 브라우저는 위치 정보를 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (success) => {
        console.log("사용자가 위치 정보를 허용했습니다.");
        if (success.coords.accuracy < 100) {
          setGeoLocation(success.coords);
        } else {
          console.log("위치 정보가 정확하지 않습니다 직접 입력 해주세요.");
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          console.log("사용자가 위치 정보 제공을 거부했습니다.");
        } else {
          console.log("위치 정보를 가져오는 중 오류 발생:", error.message);
        }
      },
    );
  }, []);

  return (
    <div className="flex flex-col md:h-[calc(100vh-5rem)] md:flex-row">
      {/* Left: Kakao Map */}
      <KakaoMap
        markerFilter={{
          selectedMarker: activeTab,
          onChange: (value) => setActiveTab(value),
        }}
        hospitals={hospitals}
        pharmacies={pharmacies}
        ref={topButtonTriggerRef}
      />

      {/* Right: Sidebar (Bottom Menu on Mobile) */}
      <div className="flex h-1/2 w-full flex-col border-l bg-white md:h-full md:w-1/3">
        <SearchBar />
        <NearbyFilter />
        <HospitalPharmacyTabs hospitals={hospitals} pharmacies={pharmacies} />
      </div>

      <ScrollToTopButton triggerRef={topButtonTriggerRef} />
    </div>
  );
}
