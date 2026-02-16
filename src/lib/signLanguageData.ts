// American Sign Language (ASL) data with full body avatar poses
// Based on standard ASL conventions
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

// ASL Alphabet — dominant hand raised in front of shoulder, palm forward
function letterPose(handPose: number, extras?: Partial<AvatarPose>): AvatarPose {
  return {
    ...REST_POSE,
    rightArmAngle: 1.0,
    rightArmForward: 0.6,
    rightForearmBend: 0.7,
    rightHandPose: handPose,
    rightWristTilt: 0,
    ...extras,
  };
}

export const ASL_ALPHABET: Record<string, AvatarPose> = {
  a: letterPose(1.0),                                          // fist, thumb beside
  b: letterPose(0.0, { rightWristTilt: 0.1 }),                 // flat hand, fingers up
  c: letterPose(0.5),                                          // curved hand
  d: letterPose(0.3, { rightWristTilt: 0.2 }),                 // index up, others curved to thumb
  e: letterPose(0.85),                                         // fingers curled, thumb across
  f: letterPose(0.6, { rightWristTilt: 0.1 }),                 // OK shape, 3 fingers up
  g: letterPose(0.3, { rightArmForward: 0.8, rightForearmBend: 0.4 }), // index+thumb point sideways
  h: letterPose(0.2, { rightArmForward: 0.8, rightForearmBend: 0.4 }), // index+middle sideways
  i: letterPose(0.9, { rightWristTilt: -0.1 }),                // fist, pinky up
  j: letterPose(0.9, { rightWristTilt: -0.3 }),                // pinky traces J
  k: letterPose(0.25, { rightWristTilt: 0.2 }),                // index+middle up, thumb between
  l: letterPose(0.1, { rightWristTilt: 0 }),                   // L-shape: index+thumb
  m: letterPose(0.95, { rightWristTilt: -0.15 }),              // fist, 3 fingers over thumb
  n: letterPose(0.9, { rightWristTilt: -0.1 }),                // fist, 2 fingers over thumb
  o: letterPose(0.6),                                          // O-shape
  p: letterPose(0.3, { rightArmAngle: 0.7, rightWristTilt: -0.4 }),  // K pointing down
  q: letterPose(0.4, { rightArmAngle: 0.6, rightWristTilt: -0.5 }),  // G pointing down
  r: letterPose(0.2, { rightWristTilt: 0.1 }),                 // crossed fingers
  s: letterPose(1.0),                                          // fist, thumb across front
  t: letterPose(0.95),                                         // fist, thumb between index+middle
  u: letterPose(0.15),                                         // index+middle together up
  v: letterPose(0.15, { rightWristTilt: 0.1 }),                // V-shape spread
  w: letterPose(0.1),                                          // 3 fingers spread
  x: letterPose(0.75),                                         // index hooked
  y: letterPose(0.2, { rightWristTilt: -0.3 }),                // thumb+pinky out (hang loose)
  z: letterPose(0.2, { rightWristTilt: 0.3 }),                 // index traces Z
};

