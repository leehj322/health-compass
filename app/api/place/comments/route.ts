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
