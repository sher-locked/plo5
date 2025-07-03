"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import WrapQuiz from "../WrapQuiz";
import Header from "@/components/ui/Header";
import { WrapEntry, Wrap, findFlopData, generateQuizOptions, normalizeFlop } from "../utils";

export default function WrapSpecificPage() {
  const params = useParams();
  const router = useRouter();
  const [current, setCurrent] = useState<WrapEntry | null>(null);
  const [guess, setGuess] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [quizOptions, setQuizOptions] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // The top wrap is always the one with the most outs, which is what we quiz on.
  const topWrap = current?.wraps[0];

  // For the reveal section, we create a more descriptive list of draws.
  const displayWraps = current
    ? [
        ...current.wraps.filter((w) => w.drawType.toLowerCase().includes("wrap")).slice(0, 3),
        current.wraps.find((w) => w.drawType.toLowerCase().includes("double_gutshot")),
        current.wraps.find((w) => w.drawType.toLowerCase().includes("open_ended")),
      ].filter((w): w is Wrap => !!w)
    : [];

  const handleGuess = (num: number) => {
    setGuess(num);
    setRevealed(true);
  };

  const goToRandomMode = () => {
    router.push("/wrap");
  };

  // Load specific flop data on mount and param changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    setGuess(null);
    setRevealed(false);

    const flopParam = params.flop as string;
    if (!flopParam) {
      setError("No flop specified");
      setLoading(false);
      return;
    }

    // Validate flop format
    const normalizedFlop = normalizeFlop(flopParam);
    if (!normalizedFlop) {
      setError(`Invalid flop format: "${flopParam}". Please use 3 valid poker ranks (e.g., "45J", "AKQ").`);
      setLoading(false);
      return;
    }

    // Find flop data
    const flopData = findFlopData(normalizedFlop);
    if (!flopData) {
      setError(`Flop "${normalizedFlop}" not found in dataset. Try a different flop or use random mode.`);
      setLoading(false);
      return;
    }

    // Check if flop has wraps to study
    if (flopData.wraps.length === 0) {
      setError(`Flop "${normalizedFlop}" has no wrap draws to study. Try a different flop.`);
      setLoading(false);
      return;
    }

    // Success - set up quiz
    setCurrent(flopData);
    setQuizOptions(generateQuizOptions(flopData.wraps[0].outCount));
    setLoading(false);
  }, [params.flop]);

  // Error state
  if (error) {
    return (
      <>
        <Header onNext={goToRandomMode} />
        <main className="flex flex-col items-center p-6 pt-20 gap-6 min-h-screen bg-background">
          <div className="text-center max-w-md">
            <h1 className="text-xl font-semibold text-red-400 mb-4">Invalid Flop</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={goToRandomMode}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Try Random Flop
            </button>
          </div>
        </main>
      </>
    );
  }

  // Loading state
  if (loading) {
    return (
      <>
        <Header onNext={goToRandomMode} />
        <main className="flex flex-col items-center p-6 pt-20 gap-6 min-h-screen bg-background">
          <div className="text-center">
            <p className="text-gray-300">Loading flop data...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header onNext={goToRandomMode} />
      <main className="flex flex-col items-center p-6 pt-20 gap-6 min-h-screen bg-background">
        <h1 className="text-2xl font-bold font-grotesk tracking-tight sr-only">
          Wrap Counter - {current?.flop}
        </h1>
        <WrapQuiz
          current={current}
          guess={guess}
          revealed={revealed}
          quizOptions={quizOptions}
          topWrap={topWrap}
          displayWraps={displayWraps}
          onGuess={handleGuess}
        />
      </main>
    </>
  );
} 