// ─── ASL Common Word Signs ──────────────────────────────────────
export const COMMON_WORDS: Record<string, WordSign> = {

  // ═══ GREETINGS ═══
  hello: {
    type: "gesture", label: "HELLO",
    description: "ASL: Open hand at forehead, moves outward like a salute wave",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.3, rightArmForward: 0.2, rightArmSpread: 0.2, rightForearmBend: 0.7, rightHandPose: 0, eyebrowRaise: 0.4, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 1.3, rightArmForward: 0.5, rightArmSpread: 0.4, rightForearmBend: 0.4, rightHandPose: 0, eyebrowRaise: 0.3 },
    ],
  },
  hi: {
    type: "gesture", label: "HI",
    description: "ASL: Open hand raised, small wave side to side",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.4, rightArmForward: 0.3, rightForearmBend: 0.3, rightHandPose: 0, rightArmSpread: 0.2, eyebrowRaise: 0.4, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 1.4, rightArmForward: 0.3, rightForearmBend: 0.3, rightHandPose: 0, rightArmSpread: -0.2, eyebrowRaise: 0.3 },
      { ...REST_POSE, rightArmAngle: 1.4, rightArmForward: 0.3, rightForearmBend: 0.3, rightHandPose: 0, rightArmSpread: 0.2, eyebrowRaise: 0.4 },
    ],
  },
  goodbye: {
    type: "gesture", label: "GOODBYE",
    description: "ASL: Open hand raised, fingers bend open and closed repeatedly",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.4, rightArmForward: 0.4, rightForearmBend: 0.3, rightHandPose: 0, eyebrowRaise: 0.3, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 1.4, rightArmForward: 0.4, rightForearmBend: 0.3, rightHandPose: 0.7 },
      { ...REST_POSE, rightArmAngle: 1.4, rightArmForward: 0.4, rightForearmBend: 0.3, rightHandPose: 0 },
    ],
  },
  bye: {
    type: "gesture", label: "BYE",
    description: "ASL: Open hand waves",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.4, rightArmForward: 0.4, rightForearmBend: 0.3, rightHandPose: 0, rightArmSpread: 0.2 },
      { ...REST_POSE, rightArmAngle: 1.4, rightArmForward: 0.4, rightForearmBend: 0.3, rightHandPose: 0, rightArmSpread: -0.2 },
      { ...REST_POSE, rightArmAngle: 1.4, rightArmForward: 0.4, rightForearmBend: 0.3, rightHandPose: 0, rightArmSpread: 0.2 },
    ],
  },

  // ═══ COURTESY ═══
  thank: {
    type: "gesture", label: "THANK YOU",
    description: "ASL: Flat hand touches chin, then moves forward and down",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.2, rightForearmBend: 0.9, rightHandPose: 0, headNod: 0.2, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.7, rightForearmBend: 0.3, rightHandPose: 0, headNod: -0.1 },
    ],
  },
  thanks: {
    type: "gesture", label: "THANK YOU",
    description: "ASL: Flat hand from chin forward",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.2, rightForearmBend: 0.9, rightHandPose: 0, headNod: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.7, rightForearmBend: 0.3, rightHandPose: 0, headNod: -0.1 },
    ],
  },
  please: {
    type: "gesture", label: "PLEASE",
    description: "ASL: Flat hand circles on chest",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0, headNod: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.2, rightArmSpread: 0.15, rightForearmBend: 0.7, rightHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0 },
    ],
  },
  sorry: {
    type: "gesture", label: "SORRY",
    description: "ASL: Fist (A-hand) circles on chest",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 1, headNod: -0.2, eyebrowRaise: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.2, rightArmSpread: 0.15, rightForearmBend: 0.7, rightHandPose: 1, headNod: -0.3 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 1, headNod: -0.2 },
    ],
  },

  // ═══ BASIC RESPONSES ═══
  yes: {
    type: "gesture", label: "YES",
    description: "ASL: S-hand (fist) nods up and down like a head nodding",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 1, rightWristTilt: 0.3, headNod: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 1, rightWristTilt: -0.3, headNod: -0.1 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 1, rightWristTilt: 0.3, headNod: 0.3 },
    ],
  },
  no: {
    type: "gesture", label: "NO",
    description: "ASL: Index and middle finger snap to thumb (like closing)",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.15, headTurn: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.8, headTurn: -0.1 },
    ],
  },
  ok: {
    type: "gesture", label: "OK",
    description: "ASL: Fingerspell O-K",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.6, rightForearmBend: 0.6, rightHandPose: 0.6, headNod: 0.2, eyebrowRaise: 0.3 },
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.6, rightForearmBend: 0.6, rightHandPose: 0.25, headNod: 0.1 },
    ],
  },
  good: {
    type: "gesture", label: "GOOD",
    description: "ASL: Flat hand touches chin, then drops into other palm",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.2, rightForearmBend: 0.9, rightHandPose: 0, mouthOpen: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.6, rightForearmBend: 0.4, rightHandPose: 0, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0, eyebrowRaise: 0.3, mouthOpen: 0.2 },
    ],
  },
  bad: {
    type: "gesture", label: "BAD",
    description: "ASL: Flat hand touches chin then flips palm down",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.2, rightForearmBend: 0.9, rightHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.6, rightForearmBend: 0.4, rightHandPose: 0, rightWristTilt: -0.6, headNod: -0.2 },
    ],
  },

  // ═══ PRONOUNS ═══
  i: {
    type: "gesture", label: "I / ME",
    description: "ASL: Index finger points to own chest",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.2, rightForearmBend: 0.8, rightHandPose: 0.2, rightWristTilt: 0.4 },
    ],
  },
  me: {
    type: "gesture", label: "ME",
    description: "ASL: Index finger points to chest",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.2, rightForearmBend: 0.8, rightHandPose: 0.2, rightWristTilt: 0.4, headNod: 0.1 },
    ],
  },
  you: {
    type: "gesture", label: "YOU",
    description: "ASL: Index finger points forward at the person",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.8, rightForearmBend: 0.2, rightHandPose: 0.2 },
    ],
  },
  my: {
    type: "gesture", label: "MY",
    description: "ASL: Flat hand placed on chest",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.2, rightForearmBend: 0.7, rightHandPose: 0 },
    ],
  },
  your: {
    type: "gesture", label: "YOUR",
    description: "ASL: Flat hand pushes palm-forward toward the person",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.7, rightForearmBend: 0.2, rightHandPose: 0, eyebrowRaise: 0.2 },
    ],
  },
  we: {
    type: "gesture", label: "WE",
    description: "ASL: Index finger points to self then arcs to the side",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.3, rightArmSpread: -0.2, rightForearmBend: 0.6, rightHandPose: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.3, rightArmSpread: 0.3, rightForearmBend: 0.6, rightHandPose: 0.2 },
    ],
  },
  they: {
    type: "gesture", label: "THEY",
    description: "ASL: Index finger sweeps outward to the side",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.6, rightArmSpread: -0.2, rightForearmBend: 0.3, rightHandPose: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.6, rightArmSpread: 0.4, rightForearmBend: 0.3, rightHandPose: 0.2 },
    ],
  },
  he: {
    type: "gesture", label: "HE",
    description: "ASL: Point to the side (male reference)",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.6, rightArmSpread: 0.3, rightForearmBend: 0.2, rightHandPose: 0.2 },
    ],
  },
  she: {
    type: "gesture", label: "SHE",
    description: "ASL: Point to the side (female reference)",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.6, rightArmSpread: 0.3, rightForearmBend: 0.2, rightHandPose: 0.2 },
    ],
  },

  // ═══ QUESTION WORDS ═══
  what: {
    type: "gesture", label: "WHAT",
    description: "ASL: Both palms up, hands shake slightly — questioning face",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightArmSpread: 0.3, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.7, leftArmForward: 0.5, leftArmSpread: -0.3, leftForearmBend: 0.5, leftHandPose: 0, eyebrowRaise: 0.8, headTilt: 0.15 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightArmSpread: 0.4, rightForearmBend: 0.4, rightHandPose: 0, leftArmAngle: 0.8, leftArmForward: 0.5, leftArmSpread: -0.4, leftForearmBend: 0.4, leftHandPose: 0, eyebrowRaise: 0.9, headTilt: -0.1 },
    ],
  },
  where: {
    type: "gesture", label: "WHERE",
    description: "ASL: Index finger wags side to side, furrowed brow",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.2, rightArmSpread: -0.3, eyebrowRaise: 0.7 },
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.2, rightArmSpread: 0.3, eyebrowRaise: 0.7 },
    ],
  },
  how: {
    type: "gesture", label: "HOW",
    description: "ASL: Both fists knuckles together, roll outward and open",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.7, rightHandPose: 1, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.7, leftHandPose: 1, eyebrowRaise: 0.6 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.6, rightForearmBend: 0.4, rightHandPose: 0, rightWristTilt: -0.3, leftArmAngle: 0.8, leftArmForward: 0.6, leftForearmBend: 0.4, leftHandPose: 0, leftWristTilt: 0.3, eyebrowRaise: 0.8 },
    ],
  },
  who: {
    type: "gesture", label: "WHO",
    description: "ASL: Index finger circles near lips, mouth purses",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.2, rightForearmBend: 0.9, rightHandPose: 0.2, mouthOpen: 0.3, eyebrowRaise: 0.7 },
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.2, rightArmSpread: 0.1, rightForearmBend: 0.85, rightHandPose: 0.2, mouthOpen: 0.4, eyebrowRaise: 0.7 },
    ],
  },
  when: {
    type: "gesture", label: "WHEN",
    description: "ASL: Index finger circles then lands on other index finger",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 0.2, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 0.2, eyebrowRaise: 0.6 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.7, rightHandPose: 0.2, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 0.2, eyebrowRaise: 0.7 },
    ],
  },
  why: {
    type: "gesture", label: "WHY",
    description: "ASL: Touch forehead with fingers, then pull away into Y-hand",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.2, rightForearmBend: 0.9, rightHandPose: 0, eyebrowRaise: 0.7 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.2, rightWristTilt: -0.3, eyebrowRaise: 0.9 },
    ],
  },

  // ═══ EMOTIONS ═══
  happy: {
    type: "gesture", label: "HAPPY",
    description: "ASL: Both flat hands brush upward on chest repeatedly",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.3, rightArmForward: 0.3, rightForearmBend: 0.6, rightHandPose: 0, leftArmAngle: 0.3, leftArmForward: 0.3, leftForearmBend: 0.6, leftHandPose: 0, eyebrowRaise: 0.5 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.3, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.7, leftArmForward: 0.3, leftForearmBend: 0.5, leftHandPose: 0, eyebrowRaise: 0.8, mouthOpen: 0.4 },
      { ...REST_POSE, rightArmAngle: 0.3, rightArmForward: 0.3, rightForearmBend: 0.6, rightHandPose: 0, leftArmAngle: 0.3, leftArmForward: 0.3, leftForearmBend: 0.6, leftHandPose: 0, eyebrowRaise: 0.6 },
    ],
  },
  sad: {
    type: "gesture", label: "SAD",
    description: "ASL: Both open hands slide down from face, sad expression",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0, leftArmAngle: 1.1, leftArmForward: 0.3, leftForearmBend: 0.8, leftHandPose: 0, headNod: -0.1 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.3, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.5, leftArmForward: 0.3, leftForearmBend: 0.5, leftHandPose: 0, headNod: -0.4, mouthOpen: 0.2 },
    ],
  },
  angry: {
    type: "gesture", label: "ANGRY",
    description: "ASL: Claw hands at face pull outward, fierce expression",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0.4, leftArmAngle: 1.1, leftArmForward: 0.3, leftForearmBend: 0.8, leftHandPose: 0.4, eyebrowRaise: 0.9, mouthOpen: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.6, rightForearmBend: 0.5, rightHandPose: 0.7, leftArmAngle: 0.8, leftArmForward: 0.6, leftForearmBend: 0.5, leftHandPose: 0.7, eyebrowRaise: 1.0 },
    ],
  },
  love: {
    type: "gesture", label: "LOVE",
    description: "ASL: Both fists cross over chest (hug yourself)",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.3, rightArmSpread: 0.3, rightForearmBend: 0.5, rightHandPose: 1, leftArmAngle: 0.6, leftArmForward: 0.3, leftArmSpread: -0.3, leftForearmBend: 0.5, leftHandPose: 1 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.2, rightArmSpread: -0.1, rightForearmBend: 0.9, rightHandPose: 1, leftArmAngle: 0.5, leftArmForward: 0.2, leftArmSpread: 0.1, leftForearmBend: 0.9, leftHandPose: 1, headNod: 0.2, mouthOpen: 0.2 },
    ],
  },
  scared: {
    type: "gesture", label: "SCARED",
    description: "ASL: Both hands rise defensively, fingers spread, wide eyes",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.3, rightForearmBend: 0.6, rightHandPose: 1, leftArmAngle: 0.6, leftArmForward: 0.3, leftForearmBend: 0.6, leftHandPose: 1 },
      { ...REST_POSE, rightArmAngle: 1.2, rightArmForward: 0.5, rightArmSpread: 0.3, rightForearmBend: 0.4, rightHandPose: 0, leftArmAngle: 1.2, leftArmForward: 0.5, leftArmSpread: -0.3, leftForearmBend: 0.4, leftHandPose: 0, eyebrowRaise: 1.0, mouthOpen: 0.6 },
    ],
  },
  tired: {
    type: "gesture", label: "TIRED",
    description: "ASL: Bent hands on chest, drop and rotate down",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.3, rightForearmBend: 0.6, rightHandPose: 0.4, leftArmAngle: 0.5, leftArmForward: 0.3, leftForearmBend: 0.6, leftHandPose: 0.4, headNod: -0.1 },
      { ...REST_POSE, rightArmAngle: 0.3, rightArmForward: 0.3, rightForearmBend: 0.5, rightHandPose: 0.5, leftArmAngle: 0.3, leftArmForward: 0.3, leftForearmBend: 0.5, leftHandPose: 0.5, headNod: -0.4 },
    ],
  },
  hungry: {
    type: "gesture", label: "HUNGRY",
    description: "ASL: C-hand moves down from throat toward stomach",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.2, rightForearmBend: 0.8, rightHandPose: 0.5, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.3, rightArmForward: 0.2, rightForearmBend: 0.5, rightHandPose: 0.5 },
    ],
  },
  surprised: {
    type: "gesture", label: "SURPRISED",
    description: "ASL: Both fists near eyes flick open, wide eyes",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 1, leftArmAngle: 1.1, leftArmForward: 0.3, leftForearmBend: 0.7, leftHandPose: 1 },
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.4, rightForearmBend: 0.6, rightHandPose: 0, leftArmAngle: 1.1, leftArmForward: 0.4, leftForearmBend: 0.6, leftHandPose: 0, eyebrowRaise: 1.0, mouthOpen: 0.7 },
    ],
  },
  excited: {
    type: "gesture", label: "EXCITED",
    description: "ASL: Both open hands alternately brush up on chest",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.3, rightForearmBend: 0.6, rightHandPose: 0, leftArmAngle: 0.6, leftArmForward: 0.3, leftForearmBend: 0.5, leftHandPose: 0, eyebrowRaise: 0.7, mouthOpen: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.3, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.4, leftArmForward: 0.3, leftForearmBend: 0.6, leftHandPose: 0, eyebrowRaise: 0.9, mouthOpen: 0.5 },
    ],
  },

  // ═══ NUMBERS 1-10 (ASL) ═══
  one: {
    type: "gesture", label: "1",
    description: "ASL: Index finger raised, palm forward",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.6, rightForearmBend: 0.6, rightHandPose: 0.2 },
    ],
  },
  two: {
    type: "gesture", label: "2",
    description: "ASL: Index and middle fingers raised (V-shape), palm forward",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.6, rightForearmBend: 0.6, rightHandPose: 0.15 },
    ],
  },
  three: {
    type: "gesture", label: "3",
    description: "ASL: Thumb, index, and middle fingers up",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.6, rightForearmBend: 0.6, rightHandPose: 0.1 },
    ],
  },
  four: {
    type: "gesture", label: "4",
    description: "ASL: Four fingers up, thumb tucked across palm",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.6, rightForearmBend: 0.6, rightHandPose: 0.05 },
    ],
  },
  five: {
    type: "gesture", label: "5",
    description: "ASL: All five fingers spread open, palm forward",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.6, rightForearmBend: 0.6, rightHandPose: 0 },
    ],
  },
  six: {
    type: "gesture", label: "6",
    description: "ASL: Thumb touches pinky, other three fingers up",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.6, rightForearmBend: 0.6, rightHandPose: 0.65, rightWristTilt: -0.1 },
    ],
  },
  seven: {
    type: "gesture", label: "7",
    description: "ASL: Thumb touches ring finger, other three fingers up",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.6, rightForearmBend: 0.6, rightHandPose: 0.6 },
    ],
  },
  eight: {
    type: "gesture", label: "8",
    description: "ASL: Thumb touches middle finger, others extended",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.6, rightForearmBend: 0.6, rightHandPose: 0.55 },
    ],
  },
  nine: {
    type: "gesture", label: "9",
    description: "ASL: Thumb touches index finger, other three up",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.6, rightForearmBend: 0.6, rightHandPose: 0.5 },
    ],
  },
  ten: {
    type: "gesture", label: "10",
    description: "ASL: Thumbs-up hand (A-hand) shakes/twists",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.6, rightForearmBend: 0.6, rightHandPose: 0.9, rightWristTilt: -0.2 },
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.6, rightForearmBend: 0.6, rightHandPose: 0.9, rightWristTilt: 0.2 },
    ],
  },

  // ═══ COLORS (ASL) ═══
  red: {
    type: "gesture", label: "RED",
    description: "ASL: Index finger strokes down from lips",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.2, rightForearmBend: 0.9, rightHandPose: 0.2, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.2, rightForearmBend: 0.7, rightHandPose: 0.2 },
    ],
  },
  blue: {
    type: "gesture", label: "BLUE",
    description: "ASL: B-hand twists at wrist in front of body",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0, rightWristTilt: -0.3 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0, rightWristTilt: 0.3 },
    ],
  },
  green: {
    type: "gesture", label: "GREEN",
    description: "ASL: G-hand shakes/twists in front of body",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.6, rightForearmBend: 0.5, rightHandPose: 0.3, rightWristTilt: -0.3 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.6, rightForearmBend: 0.5, rightHandPose: 0.3, rightWristTilt: 0.3 },
    ],
  },
  yellow: {
    type: "gesture", label: "YELLOW",
    description: "ASL: Y-hand (thumb+pinky) shakes at side",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightArmSpread: 0.2, rightForearmBend: 0.5, rightHandPose: 0.2, rightWristTilt: -0.3 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightArmSpread: 0.3, rightForearmBend: 0.5, rightHandPose: 0.2, rightWristTilt: 0.3 },
    ],
  },
  white: {
    type: "gesture", label: "WHITE",
    description: "ASL: Open 5-hand on chest pulls away closing to flat O",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.7 },
    ],
  },
  black: {
    type: "gesture", label: "BLACK",
    description: "ASL: Index finger draws across forehead",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.2, rightArmSpread: -0.2, rightForearmBend: 0.9, rightHandPose: 0.2 },
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.2, rightArmSpread: 0.3, rightForearmBend: 0.9, rightHandPose: 0.2 },
    ],
  },
  orange: {
    type: "gesture", label: "ORANGE",
    description: "ASL: C-hand squeezes near chin (like squeezing an orange)",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0.5 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0.9 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0.5 },
    ],
  },
  pink: {
    type: "gesture", label: "PINK",
    description: "ASL: Middle finger of P-hand brushes down chin",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.2, rightForearmBend: 0.85, rightHandPose: 0.3, mouthOpen: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.2, rightForearmBend: 0.7, rightHandPose: 0.3 },
    ],
  },
  purple: {
    type: "gesture", label: "PURPLE",
    description: "ASL: P-hand shakes/twists in front of body",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.3, rightWristTilt: -0.3 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.3, rightWristTilt: 0.3 },
    ],
  },
  brown: {
    type: "gesture", label: "BROWN",
    description: "ASL: B-hand slides down the cheek",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.2, rightArmSpread: 0.2, rightForearmBend: 0.8, rightHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.2, rightArmSpread: 0.2, rightForearmBend: 0.7, rightHandPose: 0 },
    ],
  },

  // ═══ COMMON ACTIONS ═══
  help: {
    type: "gesture", label: "HELP",
    description: "ASL: Fist (A-hand) on flat palm, both lift upward together",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 1, leftArmAngle: 0.5, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0, eyebrowRaise: 0.4 },
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.5, rightForearmBend: 0.4, rightHandPose: 1, leftArmAngle: 0.9, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0, eyebrowRaise: 0.6 },
    ],
  },
  stop: {
    type: "gesture", label: "STOP",
    description: "ASL: Flat hand chops down onto other flat palm",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.2, rightArmForward: 0.4, rightForearmBend: 0.3, rightHandPose: 0, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0, eyebrowRaise: 0.4 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0, mouthOpen: 0.3 },
    ],
  },
  eat: {
    type: "gesture", label: "EAT",
    description: "ASL: Flattened O-hand taps mouth repeatedly",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.2, rightForearmBend: 0.8, rightHandPose: 0.6, mouthOpen: 0.3 },
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.15, rightForearmBend: 0.95, rightHandPose: 0.6, mouthOpen: 0.5 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.2, rightForearmBend: 0.8, rightHandPose: 0.6, mouthOpen: 0.3 },
    ],
  },
  drink: {
    type: "gesture", label: "DRINK",
    description: "ASL: C-hand tilts toward mouth (like holding a cup)",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0.5 },
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.2, rightForearmBend: 0.9, rightHandPose: 0.5, rightWristTilt: 0.5, mouthOpen: 0.4 },
    ],
  },
  water: {
    type: "gesture", label: "WATER",
    description: "ASL: W-hand (3 fingers) taps chin twice",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.2, rightForearmBend: 0.9, rightHandPose: 0.1 },
      { ...REST_POSE, rightArmAngle: 1.05, rightArmForward: 0.15, rightForearmBend: 0.95, rightHandPose: 0.1, mouthOpen: 0.1 },
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.2, rightForearmBend: 0.9, rightHandPose: 0.1 },
    ],
  },
  go: {
    type: "gesture", label: "GO",
    description: "ASL: Both index fingers point forward and move away from body",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.4, rightForearmBend: 0.5, rightHandPose: 0.2, leftArmAngle: 0.7, leftArmForward: 0.4, leftForearmBend: 0.5, leftHandPose: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.8, rightForearmBend: 0.2, rightHandPose: 0.2, leftArmAngle: 0.8, leftArmForward: 0.8, leftForearmBend: 0.2, leftHandPose: 0.2 },
    ],
  },
  come: {
    type: "gesture", label: "COME",
    description: "ASL: Index finger beckons inward toward body",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.7, rightForearmBend: 0.3, rightHandPose: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0.2 },
    ],
  },
  want: {
    type: "gesture", label: "WANT",
    description: "ASL: Both claw hands pull toward body",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.7, rightForearmBend: 0.4, rightHandPose: 0.4, leftArmAngle: 0.8, leftArmForward: 0.7, leftForearmBend: 0.4, leftHandPose: 0.4 },
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0.7, leftArmAngle: 0.6, leftArmForward: 0.3, leftForearmBend: 0.7, leftHandPose: 0.7 },
    ],
  },
  need: {
    type: "gesture", label: "NEED",
    description: "ASL: X-hand (hooked index) bends downward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.75 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 0.75, rightWristTilt: -0.4 },
    ],
  },
  can: {
    type: "gesture", label: "CAN",
    description: "ASL: Both S-hands (fists) move down firmly",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 1, leftArmAngle: 0.8, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 1, headNod: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 1, leftArmAngle: 0.5, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 1, headNod: -0.1 },
    ],
  },
  think: {
    type: "gesture", label: "THINK",
    description: "ASL: Index finger touches side of forehead",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.2, rightArmForward: 0.2, rightArmSpread: 0.2, rightForearmBend: 0.9, rightHandPose: 0.2, eyebrowRaise: 0.4 },
    ],
  },
  know: {
    type: "gesture", label: "KNOW",
    description: "ASL: Fingertips tap side of forehead",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.15, rightArmForward: 0.2, rightArmSpread: 0.15, rightForearmBend: 0.9, rightHandPose: 0, headNod: 0.1 },
      { ...REST_POSE, rightArmAngle: 1.2, rightArmForward: 0.15, rightArmSpread: 0.15, rightForearmBend: 0.95, rightHandPose: 0, headNod: 0.2 },
    ],
  },
  understand: {
    type: "gesture", label: "UNDERSTAND",
    description: "ASL: Index finger flicks up near forehead (light bulb moment)",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.15, rightArmForward: 0.2, rightArmSpread: 0.15, rightForearmBend: 0.9, rightHandPose: 1, headNod: -0.1 },
      { ...REST_POSE, rightArmAngle: 1.2, rightArmForward: 0.2, rightArmSpread: 0.15, rightForearmBend: 0.85, rightHandPose: 0.2, headNod: 0.2, eyebrowRaise: 0.6 },
    ],
  },
  see: {
    type: "gesture", label: "SEE",
    description: "ASL: V-hand (two fingers) points from eyes outward",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.3, rightForearmBend: 0.85, rightHandPose: 0.15 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.7, rightForearmBend: 0.4, rightHandPose: 0.15 },
    ],
  },
  hear: {
    type: "gesture", label: "HEAR",
    description: "ASL: Index finger points to ear",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.1, rightArmSpread: 0.4, rightForearmBend: 0.8, rightHandPose: 0.2, headTilt: 0.15 },
    ],
  },
  speak: {
    type: "gesture", label: "SPEAK",
    description: "ASL: Four fingers tap out from chin repeatedly",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.2, rightForearmBend: 0.85, rightHandPose: 0.05, mouthOpen: 0.4 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 0.05, mouthOpen: 0.5 },
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.2, rightForearmBend: 0.85, rightHandPose: 0.05, mouthOpen: 0.4 },
    ],
  },
  wait: {
    type: "gesture", label: "WAIT",
    description: "ASL: Both 5-hands up, palms facing in, fingers wiggle",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.9, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 0 },
    ],
  },
  sleep: {
    type: "gesture", label: "SLEEP",
    description: "ASL: Open hand slides down face, eyes close (head tilts)",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.2, rightForearmBend: 0.85, rightHandPose: 0, eyebrowRaise: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.2, rightForearmBend: 0.7, rightHandPose: 0.6, headTilt: 0.3, headNod: -0.2 },
    ],
  },
  walk: {
    type: "gesture", label: "WALK",
    description: "ASL: Two flat hands alternate forward motion (like walking feet)",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.6, rightForearmBend: 0.3, rightHandPose: 0, leftArmAngle: 0.6, leftArmForward: 0.4, leftForearmBend: 0.3, leftHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.4, rightForearmBend: 0.3, rightHandPose: 0, leftArmAngle: 0.7, leftArmForward: 0.6, leftForearmBend: 0.3, leftHandPose: 0 },
    ],
  },
  work: {
    type: "gesture", label: "WORK",
    description: "ASL: Dominant S-hand taps on top of non-dominant S-hand",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.4, rightForearmBend: 0.5, rightHandPose: 1, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.4, leftHandPose: 1 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 1, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.4, leftHandPose: 1 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.4, rightForearmBend: 0.5, rightHandPose: 1, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.4, leftHandPose: 1 },
    ],
  },

  // ═══ FAMILY ═══
  family: {
    type: "gesture", label: "FAMILY",
    description: "ASL: Both F-hands circle outward from center to form a circle",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.6, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 0.6 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightArmSpread: 0.4, rightForearmBend: 0.4, rightHandPose: 0.6, leftArmAngle: 0.7, leftArmForward: 0.5, leftArmSpread: -0.4, leftForearmBend: 0.4, leftHandPose: 0.6 },
    ],
  },
  mother: {
    type: "gesture", label: "MOTHER",
    description: "ASL: Open 5-hand, thumb taps chin",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.2, rightForearmBend: 0.85, rightHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 1.05, rightArmForward: 0.15, rightForearmBend: 0.9, rightHandPose: 0, mouthOpen: 0.1 },
    ],
  },
  father: {
    type: "gesture", label: "FATHER",
    description: "ASL: Open 5-hand, thumb taps forehead",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.15, rightArmForward: 0.2, rightForearmBend: 0.9, rightHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 1.2, rightArmForward: 0.15, rightForearmBend: 0.95, rightHandPose: 0 },
    ],
  },
  friend: {
    type: "gesture", label: "FRIEND",
    description: "ASL: Both index fingers hook together and swap positions",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.3, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 0.3, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.4, leftHandPose: 0.3, mouthOpen: 0.2 },
    ],
  },

  // ═══ TIME ═══
  morning: {
    type: "gesture", label: "MORNING",
    description: "ASL: Flat hand rises from bent arm (sun rising over horizon)",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.3, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0, leftArmAngle: 0.5, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.3, rightForearmBend: 0.4, rightHandPose: 0, leftArmAngle: 0.5, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0, eyebrowRaise: 0.4 },
    ],
  },
  night: {
    type: "gesture", label: "NIGHT",
    description: "ASL: Dominant hand arcs downward over non-dominant arm (sun setting)",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.4, rightForearmBend: 0.5, rightHandPose: 0.5, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.4, rightForearmBend: 0.7, rightHandPose: 0.5, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0 },
    ],
  },
  today: {
    type: "gesture", label: "TODAY",
    description: "ASL: Both open hands drop down at sides",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.4, rightHandPose: 0, leftArmAngle: 0.9, leftArmForward: 0.5, leftForearmBend: 0.4, leftHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.5, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 0 },
    ],
  },
  tomorrow: {
    type: "gesture", label: "TOMORROW",
    description: "ASL: A-hand (thumb up), thumb on cheek moves forward",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.2, rightArmSpread: 0.15, rightForearmBend: 0.85, rightHandPose: 0.9 },
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.5, rightArmSpread: 0.15, rightForearmBend: 0.6, rightHandPose: 0.9 },
    ],
  },
  yesterday: {
    type: "gesture", label: "YESTERDAY",
    description: "ASL: A-hand, thumb touches cheek then moves to near ear",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.3, rightArmSpread: 0.15, rightForearmBend: 0.8, rightHandPose: 0.9 },
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.1, rightArmSpread: 0.3, rightForearmBend: 0.9, rightHandPose: 0.9 },
    ],
  },

  // ═══ PLACES & THINGS ═══
  home: {
    type: "gesture", label: "HOME",
    description: "ASL: Flat O-hand touches chin then cheek (eat + sleep place)",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.2, rightForearmBend: 0.9, rightHandPose: 0.6, mouthOpen: 0.1 },
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.15, rightArmSpread: 0.2, rightForearmBend: 0.9, rightHandPose: 0.6 },
    ],
  },
  school: {
    type: "gesture", label: "SCHOOL",
    description: "ASL: Flat hands clap together twice",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.55, rightForearmBend: 0.55, rightHandPose: 0, leftArmAngle: 0.7, leftArmForward: 0.55, leftForearmBend: 0.55, leftHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 0 },
    ],
  },
  food: {
    type: "gesture", label: "FOOD",
    description: "ASL: Flat O-hand taps mouth (same as EAT)",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.2, rightForearmBend: 0.85, rightHandPose: 0.6, mouthOpen: 0.3 },
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.15, rightForearmBend: 0.9, rightHandPose: 0.6, mouthOpen: 0.5 },
    ],
  },

  // ═══ COMMON PHRASES ═══
  name: {
    type: "gesture", label: "NAME",
    description: "ASL: H-hand (two fingers) taps on the other H-hand",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 0.2, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.5, rightForearmBend: 0.55, rightHandPose: 0.2, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 0.2 },
    ],
  },
  like: {
    type: "gesture", label: "LIKE",
    description: "ASL: Thumb and middle finger pull away from chest, pinching",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0.4 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.6, rightForearmBend: 0.4, rightHandPose: 0.2, mouthOpen: 0.2 },
    ],
  },
  have: {
    type: "gesture", label: "HAVE",
    description: "ASL: Bent hands touch chest (possessive gesture)",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.4, rightForearmBend: 0.6, rightHandPose: 0.5, leftArmAngle: 0.5, leftArmForward: 0.4, leftForearmBend: 0.6, leftHandPose: 0.5 },
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.2, rightForearmBend: 0.7, rightHandPose: 0.5, leftArmAngle: 0.4, leftArmForward: 0.2, leftForearmBend: 0.7, leftHandPose: 0.5 },
    ],
  },
  not: {
    type: "gesture", label: "NOT",
    description: "ASL: Thumb under chin flicks forward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.2, rightForearmBend: 0.85, rightHandPose: 0.9, headTurn: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.9, headTurn: -0.1 },
    ],
  },
  do: {
    type: "gesture", label: "DO",
    description: "ASL: Both C-hands move side to side",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightArmSpread: -0.2, rightForearmBend: 0.4, rightHandPose: 0.5, leftArmAngle: 0.7, leftArmForward: 0.5, leftArmSpread: 0.2, leftForearmBend: 0.4, leftHandPose: 0.5 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightArmSpread: 0.2, rightForearmBend: 0.4, rightHandPose: 0.5, leftArmAngle: 0.7, leftArmForward: 0.5, leftArmSpread: -0.2, leftForearmBend: 0.4, leftHandPose: 0.5 },
    ],
  },
  welcome: {
    type: "gesture", label: "WELCOME",
    description: "ASL: Open hand sweeps inward toward body invitingly",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.7, rightArmSpread: 0.3, rightForearmBend: 0.3, rightHandPose: 0, eyebrowRaise: 0.5, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.3, rightForearmBend: 0.6, rightHandPose: 0, eyebrowRaise: 0.4, headNod: 0.2 },
    ],
  },
  nice: {
    type: "gesture", label: "NICE",
    description: "ASL: Flat right hand slides off left palm forward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.4, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0, eyebrowRaise: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.7, rightForearmBend: 0.3, rightHandPose: 0, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0, eyebrowRaise: 0.4, mouthOpen: 0.2 },
    ],
  },
  meet: {
    type: "gesture", label: "MEET",
    description: "ASL: Both index fingers approach each other and touch",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightArmSpread: 0.3, rightForearmBend: 0.5, rightHandPose: 0.2, leftArmAngle: 0.7, leftArmForward: 0.5, leftArmSpread: -0.3, leftForearmBend: 0.5, leftHandPose: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.55, rightHandPose: 0.2, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.55, leftHandPose: 0.2, eyebrowRaise: 0.3, mouthOpen: 0.2 },
    ],
  },
  beautiful: {
    type: "gesture", label: "BEAUTIFUL",
    description: "ASL: Open hand circles face then closes into flat O",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0, eyebrowRaise: 0.4, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.3, rightArmSpread: 0.2, rightForearmBend: 0.8, rightHandPose: 0.7, eyebrowRaise: 0.5 },
    ],
  },
  again: {
    type: "gesture", label: "AGAIN",
    description: "ASL: Bent hand arcs and taps into upturned flat palm",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.4, rightHandPose: 0.4, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 0.4, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0 },
    ],
  },

  // ═══ GRAMMAR WORDS ═══
  are: {
    type: "gesture", label: "ARE",
    description: "ASL: R-hand moves forward from lips",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.2, rightForearmBend: 0.85, rightHandPose: 0.2, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.6, rightForearmBend: 0.4, rightHandPose: 0.2 },
    ],
  },
  is: {
    type: "gesture", label: "IS",
    description: "ASL: I-hand (pinky out fist) moves forward from chin",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.2, rightForearmBend: 0.85, rightHandPose: 0.9 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.6, rightForearmBend: 0.4, rightHandPose: 0.9 },
    ],
  },
  sign: {
    type: "gesture", label: "SIGN",
    description: "ASL: Both index fingers circle alternately in front of body",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.2, leftArmAngle: 0.8, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.4, rightHandPose: 0.2, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.6, leftHandPose: 0.2 },
    ],
  },
  language: {
    type: "gesture", label: "LANGUAGE",
    description: "ASL: Both L-hands (thumb+index) move apart from center",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.1, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightArmSpread: 0.4, rightForearmBend: 0.4, rightHandPose: 0.1, leftArmAngle: 0.7, leftArmForward: 0.5, leftArmSpread: -0.4, leftForearmBend: 0.4, leftHandPose: 0.1 },
    ],
  },
  learn: {
    type: "gesture", label: "LEARN",
    description: "ASL: Hand picks up from flat palm and brings to forehead",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.2, rightForearmBend: 0.85, rightHandPose: 0.6, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0, eyebrowRaise: 0.3 },
    ],
  },
  teach: {
    type: "gesture", label: "TEACH",
    description: "ASL: Both flat O-hands at forehead push forward and open",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0.6, leftArmAngle: 1.1, leftArmForward: 0.3, leftForearmBend: 0.7, leftHandPose: 0.6 },
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.7, rightForearmBend: 0.3, rightHandPose: 0, leftArmAngle: 0.9, leftArmForward: 0.7, leftForearmBend: 0.3, leftHandPose: 0 },
    ],
  },
  live: {
    type: "gesture", label: "LIVE",
    description: "ASL: Both L-hands move up body from waist to chest",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.3, rightArmForward: 0.3, rightForearmBend: 0.6, rightHandPose: 0.1, leftArmAngle: 0.3, leftArmForward: 0.3, leftForearmBend: 0.6, leftHandPose: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.3, rightForearmBend: 0.5, rightHandPose: 0.1, leftArmAngle: 0.7, leftArmForward: 0.3, leftForearmBend: 0.5, leftHandPose: 0.1 },
    ],
  },
  deaf: {
    type: "gesture", label: "DEAF",
    description: "ASL: Index finger points to ear then to mouth (or chin)",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.1, rightArmForward: 0.1, rightArmSpread: 0.3, rightForearmBend: 0.8, rightHandPose: 0.2 },
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.2, rightForearmBend: 0.85, rightHandPose: 0.2, mouthOpen: 0.1 },
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
