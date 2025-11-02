import { Link } from "react-router-dom";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=2000&q=80";

const WHY_ITEMS = [
  {
    icon: "💡",
    title: "Moderniser",
    description: "Simplifier nos encaissements",
  },
  {
    icon: "💬",
    title: "Rassurer",
    description: "Accompagner nos clients avec empathie",
  },
  {
    icon: "⚙️",
    title: "Faciliter",
    description: "Rendre chaque passage en caisse plus fluide",
  },
] as const;

const MISSION_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1200&q=80",
    alt: "Équipe en caisse Decathlon",
    caption: "Accueil et caisse",
  },
  {
    src: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80",
    alt: "Technicien atelier",
    caption: "Atelier et services",
  },
  {
    src: "https://images.unsplash.com/photo-1521337706265-3c7abb882bc2?auto=format&fit=crop&w=1200&q=80",
    alt: "Conseiller en rayon",
    caption: "Rayon et conseil",
  },
] as const;

const TESTIMONIALS = [
  {
    name: "Sarah",
    role: "Hôtesse de caisse",
    quote: "Les scripts m’ont aidée à rester calme.",
  },
  {
    name: "Maxime",
    role: "Technicien atelier",
    quote: "Les clients comprennent quand on reste clair.",
  },
  {
    name: "Julie",
    role: "Responsable accueil",
    quote: "Ce module m’a donné les bons mots.",
  },
] as const;

const REFLEXES = [
  {
    icon: "🫶",
    title: "Empathie",
    description: "Accueille chaque réaction avec calme et écoute.",
  },
  {
    icon: "🗣️",
    title: "Clarté",
    description: "Annonce la règle simplement, sans t’excuser.",
  },
  {
    icon: "💳",
    title: "Alternative",
    description:
      "Propose une solution immédiate : carte, espèces, carte cadeau.",
  },
] as const;

export default function Index() {
  return (
    <div className="bg-background text-foreground">
      <main className="flex flex-col">
        <HeroSection />
        <WhySection />
        <MissionSection />
        <TestimonialsSection />
        <ReflexesSection />
        <AccessibilitySection />
        <FinalCTASection />
      </main>
      <SiteFooter />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[calc(100vh-3rem)] items-center justify-center overflow-hidden bg-primary">
      <img
        src={HERO_IMAGE_URL}
        alt="Équipe Decathlon souriante"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/40 to-secondary/60" />
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-6 py-24 text-center text-white md:px-10">
        <Reveal className="w-full">
          <span className="inline-flex items-center justify-center rounded-full bg-white/15 px-6 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/80 drop-shadow">
            Fin du paiement par chèque – Ensemble vers 2026
          </span>
        </Reveal>
        <Reveal className="mt-8 w-full space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-white drop-shadow-2xl sm:text-5xl lg:text-6xl">
            Tu fais partie du changement. Ensemble, on avance vers 2026 !
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">
            À partir de 2026, les chèques ne seront plus acceptés. Découvre comment
            accompagner nos clients avec clarté et empathie.
          </p>
        </Reveal>
        <Reveal className="mt-10 flex w-full flex-col items-center gap-4">
          <Link
            to="/formation"
            className="inline-flex items-center justify-center rounded-[12px] bg-white px-8 py-4 text-base font-semibold text-primary shadow-xl shadow-black/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#00B050] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Je commence la formation
          </Link>
          <p className="text-sm font-semibold text-white/80">
            Durée : 12 à 15 minutes – Accessible à tous, à tout moment.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section className="bg-card py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 md:px-10">
        <Reveal className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-primary sm:text-4xl">
            Pourquoi cette formation ?
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-foreground/70">
            Le chèque, c’est fini, mais la confiance reste. Cette formation t’aide à
            expliquer le changement simplement, avec empathie et les bons mots.
          </p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {WHY_ITEMS.map((item) => (
            <Reveal key={item.title}>
              <div className="flex h-full flex-col gap-4 rounded-3xl border border-transparent bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
                <span className="text-5xl" aria-hidden="true">
                  {item.icon}
                </span>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-primary">{item.title}</h3>
                  <p className="text-base text-foreground/70">{item.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function MissionSection() {
  return (
    <section className="bg-[#E8F4FB] py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 md:px-10">
        <Reveal className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-primary sm:text-4xl">
            Une mission d’équipe
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-primary/80">
            Chaque collaborateur compte. En caisse, en rayon ou à l’accueil, ta façon
            d’expliquer ce changement fait toute la différence.
          </p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {MISSION_IMAGES.map((image) => (
            <Reveal key={image.src}>
              <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-lg shadow-primary/20">
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <div className="px-6 py-4 text-center">
                  <p className="text-base font-semibold text-primary">
                    {image.caption}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="bg-muted py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 md:px-10">
        <Reveal className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-primary sm:text-4xl">
            Ils l’ont déjà testé
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-foreground/70">
            Des collègues de toute la France ont adopté les bons réflexes pour faire
            passer le message avec sérénité.
          </p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <Reveal key={testimonial.name}>
              <div className="flex h-full flex-col gap-4 rounded-3xl border border-transparent bg-white p-8 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-lg font-semibold text-primary">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-semibold text-primary">
                      {testimonial.name}
                    </span>
                    <span className="text-sm text-foreground/60">
                      {testimonial.role}
                    </span>
                  </div>
                </div>
                <p className="text-base leading-relaxed text-foreground/75">
                  “{testimonial.quote}”
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReflexesSection() {
  return (
    <section className="bg-card py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 md:px-10">
        <Reveal className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-primary sm:text-4xl">
            Tes 3 réflexes clés
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-foreground/70">
            Applique ces réflexes à chaque échange pour garantir une transition fluide
            et positive pour nos clients.
          </p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {REFLEXES.map((item) => (
            <Reveal key={item.title}>
              <div className="group flex h-full flex-col gap-5 rounded-3xl border border-border bg-white p-8 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl">
                <span className="text-5xl" aria-hidden="true">
                  {item.icon}
                </span>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-secondary">{item.title}</h3>
                  <p className="text-base text-foreground/70">{item.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function AccessibilitySection() {
  return (
    <section className="bg-card py-20">
      <Reveal className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-6 text-center md:px-10">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary sm:text-4xl">
            Une formation pour tous
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-foreground/70">
            Accessible sur mobile, tablette et ordinateur. Pensée pour tous les métiers
            et tous les rythmes.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 text-3xl text-primary">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
            📱
          </span>
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
            💻
          </span>
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
            🧏‍♀️
          </span>
        </div>
      </Reveal>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section className="bg-secondary text-secondary-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 py-20 text-center md:px-10">
        <Reveal className="space-y-4">
          <h2 className="text-3xl font-bold sm:text-4xl">À toi de jouer !</h2>
          <p className="max-w-2xl text-lg text-white/85">
            Découvre le module interactif et fais partie du mouvement. Ensemble, nous
            préparons l’expérience client de demain.
          </p>
        </Reveal>
        <Reveal>
          <Link
            to="/formation"
            className="inline-flex items-center justify-center rounded-[12px] bg-white px-8 py-3 text-base font-semibold text-primary shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#00B050] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Démarrer la formation maintenant
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
