import { create } from 'zustand';

export const useStore = create((set) => ({
    level: 1,
    isTransitioning: false,
    nextLevel: () => set((state) => ({ level: state.level + 1 })),
    resetLevel: () => set({ level: 1 }),
    triggerTransition: (cb) => {
        set({ isTransitioning: true });
        setTimeout(() => {
            set((state) => ({ level: state.level + 1 }));
            if (cb) cb(); // Callback to reset player position
            setTimeout(() => {
                set({ isTransitioning: false });
            }, 1000);
        }, 1000);
    }
}));
