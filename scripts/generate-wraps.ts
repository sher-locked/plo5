#!/usr/bin/env node
/**
 * Deterministic wrap generator (Task 1.3b)
 * ---------------------------------------
 * For every rank-only flop (286 combos) we iterate **all** 5-card hole-rank combos
 * with distinct ranks (C(13,5)=1287) – that set is guaranteed to include at least
 * one hand that realises the max wrap size for that flop because duplicate ranks
 * can only reduce straight potential. Suits are ignored (straight outs are suit-
 * agnostic). For each flop we compute the maximum number of straight outs on the
 * turn and bucket the result into 20/17/16/13/9.
 *
 * Runtime: ~286 * 1287 * 45 * 4 * 10 ≈ 66 M straight checks → <20 s on a modern M-series.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const RANKS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] as const;
type Rank = (typeof RANKS)[number];

/* ---------- Combinatorics helpers ---------- */
function combos<T>(arr: readonly T[], k: number): T[][] {
  const res: T[][] = [];
  function rec(start: number, curr: T[]) {
    if (curr.length === k) {
      res.push([...curr]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      curr.push(arr[i]);
      rec(i + 1, curr);
      curr.pop();
    }
  }
  rec(0, []);
  return res;
}

/* ---------- Straight detection ---------- */
function isStraight(ranks: number[]): boolean {
  ranks.sort((a, b) => a - b);
  // no dupes allowed
  for (let i = 1; i < ranks.length; i++) if (ranks[i] === ranks[i - 1]) return false;
  // wheel special-case
  const wheel = [2, 3, 4, 5, 14];
  if (ranks.every((r, idx) => r === wheel[idx])) return true;
  // standard consecutive check
  for (let i = 1; i < ranks.length; i++) if (ranks[i] !== ranks[0] + i) return false;
  return true;
}

function hasFloppedStraight(flop: readonly Rank[], hole: readonly Rank[]): boolean {
  const holePairs = combos(hole, 2);
  for (const hp of holePairs) {
    if (isStraight([...flop, ...hp])) {
      return true;
    }
  }
  return false;
}

/* ---------- Out counter (rank-level, suit agnostic) ---------- */
function countStraightOutsTurn(flop: readonly Rank[], hole: readonly Rank[]): number {
  const holePairs = combos(hole, 2);
  const flopSet = new Set(flop);
  const holeSet = new Set(hole);
  let outs = 0;
  for (const turnRank of RANKS) {
    if (flopSet.has(turnRank) || holeSet.has(turnRank)) continue; // turn rank already on board or in hand

    const board4 = [...flop, turnRank];
    const boardTriples = combos(board4, 3);
    let qualifies = false;
    for (const board3 of boardTriples) {
      for (const hp of holePairs) {
        if (isStraight([...board3, ...hp])) {
          qualifies = true;
          break;
        }
      }
      if (qualifies) break;
    }
    if (qualifies) outs += 4; // four suits of this rank are outs
  }
  return outs;
}

function bucket(rankOuts: number): number {
  if (rankOuts >= 20) return 20;
  if (rankOuts >= 17) return 17;
  if (rankOuts >= 16) return 16;
  if (rankOuts >= 13) return 13;
  return 9;
}

// ---------- NEW: Draw Quality Analysis ----------
/**
 * Determines the type of straight draw.
 * This is a simplified classification based on the structure of the draw.
 */
function getDrawType(
  flop: readonly Rank[],
  hole: readonly Rank[],
  outRanks: readonly Rank[],
): string {
  // A "wrap" is defined by hole cards wrapping around two connected flop cards.
  const sortedFlop = [...flop].sort((a, b) => a - b);

  // More descriptive wrap types
  const flopArchetype = getFlopArchetype(flop);
  const isWrap = outRanks.length > 2;

  if (isWrap) {
    if (flopArchetype === "Wheel Draw") return "Wheel Wrap";
    const broadwayCardsOnFlop = flop.filter(r => r >= 10).length;
    if (broadwayCardsOnFlop >= 2) return "Broadway Wrap";
    return "Wrap";
  }

  // An open-ended draw has 2 out ranks and they are connected.
  if (outRanks.length === 2) {
    const sortedOuts = [...outRanks].sort((a, b) => a - b);
    if (sortedOuts[1] === sortedOuts[0] + 1) {
      return "open_ended";
    }
    // If not connected, it's a double gutshot.
    return "double_gutshot";
  }

  if (outRanks.length === 1) {
    return "gutshot";
  }

  // Default fallback for complex draws that don't fit simple categories
  return "wrap";
}

/**
 * Calculates the nuttiness of a draw.
 * @returns An object containing the count of nut outs and the ranks of those outs.
 */
function calculateNuttiness(
  flop: readonly Rank[],
  outRanks: readonly Rank[],
): { nutOuts: number; nutRanks: Rank[] } {
  let nutRanks: Rank[] = [];

  // 1. Determine the highest possible straight rank on this flop.
  let maxPossibleTopRank = 0;
  for (const r1 of RANKS) {
    for (const r2 of RANKS) {
      const fiveCards = [...flop, r1, r2];
      if (isStraight(fiveCards)) {
        const top = Math.max(...fiveCards.map((r) => (r === 14 ? 5 : r))); // Handle wheel A-5
        if (top > maxPossibleTopRank) {
          maxPossibleTopRank = top;
        }
      }
    }
  }

  // 2. An out is a "nut out" if it creates a straight with that highest rank.
  for (const out of outRanks) {
    let makesNutStraight = false;
    const boardAndOut = [...flop, out];
    const cardCombos = combos(boardAndOut, 2); // need 2 more cards to make a 5 card hand

    // This check is complex. A simpler proxy: does the out rank participate in the highest straight?
    // Let's form a straight with the out and see its top rank.
    // This requires knowing the other two cards from the hand.
    // The problem is that nuttiness depends on the *entire* 5-card holding, not just the out.
    // For now, we will use a simplified definition: an out is a nut out if it's higher than any flop card.
    // This is an imperfect but decent heuristic for now.
    if (out > Math.max(...flop)) {
      nutRanks.push(out);
    }
  }
  // A more robust solution would be to pass the hole cards.
  // We will stick to the simplified heuristic for now.
  const nutOuts = nutRanks.length * 4;
  return { nutOuts, nutRanks: [...new Set(nutRanks)].sort((a, b) => b - a) };
}

function calculateNuttinessForHand(
  flop: readonly Rank[],
  hole: readonly Rank[],
  outRanks: readonly Rank[],
): { nutOuts: number; nutRanks: Rank[] } {
  const nutRanks: Rank[] = [];

  for (const out of outRanks) {
    const board4 = [...flop, out];
    let nutStraightTopRank = 0;

    // Find the highest possible straight on this 4-card board
    const opponentHoleCombos = combos(RANKS, 2);
    for (const opponentHole of opponentHoleCombos) {
      if (
        opponentHole.includes(board4[0]) ||
        opponentHole.includes(board4[1]) ||
        opponentHole.includes(board4[2]) ||
        opponentHole.includes(board4[3])
      )
        continue;

      const boardTriples = combos(board4, 3);
      for (const b3 of boardTriples) {
        if (isStraight([...b3, ...opponentHole])) {
          const top = getStraightTopRank([...b3, ...opponentHole]);
          if (top > nutStraightTopRank) {
            nutStraightTopRank = top;
          }
        }
      }
    }

    // Now, check if our hand makes that nut straight
    if (nutStraightTopRank > 0) {
      const ourHolePairs = combos(hole, 2);
      const boardTriples = combos(board4, 3);
      for (const hp of ourHolePairs) {
        for (const b3 of boardTriples) {
          if (isStraight([...b3, ...hp])) {
            const ourTop = getStraightTopRank([...b3, ...hp]);
            if (ourTop === nutStraightTopRank) {
              nutRanks.push(out);
              break;
            }
          }
        }
        if (nutRanks.includes(out)) break;
      }
    }
    if (nutRanks.includes(out)) continue;
  }

  const holeSet = new Set(hole);
  let nutOutCount = 0;
  for (const rank of [...new Set(nutRanks)]) {
    const held = hole.filter((h) => h === rank).length;
    nutOutCount += 4 - held;
  }

  return { nutOuts: nutOutCount, nutRanks: [...new Set(nutRanks)].sort((a,b) => a - b) };
}

function getStraightTopRank(ranks: readonly Rank[]): number {
  const sortedRanks = [...ranks].sort((a,b) => a - b);
  // wheel check (A,2,3,4,5)
  const isWheel = sortedRanks[0] === 2 && sortedRanks[1] === 3 && sortedRanks[2] === 4 && sortedRanks[3] === 5 && sortedRanks[4] === 14;
  if (isWheel) {
      return 5; // Top card of a wheel is the 5.
  }
  return sortedRanks[4]; // Otherwise, just return the max rank. Ace will be 14.
}

/* ---------- Main enumerator ---------- */
function computeFlopEntry(r1: Rank, r2: Rank, r3: Rank) {
  const flop: readonly Rank[] = [r1, r2, r3].sort((a, b) => a - b);
  const wrapsByCompositeKey = new Map<string, { representativeHand: readonly Rank[], ranks: readonly Rank[], nutOuts: number, nutRanks: readonly Rank[], isClean: boolean, workingCards: Rank[] }>();

  const holeCombos = combos(RANKS, 5);
  for (const hole of holeCombos) {
    if (hasFloppedStraight(flop, hole)) continue;
    
    const outRanks = computeOutRanks(flop, hole);
    if (!isStrongDraw(flop, hole, outRanks)) continue;

    if (outRanks.length === 0) continue;

    const holeSet = new Set(hole);
    const outsInHand = outRanks.filter((r) => holeSet.has(r)).length;
    const trueOutCount = outRanks.length * 4 - outsInHand;
    if (trueOutCount === 0) continue;

    const drawType = getDrawType(flop, hole, outRanks);
    const { nutOuts, nutRanks } = calculateNuttinessForHand(flop, hole, outRanks);

    const key = `${trueOutCount}-${drawType}-${nutOuts}-${outRanks.join(",")}`;
    const currentHandIsClean = !hole.some(h => flop.includes(h));
    
    const existingEntry = wrapsByCompositeKey.get(key);
    const workingCards = getWorkingCardsForDraw(flop, hole, outRanks);

    if (!existingEntry) {
      wrapsByCompositeKey.set(key, { representativeHand: hole, ranks: outRanks, nutOuts, nutRanks, isClean: currentHandIsClean, workingCards });
    } else if (!existingEntry.isClean && currentHandIsClean) {
      // If we have an unclean hand, but this new one is clean, replace it.
      existingEntry.representativeHand = hole;
      existingEntry.isClean = true;
      existingEntry.workingCards = workingCards;
    }
    // If the existing entry is already clean, we prefer it, so we do nothing.
    // If both are unclean, we just keep the first one we found.
  }

  const allWraps = Array.from(wrapsByCompositeKey.entries()).map(([key, { representativeHand, ranks, nutOuts, nutRanks, workingCards }]) => {
    const [outCount, drawTypeKey] = key.split("-");
    const drawType = drawTypeKey.replace(/_/g, " ");

    // New logic: create hand with 'x' for non-working cards, left-indented
    const workingGlyphs = workingCards.map(rankGlyph); // Already sorted ascending
    const nonWorkingCount = 5 - workingGlyphs.length;
    const drawHandValue = [...workingGlyphs, ...Array(nonWorkingCount).fill('x')].join('');

    return {
      uid: key,
      drawType,
      outCount: parseInt(outCount, 10),
      outs: {
        ranks: [...ranks].sort((a, b) => a - b).map(rankGlyph),
        nutOuts,
        nutRanks: [...nutRanks].sort((a, b) => a - b).map(rankGlyph),
      },
      drawHand: drawHandValue,
    };
  });

  return {
    flop: flop.map(rankGlyph).join(""),
    flopArchetype: getFlopArchetype(flop),
    wraps: allWraps.sort((a, b) => b.outCount - a.outCount).slice(0, 15), // Limit to top 15 wraps per flop
  };
}

function getFlopArchetype(flop: readonly Rank[]): string {
  const sortedRanks = [...flop].sort((a, b) => a - b);
  const [r1, r2, r3] = sortedRanks;

  // Trips
  if (r1 === r2 && r2 === r3) {
    return "Trips";
  }

  // Paired
  if (r1 === r2 || r2 === r3) {
    return "Paired";
  }

  // Wheel Draw (Ace with 2,3,4, or 5)
  const isWheelDraw = r3 === 14 && (r1 <= 5 || r2 <= 5);
  if (isWheelDraw) {
    return "Wheel Draw";
  }

  // Connected
  if (r2 === r1 + 1 && r3 === r2 + 1) {
    return "Connected";
  }

  const gaps = [r2 - r1, r3 - r2].sort((a,b) => a - b); // sorted small to large

  // One-Gapper
  if (gaps[0] === 1) {
    return "One-Gapper";
  }

  // Two-Gapper
  if (gaps[0] === 2) {
    return "Two-Gapper";
  }
  
  return "Ragged";
}

/* ---------- Utilities ---------- */
function rankGlyph(rank: number): string {
  const map: Record<number, string> = {
    14: "A",
    13: "K",
    12: "Q",
    11: "J",
    10: "T",
  };
  return map[rank] ?? rank.toString();
}

function rankFromGlyph(glyph: string): number {
  const map: Record<string, number> = {
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
    T: 10,
  };
  return map[glyph] ?? parseInt(glyph, 10);
}

function patternToRanks(pattern: string): Rank[] {
  return pattern
    .replace(/x/g, "")
    .split("")
    .map((g) => rankFromGlyph(g) as Rank);
}

function main() {
  const entries = [];
  const rankCombos = combos(RANKS, 3);
  for (const [a, b, c] of rankCombos) {
    const e = computeFlopEntry(a, b, c);
    if (e.wraps.length > 0) {
      entries.push(e);
    }
  }
  console.log(`Generated ${entries.length} flops.`);
  const outDir = join(process.cwd(), "public", "data");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "wraps.json"), JSON.stringify(entries, null, 2));
}

