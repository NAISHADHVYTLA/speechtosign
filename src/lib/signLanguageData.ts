// Indian Sign Language (ISL) data with full body avatar poses
// Based on ISLRTC standards and common ISL usage
// Includes arm positions, hand poses, head movements for realistic signing

export interface AvatarPose {
  // Right arm
  rightArmAngle: number;      // 0 = down, 1 = shoulder height, 1.5 = above head, 1.8 = fully raised
  rightArmForward: number;    // 0 = by side, 1 = fully forward
  rightArmSpread: number;     // lateral spread
  rightForearmBend: number;   // 0 = straight, 1 = fully bent
  rightHandPose: number;      // 0 = open, 1 = fist, 0.5 = relaxed
  rightWristTilt: number;     // -1 to 1

  // Left arm  
  leftArmAngle: number;
  leftArmForward: number;
  leftArmSpread: number;
  leftForearmBend: number;
  leftHandPose: number;
  leftWristTilt: number;

  // Head
  headNod: number;            // -1 to 1 (down to up)
  headTilt: number;           // -1 to 1 (left to right)
  headTurn: number;           // -1 to 1

  // Expression
  mouthOpen: number;          // 0-1
  eyebrowRaise: number;       // 0-1
}

const REST_POSE: AvatarPose = {
  rightArmAngle: 0, rightArmForward: 0, rightArmSpread: 0,
  rightForearmBend: 0, rightHandPose: 0, rightWristTilt: 0,
  leftArmAngle: 0, leftArmForward: 0, leftArmSpread: 0,
  leftForearmBend: 0, leftHandPose: 0, leftWristTilt: 0,
  headNod: 0, headTilt: 0, headTurn: 0,
  mouthOpen: 0, eyebrowRaise: 0,
};

export interface WordSign {
  type: "fingerspell" | "gesture";
  label: string;
  poses: AvatarPose[];
  description: string;
}

// ISL Alphabet — right hand raised, different hand shapes
// ISL uses a two-handed alphabet similar to BSL for some letters, but one-handed for most
function letterPose(handPose: number, extras?: Partial<AvatarPose>): AvatarPose {
  return {
    ...REST_POSE,
    rightArmAngle: 0.9,
    rightArmForward: 0.5,
    rightForearmBend: 0.6,
    rightHandPose: handPose,
    rightWristTilt: 0,
    ...extras,
  };
}

export const ASL_ALPHABET: Record<string, AvatarPose> = {
  a: letterPose(0.9),
  b: letterPose(0.0),
  c: letterPose(0.5),
  d: letterPose(0.3, { rightWristTilt: 0.2 }),
  e: letterPose(0.8),
  f: letterPose(0.6),
  g: letterPose(0.3, { rightArmForward: 0.7 }),
  h: letterPose(0.2, { rightArmForward: 0.7 }),
  i: letterPose(0.85),
  j: letterPose(0.85, { rightWristTilt: 0.4 }),
  k: letterPose(0.3),
  l: letterPose(0.1),
  m: letterPose(0.9, { rightWristTilt: -0.2 }),
  n: letterPose(0.85, { rightWristTilt: -0.1 }),
  o: letterPose(0.6),
  p: letterPose(0.3, { rightArmAngle: 0.6 }),
  q: letterPose(0.4, { rightArmAngle: 0.5 }),
  r: letterPose(0.2),
  s: letterPose(1.0),
  t: letterPose(0.9),
  u: letterPose(0.15),
  v: letterPose(0.15),
  w: letterPose(0.1),
  x: letterPose(0.7),
  y: letterPose(0.2, { rightWristTilt: -0.3 }),
  z: letterPose(0.2, { rightWristTilt: 0.3 }),
};

