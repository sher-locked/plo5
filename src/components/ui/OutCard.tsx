type Rank = | "A" | "K" | "Q" | "J" | "T" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2";

interface OutCardProps {
  rank: Rank;
}

export default function OutCard({ rank }: OutCardProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative flex justify-center items-center rounded-md w-6 h-9 border border-gray-600/20 bg-transparent"
      >
        <span className="leading-none font-medium text-xs font-mono text-white/60">
          {rank}
        </span>
      </div>
    </div>
  );
} 