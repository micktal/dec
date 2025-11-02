import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 text-center md:px-12 md:text-left">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-start">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <span className="inline-flex items-center rounded-full border border-white/20 px-6 py-2 text-sm font-semibold tracking-[0.35em] text-white">
              DECATHLON
            </span>
            <p className="max-w-md text-sm text-white/80">
              © Decathlon France 2026 – Formation collaborateurs
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 text-sm text-white/80 md:items-end">
            <span className="font-semibold text-white">Besoin d'aller plus loin ?</span>
            <Link
              to="/formation"
              className="text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Fiche mémo et supports disponibles dans l'espace formation interne
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
