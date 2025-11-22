import { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { Vector3 } from 'three';
import { useStore } from './store';

const SPEED = 5;

export default function Player() {
    const { camera } = useThree();
    const [moveForward, setMoveForward] = useState(false);
    const [moveBackward, setMoveBackward] = useState(false);
    const [moveLeft, setMoveLeft] = useState(false);
    const [moveRight, setMoveRight] = useState(false);

    useEffect(() => {
        const onKeyDown = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    setMoveForward(true);
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    setMoveLeft(true);
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    setMoveBackward(true);
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    setMoveRight(true);
                    break;
            }
        };

        const onKeyUp = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    setMoveForward(false);
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    setMoveLeft(false);
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    setMoveBackward(false);
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    setMoveRight(false);
                    break;
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    useFrame((state, delta) => {
        const velocity = new Vector3();
        const direction = new Vector3();

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        if (moveForward || moveBackward) velocity.z -= direction.z * SPEED * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * SPEED * delta;

        camera.translateX(velocity.x);
        camera.translateZ(velocity.z);

        // Physics: Lock Y position (Eye height)
        camera.position.y = 1.6;

        // Trigger Logic: Check if player reached the edge
        if (Math.abs(camera.position.z) > 50) {
            const { triggerTransition, level, isTransitioning } = useStore.getState();
            if (level < 3 && !isTransitioning) {
                triggerTransition(() => {
                    camera.position.set(0, 1.6, 0); // Reset position callback
                });
            }
        }
    });

    return <PointerLockControls />;
}
