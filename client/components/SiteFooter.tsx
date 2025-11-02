import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-6 py-12 text-center">
        <span className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-2 text-sm font-semibold tracking-[0.35em] text-white">
          DECATHLON
        </span>
        <p className="text-sm text-white/80">
          © Decathlon France 2026 – Ensemble, on avance.
        </p>
        <Link
          to="/formation"
          className="text-sm text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
        >
          Supports et fiches mémo disponibles sur l’espace formation interne
        </Link>
      </div>
    </footer>
  );
}

export default SiteFooter;
