import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { type AvatarPose, REST_POSE } from "@/lib/signLanguageData";

// Tony Stark color palette
const SKIN = "#e0b090";
const SKIN_DARK = "#c89070";
const HAIR = "#1a1a1a";
const GOATEE = "#1c1c1c";
const SUIT_PRIMARY = "#8b0000"; // Dark red / maroon suit
const SUIT_SECONDARY = "#2a2a2a"; // Dark charcoal
const SUIT_ACCENT = "#c4a35a"; // Gold trim
const ARC_REACTOR = "#4dc9f6"; // Glowing blue
const PANT_COLOR = "#1e1e1e";
const SHOE_COLOR = "#111";
const EYE_BROWN = "#3d1f0a";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// ─── Arm component ─────────────────────────────────────────
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
    const speed = 6;
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
    groupRef.current.rotation.z = (-Math.PI / 6 + c.armAngle * -1.2) * flip;
    groupRef.current.rotation.x = c.armForward * -0.8;
    groupRef.current.rotation.y = c.armSpread * 0.5 * flip;
  });

  const forearmRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!forearmRef.current) return;
    forearmRef.current.rotation.x = -current.current.forearmBend * Math.PI * 0.55;
  });

  const handRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!handRef.current) return;
    const c = current.current;
    handRef.current.rotation.x = c.wristTilt * 0.5;
    const s = 1 - c.handPose * 0.4;
    handRef.current.scale.setScalar(s);
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Shoulder joint — suit */}
      <mesh>
        <sphereGeometry args={[0.085, 14, 14]} />
        <meshStandardMaterial color={SUIT_PRIMARY} roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Upper arm — suited sleeve */}
      <mesh position={[0, -0.22, 0]}>
        <capsuleGeometry args={[0.075, 0.28, 8, 14]} />
        <meshStandardMaterial color={SUIT_PRIMARY} roughness={0.5} metalness={0.15} />
      </mesh>
      {/* Sleeve gold trim */}
      <mesh position={[0, -0.36, 0]}>
        <cylinderGeometry args={[0.077, 0.077, 0.02, 14]} />
        <meshStandardMaterial color={SUIT_ACCENT} roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Forearm */}
      <group ref={forearmRef} position={[0, -0.44, 0]}>
        {/* Elbow */}
        <mesh>
          <sphereGeometry args={[0.068, 12, 12]} />
          <meshStandardMaterial color={SUIT_SECONDARY} roughness={0.5} />
        </mesh>
        {/* Forearm shirt sleeve / skin */}
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.058, 0.26, 8, 14]} />
          <meshStandardMaterial color={SKIN} roughness={0.65} />
        </mesh>
        {/* Wrist watch (Tony Stark detail) */}
        <mesh position={[side === "right" ? 0 : 0, -0.33, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.025, 12]} />
          <meshStandardMaterial color="#333" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Hand */}
        <group ref={handRef} position={[0, -0.42, 0]}>
          {/* Palm */}
          <mesh>
            <boxGeometry args={[0.1, 0.12, 0.045]} />
            <meshStandardMaterial color={SKIN} roughness={0.6} />
          </mesh>
          {/* Fingers */}
          {[-0.03, -0.01, 0.01, 0.03].map((x, i) => (
            <mesh key={i} position={[x, -0.09, 0]}>
              <capsuleGeometry args={[0.014, 0.06, 4, 8]} />
              <meshStandardMaterial color={SKIN} roughness={0.6} />
            </mesh>
          ))}
          {/* Thumb */}
          <mesh
            position={[side === "right" ? -0.06 : 0.06, -0.03, 0.02]}
            rotation={[0, 0, side === "right" ? 0.5 : -0.5]}
          >
            <capsuleGeometry args={[0.017, 0.04, 4, 8]} />
            <meshStandardMaterial color={SKIN} roughness={0.6} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ─── Arc Reactor glow ─────────────────────────────────────
function ArcReactor() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 1.5 + Math.sin(state.clock.elapsedTime * 3) * 0.5;
  });
  return (
    <group position={[0, 1.05, 0.2]}>
      {/* Outer ring */}
      <mesh>
        <torusGeometry args={[0.055, 0.012, 12, 24]} />
        <meshStandardMaterial color="#555" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Inner glow */}
      <mesh ref={ref}>
        <circleGeometry args={[0.045, 24]} />
        <meshStandardMaterial
          color={ARC_REACTOR}
          emissive={ARC_REACTOR}
          emissiveIntensity={2}
          roughness={0.1}
          metalness={0.1}
          toneMapped={false}
        />
      </mesh>
      {/* Glow light */}
      <pointLight color={ARC_REACTOR} intensity={0.6} distance={1.5} />
    </group>
  );
}

// ─── Tony Stark Body ──────────────────────────────────────
interface AvatarBodyProps {
  pose: AvatarPose;
}

