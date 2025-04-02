import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PlaceLikesResponse } from "@/lib/api/places/placeLikes.type";

/**
 * GET: 해당 place의 전체 좋아요 수 조회 및 좋아요 여부 확인
 * 쿼리 파라미터:
 *   - place_id (필수)
 *   - account_id (선택)
 */
export async function GET(
  req: Request,
): Promise<NextResponse<PlaceLikesResponse>> {
  const { searchParams } = new URL(req.url);
  const place_id = searchParams.get("place_id");
  const account_id = searchParams.get("account_id");

  if (!place_id) {
    return NextResponse.json(
      {
        success: false,
        code: "MISSING_PLACE_ID",
        message: "장소 ID가 누락되었습니다.",
      },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  // 해당 place의 전체 좋아요 수 조회 (실제 행 데이터 없이 count만 가져옴)
  const { count: likeCount, error: countError } = await supabase
    .from("place_likes")
    .select("*", { head: true, count: "exact" })
    .eq("place_id", place_id);

  if (countError && !(countError.message === "")) {
    return NextResponse.json(
      { success: false, code: "SERVER_ERROR", message: countError.message },
      { status: 500 },
    );
  }

  let hasLiked = false;

  if (account_id) {
    const { data, error: statusError } = await supabase
      .from("place_likes")
      .select("*")
      .eq("place_id", place_id)
      .eq("account_id", account_id)
      .maybeSingle();

    if (statusError) {
      return NextResponse.json(
        { success: false, code: "SERVER_ERROR", message: statusError.message },
        { status: 500 },
      );
    }

    hasLiked = !!data;
  }

  return NextResponse.json(
    { success: true, likeCount, hasLiked },
    { status: 200 },
  );
}
