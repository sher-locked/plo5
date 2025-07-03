import Link from "next/link";
import { MouseEventHandler } from "react";
import { Home, ArrowRight } from "lucide-react";

interface HeaderProps {
  onNext: MouseEventHandler<HTMLButtonElement>;
}

export default function Header({ onNext }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm z-10 h-16 flex items-center border-b border-border">
      <div className="w-full max-w-md mx-auto px-4 flex justify-between items-center">
        <Link 
          href="/" 
          aria-label="Home"
          className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <Home className="w-6 h-6" />
          <span className="text-base font-medium tracking-wide">PLO5</span>
        </Link>
        
        <button
          onClick={onNext}
          className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 text-base"
          aria-label="Next quiz"
        >
          <span className="font-medium tracking-wide">NEXT</span>
          <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </header>
  );
} 