import { create } from 'zustand';

export const useStore = create((set) => ({
    level: 1,
    nextLevel: () => set((state) => ({ level: state.level + 1 })),
    resetLevel: () => set({ level: 1 }),
}));
