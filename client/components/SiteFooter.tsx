import { Link } from "react-router-dom";

import { Link } from "react-router-dom";

import DecathlonLogo from "@/components/DecathlonLogo";

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-6 py-12 text-center">
        <DecathlonLogo className="h-12 w-auto" aria-label="Decathlon" />
        <p className="text-sm text-white/80">
          © Decathlon France 2026 – Ensemble, on avance.
        </p>
        <Link
          to="/"
          className="text-sm text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
        >
          Retour à la page d’accueil
        </Link>
      </div>
    </footer>
  );
}

export default SiteFooter;
