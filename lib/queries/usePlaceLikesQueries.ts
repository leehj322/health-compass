import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import {
  PlaceLikesResponse,
  PlaceLikesSuccessResponse,
} from "../api/places/placeLikes.type";

export const usePlaceLikes = (placeId: string, accountId: string) => {
  return useQuery<PlaceLikesSuccessResponse>({
    queryKey: QUERY_KEYS.likes.byPlaceId(placeId, accountId),
    queryFn: async () => {
      let query = `place_id=${placeId}`;

      if (accountId) {
        query += `&account_id=${accountId}`;
      }

      const res = await fetch(`/api/place/likes?${query}`);
      const data: PlaceLikesResponse = await res.json();

      if (!res.ok) throw new Error("좋아요 조회 실패");
      if (!data.success) throw new Error(data.message);

      return data;
    },
  });
};
