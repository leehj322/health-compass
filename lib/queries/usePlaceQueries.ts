import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { getPlacesByLocation } from "../api/unifiedLocationApi";
import { PlacesByLocationResponse } from "../api/unifiedLocationApi.type";

export const usePlacesByLocation = (
  lat: number,
  lng: number,
  radius: number = 1000,
  page: number = 1,
  category: "hospital" | "pharmacy" = "hospital",
  options?: Omit<
    UseQueryOptions<PlacesByLocationResponse>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<PlacesByLocationResponse>({
    queryKey: QUERY_KEYS.places.byLocation(lat, lng, radius, page, category),
    queryFn: () => getPlacesByLocation(lat, lng, radius, page, category),
    ...options,
  });
};
