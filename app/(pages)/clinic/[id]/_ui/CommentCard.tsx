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
import { useState } from "react";
import CommentEditForm from "./CommentEditForm";

export default function CommentCard({
  comment,
}: {
  comment: TopLevelDetailComment;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { data } = useUser();
  const isMyComment = data.user ? data.user.id === comment.user_id : false;

  return (
    <Card className="py-0">
      <CardContent className="relative space-y-2 p-4">
        <div className="flex items-start space-x-2">
          <Image
            width={32}
            height={32}
            src={comment.profiles.avatar_url || "/default-profile.png"}
            alt="프로필"
            className="mt-1 block rounded-full object-cover"
          />
          <div className="w-full">
            <p className="text-sm font-medium">
              {comment.profiles.nickname}
              <span className="ml-1 text-xs text-gray-500">
                · {getTimeAgo(comment.created_at)}
              </span>
            </p>

            {isEditing ? (
              <CommentEditForm
                initialContent={comment.content}
                onEditClose={() => setIsEditing((prev) => !prev)}
              />
            ) : (
              <p className="pr-3 text-sm">{comment.content}</p>
            )}
          </div>
        </div>

        {/* 수정, 삭제 드롭다운 */}
        {isMyComment && !isEditing && (
          <div className="absolute top-3 right-3">
            <CommentActionDropdown
              commentId={comment.id}
              onEditButtonClick={() => setIsEditing((prev) => !prev)}
            />
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
  const [isEditing, setIsEditing] = useState(false);
  const { data } = useUser();
  const isMyComment = data.user ? data.user.id === reply.user_id : false;

  return (
    <div className="border-l border-gray-300 bg-gray-50 py-2 pr-5 pl-2">
      <div className="relative flex items-start space-x-2">
        <Image
          width={28}
          height={28}
          src={reply.profiles.avatar_url || "/default-profile.png"}
          alt="프로필"
          className="mt-2 block rounded-full object-cover"
        />
        <div className="w-full">
          <p className="text-sm font-medium">
            {reply.profiles.nickname}
            <span className="ml-1 text-xs text-gray-500">
              · {getTimeAgo(reply.created_at)}
            </span>
          </p>

          {isEditing ? (
            <CommentEditForm
              initialContent={reply.content}
              onEditClose={() => setIsEditing((prev) => !prev)}
            />
          ) : (
            <p className="text-sm">{reply.content}</p>
          )}
        </div>

        {/* 수정, 삭제 드롭다운 */}
        {isMyComment && !isEditing && (
          <div className="absolute top-0 -right-2">
            <CommentActionDropdown
              commentId={reply.id}
              onEditButtonClick={() => setIsEditing((prev) => !prev)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
