import { PlaceDocumentSummary, Meta } from "./kakaoLocal.type";

// 카카오 로컬 API 데이터 + 공공 데이터
export interface PlaceWithDetails extends PlaceDocumentSummary {
  details: Record<string, string> | null; // 공공 데이터 response가 데이터마다 전부 달라서 Record로 처리
}

export interface PlacesByLocationResponse {
  places: PlaceWithDetails[];
  meta: Meta;
}

export interface PlacesByKeywordResponse {
  places: PlaceWithDetails[];
  meta: Meta;
}
