import {
  TopLevelDetailComment,
  ReplyDetailComment,
} from "@/lib/api/comments/comments.type";

/**
 * 평평한(flat)한 형태의 장소 상세 페이지 댓글 리스트를 트리 구조로 변환합니다.
 *
 * 상위 댓글(TopLevelDetailComment)은 `children` 배열을 가지며,
 * 대댓글(ReplyDetailComment)은 해당 상위 댓글의 `children` 배열에 포함됩니다.
 *
 * - 상위 댓글: `parent_id === null`
 * - 대댓글: `parent_id !== null`
 *
 * @param flat - 평탄화된 댓글 배열 (상위 댓글 + 대댓글 포함)
 * @returns 트리 구조로 정렬된 상위 댓글 배열 (TopLevelDetailComment[])
 *
 * @example
 * const flatComments = [...]; // Supabase에서 가져온 댓글 데이터
 * const tree = buildCommentTree(flatComments);
 * console.log(tree[0].children); // 해당 댓글의 대댓글 리스트
 */
export function buildCommentTree(flat: any) {
  // 외부에서 comment.profiles가 배열로 잡히는 문제가 있어서 단언으로 해결
  // user_id 값이 foreign key임에도 인식하지 못함
  const comments = flat as (TopLevelDetailComment | ReplyDetailComment)[];

  const commentMap = new Map<
    string,
    TopLevelDetailComment | ReplyDetailComment
  >();
  const rootComments: TopLevelDetailComment[] = [];

  const isTopLevel = (
    comment: TopLevelDetailComment | ReplyDetailComment,
  ): comment is TopLevelDetailComment => comment.parent_id === null;

  comments.forEach((comment) => {
    if (isTopLevel(comment)) {
      comment.children = [];
    }
    commentMap.set(comment.id, comment);
  });

  comments.forEach((comment) => {
    if (!isTopLevel(comment)) {
      const parent = commentMap.get(comment.parent_id);
      if (parent && isTopLevel(parent)) {
        parent.children.push(comment);
      }
    } else {
      rootComments.push(comment);
    }
  });

  return rootComments;
}
