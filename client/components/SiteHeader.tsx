import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export default function SiteHeader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setProgress(100);
    }, 100);

    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground shadow-lg shadow-primary/25">
      <div className="relative h-1 overflow-hidden bg-primary/60">
        <span
          className={cn(
            "block h-full origin-left bg-[#00B050] transition-[transform] duration-[2000ms] ease-out",
            progress === 100 ? "scale-x-100" : "scale-x-0",
          )}
        />
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-4 md:px-10">
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <span className="inline-flex items-center gap-3">
            <span className="inline-flex items-center justify-center rounded-full border border-white/25 px-5 py-2 text-xs font-semibold tracking-[0.35em] text-white">
              DECATHLON
            </span>
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/85 md:text-right">
            Espace Formation Decathlon
          </span>
        </div>
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-white/70 md:text-right">
          Formation – Fin du paiement par chèque – Ensemble vers 2026
        </p>
      </div>
    </header>
  );
}
