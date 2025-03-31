export interface DetailCommentInput {
  content: string;
  external_institution_id: string;
  parent_id?: string | null;
}

export interface DetailComment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  parent_id: string | null;
  external_institution_id: string;
}

export interface CommentPostResponse {
  comment: Comment;
  success: boolean;
  code?: string;
  message?: string;
}
