# PLO-5 Wrap Counter: Data Generation Logic

This document outlines the core logic of the `scripts/generate-wraps.ts` script, which is responsible for pre-calculating all significant straight draw possibilities ("wraps") for our PLO-5 Trainer application.

## 1. Goal

The primary objective of this script is to deterministically generate a comprehensive JSON database (`public/data/wraps.json`) of all instructive straight draws for every possible three-card flop in poker. This pre-calculation allows the front-end application to instantly quiz users on wrap potential without any runtime computation.

## 2. Core Process

The script operates through a nested loop structure, systematically exploring every relevant flop and hand combination.

1.  **Flop Enumeration**: It begins by generating every unique three-card combination of ranks from a standard 13-rank deck (e.g., `[2, 3, 4]`, `[4, 9, Q]`, etc.). This results in 286 unique rank-only flops.

2.  **Hand Combination Iteration**: For each of these 286 flops, the script iterates through all possible five-card, distinct-rank hand combinations (1,287 total). We only consider distinct ranks because duplicate ranks in a hand can only reduce straight-making potential.

3.  **Draw Evaluation & Filtering**: For each `flop` and `hand` pair, the script performs a series of checks and calculations:
    *   It first checks if the hand has already flopped a straight. If so, it's not a *draw*, and the hand is discarded.
    *   It calculates all possible turn cards that would complete a straight (`computeOutRanks`).
    *   It uses a key heuristic, `isStrongDraw`, to determine if the draw is significant enough to be instructive. This is our primary filter to ensure data quality.
    *   If the draw is deemed "strong," it proceeds to calculate advanced metrics.

4.  **Data Aggregation & Grouping**:
    *   Valid draws are grouped together based on a composite key: `outCount-drawType-nutOuts-outRanks`. This ensures that for a given flop, we only show one representative example of each unique type of draw (e.g., one 13-out Broadway wrap, one 9-out gutshot, etc.).
    *   When multiple hands produce the same type of draw, the script prioritizes the "cleanest" example (one with no hole cards matching the flop cards).

5.  **JSON Output**: The final, aggregated data for all 260+ flops with valid wraps is sorted, formatted, and written to `public/data/wraps.json`.

## 3. Key Functions & Heuristics

#### `isStrongDraw(flop, hand, outRanks)`

This is the most important gatekeeper function for ensuring the quality of our data. It replaced a previous, flawed "gap-based" logic. A draw is considered "strong" if it meets two criteria:

1.  **It must have at least 9 potential outs.** We check this by seeing if there are at least 3 unique ranks that complete a straight.
2.  **At least three cards from the player's hand must contribute to the draw.** This is the core principle of a true "wrap"—the player's own hand is what creates the powerful, multi-way draw. This heuristic effectively filters out less instructive "board-heavy" draws.

#### `computeOutRanks(flop, hand)`

This function is the engine of the draw calculation. It iterates through every possible turn card and checks if that card, combined with the flop and two cards from the player's hand, can form a five-card straight. The unique ranks of these completing cards become the "out ranks."

#### `calculateNuttinessForHand(flop, hand, outRanks)`

For a given draw, this function determines the quality of its outs. For each out rank, it calculates the highest possible straight that can be made on that turn card. It then checks if the player's hand can make that same highest straight. If it can, the out is considered a "nut out." This is crucial for teaching players to distinguish between drawing to the nuts versus drawing to a dominated hand.

#### `getWorkingCardsForDraw(flop, hand, outRanks)`

This utility identifies which of the five cards in the player's hand are actually contributing to the specific draw. A card is considered "working" if it's part of a two-card combination from the hand that makes a straight with one of the out ranks. This allows the UI to highlight the most important cards for the user. 