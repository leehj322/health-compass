import KakaoMap from "./_ui/KakaoMap";
import PlaceBasicInfo from "./_ui/PlaceBasicInfo";
import PlaceHoursToggle from "./_ui/PlaceHoursToggle";
import PlaceSocialActions from "./_ui/PlaceSocialActions";
import CommentForm from "./_ui/CommentForm";
import CommentList from "./_ui/CommentList";
import { redirect } from "next/navigation";
import { PlaceDocument } from "@/lib/api/kakaoLocal.type";
import { PublicDataItem } from "@/lib/api/publicData.type";
import { TopLevelDetailComment } from "@/lib/api/comments/comments.type";
import { fetchPlaceDetail } from "@/lib/api/places/fetchPlaceDetail";

type PlaceDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    x?: string;
    y?: string;
    name?: string;
    addr?: string;
    code?: string;
  }>;
};

export default async function PlaceDetailPage({
  params,
  searchParams,
}: PlaceDetailPageProps) {
  const { id } = await params;
  const { x, y, name, addr } = await searchParams;

  if (!x || !y || !name || !addr) redirect(`/clinic/${id}/invalid`);

  let placeData: PlaceDocument & { details: PublicDataItem | null };
  let commentsData: TopLevelDetailComment[] = [];
  let commentsErrorMessage: string | null = null;

  // 장소 정보를 카카오 및 공공데이터 API에서 받아옴
  // 실패 시 잘못된 요청으로 간주하고 invalid 페이지로 redirect 처리
  try {
    placeData = await fetchPlaceDetail({
      id,
      name,
      addr,
      x: Number(x),
      y: Number(y),
    });
  } catch (error) {
    console.error("상세 페이지 장소 정보 요청 실패:", error);
    redirect(`/clinic/${id}/invalid`);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* 상단 레이아웃: 지도 + 장소 정보 */}
      <div className="grid gap-4 md:grid-cols-2">
        <KakaoMap placeData={placeData} />

        <div className="flex flex-col justify-between rounded-xl bg-gray-50 p-4 shadow md:min-h-72">
          <div className="space-y-1">
            <PlaceBasicInfo placeData={placeData} />
            <PlaceHoursToggle placeData={placeData} />
          </div>
          <div className="flex items-center justify-end space-x-4">
            <PlaceSocialActions />
          </div>
        </div>
      </div>

      {/* 하단 레이아웃: 댓글 작성 및 댓글 리스트 */}
      <CommentForm />
      <CommentList
        comments={commentsData}
        errorMessage={commentsErrorMessage}
      />
    </div>
  );
}
