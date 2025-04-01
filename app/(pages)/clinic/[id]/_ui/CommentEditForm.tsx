import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Spinner from "@/app/_ui/shared/Spinner";
import { useUpdateDetailComment } from "@/lib/queries/useCommentsQueries";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queries/queryKeys";
import { ErrorToast } from "@/lib/toasts";
import { usePathname } from "next/navigation";

interface CommentEditFormProps {
  initialContent: string;
  commentId: string;
  onEditClose: () => void;
}

export default function CommentEditForm({
  initialContent,
  commentId,
  onEditClose,
}: CommentEditFormProps) {
  const [editedContent, setEditedContent] = useState(initialContent);
  const queryClient = useQueryClient();
  const { mutate: updateComment, isPending } = useUpdateDetailComment();
  const pathname = usePathname();
  const placeId = pathname.split("/")?.[2];

  const handleEditCanceled = () => {
    setEditedContent(initialContent);
    onEditClose();
  };

  const handleUpdateComment = () => {
    updateComment(
      { commentId, content: editedContent },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.comments.byPlaceId(placeId),
          });
          onEditClose();
        },
        onError: (error) => ErrorToast("댓글 수정 실패", error.message),
      },
    );
  };

  return (
    <div className="mt-1 w-full space-y-2">
      <Textarea
        placeholder="댓글을 입력하세요"
        className="resize-none text-sm"
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        disabled={isPending}
      />
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-20 text-sm text-gray-500 hover:cursor-pointer"
          onClick={handleEditCanceled}
          disabled={isPending}
        >
          취소
        </Button>
        <Button
          onClick={handleUpdateComment}
          disabled={isPending || !editedContent.trim()}
          className="w-20 bg-emerald-600 text-white hover:cursor-pointer hover:bg-emerald-700"
        >
          {isPending ? <Spinner /> : "저장"}
        </Button>
      </div>
    </div>
  );
}
