import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import CommentReplyFormToggle from "./CommentReplyFormToggle";
import {
  ReplyDetailComment,
  TopLevelDetailComment,
} from "@/lib/api/comments/comments.type";
import { getTimeAgo } from "@/utils/formatDate";

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
                · {getTimeAgo(comment.created_at)}
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
              · {getTimeAgo(reply.created_at)}
            </span>
          </p>
          <p className="text-sm">{reply.content}</p>
        </div>
      </div>
    </div>
  );
}
