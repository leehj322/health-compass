import { getPlaceByCategory } from "./kakaoLocal";
import {
  getHospitalDetailsByName,
  getPharmacyDetailsByName,
} from "./publicData";
import { PlaceDocumentSummary } from "./kakaoLocal.type";
import { PlacesByLocationResponse } from "./unifiedLocationApi.type";

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

  const placesSummary: PlaceDocumentSummary[] = [];
  // place에 실제로 key, value가 더 있으나 사용하지 않기 때문에 타입 정의는 PlaceDocumentSummary로 함
  places.forEach((place: PlaceDocumentSummary) => {
    placesSummary.push({
      road_address_name: place.road_address_name,
      category_name: place.category_name,
      distance: place.distance,
      id: place.id,
      phone: place.phone,
      place_name: place.place_name,
      place_url: place.place_url,
      x: place.x,
      y: place.y,
    });
  });

  // 공공 데이터 API 요청 병렬 처리
  const placesWithDetails = await Promise.all(
    placesSummary.map(async (placesSummary) => {
      const { place_name, road_address_name } = placesSummary;
      try {
        let details = null;
        if (category === "hospital") {
          details = await getHospitalDetailsByName(
            place_name,
            road_address_name,
          );
        } else {
          details = await getPharmacyDetailsByName(
            place_name,
            road_address_name,
          );
        }
        return {
          ...placesSummary,
          details,
        };
      } catch (error) {
        console.error(`공공 데이터 요청 실패: ${place_name}} ${error}`);
        return {
          ...placesSummary,
          details: null,
        };
      }
    }),
  );

  // 두 API Response를 합쳐서 반환
  return {
    places: placesWithDetails,
    meta,
  } as PlacesByLocationResponse;
};
