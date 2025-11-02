import { Link } from "react-router-dom";
import SiteFooter from "@/components/SiteFooter";

export default function Formation() {
  return (
    <div className="bg-background text-foreground">
      <main className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col items-center gap-8 px-6 py-20 text-center md:px-12">
        <span className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
          Ressources formation
        </span>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Les supports arrivent bientôt
          </h1>
          <p className="text-lg text-foreground/75">
            L'espace formation interne rassemble fiches mémo, scripts téléchargeables et vidéos pour accompagner la fin du paiement par chèque. Reviens très vite : l'équipe finalise les derniers détails.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-[12px] bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Retour à l'accueil
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
