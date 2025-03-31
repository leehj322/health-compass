import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";

export const useUser = () => {
  return useQuery({
    queryKey: QUERY_KEYS.user.all,
    queryFn: async () => {
      const res = await fetch("/api/user");
      const data = await res.json();
      return data;
    },
    staleTime: 1000 * 60,
  });
};
