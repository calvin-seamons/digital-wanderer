import { EffectComposer, Bloom, Vignette, Noise, Glitch, Pixelation, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useStore } from './store';

export default function Effects() {
    const level = useStore((state) => state.level);

    return (
        <EffectComposer disableNormalPass>
            {/* Level 1: Romanticism - Soft & Hazy */}
            {level === 1 && (
                <>
                    <Bloom
                        luminanceThreshold={0.2}
                        mipmapBlur
                        intensity={1.5}
                        radius={0.8}
                    />
                    <Vignette
                        eskil={false}
                        offset={0.1}
                        darkness={1.1}
                    />
                </>
            )}

            {/* Level 2: Industrial - Effects disabled for development */}
            {/* {level === 2 && (
                <>
                    <Noise
                        premultiply
                        blendFunction={BlendFunction.OVERLAY}
                        opacity={0.8}
                    />
                    <ChromaticAberration
                        offset={[0.005, 0.005]}
                        radialModulation={false}
                        modulationOffset={0}
                    />
                    <Glitch
                        delay={[1.5, 3.5]}
                        duration={[0.6, 1.0]}
                        strength={[0.3, 1.0]}
                        mode={1} // CONSTANT_MILD
                        active
                        ratio={0.85}
                    />
                </>
            )} */}

        </EffectComposer>
    );
}
