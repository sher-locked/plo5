"use client";

import { useState, useEffect } from "react";
import WrapQuiz from "./WrapQuiz";
import Header from "@/components/ui/Header";
import { WrapEntry, Wrap, pickRandomFlop, generateQuizOptions } from "./utils";

export default function WrapRandomPage() {
  const [current, setCurrent] = useState<WrapEntry | null>(null);
  const [guess, setGuess] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [quizOptions, setQuizOptions] = useState<number[]>([]);

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

  const reset = () => {
    const newFlop = pickRandomFlop();
    setCurrent(newFlop);
    if (newFlop.wraps[0]) {
      setQuizOptions(generateQuizOptions(newFlop.wraps[0].outCount));
    }
    setGuess(null);
    setRevealed(false);
  };

  const handleGuess = (num: number) => {
    setGuess(num);
    setRevealed(true);
  };

  // pick first flop after mount to avoid SSR/client mismatch
  useEffect(() => {
    if (!current) {
      reset();
    }
  }, [current]);

  return (
    <>
      <Header onNext={reset} />
      <main className="flex flex-col items-center p-6 pt-20 gap-6 min-h-screen bg-background">
        <h1 className="text-2xl font-bold font-grotesk tracking-tight sr-only">Wrap Counter</h1>
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