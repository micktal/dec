import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DecathlonLogo from "@/components/DecathlonLogo";
import { cn } from "@/lib/utils";

export default function SiteHeader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      const next = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      setProgress(next);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground shadow-lg shadow-primary/25">
      <div className="relative h-1 overflow-hidden bg-primary/50">
        <span
          className={cn(
            "block h-full bg-white/80 transition-all duration-300 ease-out",
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-4 md:px-10">
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <Link to="/" className="inline-flex items-center gap-3 text-white">
            <DecathlonLogo className="h-9 w-auto drop-shadow" aria-label="Decathlon" />
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80 md:text-sm">
              Formation
            </span>
          </Link>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/85 md:text-right">
            Espace formation Decathlon
          </span>
        </div>
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-white/70 md:text-right">
          Fin du paiement par chèque – Ensemble vers 2026
        </p>
      </div>
    </header>
  );
}
