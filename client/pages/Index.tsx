import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SiteFooter from "@/components/SiteFooter";

const INTRO_IMAGE_URL =
  "https://images.unsplash.com/photo-1523419409543-0c1df022bdd1?auto=format&fit=crop&w=2000&q=80";
const MODULE_PLACEHOLDER_POSTER =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80";

const resources = [
  {
    icon: "📄",
    title: "Fiche mémo imprimable",
    description: "Les scripts et alternatives à garder en tête",
  },
  {
    icon: "❓",
    title: "FAQ",
    description: "Les réponses aux questions fréquentes en caisse",
  },
  {
    icon: "🎥",
    title: "Capsule vidéo",
    description: "Les bons réflexes en situation réelle",
  },
] as const;

export default function Index() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const moduleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress);
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const handleStartModule = () => {
    moduleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="scroll-smooth bg-background text-foreground">
      <PageHeader progress={scrollProgress} onStart={handleStartModule} />
      <main className="flex flex-col gap-24 pt-[120px] md:gap-28 lg:pt-[128px]">
        <IntroductionSection onStart={handleStartModule} />
        <ModuleSection moduleRef={moduleRef} />
        <ResourcesSection />
        <ClosureSection />
      </main>
      <SiteFooter />
    </div>
  );
}

function PageHeader({
  progress,
  onStart,
}: {
  progress: number;
  onStart: () => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-primary text-primary-foreground shadow-lg shadow-primary/30">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <div className="inline-flex items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.35em] text-primary">
            Decathlon
          </span>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-xs font-semibold uppercase text-primary-foreground/80">
              Module e-learning officiel
            </span>
            <span className="text-base font-semibold">Espace Formation Capitaine</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center justify-center rounded-[12px] border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Continuer la formation
        </button>
      </div>
      <div className="h-1 w-full bg-primary/40">
        <div
          className="h-full origin-left bg-[#00B050] transition-[width] duration-300 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
          aria-hidden="true"
        />
      </div>
    </header>
  );
}

function IntroductionSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="bg-card">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 md:flex-row md:items-center md:justify-between md:px-8 lg:py-20">
        <div className="flex w-full max-w-2xl flex-col gap-6 text-center md:text-left">
          <div className="space-y-3">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary">
              Bienvenue Capitaine
            </span>
            <h1 className="text-4xl font-bold leading-tight text-primary sm:text-5xl">
              Bienvenue dans ta formation, Capitaine 👋
            </h1>
            <p className="text-lg leading-relaxed text-foreground/70 sm:text-xl">
              Tu vas découvrir comment annoncer sereinement la fin du paiement par
              chèque à tes clients. Prêt·e ? Installe-toi, nous nous occupons du reste.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex w-full items-center justify-center rounded-[12px] bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
            >
              Commencer le module
            </button>
            <p className="text-sm font-medium text-foreground/60">
              Durée estimée : 12 à 15 minutes
            </p>
          </div>
        </div>
        <div className="relative w-full max-w-xl overflow-hidden rounded-3xl shadow-xl shadow-primary/20">
          <img
            src={INTRO_IMAGE_URL}
            alt="Interaction client en caisse Decathlon"
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}

function ModuleSection({
  moduleRef,
}: {
  moduleRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <section ref={moduleRef} id="module" className="bg-muted">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-20 md:px-8 lg:py-24">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Module interactif – Fin du paiement par chèque
          </h2>
          <p className="mx-auto max-w-2xl text-base text-foreground/70 sm:text-lg">
            Lance ton parcours immersif et suis les scénarios proposés pour adopter le
            bon discours en caisse. Le module se charge automatiquement ci-dessous.
          </p>
        </div>
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-3xl border border-border bg-white p-6 shadow-xl shadow-primary/10">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-dashed border-primary/30 bg-gradient-to-br from-primary/5 via-white to-secondary/10">
            <img
              src={MODULE_PLACEHOLDER_POSTER}
              alt="Illustration caisse Decathlon"
              className="h-full w-full object-cover opacity-30"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-primary/10 backdrop-blur-sm text-center">
              <span className="text-lg font-semibold text-primary">
                Le module Articulate SCORM s’affichera ici.
              </span>
              <span className="text-sm text-foreground/70">
                Merci de patienter pendant le chargement…
              </span>
            </div>
          </div>
          <p className="text-center text-sm text-foreground/60">
            Si le module ne s’ouvre pas, clique sur le bouton ci-dessous.
          </p>
          <Link
            to="/formation"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-[12px] border border-primary/20 bg-white px-6 py-3 text-sm font-semibold text-primary shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Ouvrir le module dans une nouvelle fenêtre
          </Link>
        </div>
      </div>
    </section>
  );
}

function ResourcesSection() {
  return (
    <section className="bg-card">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-20 md:px-8 lg:py-24">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Ressources utiles
          </h2>
          <p className="mx-auto max-w-2xl text-base text-foreground/70 sm:text-lg">
            Télécharge, consulte ou regarde les contenus complémentaires pour
            maîtriser la transition vers le paiement sans chèque.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {resources.map((resource) => (
            <button
              key={resource.title}
              type="button"
              className="group flex w-full flex-col gap-4 rounded-3xl border border-transparent bg-muted/60 p-8 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-white hover:shadow-xl"
            >
              <span className="text-4xl" aria-hidden="true">
                {resource.icon}
              </span>
              <div className="space-y-2">
                <span className="text-xl font-semibold">{resource.title}</span>
                <p className="text-sm text-foreground/70 transition-colors duration-300 group-hover:text-white/80">
                  {resource.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosureSection() {
  return (
    <section className="bg-secondary text-secondary-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 py-20 text-center md:px-8 lg:py-24">
        <h2 className="text-3xl font-bold sm:text-4xl">Tu as terminé ? Bravo ! 🎉</h2>
        <p className="max-w-2xl text-lg text-white/85">
          Grâce à toi, la transition vers le paiement sans chèque se fera en douceur.
          Pense à partager tes astuces avec ton équipe pour inspirer les autres
          Capitaines.
        </p>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-[12px] bg-[#00B050] px-8 py-3 text-base font-semibold text-white shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#00b050]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Je valide ma formation
        </button>
      </div>
    </section>
  );
}
