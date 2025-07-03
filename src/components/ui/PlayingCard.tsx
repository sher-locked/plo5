/** Utility to conditionally join Tailwind class strings */
function cn(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export type Suit = "s" | "h" | "d" | "c";
export type Rank = | "A" | "K" | "Q" | "J" | "T" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2";

export interface PlayingCardProps {
  code: `${Rank}${Suit}`;
  size?: "sm" | "md" | "lg";
  theme?: "light" | "dark";
  className?: string;
  showSuit?: boolean;
}

const suitGlyph: Record<Suit, string> = { s: "♠", h: "♥", d: "♦", c: "♣" };
// Material Design recommended text colors - 87% opacity for high emphasis
const suitColorLight: Record<Suit, string> = { s: "text-gray-800", h: "text-red-600", d: "text-red-600", c: "text-gray-800" };
const suitColorDark: Record<Suit, string> = { s: "text-white/87", h: "text-red-400", d: "text-red-400", c: "text-white/87" };

const sizeMap = {
  sm: { box: "w-9 h-12", font: "text-lg" },
  md: { box: "w-14 h-20", font: "text-lg" },
  lg: { box: "w-22 h-28", font: "text-xl" },
} as const;

export default function PlayingCard({ code, size = "md", theme = "dark", className, showSuit = true }: PlayingCardProps) {
  const rank = code[0] as Rank;
  const suit = code[1] as Suit;
  
  const dims = sizeMap[size] ?? sizeMap.md;
  const suitColor = theme === "light" ? suitColorLight : suitColorDark;
  
  // Clean card background - neutral for optimal legibility
  const cardBg = "#222222"; // Optimal dark gray for contrast and legibility (2025 research)

  return (
    <div className="flex flex-col items-center gap-1">
      <div 
        className={cn("relative rounded-lg select-none shadow-2xl shadow-black/60 border border-gray-500/40", dims.box, className)} 
        style={{ backgroundColor: cardBg }}
      >
        {showSuit ? (
          <>
            <span className={cn("absolute top-1.5 left-1.5 leading-none font-bold", suitColor[suit], dims.font)}>
              {rank}
            </span>
            <span
              className={cn("absolute bottom-1.5 right-1.5 leading-none font-bold", suitColor[suit], dims.font)}
            >
              {suitGlyph[suit]}
            </span>
          </>
        ) : (
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center leading-none font-bold",
              suitColor[suit],
              dims.font
            )}
          >
            {rank}
          </span>
        )}
      </div>
    </div>
  );
} 