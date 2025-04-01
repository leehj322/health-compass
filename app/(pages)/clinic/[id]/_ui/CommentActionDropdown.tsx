import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useDeleteDetailComment } from "@/lib/queries/useCommentsQueries";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queries/queryKeys";
import { ErrorToast } from "@/lib/toasts";

interface CommentActionDropdownProps {
  commentId: string;
  onEditButtonClick: () => void;
}

export default function CommentActionDropdown({
  commentId,
  onEditButtonClick,
}: CommentActionDropdownProps) {
  const queryClient = useQueryClient();
  const { mutate } = useDeleteDetailComment();

  const handleCommentDelete = () => {
    mutate(commentId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.comments.byPlaceId(commentId),
        });
      },
      onError: (error) => ErrorToast("댓글 삭제 실패", error.message),
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:cursor-pointer"
        >
          <MoreVertical className="text-gray-500" size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-20" side="bottom" align="end">
        <DropdownMenuItem
          className="flex items-center justify-center hover:cursor-pointer"
          onClick={onEditButtonClick}
        >
          수정
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center justify-center hover:cursor-pointer"
          onClick={handleCommentDelete}
        >
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
