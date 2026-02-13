import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import { type AvatarPose, REST_POSE } from "@/lib/signLanguageData";

const MODEL_URL = "/models/avatar.glb";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}


// Bone name mappings for ReadyPlayerMe / Mixamo-style skeletons
const BONE_NAMES = {
  spine: ["Spine", "Spine1", "Spine2"],
  neck: "Neck",
  head: "Head",
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
      if (bone) initialRotations.current.set(name, bone.rotation.clone());
    };
    store("head", bones.head);
    store("neck", bones.neck);
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

  useFrame((state, delta) => {
    if (!bones || !initialized.current) return;
    const speed = 7;
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

    // ── HEAD — offsets from bind pose ──
    const headInit = getInit("head");
    if (bones.head && headInit) {
      bones.head.rotation.x = headInit.x + c.headNod * 0.2;
      bones.head.rotation.y = headInit.y + c.headTurn * 0.3;
      bones.head.rotation.z = headInit.z + c.headTilt * 0.15;
    }

    // RPM bind pose: rightUpperArm x=0.998 z=0.144, leftUpperArm x=0.998 z=-0.144
    // Use ZYX euler order to properly lower arms from T-pose
    const tempEuler = new THREE.Euler();

    // ── RIGHT ARM ──
    const rArmInit = getInit("rightUpperArm");
    if (bones.rightUpperArm && rArmInit) {
      // armAngle: 0=down, 1=shoulder height, >1=above head
      // Use small multiplier to keep movements controlled and visible
      const lowerAngle = (1 - Math.min(c.rightArmAngle, 1.5)) * 0.8;
      const forwardAngle = -c.rightArmForward * 0.3;

      tempEuler.set(
        rArmInit.x + forwardAngle,
        rArmInit.y - c.rightArmSpread * 0.2,
        rArmInit.z + lowerAngle,
        'ZYX'
      );
      bones.rightUpperArm.quaternion.setFromEuler(tempEuler);
    }
    const rForeInit = getInit("rightLowerArm");
    if (bones.rightLowerArm && rForeInit) {
      bones.rightLowerArm.rotation.set(
        rForeInit.x,
        rForeInit.y - c.rightForearmBend * 1.8,
        rForeInit.z
      );
    }
    const rHandInit = getInit("rightHand");
    if (bones.rightHand && rHandInit) {
      bones.rightHand.rotation.x = rHandInit.x + c.rightWristTilt * 0.4;
    }

    // ── LEFT ARM ──
    const lArmInit = getInit("leftUpperArm");
    if (bones.leftUpperArm && lArmInit) {
      const lowerAngle = (1 - Math.min(c.leftArmAngle, 1.5)) * 0.8;
      const forwardAngle = -c.leftArmForward * 0.3;

      tempEuler.set(
        lArmInit.x + forwardAngle,
        lArmInit.y + c.leftArmSpread * 0.2,
        lArmInit.z - lowerAngle,
        'ZYX'
      );
      bones.leftUpperArm.quaternion.setFromEuler(tempEuler);
    }
    const lForeInit = getInit("leftLowerArm");
    if (bones.leftLowerArm && lForeInit) {
      bones.leftLowerArm.rotation.set(
        lForeInit.x,
        lForeInit.y + c.leftForearmBend * 1.8,
        lForeInit.z
      );
    }
    const lHandInit = getInit("leftHand");
    if (bones.leftHand && lHandInit) {
      bones.leftHand.rotation.x = lHandInit.x + c.leftWristTilt * 0.4;
    }

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

    // ── FACIAL EXPRESSIONS via morph targets ──
    if (morphMesh && morphMesh.morphTargetDictionary && morphMesh.morphTargetInfluences) {
      const dict = morphMesh.morphTargetDictionary;
      const influences = morphMesh.morphTargetInfluences;

      if (dict["jawOpen"] !== undefined) {
        influences[dict["jawOpen"]] = lerp(influences[dict["jawOpen"]], c.mouthOpen * 0.8, delta * speed);
      }
      if (dict["mouthOpen"] !== undefined) {
        influences[dict["mouthOpen"]] = lerp(influences[dict["mouthOpen"]], c.mouthOpen * 0.6, delta * speed);
      }
      if (dict["browInnerUp"] !== undefined) {
        influences[dict["browInnerUp"]] = lerp(influences[dict["browInnerUp"]], c.eyebrowRaise, delta * speed);
      }
      if (dict["browOuterUpLeft"] !== undefined) {
        influences[dict["browOuterUpLeft"]] = lerp(influences[dict["browOuterUpLeft"]], c.eyebrowRaise * 0.5, delta * speed);
      }
      if (dict["browOuterUpRight"] !== undefined) {
        influences[dict["browOuterUpRight"]] = lerp(influences[dict["browOuterUpRight"]], c.eyebrowRaise * 0.5, delta * speed);
      }
    }

    // Subtle breathing on spine
    const spineInit = getInit("spine1");
    if (bones.spine[1] && spineInit) {
      bones.spine[1].rotation.x = spineInit.x + Math.sin(state.clock.elapsedTime * 0.8) * 0.008;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.85, 0]} scale={1}>
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
        camera={{ position: [0, 0.5, 3], fov: 30 }}
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
          enableZoom={true}
          enableRotate={false}
          minDistance={2}
          maxDistance={5}
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
