export const QUERY_KEYS = {
  places: {
    byLocation: (
      lat: number,
      lng: number,
      radius: number,
      category: string,
    ) => ["place", category, { lat, lng, radius }],
    byKeyword: (
      lat: number,
      lng: number,
      radius: number,
      page: number,
      keyword: string,
    ) => ["keyword", keyword, { lat, lng, radius, page }],
  },
  location: {
    byAddress: (address: string) => ["location", "byAddress", address],
  },
};
