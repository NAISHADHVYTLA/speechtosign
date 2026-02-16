import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import { type AvatarPose, REST_POSE } from "@/lib/signLanguageData";

const MODEL_URL = "/models/avatar_new.glb";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// Bone name mappings for ReadyPlayerMe / Mixamo-style skeletons
const BONE_NAMES = {
  spine: ["Spine", "Spine1", "Spine2"],
  neck: "Neck",
  head: "Head",
  // Shoulders (new)
  rightShoulder: "RightShoulder",
  leftShoulder: "LeftShoulder",
  // Arms
  rightUpperArm: "RightArm",
  rightLowerArm: "RightForeArm",
  rightHand: "RightHand",
  leftUpperArm: "LeftArm",
  leftLowerArm: "LeftForeArm",
  leftHand: "LeftHand",
  // Finger bones
  rightThumb: ["RightHandThumb1", "RightHandThumb2", "RightHandThumb3"],
  rightIndex: ["RightHandIndex1", "RightHandIndex2", "RightHandIndex3"],
  rightMiddle: ["RightHandMiddle1", "RightHandMiddle2", "RightHandMiddle3"],
  rightRing: ["RightHandRing1", "RightHandRing2", "RightHandRing3"],
  rightPinky: ["RightHandPinky1", "RightHandPinky2", "RightHandPinky3"],
  leftThumb: ["LeftHandThumb1", "LeftHandThumb2", "LeftHandThumb3"],
  leftIndex: ["LeftHandIndex1", "LeftHandIndex2", "LeftHandIndex3"],
  leftMiddle: ["LeftHandMiddle1", "LeftHandMiddle2", "LeftHandMiddle3"],
  leftRing: ["LeftHandRing1", "LeftHandRing2", "LeftHandRing3"],
  leftPinky: ["LeftHandPinky1", "LeftHandPinky2", "LeftHandPinky3"],
};

function findBone(skeleton: THREE.Skeleton | null, partialName: string): THREE.Bone | null {
  if (!skeleton) return null;
  return skeleton.bones.find((b) => b.name.includes(partialName)) || null;
}

interface AnimatedAvatarProps {
  pose: AvatarPose;
}

