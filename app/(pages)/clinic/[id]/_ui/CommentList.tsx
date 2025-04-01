"use client";

import { TopLevelDetailComment } from "@/lib/api/comments/comments.type";
import CommentCard from "./CommentCard";

interface CommentListProps {
  placeId: string;
}

export default function CommentList({ placeId }: CommentListProps) {
  const comments: TopLevelDetailComment[] = [];
  const errorMessage: null | string = null;
  console.log(placeId);

  return (
    <>
      {comments.length === 0 ? (
        <div className="w-full py-10 text-center text-sm text-gray-500">
          {errorMessage ?? "아직 댓글이 없습니다. 첫 댓글을 남겨보세요!"}
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </>
  );
}
