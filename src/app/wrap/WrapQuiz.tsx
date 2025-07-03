"use client";

import React from "react";
import PokerTable from "@/components/ui/PokerTable";
import DrawDetail from "@/components/ui/DrawDetail";
import { type PlayingCardProps, type Suit, type Rank } from "@/components/ui/PlayingCard";

type CardCode = PlayingCardProps["code"];

interface Outs {
  ranks: string[];
  nutOuts: number;
  nutRanks: string[];
}

interface Wrap {
  uid: string;
  drawType: string;
  outCount: number;
  outs: Outs;
  drawHand: string;
}

interface WrapEntry {
  flop: string;
  flopArchetype: string;
  wraps: Wrap[];
}

// The out counts we will quiz on, representing common draw strengths
// DEPRECATED: We will now generate this dynamically.
// const QUIZ_OPTIONS = [20, 16, 13, 8, 4] as const;

interface WrapQuizProps {
  current: WrapEntry | null;
  guess: number | null;
  revealed: boolean;
  quizOptions: number[];
  topWrap?: Wrap;
  displayWraps: Wrap[];
  onGuess: (num: number) => void;
}

export default function WrapQuiz({
  current,
  guess,
  revealed,
  quizOptions,
  topWrap,
  displayWraps,
  onGuess,
}: WrapQuizProps) {
  let cardCodes: CardCode[] = [];
  if (current) {
    if (current.flop.length === 3) {
      const suits: Suit[] = ["s", "h", "d"];
      cardCodes = current.flop.split("").map((r, idx) => `${r as Rank}${suits[idx]}` as CardCode);
    } else {
      cardCodes = (current.flop.match(/.{2}/g) ?? []) as CardCode[];
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xl md:max-w-4xl mx-auto px-4">
      {current ? (
        <PokerTable cards={cardCodes} />
      ) : (
        <div className="w-full max-w-xl mx-auto rounded-xl px-4 py-8 bg-muted border border-border">
          <p className="text-center text-muted-foreground font-mono">Loading…</p>
        </div>
      )}

      {/* Question Section */}
      <div className="flex flex-col items-center w-full gap-4">
        <div className="text-center">
          <h2 className="text-sm font-semibold font-mono text-gray-300 tracking-wide">
            Select maximum possible outs on this flop
          </h2>
        </div>
        
        {/* Quiz Options */}
        <div className="flex flex-wrap justify-center gap-3">
          {current &&
            topWrap &&
            quizOptions.map((num) => {
              const isSelected = guess === num;
              const isCorrect = topWrap.outCount === num;

              // Define styles for each state using semantic colors
              let buttonStyle = "bg-muted hover:bg-muted/80 border-border text-foreground"; // Default

              if (revealed) {
                if (isCorrect) {
                  buttonStyle = "bg-muted hover:bg-muted/80 border-border text-foreground shadow-lg shadow-green-500/55 ring-1 ring-green-500/65"; // Correct - prominent green glow
                } else if (isSelected && !isCorrect) {
                  buttonStyle = "bg-muted hover:bg-muted/80 border-border text-foreground shadow-lg shadow-red-400/55 ring-1 ring-red-400/65"; // Incorrect - prominent red glow
                } else {
                  buttonStyle = "bg-muted/60 border-border text-muted-foreground opacity-50"; // Disabled
                }
              }

              return (
                <button
                  key={num}
                  disabled={revealed}
                  onClick={() => onGuess(num)}
                  className={`w-16 h-12 rounded-xl flex items-center justify-center font-bold text-lg tracking-wider transition-all duration-200 border shadow-sm hover:shadow-md ${buttonStyle} ${
                    !revealed
                      ? "hover:scale-105 active:scale-95"
                      : "cursor-not-allowed"
                  }`}
                >
                  <span className="uppercase">{num}</span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Subtle Divider - appears after answer is revealed */}
      {revealed && (
        <div className="w-full max-w-xl mx-auto">
          <div className="h-px bg-gray-600/30"></div>
        </div>
      )}

      {/* Answer Section */}
      {revealed && (
        <div className="w-full mx-auto">
          <div className="text-center mb-5">
            <h3 className="text-sm font-semibold font-mono text-gray-300 tracking-wide">
              {Math.max(...displayWraps.map(w => w.outCount))} outs and <span className="text-blue-400">{Math.max(...displayWraps.map(w => w.outs.nutOuts))} nut</span> outs
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 justify-items-center max-w-[500px] md:max-w-[800px] mx-auto">
            {(() => {
              // Find max values across all wraps
              const maxTotalOuts = Math.max(...displayWraps.map(w => w.outCount));
              const maxNutOuts = Math.max(...displayWraps.map(w => w.outs.nutOuts));
              
              // Sort wraps: most total outs first, then most nut outs, then rest
              const sortedWraps = [...displayWraps.slice(0, 3)].sort((a, b) => {
                // First priority: most total outs (the quiz answer)
                if (a.outCount === maxTotalOuts && b.outCount !== maxTotalOuts) return -1;
                if (b.outCount === maxTotalOuts && a.outCount !== maxTotalOuts) return 1;
                
                // Second priority: most nut outs
                if (a.outs.nutOuts === maxNutOuts && b.outs.nutOuts !== maxNutOuts) return -1;
                if (b.outs.nutOuts === maxNutOuts && a.outs.nutOuts !== maxNutOuts) return 1;
                
                return 0; // Keep original order for ties
              });
              
              return sortedWraps.map((wrap) => {
                // Find the hand with maximum nut outs
                const maxNutOutsHand = displayWraps.reduce((prev, current) => 
                  current.outs.nutOuts > prev.outs.nutOuts ? current : prev
                );
                
                const isMaxNutOutsHand = wrap.uid === maxNutOutsHand.uid;
                const hasMoreOutsThanMaxNutsHand = wrap.outCount > maxNutOutsHand.outCount;
                
                // Refined glow logic:
                // Green: Hand with more total outs than the max nut outs hand
                // Blue: Hand with maximum nut outs (if it has any nut outs)
                // Grey: All others
                let highlightType: 'most-outs' | 'most-nuts' | 'none' = 'none';
                if (hasMoreOutsThanMaxNutsHand) {
                  highlightType = 'most-outs'; // Green
                } else if (isMaxNutOutsHand && maxNutOutsHand.outs.nutOuts > 0) {
                  highlightType = 'most-nuts'; // Blue
                }
                
                return (
                  <DrawDetail 
                    key={wrap.uid} 
                    wrap={wrap} 
                    highlightType={highlightType}
                  />
                );
              });
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Helper Components ---

// StarIcon is no longer used and can be removed.
// The DrawDetail component has been moved to its own file. 