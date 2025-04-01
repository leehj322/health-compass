import { getPlaceByName } from "@/lib/api/kakaoLocal";
import { PlaceDocument } from "@/lib/api/kakaoLocal.type";
import {
  getHospitalDetailsByName,
  getPharmacyDetailsByName,
} from "@/lib/api/publicData";
import { PublicDataItem } from "@/lib/api/publicData.type";

export async function fetchPlaceDetail({
  id,
  name,
  addr,
  x,
  y,
}: {
  id: string;
  name: string;
  addr: string;
  x: number;
  y: number;
}): Promise<PlaceDocument & { details: PublicDataItem | null }> {
  const [kakaoRes, hospitalRes, pharmacyRes] = await Promise.allSettled([
    getPlaceByName(name, x, y),
    getHospitalDetailsByName(name, addr, "server"),
    getPharmacyDetailsByName(name, addr, "server"),
  ]);

  // 카카오 응답 처리
  if (kakaoRes.status !== "fulfilled" || !kakaoRes.value?.documents?.[0]) {
    throw new Error("카카오 장소 정보 요청 실패");
  }

  const place = kakaoRes.value.documents[0];

  // 카카오 응답의 정보와 비교했을 때, 일치하지 않는 경우 URL 조작 판단
  if (id !== place.id) {
    throw new Error("잘못된 URL 또는 장소 ID 불일치");
  }

  // 공공데이터 응답 처리
  let details: PublicDataItem | null = null;
  if (pharmacyRes.status === "fulfilled" && pharmacyRes.value) {
    details = pharmacyRes.value;
  }
  if (hospitalRes.status === "fulfilled" && hospitalRes.value) {
    details = hospitalRes.value;
  }

  return { ...place, details };
}
