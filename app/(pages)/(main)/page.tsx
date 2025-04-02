"use client";

import { useRef, useEffect } from "react";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { useMainPageStore } from "@/stores/useMainPageStore";
import ScrollToTopButton from "@/app/_ui/shared/ScrollToTopButton";
import KakaoMap from "./_ui/KakaoMap";
import SearchBar from "./_ui/SearchBar";
import NearbyFilter from "./_ui/NearbyFilter";
import HospitalPharmacyTabs from "./_ui/HospitalPharmacyTabs";
import {
  usePlacesByKeyword,
  usePlacesByLocation,
} from "@/lib/queries/usePlaceQueries";
import { filterByDutyTime, flatPlacesByMode } from "@/utils/placeUtils";
import LoadingOverlay from "@/app/_ui/shared/LoadingOverlay";

export default function MainPage() {
  const { filterGroups, setActiveTab, isSearchMode, setIsSearchMode } =
    useMainPageStore();
  const topButtonTriggerRef = useRef<HTMLDivElement | null>(null);
  const { geoLocation, isAutoLoaded } = useCurrentLocation();

  // 첫 자동 위치 감지 성공 시 한 번만 검색 모드를 꺼줌
  useEffect(() => {
    if (isAutoLoaded) {
      setIsSearchMode(false);
    }
  }, [isAutoLoaded]);

  const placesByLocationQueryEnabled = !isSearchMode && !!geoLocation;
  const placedBySearchQueryEnabled =
    isSearchMode && !!filterGroups.query && !!geoLocation;

  const commonParams = [
    geoLocation?.lat,
    geoLocation?.lng,
    filterGroups.distance * 1000,
  ] as const;

  const {
    data: infiniteHospitals,
    fetchNextPage: fetchNextHospitalsPage,
    hasNextPage: hasNextHospitalsPage,
    isFetching: isFetchingHospitals,
    isFetchingNextPage: isFetchingNextHospitalsPage,
  } = usePlacesByLocation(
    ...commonParams,
    "hospital",
    placesByLocationQueryEnabled,
  );

  const {
    data: infinitePharmacies,
    fetchNextPage: fetchNextPharmaciesPage,
    hasNextPage: hasNextPharmaciesPage,
    isFetching: isFetchingPharmacies,
    isFetchingNextPage: isFetchingNextPharmaciesPage,
  } = usePlacesByLocation(
    ...commonParams,
    "pharmacy",
    placesByLocationQueryEnabled,
  );

  const {
    data: infiniteSearchResults,
    fetchNextPage: fetchNextSearchResultsPage,
    hasNextPage: hasNextSearchResultsPage,
    isFetching: isFetchingSearchResults,
    isFetchingNextPage: isFetchingNextSearchResultsPage,
  } = usePlacesByKeyword(
    ...commonParams,
    filterGroups.query,
    placedBySearchQueryEnabled,
  );

  // 검색 모드 유무에 따라 다른 형태의 flat한 데이터를 반환
  const { hospitals, pharmacies, activeTab } = flatPlacesByMode({
    isSearchMode,
    infiniteSearchResults,
    infiniteHospitals,
    infinitePharmacies,
  });

  useEffect(() => {
    if (activeTab) {
      setActiveTab(activeTab);
    }
  }, [activeTab]);

  // 데이터 필터링 (한계: 제공하는 API 특성상 결과값을 10개씩 띄우기가 불가능)
  const filteredHospitals = filterByDutyTime(hospitals, filterGroups);
  const filteredPharmacies = filterByDutyTime(pharmacies, filterGroups);

  return (
    <>
      {(isFetchingHospitals ||
        isFetchingPharmacies ||
        isFetchingSearchResults) && <LoadingOverlay />}

      <div className="flex flex-col md:h-[calc(100vh-5rem)] md:flex-row">
        {/* Left: Kakao Map */}
        <KakaoMap
          hospitals={filteredHospitals}
          pharmacies={filteredPharmacies}
          ref={topButtonTriggerRef}
        />

        {/* Right: Sidebar (Bottom Menu on Mobile) */}
        <div className="flex h-1/2 w-full flex-col border-l bg-white md:h-full md:w-1/3">
          <SearchBar />
          <NearbyFilter />
          <HospitalPharmacyTabs
            hospitals={filteredHospitals}
            pharmacies={filteredPharmacies}
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
              search: {
                fetchNextPage: fetchNextSearchResultsPage,
                hasNextPage: hasNextSearchResultsPage,
                isFetchingNextPage: isFetchingNextSearchResultsPage,
              },
            }}
          />
        </div>

        <ScrollToTopButton triggerRef={topButtonTriggerRef} />
      </div>
    </>
  );
}
