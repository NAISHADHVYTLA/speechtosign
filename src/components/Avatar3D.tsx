import { useRef, useEffect, useMemo, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import { type AvatarPose, REST_POSE } from "@/lib/signLanguageData";

const MODEL_URL = "/models/avatar_new.glb";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothLerp(a: number, b: number, t: number) {
  const ease = 1 - Math.pow(1 - t, 2);
  return a + (b - a) * ease;
}

// ─── Bone name mappings ──────────────────────────────────────
const BONE_NAMES = {
  spine: ["Spine", "Spine1", "Spine2"],
  neck: "Neck",
  head: "Head",
  hips: "Hips",
  rightShoulder: "RightShoulder",
  leftShoulder: "LeftShoulder",
  rightUpperArm: "RightArm",
  rightLowerArm: "RightForeArm",
  rightHand: "RightHand",
  leftUpperArm: "LeftArm",
  leftLowerArm: "LeftForeArm",
  leftHand: "LeftHand",
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
  // Prefer exact match first, then endsWith, then includes as last resort
  return (
    skeleton.bones.find((b) => b.name === partialName) ||
    skeleton.bones.find((b) => b.name.endsWith(partialName)) ||
    skeleton.bones.find((b) => {
      // Only match if partialName is at a word boundary (avoid "RightArm" matching "RightForeArm")
      const idx = b.name.indexOf(partialName);
      return idx >= 0 && (idx + partialName.length === b.name.length);
    }) ||
    null
  );
}

// ─── Mixer-based avatar for GLB animation clips ──────────────
export interface AvatarHandle {
  playClip: (clip: THREE.AnimationClip, fadeIn?: number, fadeOut?: number) => Promise<void>;
  mixer: THREE.AnimationMixer | null;
}

interface AnimatedAvatarProps {
  pose: AvatarPose;
  useProceduralPose: boolean; // true = use pose data, false = mixer is driving
}

const AnimatedAvatarInner = forwardRef<AvatarHandle, AnimatedAvatarProps>(
  function AnimatedAvatarInner({ pose, useProceduralPose }, ref) {
    const { scene } = useGLTF(MODEL_URL);
    const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const groupRef = useRef<THREE.Group>(null);
    const mixerRef = useRef<THREE.AnimationMixer | null>(null);
    const activeActionRef = useRef<THREE.AnimationAction | null>(null);

    // Create mixer
    useEffect(() => {
      mixerRef.current = new THREE.AnimationMixer(clonedScene);
      
      // Log bone names for debugging
      clonedScene.traverse((child) => {
        if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
          const skel = (child as THREE.SkinnedMesh).skeleton;
          console.log("[Avatar3D] Bone names:", skel.bones.map(b => b.name).join(", "));
        }
      });
      
      return () => {
        mixerRef.current?.stopAllAction();
        mixerRef.current = null;
      };
    }, [clonedScene]);

    // Expose mixer handle
    useImperativeHandle(ref, () => ({
      mixer: mixerRef.current,
      playClip: (clip: THREE.AnimationClip, fadeIn = 0.3, fadeOut = 0.3) => {
        return new Promise<void>((resolve) => {
          const mixer = mixerRef.current;
          if (!mixer) { resolve(); return; }

          // Fade out any current action
          if (activeActionRef.current) {
            activeActionRef.current.fadeOut(fadeIn);
          }

          const action = mixer.clipAction(clip);
          action.reset();
          action.setLoop(THREE.LoopOnce, 1);
          action.clampWhenFinished = true;
          action.fadeIn(fadeIn);
          action.play();
          activeActionRef.current = action;

          const onFinished = () => {
            mixer.removeEventListener("finished", onFinished);
            action.fadeOut(fadeOut);
            activeActionRef.current = null;
            resolve();
          };
          mixer.addEventListener("finished", onFinished);
        });
      },
    }), [clonedScene]);

    const skeleton = useMemo(() => {
      let skel: THREE.Skeleton | null = null;
      clonedScene.traverse((child) => {
        if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
          skel = (child as THREE.SkinnedMesh).skeleton;
        }
      });
      return skel;
    }, [clonedScene]);

    const bones = useMemo(() => {
      if (!skeleton) return null;
      return {
        head: findBone(skeleton, BONE_NAMES.head),
        neck: findBone(skeleton, BONE_NAMES.neck),
        hips: findBone(skeleton, "Hips"),
        spine: BONE_NAMES.spine.map((n) => findBone(skeleton, n)),
        rightShoulder: findBone(skeleton, BONE_NAMES.rightShoulder),
        leftShoulder: findBone(skeleton, BONE_NAMES.leftShoulder),
        rightUpperArm: findBone(skeleton, BONE_NAMES.rightUpperArm),
        rightLowerArm: findBone(skeleton, BONE_NAMES.rightLowerArm),
        rightHand: findBone(skeleton, BONE_NAMES.rightHand),
        leftUpperArm: findBone(skeleton, BONE_NAMES.leftUpperArm),
        leftLowerArm: findBone(skeleton, BONE_NAMES.leftLowerArm),
        leftHand: findBone(skeleton, BONE_NAMES.leftHand),
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

    const initialQuaternions = useRef<Map<string, THREE.Quaternion>>(new Map());
    const initialRotations = useRef<Map<string, THREE.Euler>>(new Map());
    const bindWorldQuaternions = useRef<Map<string, THREE.Quaternion>>(new Map());
    const initialized = useRef(false);

    const current = useRef({
      rightArmAngle: 0, rightArmForward: 0.05, rightArmSpread: 0,
      rightForearmBend: 0.15, rightHandPose: 0.05, rightWristTilt: 0, rightWristRotate: 0,
      leftArmAngle: 0, leftArmForward: 0.05, leftArmSpread: 0,
      leftForearmBend: 0.15, leftHandPose: 0.05, leftWristTilt: 0, leftWristRotate: 0,
      headNod: 0, headTilt: 0, headTurn: 0,
      mouthOpen: 0, eyebrowRaise: 0,
      rightThumbCurl: 0.1, rightIndexCurl: 0.1, rightMiddleCurl: 0.1, rightRingCurl: 0.12, rightPinkyCurl: 0.12,
      rightFingerSpread: 0.05,
      leftThumbCurl: 0.1, leftIndexCurl: 0.1, leftMiddleCurl: 0.1, leftRingCurl: 0.12, leftPinkyCurl: 0.12,
      leftFingerSpread: 0.05,
    });

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

    // Save bind-pose rotations (reset on bones change)
    useEffect(() => {
      if (!bones) return;
      initialized.current = false;
      initialRotations.current.clear();
      initialQuaternions.current.clear();
      bindWorldQuaternions.current.clear();

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

      // Store bind-pose WORLD quaternions for arm parents (shoulder bones)
      // These are needed for world-to-local conversion that doesn't depend on frame modifications
      if (bones.rightUpperArm) {
        const wq = new THREE.Quaternion();
        bones.rightUpperArm.getWorldQuaternion(wq);
        bindWorldQuaternions.current.set("rightUpperArm_world", wq);
        if (bones.rightUpperArm.parent) {
          const pq = new THREE.Quaternion();
          bones.rightUpperArm.parent.getWorldQuaternion(pq);
          bindWorldQuaternions.current.set("rightUpperArm_parentWorld", pq);
        }
      }
      if (bones.leftUpperArm) {
        const wq = new THREE.Quaternion();
        bones.leftUpperArm.getWorldQuaternion(wq);
        bindWorldQuaternions.current.set("leftUpperArm_world", wq);
        if (bones.leftUpperArm.parent) {
          const pq = new THREE.Quaternion();
          bones.leftUpperArm.parent.getWorldQuaternion(pq);
          bindWorldQuaternions.current.set("leftUpperArm_parentWorld", pq);
        }
      }

      console.log("[Avatar3D] Init complete. Bind-pose world quats stored.");
      initialized.current = true;
    }, [bones]);

    const getInit = (name: string) => initialRotations.current.get(name);
    const getInitQ = (name: string) => initialQuaternions.current.get(name);

    const tempQ = useMemo(() => new THREE.Quaternion(), []);
    const deltaQ = useMemo(() => new THREE.Quaternion(), []);
    const axisX = useMemo(() => new THREE.Vector3(1, 0, 0), []);
    const axisY = useMemo(() => new THREE.Vector3(0, 1, 0), []);
    const axisZ = useMemo(() => new THREE.Vector3(0, 0, 1), []);

    useFrame((state, delta) => {
      // Always update mixer (for GLB animation clips)
      mixerRef.current?.update(delta);

      // If mixer is driving the animation, skip procedural pose
      if (!useProceduralPose || !bones || !initialized.current) return;

      const speed = 6;
      const t = Math.min(delta * speed, 1);
      const c = current.current;

      // ── Smooth interpolate all values ──
      c.rightArmAngle = smoothLerp(c.rightArmAngle, pose.rightArmAngle, t);
      c.rightArmForward = smoothLerp(c.rightArmForward, pose.rightArmForward, t);
      c.rightArmSpread = smoothLerp(c.rightArmSpread, pose.rightArmSpread, t);
      c.rightForearmBend = smoothLerp(c.rightForearmBend, pose.rightForearmBend, t);
      c.rightHandPose = smoothLerp(c.rightHandPose, pose.rightHandPose, t);
      c.rightWristTilt = smoothLerp(c.rightWristTilt, pose.rightWristTilt, t);
      c.rightWristRotate = smoothLerp(c.rightWristRotate, pose.rightWristRotate ?? 0, t);
      c.leftArmAngle = smoothLerp(c.leftArmAngle, pose.leftArmAngle, t);
      c.leftArmForward = smoothLerp(c.leftArmForward, pose.leftArmForward, t);
      c.leftArmSpread = smoothLerp(c.leftArmSpread, pose.leftArmSpread, t);
      c.leftForearmBend = smoothLerp(c.leftForearmBend, pose.leftForearmBend, t);
      c.leftHandPose = smoothLerp(c.leftHandPose, pose.leftHandPose, t);
      c.leftWristTilt = smoothLerp(c.leftWristTilt, pose.leftWristTilt, t);
      c.leftWristRotate = smoothLerp(c.leftWristRotate, pose.leftWristRotate ?? 0, t);
      c.headNod = smoothLerp(c.headNod, pose.headNod, t);
      c.headTilt = smoothLerp(c.headTilt, pose.headTilt, t);
      c.headTurn = smoothLerp(c.headTurn, pose.headTurn, t);
      c.mouthOpen = smoothLerp(c.mouthOpen, pose.mouthOpen, t);
      c.eyebrowRaise = smoothLerp(c.eyebrowRaise, pose.eyebrowRaise, t);

      const fingerT = Math.min(delta * 8, 1);
      c.rightThumbCurl = lerp(c.rightThumbCurl, pose.rightThumbCurl ?? pose.rightHandPose * 0.7, fingerT);
      c.rightIndexCurl = lerp(c.rightIndexCurl, pose.rightIndexCurl ?? pose.rightHandPose, fingerT);
      c.rightMiddleCurl = lerp(c.rightMiddleCurl, pose.rightMiddleCurl ?? pose.rightHandPose, fingerT);
      c.rightRingCurl = lerp(c.rightRingCurl, pose.rightRingCurl ?? pose.rightHandPose, fingerT);
      c.rightPinkyCurl = lerp(c.rightPinkyCurl, pose.rightPinkyCurl ?? pose.rightHandPose, fingerT);
      c.rightFingerSpread = lerp(c.rightFingerSpread, pose.rightFingerSpread ?? 0, fingerT);
      c.leftThumbCurl = lerp(c.leftThumbCurl, pose.leftThumbCurl ?? pose.leftHandPose * 0.7, fingerT);
      c.leftIndexCurl = lerp(c.leftIndexCurl, pose.leftIndexCurl ?? pose.leftHandPose, fingerT);
      c.leftMiddleCurl = lerp(c.leftMiddleCurl, pose.leftMiddleCurl ?? pose.leftHandPose, fingerT);
      c.leftRingCurl = lerp(c.leftRingCurl, pose.leftRingCurl ?? pose.leftHandPose, fingerT);
      c.leftPinkyCurl = lerp(c.leftPinkyCurl, pose.leftPinkyCurl ?? pose.leftHandPose, fingerT);
      c.leftFingerSpread = lerp(c.leftFingerSpread, pose.leftFingerSpread ?? 0, fingerT);

      // ── HEAD ──
      const headInit = getInit("head");
      if (bones.head && headInit) {
        bones.head.rotation.x = headInit.x + c.headNod * 0.15;
        bones.head.rotation.y = headInit.y + c.headTurn * 0.2;
        bones.head.rotation.z = headInit.z + c.headTilt * 0.1;
      }

      const neckInit = getInit("neck");
      if (bones.neck && neckInit) {
        bones.neck.rotation.x = neckInit.x + c.headNod * 0.05;
        bones.neck.rotation.y = neckInit.y + c.headTurn * 0.08;
      }

      // Helper: apply euler offsets from bind-pose
      const applyEuler = (bone: THREE.Bone | null, name: string, rx: number, ry: number, rz: number) => {
        const init = getInit(name);
        if (!bone || !init) return;
        bone.rotation.set(init.x + rx, init.y + ry, init.z + rz);
      };

      // ── SHOULDERS ──
      const shoulderLiftR = Math.max(0, c.rightArmAngle - 0.6) * 0.3;
      applyEuler(bones.rightShoulder, "rightShoulder",
        -c.rightArmForward * 0.08, 0, -shoulderLiftR);
      const shoulderLiftL = Math.max(0, c.leftArmAngle - 0.6) * 0.3;
      applyEuler(bones.leftShoulder, "leftShoulder",
        -c.leftArmForward * 0.08, 0, shoulderLiftL);

      // ── RIGHT UPPER ARM ──
      // Strategy: compute desired WORLD quaternion, then convert to local
      // using the BIND-POSE parent world quaternion (not the modified one)
      {
        const initQ = getInitQ("rightUpperArm");
        const bindWorldQ = bindWorldQuaternions.current.get("rightUpperArm_world");
        const bindParentWorldQ = bindWorldQuaternions.current.get("rightUpperArm_parentWorld");
        if (bones.rightUpperArm && initQ && bindWorldQ && bindParentWorldQ) {
          // T-pose bone direction in world: (-1, 0, 0)
          // Desired direction: interpolate between (-1,0,0) and (0,-1,0) based on armAngle
          const tposeDir = new THREE.Vector3(-1, 0, 0);
          const targetDir = new THREE.Vector3(
            -c.rightArmAngle,
            -(1 - c.rightArmAngle),
            c.rightArmForward * 0.6 + 0.15
          ).normalize();

          // World-space rotation from T-pose to desired
          const worldRotDelta = new THREE.Quaternion().setFromUnitVectors(tposeDir, targetDir);

          // Desired world quaternion = worldRotDelta * bindWorldQ
          const desiredWorldQ = new THREE.Quaternion().copy(worldRotDelta).multiply(bindWorldQ);

          // Convert to local: local = parentWorldInv * world
          const parentInv = bindParentWorldQ.clone().invert();
          const desiredLocalQ = new THREE.Quaternion().copy(parentInv).multiply(desiredWorldQ);

          bones.rightUpperArm.quaternion.copy(desiredLocalQ);
        }
      }

      applyEuler(bones.rightLowerArm, "rightLowerArm",
        c.rightForearmBend * 1.4, 0, 0);
      applyEuler(bones.rightHand, "rightHand",
        c.rightWristTilt * 0.6, c.rightWristRotate * 0.8, 0);

      // ── LEFT UPPER ARM (mirrored) ──
      {
        const initQ = getInitQ("leftUpperArm");
        const bindWorldQ = bindWorldQuaternions.current.get("leftUpperArm_world");
        const bindParentWorldQ = bindWorldQuaternions.current.get("leftUpperArm_parentWorld");
        if (bones.leftUpperArm && initQ && bindWorldQ && bindParentWorldQ) {
          const tposeDir = new THREE.Vector3(1, 0, 0);
          const targetDir = new THREE.Vector3(
            c.leftArmAngle,
            -(1 - c.leftArmAngle),
            c.leftArmForward * 0.6 + 0.15
          ).normalize();

          const worldRotDelta = new THREE.Quaternion().setFromUnitVectors(tposeDir, targetDir);
          const desiredWorldQ = new THREE.Quaternion().copy(worldRotDelta).multiply(bindWorldQ);
          const parentInv = bindParentWorldQ.clone().invert();
          const desiredLocalQ = new THREE.Quaternion().copy(parentInv).multiply(desiredWorldQ);

          bones.leftUpperArm.quaternion.copy(desiredLocalQ);
        }
      }

      applyEuler(bones.leftLowerArm, "leftLowerArm",
        -c.leftForearmBend * 1.4, 0, 0);
      applyEuler(bones.leftHand, "leftHand",
        c.leftWristTilt * 0.6, c.leftWristRotate * 0.8, 0);

      // ── FINGERS ──
      const applyFingerCurl = (
        fingerBones: (THREE.Bone | null)[],
        curl: number,
        spread: number,
        spreadDir: number,
        isThumb: boolean = false
      ) => {
        fingerBones.forEach((bone, i) => {
          if (!bone) return;
          if (isThumb) {
            bone.rotation.z = curl * 0.8;
            bone.rotation.x = curl * 0.4;
          } else {
            bone.rotation.z = curl * 1.2;
          }
          if (i === 0 && Math.abs(spread) > 0.001) {
            bone.rotation.y = spread * spreadDir * 0.18;
          }
        });
      };

      const rs = c.rightFingerSpread;
      applyFingerCurl(bones.rightThumb, c.rightThumbCurl, rs, -1, true);
      applyFingerCurl(bones.rightIndex, c.rightIndexCurl, rs, -0.6);
      applyFingerCurl(bones.rightMiddle, c.rightMiddleCurl, rs, 0);
      applyFingerCurl(bones.rightRing, c.rightRingCurl, rs, 0.6);
      applyFingerCurl(bones.rightPinky, c.rightPinkyCurl, rs, 1.2);

      const ls = c.leftFingerSpread;
      applyFingerCurl(bones.leftThumb, -c.leftThumbCurl, ls, 1, true);
      applyFingerCurl(bones.leftIndex, -c.leftIndexCurl, ls, 0.6);
      applyFingerCurl(bones.leftMiddle, -c.leftMiddleCurl, ls, 0);
      applyFingerCurl(bones.leftRing, -c.leftRingCurl, ls, -0.6);
      applyFingerCurl(bones.leftPinky, -c.leftPinkyCurl, ls, -1.2);

      // ── FACIAL EXPRESSIONS ──
      if (morphMesh && morphMesh.morphTargetDictionary && morphMesh.morphTargetInfluences) {
        const dict = morphMesh.morphTargetDictionary;
        const influences = morphMesh.morphTargetInfluences;
        const setMorph = (name: string, value: number) => {
          if (dict[name] !== undefined) {
            influences[dict[name]] = lerp(influences[dict[name]], value, t);
          }
        };
        setMorph("jawOpen", c.mouthOpen * 0.8);
        setMorph("mouthOpen", c.mouthOpen * 0.6);
        setMorph("browInnerUp", c.eyebrowRaise);
        setMorph("browOuterUpLeft", c.eyebrowRaise * 0.5);
        setMorph("browOuterUpRight", c.eyebrowRaise * 0.5);
        setMorph("mouthSmileLeft", c.eyebrowRaise * 0.2);
        setMorph("mouthSmileRight", c.eyebrowRaise * 0.2);
        setMorph("eyeWideLeft", c.eyebrowRaise * 0.3);
        setMorph("eyeWideRight", c.eyebrowRaise * 0.3);
      }

      // ── SPINE — subtle breathing ──
      const spineInit0 = getInit("spine0");
      if (bones.spine[0] && spineInit0) {
        const armActivity = Math.max(c.rightArmAngle, c.leftArmAngle) * 0.03;
        bones.spine[0].rotation.x = spineInit0.x + armActivity;
      }
      const spineInit1 = getInit("spine1");
      if (bones.spine[1] && spineInit1) {
        bones.spine[1].rotation.x = spineInit1.x + Math.sin(state.clock.elapsedTime * 0.8) * 0.008;
      }
    });

    return (
      <group ref={groupRef} position={[0, -0.95, 0]} scale={1}>
        <primitive object={clonedScene} />
      </group>
    );
  }
);

// ─── Main export ──────────────────────────────────────────
export interface Avatar3DProps {
  pose: AvatarPose | null;
  label?: string;
  useProceduralPose?: boolean;
  onAvatarReady?: (handle: AvatarHandle) => void;
}

export default function Avatar3D({ pose, label, useProceduralPose = true, onAvatarReady }: Avatar3DProps) {
  const activePose = pose || REST_POSE;
  const avatarRef = useRef<AvatarHandle>(null);

  // Notify parent when avatar handle is available
  useEffect(() => {
    if (avatarRef.current && onAvatarReady) {
      onAvatarReady(avatarRef.current);
    }
  }, [onAvatarReady]);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0.15, 2.8], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 4, 4]} intensity={1.4} castShadow />
        <directionalLight position={[-2, 3, 2]} intensity={0.4} color="#88ccff" />
        <pointLight position={[0, 2, 3]} intensity={0.4} color="#ffddaa" />
        <AnimatedAvatarInner
          ref={avatarRef}
          pose={activePose}
          useProceduralPose={useProceduralPose}
        />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
          target={[0, 0.3, 0]}
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

export { REST_POSE };
useGLTF.preload(MODEL_URL);
