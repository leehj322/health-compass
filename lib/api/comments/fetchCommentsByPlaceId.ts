import { createClient } from "@/lib/supabase/server";
import { buildCommentTree } from "@/utils/buildCommentTree";
import { DetailCommentResponse, TopLevelDetailComment } from "./comments.type";

const PAGE_SIZE = 5;

export async function fetchCommentsByPlaceId(
  placeId: string,
  page = 1,
): Promise<DetailCommentResponse> {
  const supabase = await createClient();

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // 1. 상위 댓글만 페이징
  const { data: topLevelComments, error: topLevelError } = await supabase
    .from("comments")
    .select("id")
    .eq("external_institution_id", placeId)
    .is("parent_id", null)
    .order("created_at", { ascending: false }) // 최신순
    .range(from, to);

  if (topLevelError || !topLevelComments) {
    console.error("상위 댓글 조회 실패:", topLevelError);
    return {
      success: false,
      code: "FAILED_COMMENTS_FETCH",
      message: "상위 댓글 조회 실패",
    };
  }

  const topLevelIds = topLevelComments.map((c) => c.id);

  if (topLevelIds.length === 0) {
    return {
      success: true,
      comments: [],
      page,
    };
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

  if (allError || !allComments) {
    console.error("전체 댓글 조회 실패:", allError);
    return {
      success: false,
      code: "FAILED_COMMENTS_FETCH",
      message: "전체 댓글 조회 실패",
    };
  }

  const tree = buildCommentTree(allComments);
  return {
    success: true,
    comments: tree,
    page,
  };
}
