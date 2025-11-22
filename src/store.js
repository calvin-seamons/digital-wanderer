import { create } from 'zustand';

export const useStore = create((set) => ({
    level: 1,
    isTransitioning: false,
    spawnPosition: [0, 1.6, 0], // Default spawn
    
    enterPortal: (targetLevel, targetSpawnPos) => {
        set({ isTransitioning: true });
        setTimeout(() => {
            set({ 
                level: targetLevel,
                spawnPosition: targetSpawnPos 
            });
            setTimeout(() => {
                set({ isTransitioning: false });
            }, 1000);
        }, 1000);
    }
}));
