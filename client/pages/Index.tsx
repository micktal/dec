import { useCallback } from "react";
import { Link } from "react-router-dom";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const INTRO_IMAGE_URL =
  "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1600&q=80";

const RESOURCES = [
  {
    icon: "📄",
    title: "Fiche mémo",
    description: "Scripts et alternatives clients",
    cta: "Télécharger",
  },
  {
    icon: "❓",
    title: "FAQ",
    description: "Questions fréquentes des équipes",
    cta: "Consulter",
  },
  {
    icon: "🎥",
    title: "Capsule vidéo",
    description: "Les bons réflexes en situation réelle",
    cta: "Regarder",
  },
] as const;

export default function Index() {
  const handleScrollToModule = useCallback(() => {
    const moduleSection = document.getElementById("module-section");
    moduleSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="bg-background text-foreground">
      <SiteHeader />
      <main className="flex flex-col">
        <IntroSection onLaunch={handleScrollToModule} />
        <ModuleSection />
        <ResourcesSection />
        <ValidationSection />
      </main>
      <SiteFooter />
    </div>
  );
}

type IntroSectionProps = {
  onLaunch: () => void;
};

function IntroSection({ onLaunch }: IntroSectionProps) {
  return (
    <section className="bg-card py-20 pt-28">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 md:flex-row md:items-stretch md:px-10">
        <Reveal className="flex w-full flex-1 flex-col justify-center gap-6 text-center md:text-left">
          <h1 className="text-3xl font-bold text-primary sm:text-4xl">
            Bienvenue dans ta formation 🎓
          </h1>
          <p className="text-lg text-foreground/75">
            Cette formation t’aide à expliquer sereinement la fin du paiement par chèque
            à nos clients. Prends ton temps, c’est simple et interactif.
          </p>
          <div className="flex flex-col items-center gap-3 md:items-start">
            <button
              onClick={onLaunch}
              className="inline-flex items-center justify-center rounded-[12px] bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#00B050] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              type="button"
            >
              Lancer le module
            </button>
            <span className="text-sm font-medium text-foreground/60">
              Formation – Fin du paiement par chèque – Ensemble vers 2026
            </span>
          </div>
        </Reveal>
        <Reveal className="flex w-full flex-1 justify-center md:justify-end">
          <div className="relative w-full max-w-xl overflow-hidden rounded-3xl shadow-xl shadow-primary/20">
            <img
              src={INTRO_IMAGE_URL}
              alt="Équipe Decathlon en interaction client"
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ModuleSection() {
  return (
    <section id="module-section" className="bg-[#F7F7F7] py-20">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 text-center md:px-10">
        <Reveal className="space-y-4">
          <h2 className="text-3xl font-bold text-primary sm:text-4xl">
            Module interactif – Fin du paiement par chèque
          </h2>
          <p className="text-base text-foreground/70">
            Le module e-learning Decathlon (SCORM) s’affichera ici.
          </p>
        </Reveal>
        <Reveal>
          <div className="rounded-3xl border border-border bg-white p-6 shadow-xl shadow-primary/10">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-dashed border-primary/30 bg-gradient-to-br from-primary/5 via-white to-secondary/10">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                <span className="text-lg font-semibold text-primary">
                  Le module e-learning Decathlon (SCORM) s’affichera ici.
                </span>
                <span className="text-sm text-foreground/60">
                  Connectez-vous au LMS interne pour le lancer en plein écran.
                </span>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal className="space-y-4">
          <p className="text-sm text-foreground/60">
            Si le module ne se lance pas automatiquement, clique ci-dessous.
          </p>
          <Link
            to="/formation"
            className="inline-flex items-center justify-center rounded-[12px] border border-primary bg-white px-6 py-3 text-base font-semibold text-primary shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#00B050] hover:text-[#00B050] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Ouvrir le module dans une nouvelle fenêtre
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function ResourcesSection() {
  return (
    <section className="bg-card py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 md:px-10">
        <Reveal className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-primary sm:text-4xl">
            Ressources utiles
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-foreground/70">
            Garde ces ressources à portée de main pour accompagner chaque client avec
            confiance.
          </p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {RESOURCES.map((resource) => (
            <Reveal key={resource.title}>
              <div className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-border bg-white p-8 text-left shadow-lg shadow-primary/10 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
                <div className="space-y-4">
                  <span className="text-5xl" aria-hidden="true">
                    {resource.icon}
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-primary">
                      {resource.title}
                    </h3>
                    <p className="text-base text-foreground/70">
                      {resource.description}
                    </p>
                  </div>
                </div>
                <button
                  className="inline-flex items-center justify-center rounded-[12px] bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#00B050] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  type="button"
                >
                  {resource.cta}
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ValidationSection() {
  return (
    <section className="bg-secondary text-secondary-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-6 py-20 text-center md:px-10">
        <Reveal className="space-y-4">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Bravo, formation terminée ! 🎉
          </h2>
          <p className="text-lg text-white/85">
            Merci d’avoir participé. Grâce à toi, la transition 2026 se fera dans la
            sérénité et la confiance.
          </p>
        </Reveal>
        <Reveal>
          <button
            className="inline-flex items-center justify-center rounded-[12px] bg-[#00B050] px-8 py-3 text-base font-semibold text-white shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            type="button"
          >
            Je valide ma formation
          </button>
        </Reveal>
      </div>
    </section>
  );
}
