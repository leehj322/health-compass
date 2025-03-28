import { PlaceWithDetails } from "@/lib/api/unifiedLocationApi.type";

/**
 * 주어진 장소 정보(`PlaceWithDetails`)를 기반으로
 * `/clinic/[id]` 페이지에서 사용할 URL 쿼리 문자열을 생성합니다.
 *
 * - `place_name` → name
 * - `road_address_name` → addr
 * - `x` or `lng` → x
 * - `y` or `lat` → y
 *
 * URLSearchParams를 사용하여 자동 인코딩되며,
 * 결과는 `name=...&addr=...&x=...&y=...` 형태입니다.
 *
 * @param place - 쿼리로 만들 장소 정보 객체
 * @returns 인코딩된 URL 쿼리 문자열
 */
export function buildPlaceDetailQuery(place: PlaceWithDetails) {
  const { place_name, road_address_name, x, y } = place;

  const query = new URLSearchParams();

  query.set("name", place_name);
  query.set("addr", road_address_name);
  query.set("x", x);
  query.set("y", y);

  return query.toString();
}
