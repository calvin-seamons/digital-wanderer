import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { CapsuleCollider, RigidBody, useRapier } from '@react-three/rapier';
import { PointerLockControls } from '@react-three/drei';
import { Vector3 } from 'three';
import { useStore } from './store';

const SPEED = 5;
const FLY_SPEED = 8;
const JUMP_VELOCITY = 5;

export default function Player() {
    const playerRef = useRef();
    const colliderRef = useRef();
    const [moveForward, setMoveForward] = useState(false);
    const [moveBackward, setMoveBackward] = useState(false);
    const [moveLeft, setMoveLeft] = useState(false);
    const [moveRight, setMoveRight] = useState(false);
    const [moveUp, setMoveUp] = useState(false);
    const [moveDown, setMoveDown] = useState(false);
    const [canJump, setCanJump] = useState(false);
    const [flyMode, setFlyMode] = useState(false);

    const { rapier, world } = useRapier();
    const spawnPosition = useStore((state) => state.spawnPosition);
    const isTransitioning = useStore((state) => state.isTransitioning);

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
                case 'Space':
                    if (flyMode) {
                        setMoveUp(true);
                    } else if (canJump && playerRef.current) {
                        const vel = playerRef.current.linvel();
                        playerRef.current.setLinvel({ x: vel.x, y: JUMP_VELOCITY, z: vel.z }, true);
                    }
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':
                    if (flyMode) {
                        setMoveDown(true);
                    }
                    break;
                case 'KeyF':
                    setFlyMode(prev => {
                        const next = !prev;
                        console.log(`🚀 Fly mode: ${next ? 'ON (noclip)' : 'OFF'}`);
                        // Toggle collider enabled state
                        if (colliderRef.current) {
                            colliderRef.current.setEnabled(!next);
                        }
                        return next;
                    });
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
                case 'Space':
                    setMoveUp(false);
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':
                    setMoveDown(false);
                    break;
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        };
    }, [canJump, flyMode]);

    useEffect(() => {
        if (!isTransitioning && playerRef.current) {
            playerRef.current.setTranslation({ x: spawnPosition[0], y: spawnPosition[1], z: spawnPosition[2] }, true);
            playerRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        }
    }, [spawnPosition, isTransitioning]);

    // Debug teleport listener
    useEffect(() => {
        const handleTeleport = (e) => {
            if (playerRef.current) {
                const { x, y, z } = e.detail;
                playerRef.current.setTranslation({ x, y, z }, true);
                playerRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
            }
        };
        window.addEventListener('debug-teleport', handleTeleport);
        return () => window.removeEventListener('debug-teleport', handleTeleport);
    }, []);

    useFrame(({ camera }) => {
        if (!playerRef.current) return;

        const velocity = playerRef.current.linvel();
        const position = playerRef.current.translation();

        // Check if on ground (simple check)
        const onGround = Math.abs(velocity.y) < 0.5 && position.y < 2;
        setCanJump(onGround);

        // Calculate movement direction based on camera
        const direction = new Vector3();
        const frontVector = new Vector3(0, 0, Number(moveBackward) - Number(moveForward));
        const sideVector = new Vector3(Number(moveLeft) - Number(moveRight), 0, 0);

        const currentSpeed = flyMode ? FLY_SPEED : SPEED;
        direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(currentSpeed);
        direction.applyEuler(camera.rotation);
        
        if (flyMode) {
            // In fly mode: completely bypass physics, move position directly
            const verticalMove = (Number(moveUp) - Number(moveDown)) * FLY_SPEED * 0.016; // ~60fps
            const horizontalMove = direction.multiplyScalar(0.016);
            
            const newX = position.x + horizontalMove.x;
            const newY = position.y + horizontalMove.y + verticalMove;
            const newZ = position.z + horizontalMove.z;
            
            // Directly set position (noclip)
            playerRef.current.setTranslation({ x: newX, y: newY, z: newZ }, true);
            playerRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
            playerRef.current.setGravityScale(0, true);
            
            // Update camera
            camera.position.set(newX, newY + 0.6, newZ);
        } else {
            direction.y = 0; // Keep horizontal when not flying

            // Apply velocity through physics
            playerRef.current.setLinvel({
                x: direction.x,
                y: velocity.y,
                z: direction.z
            }, true);

            playerRef.current.setGravityScale(1, true);

            // Update camera to follow player
            camera.position.set(position.x, position.y + 0.6, position.z);
        }
    });

    return (
        <>
            <RigidBody
                ref={playerRef}
                colliders={false}
                mass={1}
                type="dynamic"
                position={spawnPosition}
                enabledRotations={[false, false, false]}
                linearDamping={0.5}
            >
                <CapsuleCollider ref={colliderRef} args={[0.5, 0.5]} />
            </RigidBody>
            <PointerLockControls />
        </>
    );
}
