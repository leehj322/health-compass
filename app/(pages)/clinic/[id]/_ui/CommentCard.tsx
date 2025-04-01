import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import CommentReplyFormToggle from "./CommentReplyFormToggle";
import {
  ReplyDetailComment,
  TopLevelDetailComment,
} from "@/lib/api/comments/comments.type";

// 아직 comment에 대한 정확한 API 설계가 진행되지 않았으므로 (ex. date 추가 등) 아래에서 임시로 any 사용
/* eslint-disable @typescript-eslint/no-explicit-any */
export default function CommentCard({
  comment,
}: {
  comment: TopLevelDetailComment;
}) {
  return (
    <Card className="py-0">
      <CardContent className="space-y-2 p-4">
        <div className="flex items-center space-x-2">
          <Image
            width={32}
            height={32}
            src={comment.profiles.avatar_url || "/default-profile.png"}
            alt="프로필"
            className="block rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium">
              {comment.profiles.nickname}
              <span className="ml-1 text-xs text-gray-500">
                · 2시간 전 {comment.created_at}
              </span>
            </p>
            <p className="text-sm">{comment.content}</p>
          </div>
        </div>
        <div className="mt-2 space-y-2 pl-4">
          {comment.children.map((reply) => (
            <ReplyComment key={reply.id} reply={reply} />
          ))}
          <CommentReplyFormToggle />
        </div>
      </CardContent>
    </Card>
  );
}

function ReplyComment({ reply }: { reply: ReplyDetailComment }) {
  return (
    <div className="border-l border-gray-300 bg-gray-50 py-2 pl-2">
      <div className="flex items-center space-x-2">
        <Image
          width={28}
          height={28}
          src={reply.profiles.avatar_url || "/default-profile.png"}
          alt="프로필"
          className="block rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-medium">
            {reply.profiles.nickname}
            <span className="ml-1 text-xs text-gray-500">
              · 5분 전 {reply.created_at}
            </span>
          </p>
          <p className="text-sm">{reply.content}</p>
        </div>
      </div>
    </div>
  );
}
