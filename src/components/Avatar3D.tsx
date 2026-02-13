import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { type AvatarPose, REST_POSE } from "@/lib/signLanguageData";

// Skinned humanoid avatar built from primitives
const SKIN = "#e8c4a0";
const SKIN_DARK = "#d4a574";
const HAIR = "#3d2b1f";
const SHIRT = "#2a4a6b";
const PANTS = "#1a2a3a";
const SHOE = "#222";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

interface LimbProps {
  position: [number, number, number];
  armAngle: number;
  armForward: number;
  armSpread: number;
  forearmBend: number;
  handPose: number;
  wristTilt: number;
  side: "left" | "right";
}

function Arm({ position, armAngle, armForward, armSpread, forearmBend, handPose, wristTilt, side }: LimbProps) {
  const groupRef = useRef<THREE.Group>(null);
  const targets = useRef({ armAngle, armForward, armSpread, forearmBend, handPose, wristTilt });
  const current = useRef({ armAngle: 0, armForward: 0, armSpread: 0, forearmBend: 0.1, handPose: 0.3, wristTilt: 0 });

  targets.current = { armAngle, armForward, armSpread, forearmBend, handPose, wristTilt };

  useFrame((_, delta) => {
    const speed = 5;
    const c = current.current;
    const t = targets.current;
    c.armAngle = lerp(c.armAngle, t.armAngle, delta * speed);
    c.armForward = lerp(c.armForward, t.armForward, delta * speed);
    c.armSpread = lerp(c.armSpread, t.armSpread, delta * speed);
    c.forearmBend = lerp(c.forearmBend, t.forearmBend, delta * speed);
    c.handPose = lerp(c.handPose, t.handPose, delta * speed);
    c.wristTilt = lerp(c.wristTilt, t.wristTilt, delta * speed);

    if (!groupRef.current) return;
    const flip = side === "left" ? -1 : 1;
    // Upper arm rotation
    groupRef.current.rotation.z = (-Math.PI / 6 + c.armAngle * -1.2) * flip;
    groupRef.current.rotation.x = c.armForward * -0.8;
    groupRef.current.rotation.y = c.armSpread * 0.5 * flip;
  });

  const forearmRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!forearmRef.current) return;
    forearmRef.current.rotation.x = -current.current.forearmBend * Math.PI * 0.55;
  });

  const handRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!handRef.current) return;
    const c = current.current;
    handRef.current.rotation.x = c.wristTilt * 0.5;
    // Scale fingers based on handPose (open=1 scale, fist=smaller)
    const s = 1 - c.handPose * 0.4;
    handRef.current.scale.setScalar(s);
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Upper arm */}
      <mesh position={[0, -0.22, 0]}>
        <capsuleGeometry args={[0.07, 0.28, 6, 12]} />
        <meshStandardMaterial color={SKIN} roughness={0.7} />
      </mesh>
      {/* Shoulder joint */}
      <mesh>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color={SHIRT} roughness={0.6} />
      </mesh>

      {/* Forearm */}
      <group ref={forearmRef} position={[0, -0.44, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.06, 0.26, 6, 12]} />
          <meshStandardMaterial color={SKIN} roughness={0.7} />
        </mesh>
        {/* Elbow */}
        <mesh>
          <sphereGeometry args={[0.065, 10, 10]} />
          <meshStandardMaterial color={SKIN_DARK} roughness={0.6} />
        </mesh>

        {/* Hand */}
        <group ref={handRef} position={[0, -0.42, 0]}>
          <mesh>
            <boxGeometry args={[0.1, 0.12, 0.05]} />
            <meshStandardMaterial color={SKIN} roughness={0.6} />
          </mesh>
          {/* Fingers (simplified) */}
          {[-0.03, -0.01, 0.01, 0.03].map((x, i) => (
            <mesh key={i} position={[x, -0.09, 0]}>
              <capsuleGeometry args={[0.015, 0.06, 4, 6]} />
              <meshStandardMaterial color={SKIN} roughness={0.6} />
            </mesh>
          ))}
          {/* Thumb */}
          <mesh position={[side === "right" ? -0.06 : 0.06, -0.03, 0.02]} rotation={[0, 0, side === "right" ? 0.5 : -0.5]}>
            <capsuleGeometry args={[0.018, 0.04, 4, 6]} />
            <meshStandardMaterial color={SKIN} roughness={0.6} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

interface AvatarBodyProps {
  pose: AvatarPose;
}

