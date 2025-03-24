import { useInfiniteQuery } from "@tanstack/react-query";
import { getLocationByAddress } from "../api/kakaoLocal";
import { LocationByAddressResponse } from "../api/kakaoLocal.type";
import { QUERY_KEYS } from "./queryKeys";

export const useLocationByAddress = (address: string) => {
  return useInfiniteQuery<LocationByAddressResponse>({
    queryKey: QUERY_KEYS.location.byAddress(address),
    queryFn: ({ pageParam }) =>
      getLocationByAddress(address, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.meta.is_end ? undefined : allPages.length + 1;
    },
    enabled: !!address,
  });
};