function TonyStarkBody({ pose }: AvatarBodyProps) {
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const browLRef = useRef<THREE.Mesh>(null);
  const browRRef = useRef<THREE.Mesh>(null);

  const headTargets = useRef({ nod: 0, tilt: 0, turn: 0 });
  const headCurrent = useRef({ nod: 0, tilt: 0, turn: 0 });
  const faceTargets = useRef({ mouth: 0, brow: 0 });
  const faceCurrent = useRef({ mouth: 0, brow: 0 });

  headTargets.current = { nod: pose.headNod, tilt: pose.headTilt, turn: pose.headTurn };
  faceTargets.current = { mouth: pose.mouthOpen, brow: pose.eyebrowRaise };

  useFrame((_, delta) => {
    const speed = 6;
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
      mouthRef.current.scale.y = 0.6 + fc.mouth * 1.2;
    }
    if (browLRef.current) {
      browLRef.current.position.y = 0.16 + fc.brow * 0.04;
    }
    if (browRRef.current) {
      browRRef.current.position.y = 0.16 + fc.brow * 0.04;
    }
  });

  // Subtle breathing
  useFrame((state) => {
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.008;
    }
  });

  return (
    <group ref={bodyRef} position={[0, -0.2, 0]}>
      {/* ── HEAD ── */}
      <group ref={headRef} position={[0, 1.55, 0]}>
        {/* Skull */}
        <mesh>
          <sphereGeometry args={[0.21, 20, 20]} />
          <meshStandardMaterial color={SKIN} roughness={0.55} />
        </mesh>
        {/* Jaw / chin — slightly more square */}
        <mesh position={[0, -0.12, 0.06]}>
          <boxGeometry args={[0.16, 0.1, 0.12]} />
          <meshStandardMaterial color={SKIN} roughness={0.55} />
        </mesh>

        {/* Hair — slicked back dark style */}
        <mesh position={[0, 0.08, -0.02]}>
          <sphereGeometry args={[0.225, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color={HAIR} roughness={0.9} />
        </mesh>
        {/* Side hair */}
        {[-0.18, 0.18].map((x, i) => (
          <mesh key={i} position={[x, 0.02, -0.04]}>
            <boxGeometry args={[0.06, 0.16, 0.14]} />
            <meshStandardMaterial color={HAIR} roughness={0.9} />
          </mesh>
        ))}

        {/* ── GOATEE ── */}
        {/* Mustache */}
        <mesh position={[0, -0.08, 0.19]}>
          <boxGeometry args={[0.08, 0.018, 0.02]} />
          <meshStandardMaterial color={GOATEE} roughness={0.9} />
        </mesh>
        {/* Soul patch / chin goatee */}
        <mesh position={[0, -0.15, 0.16]}>
          <boxGeometry args={[0.04, 0.05, 0.025]} />
          <meshStandardMaterial color={GOATEE} roughness={0.9} />
        </mesh>
        {/* Goatee side lines */}
        {[-0.04, 0.04].map((x, i) => (
          <mesh key={i} position={[x, -0.11, 0.18]}>
            <boxGeometry args={[0.012, 0.06, 0.015]} />
            <meshStandardMaterial color={GOATEE} roughness={0.9} />
          </mesh>
        ))}

        {/* ── EYES ── */}
        {[-0.065, 0.065].map((x, i) => (
          <group key={i} position={[x, 0.05, 0.17]}>
            {/* Eye white */}
            <mesh>
              <sphereGeometry args={[0.032, 12, 12]} />
              <meshStandardMaterial color="#f5f5f0" roughness={0.3} />
            </mesh>
            {/* Iris */}
            <mesh position={[0, 0, 0.02]}>
              <sphereGeometry args={[0.016, 10, 10]} />
              <meshStandardMaterial color={EYE_BROWN} roughness={0.4} />
            </mesh>
            {/* Pupil */}
            <mesh position={[0, 0, 0.028]}>
              <sphereGeometry args={[0.007, 8, 8]} />
              <meshStandardMaterial color="#000" roughness={0.2} />
            </mesh>
            {/* Eyelid (subtle) */}
            <mesh position={[0, 0.02, 0.01]}>
              <boxGeometry args={[0.04, 0.01, 0.025]} />
              <meshStandardMaterial color={SKIN_DARK} roughness={0.6} />
            </mesh>
          </group>
        ))}

        {/* ── EYEBROWS — thick, expressive ── */}
        <mesh ref={browLRef} position={[-0.065, 0.16, 0.18]} rotation={[0.1, 0, 0.08]}>
          <boxGeometry args={[0.07, 0.015, 0.018]} />
          <meshStandardMaterial color={HAIR} roughness={0.85} />
        </mesh>
        <mesh ref={browRRef} position={[0.065, 0.16, 0.18]} rotation={[0.1, 0, -0.08]}>
          <boxGeometry args={[0.07, 0.015, 0.018]} />
          <meshStandardMaterial color={HAIR} roughness={0.85} />
        </mesh>

        {/* Nose — more defined */}
        <mesh position={[0, -0.01, 0.2]}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <meshStandardMaterial color={SKIN_DARK} roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.02, 0.2]}>
          <boxGeometry args={[0.02, 0.06, 0.03]} />
          <meshStandardMaterial color={SKIN} roughness={0.55} />
        </mesh>

        {/* Mouth */}
        <mesh ref={mouthRef} position={[0, -0.085, 0.18]}>
          <boxGeometry args={[0.06, 0.015, 0.018]} />
          <meshStandardMaterial color="#b05555" roughness={0.5} />
        </mesh>

        {/* Ears */}
        {[-0.21, 0.21].map((x, i) => (
          <mesh key={i} position={[x, 0.01, -0.02]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color={SKIN_DARK} roughness={0.55} />
          </mesh>
        ))}
      </group>

      {/* ── NECK ── */}
      <mesh position={[0, 1.32, 0]}>
        <capsuleGeometry args={[0.058, 0.06, 8, 10]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} />
      </mesh>
      {/* Collar / shirt neckline */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.04, 12]} />
        <meshStandardMaterial color={SUIT_SECONDARY} roughness={0.5} />
      </mesh>

      {/* ── TORSO — suited ── */}
      <mesh position={[0, 1.02, 0]}>
        <capsuleGeometry args={[0.2, 0.32, 10, 14]} />
        <meshStandardMaterial color={SUIT_PRIMARY} roughness={0.45} metalness={0.1} />
      </mesh>
      {/* Suit lapels */}
      {[-0.08, 0.08].map((x, i) => (
        <mesh key={i} position={[x, 1.12, 0.16]} rotation={[0.3, i === 0 ? 0.3 : -0.3, 0]}>
          <boxGeometry args={[0.06, 0.15, 0.01]} />
          <meshStandardMaterial color={SUIT_SECONDARY} roughness={0.4} metalness={0.2} />
        </mesh>
      ))}
      {/* Suit buttons */}
      {[0.95, 0.88].map((y, i) => (
        <mesh key={i} position={[0, y, 0.2]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial color={SUIT_ACCENT} roughness={0.2} metalness={0.7} />
        </mesh>
      ))}

      {/* ARC REACTOR */}
      <ArcReactor />

      {/* ── BELT ── */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 0.04, 14]} />
        <meshStandardMaterial color="#222" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Belt buckle */}
      <mesh position={[0, 0.72, 0.18]}>
        <boxGeometry args={[0.04, 0.035, 0.015]} />
        <meshStandardMaterial color={SUIT_ACCENT} roughness={0.2} metalness={0.8} />
      </mesh>

      {/* ── HIPS / LOWER TORSO ── */}
      <mesh position={[0, 0.65, 0]}>
        <capsuleGeometry args={[0.17, 0.08, 10, 12]} />
        <meshStandardMaterial color={PANT_COLOR} roughness={0.6} />
      </mesh>

      {/* ── ARMS ── */}
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

      {/* ── LEGS ── */}
      {[-0.1, 0.1].map((x, i) => (
        <group key={i} position={[x, 0.55, 0]}>
          {/* Upper leg */}
          <mesh position={[0, -0.22, 0]}>
            <capsuleGeometry args={[0.078, 0.28, 8, 12]} />
            <meshStandardMaterial color={PANT_COLOR} roughness={0.6} />
          </mesh>
          {/* Knee */}
          <mesh position={[0, -0.38, 0]}>
            <sphereGeometry args={[0.062, 10, 10]} />
            <meshStandardMaterial color={PANT_COLOR} roughness={0.55} />
          </mesh>
          {/* Lower leg */}
          <mesh position={[0, -0.56, 0]}>
            <capsuleGeometry args={[0.055, 0.24, 8, 12]} />
            <meshStandardMaterial color={PANT_COLOR} roughness={0.6} />
          </mesh>
          {/* Shoe — polished dress shoe */}
          <mesh position={[0, -0.74, 0.03]}>
            <boxGeometry args={[0.095, 0.055, 0.16]} />
            <meshStandardMaterial color={SHOE_COLOR} roughness={0.2} metalness={0.3} />
          </mesh>
          {/* Shoe tip */}
          <mesh position={[0, -0.74, 0.1]}>
            <sphereGeometry args={[0.045, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={SHOE_COLOR} roughness={0.2} metalness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Main export ──────────────────────────────────────────
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
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 3]} intensity={1} castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={0.3} color="#88ccff" />
        <pointLight position={[0, 3, 2]} intensity={0.35} color="#ffaa44" />
        <TonyStarkBody pose={activePose} />
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
