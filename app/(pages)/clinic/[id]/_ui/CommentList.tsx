import CommentCard from "./CommentCard";

export default function CommentList() {
  const comments = [
    {
      id: 1,
      user: "사용자A",
      content: "이 장소 정말 좋아요!",
      profileImageUrl: null,
      replies: [
        {
          id: 11,
          profileImageUrl: null,
          user: "운영자",
          content: "감사합니다!",
        },
      ],
    },
    {
      id: 2,
      user: "사용자B",
      content: "영업시간 정보 유용했어요.",
      profileImageUrl: null,
      replies: [],
    },
  ];

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
