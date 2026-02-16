// American Sign Language (ASL) — Accurate handshapes with per-finger articulation
// Professional ASL standards with proper hand shapes, palm orientation, and movement paths

export interface AvatarPose {
  // Right arm
  rightArmAngle: number;      // 0=down, 1=shoulder, 1.5=above head, 1.8=fully raised
  rightArmForward: number;    // 0=by side, 1=fully forward
  rightArmSpread: number;     // lateral spread
  rightForearmBend: number;   // 0=straight, 1=fully bent
  rightHandPose: number;      // legacy: 0=open, 1=fist (fallback when per-finger not set)
  rightWristTilt: number;     // -1 to 1 (flex/extend)
  rightWristRotate?: number;  // palm orientation: -1=prone, 0=neutral, 1=supine

  // Left arm
  leftArmAngle: number;
  leftArmForward: number;
  leftArmSpread: number;
  leftForearmBend: number;
  leftHandPose: number;
  leftWristTilt: number;
  leftWristRotate?: number;

  // Per-finger curl (0=straight, 1=fully curled) — optional, falls back to handPose
  rightThumbCurl?: number;
  rightIndexCurl?: number;
  rightMiddleCurl?: number;
  rightRingCurl?: number;
  rightPinkyCurl?: number;
  rightFingerSpread?: number;  // 0=together, 1=max spread

  leftThumbCurl?: number;
  leftIndexCurl?: number;
  leftMiddleCurl?: number;
  leftRingCurl?: number;
  leftPinkyCurl?: number;
  leftFingerSpread?: number;

  // Head
  headNod: number;
  headTilt: number;
  headTurn: number;

  // Expression
  mouthOpen: number;
  eyebrowRaise: number;
}

const REST_POSE: AvatarPose = {
  rightArmAngle: -0.1, rightArmForward: 0, rightArmSpread: 0,
  rightForearmBend: 0.05, rightHandPose: 0.05, rightWristTilt: 0,
  leftArmAngle: -0.1, leftArmForward: 0, leftArmSpread: 0,
  leftForearmBend: 0.05, leftHandPose: 0.05, leftWristTilt: 0,
  headNod: 0, headTilt: 0, headTurn: 0,
  mouthOpen: 0, eyebrowRaise: 0,
  rightThumbCurl: 0.05, rightIndexCurl: 0.05, rightMiddleCurl: 0.05, rightRingCurl: 0.08, rightPinkyCurl: 0.08,
  rightFingerSpread: 0.05,
  leftThumbCurl: 0.05, leftIndexCurl: 0.05, leftMiddleCurl: 0.05, leftRingCurl: 0.08, leftPinkyCurl: 0.08,
  leftFingerSpread: 0.05,
};

export interface WordSign {
  type: "fingerspell" | "gesture";
  label: string;
  poses: AvatarPose[];
  description: string;
}

// ─── ASL Handshape Presets (right hand finger config) ─────────────────
// Each defines curl values for thumb, index, middle, ring, pinky + spread
type FingerConfig = {
  rightThumbCurl: number; rightIndexCurl: number; rightMiddleCurl: number;
  rightRingCurl: number; rightPinkyCurl: number; rightFingerSpread?: number;
};

const HS: Record<string, FingerConfig> = {
  // A: fist, thumb alongside
  A:      { rightThumbCurl: 0.2, rightIndexCurl: 1, rightMiddleCurl: 1, rightRingCurl: 1, rightPinkyCurl: 1 },
  // B: flat hand, fingers together, thumb tucked
  B:      { rightThumbCurl: 0.9, rightIndexCurl: 0, rightMiddleCurl: 0, rightRingCurl: 0, rightPinkyCurl: 0 },
  // C: curved hand
  C:      { rightThumbCurl: 0.4, rightIndexCurl: 0.45, rightMiddleCurl: 0.45, rightRingCurl: 0.45, rightPinkyCurl: 0.45, rightFingerSpread: 0.3 },
  // D: index up, others curved to thumb
  D:      { rightThumbCurl: 0.5, rightIndexCurl: 0, rightMiddleCurl: 0.85, rightRingCurl: 0.85, rightPinkyCurl: 0.85 },
  // E: fingers curled, thumb across front
  E:      { rightThumbCurl: 0.3, rightIndexCurl: 0.85, rightMiddleCurl: 0.85, rightRingCurl: 0.85, rightPinkyCurl: 0.85 },
  // F: thumb+index circle, 3 fingers up
  F:      { rightThumbCurl: 0.65, rightIndexCurl: 0.65, rightMiddleCurl: 0, rightRingCurl: 0, rightPinkyCurl: 0, rightFingerSpread: 0.3 },
  // G: index+thumb point sideways
  G:      { rightThumbCurl: 0.3, rightIndexCurl: 0, rightMiddleCurl: 1, rightRingCurl: 1, rightPinkyCurl: 1 },
  // H: index+middle sideways
  H:      { rightThumbCurl: 0.5, rightIndexCurl: 0, rightMiddleCurl: 0, rightRingCurl: 1, rightPinkyCurl: 1 },
  // I: fist, pinky extended
  I:      { rightThumbCurl: 0.5, rightIndexCurl: 1, rightMiddleCurl: 1, rightRingCurl: 1, rightPinkyCurl: 0 },
  // K: index+middle up spread, thumb between
  K:      { rightThumbCurl: 0.3, rightIndexCurl: 0, rightMiddleCurl: 0, rightRingCurl: 1, rightPinkyCurl: 1, rightFingerSpread: 0.5 },
  // L: L-shape (thumb+index extended)
  L:      { rightThumbCurl: 0, rightIndexCurl: 0, rightMiddleCurl: 1, rightRingCurl: 1, rightPinkyCurl: 1 },
  // M: fist, 3 fingers over thumb
  M:      { rightThumbCurl: 0.4, rightIndexCurl: 0.95, rightMiddleCurl: 0.95, rightRingCurl: 0.95, rightPinkyCurl: 1 },
  // N: fist, 2 fingers over thumb
  N:      { rightThumbCurl: 0.4, rightIndexCurl: 0.9, rightMiddleCurl: 0.9, rightRingCurl: 1, rightPinkyCurl: 1 },
  // O: all fingertips touch thumb
  O:      { rightThumbCurl: 0.55, rightIndexCurl: 0.55, rightMiddleCurl: 0.55, rightRingCurl: 0.55, rightPinkyCurl: 0.55 },
  // P: K-hand pointing down
  P:      { rightThumbCurl: 0.3, rightIndexCurl: 0, rightMiddleCurl: 0, rightRingCurl: 1, rightPinkyCurl: 1, rightFingerSpread: 0.4 },
  // Q: G-hand pointing down
  Q:      { rightThumbCurl: 0.3, rightIndexCurl: 0, rightMiddleCurl: 1, rightRingCurl: 1, rightPinkyCurl: 1 },
  // R: crossed fingers (index+middle together)
  R:      { rightThumbCurl: 0.5, rightIndexCurl: 0, rightMiddleCurl: 0, rightRingCurl: 1, rightPinkyCurl: 1, rightFingerSpread: 0 },
  // S: fist, thumb across front
  S:      { rightThumbCurl: 0.3, rightIndexCurl: 1, rightMiddleCurl: 1, rightRingCurl: 1, rightPinkyCurl: 1 },
  // T: fist, thumb between index+middle
  T:      { rightThumbCurl: 0.4, rightIndexCurl: 0.95, rightMiddleCurl: 1, rightRingCurl: 1, rightPinkyCurl: 1 },
  // U: index+middle together, up
  U:      { rightThumbCurl: 0.5, rightIndexCurl: 0, rightMiddleCurl: 0, rightRingCurl: 1, rightPinkyCurl: 1, rightFingerSpread: 0 },
  // V: index+middle spread (peace sign)
  V:      { rightThumbCurl: 0.5, rightIndexCurl: 0, rightMiddleCurl: 0, rightRingCurl: 1, rightPinkyCurl: 1, rightFingerSpread: 0.6 },
  // W: 3 fingers spread
  W:      { rightThumbCurl: 0.5, rightIndexCurl: 0, rightMiddleCurl: 0, rightRingCurl: 0, rightPinkyCurl: 1, rightFingerSpread: 0.4 },
  // X: index hooked/bent
  X:      { rightThumbCurl: 0.5, rightIndexCurl: 0.6, rightMiddleCurl: 1, rightRingCurl: 1, rightPinkyCurl: 1 },
  // Y: thumb+pinky extended (hang loose)
  Y:      { rightThumbCurl: 0, rightIndexCurl: 1, rightMiddleCurl: 1, rightRingCurl: 1, rightPinkyCurl: 0, rightFingerSpread: 0.6 },
  // Z: index draws Z shape
  Z:      { rightThumbCurl: 0.5, rightIndexCurl: 0, rightMiddleCurl: 1, rightRingCurl: 1, rightPinkyCurl: 1 },
  // Common composite shapes
  FIVE:   { rightThumbCurl: 0, rightIndexCurl: 0, rightMiddleCurl: 0, rightRingCurl: 0, rightPinkyCurl: 0, rightFingerSpread: 1 },
  FLAT:   { rightThumbCurl: 0.2, rightIndexCurl: 0, rightMiddleCurl: 0, rightRingCurl: 0, rightPinkyCurl: 0, rightFingerSpread: 0 },
  FIST:   { rightThumbCurl: 0.3, rightIndexCurl: 1, rightMiddleCurl: 1, rightRingCurl: 1, rightPinkyCurl: 1 },
  CLAW:   { rightThumbCurl: 0.3, rightIndexCurl: 0.4, rightMiddleCurl: 0.4, rightRingCurl: 0.4, rightPinkyCurl: 0.4, rightFingerSpread: 0.8 },
  FLAT_O: { rightThumbCurl: 0.5, rightIndexCurl: 0.5, rightMiddleCurl: 0.5, rightRingCurl: 0.5, rightPinkyCurl: 0.5 },
  ONE:    { rightThumbCurl: 0.5, rightIndexCurl: 0, rightMiddleCurl: 1, rightRingCurl: 1, rightPinkyCurl: 1 },
};

