"use client";

import { useRef } from "react";
import useCurrentLocation from "@/hooks/useCurrentLocation";
import { useMainPageStore } from "@/stores/useMainPageStore";
import ScrollToTopButton from "@/app/_ui/shared/ScrollToTopButton";
import KakaoMap from "./_ui/KakaoMap";
import SearchBar from "./_ui/SearchBar";
import NearbyFilter from "./_ui/NearbyFilter";
import HospitalPharmacyTabs from "./_ui/HospitalPharmacyTabs";
import { usePlacesByLocation } from "@/lib/queries/usePlaceQueries";
import { DEFAULT_GEOLOCATION } from "@/constants/defaultGeolocation";
import { useGeoLocationStore } from "@/stores/useGeoLocation";

export default function MainPage() {
  const { filterGroups } = useMainPageStore();
  const topButtonTriggerRef = useRef<HTMLDivElement | null>(null);
  const { geoLocation } = useGeoLocationStore();

  useCurrentLocation();

  const { data: hospitals } = usePlacesByLocation(
    geoLocation?.lat || DEFAULT_GEOLOCATION.latitude,
    geoLocation?.lng || DEFAULT_GEOLOCATION.longitude,
    filterGroups.distance * 1000,
    1,
    "hospital",
    {
      enabled: !!geoLocation,
    },
  );

  const { data: pharmacies } = usePlacesByLocation(
    geoLocation?.lat || DEFAULT_GEOLOCATION.latitude,
    geoLocation?.lng || DEFAULT_GEOLOCATION.longitude,
    filterGroups.distance * 1000,
    1,
    "pharmacy",
    {
      enabled: !!geoLocation,
    },
  );

  return (
    <div className="flex flex-col md:h-[calc(100vh-5rem)] md:flex-row">
      {/* Left: Kakao Map */}
      <KakaoMap
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
