"use client";

import { TopLevelDetailComment } from "@/lib/api/comments/comments.type";
import CommentCard from "./CommentCard";
import { useDetailComments } from "@/lib/queries/useCommentsQueries";
import Spinner from "@/app/_ui/shared/Spinner";
import { Button } from "@/components/ui/button";

interface CommentListProps {
  placeId: string;
}

export default function CommentList({ placeId }: CommentListProps) {
  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useDetailComments(placeId);

  if (isError || !data) {
    return (
      <div className="w-full py-10 text-center text-sm text-gray-500">
        댓글을 불러오는 데 실패했습니다.
      </div>
    );
  }

  const comments: TopLevelDetailComment[] = data?.pages?.flatMap((page) =>
    page.success ? page.comments : [],
  );

  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <div className="w-full py-10 text-center text-sm text-gray-500">
          아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
        </div>
      ) : (
        <>
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}

          {isLoading && (
            <div className="flex items-center justify-center">
              <Spinner />
            </div>
          )}

          {hasNextPage && (
            <div className="pt-2 text-center">
              <Button
                variant="ghost"
                className="h-auto cursor-pointer p-0 text-sm text-emerald-600 hover:underline"
                onClick={() => fetchNextPage()}
              >
                더 보기
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
