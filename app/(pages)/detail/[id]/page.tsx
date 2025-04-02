import KakaoMap from "./_ui/KakaoMap";
import PlaceBasicInfo from "./_ui/PlaceBasicInfo";
import PlaceHoursToggle from "./_ui/PlaceHoursToggle";
import PlaceSocialActions from "./_ui/PlaceSocialActions";
import CommentForm from "./_ui/CommentForm";
import CommentList from "./_ui/CommentList";
import { redirect } from "next/navigation";
import { fetchPlaceDetail } from "@/lib/api/places/fetchPlaceDetail";
import { fetchCommentsByPlaceId } from "@/lib/api/comments/fetchCommentsByPlaceId";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queries/queryKeys";

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

  // URL에 쿼리가 정상적으로 담겨있는지 확인
  if (!x || !y || !name || !addr) redirect(`/clinic/${id}/invalid`);

  const queryClient = new QueryClient();

  const [placeDetailRes /* , _ */] = await Promise.allSettled([
    fetchPlaceDetail({ id, name, addr, x: Number(x), y: Number(y) }),
    queryClient.prefetchInfiniteQuery({
      queryKey: QUERY_KEYS.comments.byPlaceId(id),
      queryFn: async () => await fetchCommentsByPlaceId(id),
      initialPageParam: 1,
    }),
  ]);

  const dehydratedState = dehydrate(queryClient);

  // 장소 정보 처리 (실패 시 invalid 페이지로 redirect)
  if (placeDetailRes.status !== "fulfilled") {
    console.error("장소 정보 요청 실패:", placeDetailRes.reason);
    redirect(`/clinic/${id}/invalid`);
  }
  const placeData = placeDetailRes.value;

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
      <HydrationBoundary state={dehydratedState}>
        <CommentList placeId={id} />
      </HydrationBoundary>
    </div>
  );
}
