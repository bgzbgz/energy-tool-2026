// Pillar names for the 4 energy categories
export const PILLAR_NAMES = ['sleep', 'food', 'movement', 'brain'] as const;

export type PillarName = typeof PILLAR_NAMES[number];

// Vague words to detect in commitments
export const VAGUE_WORDS = [
  'better',
  'more',
  'less',
  'try to',
  'hopefully',
  'maybe',
  'might',
  'should',
  'could',
  'eventually',
  'improve',
  'increase',
  'decrease',
  'reduce',
];

// Minimum character counts for validation
export const MIN_CHARS = {
  HABITS: 50,
  DRAIN: 100,
  COMMITMENT: 100,
  FIRST_WIN: 50,
  IMPACT: 10,
  TIMES: 5,
  PARTNER: 2,
} as const;

// Rating constraints
export const RATING = {
  MIN: 1,
  MAX: 10,
} as const;

