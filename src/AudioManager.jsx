import { useEffect, useRef, useState } from 'react';
import { useStore } from './store';

// Local audio files for each level
const AUDIO_URLS = {
    // The Pastoral: birds in the jungle
    1: '/mixkit-birds-in-the-jungle-2434.wav',
    // The Machine: low electricity humming  
    2: '/mixkit-low-electricity-humming-2132.wav',
    // Synthesis: dark space motion
    3: '/mixkit-dark-space-motion-3026.wav',
};

// Volume levels per level
const VOLUME_LEVELS = {
    1: 0.5,
    2: 0.4,
    3: 0.5,
};

export default function AudioManager() {
    const level = useStore((state) => state.level);
    const audioRef = useRef(null);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [showPrompt, setShowPrompt] = useState(true);

    // Initialize audio on first user interaction
    useEffect(() => {
        const enableAudio = () => {
            if (!audioRef.current) {
                audioRef.current = new Audio();
                audioRef.current.loop = true;
            }
            setAudioEnabled(true);
            setShowPrompt(false);
            
            // Remove listeners after first interaction
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('keydown', enableAudio);
        };

        document.addEventListener('click', enableAudio);
        document.addEventListener('keydown', enableAudio);

        return () => {
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('keydown', enableAudio);
        };
    }, []);

    // Play/change audio when level changes or audio becomes enabled
    useEffect(() => {
        if (!audioEnabled || !audioRef.current) return;

        const audio = audioRef.current;
        
        const playAudio = async () => {
            try {
                const newSrc = AUDIO_URLS[level] || AUDIO_URLS[1];
                
                // Only change if different source
                if (audio.src !== newSrc) {
                    audio.src = newSrc;
                }
                
                audio.volume = VOLUME_LEVELS[level] || 0.5;
                await audio.play();
                console.log(`🔊 Playing Level ${level} audio`);
            } catch (e) {
                console.warn("Audio play failed:", e);
            }
        };

        playAudio();

        return () => {
            // Don't pause on cleanup - let it continue during transitions
        };
    }, [level, audioEnabled]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        };
    }, []);

    // Show audio prompt
    if (showPrompt) {
        return (
            <div style={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '10px 15px',
                borderRadius: 8,
                fontSize: 14,
                zIndex: 1000,
                pointerEvents: 'none'
            }}>
                🔊 Click anywhere for audio
            </div>
        );
    }

    return null;
}
