import { DEFAULT_GEOLOCATION } from "@/constants/defaultGeolocation";
import { create } from "zustand";

interface FilterGroups {
  distance: number;
  nightTime: number;
  night: boolean;
  saturday: boolean;
  sunday: boolean;
  holiday: boolean;
  query: string;
}

interface MapControlState {
  ref: kakao.maps.Map | null;
  setRef: (ref: kakao.maps.Map) => void;
  center: { lat: number; lng: number };
  setCenter: (mapCenter: { lat: number; lng: number }) => void;
}

interface MainPageState {
  filterGroups: FilterGroups;
  setFilterGroups: <K extends keyof FilterGroups>(
    key: K,
    value: FilterGroups[K] extends boolean
      ? FilterGroups[K] | ((prev: FilterGroups[K]) => FilterGroups[K])
      : FilterGroups[K],
  ) => void;
  map: MapControlState;
  activeTab: "hospital" | "pharmacy";
  setActiveTab: (tab: "hospital" | "pharmacy") => void;
  isSearchMode: boolean;
  setIsSearchMode: (isSearchMode: boolean) => void;
}

export const useMainPageStore = create<MainPageState>((set) => ({
  filterGroups: {
    distance: 1,
    nightTime: 6,
    night: false,
    saturday: false,
    sunday: false,
    holiday: false,
    query: "",
  },
  setFilterGroups: (key, valueOrFn) =>
    set((state) => {
      const currentValue = state.filterGroups[key];
      const newValue =
        typeof valueOrFn === "function" // prev => !prev 같은 함수형 입력 처리
          ? (valueOrFn as (prev: typeof currentValue) => typeof currentValue)(
              currentValue,
            ) // Fn(currentValue);
          : valueOrFn; // value

      return {
        filterGroups: {
          ...state.filterGroups,
          [key]: newValue,
        },
      };
    }),
  map: {
    ref: null,
    setRef: (ref) =>
      set((state) => ({
        map: {
          ...state.map,
          ref,
        },
      })),
    center: {
      lat: DEFAULT_GEOLOCATION.latitude,
      lng: DEFAULT_GEOLOCATION.longitude,
    },
    setCenter: (center) =>
      set((state) => ({
        map: {
          ...state.map,
          center,
        },
      })),
  },
  activeTab: "hospital",
  setActiveTab: (tab) => set({ activeTab: tab }),
  isSearchMode: true,
  setIsSearchMode: (isSearchMode) => set({ isSearchMode }),
}));
