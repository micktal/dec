import { Link } from "react-router-dom";
import SiteFooter from "@/components/SiteFooter";

const whyItems = [
  {
    icon: "💡",
    title: "Moderniser",
    description: "Faire évoluer nos pratiques",
  },
  {
    icon: "💬",
    title: "Rassurer",
    description: "Accompagner nos clients avec empathie",
  },
  {
    icon: "⚙️",
    title: "Simplifier",
    description: "Fluidifier les encaissements en magasin",
  },
] as const;

const reflexes = [
  {
    icon: "🫶",
    title: "Empathie",
    description: "Accueille chaque réaction avec calme et écoute.",
  },
  {
    icon: "🗣️",
    title: "Clarté",
    description: "Annonce la règle simplement, sans t'excuser ni justifier.",
  },
  {
    icon: "💳",
    title: "Alternative",
    description: "Propose tout de suite une solution : carte, espèces, carte cadeau.",
  },
] as const;

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&w=2000&q=80";
const INSPIRATION_IMAGE_URL =
  "https://images.unsplash.com/photo-1523419409543-0c1df022bdd1?auto=format&fit=crop&w=2000&q=80";

export default function Index() {
  return (
    <div className="bg-background text-foreground">
      <main className="flex flex-col">
        <HeroSection />
        <WhySection />
        <ReflexesSection />
        <InspirationSection />
        <FinalCTASection />
      </main>
      <SiteFooter />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-primary text-primary-foreground">
      <img
        src={HERO_IMAGE_URL}
        alt="Capitaine Decathlon en action avec un client"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-primary/40 to-secondary/60" />
      <div className="relative z-10 w-full max-w-6xl px-6 py-24 md:px-12">
        <div className="flex flex-col items-start gap-10 text-left md:items-start">
          <span className="inline-flex items-center rounded-full bg-primary-foreground/15 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-primary-foreground shadow-sm backdrop-blur">
            Formation Capitaine · 2026
          </span>
          <div className="space-y-6 text-white">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Capitaine, tu es prêt·e à accompagner le changement ?
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed sm:text-xl">
              En 2026, les paiements par chèque disparaissent. Découvre comment en
              parler à tes clients avec confiance, empathie et clarté.
            </p>
          </div>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <Link
              to="/formation"
              className="inline-flex w-full items-center justify-center rounded-[12px] bg-white px-8 py-4 text-base font-semibold text-primary shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#00B050] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
            >
              Je commence la formation
            </Link>
            <p className="text-sm font-medium text-primary-foreground/80">
              12 à 15 minutes · 100% immersif
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section className="bg-card py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 md:px-12">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Pourquoi cette formation ?
          </h2>
          <p className="text-lg text-foreground/80">
            Le chèque, c'est fini. Et tu es la clé du changement. Ce module t'aide à
            expliquer la nouvelle r��gle sereinement, tout en maintenant une
            expérience client fluide et positive.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {whyItems.map((item) => (
            <div
              key={item.title}
              className="group flex flex-col gap-4 rounded-2xl border border-border bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="text-4xl" aria-hidden="true">
                {item.icon}
              </span>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-primary">
                  {item.title}
                </h3>
                <p className="text-base text-foreground/70">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReflexesSection() {
  return (
    <section className="bg-muted py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 md:px-12">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Tes 3 réflexes clés
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-foreground/75">
            Adopte ces réflexes à chaque échange pour instaurer un climat de confiance
            et mener la transition avec brio.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {reflexes.map((item) => (
            <div
              key={item.title}
              className="group relative flex flex-col gap-6 rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute inset-0 rounded-2xl border border-transparent transition-all duration-300 group-hover:border-primary/60" />
              <div className="relative z-10 space-y-4">
                <span className="text-5xl" aria-hidden="true">
                  {item.icon}
                </span>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-secondary">
                    {item.title}
                  </h3>
                  <p className="text-base text-foreground/70">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InspirationSection() {
  return (
    <section className="relative isolate overflow-hidden py-24">
      <img
        src={INSPIRATION_IMAGE_URL}
        alt="Interaction positive en caisse Decathlon"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-secondary/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/70 via-secondary/60 to-primary/60" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white md:px-12">
        <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
          Chaque client compte. Chaque mot aussi.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-white/90">
          Grâce à toi, la transition vers les nouveaux paiements se fait en confiance.
          Ce module te guide pas à pas pour transformer cette annonce en opportunité de
          lien et de satisfaction client.
        </p>
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section id="formation" className="bg-secondary py-20 text-secondary-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-6 text-center md:px-12">
        <h2 className="text-3xl font-bold sm:text-4xl">À toi de jouer, Capitaine !</h2>
        <p className="max-w-2xl text-lg text-white/85">
          Ce module interactif t'attend — durée : 12 à 15 minutes. Tu y trouveras des
          scripts, des conseils et des mises en situation pour accompagner chaque
          client avec assurance.
        </p>
        <Link
          to="/formation"
          className="inline-flex items-center justify-center rounded-[12px] bg-white px-10 py-4 text-base font-semibold text-secondary shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#00B050] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Démarrer la formation maintenant
        </Link>
      </div>
    </section>
  );
}
