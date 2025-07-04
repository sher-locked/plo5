import React from "react";
import PlayingCard from "./PlayingCard";
import OutCard from "./OutCard";
import { type Rank, type Suit } from "./PlayingCard";

/** Utility to conditionally join Tailwind class strings without adding a dependency */
function cn(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

// Component manages its own types for draw details

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

// --- Helper Functions ---

/**
 * Given a rank from the outs, determine if it's 3 or 4 outs.
 * An out rank that is also in our hand has 3 outs. Otherwise, it has 4.
 */
const getOutsPerRank = (rank: string, hand: string) => {
  return hand.includes(rank) ? 3 : 4;
};

// --- Main Component ---

interface DrawDetailProps {
  wrap: Wrap;
  highlightType?: 'most-outs' | 'most-nuts' | 'none';
}

const PlaceholderCard = () => (
  <div className="flex flex-col items-center gap-1">
    <div
      className="flex items-center justify-center rounded-lg w-9 h-12 border border-dashed border-gray-600/20 bg-transparent shadow-lg shadow-black/40"
      aria-label="Irrelevant card"
    >
      <span className="text-gray-500/50 font-mono text-lg">×</span>
    </div>
  </div>
);

export default function DrawDetail({ wrap, highlightType = 'none' }: DrawDetailProps) {
  const handCards = wrap.drawHand.split("");
  const handSuits: Suit[] = ["s", "s", "d", "d", "c"];

  // Determine shadow/glow styling based on highlight type
  const getShadowClass = () => {
    switch (highlightType) {
      case 'most-nuts':
        return 'shadow-lg shadow-blue-500/20 ring-1 ring-blue-500/30';
      case 'most-outs':
        return 'shadow-lg shadow-green-500/20 ring-1 ring-green-500/30';
      default:
        return 'shadow-md shadow-gray-500/20 ring-1 ring-gray-600/20';
    }
  };

  return (
    <div className={`${getShadowClass()} rounded-xl flex flex-col flex-shrink-0 w-[240px] p-2.5 gap-2 my-1.5`}>
      {/* Header for Stats */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold font-mono text-white tracking-wide">{wrap.outCount} outs</span>
        <span className="text-sm font-semibold font-mono text-blue-400 tracking-wide">{wrap.outs.nutOuts} nuts</span>
      </div>

      {/* Subtle divider */}
      <div className="h-px bg-gray-600/30" />

      {/* Hero Section: Representative Hand */}
      <div className="flex items-center justify-center gap-1.5 px-2">
        {handCards.map((glyph, idx) =>
          glyph === "x" ? (
            <PlaceholderCard key={`${glyph}-${idx}`} />
          ) : (
            <PlayingCard
              key={`${glyph}-${idx}`}
              code={`${glyph as Rank}${handSuits[idx]}`}
              size="sm"
              theme="dark"
              showSuit={false}
            />
          )
        )}
      </div>

      {/* Subtle divider */}
      <div className="h-px bg-gray-600/30" />

      {/* Bottom Section: Outs */}
      <div className="flex items-center justify-end gap-2">
        {wrap.outs.ranks.slice(0, 6).map((rank) => {
          const isNut = wrap.outs.nutRanks.includes(rank);
          return (
            <div key={rank} className="relative">
              <OutCard rank={rank as Rank} />
              <span
                className={cn(
                  "absolute -top-1 -right-1 text-xs font-mono font-extrabold leading-none",
                  isNut 
                    ? "text-blue-400" 
                    : "text-white/80"
                )}
              >
                {getOutsPerRank(rank, wrap.drawHand)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 