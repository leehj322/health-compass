import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import {
  PlaceLikesEditResponse,
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

      if (!data.success) throw new Error(data.message);

      return data;
    },
  });
};

export const usePlaceLikeMutation = () => {
  return useMutation({
    mutationFn: async (placeId: string) => {
      const res = await fetch(`/api/place/likes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ place_id: placeId }),
      });

      const data: PlaceLikesEditResponse = await res.json();

      if (!data.success) throw new Error(data.message);

      return data;
    },
    onError: (error) => {
      console.error("좋아요 등록 에러 발생", error);
      throw new Error("좋아요 등록 에러 발생");
    },
  });
};

export const usePlaceUnlikeMutation = () => {
  return useMutation({
    mutationFn: async (placeId: string) => {
      const res = await fetch(`/api/place/likes?place_id=${placeId}`, {
        method: "DELETE",
      });

      const data: PlaceLikesEditResponse = await res.json();

      if (!data.success) throw new Error(data.message);

      return data;
    },
    onError: (error) => {
      console.error("좋아요 등록 에러 발생", error);
      throw new Error("좋아요 등록 에러 발생");
    },
  });
};
