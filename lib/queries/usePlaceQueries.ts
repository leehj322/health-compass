import {
  useQuery,
  UseQueryOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";
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
) => {
  return useInfiniteQuery<PlacesByLocationResponse>({
    queryKey: QUERY_KEYS.places.byLocation(lat!, lng!, radius, category),
    queryFn: ({ pageParam }) =>
      getPlacesByLocation(lat!, lng!, radius, pageParam as number, category),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.meta.is_end ? undefined : allPages.length + 1;
    },
    enabled: !!(lat && lng),
  });
};

export const usePlacesByKeyword = (
  lat: number,
  lng: number,
  radius: number = 1000,
  page: number = 1,
  keyword: string = "",
  options?: Omit<
    UseQueryOptions<PlacesByKeywordResponse>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<PlacesByKeywordResponse>({
    queryKey: QUERY_KEYS.places.byKeyword(lat, lng, radius, page, keyword),
    queryFn: () => getPlacesByKeyword(lat, lng, radius, page, keyword),
    ...options,
  });
};
