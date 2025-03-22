import { create } from "zustand";

interface FilterGroups {
  distance: number;
  nightTime: number;
  night: boolean;
  saturday: boolean;
  sunday: boolean;
  holiday: boolean;
}

interface MainPageState {
  filterGroups: FilterGroups;
  setFilterGroups: <K extends keyof FilterGroups>(
    key: K,
    value: FilterGroups[K] extends boolean
      ? FilterGroups[K] | ((prev: FilterGroups[K]) => FilterGroups[K])
      : FilterGroups[K],
  ) => void;
  activeTab: "hospital" | "pharmacy";
  setActiveTab: (tab: "hospital" | "pharmacy") => void;
}

export const useMainPageStore = create<MainPageState>((set) => ({
  filterGroups: {
    distance: 1,
    nightTime: 6,
    night: false,
    saturday: false,
    sunday: false,
    holiday: false,
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
  activeTab: "hospital",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
