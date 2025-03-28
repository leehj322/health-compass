import { getPlaceByCategory, getPlaceByKeyword } from "./kakaoLocal";
import {
  getHospitalDetailsByName,
  getPharmacyDetailsByName,
} from "./publicData";
import { PlaceDocument } from "./kakaoLocal.type";
import {
  PlacesByLocationResponse,
  PlacesByKeywordResponse,
} from "./unifiedLocationApi.type";
import { CATEGORY_CODE } from "@/constants/categoryCode";

export const getPlacesByLocation = async (
  lat: number,
  lng: number,
  radius: number,
  page: number,
  category: "hospital" | "pharmacy",
): Promise<PlacesByLocationResponse> => {
  // Kakao local API 요청
  const { documents: places, meta } = await getPlaceByCategory(
    lat,
    lng,
    radius,
    page,
    category,
  );

  if (places.length === 0) {
    return { places: [], meta };
  }

  // 공공 데이터 API 요청 병렬 처리
  const placesWithDetails = await Promise.all(
    places.map((place) =>
      enrichPlaceWithDetails(place, place.category_group_code),
    ),
  );

  // 두 API Response를 합쳐서 반환
  return {
    places: placesWithDetails,
    meta,
  } as PlacesByLocationResponse;
};

export const getPlacesByKeyword = async (
  lat: number,
  lng: number,
  radius: number,
  page: number,
  keyword: string,
): Promise<PlacesByKeywordResponse> => {
  // Kakao local API 요청
  const { documents: places, meta } = await getPlaceByKeyword(
    lat,
    lng,
    radius,
    page,
    keyword,
  );

  if (places.length === 0) {
    return { places: [], meta };
  }

  // 공공 데이터 API 요청 병렬 처리
  const placesWithDetails = await Promise.all(
    places.map((place) =>
      enrichPlaceWithDetails(place, place.category_group_code),
    ),
  );

  // 두 API Response를 합쳐서 반환
  return {
    places: placesWithDetails,
    meta,
  } as PlacesByKeywordResponse;
};

async function enrichPlaceWithDetails(place: PlaceDocument, category: string) {
  const { place_name, road_address_name } = place;
  try {
    let details = null;
    if (category === CATEGORY_CODE["hospital"]) {
      details = await getHospitalDetailsByName(place_name, road_address_name);
    } else {
      details = await getPharmacyDetailsByName(place_name, road_address_name);
    }
    return { ...place, details };
  } catch (error) {
    console.error(`공공 데이터 요청 실패: ${place_name} ${error}`);
    return { ...place, details: null };
  }
}
