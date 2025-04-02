export interface PlaceLikesSuccessResponse {
  success: true;
  likeCount: number | null;
  hasLiked: boolean;
}

export interface PlaceLikesErrorResponse {
  success: false;
  code: string;
  message: string;
}

export type PlaceLikesResponse =
  | PlaceLikesSuccessResponse
  | PlaceLikesErrorResponse;
