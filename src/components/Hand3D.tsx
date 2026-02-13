import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import type { HandPose } from "@/lib/signLanguageData";

interface FingerProps {
  position: [number, number, number];
  curl: number;
  segmentCount?: number;
  length?: number;
  thickness?: number;
}

function Finger({ position, curl, segmentCount = 3, length = 0.35, thickness = 0.08 }: FingerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const targetCurl = useRef(curl);
  targetCurl.current = curl;
  const currentCurl = useRef(curl);

  useFrame((_, delta) => {
    currentCurl.current = THREE.MathUtils.lerp(currentCurl.current, targetCurl.current, delta * 6);
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Group || child instanceof THREE.Mesh) {
          const group = child as THREE.Group;
          if (group.rotation) {
            group.rotation.x = -currentCurl.current * (Math.PI / 2.2) * (i === 0 ? 0.6 : 1);
          }
        }
      });
    }
  });

  const segLength = length / segmentCount;

  return (
    <group ref={groupRef} position={position}>
      {Array.from({ length: segmentCount }).map((_, i) => (
        <group key={i} position={[0, i === 0 ? 0 : segLength, 0]}>
          <mesh position={[0, segLength / 2, 0]}>
            <capsuleGeometry args={[thickness * (1 - i * 0.15), segLength * 0.8, 4, 8]} />
            <meshStandardMaterial
              color="#e8c4a0"
              roughness={0.6}
              metalness={0.1}
            />
          </mesh>
          {/* Joint sphere */}
          {i < segmentCount - 1 && (
            <mesh position={[0, segLength, 0]}>
              <sphereGeometry args={[thickness * (1 - i * 0.1), 8, 8]} />
              <meshStandardMaterial color="#ddb892" roughness={0.5} metalness={0.1} />
            </mesh>
          )}
        </group>
      ))}
      {/* Fingertip */}
      <mesh position={[0, length + 0.02, 0]}>
        <sphereGeometry args={[thickness * 0.7, 8, 8]} />
        <meshStandardMaterial color="#f0cdb0" roughness={0.4} metalness={0.05} />
      </mesh>
    </group>
  );
}

interface HandModelProps {
  pose: HandPose | null;
}

function HandModel({ pose }: HandModelProps) {
  const handRef = useRef<THREE.Group>(null);
  const targetPose = useRef(pose);
  targetPose.current = pose;
  const currentWrist = useRef({ rotation: 0, tilt: 0 });

  useFrame((_, delta) => {
    if (!handRef.current || !targetPose.current) return;
    currentWrist.current.rotation = THREE.MathUtils.lerp(
      currentWrist.current.rotation,
      targetPose.current.wristRotation,
      delta * 5
    );
    currentWrist.current.tilt = THREE.MathUtils.lerp(
      currentWrist.current.tilt,
      targetPose.current.wristTilt,
      delta * 5
    );
    handRef.current.rotation.y = currentWrist.current.rotation * 0.5;
    handRef.current.rotation.x = currentWrist.current.tilt * 0.4;
  });

  const defaultPose: HandPose = useMemo(() => ({
    fingers: [0, 0, 0, 0, 0],
    thumbRotation: 0,
    wristRotation: 0,
    wristTilt: 0,
  }), []);

  const activePose = pose || defaultPose;

  return (
    <group ref={handRef} rotation={[0.2, 0, 0]} position={[0, -0.5, 0]}>
      {/* Palm */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.55, 0.55, 0.18]} />
        <meshStandardMaterial color="#e8c4a0" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Palm detail - slightly inset */}
      <mesh position={[0, 0.15, 0.05]}>
        <boxGeometry args={[0.48, 0.48, 0.08]} />
        <meshStandardMaterial color="#ddb892" roughness={0.7} metalness={0.05} />
      </mesh>
      {/* Wrist */}
      <mesh position={[0, -0.15, 0]}>
        <capsuleGeometry args={[0.12, 0.2, 4, 8]} />
        <meshStandardMaterial color="#ddb892" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Thumb */}
      <group position={[-0.28, 0.1, 0.05]} rotation={[0, 0, 0.6 + activePose.thumbRotation * 0.3]}>
        <Finger position={[0, 0, 0]} curl={activePose.fingers[0]} segmentCount={2} length={0.28} thickness={0.09} />
      </group>

      {/* Index finger */}
      <Finger position={[-0.16, 0.42, 0]} curl={activePose.fingers[1]} thickness={0.07} />
      {/* Middle finger */}
      <Finger position={[-0.05, 0.44, 0]} curl={activePose.fingers[2]} length={0.38} thickness={0.07} />
      {/* Ring finger */}
      <Finger position={[0.07, 0.42, 0]} curl={activePose.fingers[3]} length={0.34} thickness={0.065} />
      {/* Pinky finger */}
      <Finger position={[0.18, 0.38, 0]} curl={activePose.fingers[4]} length={0.28} thickness={0.06} />
    </group>
  );
}

interface Hand3DProps {
  pose: HandPose | null;
  label?: string;
}

export default function Hand3D({ pose, label }: Hand3DProps) {
  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0.5, 2.5], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 3]} intensity={1} castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={0.3} color="#88ccff" />
        <pointLight position={[0, 2, 2]} intensity={0.5} color="#00ccaa" />
        <HandModel pose={pose} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate={!pose}
          autoRotateSpeed={1}
        />
        <Environment preset="studio" />
      </Canvas>
      {label && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-card px-4 py-2">
          <span className="text-sm font-display font-semibold text-primary">{label}</span>
        </div>
      )}
    </div>
  );
}