// Mirror right-hand finger config to left hand
function toLeft(fc: FingerConfig): Partial<AvatarPose> {
  return {
    leftThumbCurl: fc.rightThumbCurl,
    leftIndexCurl: fc.rightIndexCurl,
    leftMiddleCurl: fc.rightMiddleCurl,
    leftRingCurl: fc.rightRingCurl,
    leftPinkyCurl: fc.rightPinkyCurl,
    leftFingerSpread: fc.rightFingerSpread,
  };
}

// Helper: create a letter pose with proper handshape
function letterPose(hs: FingerConfig, extras?: Partial<AvatarPose>): AvatarPose {
  return {
    ...REST_POSE,
    rightArmAngle: 1.0,
    rightArmForward: 0.55,
    rightForearmBend: 0.7,
    rightHandPose: 0,
    rightWristTilt: 0,
    ...hs,
    rightFingerSpread: hs.rightFingerSpread ?? 0,
    ...extras,
  };
}

// ─── ASL Alphabet with accurate handshapes ────────────────────────────
export const ASL_ALPHABET: Record<string, AvatarPose> = {
  a: letterPose(HS.A),
  b: letterPose(HS.B, { rightWristTilt: 0.1 }),
  c: letterPose(HS.C),
  d: letterPose(HS.D, { rightWristTilt: 0.1 }),
  e: letterPose(HS.E),
  f: letterPose(HS.F, { rightWristTilt: 0.1 }),
  g: letterPose(HS.G, { rightArmForward: 0.75, rightForearmBend: 0.4, rightWristRotate: 0.3 }),
  h: letterPose(HS.H, { rightArmForward: 0.75, rightForearmBend: 0.4, rightWristRotate: 0.3 }),
  i: letterPose(HS.I, { rightWristTilt: -0.1 }),
  j: letterPose(HS.I, { rightWristTilt: -0.3, rightWristRotate: -0.4 }),
  k: letterPose(HS.K, { rightWristTilt: 0.15 }),
  l: letterPose(HS.L),
  m: letterPose(HS.M, { rightWristTilt: -0.15, rightWristRotate: -0.3 }),
  n: letterPose(HS.N, { rightWristTilt: -0.1, rightWristRotate: -0.3 }),
  o: letterPose(HS.O),
  p: letterPose(HS.P, { rightArmAngle: 0.7, rightWristTilt: -0.4, rightWristRotate: -0.3 }),
  q: letterPose(HS.Q, { rightArmAngle: 0.6, rightWristTilt: -0.5, rightWristRotate: -0.3 }),
  r: letterPose(HS.R, { rightWristTilt: 0.1 }),
  s: letterPose(HS.S),
  t: letterPose(HS.T),
  u: letterPose(HS.U),
  v: letterPose(HS.V, { rightWristTilt: 0.1 }),
  w: letterPose(HS.W),
  x: letterPose(HS.X),
  y: letterPose(HS.Y, { rightWristTilt: -0.2 }),
  z: letterPose(HS.Z, { rightWristTilt: 0.2 }),
};

