import { create } from 'zustand';

export const useStore = create((set) => ({
    level: 1,
    isTransitioning: false,
    spawnPosition: [5.82, -9.71, 25.76], // The Pastoral spawn point
    
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
