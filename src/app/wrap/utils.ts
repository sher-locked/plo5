import wrapsData from "@/../public/data/wraps.json";

// Valid poker ranks
const VALID_RANKS = new Set(['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']);

// Types from original implementation
export interface Outs {
  ranks: string[];
  nutOuts: number;
  nutRanks: string[];
}

export interface Wrap {
  uid: string;
  drawType: string;
  outCount: number;
  outs: Outs;
  drawHand: string;
}

export interface WrapEntry {
  flop: string;
  flopArchetype: string;
  wraps: Wrap[];
}

/**
 * Normalizes a flop string to uppercase and validates format
 */
export function normalizeFlop(flop: string): string | null {
  if (!flop || typeof flop !== 'string') {
    return null;
  }

  const normalized = flop.toUpperCase().trim();
  
  // Must be exactly 3 characters
  if (normalized.length !== 3) {
    return null;
  }

  // Each character must be a valid rank
  for (const rank of normalized) {
    if (!VALID_RANKS.has(rank)) {
      return null;
    }
  }

  return normalized;
}

/**
 * Finds a specific flop in the dataset
 */
export function findFlopData(flop: string): WrapEntry | null {
  const normalizedFlop = normalizeFlop(flop);
  if (!normalizedFlop) {
    return null;
  }

  const entry = wrapsData.find((entry) => entry.flop === normalizedFlop);
  return entry ? (entry as WrapEntry) : null;
}

/**
 * Picks a random flop from the dataset (original random logic)
 */
export function pickRandomFlop(): WrapEntry {
  // Filter out flops that have no wraps to study
  const validFlops = wrapsData.filter((f) => f.wraps.length > 0);
  return validFlops[Math.floor(Math.random() * validFlops.length)] as WrapEntry;
}

/**
 * Generates quiz options for a given correct answer
 */
export function generateQuizOptions(correctAnswer: number, numOptions = 4): number[] {
  const options = new Set<number>();
  options.add(correctAnswer);

  // --- Step 1: Generate 5 options to ensure a good pool of candidates
  let attempts = 0;
  while (options.size < 5 && attempts < 10) {
    const delta = Math.floor(Math.random() * 8) - 4; // between -4 and 3
    const distractor = correctAnswer + delta;
    if (distractor > 0 && distractor !== correctAnswer) {
      options.add(distractor);
    }
    attempts++;
  }
  const commonGaps = [20, 17, 16, 13, 12, 10, 9, 8, 4, 0];
  let i = 0;
  while (options.size < 5 && i < commonGaps.length) {
    if (commonGaps[i] > 0 && !options.has(commonGaps[i])) options.add(commonGaps[i]);
    i++;
  }

  const allOptions = Array.from(options);

  if (allOptions.length <= numOptions) {
    return allOptions.sort((a, b) => b - a);
  }

  // --- Step 2: Intelligently remove the FARTHEST distractor
  let farthestDistractor = -1;
  let maxDistance = -1;

  for (const option of allOptions) {
    if (option === correctAnswer) continue;

    const distance = Math.abs(option - correctAnswer);
    if (distance > maxDistance) {
      maxDistance = distance;
      farthestDistractor = option;
    }
  }

  if (farthestDistractor !== -1) {
    const finalOptions = allOptions.filter(opt => opt !== farthestDistractor);
    return finalOptions.sort((a, b) => b - a);
  }

  // Fallback: if something went wrong, just return the first numOptions
  return allOptions.slice(0, numOptions).sort((a, b) => b - a);
} 