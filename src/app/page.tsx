import Link from "next/link";
import { Zap, Users, Target, RotateCcw } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8 font-sans">
      <main className="flex flex-col items-center gap-12 max-w-md w-full">
        {/* Main Title */}
        <div className="text-center mb-4">
          <h1 className="text-7xl font-black tracking-tighter font-grotesk relative">
            <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
              PLO
            </span>
            <span className="text-blue-500 drop-shadow-sm">5</span>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-transparent to-blue-600/20 blur-xl -z-10"></div>
          </h1>
          <p className="text-muted-foreground mt-4 text-sm font-mono tracking-wide">
            Modules for Pot Limit Omaha, 5 Card Variant
          </p>
        </div>
        
        {/* Navigation Buttons */}
        <nav className="flex flex-col gap-4 w-full">
          {/* Primary Active Module */}
          <Link 
            href="/wrap"
            className="group relative w-full h-16 bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 rounded-xl flex items-center justify-center font-bold text-xl tracking-wider border border-border shadow-sm hover:shadow-md"
          >
            <Zap className="w-6 h-6 mr-4" />
            <span className="uppercase">Wraps</span>
          </Link>
          
          {/* Future Modules - Inactive but Prominent */}
          <button 
            disabled
            className="group w-full h-14 bg-muted hover:bg-muted/80 border border-border rounded-xl flex items-center justify-center font-semibold text-lg tracking-wide text-muted-foreground cursor-not-allowed transition-colors duration-200"
          >
            <Users className="w-5 h-5 mr-3 opacity-60" />
            <span className="uppercase">Preflop</span>
          </button>
          
          <button 
            disabled
            className="group w-full h-14 bg-muted hover:bg-muted/80 border border-border rounded-xl flex items-center justify-center font-semibold text-lg tracking-wide text-muted-foreground cursor-not-allowed transition-colors duration-200"
          >
            <Target className="w-5 h-5 mr-3 opacity-60" />
            <span className="uppercase">Flop</span>
          </button>
          
          <button 
            disabled
            className="group w-full h-14 bg-muted hover:bg-muted/80 border border-border rounded-xl flex items-center justify-center font-semibold text-lg tracking-wide text-muted-foreground cursor-not-allowed transition-colors duration-200"
          >
            <RotateCcw className="w-5 h-5 mr-3 opacity-60" />
            <span className="uppercase">Turn</span>
          </button>
        </nav>
        
        {/* Footer note */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground font-mono tracking-wide">
            Built by Anush with Cursor
          </p>
        </div>
      </main>
    </div>
  );
}