// ─── ASL Common Word Signs ────────────────────────────────────────────
export const COMMON_WORDS: Record<string, WordSign> = {

  // ═══ GREETINGS ═══
  hello: {
    type: "gesture", label: "HELLO",
    description: "Open hand at forehead, moves outward like a salute",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.35, rightArmForward: 0.2, rightArmSpread: 0.15, rightForearmBend: 0.7,
        ...HS.B, rightWristTilt: 0.1, eyebrowRaise: 0.4, mouthOpen: 0.15 },
      { ...REST_POSE, rightArmAngle: 1.35, rightArmForward: 0.5, rightArmSpread: 0.35, rightForearmBend: 0.35,
        ...HS.B, rightWristTilt: 0.1, eyebrowRaise: 0.3 },
    ],
  },
  hi: {
    type: "gesture", label: "HI",
    description: "Open hand raised, small wave side to side",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.45, rightArmForward: 0.3, rightForearmBend: 0.3, rightArmSpread: 0.2,
        ...HS.FIVE, eyebrowRaise: 0.5, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 1.45, rightArmForward: 0.3, rightForearmBend: 0.3, rightArmSpread: -0.2,
        ...HS.FIVE, eyebrowRaise: 0.4 },
      { ...REST_POSE, rightArmAngle: 1.45, rightArmForward: 0.3, rightForearmBend: 0.3, rightArmSpread: 0.2,
        ...HS.FIVE, eyebrowRaise: 0.5 },
    ],
  },
  goodbye: {
    type: "gesture", label: "GOODBYE",
    description: "Open hand raised, fingers bend open and closed",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.45, rightArmForward: 0.4, rightForearmBend: 0.3,
        ...HS.FIVE, eyebrowRaise: 0.3, mouthOpen: 0.15 },
      { ...REST_POSE, rightArmAngle: 1.45, rightArmForward: 0.4, rightForearmBend: 0.3,
        ...HS.FLAT_O },
      { ...REST_POSE, rightArmAngle: 1.45, rightArmForward: 0.4, rightForearmBend: 0.3,
        ...HS.FIVE },
    ],
  },
  bye: {
    type: "gesture", label: "BYE",
    description: "Open hand waves",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.45, rightArmForward: 0.4, rightForearmBend: 0.3, rightArmSpread: 0.2,
        ...HS.FIVE },
      { ...REST_POSE, rightArmAngle: 1.45, rightArmForward: 0.4, rightForearmBend: 0.3, rightArmSpread: -0.2,
        ...HS.FIVE },
      { ...REST_POSE, rightArmAngle: 1.45, rightArmForward: 0.4, rightForearmBend: 0.3, rightArmSpread: 0.2,
        ...HS.FIVE },
    ],
  },

  // ═══ COURTESY ═══
  thank: {
    type: "gesture", label: "THANK YOU",
    description: "Flat hand touches chin, then moves forward and down",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.15, rightArmForward: 0.2, rightForearmBend: 0.9,
        ...HS.FLAT, headNod: 0.2, mouthOpen: 0.15 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.7, rightForearmBend: 0.3,
        ...HS.FLAT, headNod: -0.1 },
    ],
  },
  thanks: {
    type: "gesture", label: "THANK YOU",
    description: "Flat hand from chin forward",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.15, rightArmForward: 0.2, rightForearmBend: 0.9,
        ...HS.FLAT, headNod: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.7, rightForearmBend: 0.3,
        ...HS.FLAT, headNod: -0.1 },
    ],
  },
  please: {
    type: "gesture", label: "PLEASE",
    description: "Flat hand circles on chest",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.25, rightForearmBend: 0.7,
        ...HS.FLAT, headNod: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.55, rightArmForward: 0.2, rightArmSpread: 0.15, rightForearmBend: 0.7,
        ...HS.FLAT },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.25, rightForearmBend: 0.7,
        ...HS.FLAT },
    ],
  },
  sorry: {
    type: "gesture", label: "SORRY",
    description: "A-hand circles on chest",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.25, rightForearmBend: 0.7,
        ...HS.A, headNod: -0.2, eyebrowRaise: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.55, rightArmForward: 0.2, rightArmSpread: 0.15, rightForearmBend: 0.7,
        ...HS.A, headNod: -0.3 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.25, rightForearmBend: 0.7,
        ...HS.A, headNod: -0.2 },
    ],
  },

  // ═══ BASIC RESPONSES ═══
  yes: {
    type: "gesture", label: "YES",
    description: "S-hand nods up and down like nodding head",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.5, rightForearmBend: 0.6,
        ...HS.S, rightWristTilt: 0.3, headNod: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.5, rightForearmBend: 0.6,
        ...HS.S, rightWristTilt: -0.3, headNod: -0.1 },
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.5, rightForearmBend: 0.6,
        ...HS.S, rightWristTilt: 0.3, headNod: 0.3 },
    ],
  },
  no: {
    type: "gesture", label: "NO",
    description: "Index and middle finger snap to thumb",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.5,
        rightThumbCurl: 0.3, rightIndexCurl: 0, rightMiddleCurl: 0, rightRingCurl: 1, rightPinkyCurl: 1,
        rightFingerSpread: 0.3, headTurn: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.5,
        rightThumbCurl: 0.6, rightIndexCurl: 0.6, rightMiddleCurl: 0.6, rightRingCurl: 1, rightPinkyCurl: 1,
        rightFingerSpread: 0, headTurn: -0.1 },
    ],
  },
  ok: {
    type: "gesture", label: "OK",
    description: "Fingerspell O-K",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.6, rightForearmBend: 0.6,
        ...HS.O, headNod: 0.2, eyebrowRaise: 0.3 },
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.6, rightForearmBend: 0.6,
        ...HS.K, headNod: 0.1 },
    ],
  },
  good: {
    type: "gesture", label: "GOOD",
    description: "Flat hand touches chin, then drops into other palm",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.15, rightArmForward: 0.2, rightForearmBend: 0.9,
        ...HS.FLAT, mouthOpen: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.6, rightForearmBend: 0.4,
        ...HS.FLAT,
        leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.3, ...toLeft(HS.FLAT),
        eyebrowRaise: 0.3, mouthOpen: 0.2 },
    ],
  },
  bad: {
    type: "gesture", label: "BAD",
    description: "Flat hand touches chin then flips palm down",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.15, rightArmForward: 0.2, rightForearmBend: 0.9,
        ...HS.FLAT },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.6, rightForearmBend: 0.4,
        ...HS.FLAT, rightWristTilt: -0.6, rightWristRotate: -0.5, headNod: -0.2 },
    ],
  },

  // ═══ PRONOUNS ═══
  i: {
    type: "gesture", label: "I / ME",
    description: "Index finger points to own chest",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.2, rightForearmBend: 0.8,
        ...HS.ONE, rightWristTilt: 0.4 },
    ],
  },
  me: {
    type: "gesture", label: "ME",
    description: "Index finger points to chest",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.2, rightForearmBend: 0.8,
        ...HS.ONE, rightWristTilt: 0.4, headNod: 0.1 },
    ],
  },
  you: {
    type: "gesture", label: "YOU",
    description: "Index finger points forward at the person",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.8, rightForearmBend: 0.2,
        ...HS.ONE },
    ],
  },
  my: {
    type: "gesture", label: "MY",
    description: "Flat hand placed on chest",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.2, rightForearmBend: 0.7,
        ...HS.FLAT },
    ],
  },
  your: {
    type: "gesture", label: "YOUR",
    description: "Flat hand pushes palm-forward toward the person",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.7, rightForearmBend: 0.2,
        ...HS.FLAT, eyebrowRaise: 0.2 },
    ],
  },
  we: {
    type: "gesture", label: "WE",
    description: "Index finger arcs from self to side",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.55, rightArmForward: 0.3, rightArmSpread: -0.2, rightForearmBend: 0.6,
        ...HS.ONE },
      { ...REST_POSE, rightArmAngle: 0.55, rightArmForward: 0.3, rightArmSpread: 0.3, rightForearmBend: 0.6,
        ...HS.ONE },
    ],
  },
  they: {
    type: "gesture", label: "THEY",
    description: "Index finger sweeps outward to the side",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.6, rightArmSpread: -0.2, rightForearmBend: 0.3,
        ...HS.ONE },
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.6, rightArmSpread: 0.4, rightForearmBend: 0.3,
        ...HS.ONE },
    ],
  },
  he: {
    type: "gesture", label: "HE",
    description: "Point to the side (male reference)",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.6, rightArmSpread: 0.3, rightForearmBend: 0.2,
        ...HS.ONE },
    ],
  },
  she: {
    type: "gesture", label: "SHE",
    description: "Point to the side (female reference)",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.6, rightArmSpread: 0.3, rightForearmBend: 0.2,
        ...HS.ONE },
    ],
  },

  // ═══ QUESTION WORDS ═══
  what: {
    type: "gesture", label: "WHAT",
    description: "Both palms up, hands shake slightly — questioning face",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.5, rightArmSpread: 0.3, rightForearmBend: 0.5,
        ...HS.FIVE, rightWristRotate: 0.5,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftArmSpread: -0.3, leftForearmBend: 0.5,
        ...toLeft(HS.FIVE), leftWristRotate: 0.5,
        eyebrowRaise: 0.8, headTilt: 0.15 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightArmSpread: 0.4, rightForearmBend: 0.4,
        ...HS.FIVE, rightWristRotate: 0.5,
        leftArmAngle: 0.8, leftArmForward: 0.5, leftArmSpread: -0.4, leftForearmBend: 0.4,
        ...toLeft(HS.FIVE), leftWristRotate: 0.5,
        eyebrowRaise: 0.9, headTilt: -0.1 },
    ],
  },
  where: {
    type: "gesture", label: "WHERE",
    description: "Index finger wags side to side, furrowed brow",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.5, rightForearmBend: 0.5, rightArmSpread: -0.3,
        ...HS.ONE, eyebrowRaise: 0.7 },
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.5, rightForearmBend: 0.5, rightArmSpread: 0.3,
        ...HS.ONE, eyebrowRaise: 0.7 },
    ],
  },
  how: {
    type: "gesture", label: "HOW",
    description: "Both fists knuckles together, roll outward and open",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.5, rightForearmBend: 0.7,
        ...HS.FIST,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftForearmBend: 0.7,
        ...toLeft(HS.FIST), eyebrowRaise: 0.6 },
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.6, rightForearmBend: 0.4,
        ...HS.FIVE, rightWristTilt: -0.3, rightWristRotate: 0.5,
        leftArmAngle: 0.85, leftArmForward: 0.6, leftForearmBend: 0.4,
        ...toLeft(HS.FIVE), leftWristTilt: 0.3, leftWristRotate: 0.5,
        eyebrowRaise: 0.8 },
    ],
  },
  who: {
    type: "gesture", label: "WHO",
    description: "Index finger circles near lips, mouth purses",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.05, rightArmForward: 0.2, rightForearmBend: 0.9,
        ...HS.ONE, mouthOpen: 0.3, eyebrowRaise: 0.7 },
      { ...REST_POSE, rightArmAngle: 1.05, rightArmForward: 0.2, rightArmSpread: 0.1, rightForearmBend: 0.85,
        ...HS.ONE, mouthOpen: 0.4, eyebrowRaise: 0.7 },
    ],
  },
  when: {
    type: "gesture", label: "WHEN",
    description: "Index circles then lands on other index",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.5, rightForearmBend: 0.6,
        ...HS.ONE,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftForearmBend: 0.5,
        ...toLeft(HS.ONE), eyebrowRaise: 0.6 },
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.5, rightForearmBend: 0.7,
        ...HS.ONE,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftForearmBend: 0.5,
        ...toLeft(HS.ONE), eyebrowRaise: 0.7 },
    ],
  },
  why: {
    type: "gesture", label: "WHY",
    description: "Touch forehead with fingers, then pull away into Y-hand",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.15, rightArmForward: 0.2, rightForearmBend: 0.9,
        ...HS.FLAT, eyebrowRaise: 0.7 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.5,
        ...HS.Y, rightWristTilt: -0.3, eyebrowRaise: 0.9 },
    ],
  },

  // ═══ EMOTIONS ═══
  happy: {
    type: "gesture", label: "HAPPY",
    description: "Both flat hands brush upward on chest repeatedly",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.35, rightArmForward: 0.25, rightForearmBend: 0.6,
        ...HS.FLAT,
        leftArmAngle: 0.35, leftArmForward: 0.25, leftForearmBend: 0.6,
        ...toLeft(HS.FLAT), eyebrowRaise: 0.5 },
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.25, rightForearmBend: 0.5,
        ...HS.FLAT,
        leftArmAngle: 0.75, leftArmForward: 0.25, leftForearmBend: 0.5,
        ...toLeft(HS.FLAT), eyebrowRaise: 0.8, mouthOpen: 0.4 },
      { ...REST_POSE, rightArmAngle: 0.35, rightArmForward: 0.25, rightForearmBend: 0.6,
        ...HS.FLAT,
        leftArmAngle: 0.35, leftArmForward: 0.25, leftForearmBend: 0.6,
        ...toLeft(HS.FLAT), eyebrowRaise: 0.6 },
    ],
  },
  sad: {
    type: "gesture", label: "SAD",
    description: "Both open hands slide down from face",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.15, rightArmForward: 0.3, rightForearmBend: 0.8,
        ...HS.FIVE,
        leftArmAngle: 1.15, leftArmForward: 0.3, leftForearmBend: 0.8,
        ...toLeft(HS.FIVE), headNod: -0.1 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.3, rightForearmBend: 0.5,
        ...HS.FIVE,
        leftArmAngle: 0.5, leftArmForward: 0.3, leftForearmBend: 0.5,
        ...toLeft(HS.FIVE), headNod: -0.4, mouthOpen: 0.2 },
    ],
  },
  angry: {
    type: "gesture", label: "ANGRY",
    description: "Claw hands at face pull outward, fierce expression",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.15, rightArmForward: 0.3, rightForearmBend: 0.8,
        ...HS.CLAW,
        leftArmAngle: 1.15, leftArmForward: 0.3, leftForearmBend: 0.8,
        ...toLeft(HS.CLAW), eyebrowRaise: 0.9, mouthOpen: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.6, rightForearmBend: 0.5,
        ...HS.CLAW,
        leftArmAngle: 0.8, leftArmForward: 0.6, leftForearmBend: 0.5,
        ...toLeft(HS.CLAW), eyebrowRaise: 1.0 },
    ],
  },
  love: {
    type: "gesture", label: "LOVE",
    description: "Both fists cross over chest (hug yourself)",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.3, rightArmSpread: 0.3, rightForearmBend: 0.5,
        ...HS.FIST,
        leftArmAngle: 0.6, leftArmForward: 0.3, leftArmSpread: -0.3, leftForearmBend: 0.5,
        ...toLeft(HS.FIST) },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.2, rightArmSpread: -0.1, rightForearmBend: 0.9,
        ...HS.FIST,
        leftArmAngle: 0.5, leftArmForward: 0.2, leftArmSpread: 0.1, leftForearmBend: 0.9,
        ...toLeft(HS.FIST), headNod: 0.2, mouthOpen: 0.2 },
    ],
  },
  scared: {
    type: "gesture", label: "SCARED",
    description: "Both hands rise defensively, fingers spread, wide eyes",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.3, rightForearmBend: 0.6,
        ...HS.FIST,
        leftArmAngle: 0.6, leftArmForward: 0.3, leftForearmBend: 0.6,
        ...toLeft(HS.FIST) },
      { ...REST_POSE, rightArmAngle: 1.25, rightArmForward: 0.5, rightArmSpread: 0.3, rightForearmBend: 0.4,
        ...HS.FIVE,
        leftArmAngle: 1.25, leftArmForward: 0.5, leftArmSpread: -0.3, leftForearmBend: 0.4,
        ...toLeft(HS.FIVE), eyebrowRaise: 1.0, mouthOpen: 0.6 },
    ],
  },
  tired: {
    type: "gesture", label: "TIRED",
    description: "Bent hands on chest, drop and rotate down",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.55, rightArmForward: 0.25, rightForearmBend: 0.6,
        ...HS.CLAW,
        leftArmAngle: 0.55, leftArmForward: 0.25, leftForearmBend: 0.6,
        ...toLeft(HS.CLAW), headNod: -0.1 },
      { ...REST_POSE, rightArmAngle: 0.3, rightArmForward: 0.25, rightForearmBend: 0.5,
        ...HS.CLAW,
        leftArmAngle: 0.3, leftArmForward: 0.25, leftForearmBend: 0.5,
        ...toLeft(HS.CLAW), headNod: -0.4 },
    ],
  },
  hungry: {
    type: "gesture", label: "HUNGRY",
    description: "C-hand moves down from throat toward stomach",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.2, rightForearmBend: 0.8,
        ...HS.C, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.35, rightArmForward: 0.2, rightForearmBend: 0.5,
        ...HS.C },
    ],
  },
  surprised: {
    type: "gesture", label: "SURPRISED",
    description: "Both fists near eyes flick open, wide eyes",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.15, rightArmForward: 0.3, rightForearmBend: 0.7,
        ...HS.S,
        leftArmAngle: 1.15, leftArmForward: 0.3, leftForearmBend: 0.7,
        ...toLeft(HS.S) },
      { ...REST_POSE, rightArmAngle: 1.15, rightArmForward: 0.4, rightForearmBend: 0.6,
        ...HS.FIVE,
        leftArmAngle: 1.15, leftArmForward: 0.4, leftForearmBend: 0.6,
        ...toLeft(HS.FIVE), eyebrowRaise: 1.0, mouthOpen: 0.7 },
    ],
  },
  excited: {
    type: "gesture", label: "EXCITED",
    description: "Both open hands alternately brush up on chest",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.25, rightForearmBend: 0.6,
        ...HS.FIVE,
        leftArmAngle: 0.65, leftArmForward: 0.25, leftForearmBend: 0.5,
        ...toLeft(HS.FIVE), eyebrowRaise: 0.7, mouthOpen: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.65, rightArmForward: 0.25, rightForearmBend: 0.5,
        ...HS.FIVE,
        leftArmAngle: 0.4, leftArmForward: 0.25, leftForearmBend: 0.6,
        ...toLeft(HS.FIVE), eyebrowRaise: 0.9, mouthOpen: 0.5 },
    ],
  },

  // ═══ NUMBERS 1–10 (ASL) ═══
  one: {
    type: "gesture", label: "1",
    description: "Index finger raised, palm forward",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.55, rightForearmBend: 0.6,
        ...HS.ONE },
    ],
  },
  two: {
    type: "gesture", label: "2",
    description: "Index and middle fingers raised (V), palm forward",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.55, rightForearmBend: 0.6,
        ...HS.V },
    ],
  },
  three: {
    type: "gesture", label: "3",
    description: "Thumb, index, and middle extended",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.55, rightForearmBend: 0.6,
        rightThumbCurl: 0, rightIndexCurl: 0, rightMiddleCurl: 0, rightRingCurl: 1, rightPinkyCurl: 1,
        rightFingerSpread: 0.4 },
    ],
  },
  four: {
    type: "gesture", label: "4",
    description: "Four fingers up, thumb tucked across palm",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.55, rightForearmBend: 0.6,
        rightThumbCurl: 0.8, rightIndexCurl: 0, rightMiddleCurl: 0, rightRingCurl: 0, rightPinkyCurl: 0,
        rightFingerSpread: 0.3 },
    ],
  },
  five: {
    type: "gesture", label: "5",
    description: "All five fingers spread open, palm forward",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.55, rightForearmBend: 0.6,
        ...HS.FIVE },
    ],
  },
  six: {
    type: "gesture", label: "6",
    description: "Thumb touches pinky, other three fingers up",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.55, rightForearmBend: 0.6,
        rightThumbCurl: 0.6, rightIndexCurl: 0, rightMiddleCurl: 0, rightRingCurl: 0, rightPinkyCurl: 0.6,
        rightFingerSpread: 0.3 },
    ],
  },
  seven: {
    type: "gesture", label: "7",
    description: "Thumb touches ring finger, other three up",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.55, rightForearmBend: 0.6,
        rightThumbCurl: 0.6, rightIndexCurl: 0, rightMiddleCurl: 0, rightRingCurl: 0.6, rightPinkyCurl: 0,
        rightFingerSpread: 0.3 },
    ],
  },
  eight: {
    type: "gesture", label: "8",
    description: "Thumb touches middle finger, others extended",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.55, rightForearmBend: 0.6,
        rightThumbCurl: 0.6, rightIndexCurl: 0, rightMiddleCurl: 0.6, rightRingCurl: 0, rightPinkyCurl: 0,
        rightFingerSpread: 0.3 },
    ],
  },
  nine: {
    type: "gesture", label: "9",
    description: "Thumb touches index, other three up",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.55, rightForearmBend: 0.6,
        ...HS.F },
    ],
  },
  ten: {
    type: "gesture", label: "10",
    description: "A-hand with thumb up shakes/twists",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.55, rightForearmBend: 0.6,
        ...HS.A, rightWristRotate: -0.3 },
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.55, rightForearmBend: 0.6,
        ...HS.A, rightWristRotate: 0.3 },
    ],
  },

  // ═══ COLORS ═══
  red: {
    type: "gesture", label: "RED",
    description: "Index finger strokes down from lips",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.15, rightArmForward: 0.2, rightForearmBend: 0.9,
        ...HS.ONE, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.2, rightForearmBend: 0.7,
        ...HS.ONE },
    ],
  },
  blue: {
    type: "gesture", label: "BLUE",
    description: "B-hand twists at wrist in front of body",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.5,
        ...HS.B, rightWristRotate: -0.4 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.5,
        ...HS.B, rightWristRotate: 0.4 },
    ],
  },
  green: {
    type: "gesture", label: "GREEN",
    description: "G-hand shakes/twists in front of body",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.6, rightForearmBend: 0.5,
        ...HS.G, rightWristRotate: -0.4 },
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.6, rightForearmBend: 0.5,
        ...HS.G, rightWristRotate: 0.4 },
    ],
  },
  yellow: {
    type: "gesture", label: "YELLOW",
    description: "Y-hand shakes at side",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.5, rightArmSpread: 0.2, rightForearmBend: 0.5,
        ...HS.Y, rightWristRotate: -0.4 },
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.5, rightArmSpread: 0.3, rightForearmBend: 0.5,
        ...HS.Y, rightWristRotate: 0.4 },
    ],
  },
  white: {
    type: "gesture", label: "WHITE",
    description: "Open 5-hand on chest pulls away closing to flat O",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.25, rightForearmBend: 0.7,
        ...HS.FIVE },
      { ...REST_POSE, rightArmAngle: 0.65, rightArmForward: 0.5, rightForearmBend: 0.5,
        ...HS.FLAT_O },
    ],
  },
  black: {
    type: "gesture", label: "BLACK",
    description: "Index finger draws across forehead",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.15, rightArmForward: 0.2, rightArmSpread: -0.2, rightForearmBend: 0.9,
        ...HS.ONE },
      { ...REST_POSE, rightArmAngle: 1.15, rightArmForward: 0.2, rightArmSpread: 0.3, rightForearmBend: 0.9,
        ...HS.ONE },
    ],
  },
  orange: {
    type: "gesture", label: "ORANGE",
    description: "C-hand squeezes near chin (like squeezing an orange)",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.95, rightArmForward: 0.25, rightForearmBend: 0.8,
        ...HS.C },
      { ...REST_POSE, rightArmAngle: 0.95, rightArmForward: 0.25, rightForearmBend: 0.8,
        ...HS.S },
      { ...REST_POSE, rightArmAngle: 0.95, rightArmForward: 0.25, rightForearmBend: 0.8,
        ...HS.C },
    ],
  },
  pink: {
    type: "gesture", label: "PINK",
    description: "P-hand middle finger brushes down chin",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.05, rightArmForward: 0.2, rightForearmBend: 0.85,
        ...HS.P, mouthOpen: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.2, rightForearmBend: 0.7,
        ...HS.P },
    ],
  },
  purple: {
    type: "gesture", label: "PURPLE",
    description: "P-hand shakes/twists in front of body",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.5, rightForearmBend: 0.5,
        ...HS.P, rightWristRotate: -0.4 },
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.5, rightForearmBend: 0.5,
        ...HS.P, rightWristRotate: 0.4 },
    ],
  },
  brown: {
    type: "gesture", label: "BROWN",
    description: "B-hand slides down the cheek",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.05, rightArmForward: 0.2, rightArmSpread: 0.2, rightForearmBend: 0.8,
        ...HS.B },
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.2, rightArmSpread: 0.2, rightForearmBend: 0.7,
        ...HS.B },
    ],
  },

  // ═══ COMMON ACTIONS ═══
  help: {
    type: "gesture", label: "HELP",
    description: "Fist on flat palm, both lift upward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.55, rightArmForward: 0.5, rightForearmBend: 0.5,
        ...HS.A,
        leftArmAngle: 0.55, leftArmForward: 0.5, leftForearmBend: 0.3,
        ...toLeft(HS.FLAT), eyebrowRaise: 0.4 },
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.5, rightForearmBend: 0.4,
        ...HS.A,
        leftArmAngle: 0.95, leftArmForward: 0.5, leftForearmBend: 0.3,
        ...toLeft(HS.FLAT), eyebrowRaise: 0.6 },
    ],
  },
  stop: {
    type: "gesture", label: "STOP",
    description: "Flat hand chops down onto other flat palm",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.2, rightArmForward: 0.4, rightForearmBend: 0.3,
        ...HS.FLAT,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftForearmBend: 0.3,
        ...toLeft(HS.FLAT), eyebrowRaise: 0.4 },
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.5, rightForearmBend: 0.5,
        ...HS.FLAT,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftForearmBend: 0.3,
        ...toLeft(HS.FLAT), mouthOpen: 0.3 },
    ],
  },
  eat: {
    type: "gesture", label: "EAT",
    description: "Flat O-hand taps mouth repeatedly",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.2, rightForearmBend: 0.8,
        ...HS.FLAT_O, mouthOpen: 0.3 },
      { ...REST_POSE, rightArmAngle: 1.05, rightArmForward: 0.15, rightForearmBend: 0.95,
        ...HS.FLAT_O, mouthOpen: 0.5 },
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.2, rightForearmBend: 0.8,
        ...HS.FLAT_O, mouthOpen: 0.3 },
    ],
  },
  drink: {
    type: "gesture", label: "DRINK",
    description: "C-hand tilts toward mouth (like holding a cup)",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.3, rightForearmBend: 0.7,
        ...HS.C },
      { ...REST_POSE, rightArmAngle: 1.05, rightArmForward: 0.2, rightForearmBend: 0.9,
        ...HS.C, rightWristTilt: 0.5, mouthOpen: 0.4 },
    ],
  },
  water: {
    type: "gesture", label: "WATER",
    description: "W-hand (3 fingers) taps chin twice",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.05, rightArmForward: 0.2, rightForearmBend: 0.9,
        ...HS.W },
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.15, rightForearmBend: 0.95,
        ...HS.W, mouthOpen: 0.1 },
      { ...REST_POSE, rightArmAngle: 1.05, rightArmForward: 0.2, rightForearmBend: 0.9,
        ...HS.W },
    ],
  },
  go: {
    type: "gesture", label: "GO",
    description: "Both index fingers point forward and move away",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.4, rightForearmBend: 0.5,
        ...HS.ONE,
        leftArmAngle: 0.75, leftArmForward: 0.4, leftForearmBend: 0.5,
        ...toLeft(HS.ONE) },
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.8, rightForearmBend: 0.2,
        ...HS.ONE,
        leftArmAngle: 0.85, leftArmForward: 0.8, leftForearmBend: 0.2,
        ...toLeft(HS.ONE) },
    ],
  },
  come: {
    type: "gesture", label: "COME",
    description: "Index finger beckons inward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.7, rightForearmBend: 0.3,
        ...HS.ONE },
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.3, rightForearmBend: 0.7,
        ...HS.X },
    ],
  },
  want: {
    type: "gesture", label: "WANT",
    description: "Both claw hands pull toward body",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.7, rightForearmBend: 0.4,
        ...HS.CLAW,
        leftArmAngle: 0.85, leftArmForward: 0.7, leftForearmBend: 0.4,
        ...toLeft(HS.CLAW) },
      { ...REST_POSE, rightArmAngle: 0.65, rightArmForward: 0.3, rightForearmBend: 0.7,
        ...HS.CLAW,
        leftArmAngle: 0.65, leftArmForward: 0.3, leftForearmBend: 0.7,
        ...toLeft(HS.CLAW) },
    ],
  },
  need: {
    type: "gesture", label: "NEED",
    description: "X-hand (hooked index) bends downward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.5, rightForearmBend: 0.5,
        ...HS.X },
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.5, rightForearmBend: 0.6,
        ...HS.X, rightWristTilt: -0.4 },
    ],
  },
  can: {
    type: "gesture", label: "CAN",
    description: "Both S-hands move down firmly",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.5, rightForearmBend: 0.5,
        ...HS.S,
        leftArmAngle: 0.85, leftArmForward: 0.5, leftForearmBend: 0.5,
        ...toLeft(HS.S), headNod: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.55, rightArmForward: 0.5, rightForearmBend: 0.5,
        ...HS.S,
        leftArmAngle: 0.55, leftArmForward: 0.5, leftForearmBend: 0.5,
        ...toLeft(HS.S), headNod: -0.1 },
    ],
  },
  think: {
    type: "gesture", label: "THINK",
    description: "Index finger touches side of forehead",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.2, rightArmForward: 0.2, rightArmSpread: 0.2, rightForearmBend: 0.9,
        ...HS.ONE, eyebrowRaise: 0.4 },
    ],
  },
  know: {
    type: "gesture", label: "KNOW",
    description: "Fingertips tap side of forehead",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.2, rightArmForward: 0.2, rightArmSpread: 0.15, rightForearmBend: 0.9,
        ...HS.FLAT, headNod: 0.1 },
      { ...REST_POSE, rightArmAngle: 1.25, rightArmForward: 0.15, rightArmSpread: 0.15, rightForearmBend: 0.95,
        ...HS.FLAT, headNod: 0.2 },
    ],
  },
  understand: {
    type: "gesture", label: "UNDERSTAND",
    description: "Index flicks up near forehead (light bulb moment)",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.2, rightArmForward: 0.2, rightArmSpread: 0.15, rightForearmBend: 0.9,
        ...HS.S, headNod: -0.1 },
      { ...REST_POSE, rightArmAngle: 1.25, rightArmForward: 0.2, rightArmSpread: 0.15, rightForearmBend: 0.85,
        ...HS.ONE, headNod: 0.2, eyebrowRaise: 0.6 },
    ],
  },
  see: {
    type: "gesture", label: "SEE",
    description: "V-hand points from eyes outward",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.15, rightArmForward: 0.3, rightForearmBend: 0.85,
        ...HS.V },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.7, rightForearmBend: 0.4,
        ...HS.V },
    ],
  },
  hear: {
    type: "gesture", label: "HEAR",
    description: "Index finger points to ear",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.15, rightArmForward: 0.1, rightArmSpread: 0.4, rightForearmBend: 0.8,
        ...HS.ONE, headTilt: 0.15 },
    ],
  },
  speak: {
    type: "gesture", label: "SPEAK",
    description: "Four fingers tap out from chin repeatedly",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.05, rightArmForward: 0.2, rightForearmBend: 0.85,
        rightThumbCurl: 0.8, rightIndexCurl: 0, rightMiddleCurl: 0, rightRingCurl: 0, rightPinkyCurl: 0,
        mouthOpen: 0.4 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.6,
        rightThumbCurl: 0.8, rightIndexCurl: 0, rightMiddleCurl: 0, rightRingCurl: 0, rightPinkyCurl: 0,
        mouthOpen: 0.5 },
      { ...REST_POSE, rightArmAngle: 1.05, rightArmForward: 0.2, rightForearmBend: 0.85,
        rightThumbCurl: 0.8, rightIndexCurl: 0, rightMiddleCurl: 0, rightRingCurl: 0, rightPinkyCurl: 0,
        mouthOpen: 0.4 },
    ],
  },
  wait: {
    type: "gesture", label: "WAIT",
    description: "Both 5-hands up, palms facing in, fingers wiggle",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.5,
        ...HS.FIVE,
        leftArmAngle: 0.9, leftArmForward: 0.5, leftForearmBend: 0.5,
        ...toLeft(HS.FIVE) },
    ],
  },
  sleep: {
    type: "gesture", label: "SLEEP",
    description: "Open hand slides down face, eyes close",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.15, rightArmForward: 0.2, rightForearmBend: 0.85,
        ...HS.FIVE, eyebrowRaise: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.2, rightForearmBend: 0.7,
        ...HS.FLAT_O, headTilt: 0.3, headNod: -0.2 },
    ],
  },
  walk: {
    type: "gesture", label: "WALK",
    description: "Two flat hands alternate forward (walking feet)",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.6, rightForearmBend: 0.3,
        ...HS.FLAT, rightWristRotate: -0.5,
        leftArmAngle: 0.65, leftArmForward: 0.4, leftForearmBend: 0.3,
        ...toLeft(HS.FLAT), leftWristRotate: -0.5 },
      { ...REST_POSE, rightArmAngle: 0.65, rightArmForward: 0.4, rightForearmBend: 0.3,
        ...HS.FLAT, rightWristRotate: -0.5,
        leftArmAngle: 0.75, leftArmForward: 0.6, leftForearmBend: 0.3,
        ...toLeft(HS.FLAT), leftWristRotate: -0.5 },
    ],
  },
  work: {
    type: "gesture", label: "WORK",
    description: "Dominant S-hand taps on non-dominant S-hand",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.4, rightForearmBend: 0.5,
        ...HS.S,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftForearmBend: 0.4,
        ...toLeft(HS.S) },
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.5, rightForearmBend: 0.6,
        ...HS.S,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftForearmBend: 0.4,
        ...toLeft(HS.S) },
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.4, rightForearmBend: 0.5,
        ...HS.S,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftForearmBend: 0.4,
        ...toLeft(HS.S) },
    ],
  },

  // ═══ FAMILY ═══
  family: {
    type: "gesture", label: "FAMILY",
    description: "Both F-hands circle outward to form a circle",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.5, rightForearmBend: 0.5,
        ...HS.F,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftForearmBend: 0.5,
        ...toLeft(HS.F) },
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.5, rightArmSpread: 0.4, rightForearmBend: 0.4,
        ...HS.F,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftArmSpread: -0.4, leftForearmBend: 0.4,
        ...toLeft(HS.F) },
    ],
  },
  mother: {
    type: "gesture", label: "MOTHER",
    description: "Open 5-hand, thumb taps chin",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.05, rightArmForward: 0.2, rightForearmBend: 0.85,
        ...HS.FIVE },
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.15, rightForearmBend: 0.9,
        ...HS.FIVE, mouthOpen: 0.1 },
    ],
  },
  father: {
    type: "gesture", label: "FATHER",
    description: "Open 5-hand, thumb taps forehead",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.2, rightArmForward: 0.2, rightForearmBend: 0.9,
        ...HS.FIVE },
      { ...REST_POSE, rightArmAngle: 1.25, rightArmForward: 0.15, rightForearmBend: 0.95,
        ...HS.FIVE },
    ],
  },
  friend: {
    type: "gesture", label: "FRIEND",
    description: "Both index fingers hook together and swap",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.5, rightForearmBend: 0.5,
        ...HS.X,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftForearmBend: 0.5,
        ...toLeft(HS.X) },
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.5, rightForearmBend: 0.6,
        ...HS.X,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftForearmBend: 0.4,
        ...toLeft(HS.X), mouthOpen: 0.2 },
    ],
  },

  // ═══ TIME ═══
  morning: {
    type: "gesture", label: "MORNING",
    description: "Flat hand rises from bent arm (sun rising)",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.35, rightArmForward: 0.3, rightForearmBend: 0.7,
        ...HS.FLAT,
        leftArmAngle: 0.55, leftArmForward: 0.5, leftForearmBend: 0.3,
        ...toLeft(HS.FLAT) },
      { ...REST_POSE, rightArmAngle: 0.95, rightArmForward: 0.3, rightForearmBend: 0.4,
        ...HS.FLAT,
        leftArmAngle: 0.55, leftArmForward: 0.5, leftForearmBend: 0.3,
        ...toLeft(HS.FLAT), eyebrowRaise: 0.4 },
    ],
  },
  night: {
    type: "gesture", label: "NIGHT",
    description: "Dominant hand arcs downward over non-dominant arm",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.4, rightForearmBend: 0.5,
        ...HS.FLAT_O,
        leftArmAngle: 0.65, leftArmForward: 0.5, leftForearmBend: 0.3,
        ...toLeft(HS.FLAT) },
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.4, rightForearmBend: 0.7,
        ...HS.FLAT_O,
        leftArmAngle: 0.65, leftArmForward: 0.5, leftForearmBend: 0.3,
        ...toLeft(HS.FLAT) },
    ],
  },
  today: {
    type: "gesture", label: "TODAY",
    description: "Both open hands drop down",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.4,
        ...HS.FLAT, rightWristRotate: 0.5,
        leftArmAngle: 0.9, leftArmForward: 0.5, leftForearmBend: 0.4,
        ...toLeft(HS.FLAT), leftWristRotate: 0.5 },
      { ...REST_POSE, rightArmAngle: 0.55, rightArmForward: 0.5, rightForearmBend: 0.5,
        ...HS.FLAT, rightWristRotate: 0.5,
        leftArmAngle: 0.55, leftArmForward: 0.5, leftForearmBend: 0.5,
        ...toLeft(HS.FLAT), leftWristRotate: 0.5 },
    ],
  },
  tomorrow: {
    type: "gesture", label: "TOMORROW",
    description: "A-hand with thumb on cheek moves forward",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.05, rightArmForward: 0.2, rightArmSpread: 0.15, rightForearmBend: 0.85,
        ...HS.A },
      { ...REST_POSE, rightArmAngle: 1.05, rightArmForward: 0.5, rightArmSpread: 0.15, rightForearmBend: 0.6,
        ...HS.A },
    ],
  },
  yesterday: {
    type: "gesture", label: "YESTERDAY",
    description: "A-hand thumb touches cheek then moves to ear",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.05, rightArmForward: 0.3, rightArmSpread: 0.15, rightForearmBend: 0.8,
        ...HS.A },
      { ...REST_POSE, rightArmAngle: 1.05, rightArmForward: 0.1, rightArmSpread: 0.3, rightForearmBend: 0.9,
        ...HS.A },
    ],
  },

  // ═══ PLACES & THINGS ═══
  home: {
    type: "gesture", label: "HOME",
    description: "Flat O touches chin then cheek",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.05, rightArmForward: 0.2, rightForearmBend: 0.9,
        ...HS.FLAT_O, mouthOpen: 0.1 },
      { ...REST_POSE, rightArmAngle: 1.05, rightArmForward: 0.15, rightArmSpread: 0.2, rightForearmBend: 0.9,
        ...HS.FLAT_O },
    ],
  },
  school: {
    type: "gesture", label: "SCHOOL",
    description: "Flat hands clap together twice",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.5, rightForearmBend: 0.5,
        ...HS.FLAT,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftForearmBend: 0.5,
        ...toLeft(HS.FLAT) },
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.55, rightForearmBend: 0.55,
        ...HS.FLAT,
        leftArmAngle: 0.75, leftArmForward: 0.55, leftForearmBend: 0.55,
        ...toLeft(HS.FLAT) },
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.5, rightForearmBend: 0.5,
        ...HS.FLAT,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftForearmBend: 0.5,
        ...toLeft(HS.FLAT) },
    ],
  },
  food: {
    type: "gesture", label: "FOOD",
    description: "Flat O taps mouth",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.95, rightArmForward: 0.2, rightForearmBend: 0.85,
        ...HS.FLAT_O, mouthOpen: 0.3 },
      { ...REST_POSE, rightArmAngle: 1.05, rightArmForward: 0.15, rightForearmBend: 0.9,
        ...HS.FLAT_O, mouthOpen: 0.5 },
    ],
  },

  // ═══ COMMON PHRASES & GRAMMAR ═══
  name: {
    type: "gesture", label: "NAME",
    description: "H-hand taps on other H-hand",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.5, rightForearmBend: 0.6,
        ...HS.H,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftForearmBend: 0.5,
        ...toLeft(HS.H) },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.55,
        ...HS.H,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftForearmBend: 0.5,
        ...toLeft(HS.H) },
    ],
  },
  like: {
    type: "gesture", label: "LIKE",
    description: "Thumb and middle finger pull away from chest",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.55, rightArmForward: 0.3, rightForearmBend: 0.7,
        rightThumbCurl: 0.4, rightIndexCurl: 0.8, rightMiddleCurl: 0.4, rightRingCurl: 0.8, rightPinkyCurl: 0.8 },
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.6, rightForearmBend: 0.4,
        rightThumbCurl: 0.6, rightIndexCurl: 0.8, rightMiddleCurl: 0.6, rightRingCurl: 0.8, rightPinkyCurl: 0.8,
        mouthOpen: 0.2 },
    ],
  },
  have: {
    type: "gesture", label: "HAVE",
    description: "Bent hands touch chest",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.55, rightArmForward: 0.4, rightForearmBend: 0.6,
        ...HS.CLAW,
        leftArmAngle: 0.55, leftArmForward: 0.4, leftForearmBend: 0.6,
        ...toLeft(HS.CLAW) },
      { ...REST_POSE, rightArmAngle: 0.45, rightArmForward: 0.2, rightForearmBend: 0.7,
        ...HS.CLAW,
        leftArmAngle: 0.45, leftArmForward: 0.2, leftForearmBend: 0.7,
        ...toLeft(HS.CLAW) },
    ],
  },
  not: {
    type: "gesture", label: "NOT",
    description: "Thumb under chin flicks forward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.95, rightArmForward: 0.2, rightForearmBend: 0.85,
        ...HS.A, headTurn: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.5, rightForearmBend: 0.5,
        ...HS.A, headTurn: -0.1 },
    ],
  },
  do: {
    type: "gesture", label: "DO",
    description: "Both C-hands move side to side",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.5, rightArmSpread: -0.2, rightForearmBend: 0.4,
        ...HS.C,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftArmSpread: 0.2, leftForearmBend: 0.4,
        ...toLeft(HS.C) },
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.5, rightArmSpread: 0.2, rightForearmBend: 0.4,
        ...HS.C,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftArmSpread: -0.2, leftForearmBend: 0.4,
        ...toLeft(HS.C) },
    ],
  },
  welcome: {
    type: "gesture", label: "WELCOME",
    description: "Open hand sweeps inward toward body",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.95, rightArmForward: 0.7, rightArmSpread: 0.3, rightForearmBend: 0.3,
        ...HS.FLAT, eyebrowRaise: 0.5, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.3, rightForearmBend: 0.6,
        ...HS.FLAT, eyebrowRaise: 0.4, headNod: 0.2 },
    ],
  },
  nice: {
    type: "gesture", label: "NICE",
    description: "Flat right hand slides off left palm forward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.4, rightForearmBend: 0.5,
        ...HS.FLAT,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftForearmBend: 0.3,
        ...toLeft(HS.FLAT), eyebrowRaise: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.7, rightForearmBend: 0.3,
        ...HS.FLAT,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftForearmBend: 0.3,
        ...toLeft(HS.FLAT), eyebrowRaise: 0.4, mouthOpen: 0.2 },
    ],
  },
  meet: {
    type: "gesture", label: "MEET",
    description: "Both index fingers approach and touch",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.5, rightArmSpread: 0.3, rightForearmBend: 0.5,
        ...HS.ONE,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftArmSpread: -0.3, leftForearmBend: 0.5,
        ...toLeft(HS.ONE) },
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.5, rightForearmBend: 0.55,
        ...HS.ONE,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftForearmBend: 0.55,
        ...toLeft(HS.ONE), eyebrowRaise: 0.3, mouthOpen: 0.2 },
    ],
  },
  beautiful: {
    type: "gesture", label: "BEAUTIFUL",
    description: "Open hand circles face then closes",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.15, rightArmForward: 0.3, rightForearmBend: 0.8,
        ...HS.FIVE, eyebrowRaise: 0.4, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 1.15, rightArmForward: 0.3, rightArmSpread: 0.2, rightForearmBend: 0.8,
        ...HS.FLAT_O, eyebrowRaise: 0.5 },
    ],
  },
  again: {
    type: "gesture", label: "AGAIN",
    description: "Bent hand arcs and taps into upturned palm",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.5, rightForearmBend: 0.4,
        ...HS.CLAW,
        leftArmAngle: 0.65, leftArmForward: 0.5, leftForearmBend: 0.3,
        ...toLeft(HS.FLAT) },
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.5, rightForearmBend: 0.6,
        ...HS.CLAW,
        leftArmAngle: 0.65, leftArmForward: 0.5, leftForearmBend: 0.3,
        ...toLeft(HS.FLAT) },
    ],
  },
  are: {
    type: "gesture", label: "ARE",
    description: "R-hand moves forward from lips",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.05, rightArmForward: 0.2, rightForearmBend: 0.85,
        ...HS.R, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.6, rightForearmBend: 0.4,
        ...HS.R },
    ],
  },
  is: {
    type: "gesture", label: "IS",
    description: "I-hand moves forward from chin",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.05, rightArmForward: 0.2, rightForearmBend: 0.85,
        ...HS.I },
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.6, rightForearmBend: 0.4,
        ...HS.I },
    ],
  },
  sign: {
    type: "gesture", label: "SIGN",
    description: "Both index fingers circle alternately",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.5, rightForearmBend: 0.5,
        ...HS.ONE,
        leftArmAngle: 0.85, leftArmForward: 0.5, leftForearmBend: 0.5,
        ...toLeft(HS.ONE) },
      { ...REST_POSE, rightArmAngle: 0.95, rightArmForward: 0.5, rightForearmBend: 0.4,
        ...HS.ONE,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftForearmBend: 0.6,
        ...toLeft(HS.ONE) },
    ],
  },
  language: {
    type: "gesture", label: "LANGUAGE",
    description: "Both L-hands move apart from center",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.5, rightForearmBend: 0.5,
        ...HS.L,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftForearmBend: 0.5,
        ...toLeft(HS.L) },
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.5, rightArmSpread: 0.4, rightForearmBend: 0.4,
        ...HS.L,
        leftArmAngle: 0.75, leftArmForward: 0.5, leftArmSpread: -0.4, leftForearmBend: 0.4,
        ...toLeft(HS.L) },
    ],
  },
  learn: {
    type: "gesture", label: "LEARN",
    description: "Hand picks up from palm and brings to forehead",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.65, rightArmForward: 0.5, rightForearmBend: 0.5,
        ...HS.FIVE,
        leftArmAngle: 0.65, leftArmForward: 0.5, leftForearmBend: 0.3,
        ...toLeft(HS.FLAT) },
      { ...REST_POSE, rightArmAngle: 1.15, rightArmForward: 0.2, rightForearmBend: 0.85,
        ...HS.FLAT_O,
        leftArmAngle: 0.65, leftArmForward: 0.5, leftForearmBend: 0.3,
        ...toLeft(HS.FLAT), eyebrowRaise: 0.3 },
    ],
  },
  teach: {
    type: "gesture", label: "TEACH",
    description: "Both flat O-hands at forehead push forward and open",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.15, rightArmForward: 0.3, rightForearmBend: 0.7,
        ...HS.FLAT_O,
        leftArmAngle: 1.15, leftArmForward: 0.3, leftForearmBend: 0.7,
        ...toLeft(HS.FLAT_O) },
      { ...REST_POSE, rightArmAngle: 0.95, rightArmForward: 0.7, rightForearmBend: 0.3,
        ...HS.FIVE,
        leftArmAngle: 0.95, leftArmForward: 0.7, leftForearmBend: 0.3,
        ...toLeft(HS.FIVE) },
    ],
  },
  live: {
    type: "gesture", label: "LIVE",
    description: "Both L-hands move up body",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.35, rightArmForward: 0.25, rightForearmBend: 0.6,
        ...HS.L,
        leftArmAngle: 0.35, leftArmForward: 0.25, leftForearmBend: 0.6,
        ...toLeft(HS.L) },
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.25, rightForearmBend: 0.5,
        ...HS.L,
        leftArmAngle: 0.75, leftArmForward: 0.25, leftForearmBend: 0.5,
        ...toLeft(HS.L) },
    ],
  },
  deaf: {
    type: "gesture", label: "DEAF",
    description: "Index finger points to ear then to mouth",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.15, rightArmForward: 0.1, rightArmSpread: 0.3, rightForearmBend: 0.8,
        ...HS.ONE },
      { ...REST_POSE, rightArmAngle: 1.05, rightArmForward: 0.2, rightForearmBend: 0.85,
        ...HS.ONE, mouthOpen: 0.1 },
    ],
  },
};

export function getSignForWord(word: string): WordSign {
  const lower = word.toLowerCase().replace(/[^a-z]/g, "");
  if (COMMON_WORDS[lower]) return COMMON_WORDS[lower];

  // Finger-spell unknown words
  const poses = lower.split("").map((l) => ASL_ALPHABET[l]).filter(Boolean);
  return {
    type: "fingerspell",
    label: lower.toUpperCase(),
    poses,
    description: `Finger-spell: ${lower.toUpperCase()}`,
  };
}

export { REST_POSE };