// ─── ISL Common Word Signs ──────────────────────────────────────
// All signs follow Indian Sign Language (ISL) conventions
// ISL uses more two-handed signs and facial grammar than ASL
export const COMMON_WORDS: Record<string, WordSign> = {
  // ═══ GREETINGS (ISL) ═══
  hello: {
    type: "gesture", label: "NAMASTE",
    description: "ISL: Both palms pressed together at chest, slight bow",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.4, rightForearmBend: 0.9, rightHandPose: 0, leftArmAngle: 0.7, leftArmForward: 0.4, leftForearmBend: 0.9, leftHandPose: 0, headNod: 0.2, eyebrowRaise: 0.3, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.4, rightForearmBend: 0.9, rightHandPose: 0, leftArmAngle: 0.7, leftArmForward: 0.4, leftForearmBend: 0.9, leftHandPose: 0, headNod: -0.1 },
    ],
  },
  namaste: {
    type: "gesture", label: "NAMASTE",
    description: "ISL: Both palms pressed together, slight head bow",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.4, rightForearmBend: 0.9, rightHandPose: 0, leftArmAngle: 0.7, leftArmForward: 0.4, leftForearmBend: 0.9, leftHandPose: 0, headNod: 0.2, eyebrowRaise: 0.3, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.4, rightForearmBend: 0.9, rightHandPose: 0, leftArmAngle: 0.7, leftArmForward: 0.4, leftForearmBend: 0.9, leftHandPose: 0, headNod: -0.1 },
    ],
  },
  hi: {
    type: "gesture", label: "NAMASTE",
    description: "ISL: Palms together at chest level",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.4, rightForearmBend: 0.9, rightHandPose: 0, leftArmAngle: 0.7, leftArmForward: 0.4, leftForearmBend: 0.9, leftHandPose: 0, headNod: 0.2, eyebrowRaise: 0.4 },
    ],
  },
  goodbye: {
    type: "gesture", label: "ALVIDA",
    description: "ISL: Open hand raised and waved side to side",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.3, rightArmForward: 0.3, rightForearmBend: 0.3, rightHandPose: 0, headNod: 0.1, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 1.3, rightArmForward: 0.3, rightArmSpread: 0.3, rightForearmBend: 0.3, rightHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 1.3, rightArmForward: 0.3, rightArmSpread: -0.2, rightForearmBend: 0.3, rightHandPose: 0 },
    ],
  },
  bye: {
    type: "gesture", label: "ALVIDA",
    description: "ISL: Hand raised and waved",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.3, rightArmForward: 0.3, rightForearmBend: 0.3, rightHandPose: 0, headNod: 0.1 },
      { ...REST_POSE, rightArmAngle: 1.3, rightArmForward: 0.3, rightArmSpread: 0.3, rightForearmBend: 0.3, rightHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 1.3, rightArmForward: 0.3, rightArmSpread: -0.2, rightForearmBend: 0.3, rightHandPose: 0 },
    ],
  },

  // ═══ COURTESY (ISL) ═══
  thank: {
    type: "gesture", label: "DHANYAVAAD",
    description: "ISL: Right flat hand touches chin, moves forward and down",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.3, rightForearmBend: 0.9, rightHandPose: 0, rightWristTilt: 0.3, headNod: 0.3, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.7, rightForearmBend: 0.4, rightHandPose: 0, rightWristTilt: -0.2, headNod: -0.2 },
    ],
  },
  thanks: {
    type: "gesture", label: "DHANYAVAAD",
    description: "ISL: Flat hand from chin forward",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.3, rightForearmBend: 0.9, rightHandPose: 0, rightWristTilt: 0.3, headNod: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.7, rightForearmBend: 0.4, rightHandPose: 0, rightWristTilt: -0.2, headNod: -0.2 },
    ],
  },
  please: {
    type: "gesture", label: "KRIPYA",
    description: "ISL: Both palms together, slight bow — requesting gesture",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.5, rightForearmBend: 0.8, rightHandPose: 0, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.8, leftHandPose: 0, headNod: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.5, rightForearmBend: 0.8, rightHandPose: 0, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.8, leftHandPose: 0, headNod: -0.2 },
    ],
  },
  sorry: {
    type: "gesture", label: "MAAF",
    description: "ISL: Fist circles on chest, head bows slightly",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 1, headNod: -0.3, eyebrowRaise: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.2, rightArmSpread: 0.15, rightForearmBend: 0.7, rightHandPose: 1, headNod: -0.2 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 1, headNod: -0.3 },
    ],
  },

  // ═══ BASIC RESPONSES (ISL) ═══
  yes: {
    type: "gesture", label: "HAAN",
    description: "ISL: Fist nods downward, head nods",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.7, rightHandPose: 1, headNod: 0.4 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 1, headNod: -0.2 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.7, rightHandPose: 1, headNod: 0.4 },
    ],
  },
  no: {
    type: "gesture", label: "NAHIN",
    description: "ISL: Open hand waves side to side, head shakes",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0, rightArmSpread: 0.3, headTurn: 0.4 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0, rightArmSpread: -0.3, headTurn: -0.4 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0, rightArmSpread: 0.2, headTurn: 0.3 },
    ],
  },
  ok: {
    type: "gesture", label: "THEEK HAI",
    description: "ISL: Thumb and index form circle",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.4, rightHandPose: 0.6, headNod: 0.2, eyebrowRaise: 0.3 },
    ],
  },
  good: {
    type: "gesture", label: "ACCHA",
    description: "ISL: Thumbs up, hand raised forward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.9, headNod: 0.2, eyebrowRaise: 0.3, mouthOpen: 0.2 },
    ],
  },
  bad: {
    type: "gesture", label: "BURA",
    description: "ISL: Thumbs down motion",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.4, rightHandPose: 0.9, rightWristTilt: -0.5, headNod: -0.3 },
    ],
  },

  // ═══ PRONOUNS (ISL) ═══
  i: {
    type: "gesture", label: "MAIN",
    description: "ISL: Index finger points to own chest",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0.2, rightWristTilt: 0.4 },
    ],
  },
  me: {
    type: "gesture", label: "MUJHE",
    description: "ISL: Index finger points to chest",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0.2, rightWristTilt: 0.4, headNod: 0.1 },
    ],
  },
  you: {
    type: "gesture", label: "AAPKO",
    description: "ISL: Index finger points forward at person",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.8, rightForearmBend: 0.2, rightHandPose: 0.2, headNod: 0.1 },
    ],
  },
  my: {
    type: "gesture", label: "MERA",
    description: "ISL: Flat hand placed on chest",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.2, rightForearmBend: 0.7, rightHandPose: 0, rightWristTilt: 0.2 },
    ],
  },
  your: {
    type: "gesture", label: "AAPKA",
    description: "ISL: Flat hand pushes toward person",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.7, rightForearmBend: 0.2, rightHandPose: 0, eyebrowRaise: 0.2 },
    ],
  },
  we: {
    type: "gesture", label: "HUM",
    description: "ISL: Index finger circles between self and others",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.4, rightForearmBend: 0.6, rightHandPose: 0.2, rightArmSpread: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.4, rightForearmBend: 0.6, rightHandPose: 0.2, rightArmSpread: -0.3 },
    ],
  },
  they: {
    type: "gesture", label: "VE LOG",
    description: "ISL: Hand sweeps outward to side",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.6, rightForearmBend: 0.2, rightHandPose: 0, rightArmSpread: -0.2 },
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.6, rightForearmBend: 0.2, rightHandPose: 0, rightArmSpread: 0.4 },
    ],
  },

  // ═══ QUESTION WORDS (ISL) ═══
  what: {
    type: "gesture", label: "KYA",
    description: "ISL: Both palms up, shrug — questioning expression",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightArmSpread: 0.3, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.7, leftArmForward: 0.5, leftArmSpread: -0.3, leftForearmBend: 0.5, leftHandPose: 0, eyebrowRaise: 0.8, headTilt: 0.15 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightArmSpread: 0.5, rightForearmBend: 0.4, rightHandPose: 0, leftArmAngle: 0.8, leftArmForward: 0.5, leftArmSpread: -0.5, leftForearmBend: 0.4, leftHandPose: 0, eyebrowRaise: 0.9, headTilt: -0.1 },
    ],
  },
  where: {
    type: "gesture", label: "KAHAN",
    description: "ISL: Index finger wags side to side, questioning look",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.2, rightArmSpread: -0.3, eyebrowRaise: 0.7 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.2, rightArmSpread: 0.3, eyebrowRaise: 0.7 },
    ],
  },
  how: {
    type: "gesture", label: "KAISE",
    description: "ISL: Both fists roll outward and open",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.7, rightHandPose: 1, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.7, leftHandPose: 1, eyebrowRaise: 0.6 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.6, rightForearmBend: 0.4, rightHandPose: 0, leftArmAngle: 0.8, leftArmForward: 0.6, leftForearmBend: 0.4, leftHandPose: 0, eyebrowRaise: 0.8 },
    ],
  },
  who: {
    type: "gesture", label: "KAUN",
    description: "ISL: Index finger circles near chin, questioning face",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0.2, mouthOpen: 0.3, eyebrowRaise: 0.7 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.3, rightArmSpread: 0.15, rightForearmBend: 0.8, rightHandPose: 0.2, mouthOpen: 0.3, eyebrowRaise: 0.7 },
    ],
  },
  when: {
    type: "gesture", label: "KAB",
    description: "ISL: Index finger taps wrist (like pointing at watch)",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.4, rightForearmBend: 0.7, rightHandPose: 0.2, leftArmAngle: 0.5, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0, eyebrowRaise: 0.6 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.5, rightForearmBend: 0.8, rightHandPose: 0.2, leftArmAngle: 0.5, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0, eyebrowRaise: 0.7 },
    ],
  },
  why: {
    type: "gesture", label: "KYUN",
    description: "ISL: Open hand at forehead flips outward",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0, eyebrowRaise: 0.8 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.6, rightForearmBend: 0.4, rightHandPose: 0, rightWristTilt: -0.3, eyebrowRaise: 0.9 },
    ],
  },

  // ═══ EMOTIONS (ISL) ═══
  happy: {
    type: "gesture", label: "KHUSH",
    description: "ISL: Both flat hands brush upward on chest repeatedly",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.3, rightArmForward: 0.3, rightForearmBend: 0.6, rightHandPose: 0, leftArmAngle: 0.3, leftArmForward: 0.3, leftForearmBend: 0.6, leftHandPose: 0, eyebrowRaise: 0.5 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.3, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.7, leftArmForward: 0.3, leftForearmBend: 0.5, leftHandPose: 0, eyebrowRaise: 0.8, mouthOpen: 0.4 },
    ],
  },
  sad: {
    type: "gesture", label: "DUKHI",
    description: "ISL: Both hands slide down from face",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0, leftArmAngle: 1.0, leftArmForward: 0.3, leftForearmBend: 0.8, leftHandPose: 0, headNod: -0.2 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.3, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.5, leftArmForward: 0.3, leftForearmBend: 0.5, leftHandPose: 0, headNod: -0.4, mouthOpen: 0.2 },
    ],
  },
  angry: {
    type: "gesture", label: "GUSSA",
    description: "ISL: Claw hands pull away from face, furrowed brow",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0.4, leftArmAngle: 1.0, leftArmForward: 0.3, leftForearmBend: 0.8, leftHandPose: 0.4, eyebrowRaise: 0.9, mouthOpen: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.6, rightForearmBend: 0.5, rightHandPose: 0.7, leftArmAngle: 0.7, leftArmForward: 0.6, leftForearmBend: 0.5, leftHandPose: 0.7, eyebrowRaise: 1.0 },
    ],
  },
  love: {
    type: "gesture", label: "PYAAR",
    description: "ISL: Both arms cross over chest, then open outward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.3, rightForearmBend: 0.9, rightHandPose: 1, leftArmAngle: 0.5, leftArmForward: 0.3, leftForearmBend: 0.9, leftHandPose: 1, headNod: 0.1, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightArmSpread: 0.4, rightForearmBend: 0.4, rightHandPose: 0, leftArmAngle: 0.9, leftArmForward: 0.5, leftArmSpread: -0.4, leftForearmBend: 0.4, leftHandPose: 0, headNod: 0.2, eyebrowRaise: 0.4, mouthOpen: 0.3 },
    ],
  },
  scared: {
    type: "gesture", label: "DARA HUA",
    description: "ISL: Both hands raise up defensively, wide eyes",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.4, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 1.0, leftArmForward: 0.4, leftForearmBend: 0.5, leftHandPose: 0, eyebrowRaise: 1.0, mouthOpen: 0.5 },
      { ...REST_POSE, rightArmAngle: 1.2, rightArmForward: 0.5, rightArmSpread: 0.3, rightForearmBend: 0.4, rightHandPose: 0, leftArmAngle: 1.2, leftArmForward: 0.5, leftArmSpread: -0.3, leftForearmBend: 0.4, leftHandPose: 0, eyebrowRaise: 1.0, mouthOpen: 0.6 },
    ],
  },
  tired: {
    type: "gesture", label: "THAKA HUA",
    description: "ISL: Bent hands drop from chest, head droops",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.3, rightForearmBend: 0.6, rightHandPose: 0.4, leftArmAngle: 0.5, leftArmForward: 0.3, leftForearmBend: 0.6, leftHandPose: 0.4, headNod: -0.2 },
      { ...REST_POSE, rightArmAngle: 0.2, rightArmForward: 0.3, rightForearmBend: 0.4, rightHandPose: 0.4, leftArmAngle: 0.2, leftArmForward: 0.3, leftForearmBend: 0.4, leftHandPose: 0.4, headNod: -0.4 },
    ],
  },
  hungry: {
    type: "gesture", label: "BHOOKH",
    description: "ISL: C-hand moves down from throat to stomach",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.2, rightForearmBend: 0.8, rightHandPose: 0.5, mouthOpen: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.3, rightArmForward: 0.2, rightForearmBend: 0.5, rightHandPose: 0.5, mouthOpen: 0.1 },
    ],
  },
  surprised: {
    type: "gesture", label: "HAIRAAN",
    description: "ISL: Both hands open near face, eyes wide",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.4, rightForearmBend: 0.6, rightHandPose: 0, leftArmAngle: 1.0, leftArmForward: 0.4, leftForearmBend: 0.6, leftHandPose: 0, eyebrowRaise: 1.0, mouthOpen: 0.7 },
    ],
  },
  worried: {
    type: "gesture", label: "CHINTIT",
    description: "ISL: Hands alternately circle near forehead",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0.4, eyebrowRaise: 0.6, headTilt: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.3, rightArmSpread: 0.2, rightForearmBend: 0.7, rightHandPose: 0.4, eyebrowRaise: 0.7, headTilt: -0.1 },
    ],
  },
  excited: {
    type: "gesture", label: "UTSAAHIT",
    description: "ISL: Both hands shake excitedly at chest level",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.4, rightForearmBend: 0.6, rightHandPose: 0, leftArmAngle: 0.6, leftArmForward: 0.4, leftForearmBend: 0.6, leftHandPose: 0, eyebrowRaise: 0.7, mouthOpen: 0.4 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.8, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 0, eyebrowRaise: 0.9, mouthOpen: 0.5 },
    ],
  },

  // ═══ NUMBERS 1-10 (ISL) ═══
  // ISL numbers are similar to international gestures but with specific hand orientations
  one: {
    type: "gesture", label: "EK (1)",
    description: "ISL: Index finger raised",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.2 },
    ],
  },
  two: {
    type: "gesture", label: "DO (2)",
    description: "ISL: Index and middle fingers raised",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.15 },
    ],
  },
  three: {
    type: "gesture", label: "TEEN (3)",
    description: "ISL: Thumb, index and middle fingers up",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.1 },
    ],
  },
  four: {
    type: "gesture", label: "CHAAR (4)",
    description: "ISL: Four fingers raised, thumb tucked",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.05 },
    ],
  },
  five: {
    type: "gesture", label: "PAANCH (5)",
    description: "ISL: All five fingers spread open",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0 },
    ],
  },
  six: {
    type: "gesture", label: "CHHEH (6)",
    description: "ISL: Thumb and pinky extended, other fingers closed",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.7, rightWristTilt: -0.2 },
    ],
  },
  seven: {
    type: "gesture", label: "SAAT (7)",
    description: "ISL: Index and thumb touch, other fingers up",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.6 },
    ],
  },
  eight: {
    type: "gesture", label: "AATH (8)",
    description: "ISL: Thumb and middle finger touch, others extended",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.55, rightWristTilt: 0.1 },
    ],
  },
  nine: {
    type: "gesture", label: "NAU (9)",
    description: "ISL: Thumb and ring finger touch, others extended",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.5, rightWristTilt: 0.2 },
    ],
  },
  ten: {
    type: "gesture", label: "DAS (10)",
    description: "ISL: Both hands open, palms forward — all ten fingers shown",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.9, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 0 },
    ],
  },

  // ═══ COLORS (ISL) ═══
  red: {
    type: "gesture", label: "LAAL",
    description: "ISL: Index finger touches lower lip and moves down",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.25, rightForearmBend: 0.9, rightHandPose: 0.2, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0.2 },
    ],
  },
  blue: {
    type: "gesture", label: "NEELA",
    description: "ISL: B-hand shakes near shoulder",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.3, rightArmSpread: 0.3, rightForearmBend: 0.5, rightHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.3, rightArmSpread: 0.4, rightForearmBend: 0.5, rightHandPose: 0, rightWristTilt: 0.3 },
    ],
  },
  green: {
    type: "gesture", label: "HARA",
    description: "ISL: G-hand twists at wrist",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.3, rightWristTilt: -0.3 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.3, rightWristTilt: 0.3 },
    ],
  },
  yellow: {
    type: "gesture", label: "PEELA",
    description: "ISL: Y-hand shakes at side",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.4, rightArmSpread: 0.3, rightForearmBend: 0.4, rightHandPose: 0.2, rightWristTilt: -0.3 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.4, rightArmSpread: 0.4, rightForearmBend: 0.4, rightHandPose: 0.2, rightWristTilt: 0.2 },
    ],
  },
  white: {
    type: "gesture", label: "SAFED",
    description: "ISL: Open hand on chest pulls away closing",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.8 },
    ],
  },
  black: {
    type: "gesture", label: "KAALA",
    description: "ISL: Index finger draws across forehead",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.2, rightArmSpread: -0.2, rightForearmBend: 0.8, rightHandPose: 0.2 },
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.2, rightArmSpread: 0.3, rightForearmBend: 0.8, rightHandPose: 0.2 },
    ],
  },
  orange: {
    type: "gesture", label: "NARANGI",
    description: "ISL: C-hand squeezes near chin",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0.5, mouthOpen: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0.8 },
    ],
  },
  pink: {
    type: "gesture", label: "GULABI",
    description: "ISL: P-hand brushes down from lip",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.25, rightForearmBend: 0.85, rightHandPose: 0.3, mouthOpen: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0.3 },
    ],
  },
  purple: {
    type: "gesture", label: "BAINGANI",
    description: "ISL: P-hand shakes",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.3, rightWristTilt: -0.2 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.3, rightWristTilt: 0.2 },
    ],
  },
  brown: {
    type: "gesture", label: "BHOORA",
    description: "ISL: B-hand slides down cheek",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.2, rightArmSpread: 0.2, rightForearmBend: 0.8, rightHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.2, rightArmSpread: 0.2, rightForearmBend: 0.7, rightHandPose: 0 },
    ],
  },

  // ═══ COMMON ACTIONS (ISL) ═══
  help: {
    type: "gesture", label: "MADAD",
    description: "ISL: Fist on flat palm lifts upward — both hands raised",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 1, leftArmAngle: 0.4, leftArmForward: 0.5, leftForearmBend: 0.4, leftHandPose: 0, eyebrowRaise: 0.5 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 1, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.4, leftHandPose: 0, eyebrowRaise: 0.7 },
    ],
  },
  stop: {
    type: "gesture", label: "RUKO",
    description: "ISL: Flat hand raised high, palm forward — strong stop",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.4, rightArmForward: 0.4, rightForearmBend: 0.2, rightHandPose: 0, mouthOpen: 0.3, eyebrowRaise: 0.5 },
    ],
  },
  eat: {
    type: "gesture", label: "KHAANA",
    description: "ISL: Fingers bunch together and move to mouth repeatedly",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0.6, mouthOpen: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.2, rightForearmBend: 0.9, rightHandPose: 0.6, mouthOpen: 0.5 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0.6, mouthOpen: 0.3 },
    ],
  },
  drink: {
    type: "gesture", label: "PEENA",
    description: "ISL: C-hand tips toward mouth",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0.5 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.2, rightForearmBend: 0.9, rightHandPose: 0.5, rightWristTilt: 0.5, mouthOpen: 0.4 },
    ],
  },
  water: {
    type: "gesture", label: "PAANI",
    description: "ISL: W-hand taps chin",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.25, rightForearmBend: 0.85, rightHandPose: 0.1, mouthOpen: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.95, rightArmForward: 0.2, rightForearmBend: 0.9, rightHandPose: 0.1, mouthOpen: 0.2 },
    ],
  },
  go: {
    type: "gesture", label: "JAAO",
    description: "ISL: Both pointing hands move forward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.4, rightForearmBend: 0.5, rightHandPose: 0.2, leftArmAngle: 0.6, leftArmForward: 0.4, leftForearmBend: 0.5, leftHandPose: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.8, rightForearmBend: 0.3, rightHandPose: 0.2, leftArmAngle: 0.7, leftArmForward: 0.8, leftForearmBend: 0.3, leftHandPose: 0.2 },
    ],
  },
  come: {
    type: "gesture", label: "AAO",
    description: "ISL: Hand beckons inward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.7, rightForearmBend: 0.3, rightHandPose: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.4, rightForearmBend: 0.7, rightHandPose: 0.2 },
    ],
  },
  want: {
    type: "gesture", label: "CHAHIYE",
    description: "ISL: Claw hands pull toward body",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.7, rightForearmBend: 0.4, rightHandPose: 0.4, leftArmAngle: 0.7, leftArmForward: 0.7, leftForearmBend: 0.4, leftHandPose: 0.4 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0.7, leftArmAngle: 0.5, leftArmForward: 0.3, leftForearmBend: 0.7, leftHandPose: 0.7 },
    ],
  },
  need: {
    type: "gesture", label: "ZAROORAT",
    description: "ISL: X-hand bends downward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.7 },
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 0.7, rightWristTilt: -0.3 },
    ],
  },
  can: {
    type: "gesture", label: "SAKTA",
    description: "ISL: Both fists move down firmly",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.4, rightForearmBend: 0.5, rightHandPose: 1, leftArmAngle: 0.7, leftArmForward: 0.4, leftForearmBend: 0.5, leftHandPose: 1, headNod: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.4, rightForearmBend: 0.5, rightHandPose: 1, leftArmAngle: 0.4, leftArmForward: 0.4, leftForearmBend: 0.5, leftHandPose: 1, headNod: -0.1 },
    ],
  },
  think: {
    type: "gesture", label: "SOCHNA",
    description: "ISL: Index finger touches temple",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.2, rightArmSpread: 0.2, rightForearmBend: 0.9, rightHandPose: 0.2, eyebrowRaise: 0.4 },
    ],
  },
  know: {
    type: "gesture", label: "JAANNA",
    description: "ISL: Fingers tap forehead",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.2, rightForearmBend: 0.9, rightHandPose: 0, headNod: 0.1 },
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.15, rightForearmBend: 0.95, rightHandPose: 0, headNod: 0.2 },
    ],
  },
  understand: {
    type: "gesture", label: "SAMAJHNA",
    description: "ISL: Index finger flicks up near forehead — light bulb moment",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.2, rightForearmBend: 0.9, rightHandPose: 0.3, headNod: -0.1 },
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.2, rightForearmBend: 0.85, rightHandPose: 0.1, headNod: 0.2, eyebrowRaise: 0.6 },
    ],
  },
  see: {
    type: "gesture", label: "DEKHNA",
    description: "ISL: V-hand from eyes outward",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.3, rightForearmBend: 0.85, rightHandPose: 0.15 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.7, rightForearmBend: 0.4, rightHandPose: 0.15 },
    ],
  },
  hear: {
    type: "gesture", label: "SUNNA",
    description: "ISL: Index finger points to ear",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.1, rightArmSpread: 0.4, rightForearmBend: 0.8, rightHandPose: 0.2, headTilt: 0.2 },
    ],
  },
  speak: {
    type: "gesture", label: "BOLNA",
    description: "ISL: Fingers move forward from mouth",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0.1, mouthOpen: 0.4 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 0.1, mouthOpen: 0.6 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0.1, mouthOpen: 0.4 },
    ],
  },
  wait: {
    type: "gesture", label: "RUKO",
    description: "ISL: Both hands raised palms forward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.4, rightHandPose: 0, leftArmAngle: 0.8, leftArmForward: 0.5, leftForearmBend: 0.4, leftHandPose: 0 },
    ],
  },

  // ═══ FAMILY (ISL) ═══
  family: {
    type: "gesture", label: "PARIVAAR",
    description: "ISL: Both F-hands circle outward from center",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.6, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 0.6 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightArmSpread: 0.4, rightForearmBend: 0.4, rightHandPose: 0.6, leftArmAngle: 0.7, leftArmForward: 0.5, leftArmSpread: -0.4, leftForearmBend: 0.4, leftHandPose: 0.6 },
    ],
  },
  mother: {
    type: "gesture", label: "MAA",
    description: "ISL: Thumb touches chin, hand opens",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.25, rightForearmBend: 0.85, rightHandPose: 0.9, mouthOpen: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0 },
    ],
  },
  father: {
    type: "gesture", label: "PITA",
    description: "ISL: Thumb touches forehead, hand opens",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.2, rightForearmBend: 0.9, rightHandPose: 0.9 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0 },
    ],
  },
  friend: {
    type: "gesture", label: "DOST",
    description: "ISL: Index fingers hook together and swap",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.3, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 0.3, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 0.3, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.4, leftHandPose: 0.3 },
    ],
  },

  // ═══ TIME (ISL) ═══
  morning: {
    type: "gesture", label: "SUBAH",
    description: "ISL: Flat hand rises upward like sun rising",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.3, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0, leftArmAngle: 0.4, leftArmForward: 0.4, leftForearmBend: 0.3, leftHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.3, rightForearmBend: 0.4, rightHandPose: 0, leftArmAngle: 0.4, leftArmForward: 0.4, leftForearmBend: 0.3, leftHandPose: 0, eyebrowRaise: 0.4 },
    ],
  },
  night: {
    type: "gesture", label: "RAAT",
    description: "ISL: Hand arcs downward like sun setting",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.4, rightForearmBend: 0.5, rightHandPose: 0.5 },
      { ...REST_POSE, rightArmAngle: 0.3, rightArmForward: 0.4, rightForearmBend: 0.7, rightHandPose: 0.5, rightWristTilt: -0.3 },
    ],
  },
  today: {
    type: "gesture", label: "AAJ",
    description: "ISL: Both open hands drop down",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.4, rightHandPose: 0, leftArmAngle: 0.8, leftArmForward: 0.5, leftForearmBend: 0.4, leftHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.4, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 0 },
    ],
  },
  tomorrow: {
    type: "gesture", label: "KAL (AANE WALA)",
    description: "ISL: Thumb on cheek moves forward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.2, rightForearmBend: 0.85, rightHandPose: 0.9 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 0.9 },
    ],
  },
  yesterday: {
    type: "gesture", label: "KAL (BEETA HUA)",
    description: "ISL: Thumb touches cheek, moves backward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0.9 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.1, rightArmSpread: 0.2, rightForearmBend: 0.9, rightHandPose: 0.9 },
    ],
  },

  // ═══ PLACES & THINGS (ISL) ═══
  home: {
    type: "gesture", label: "GHAR",
    description: "ISL: Both hands form roof shape above head",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.2, rightArmForward: 0.3, rightForearmBend: 0.6, rightHandPose: 0, leftArmAngle: 1.2, leftArmForward: 0.3, leftForearmBend: 0.6, leftHandPose: 0 },
    ],
  },
  school: {
    type: "gesture", label: "SCHOOL",
    description: "ISL: Clap motion — teacher clapping for attention",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.55, rightForearmBend: 0.55, rightHandPose: 0, leftArmAngle: 0.7, leftArmForward: 0.55, leftForearmBend: 0.55, leftHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 0 },
    ],
  },
  work: {
    type: "gesture", label: "KAAM",
    description: "ISL: Fist taps on flat hand",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.4, rightForearmBend: 0.5, rightHandPose: 1, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.4, leftHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 1, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.4, leftHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.4, rightForearmBend: 0.5, rightHandPose: 1, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.4, leftHandPose: 0 },
    ],
  },
  food: {
    type: "gesture", label: "KHAANA",
    description: "ISL: Bunched fingers move to mouth",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0.6, mouthOpen: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.2, rightForearmBend: 0.9, rightHandPose: 0.6, mouthOpen: 0.5 },
    ],
  },

  // ═══ COMMON PHRASES (ISL) ═══
  name: {
    type: "gesture", label: "NAAM",
    description: "ISL: Two fingers tap horizontally",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 0.3, eyebrowRaise: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.3, rightArmSpread: 0.15 },
    ],
  },
  like: {
    type: "gesture", label: "PASAND",
    description: "ISL: Hand pulls away from chest, thumb and middle finger",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0.4, mouthOpen: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.6, rightForearmBend: 0.4, rightHandPose: 0.2, mouthOpen: 0.2 },
    ],
  },
  have: {
    type: "gesture", label: "PASS HAI",
    description: "ISL: Bent hands touch chest",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.4, rightForearmBend: 0.6, rightHandPose: 0.5, leftArmAngle: 0.5, leftArmForward: 0.4, leftForearmBend: 0.6, leftHandPose: 0.5 },
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.2, rightForearmBend: 0.7, rightHandPose: 0.5, leftArmAngle: 0.4, leftArmForward: 0.2, leftForearmBend: 0.7, leftHandPose: 0.5 },
    ],
  },
  not: {
    type: "gesture", label: "NAHIN",
    description: "ISL: Open hand waves across — negation",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.4, rightHandPose: 0, rightArmSpread: -0.2, headTurn: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.4, rightHandPose: 0, rightArmSpread: 0.3, headTurn: -0.2 },
    ],
  },
  do: {
    type: "gesture", label: "KARNA",
    description: "ISL: Both C-hands move side to side",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.5, rightForearmBend: 0.4, rightHandPose: 0.5, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.4, leftHandPose: 0.5, rightArmSpread: -0.2 },
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.5, rightForearmBend: 0.4, rightHandPose: 0.5, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.4, leftHandPose: 0.5, rightArmSpread: 0.2 },
    ],
  },
  live: {
    type: "gesture", label: "JEENA",
    description: "ISL: L-hands move up chest",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.3, rightArmForward: 0.3, rightForearmBend: 0.6, rightHandPose: 0.1, leftArmAngle: 0.3, leftArmForward: 0.3, leftForearmBend: 0.6, leftHandPose: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.3, rightForearmBend: 0.5, rightHandPose: 0.1, leftArmAngle: 0.7, leftArmForward: 0.3, leftForearmBend: 0.5, leftHandPose: 0.1 },
    ],
  },
  welcome: {
    type: "gesture", label: "SWAGAT",
    description: "ISL: Both open hands sweep inward, namaste gesture",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.6, rightArmSpread: 0.4, rightForearmBend: 0.3, rightHandPose: 0, leftArmAngle: 0.8, leftArmForward: 0.6, leftArmSpread: -0.4, leftForearmBend: 0.3, leftHandPose: 0, eyebrowRaise: 0.5, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.4, rightForearmBend: 0.8, rightHandPose: 0, leftArmAngle: 0.7, leftArmForward: 0.4, leftForearmBend: 0.8, leftHandPose: 0, eyebrowRaise: 0.4, headNod: 0.2 },
    ],
  },
  nice: {
    type: "gesture", label: "ACCHA",
    description: "ISL: Flat hand slides off palm forward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.4, rightForearmBend: 0.6, rightHandPose: 0, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0, eyebrowRaise: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.7, rightForearmBend: 0.3, rightHandPose: 0, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0, eyebrowRaise: 0.4, mouthOpen: 0.2 },
    ],
  },
  meet: {
    type: "gesture", label: "MILNA",
    description: "ISL: Both index fingers approach each other and touch",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightArmSpread: 0.3, rightForearmBend: 0.4, rightHandPose: 0.2, leftArmAngle: 0.7, leftArmForward: 0.5, leftArmSpread: -0.3, leftForearmBend: 0.4, leftHandPose: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.2, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 0.2, eyebrowRaise: 0.3, mouthOpen: 0.2 },
    ],
  },
  beautiful: {
    type: "gesture", label: "SUNDAR",
    description: "ISL: Open hand circles face, then closes — beauty",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0, eyebrowRaise: 0.4, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.3, rightArmSpread: 0.2, rightForearmBend: 0.8, rightHandPose: 0.8, eyebrowRaise: 0.5 },
    ],
  },
  again: {
    type: "gesture", label: "PHIR SE",
    description: "ISL: Bent hand arcs into flat palm",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.4, rightHandPose: 0.4, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 0.4, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0 },
    ],
  },

  // ═══ GRAMMAR WORDS (ISL) ═══
  are: {
    type: "gesture", label: "HAI",
    description: "ISL: R-hand moves forward from lips",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0.2, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.7, rightForearmBend: 0.3, rightHandPose: 0.2 },
    ],
  },
  is: {
    type: "gesture", label: "HAI",
    description: "ISL: Hand moves forward from chin",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0.85, mouthOpen: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.6, rightForearmBend: 0.4, rightHandPose: 0.85 },
    ],
  },

  // ═══ COMMON PHRASES (ISL) ═══
  india: {
    type: "gesture", label: "BHARAT",
    description: "ISL: Index finger touches center of forehead (bindi position)",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.2, rightForearmBend: 0.9, rightHandPose: 0.2, headNod: 0.1 },
    ],
  },
  deaf: {
    type: "gesture", label: "BADHIR",
    description: "ISL: Index finger points to ear then mouth, closes",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.1, rightArmSpread: 0.3, rightForearmBend: 0.8, rightHandPose: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.25, rightForearmBend: 0.85, rightHandPose: 0.8, mouthOpen: 0.1 },
    ],
  },
  sign: {
    type: "gesture", label: "SANKET",
    description: "ISL: Both index fingers circle alternately",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.2, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.4, rightHandPose: 0.2, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.6, leftHandPose: 0.2 },
    ],
  },
  language: {
    type: "gesture", label: "BHAASHA",
    description: "ISL: Both L-hands move apart from center",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.1, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightArmSpread: 0.4, rightForearmBend: 0.4, rightHandPose: 0.1, leftArmAngle: 0.7, leftArmForward: 0.5, leftArmSpread: -0.4, leftForearmBend: 0.4, leftHandPose: 0.1 },
    ],
  },
  learn: {
    type: "gesture", label: "SEEKHNA",
    description: "ISL: Hand picks up from palm and brings to forehead",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.2, rightForearmBend: 0.8, rightHandPose: 0.6, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0, eyebrowRaise: 0.3 },
    ],
  },
  teach: {
    type: "gesture", label: "PADHANA",
    description: "ISL: Both flat hands push forward from head",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0, leftArmAngle: 1.0, leftArmForward: 0.3, leftForearmBend: 0.7, leftHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.7, rightForearmBend: 0.3, rightHandPose: 0, leftArmAngle: 0.8, leftArmForward: 0.7, leftForearmBend: 0.3, leftHandPose: 0 },
    ],
  },
};

export function getSignForWord(word: string): WordSign {
  const lower = word.toLowerCase().replace(/[^a-z]/g, "");
  if (COMMON_WORDS[lower]) return COMMON_WORDS[lower];

  // Finger-spell
  const poses = lower.split("").map((l) => ASL_ALPHABET[l]).filter(Boolean);
  return {
    type: "fingerspell",
    label: lower.toUpperCase(),
    poses,
    description: `Finger-spell: ${lower.toUpperCase()}`,
  };
}

export { REST_POSE };
