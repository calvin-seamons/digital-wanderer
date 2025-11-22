import { useStore } from './store';

export default function TransitionOverlay() {
    const isTransitioning = useStore((state) => state.isTransitioning);

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'black',
                opacity: isTransitioning ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
                pointerEvents: 'none',
                zIndex: 100,
            }}
        />
    );
}
