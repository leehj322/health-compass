import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import {
  DetailCommentInput,
  DetailCommentResponse,
} from "../api/comments/comments.type";
import { createClient } from "../supabase/client";
import { QUERY_KEYS } from "./queryKeys";

// 상세 페이지 댓글 불러오기 (infinite query)
export const useDetailComments = (id: string) => {
  return useInfiniteQuery<DetailCommentResponse>({
    queryKey: QUERY_KEYS.comments.byPlaceId(id),
    queryFn: async ({ pageParam }) => {
      const res = await fetch(
        `/api/place/comments?external_institution_id=${id}&page=${pageParam}`,
      );
      const data: DetailCommentResponse = await res.json();

      if (!res.ok) throw new Error("댓글 로딩 실패");
      if (!data.success) throw new Error(data.message);

      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.success || !lastPage.totalCount) return undefined;

      const totalLoaded = allPages
        .filter((page) => page.success) // 필요없지만 타입 추론을 위해 추가
        .reduce((sum, page) => sum + page.comments.length, 0);

      return totalLoaded < lastPage.totalCount
        ? allPages.length + 1
        : undefined;
    },
  });
};

// 상세 페이지 댓글 및 답글 작성
export const useCreateDetailComment = () => {
  return useMutation({
    mutationFn: async (newComment: DetailCommentInput) => {
      const supabase = createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("로그인이 필요합니다.", { authError, user });
        throw new Error("로그인이 필요합니다.");
      }

      if (!newComment.content || !newComment.external_institution_id) {
        console.error("내용이나 대상이 누락되었습니다.");
        throw new Error("내용이나 대상이 누락되었습니다.");
      }

      const { error: insertError } = await supabase.from("comments").insert([
        {
          content: newComment.content,
          external_institution_id: newComment.external_institution_id,
          parent_id: newComment.parent_id ?? null,
          user_id: user.id,
        },
      ]);

      if (insertError) {
        console.error("댓글 저장 실패:", insertError);
        throw new Error("댓글 저장 중 오류가 발생했습니다.");
      }

      // createServerClient를 사용하였으나 auth.uid()값이 server에서 null로 판정
      // createBrowserClient를 사용하면 토큰을 이용해서 정상적으로 auth.uid()값이 null이 아니게 됨
      // 쿠키가 제대로 전달되지 않는 것으로 보이지만 log를 찍어보았을 때는 문제가 없음

      // const res = await fetch("/api/comments", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(newComment),
      //   credentials: "include",
      // });

      // const result = await res.json();
      // if (!res.ok || !result.comment) {
      //   throw new Error(result.message || "댓글 작성 실패");
      // }
      // return result;
    },
    onError: (error) => {
      console.error("에러 발생", error);
      throw new Error("에상치 못한 오류가 발생하였습니다.");
    },
  });
};
