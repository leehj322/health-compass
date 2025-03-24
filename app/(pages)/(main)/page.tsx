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
import { useGeoLocationStore } from "@/stores/useGeoLocation";
import { Meta } from "@/lib/api/kakaoLocal.type";

export default function MainPage() {
  const { filterGroups } = useMainPageStore();
  const topButtonTriggerRef = useRef<HTMLDivElement | null>(null);
  const { geoLocation } = useGeoLocationStore();

  useCurrentLocation();

  const {
    data: infiniteHospitals,
    fetchNextPage: fetchNextHospitalsPage,
    hasNextPage: hasNextHospitalsPage,
    isFetchingNextPage: isFetchingNextHospitalsPage,
  } = usePlacesByLocation(
    geoLocation?.lat,
    geoLocation?.lng,
    filterGroups.distance * 1000,
    "hospital",
  );

  const hospitals = infiniteHospitals && {
    places: infiniteHospitals.pages.flatMap((page) => page.places),
    meta: infiniteHospitals.pages.at(-1)?.meta as Meta,
  };

  const {
    data: infinitePharmacies,
    fetchNextPage: fetchNextPharmaciesPage,
    hasNextPage: hasNextPharmaciesPage,
    isFetchingNextPage: isFetchingNextPharmaciesPage,
  } = usePlacesByLocation(
    geoLocation?.lat,
    geoLocation?.lng,
    filterGroups.distance * 1000,
    "pharmacy",
  );

  const pharmacies = infinitePharmacies && {
    places: infinitePharmacies.pages.flatMap((page) => page.places),
    meta: infinitePharmacies.pages.at(-1)?.meta as Meta,
  };

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
        <HospitalPharmacyTabs
          hospitals={hospitals}
          pharmacies={pharmacies}
          infiniteValues={{
            hospital: {
              fetchNextPage: fetchNextHospitalsPage,
              hasNextPage: hasNextHospitalsPage,
              isFetchingNextPage: isFetchingNextHospitalsPage,
            },
            pharmacy: {
              fetchNextPage: fetchNextPharmaciesPage,
              hasNextPage: hasNextPharmaciesPage,
              isFetchingNextPage: isFetchingNextPharmaciesPage,
            },
          }}
        />
      </div>

      <ScrollToTopButton triggerRef={topButtonTriggerRef} />
    </div>
  );
}
