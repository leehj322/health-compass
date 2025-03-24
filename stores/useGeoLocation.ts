import { create } from "zustand";

interface GeoLocationState {
  geoLocation: { lat: number; lng: number } | null;
  setGeoLocation: (geoLocation: { lat: number; lng: number }) => void;
}

export const useGeoLocationStore = create<GeoLocationState>((set) => ({
  geoLocation: null,
  setGeoLocation: (location) => set(() => ({ geoLocation: location })),
}));
