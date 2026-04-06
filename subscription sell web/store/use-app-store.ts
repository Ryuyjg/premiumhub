import { create } from "zustand";

type AppStore = {
  search: string;
  category: string;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  search: "",
  category: "all",
  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category })
}));
