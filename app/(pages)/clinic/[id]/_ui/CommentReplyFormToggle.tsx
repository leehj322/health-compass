import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateComment } from "@/lib/queries/useCommentsQueries";
import { ErrorToast } from "@/lib/toasts";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function CommentReplyFormToggle() {
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
      {isOpen && <CommentReplyForm />}
    </div>
  );
}

function CommentReplyForm() {
  const [content, setContent] = useState("");
  const pathname = usePathname();

  const { mutate: createComment, isPending } = useCreateComment();

  const clinicId = pathname.split("/")?.[2];

  // 임시 아이디
  const parent_id = "8ba1f8c8-3033-4e9b-9d6f-b6ea07c0196d";

  const handleCreateButtonClick = () => {
    if (!content.trim()) return;

    createComment(
      { content, external_institution_id: clinicId, parent_id },
      {
        onSuccess: () => setContent(""),
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
        답글 등록
      </Button>
    </div>
  );
}
