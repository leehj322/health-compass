import Spinner from "@/app/_ui/shared/Spinner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { QUERY_KEYS } from "@/lib/queries/queryKeys";
import { useCreateDetailComment } from "@/lib/queries/useCommentsQueries";
import { ErrorToast } from "@/lib/toasts";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface CommentReplyFormToggleProps {
  commentId: string;
}

export default function CommentReplyFormToggle({
  commentId,
}: CommentReplyFormToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Button
        variant="ghost"
        className="h-auto cursor-pointer p-0 text-sm text-emerald-600 hover:underline"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? "답글 닫기" : "답글 달기"}
      </Button>
      {isOpen && <CommentReplyForm commentId={commentId} />}
    </div>
  );
}

interface CommentReplyFormProps {
  commentId: string;
}

function CommentReplyForm({ commentId }: CommentReplyFormProps) {
  const [content, setContent] = useState("");
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { mutate: createComment, isPending } = useCreateDetailComment();

  const placeId = pathname.split("/")?.[2];

  const handleCreateButtonClick = () => {
    if (!content.trim()) return;

    createComment(
      { content, external_institution_id: placeId, parent_id: commentId },
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
    <div className="space-y-2">
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
        {isPending ? <Spinner /> : "답글 등록"}
      </Button>
    </div>
  );
}
