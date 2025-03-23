export const QUERY_KEYS = {
  places: {
    byLocation: (
      lat: number,
      lng: number,
      radius: number,
      page: number,
      category: string,
    ) => ["place", category, { lat, lng, radius, page }],
  },
};
