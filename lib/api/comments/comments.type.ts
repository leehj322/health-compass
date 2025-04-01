import { UserProfile } from "../user/user.type";

// DetailComment: 상세 페이지 댓글

// Mutation에 사용 (useCreateComment)
export interface DetailCommentInput {
  content: string;
  external_institution_id: string;
  parent_id?: string | null;
}

// DB에 저장되는 Comment 타입
export interface DetailComment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  parent_id: string | null;
  external_institution_id: string;
}

export interface DetailCommentWithProfile extends DetailComment {
  profiles: UserProfile;
}

// 상위 댓글
export interface TopLevelDetailComment extends DetailCommentWithProfile {
  parent_id: null;
  children: ReplyDetailComment[];
}

// 답글
export interface ReplyDetailComment extends DetailCommentWithProfile {
  parent_id: string;
  children?: never; // 없음
}

export interface CommentListResponse {
  success: boolean;
  comments: TopLevelDetailComment[];
  page: number;
}
