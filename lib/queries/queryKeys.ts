export const QUERY_KEYS = {
  user: {
    all: ["user"],
  },
  places: {
    byLocation: (
      lat: number,
      lng: number,
      radius: number,
      category: string,
    ) => ["place", category, { lat, lng, radius }],
    byKeyword: (lat: number, lng: number, radius: number, keyword: string) => [
      "keyword",
      keyword,
      { lat, lng, radius },
    ],
  },
  location: {
    byAddress: (address: string) => ["location", "byAddress", address],
  },
};
