import { create } from "zustand";

interface AdminLoaderStore {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

export const useAdminLoader = create<AdminLoaderStore>((set) => ({
  isLoading: false,
  startLoading: () => set({ isLoading: true }),
  stopLoading: () => set({ isLoading: false }),
}));
