import PlayingCard, { type PlayingCardProps } from "./PlayingCard";

type CardCode = PlayingCardProps["code"];

interface PokerTableProps {
  cards: CardCode[];
}

const PlaceholderCard = () => (
  <div className="w-14 h-20 rounded-md border-2 border-dashed border-gray-600/20 bg-card scale-110 shadow-xl shadow-black/50" />
);

export default function PokerTable({ cards }: PokerTableProps) {
  return (
    <div
      className="w-full max-w-[500px] md:max-w-[600px] mx-auto px-6 py-8 relative
      border border-gray-600/40 rounded-2xl
      shadow-lg shadow-blue-500/25 ring-1 ring-blue-500/30 bg-background"
    >
      <div className="flex items-center justify-center gap-5">
        {cards.map((code) => (
          <div key={code} className="drop-shadow-lg hover:drop-shadow-xl transition-all duration-200 scale-110">
            <PlayingCard code={code} size="md" />
          </div>
        ))}
        {Array.from({ length: 5 - cards.length }).map((_, i) => (
          <PlaceholderCard key={i} />
        ))}
      </div>
    </div>
  );
} 