main();

function isStrongDraw(
  flop: readonly Rank[],
  hand: readonly Rank[],
  outRanks: readonly Rank[],
): boolean {
  // A 'strong' draw must have at least 9 outs (the definition of a wrap).
  // We check against the ranks, as the true out count is calculated later.
  if (outRanks.length < 3) return false; // 3 ranks * 3 suits minimum for 9 outs

  const relevantRanks = getWorkingCardsForDraw(flop, hand, outRanks);

  // The draw must be based on at least 3 cards from our hand.
  // This is a core principle of a wrap - it's your hand that's wrapping the board.
  // This avoids esoteric "draws" that are mostly made by the flop itself.
  return relevantRanks.length >= 3;
}

// ---------- Helpers to reduce pattern ----------
function countStraightOutsPair(flop: readonly Rank[], pair: readonly Rank[]): number {
  const used = new Set([...flop, ...pair]);
  let outs = 0;
  for (const rank of RANKS) {
    if (used.has(rank)) continue;
    const board3Combos = combos([...flop, rank], 3);
    for (const b3 of board3Combos) {
      if (isStraight([...b3, ...pair])) {
        outs += 4; // four suits
        break;
      }
    }
  }
  return outs;
}

function computeOutRanks(flop: readonly Rank[], hand: readonly Rank[]): Rank[] {
  const holePairs = combos(hand, 2);
  const holeSet = new Set(hand);
  const flopSet = new Set(flop);
  const outsRanks: Rank[] = [];
  for (const rank of RANKS) {
    if (flopSet.has(rank)) continue; // An out can't be a card already on the flop

    const boardCombos = combos([...flop, rank], 3);
    for (const b3 of boardCombos) {
      for (const pair of holePairs) {
        if (isStraight([...b3, ...pair])) {
          outsRanks.push(rank);
          break;
        }
      }
      if (outsRanks.includes(rank)) break;
    }
  }
  return [...new Set(outsRanks)].sort((a, b) => a - b);
}

function getWorkingCardsForDraw(
  flop: readonly Rank[],
  hand: readonly Rank[],
  specificOutRanks: readonly Rank[],
): Rank[] {
  const workingRankSet = new Set<Rank>();
  const holePairs = combos(hand, 2);

  for (const out of specificOutRanks) {
    const board4 = [...flop, out];
    const boardTriples = combos(board4, 3);
    for (const hp of holePairs) {
      for (const b3 of boardTriples) {
        if (isStraight([...b3, ...hp])) {
          hp.forEach((r) => workingRankSet.add(r));
        }
      }
    }
  }
  return Array.from(workingRankSet).sort((a,b) => a - b);
} 