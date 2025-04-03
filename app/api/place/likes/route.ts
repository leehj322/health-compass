import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  PlaceLikesEditResponse,
  PlaceLikesResponse,
} from "@/lib/api/places/placeLikes.type";

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

/**
 * POST: 해당 place에 좋아요 누르기
 * 요청 Body(JSON):
 *   - place_id: string (필수)
 */
export async function POST(
  req: Request,
): Promise<NextResponse<PlaceLikesEditResponse>> {
  const body = await req.json();
  const { place_id } = body;

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  // 이미 좋아요 눌렀는데 중복 POST 발생하는 경우 RLS로 인한 에러 발생 가능성 있음
  const { error } = await supabase
    .from("place_likes")
    .insert([{ place_id, account_id: user.id }]);

  if (error) {
    return NextResponse.json(
      { success: false, code: "SERVER_ERROR", message: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

/**
 * DELETE: 해당 place에 좋아요 취소하기
 * 쿼리 파라미터:
 *   - place_id (필수)
 */
export async function DELETE(
  req: Request,
): Promise<NextResponse<PlaceLikesEditResponse>> {
  const { searchParams } = new URL(req.url);
  const place_id = searchParams.get("place_id");

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const { error } = await supabase
    .from("place_likes")
    .delete()
    .eq("place_id", place_id)
    .eq("account_id", user.id);

  if (error) {
    return NextResponse.json(
      { success: false, code: "SERVER_ERROR", message: error.message },
      { status: 500 },
    );
  }

  // success: true 보내기 위해서 응답 코드 200으로 처리
  return NextResponse.json({ success: true }, { status: 200 });
}
