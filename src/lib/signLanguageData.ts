// Sign language data with full body avatar poses
// Includes arm positions, hand poses, head movements for realistic signing

export interface AvatarPose {
  // Right arm
  rightArmAngle: number;      // 0 = down, 1 = shoulder height, 1.5 = above head
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
  rightForearmBend: 0.1, rightHandPose: 0.3, rightWristTilt: 0,
  leftArmAngle: 0, leftArmForward: 0, leftArmSpread: 0,
  leftForearmBend: 0.1, leftHandPose: 0.3, leftWristTilt: 0,
  headNod: 0, headTilt: 0, headTurn: 0,
  mouthOpen: 0, eyebrowRaise: 0,
};

export interface WordSign {
  type: "fingerspell" | "gesture";
  label: string;
  poses: AvatarPose[];
  description: string;
}

// ASL Alphabet — right hand raised, different hand shapes
function letterPose(handPose: number, extras?: Partial<AvatarPose>): AvatarPose {
  return {
    ...REST_POSE,
    rightArmAngle: 0.8,
    rightArmForward: 0.4,
    rightForearmBend: 0.7,
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
  g: letterPose(0.3, { rightArmForward: 0.6 }),
  h: letterPose(0.2, { rightArmForward: 0.6 }),
  i: letterPose(0.85),
  j: letterPose(0.85, { rightWristTilt: 0.4 }),
  k: letterPose(0.3),
  l: letterPose(0.1),
  m: letterPose(0.9, { rightWristTilt: -0.2 }),
  n: letterPose(0.85, { rightWristTilt: -0.1 }),
  o: letterPose(0.6),
  p: letterPose(0.3, { rightArmAngle: 0.5 }),
  q: letterPose(0.4, { rightArmAngle: 0.4 }),
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

// Common word signs with full body animation
export const COMMON_WORDS: Record<string, WordSign> = {
  hello: {
    type: "gesture", label: "HELLO",
    description: "Open hand wave near head",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.2, rightArmForward: 0.3, rightForearmBend: 0.3, rightHandPose: 0, headNod: 0.1, eyebrowRaise: 0.5, mouthOpen: 0.3 },
      { ...REST_POSE, rightArmAngle: 1.2, rightArmForward: 0.3, rightArmSpread: 0.3, rightForearmBend: 0.3, rightHandPose: 0, headNod: 0.1, headTilt: 0.1 },
      { ...REST_POSE, rightArmAngle: 1.2, rightArmForward: 0.3, rightArmSpread: -0.2, rightForearmBend: 0.3, rightHandPose: 0, headNod: 0.1, headTilt: -0.1 },
    ],
  },
  hi: {
    type: "gesture", label: "HI",
    description: "Open hand wave",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.2, rightArmForward: 0.3, rightForearmBend: 0.3, rightHandPose: 0, eyebrowRaise: 0.6, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 1.2, rightArmForward: 0.3, rightArmSpread: 0.3, rightForearmBend: 0.3, rightHandPose: 0 },
    ],
  },
  thank: {
    type: "gesture", label: "THANK YOU",
    description: "Flat hand moves from chin forward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.8, rightHandPose: 0, rightWristTilt: 0.3, headNod: 0.2, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.8, rightForearmBend: 0.4, rightHandPose: 0, rightWristTilt: -0.2, headNod: -0.1 },
    ],
  },
  thanks: {
    type: "gesture", label: "THANK YOU",
    description: "Flat hand moves from chin forward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.5, rightForearmBend: 0.8, rightHandPose: 0, rightWristTilt: 0.3, headNod: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.8, rightForearmBend: 0.4, rightHandPose: 0, rightWristTilt: -0.2, headNod: -0.1 },
    ],
  },
  yes: {
    type: "gesture", label: "YES",
    description: "Fist nods up and down",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.4, rightForearmBend: 0.7, rightHandPose: 1, headNod: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.4, rightForearmBend: 0.5, rightHandPose: 1, headNod: -0.2 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.4, rightForearmBend: 0.7, rightHandPose: 1, headNod: 0.3 },
    ],
  },
  no: {
    type: "gesture", label: "NO",
    description: "Fingers snap closed, head shakes",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 0.2, headTurn: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 0.8, headTurn: -0.3 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 0.2, headTurn: 0.2 },
    ],
  },
  please: {
    type: "gesture", label: "PLEASE",
    description: "Flat hand circles on chest",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.3, rightForearmBend: 0.5, rightHandPose: 0, headNod: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.2, rightArmSpread: 0.2, rightForearmBend: 0.5, rightHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.3, rightForearmBend: 0.5, rightHandPose: 0, headNod: 0.1 },
    ],
  },
  help: {
    type: "gesture", label: "HELP",
    description: "Fist on flat palm lifts up",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.3, rightArmForward: 0.4, rightForearmBend: 0.4, rightHandPose: 1, leftArmAngle: 0.3, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0, eyebrowRaise: 0.4 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.4, rightForearmBend: 0.5, rightHandPose: 1, leftArmAngle: 0.5, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0, eyebrowRaise: 0.6 },
    ],
  },
  sorry: {
    type: "gesture", label: "SORRY",
    description: "Fist circles on chest",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.3, rightForearmBend: 0.6, rightHandPose: 1, headNod: -0.2, eyebrowRaise: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.2, rightArmSpread: 0.15, rightForearmBend: 0.6, rightHandPose: 1, headNod: -0.1 },
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.3, rightForearmBend: 0.6, rightHandPose: 1, headNod: -0.2 },
    ],
  },
  good: {
    type: "gesture", label: "GOOD",
    description: "Flat hand from chin forward and down",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.4, rightForearmBend: 0.7, rightHandPose: 0, headNod: 0.2, mouthOpen: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.6, rightForearmBend: 0.3, rightHandPose: 0, headNod: 0.1 },
    ],
  },
  bad: {
    type: "gesture", label: "BAD",
    description: "Flat hand from chin downward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.4, rightForearmBend: 0.7, rightHandPose: 0, headNod: -0.2 },
      { ...REST_POSE, rightArmAngle: 0.3, rightArmForward: 0.5, rightForearmBend: 0.3, rightHandPose: 0, rightWristTilt: -0.4, headNod: -0.3 },
    ],
  },
  love: {
    type: "gesture", label: "I LOVE YOU",
    description: "Arms crossed over chest then open",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 1, leftArmAngle: 0.5, leftArmForward: 0.3, leftForearmBend: 0.8, leftHandPose: 1, headNod: 0.1, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightArmSpread: 0.3, rightForearmBend: 0.4, rightHandPose: 0, leftArmAngle: 0.8, leftArmForward: 0.5, leftArmSpread: -0.3, leftForearmBend: 0.4, leftHandPose: 0, headNod: 0.2, eyebrowRaise: 0.3 },
    ],
  },
  you: {
    type: "gesture", label: "YOU",
    description: "Point forward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.8, rightForearmBend: 0.2, rightHandPose: 0.2, headNod: 0.05 },
    ],
  },
  me: {
    type: "gesture", label: "ME",
    description: "Point to self",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0.2, rightWristTilt: 0.4, headNod: 0.1 },
    ],
  },
  i: {
    type: "gesture", label: "I/ME",
    description: "Point to self",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0.2, rightWristTilt: 0.4 },
    ],
  },
  what: {
    type: "gesture", label: "WHAT",
    description: "Palms up, shrug gesture",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.5, rightArmSpread: 0.2, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.6, leftArmForward: 0.5, leftArmSpread: -0.2, leftForearmBend: 0.5, leftHandPose: 0, eyebrowRaise: 0.7, headTilt: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightArmSpread: 0.4, rightForearmBend: 0.4, rightHandPose: 0, leftArmAngle: 0.7, leftArmForward: 0.5, leftArmSpread: -0.4, leftForearmBend: 0.4, leftHandPose: 0, eyebrowRaise: 0.8, headTilt: -0.1 },
    ],
  },
  where: {
    type: "gesture", label: "WHERE",
    description: "Index finger wags side to side",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.2, rightArmSpread: -0.2, eyebrowRaise: 0.6 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.2, rightArmSpread: 0.2, eyebrowRaise: 0.6 },
    ],
  },
  how: {
    type: "gesture", label: "HOW",
    description: "Fists roll outward opening",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.5, rightForearmBend: 0.7, rightHandPose: 1, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.7, leftHandPose: 1, eyebrowRaise: 0.5 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.6, rightForearmBend: 0.4, rightHandPose: 0, leftArmAngle: 0.7, leftArmForward: 0.6, leftForearmBend: 0.4, leftHandPose: 0, eyebrowRaise: 0.7 },
    ],
  },
  name: {
    type: "gesture", label: "NAME",
    description: "Two fingers tap horizontally",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 0.3, eyebrowRaise: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.3, rightArmSpread: 0.15, eyebrowRaise: 0.3 },
    ],
  },
  want: {
    type: "gesture", label: "WANT",
    description: "Claw hands pull toward body",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.7, rightForearmBend: 0.4, rightHandPose: 0.4, leftArmAngle: 0.6, leftArmForward: 0.7, leftForearmBend: 0.4, leftHandPose: 0.4 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.4, rightForearmBend: 0.6, rightHandPose: 0.6, leftArmAngle: 0.5, leftArmForward: 0.4, leftForearmBend: 0.6, leftHandPose: 0.6 },
    ],
  },
  need: {
    type: "gesture", label: "NEED",
    description: "X hand bends downward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.7 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 0.7, rightWristTilt: -0.3 },
    ],
  },
  can: {
    type: "gesture", label: "CAN",
    description: "Both fists move down",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.4, rightForearmBend: 0.5, rightHandPose: 1, leftArmAngle: 0.6, leftArmForward: 0.4, leftForearmBend: 0.5, leftHandPose: 1, headNod: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.4, rightForearmBend: 0.5, rightHandPose: 1, leftArmAngle: 0.4, leftArmForward: 0.4, leftForearmBend: 0.5, leftHandPose: 1, headNod: -0.1 },
    ],
  },
  go: {
    type: "gesture", label: "GO",
    description: "Both hands point forward and move out",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.4, rightForearmBend: 0.5, rightHandPose: 0.2, leftArmAngle: 0.5, leftArmForward: 0.4, leftForearmBend: 0.5, leftHandPose: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.8, rightForearmBend: 0.3, rightHandPose: 0.2, leftArmAngle: 0.6, leftArmForward: 0.8, leftForearmBend: 0.3, leftHandPose: 0.2 },
    ],
  },
  stop: {
    type: "gesture", label: "STOP",
    description: "Flat hand chops down onto palm",
    poses: [
      { ...REST_POSE, rightArmAngle: 1, rightArmForward: 0.4, rightForearmBend: 0.3, rightHandPose: 0, leftArmAngle: 0.5, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.5, leftArmForward: 0.5, leftForearmBend: 0.3, leftHandPose: 0 },
    ],
  },
  eat: {
    type: "gesture", label: "EAT",
    description: "Fingers to mouth repeatedly",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0.6, mouthOpen: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.2, rightForearmBend: 0.9, rightHandPose: 0.6, mouthOpen: 0.5 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0.6, mouthOpen: 0.3 },
    ],
  },
  drink: {
    type: "gesture", label: "DRINK",
    description: "C-hand tips toward mouth",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.3, rightForearmBend: 0.6, rightHandPose: 0.5 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.2, rightForearmBend: 0.8, rightHandPose: 0.5, rightWristTilt: 0.4, mouthOpen: 0.3 },
    ],
  },
  water: {
    type: "gesture", label: "WATER",
    description: "W-hand taps chin",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0.1, mouthOpen: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.85, rightArmForward: 0.25, rightForearmBend: 0.85, rightHandPose: 0.1, mouthOpen: 0.2 },
    ],
  },
  friend: {
    type: "gesture", label: "FRIEND",
    description: "Index fingers hook and swap",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0.3, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 0.3, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 0.3, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.4, leftHandPose: 0.3, mouthOpen: 0.2 },
    ],
  },
  happy: {
    type: "gesture", label: "HAPPY",
    description: "Both hands brush upward on chest",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.3, rightArmForward: 0.3, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.3, leftArmForward: 0.3, leftForearmBend: 0.5, leftHandPose: 0, eyebrowRaise: 0.4 },
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.3, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.6, leftArmForward: 0.3, leftForearmBend: 0.5, leftHandPose: 0, eyebrowRaise: 0.7, mouthOpen: 0.3 },
    ],
  },
  sad: {
    type: "gesture", label: "SAD",
    description: "Both hands slide down face",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0, leftArmAngle: 0.9, leftArmForward: 0.3, leftForearmBend: 0.7, leftHandPose: 0, headNod: -0.1 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.3, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.5, leftArmForward: 0.3, leftForearmBend: 0.5, leftHandPose: 0, headNod: -0.3, mouthOpen: 0.2 },
    ],
  },
  home: {
    type: "gesture", label: "HOME",
    description: "Fingers together touch cheek then jaw",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.2, rightForearmBend: 0.8, rightHandPose: 0.6 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.2, rightForearmBend: 0.7, rightHandPose: 0.6, headTilt: 0.1 },
    ],
  },
  work: {
    type: "gesture", label: "WORK",
    description: "Fist taps on other fist",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.4, rightForearmBend: 0.5, rightHandPose: 1, leftArmAngle: 0.5, leftArmForward: 0.5, leftForearmBend: 0.4, leftHandPose: 1 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 1, leftArmAngle: 0.5, leftArmForward: 0.5, leftForearmBend: 0.4, leftHandPose: 1 },
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.4, rightForearmBend: 0.5, rightHandPose: 1, leftArmAngle: 0.5, leftArmForward: 0.5, leftForearmBend: 0.4, leftHandPose: 1 },
    ],
  },
  school: {
    type: "gesture", label: "SCHOOL",
    description: "Clap motion",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.5, rightForearmBend: 0.4, rightHandPose: 0, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.4, leftHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.55, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.6, leftArmForward: 0.55, leftForearmBend: 0.5, leftHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.5, rightForearmBend: 0.4, rightHandPose: 0, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.4, leftHandPose: 0 },
    ],
  },
  think: {
    type: "gesture", label: "THINK",
    description: "Index finger touches forehead",
    poses: [
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.2, rightForearmBend: 0.9, rightHandPose: 0.2, eyebrowRaise: 0.3 },
    ],
  },
  know: {
    type: "gesture", label: "KNOW",
    description: "Fingers tap forehead",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.2, rightForearmBend: 0.85, rightHandPose: 0, headNod: 0.1 },
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.15, rightForearmBend: 0.9, rightHandPose: 0, headNod: 0.15 },
    ],
  },
  understand: {
    type: "gesture", label: "UNDERSTAND",
    description: "Index finger flicks up near forehead",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.2, rightForearmBend: 0.85, rightHandPose: 0.3, headNod: -0.1 },
      { ...REST_POSE, rightArmAngle: 1.0, rightArmForward: 0.2, rightForearmBend: 0.8, rightHandPose: 0.1, headNod: 0.2, eyebrowRaise: 0.5 },
    ],
  },
  like: {
    type: "gesture", label: "LIKE",
    description: "Hand pulls away from chest with thumb and middle finger",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.3, rightForearmBend: 0.6, rightHandPose: 0.4, mouthOpen: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.5, rightArmForward: 0.6, rightForearmBend: 0.4, rightHandPose: 0.2, mouthOpen: 0.2 },
    ],
  },
  see: {
    type: "gesture", label: "SEE",
    description: "V-hand from eyes outward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0.15 },
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.7, rightForearmBend: 0.4, rightHandPose: 0.15 },
    ],
  },
  hear: {
    type: "gesture", label: "HEAR",
    description: "Index finger points to ear",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.9, rightArmForward: 0.1, rightArmSpread: 0.3, rightForearmBend: 0.8, rightHandPose: 0.2, headTilt: 0.15 },
    ],
  },
  speak: {
    type: "gesture", label: "SPEAK",
    description: "Four fingers tap near mouth",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0.1, mouthOpen: 0.3 },
      { ...REST_POSE, rightArmAngle: 0.75, rightArmForward: 0.4, rightForearmBend: 0.65, rightHandPose: 0.1, mouthOpen: 0.5 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0.1, mouthOpen: 0.3 },
    ],
  },
  wait: {
    type: "gesture", label: "WAIT",
    description: "Both hands wiggle fingers in front",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.6, rightForearmBend: 0.4, rightHandPose: 0.1, leftArmAngle: 0.6, leftArmForward: 0.6, leftForearmBend: 0.4, leftHandPose: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.6, rightForearmBend: 0.45, rightHandPose: 0.3, leftArmAngle: 0.6, leftArmForward: 0.6, leftForearmBend: 0.45, leftHandPose: 0.3 },
    ],
  },
  come: {
    type: "gesture", label: "COME",
    description: "Index finger beckons",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.7, rightForearmBend: 0.3, rightHandPose: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.4, rightForearmBend: 0.6, rightHandPose: 0.2 },
    ],
  },
  food: {
    type: "gesture", label: "FOOD",
    description: "Fingers to mouth",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.3, rightForearmBend: 0.8, rightHandPose: 0.6, mouthOpen: 0.2 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.2, rightForearmBend: 0.85, rightHandPose: 0.6, mouthOpen: 0.4 },
    ],
  },
  family: {
    type: "gesture", label: "FAMILY",
    description: "Both F-hands circle outward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.5, rightForearmBend: 0.4, rightHandPose: 0.6, leftArmAngle: 0.6, leftArmForward: 0.5, leftForearmBend: 0.4, leftHandPose: 0.6, mouthOpen: 0.1 },
      { ...REST_POSE, rightArmAngle: 0.6, rightArmForward: 0.5, rightArmSpread: 0.3, rightForearmBend: 0.4, rightHandPose: 0.6, leftArmAngle: 0.6, leftArmForward: 0.5, leftArmSpread: -0.3, leftForearmBend: 0.4, leftHandPose: 0.6 },
    ],
  },
  morning: {
    type: "gesture", label: "MORNING",
    description: "Flat hand rises from arm crook",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.3, rightArmForward: 0.3, rightForearmBend: 0.7, rightHandPose: 0, leftArmAngle: 0.4, leftArmForward: 0.4, leftForearmBend: 0.3, leftHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.3, rightForearmBend: 0.4, rightHandPose: 0, leftArmAngle: 0.4, leftArmForward: 0.4, leftForearmBend: 0.3, leftHandPose: 0, eyebrowRaise: 0.3 },
    ],
  },
  night: {
    type: "gesture", label: "NIGHT",
    description: "Hand arcs downward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.4, rightForearmBend: 0.5, rightHandPose: 0.5 },
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.4, rightForearmBend: 0.7, rightHandPose: 0.5, rightWristTilt: -0.3 },
    ],
  },
  today: {
    type: "gesture", label: "TODAY",
    description: "Both hands drop down in front",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.7, rightArmForward: 0.5, rightForearmBend: 0.4, rightHandPose: 0, leftArmAngle: 0.7, leftArmForward: 0.5, leftForearmBend: 0.4, leftHandPose: 0 },
      { ...REST_POSE, rightArmAngle: 0.4, rightArmForward: 0.5, rightForearmBend: 0.5, rightHandPose: 0, leftArmAngle: 0.4, leftArmForward: 0.5, leftForearmBend: 0.5, leftHandPose: 0 },
    ],
  },
  tomorrow: {
    type: "gesture", label: "TOMORROW",
    description: "Thumb on cheek moves forward",
    poses: [
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.2, rightForearmBend: 0.8, rightHandPose: 0.9 },
      { ...REST_POSE, rightArmAngle: 0.8, rightArmForward: 0.5, rightForearmBend: 0.6, rightHandPose: 0.9 },
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
