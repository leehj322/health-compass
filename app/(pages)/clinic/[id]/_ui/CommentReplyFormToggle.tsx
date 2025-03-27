"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
  return (
    <div className="space-y-2">
      <Textarea
        placeholder="댓글을 입력하세요..."
        className="resize-none overflow-hidden text-sm"
      />
      <Button className="ml-auto flex w-24 cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700">
        답글 등록
      </Button>
    </div>
  );
}
