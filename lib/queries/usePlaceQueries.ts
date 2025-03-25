import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import {
  getPlacesByLocation,
  getPlacesByKeyword,
} from "../api/unifiedLocationApi";
import {
  PlacesByLocationResponse,
  PlacesByKeywordResponse,
} from "../api/unifiedLocationApi.type";

export const usePlacesByLocation = (
  lat: number | undefined,
  lng: number | undefined,
  radius: number = 1000,
  category: "hospital" | "pharmacy" = "hospital",
  enabled: boolean,
) => {
  return useInfiniteQuery<PlacesByLocationResponse>({
    queryKey: QUERY_KEYS.places.byLocation(lat!, lng!, radius, category),
    queryFn: ({ pageParam }) =>
      getPlacesByLocation(lat!, lng!, radius, pageParam as number, category),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.meta.is_end ? undefined : allPages.length + 1;
    },
    enabled,
    staleTime: 6 * 1000 * 10,
  });
};

export const usePlacesByKeyword = (
  lat: number | undefined,
  lng: number | undefined,
  radius: number = 1000,
  keyword: string = "",
  enabled: boolean,
) => {
  return useInfiniteQuery<PlacesByKeywordResponse>({
    queryKey: QUERY_KEYS.places.byKeyword(lat!, lng!, radius, keyword),
    queryFn: ({ pageParam }) =>
      getPlacesByKeyword(lat!, lng!, radius, pageParam as number, keyword),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.meta.is_end ? undefined : allPages.length + 1;
    },
    enabled,
    staleTime: 6 * 1000 * 10,
  });
};
