import { InfiniteData } from "@tanstack/react-query";
import { PlacesByLocationResponse } from "@/lib/api/unifiedLocationApi.type";
import { CATEGORY_CODE } from "@/constants/categoryCode";

interface FlatPlacesByModeParams {
  isSearchMode: boolean;
  infiniteSearchResults?: InfiniteData<PlacesByLocationResponse>;
  infiniteHospitals?: InfiniteData<PlacesByLocationResponse>;
  infinitePharmacies?: InfiniteData<PlacesByLocationResponse>;
}

export function flatPlacesByMode({
  isSearchMode,
  infiniteSearchResults,
  infiniteHospitals,
  infinitePharmacies,
}: FlatPlacesByModeParams): {
  hospitals?: PlacesByLocationResponse;
  pharmacies?: PlacesByLocationResponse;
  activeTab?: "hospital" | "pharmacy";
} {
  // 검색 모드인 경우, 첫 번째 검색 결과의 카테고리에 따라 병원 또는 약국 데이터만 표시합니다.
  if (isSearchMode) {
    // 검색 결과가 없는 경우
    if (!infiniteSearchResults)
      return { hospitals: undefined, pharmacies: undefined };

    const flattened = {
      places: infiniteSearchResults.pages.flatMap((page) => page.places),
      meta: infiniteSearchResults.pages.at(-1)?.meta!,
    };

    // 첫 번째 카테고리에 따라 return 값을 정함
    const firstCategoryGroup = infiniteSearchResults.pages[0].places.find(
      (place) =>
        Object.values(CATEGORY_CODE).includes(place.category_group_code),
    )?.category_group_code;

    // 첫 번째 카테고리가 병원인 경우
    if (firstCategoryGroup === CATEGORY_CODE.hospital) {
      return {
        hospitals: flattened,
        pharmacies: undefined,
        activeTab: "hospital",
      };
    }

    // 첫 번째 카테고리가 약국인 경우
    if (firstCategoryGroup === CATEGORY_CODE.pharmacy) {
      return {
        hospitals: undefined,
        pharmacies: flattened,
        activeTab: "pharmacy",
      };
    }

    // 병원과 약국 카테고리 모두에 해당하지 않는 검색 결과인 경우
    return { hospitals: undefined, pharmacies: undefined };
  } else {
    const hospitals = infiniteHospitals && {
      places: infiniteHospitals.pages.flatMap((page) => page.places),
      meta: infiniteHospitals.pages.at(-1)?.meta!,
    };
    const pharmacies = infinitePharmacies && {
      places: infinitePharmacies.pages.flatMap((page) => page.places),
      meta: infinitePharmacies.pages.at(-1)?.meta!,
    };

    // 검색 모드가 아닌 경우 병원과 약국 모두를 반환합니다
    return { hospitals, pharmacies };
  }
}
