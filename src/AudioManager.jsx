import { useEffect, useRef } from 'react';
import { useStore } from './store';

// Placeholder URLs - in a real app these would be local files or reliable CDNs
const AUDIO_URLS = {
    1: 'https://assets.mixkit.co/active_storage/sfx/2433/2433-preview.mp3', // Nature/Wind
    2: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3', // Industrial/Hum
    3: 'https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3', // Ethereal/Drone
};

export default function AudioManager() {
    const level = useStore((state) => state.level);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        const audio = audioRef.current;
        audio.loop = true;
        audio.volume = 0.5;

        const playAudio = async () => {
            try {
                audio.src = AUDIO_URLS[level] || AUDIO_URLS[1];
                await audio.play();
            } catch (e) {
                console.warn("Audio autoplay failed (user interaction needed):", e);
            }
        };

        playAudio();

        return () => {
            audio.pause();
        };
    }, [level]);

    return null;
}
