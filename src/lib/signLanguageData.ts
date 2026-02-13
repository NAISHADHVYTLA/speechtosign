// ASL finger-spelling hand pose data and common word signs
// Each pose is an array of finger rotations [thumb, index, middle, ring, pinky]
// Values: 0 = extended, 1 = closed/fist, 0.5 = half-bent

export interface HandPose {
  fingers: [number, number, number, number, number]; // curl amount 0-1
  thumbRotation: number; // -1 to 1 (across palm to outward)
  wristRotation: number; // rotation around wrist axis
  wristTilt: number; // tilt up/down
}

// ASL Alphabet finger-spelling poses
export const ASL_ALPHABET: Record<string, HandPose> = {
  a: { fingers: [0.3, 1, 1, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0 },
  b: { fingers: [1, 0, 0, 0, 0], thumbRotation: -0.5, wristRotation: 0, wristTilt: 0 },
  c: { fingers: [0.5, 0.5, 0.5, 0.5, 0.5], thumbRotation: 0.3, wristRotation: 0, wristTilt: 0 },
  d: { fingers: [0.8, 0, 1, 1, 1], thumbRotation: 0.3, wristRotation: 0, wristTilt: 0 },
  e: { fingers: [0.7, 0.8, 0.8, 0.8, 0.8], thumbRotation: 0.2, wristRotation: 0, wristTilt: 0 },
  f: { fingers: [0.8, 0.8, 0, 0, 0], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0 },
  g: { fingers: [0.3, 0, 1, 1, 1], thumbRotation: 0.2, wristRotation: 0.5, wristTilt: 0 },
  h: { fingers: [0.3, 0, 0, 1, 1], thumbRotation: 0.2, wristRotation: 0.5, wristTilt: 0 },
  i: { fingers: [1, 1, 1, 1, 0], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0 },
  j: { fingers: [1, 1, 1, 1, 0], thumbRotation: 0.5, wristRotation: 0.3, wristTilt: 0.3 },
  k: { fingers: [0.3, 0, 0.3, 1, 1], thumbRotation: 0.3, wristRotation: 0, wristTilt: 0 },
  l: { fingers: [0, 0, 1, 1, 1], thumbRotation: -0.5, wristRotation: 0, wristTilt: 0 },
  m: { fingers: [0.7, 0.9, 0.9, 0.9, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0 },
  n: { fingers: [0.7, 0.9, 0.9, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0 },
  o: { fingers: [0.6, 0.6, 0.6, 0.6, 0.6], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0 },
  p: { fingers: [0.3, 0, 0.3, 1, 1], thumbRotation: 0.3, wristRotation: 0, wristTilt: -0.5 },
  q: { fingers: [0.3, 0, 1, 1, 1], thumbRotation: 0.3, wristRotation: 0, wristTilt: -0.5 },
  r: { fingers: [1, 0, 0, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0 },
  s: { fingers: [0.5, 1, 1, 1, 1], thumbRotation: 0.7, wristRotation: 0, wristTilt: 0 },
  t: { fingers: [0.5, 0.9, 1, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0 },
  u: { fingers: [1, 0, 0, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0 },
  v: { fingers: [1, 0, 0, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0 },
  w: { fingers: [1, 0, 0, 0, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0 },
  x: { fingers: [1, 0.5, 1, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0 },
  y: { fingers: [0, 1, 1, 1, 0], thumbRotation: -0.5, wristRotation: 0, wristTilt: 0 },
  z: { fingers: [1, 0, 1, 1, 1], thumbRotation: 0.5, wristRotation: 0.3, wristTilt: 0 },
};

// Common words with sign animations (simplified as sequences of poses + movements)
export interface WordSign {
  type: "fingerspell" | "gesture";
  label: string;
  poses?: HandPose[];
  description: string;
}

export const COMMON_WORDS: Record<string, WordSign> = {
  hello: {
    type: "gesture",
    label: "HELLO",
    description: "Open hand wave near forehead",
    poses: [
      { fingers: [0, 0, 0, 0, 0], thumbRotation: -0.3, wristRotation: -0.3, wristTilt: 0.3 },
      { fingers: [0, 0, 0, 0, 0], thumbRotation: -0.3, wristRotation: 0.3, wristTilt: 0.3 },
      { fingers: [0, 0, 0, 0, 0], thumbRotation: -0.3, wristRotation: -0.3, wristTilt: 0.3 },
    ],
  },
  thank: {
    type: "gesture",
    label: "THANK YOU",
    description: "Flat hand from chin outward",
    poses: [
      { fingers: [0, 0, 0, 0, 0], thumbRotation: 0, wristRotation: 0, wristTilt: 0.5 },
      { fingers: [0, 0, 0, 0, 0], thumbRotation: 0, wristRotation: 0, wristTilt: -0.3 },
    ],
  },
  thanks: {
    type: "gesture",
    label: "THANK YOU",
    description: "Flat hand from chin outward",
    poses: [
      { fingers: [0, 0, 0, 0, 0], thumbRotation: 0, wristRotation: 0, wristTilt: 0.5 },
      { fingers: [0, 0, 0, 0, 0], thumbRotation: 0, wristRotation: 0, wristTilt: -0.3 },
    ],
  },
  yes: {
    type: "gesture",
    label: "YES",
    description: "Fist nodding",
    poses: [
      { fingers: [0.5, 1, 1, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0.3 },
      { fingers: [0.5, 1, 1, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: -0.3 },
      { fingers: [0.5, 1, 1, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0.3 },
    ],
  },
  no: {
    type: "gesture",
    label: "NO",
    description: "Index and middle finger snap to thumb",
    poses: [
      { fingers: [0.3, 0, 0, 1, 1], thumbRotation: -0.3, wristRotation: 0, wristTilt: 0 },
      { fingers: [0.8, 0.8, 0.8, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0 },
    ],
  },
  please: {
    type: "gesture",
    label: "PLEASE",
    description: "Flat hand circles on chest",
    poses: [
      { fingers: [0, 0, 0, 0, 0], thumbRotation: 0, wristRotation: -0.2, wristTilt: 0 },
      { fingers: [0, 0, 0, 0, 0], thumbRotation: 0, wristRotation: 0.2, wristTilt: 0.2 },
      { fingers: [0, 0, 0, 0, 0], thumbRotation: 0, wristRotation: -0.2, wristTilt: 0 },
    ],
  },
  help: {
    type: "gesture",
    label: "HELP",
    description: "Fist on flat palm, lift up",
    poses: [
      { fingers: [0.5, 1, 1, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: -0.3 },
      { fingers: [0.5, 1, 1, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0.5 },
    ],
  },
  sorry: {
    type: "gesture",
    label: "SORRY",
    description: "Fist circles on chest",
    poses: [
      { fingers: [0.5, 1, 1, 1, 1], thumbRotation: 0.5, wristRotation: -0.2, wristTilt: 0 },
      { fingers: [0.5, 1, 1, 1, 1], thumbRotation: 0.5, wristRotation: 0.2, wristTilt: 0.2 },
      { fingers: [0.5, 1, 1, 1, 1], thumbRotation: 0.5, wristRotation: -0.2, wristTilt: 0 },
    ],
  },
  good: {
    type: "gesture",
    label: "GOOD",
    description: "Flat hand from chin forward",
    poses: [
      { fingers: [0, 0, 0, 0, 0], thumbRotation: 0, wristRotation: 0, wristTilt: 0.4 },
      { fingers: [0, 0, 0, 0, 0], thumbRotation: 0, wristRotation: 0, wristTilt: -0.2 },
    ],
  },
  bad: {
    type: "gesture",
    label: "BAD",
    description: "Flat hand from chin downward",
    poses: [
      { fingers: [0, 0, 0, 0, 0], thumbRotation: 0, wristRotation: 0, wristTilt: 0.3 },
      { fingers: [0, 0, 0, 0, 0], thumbRotation: 0, wristRotation: 0, wristTilt: -0.5 },
    ],
  },
  love: {
    type: "gesture",
    label: "I LOVE YOU",
    description: "ILY handshape",
    poses: [
      { fingers: [0, 0, 1, 1, 0], thumbRotation: -0.5, wristRotation: 0, wristTilt: 0 },
    ],
  },
  you: {
    type: "gesture",
    label: "YOU",
    description: "Point forward",
    poses: [
      { fingers: [1, 0, 1, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0 },
    ],
  },
  me: {
    type: "gesture",
    label: "ME",
    description: "Point to self",
    poses: [
      { fingers: [1, 0, 1, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0.4 },
    ],
  },
  i: {
    type: "gesture",
    label: "I/ME",
    description: "Point to self",
    poses: [
      { fingers: [1, 0, 1, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0.4 },
    ],
  },
  what: {
    type: "gesture",
    label: "WHAT",
    description: "Open palms shake",
    poses: [
      { fingers: [0, 0, 0, 0, 0], thumbRotation: 0, wristRotation: -0.3, wristTilt: 0 },
      { fingers: [0, 0, 0, 0, 0], thumbRotation: 0, wristRotation: 0.3, wristTilt: 0 },
    ],
  },
  where: {
    type: "gesture",
    label: "WHERE",
    description: "Index finger wags",
    poses: [
      { fingers: [1, 0, 1, 1, 1], thumbRotation: 0.5, wristRotation: -0.3, wristTilt: 0 },
      { fingers: [1, 0, 1, 1, 1], thumbRotation: 0.5, wristRotation: 0.3, wristTilt: 0 },
    ],
  },
  how: {
    type: "gesture",
    label: "HOW",
    description: "Fists roll outward",
    poses: [
      { fingers: [0.5, 1, 1, 1, 1], thumbRotation: 0.5, wristRotation: -0.3, wristTilt: -0.3 },
      { fingers: [0, 0, 0, 0, 0], thumbRotation: 0, wristRotation: 0, wristTilt: 0.3 },
    ],
  },
  name: {
    type: "gesture",
    label: "NAME",
    description: "Two fingers tap",
    poses: [
      { fingers: [1, 0, 0, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0 },
      { fingers: [1, 0, 0, 1, 1], thumbRotation: 0.5, wristRotation: 0.2, wristTilt: 0 },
    ],
  },
  want: {
    type: "gesture",
    label: "WANT",
    description: "Claw hands pull toward body",
    poses: [
      { fingers: [0.4, 0.4, 0.4, 0.4, 0.4], thumbRotation: 0, wristRotation: 0, wristTilt: -0.2 },
      { fingers: [0.6, 0.6, 0.6, 0.6, 0.6], thumbRotation: 0.3, wristRotation: 0, wristTilt: 0.2 },
    ],
  },
  need: {
    type: "gesture",
    label: "NEED",
    description: "X hand bends down",
    poses: [
      { fingers: [1, 0.5, 1, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0 },
      { fingers: [1, 0.5, 1, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: -0.4 },
    ],
  },
  can: {
    type: "gesture",
    label: "CAN",
    description: "Fists move down together",
    poses: [
      { fingers: [0.5, 1, 1, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0 },
      { fingers: [0.5, 1, 1, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: -0.4 },
    ],
  },
  go: {
    type: "gesture",
    label: "GO",
    description: "Index fingers point forward",
    poses: [
      { fingers: [1, 0, 1, 1, 1], thumbRotation: 0.5, wristRotation: -0.2, wristTilt: 0 },
      { fingers: [1, 0, 1, 1, 1], thumbRotation: 0.5, wristRotation: 0.3, wristTilt: 0 },
    ],
  },
  stop: {
    type: "gesture",
    label: "STOP",
    description: "Flat hand chops down",
    poses: [
      { fingers: [0, 0, 0, 0, 0], thumbRotation: 0, wristRotation: 0, wristTilt: 0.3 },
      { fingers: [0, 0, 0, 0, 0], thumbRotation: 0, wristRotation: 0, wristTilt: -0.3 },
    ],
  },
  eat: {
    type: "gesture",
    label: "EAT",
    description: "Fingers to mouth",
    poses: [
      { fingers: [0.6, 0.6, 0.6, 0.6, 0.6], thumbRotation: 0.3, wristRotation: 0, wristTilt: 0.3 },
      { fingers: [0.6, 0.6, 0.6, 0.6, 0.6], thumbRotation: 0.3, wristRotation: 0, wristTilt: 0.5 },
    ],
  },
  drink: {
    type: "gesture",
    label: "DRINK",
    description: "C hand tips to mouth",
    poses: [
      { fingers: [0.5, 0.5, 0.5, 0.5, 0.5], thumbRotation: 0.3, wristRotation: 0, wristTilt: 0 },
      { fingers: [0.5, 0.5, 0.5, 0.5, 0.5], thumbRotation: 0.3, wristRotation: 0, wristTilt: 0.5 },
    ],
  },
  water: {
    type: "gesture",
    label: "WATER",
    description: "W hand taps chin",
    poses: [
      { fingers: [1, 0, 0, 0, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0.3 },
      { fingers: [1, 0, 0, 0, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0.4 },
    ],
  },
  friend: {
    type: "gesture",
    label: "FRIEND",
    description: "Index fingers hook together",
    poses: [
      { fingers: [1, 0.5, 1, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0 },
      { fingers: [1, 0.5, 1, 1, 1], thumbRotation: 0.5, wristRotation: 0.3, wristTilt: 0 },
    ],
  },
  happy: {
    type: "gesture",
    label: "HAPPY",
    description: "Flat hand brushes up on chest",
    poses: [
      { fingers: [0, 0, 0, 0, 0], thumbRotation: 0, wristRotation: 0, wristTilt: -0.2 },
      { fingers: [0, 0, 0, 0, 0], thumbRotation: 0, wristRotation: 0, wristTilt: 0.4 },
    ],
  },
  sad: {
    type: "gesture",
    label: "SAD",
    description: "Open hands slide down face",
    poses: [
      { fingers: [0, 0, 0, 0, 0], thumbRotation: 0, wristRotation: 0, wristTilt: 0.3 },
      { fingers: [0, 0, 0, 0, 0], thumbRotation: 0, wristRotation: 0, wristTilt: -0.3 },
    ],
  },
  home: {
    type: "gesture",
    label: "HOME",
    description: "Fingers together touch cheek then jaw",
    poses: [
      { fingers: [0.6, 0.6, 0.6, 0.6, 0.6], thumbRotation: 0.3, wristRotation: 0, wristTilt: 0.3 },
      { fingers: [0.6, 0.6, 0.6, 0.6, 0.6], thumbRotation: 0.3, wristRotation: 0.2, wristTilt: 0.1 },
    ],
  },
  work: {
    type: "gesture",
    label: "WORK",
    description: "Fist taps on fist",
    poses: [
      { fingers: [0.5, 1, 1, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0 },
      { fingers: [0.5, 1, 1, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: -0.3 },
      { fingers: [0.5, 1, 1, 1, 1], thumbRotation: 0.5, wristRotation: 0, wristTilt: 0 },
    ],
  },
  school: {
    type: "gesture",
    label: "SCHOOL",
    description: "Clap hands twice",
    poses: [
      { fingers: [0, 0, 0, 0, 0], thumbRotation: 0, wristRotation: 0, wristTilt: 0 },
      { fingers: [0, 0, 0, 0, 0], thumbRotation: 0, wristRotation: 0.3, wristTilt: 0 },
      { fingers: [0, 0, 0, 0, 0], thumbRotation: 0, wristRotation: 0, wristTilt: 0 },
    ],
  },
};

// Get sign data for a word
export function getSignForWord(word: string): WordSign {
  const lower = word.toLowerCase().replace(/[^a-z]/g, "");
  
  // Check common words first
  if (COMMON_WORDS[lower]) {
    return COMMON_WORDS[lower];
  }

  // Fall back to finger-spelling
  const poses = lower.split("").map((letter) => ASL_ALPHABET[letter]).filter(Boolean);
  return {
    type: "fingerspell",
    label: lower.toUpperCase(),
    poses,
    description: `Finger-spell: ${lower.toUpperCase()}`,
  };
}