function AnimatedAvatar({ pose }: AnimatedAvatarProps) {
  const { scene } = useGLTF(MODEL_URL);
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const groupRef = useRef<THREE.Group>(null);

  // Find skeleton
  const skeleton = useMemo(() => {
    let skel: THREE.Skeleton | null = null;
    clonedScene.traverse((child) => {
      if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
        skel = (child as THREE.SkinnedMesh).skeleton;
      }
    });
    return skel;
  }, [clonedScene]);

  // Cache bone references
  const bones = useMemo(() => {
    if (!skeleton) return null;
    return {
      head: findBone(skeleton, BONE_NAMES.head),
      neck: findBone(skeleton, BONE_NAMES.neck),
      spine: BONE_NAMES.spine.map((n) => findBone(skeleton, n)),
      rightShoulder: findBone(skeleton, BONE_NAMES.rightShoulder),
      leftShoulder: findBone(skeleton, BONE_NAMES.leftShoulder),
      rightUpperArm: findBone(skeleton, BONE_NAMES.rightUpperArm),
      rightLowerArm: findBone(skeleton, BONE_NAMES.rightLowerArm),
      rightHand: findBone(skeleton, BONE_NAMES.rightHand),
      leftUpperArm: findBone(skeleton, BONE_NAMES.leftUpperArm),
      leftLowerArm: findBone(skeleton, BONE_NAMES.leftLowerArm),
      leftHand: findBone(skeleton, BONE_NAMES.leftHand),
      // Fingers
      rightThumb: BONE_NAMES.rightThumb.map((n) => findBone(skeleton, n)),
      rightIndex: BONE_NAMES.rightIndex.map((n) => findBone(skeleton, n)),
      rightMiddle: BONE_NAMES.rightMiddle.map((n) => findBone(skeleton, n)),
      rightRing: BONE_NAMES.rightRing.map((n) => findBone(skeleton, n)),
      rightPinky: BONE_NAMES.rightPinky.map((n) => findBone(skeleton, n)),
      leftThumb: BONE_NAMES.leftThumb.map((n) => findBone(skeleton, n)),
      leftIndex: BONE_NAMES.leftIndex.map((n) => findBone(skeleton, n)),
      leftMiddle: BONE_NAMES.leftMiddle.map((n) => findBone(skeleton, n)),
      leftRing: BONE_NAMES.leftRing.map((n) => findBone(skeleton, n)),
      leftPinky: BONE_NAMES.leftPinky.map((n) => findBone(skeleton, n)),
    };
  }, [skeleton]);

  // Store initial bind-pose quaternions
  const initialQuaternions = useRef<Map<string, THREE.Quaternion>>(new Map());
  const initialRotations = useRef<Map<string, THREE.Euler>>(new Map());
  const initialized = useRef(false);

  // Smooth interpolation state
  const current = useRef({
    rightArmAngle: 0, rightArmForward: 0, rightArmSpread: 0,
    rightForearmBend: 0, rightHandPose: 0, rightWristTilt: 0,
    leftArmAngle: 0, leftArmForward: 0, leftArmSpread: 0,
    leftForearmBend: 0, leftHandPose: 0, leftWristTilt: 0,
    headNod: 0, headTilt: 0, headTurn: 0,
    mouthOpen: 0, eyebrowRaise: 0,
  });

  // Find morph target mesh for facial expressions
  const morphMesh = useMemo(() => {
    let mesh: THREE.SkinnedMesh | null = null;
    clonedScene.traverse((child) => {
      if ((child as THREE.SkinnedMesh).isSkinnedMesh && (child as THREE.SkinnedMesh).morphTargetInfluences) {
        if (!mesh || child.name.includes("Head") || child.name.includes("Wolf3D_Head")) {
          mesh = child as THREE.SkinnedMesh;
        }
      }
    });
    return mesh;
  }, [clonedScene]);

  // Save initial bind-pose rotations on first frame
  useEffect(() => {
    if (!bones || initialized.current) return;
    const store = (name: string, bone: THREE.Bone | null) => {
      if (bone) {
        initialRotations.current.set(name, bone.rotation.clone());
        initialQuaternions.current.set(name, bone.quaternion.clone());
      }
    };
    store("head", bones.head);
    store("neck", bones.neck);
    store("rightShoulder", bones.rightShoulder);
    store("leftShoulder", bones.leftShoulder);
    store("rightUpperArm", bones.rightUpperArm);
    store("rightLowerArm", bones.rightLowerArm);
    store("rightHand", bones.rightHand);
    store("leftUpperArm", bones.leftUpperArm);
    store("leftLowerArm", bones.leftLowerArm);
    store("leftHand", bones.leftHand);
    bones.spine.forEach((b, i) => store(`spine${i}`, b));
    initialized.current = true;
  }, [bones]);

  const getInit = (name: string) => initialRotations.current.get(name);
  const getInitQ = (name: string) => initialQuaternions.current.get(name);

  // Temp quaternions for calculations
  const tempQ = useMemo(() => new THREE.Quaternion(), []);
  const deltaQ = useMemo(() => new THREE.Quaternion(), []);
  const axisX = useMemo(() => new THREE.Vector3(1, 0, 0), []);
  const axisY = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const axisZ = useMemo(() => new THREE.Vector3(0, 0, 1), []);

  useFrame((state, delta) => {
    if (!bones || !initialized.current) return;
    const speed = 8; // Slightly slower for more natural feel
    const c = current.current;

    // Smooth interpolate all values
    c.rightArmAngle = lerp(c.rightArmAngle, pose.rightArmAngle, delta * speed);
    c.rightArmForward = lerp(c.rightArmForward, pose.rightArmForward, delta * speed);
    c.rightArmSpread = lerp(c.rightArmSpread, pose.rightArmSpread, delta * speed);
    c.rightForearmBend = lerp(c.rightForearmBend, pose.rightForearmBend, delta * speed);
    c.rightHandPose = lerp(c.rightHandPose, pose.rightHandPose, delta * speed);
    c.rightWristTilt = lerp(c.rightWristTilt, pose.rightWristTilt, delta * speed);
    c.leftArmAngle = lerp(c.leftArmAngle, pose.leftArmAngle, delta * speed);
    c.leftArmForward = lerp(c.leftArmForward, pose.leftArmForward, delta * speed);
    c.leftArmSpread = lerp(c.leftArmSpread, pose.leftArmSpread, delta * speed);
    c.leftForearmBend = lerp(c.leftForearmBend, pose.leftForearmBend, delta * speed);
    c.leftHandPose = lerp(c.leftHandPose, pose.leftHandPose, delta * speed);
    c.leftWristTilt = lerp(c.leftWristTilt, pose.leftWristTilt, delta * speed);
    c.headNod = lerp(c.headNod, pose.headNod, delta * speed);
    c.headTilt = lerp(c.headTilt, pose.headTilt, delta * speed);
    c.headTurn = lerp(c.headTurn, pose.headTurn, delta * speed);
    c.mouthOpen = lerp(c.mouthOpen, pose.mouthOpen, delta * speed);
    c.eyebrowRaise = lerp(c.eyebrowRaise, pose.eyebrowRaise, delta * speed);

    // ── HEAD — Euler offsets for head ──
    const headInit = getInit("head");
    if (bones.head && headInit) {
      bones.head.rotation.x = headInit.x + c.headNod * 0.15;
      bones.head.rotation.y = headInit.y + c.headTurn * 0.2;
      bones.head.rotation.z = headInit.z + c.headTilt * 0.1;
    }

    // ── NECK — subtle follow of head movement ──
    const neckInit = getInit("neck");
    if (bones.neck && neckInit) {
      bones.neck.rotation.x = neckInit.x + c.headNod * 0.05;
      bones.neck.rotation.y = neckInit.y + c.headTurn * 0.08;
    }

    // Helper: apply quaternion-based rotation offset in BONE-LOCAL space
    const applyQuat = (bone: THREE.Bone | null, name: string, rx: number, ry: number, rz: number) => {
      const initQ = getInitQ(name);
      if (!bone || !initQ) return;
      tempQ.copy(initQ);
      if (Math.abs(rx) > 0.001) {
        deltaQ.setFromAxisAngle(axisX, rx);
        tempQ.multiply(deltaQ);
      }
      if (Math.abs(ry) > 0.001) {
        deltaQ.setFromAxisAngle(axisY, ry);
        tempQ.multiply(deltaQ);
      }
      if (Math.abs(rz) > 0.001) {
        deltaQ.setFromAxisAngle(axisZ, rz);
        tempQ.multiply(deltaQ);
      }
      bone.quaternion.copy(tempQ);
    };

    // ── SHOULDERS — natural shoulder lift when arms raise ──
    const shoulderLiftR = Math.max(0, c.rightArmAngle - 0.5) * 0.25;
    applyQuat(bones.rightShoulder, "rightShoulder",
      0, 0, -shoulderLiftR);

    const shoulderLiftL = Math.max(0, c.leftArmAngle - 0.5) * 0.25;
    applyQuat(bones.leftShoulder, "leftShoulder",
      0, 0, shoulderLiftL);

    // ── RIGHT ARM — full range with proper bone-local rotations ──
    const raiseR = Math.max(0, Math.min(c.rightArmAngle, 1.5)) * 0.7;
    applyQuat(bones.rightUpperArm, "rightUpperArm",
      -c.rightArmForward * 0.6, -c.rightArmSpread * 0.4, -raiseR);
    applyQuat(bones.rightLowerArm, "rightLowerArm",
      0, -c.rightForearmBend * 1.2, 0);
    applyQuat(bones.rightHand, "rightHand",
      c.rightWristTilt * 0.5, 0, 0);

    // ── LEFT ARM ──
    const raiseL = Math.max(0, Math.min(c.leftArmAngle, 1.5)) * 0.7;
    applyQuat(bones.leftUpperArm, "leftUpperArm",
      -c.leftArmForward * 0.6, c.leftArmSpread * 0.4, raiseL);
    applyQuat(bones.leftLowerArm, "leftLowerArm",
      0, c.leftForearmBend * 1.2, 0);
    applyQuat(bones.leftHand, "leftHand",
      c.leftWristTilt * 0.5, 0, 0);

    // ── FINGERS — curl based on handPose ──
    const fingerCurl = c.rightHandPose * 1.2;
    const setFingerCurl = (fingerBones: (THREE.Bone | null)[], curl: number) => {
      fingerBones.forEach((bone) => {
        if (bone) bone.rotation.z = curl;
      });
    };
    setFingerCurl(bones.rightIndex, fingerCurl);
    setFingerCurl(bones.rightMiddle, fingerCurl);
    setFingerCurl(bones.rightRing, fingerCurl);
    setFingerCurl(bones.rightPinky, fingerCurl);
    setFingerCurl(bones.rightThumb, fingerCurl * 0.7);

    const leftFingerCurl = c.leftHandPose * 1.2;
    setFingerCurl(bones.leftIndex, -leftFingerCurl);
    setFingerCurl(bones.leftMiddle, -leftFingerCurl);
    setFingerCurl(bones.leftRing, -leftFingerCurl);
    setFingerCurl(bones.leftPinky, -leftFingerCurl);
    setFingerCurl(bones.leftThumb, -leftFingerCurl * 0.7);

    // ── FACIAL EXPRESSIONS via morph targets (ARKit) ──
    if (morphMesh && morphMesh.morphTargetDictionary && morphMesh.morphTargetInfluences) {
      const dict = morphMesh.morphTargetDictionary;
      const influences = morphMesh.morphTargetInfluences;

      const setMorph = (name: string, value: number) => {
        if (dict[name] !== undefined) {
          influences[dict[name]] = lerp(influences[dict[name]], value, delta * speed);
        }
      };

      setMorph("jawOpen", c.mouthOpen * 0.8);
      setMorph("mouthOpen", c.mouthOpen * 0.6);
      setMorph("browInnerUp", c.eyebrowRaise);
      setMorph("browOuterUpLeft", c.eyebrowRaise * 0.5);
      setMorph("browOuterUpRight", c.eyebrowRaise * 0.5);
      // Subtle smile when eyebrows are raised (more expressive)
      setMorph("mouthSmileLeft", c.eyebrowRaise * 0.2);
      setMorph("mouthSmileRight", c.eyebrowRaise * 0.2);
      // Subtle eye widening when eyebrows raise
      setMorph("eyeWideLeft", c.eyebrowRaise * 0.3);
      setMorph("eyeWideRight", c.eyebrowRaise * 0.3);
    }

    // ── SPINE — subtle lean toward signing direction + breathing ──
    const spineInit0 = getInit("spine0");
    if (bones.spine[0] && spineInit0) {
      // Subtle torso lean when arms are active
      const armActivity = Math.max(c.rightArmAngle, c.leftArmAngle) * 0.03;
      bones.spine[0].rotation.x = spineInit0.x + armActivity;
    }
    const spineInit1 = getInit("spine1");
    if (bones.spine[1] && spineInit1) {
      bones.spine[1].rotation.x = spineInit1.x + Math.sin(state.clock.elapsedTime * 0.8) * 0.008;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.0, 0]} scale={1}>
      <primitive object={clonedScene} />
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
        camera={{ position: [0, 0.2, 5], fov: 35 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 3]} intensity={1.2} castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={0.3} color="#88ccff" />
        <pointLight position={[0, 3, 2]} intensity={0.3} color="#ffddaa" />
        <AnimatedAvatar pose={activePose} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
          minDistance={4}
          maxDistance={6}
          target={[0, 0.5, 0]}
          autoRotate={false}
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

useGLTF.preload(MODEL_URL);
