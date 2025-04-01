"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateDetailComment } from "@/lib/queries/useCommentsQueries";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ErrorToast } from "@/lib/toasts";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queries/queryKeys";
import Spinner from "@/app/_ui/shared/Spinner";

export default function CommentForm() {
  const [content, setContent] = useState("");
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { mutate: createComment, isPending } = useCreateDetailComment();

  const placeId = pathname.split("/")?.[2];

  const handleCreateButtonClick = () => {
    if (!content.trim()) return;

    createComment(
      { content, external_institution_id: placeId },
      {
        onSuccess: () => {
          setContent("");
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.comments.byPlaceId(placeId),
          });
        },
        onError: (error) => ErrorToast(error.message),
      },
    );
  };

  return (
    <Card className="border-emerald-600 py-0">
      <CardContent className="space-y-2 p-4">
        <p className="font-semibold text-emerald-600">댓글 작성</p>
        <Textarea
          placeholder="댓글을 입력하세요..."
          className="resize-none overflow-hidden text-sm"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPending}
        />
        <Button
          onClick={handleCreateButtonClick}
          disabled={isPending || !content.trim()}
          className="ml-auto flex w-24 cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700"
        >
          {isPending ? <Spinner /> : "등록"}
        </Button>
      </CardContent>
    </Card>
  );
}
