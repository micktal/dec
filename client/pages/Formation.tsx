import { useCallback, useEffect, useState } from "react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Maximize2, Minimize2 } from "lucide-react";

import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { cn } from "@/lib/utils";

const MODULE_URL = "https://formation.decathlon.com";

export default function Formation() {
  return (
    <div className="min-h-screen bg-[#F7F7F7] text-foreground">
      <SiteHeader />
      <main className="mx-auto flex w-full flex-col gap-16 px-6 py-20 md:px-12">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary">
            Module e-learning interne
          </span>
          <h1 className="mt-6 text-3xl font-bold text-primary sm:text-4xl">
            Module e-learning – Fin du paiement par chèque
          </h1>
          <p className="mt-4 text-lg text-foreground/70">
            Suis la formation directement depuis cette page ou ouvre-la dans une
            nouvelle fenêtre pour un affichage plein écran.
          </p>
        </Reveal>
        <ModuleCard />
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center text-sm text-foreground/60">
          <p>
            Si le module ne s’affiche pas correctement, assure-toi que ton navigateur
            autorise le chargement des contenus externes ou utilise le bouton ci-dessous.
          </p>
          <Link
            to="/"
            className="text-primary underline-offset-4 transition-colors hover:text-[#00B050] hover:underline"
          >
            Retourner à l’accueil
          </Link>
        </Reveal>
      </main>
      <SiteFooter />
    </div>
  );
}

function ModuleCard() {
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setProgress(72);
    }, 200);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isFullscreen) {
      document.body.style.overflow = "";
      return;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [isFullscreen]);

  const handleOpenModule = () => {
    window.open(MODULE_URL, "_blank", "noopener,noreferrer");
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const cardClasses = cn(
    "relative mx-auto w-full max-w-5xl rounded-3xl border border-primary/30 bg-white p-8 shadow-2xl shadow-primary/15 transition-all duration-300",
    isFullscreen && "max-w-6xl",
  );

  const frameWrapperClasses = cn(
    "relative w-full overflow-hidden rounded-2xl border-2 border-primary bg-white shadow-inner",
  );

  const renderCard = () => (
    <div className={cardClasses}>
      <button
        onClick={toggleFullscreen}
        type="button"
        aria-label={isFullscreen ? "Quitter le mode plein écran" : "Activer le mode plein écran"}
        className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary shadow-sm transition-colors hover:border-[#00B050] hover:text-[#00B050]"
      >
        {isFullscreen ? (
          <Minimize2 className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Maximize2 className="h-4 w-4" aria-hidden="true" />
        )}
        {isFullscreen ? "Quitter" : "Plein écran"}
      </button>
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span>Formation en cours</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10">
            <div
              className="h-full rounded-full bg-[#00B050] transition-all duration-[1200ms] ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div
          className={frameWrapperClasses}
          style={{ aspectRatio: "16 / 9" }}
        >
          <iframe
            src={MODULE_URL}
            title="Module e-learning Decathlon – Fin du paiement par chèque"
            className="h-full w-full"
            allow="fullscreen"
            loading="lazy"
            onLoad={() => setIsIframeLoaded(true)}
          />
          <div
            className={cn(
              "pointer-events-none absolute inset-0 flex items-center justify-center bg-primary/5 text-sm font-semibold text-primary transition-opacity duration-500",
              isIframeLoaded ? "opacity-0" : "opacity-100",
            )}
          >
            Chargement du module en cours...
          </div>
        </div>
        <div className="space-y-4 text-center text-sm text-foreground/60">
          <p>Si le module ne se lance pas automatiquement, clique sur le bouton ci-dessous.</p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={handleOpenModule}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-primary bg-white px-6 py-3 text-sm font-semibold text-primary shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#00B050] hover:bg-[#00B050] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Ouvrir dans une nouvelle fenêtre
            </button>
            {!isFullscreen && (
              <button
                onClick={toggleFullscreen}
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-primary/40 bg-primary/5 px-5 py-2 text-sm font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10"
              >
                <Maximize2 className="h-4 w-4" aria-hidden="true" />
                Passer en plein écran
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {!isFullscreen && renderCard()}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/90 px-4 py-10">
          <div className="w-full max-w-6xl">{renderCard()}</div>
        </div>
      )}
    </div>
  );
}
