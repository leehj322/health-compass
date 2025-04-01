import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import CommentReplyFormToggle from "./CommentReplyFormToggle";
import {
  ReplyDetailComment,
  TopLevelDetailComment,
} from "@/lib/api/comments/comments.type";
import { getTimeAgo } from "@/utils/formatDate";
import { useUser } from "@/lib/queries/useUserQueries";
import CommentActionDropdown from "./CommentActionDropdown";

export default function CommentCard({
  comment,
}: {
  comment: TopLevelDetailComment;
}) {
  const { data } = useUser();
  const isMyComment = data.user ? data.user.id === comment.user_id : false;

  return (
    <Card className="py-0">
      <CardContent className="relative space-y-2 p-4">
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

        {/* 수정, 삭제 드롭다운 */}
        {isMyComment && (
          <div className="absolute top-3 right-3">
            <CommentActionDropdown commentId={comment.id} />
          </div>
        )}

        {/* 답글 목록 */}
        <div className="mt-2 space-y-2 pl-4">
          {comment.children.map((reply) => (
            <ReplyComment key={reply.id} reply={reply} />
          ))}
          <CommentReplyFormToggle commentId={comment.id} />
        </div>
      </CardContent>
    </Card>
  );
}

function ReplyComment({ reply }: { reply: ReplyDetailComment }) {
  const { data } = useUser();
  const isMyComment = data.user ? data.user.id === reply.user_id : false;

  return (
    <div className="border-l border-gray-300 bg-gray-50 py-2 pl-2">
      <div className="relative flex items-center space-x-2">
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

        {/* 수정, 삭제 드롭다운 */}
        {isMyComment && (
          <div className="absolute top-2 right-2">
            <CommentActionDropdown commentId={reply.id} />
          </div>
        )}
      </div>
    </div>
  );
}