function AvatarBody({ pose }: AvatarBodyProps) {
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const browRef = useRef<THREE.Mesh>(null);

  const headTargets = useRef({ nod: 0, tilt: 0, turn: 0 });
  const headCurrent = useRef({ nod: 0, tilt: 0, turn: 0 });
  const faceTargets = useRef({ mouth: 0, brow: 0 });
  const faceCurrent = useRef({ mouth: 0, brow: 0 });

  headTargets.current = { nod: pose.headNod, tilt: pose.headTilt, turn: pose.headTurn };
  faceTargets.current = { mouth: pose.mouthOpen, brow: pose.eyebrowRaise };

  useFrame((_, delta) => {
    const speed = 5;
    const hc = headCurrent.current;
    const ht = headTargets.current;
    hc.nod = lerp(hc.nod, ht.nod, delta * speed);
    hc.tilt = lerp(hc.tilt, ht.tilt, delta * speed);
    hc.turn = lerp(hc.turn, ht.turn, delta * speed);

    if (headRef.current) {
      headRef.current.rotation.x = hc.nod * 0.3;
      headRef.current.rotation.z = hc.tilt * 0.2;
      headRef.current.rotation.y = hc.turn * 0.4;
    }

    const fc = faceCurrent.current;
    const ft = faceTargets.current;
    fc.mouth = lerp(fc.mouth, ft.mouth, delta * speed);
    fc.brow = lerp(fc.brow, ft.brow, delta * speed);

    if (mouthRef.current) {
      mouthRef.current.scale.y = 0.5 + fc.mouth * 1.5;
    }
    if (browRef.current) {
      browRef.current.position.y = 0.18 + fc.brow * 0.04;
    }
  });

  // Subtle idle animation
  useFrame((state) => {
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.01;
    }
  });

  return (
    <group ref={bodyRef} position={[0, -0.2, 0]}>
      {/* Head */}
      <group ref={headRef} position={[0, 1.55, 0]}>
        {/* Skull */}
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color={SKIN} roughness={0.6} />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.23, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color={HAIR} roughness={0.8} />
        </mesh>
        {/* Eyes */}
        {[-0.07, 0.07].map((x, i) => (
          <group key={i} position={[x, 0.06, 0.18]}>
            <mesh>
              <sphereGeometry args={[0.035, 10, 10]} />
              <meshStandardMaterial color="#fff" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <sphereGeometry args={[0.018, 8, 8]} />
              <meshStandardMaterial color="#2c1810" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.03]}>
              <sphereGeometry args={[0.008, 6, 6]} />
              <meshStandardMaterial color="#000" roughness={0.2} />
            </mesh>
          </group>
        ))}
        {/* Eyebrows */}
        <mesh ref={browRef} position={[0, 0.18, 0.19]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.22, 0.02, 0.02]} />
          <meshStandardMaterial color={HAIR} roughness={0.8} />
        </mesh>
        {/* Nose */}
        <mesh position={[0, -0.02, 0.2]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color={SKIN_DARK} roughness={0.6} />
        </mesh>
        {/* Mouth */}
        <mesh ref={mouthRef} position={[0, -0.1, 0.19]}>
          <boxGeometry args={[0.08, 0.02, 0.02]} />
          <meshStandardMaterial color="#c4706a" roughness={0.5} />
        </mesh>
        {/* Ears */}
        {[-0.22, 0.22].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color={SKIN_DARK} roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Neck */}
      <mesh position={[0, 1.3, 0]}>
        <capsuleGeometry args={[0.06, 0.08, 6, 8]} />
        <meshStandardMaterial color={SKIN} roughness={0.7} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.0, 0]}>
        <capsuleGeometry args={[0.2, 0.35, 8, 12]} />
        <meshStandardMaterial color={SHIRT} roughness={0.7} />
      </mesh>

      {/* Hips */}
      <mesh position={[0, 0.65, 0]}>
        <capsuleGeometry args={[0.18, 0.1, 8, 10]} />
        <meshStandardMaterial color={PANTS} roughness={0.7} />
      </mesh>

      {/* Arms */}
      <Arm
        position={[0.28, 1.2, 0]}
        side="right"
        armAngle={pose.rightArmAngle}
        armForward={pose.rightArmForward}
        armSpread={pose.rightArmSpread}
        forearmBend={pose.rightForearmBend}
        handPose={pose.rightHandPose}
        wristTilt={pose.rightWristTilt}
      />
      <Arm
        position={[-0.28, 1.2, 0]}
        side="left"
        armAngle={pose.leftArmAngle}
        armForward={pose.leftArmForward}
        armSpread={pose.leftArmSpread}
        forearmBend={pose.leftForearmBend}
        handPose={pose.leftHandPose}
        wristTilt={pose.leftWristTilt}
      />

      {/* Legs */}
      {[-0.1, 0.1].map((x, i) => (
        <group key={i} position={[x, 0.55, 0]}>
          {/* Upper leg */}
          <mesh position={[0, -0.22, 0]}>
            <capsuleGeometry args={[0.08, 0.28, 6, 10]} />
            <meshStandardMaterial color={PANTS} roughness={0.7} />
          </mesh>
          {/* Knee */}
          <mesh position={[0, -0.38, 0]}>
            <sphereGeometry args={[0.065, 8, 8]} />
            <meshStandardMaterial color={PANTS} roughness={0.6} />
          </mesh>
          {/* Lower leg */}
          <mesh position={[0, -0.56, 0]}>
            <capsuleGeometry args={[0.06, 0.24, 6, 10]} />
            <meshStandardMaterial color={PANTS} roughness={0.7} />
          </mesh>
          {/* Shoe */}
          <mesh position={[0, -0.74, 0.03]}>
            <boxGeometry args={[0.1, 0.06, 0.16]} />
            <meshStandardMaterial color={SHOE} roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

interface Avatar3DProps {
  pose: AvatarPose | null;
  label?: string;
}

export default function Avatar3D({ pose, label }: Avatar3DProps) {
  const activePose = pose || REST_POSE;

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 1.2, 3], fov: 35 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 3]} intensity={0.9} castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={0.25} color="#88ccff" />
        <pointLight position={[0, 3, 2]} intensity={0.4} color="#00ccaa" />
        <AvatarBody pose={activePose} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={5}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
          target={[0, 0.8, 0]}
          autoRotate={!pose}
          autoRotateSpeed={0.5}
        />
        <Environment preset="studio" />
      </Canvas>
      {label && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-card px-5 py-2.5 glow-border">
          <span className="text-sm font-display font-bold text-primary tracking-wide">{label}</span>
        </div>
      )}
    </div>
  );
}
