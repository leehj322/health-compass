import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Spinner from "@/app/_ui/shared/Spinner";

interface CommentEditFormProps {
  initialContent: string;
  onEditClose: () => void;
}

export default function CommentEditForm({
  initialContent,
  onEditClose,
}: CommentEditFormProps) {
  const [editedContent, setEditedContent] = useState(initialContent);

  const handleEditCanceled = () => {
    setEditedContent(initialContent);
    onEditClose();
  };

  const handleUpdateContent = () => {
    console.log("update!");
    onEditClose();
  };

  const isPending = false;

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
          onClick={handleUpdateContent}
          disabled={isPending || !editedContent.trim()}
          className="w-20 bg-emerald-600 text-white hover:cursor-pointer hover:bg-emerald-700"
        >
          {isPending ? <Spinner /> : "저장"}
        </Button>
      </div>
    </div>
  );
}
