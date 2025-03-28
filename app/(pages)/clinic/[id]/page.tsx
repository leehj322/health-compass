import KakaoMap from "./_ui/KakaoMap";
import PlaceBasicInfo from "./_ui/PlaceBasicInfo";
import PlaceHoursToggle from "./_ui/PlaceHoursToggle";
import PlaceSocialActions from "./_ui/PlaceSocialActions";
import CommentForm from "./_ui/CommentForm";
import CommentList from "./_ui/CommentList";
import { redirect } from "next/navigation";
import { getPlaceByName } from "@/lib/api/kakaoLocal";
import {
  getHospitalDetailsByName,
  getPharmacyDetailsByName,
} from "@/lib/api/publicData";
import { PlaceDocument } from "@/lib/api/kakaoLocal.type";
import { PublicDataItem } from "@/lib/api/publicData.type";

interface PlaceDetailPageProps {
  params: { id: string };
  searchParams: {
    x?: string;
    y?: string;
    name?: string;
    addr?: string;
    code?: string;
  };
}

export default async function PlaceDetailPage({
  params,
  searchParams,
}: PlaceDetailPageProps) {
  const { id } = await params;
  const { x, y, name, addr } = await searchParams;

  if (!x || !y || !name || !addr) redirect(`/clinic/${id}/invalid`);

  let data: PlaceDocument & { details: PublicDataItem | null };

  try {
    const [kakaoRes, hospitalRes, pharmacyRes] = await Promise.allSettled([
      getPlaceByName(name, Number(x), Number(y)),
      getHospitalDetailsByName(name, addr, "server"),
      getPharmacyDetailsByName(name, addr, "server"),
    ]);

    // 카카오 응답 처리
    if (kakaoRes.status !== "fulfilled") {
      throw new Error("카카오 API 요청 실패");
    }
    if (!kakaoRes.value?.documents?.[0]) {
      throw new Error("카카오 장소 정보 없음");
    }
    const place = kakaoRes.value.documents[0];

    // kakao response의 정보와 비교했을 때, 일치하지 않는 경우 url 조작 판단
    if (id !== place.id) {
      redirect(`/clinic/${id}/invalid`);
    }

    // 공공데이터 응답 처리
    let details: PublicDataItem | null = null;
    if (pharmacyRes.status === "fulfilled" && pharmacyRes.value) {
      details = pharmacyRes.value;
    }
    if (hospitalRes.status === "fulfilled" && hospitalRes.value) {
      details = hospitalRes.value;
    }

    data = { ...place, details };
  } catch (error) {
    console.error("상세 페이지 데이터 요청 실패:", error);
    redirect(`/clinic/${id}/invalid`);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* 상단 레이아웃: 지도 + 장소 정보 */}
      <div className="grid gap-4 md:grid-cols-2">
        <KakaoMap placeData={data} />

        <div className="flex flex-col justify-between rounded-xl bg-gray-50 p-4 shadow md:min-h-72">
          <div className="space-y-1">
            <PlaceBasicInfo placeData={data} />
            <PlaceHoursToggle placeData={data} />
          </div>
          <div className="flex items-center justify-end space-x-4">
            <PlaceSocialActions />
          </div>
        </div>
      </div>

      {/* 하단 레이아웃: 댓글 작성 및 댓글 리스트 */}
      <CommentForm />
      <CommentList />
    </div>
  );
}
