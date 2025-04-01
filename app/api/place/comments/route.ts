import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { buildCommentTree } from "@/utils/buildCommentTree";

const PAGE_SIZE = 5;

export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get("external_institution_id");
  const page = Number(searchParams.get("page") || "1");

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // 1. 상위 댓글만 페이징
  const {
    data: topLevelComments,
    error: topLevelError,
    count: totalCount,
  } = await supabase
    .from("comments")
    .select("id", { count: "exact" })
    .eq("external_institution_id", placeId)
    .is("parent_id", null)
    .order("created_at", { ascending: false }) // 최신순
    .range(from, to);

  if (topLevelError) {
    return NextResponse.json(
      {
        success: false,
        code: "FAILED_COMMENTS_FETCH",
        message: "상위 댓글 조회 실패",
      },
      { status: 500 },
    );
  }

  const topLevelIds = topLevelComments.map((c) => c.id);

  if (topLevelIds.length === 0) {
    return NextResponse.json(
      { success: true, comments: [], totalCount },
      { status: 200 },
    );
  }

  // 2. 상위 댓글 + 대댓글 전체 조회
  const { data: allComments, error: allError } = await supabase
    .from("comments")
    .select(
      `
      id,
      content,
      parent_id,
      created_at,
      updated_at,
      user_id,
      external_institution_id,
      profiles!user_id (
        id,
        nickname,
        avatar_url
      )
    `,
    )
    .eq("external_institution_id", placeId)
    .or(
      `id.in.(${topLevelIds.join(",")}),parent_id.in.(${topLevelIds.join(",")})`,
    )
    .order("created_at", { ascending: false });

  if (allError) {
    return NextResponse.json(
      {
        success: false,
        code: "FAILED_COMMENTS_FETCH",
        message: "전체 댓글 조회 실패",
      },
      { status: 500 },
    );
  }

  const tree = buildCommentTree(allComments);

  return NextResponse.json(
    { success: true, comments: tree, totalCount },
    { status: 200 },
  );
}

export async function DELETE(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const commentId = searchParams.get("commentId");

  if (!commentId) {
    return NextResponse.json(
      { success: false, code: "MISSING_ID", message: "댓글 ID가 필요합니다." },
      { status: 400 },
    );
  }

  // 유저 인증 확인
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { success: false, code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  // 본인이 쓴 댓글만 삭제
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json(
      {
        success: false,
        code: "FAILED_DELETE_COMMENT",
        message: "댓글 삭제 실패",
      },
      { status: 500 },
    );
  }

  // success: true 보내기 위해서 응답 코드 200으로 처리
  return NextResponse.json({ success: true }, { status: 200 });
}

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const body = await req.json();
  const { commentId, content } = body;

  if (!commentId || !content?.trim()) {
    return NextResponse.json(
      {
        success: false,
        code: "INVALID_INPUT",
        message: "댓글 ID 또는 내용이 누락되었습니다.",
      },
      { status: 400 },
    );
  }

  // 유저 인증 확인
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      {
        success: false,
        code: "UNAUTHORIZED",
        message: "로그인이 필요합니다.",
      },
      { status: 401 },
    );
  }

  // 본인 댓글만 수정 가능
  const { error } = await supabase
    .from("comments")
    .update({
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json(
      {
        success: false,
        code: "FAILED_UPDATE_COMMENT",
        message: "댓글 수정에 실패했습니다.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
