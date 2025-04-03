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

export interface PlaceLikesEditSuccessResponse {
  success: true;
}

export type PlaceLikesEditResponse =
  | PlaceLikesEditSuccessResponse
  | PlaceLikesErrorResponse;

export type PlaceLikesResponse =
  | PlaceLikesSuccessResponse
  | PlaceLikesErrorResponse;
