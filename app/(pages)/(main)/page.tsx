"use client";

import { useRef, useEffect } from "react";
import useCurrentLocation from "@/hooks/useCurrentLocation";
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
import { Meta } from "@/lib/api/kakaoLocal.type";
import { CATEGORY_CODE } from "@/constants/categoryCode";
import { filterByDutyTime } from "@/utils/filterByDutyTime";

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
    !isSearchMode && !!geoLocation,
  );

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
    !isSearchMode && !!geoLocation,
  );

  const {
    data: infiniteSearchResults,
    fetchNextPage: fetchNextSearchResultsPage,
    hasNextPage: hasNextSearchResultsPage,
    isFetchingNextPage: isFetchingNextSearchResultsPage,
  } = usePlacesByKeyword(
    geoLocation?.lat,
    geoLocation?.lng,
    filterGroups.distance * 1000,
    filterGroups.query,
    isSearchMode && !!filterGroups.query && !!geoLocation,
  );

  let hospitals, pharmacies;

  // 검색 모드일 경우, 첫 번째 검색 결과의 카테고리에 따라 병원 또는 약국 데이터만 필터링하여 표시합니다.
  // 내 주변 모드일 경우, 내 주변 병원과 약국 데이터를 모두 표시합니다.
  if (isSearchMode && infiniteSearchResults) {
    const firstCategoryGroup = infiniteSearchResults.pages[0].places.find(
      (place) =>
        Object.values(CATEGORY_CODE).includes(place.category_group_code),
    )?.category_group_code;

    if (firstCategoryGroup === CATEGORY_CODE.hospital) {
      hospitals = {
        places: infiniteSearchResults.pages
          .flatMap((page) => page.places)
          .filter(
            (place) => place.category_group_code === CATEGORY_CODE.hospital,
          ),
        meta: { ...infiniteSearchResults.pages.at(-1)?.meta } as Meta,
      };
    }

    if (firstCategoryGroup === CATEGORY_CODE.pharmacy) {
      pharmacies = {
        places: infiniteSearchResults.pages
          .flatMap((page) => page.places)
          .filter(
            (place) => place.category_group_code === CATEGORY_CODE.pharmacy,
          ),
        meta: { ...infiniteSearchResults.pages.at(-1)?.meta } as Meta,
      };
    }
  } else {
    hospitals = infiniteHospitals && {
      places: infiniteHospitals.pages.flatMap((page) => page.places),
      meta: infiniteHospitals.pages.at(-1)?.meta as Meta,
    };

    pharmacies = infinitePharmacies && {
      places: infinitePharmacies.pages.flatMap((page) => page.places),
      meta: infinitePharmacies.pages.at(-1)?.meta as Meta,
    };
  }

  useEffect(() => {
    if (!isSearchMode || !infiniteSearchResults) return;

    const firstCategory = infiniteSearchResults.pages[0].places.find(
      (place) =>
        place.category_group_code === CATEGORY_CODE.hospital ||
        place.category_group_code === CATEGORY_CODE.pharmacy,
    )?.category_group_code;

    if (firstCategory === CATEGORY_CODE.hospital) {
      setActiveTab("hospital");
    } else if (firstCategory === CATEGORY_CODE.pharmacy) {
      setActiveTab("pharmacy");
    }
  }, [isSearchMode, infiniteSearchResults]);

  // 데이터 필터링 (제공하는 API 특성상 결과값을 10개씩 띄우기가 불가능)
  const filteredHospitals = filterByDutyTime(hospitals, filterGroups);
  const filteredPharmacies = filterByDutyTime(pharmacies, filterGroups);

  return (
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
  );
}
