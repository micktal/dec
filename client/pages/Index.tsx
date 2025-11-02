import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Cog,
  FileText,
  Flag,
  HelpCircle,
  Lightbulb,
  RotateCcw,
  ShieldCheck,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";

import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { cn } from "@/lib/utils";

type ReasonOption = {
  label: string;
  isCorrect: boolean;
};

type ScenarioTone = "positive" | "neutral" | "negative";

type ClientScenarioResponse = {
  label: string;
  tone: ScenarioTone;
  feedback: string;
  isCorrect: boolean;
};

type ClientScenario = {
  id: number;
  name: string;
  archetype: string;
  description: string;
  image: string;
  imageAlt: string;
  dialogue: string;
  responses: ClientScenarioResponse[];
};

type ScenarioFeedback = {
  message: string;
  tone: ScenarioTone;
};

type ScenarioStatus = "pending" | "success" | "partial" | "error";

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
};

const INTRO_HERO_IMAGE =
  "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1600&q=80";

const SECTION_IDS = {
  REASONS: "section-raisons",
  REFLEXES: "section-reflexes",
  SCENARIOS: "section-scenarios",
  FINAL_QUIZ: "section-final-quiz",
  CONCLUSION: "section-conclusion",
} as const;

const MODULE_OBJECTIVES = [
  {
    icon: Target,
    title: "Clarifier la décision nationale",
    description:
      "Comprendre pourquoi Decathlon met fin au paiement par chèque et ce que cela change dans les magasins.",
  },
  {
    icon: Users,
    title: "Accompagner les clients",
    description:
      "Adopter la bonne posture pour rassurer, expliquer et proposer des solutions adaptées à chaque profil.",
  },
  {
    icon: BookOpen,
    title: "S'approprier les bons réflexes",
    description:
      "Retenir les trois réflexes clés et les appliquer sur le terrain pour garantir une expérience fluide.",
  },
  {
    icon: Flag,
    title: "Valider ta maîtrise",
    description:
      "Mesurer ta progression avec les scénarios et le quiz final pour clôturer la formation sereinement.",
  },
] as const;

const MODULE_HIGHLIGHTS = [
  { value: "2026", label: "Fin officielle du paiement par chèque" },
  { value: "3", label: "Réflexes indispensables à adopter" },
  { value: "4", label: "Questions finales pour valider tes acquis" },
] as const;

const LEARNING_STEPS = [
  {
    order: "01",
    title: "Comprendre le changement",
    description: "Découvre les raisons de la transition et gagne en clarté.",
    sectionId: SECTION_IDS.REASONS,
  },
  {
    order: "02",
    title: "Adopter les réflexes",
    description: "Mémorise les attitudes à avoir face aux clients.",
    sectionId: SECTION_IDS.REFLEXES,
  },
  {
    order: "03",
    title: "S'exercer en situation",
    description: "Choisis la bonne réponse dans les scénarios inspirés du terrain.",
    sectionId: SECTION_IDS.SCENARIOS,
  },
  {
    order: "04",
    title: "Valider tes acquis",
    description: "Réponds au quiz final et finalise la formation.",
    sectionId: SECTION_IDS.FINAL_QUIZ,
  },
] as const;

const REASONS = [
  {
    icon: Lightbulb,
    title: "Moins utilisé",
    description:
      "Seuls trois pour cent des paiements en France sont encore effectués par chèque.",
  },
  {
    icon: Cog,
    title: "Traitement plus simple",
    description:
      "Les paiements électroniques réduisent le temps de gestion pour les équipes en magasin.",
  },
  {
    icon: ShieldCheck,
    title: "Sécurité renforcée",
    description:
      "Les transactions dématérialisées limitent les fraudes et sécurisent les encaissements.",
  },
] as const;

const REASON_QUESTION: ReasonOption[] = [
  { label: "Un jour", isCorrect: false },
  { label: "Trois jours", isCorrect: true },
  { label: "Dix jours", isCorrect: false },
];

const REFLEXES = [
  {
    title: "Empathie",
    summary: "Prendre le temps d'écouter et de rassurer chaque client.",
    detail:
      "Accueille chaque réaction en restant disponible et compréhensif. Reformule si besoin pour montrer que tu as entendu la demande.",
  },
  {
    title: "Clarté",
    summary: "Expliquer la règle simplement et avec assurance.",
    detail:
      "Annonce la fin du paiement par chèque avec un vocabulaire précis et positif, en rappelant que c'est une évolution nationale.",
  },
  {
    title: "Alternative",
    summary: "Proposer immédiatement une solution adaptée.",
    detail:
      "Présente les autres moyens de paiement disponibles : carte bancaire, espèces, cartes cadeaux ou paiement en plusieurs fois.",
  },
] as const;

const SCENARIOS: ClientScenario[] = [
  {
    id: 1,
    name: "Madeleine",
    archetype: "Client fidèle et âgé",
    description:
      "Cliente historique attachée à ses habitudes, elle cherche avant tout à être rassurée sur la sécurité des nouveaux moyens de paiement.",
    image:
      "https://images.unsplash.com/photo-1581579186988-c08ddd662fa0?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Cliente senior souriante portant un manteau bleu",
    dialogue:
      "Je paye par chèque depuis 20 ans, je n’ai pas confiance dans la carte bleue !",
    responses: [
      {
        label:
          "Je comprends, c’est un changement important, mais nous avons des solutions simples et sûres : carte ou paiement en plusieurs fois sans frais.",
        tone: "positive",
        feedback:
          "Excellent réflexe ! Tu écoutes, rassures et proposes une alternative concrète et rassurante.",
        isCorrect: true,
      },
      {
        label: "C’est la nouvelle règle, je ne peux rien faire.",
        tone: "negative",
        feedback:
          "Ta réponse manque d’écoute et peut créer de la frustration. Accueille le ressenti et accompagne le changement.",
        isCorrect: false,
      },
      {
        label: "Vous verrez, tout le monde s’y fera.",
        tone: "neutral",
        feedback:
          "Tu restes poli, mais tu ne réponds pas à l’inquiétude. Propose une solution qui rassure immédiatement.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    name: "Nicolas",
    archetype: "Client pressé",
    description:
      "Dans la file d’attente, il veut gagner du temps et s’agace rapidement si la réponse tarde.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Client pressé regardant sa montre dans un magasin",
    dialogue: "Vous perdez du temps avec vos nouvelles règles ! J’ai pas que ça à faire.",
    responses: [
      {
        label:
          "Je comprends, mais la carte bleue reste la plus rapide. Tu peux aussi payer en 3 ou 4 fois sans frais.",
        tone: "positive",
        feedback:
          "Parfait ! Tu restes calme, positif et tu recentres sur le bénéfice client en proposant une solution immédiate.",
        isCorrect: true,
      },
      {
        label: "C’est pas moi qui décide.",
        tone: "negative",
        feedback:
          "Tu alimentes la colère du client au lieu de la désamorcer. Reste acteur et propose une solution rapide.",
        isCorrect: false,
      },
      {
        label: "Oui, c’est agaçant, mais c’est la direction.",
        tone: "neutral",
        feedback:
          "Tu reconnais l’inconfort mais tu n’apportes pas de solution. Recentre sur l’expérience client et propose un plan B.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    name: "Sonia",
    archetype: "Client professionnelle",
    description:
      "Elle représente une mairie ou une association, habituée au chèque administratif et cherche une alternative fiable.",
    image:
      "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Cliente professionnelle discutant avec un vendeur",
    dialogue:
      "Je suis une mairie, on ne peut pas payer autrement que par chèque administratif.",
    responses: [
      {
        label:
          "Bonne nouvelle : Decathlon Pro existe justement pour les paiements professionnels. Je peux vous orienter vers ce service.",
        tone: "positive",
        feedback:
          "Bonne réponse ! Tu proposes une solution adaptée et tu valorises l’accompagnement Decathlon Pro.",
        isCorrect: true,
      },
      {
        label: "Je ne sais pas, ce n’est pas géré ici.",
        tone: "negative",
        feedback:
          "Tu fermes la discussion et risques de frustrer le client. Oriente-le vers une solution concrète.",
        isCorrect: false,
      },
      {
        label: "Les chèques sont interdits pour tout le monde maintenant.",
        tone: "neutral",
        feedback:
          "Ta réponse est correcte mais incomplète. Propose une redirection vers Decathlon Pro pour sécuriser la relation.",
        isCorrect: false,
      },
    ],
  },
];

const FINAL_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "Quel est l'objectif principal de la fin du paiement par chèque chez Decathlon ?",
    options: [
      "Réduire le nombre de clients à la caisse",
      "Simplifier et sécuriser les encaissements",
      "Augmenter les délais de traitement",
      "Imposer un mode de paiement unique",
    ],
    correctIndex: 1,
  },
  {
    id: 2,
    question: "Quelle attitude adopter face à un client surpris ?",
    options: [
      "Lui rappeler que la règle est nationale sans autre explication",
      "Lui conseiller d'aller dans un autre magasin",
      "L'écouter, expliquer la règle et proposer une alternative",
      "Lui proposer de revenir quand la règle aura changé",
    ],
    correctIndex: 2,
  },
  {
    id: 3,
    question: "Quelle alternative peut-on proposer à un client qui n'a pas de carte bancaire ?",
    options: [
      "Aucune solution",
      "Payer en espèces, carte cadeau ou paiement en plusieurs fois",
      "Insister pour qu'il fasse un retrait immédiatement",
      "Contourner la règle et accepter le chèque",
    ],
    correctIndex: 1,
  },
  {
    id: 4,
    question: "Comment maintenir une relation client positive ?",
    options: [
      "En minimisant son ressenti",
      "En restant factuel et distant",
      "En informant avec empathie et clarté",
      "En appliquant la règle sans explication",
    ],
    correctIndex: 2,
  },
];

const TOTAL_QUESTIONS = 8;

type WindowWithScorm = Window & {
  API?: {
    LMSInitialize?: (arg: string) => void;
    LMSSetValue?: (key: string, value: string) => void;
    LMSCommit?: (arg: string) => void;
  };
  scormInit?: () => void;
  updateScore?: (isCorrect: boolean) => void;
  markCompleted?: () => void;
};

export default function Index() {
  const [reasonAnswer, setReasonAnswer] = useState<string | null>(null);
  const [reasonFeedback, setReasonFeedback] = useState<
    { message: string; correct: boolean } | null
  >(null);
  const [reasonScored, setReasonScored] = useState(false);
  const [scenarioResponses, setScenarioResponses] = useState<(number | null)[]>(
    Array(SCENARIOS.length).fill(null),
  );
  const [scenarioFeedback, setScenarioFeedback] = useState<
    (ScenarioFeedback | null)[]
  >(Array.from({ length: SCENARIOS.length }, () => null));
  const [scenarioScored, setScenarioScored] = useState<boolean[]>(
    Array(SCENARIOS.length).fill(false),
  );
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [finalAnswers, setFinalAnswers] = useState<(number | null)[]>(
    Array(FINAL_QUIZ.length).fill(null),
  );
  const [finalSubmitted, setFinalSubmitted] = useState(false);
  const [finalScored, setFinalScored] = useState<boolean[]>(
    Array(FINAL_QUIZ.length).fill(false),
  );

  const scoreRef = useRef(0);

  const scenarioScore = useMemo(
    () => scenarioScored.filter(Boolean).length,
    [scenarioScored],
  );

  const finalScore = useMemo(
    () => finalScored.filter(Boolean).length,
    [finalScored],
  );

  const reasonScore = reasonScored ? 1 : 0;
  const totalScore = reasonScore + scenarioScore + finalScore;
  const moduleCompleted = totalScore >= 4;

  const handleScrollTo = (sectionId: string) => {
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleScrollToReasons = () => {
    handleScrollTo(SECTION_IDS.REASONS);
  };

  const triggerUpdateScore = (isCorrect: boolean) => {
    const win = window as WindowWithScorm;
    if (typeof win.updateScore === "function") {
      win.updateScore(isCorrect);
    }
  };

  const handleReasonAnswer = (option: ReasonOption) => {
    setReasonAnswer(option.label);
    setReasonFeedback({
      message: option.isCorrect
        ? "Exact : trois jours sont généralement nécessaires pour qu'un chèque soit encaissé."
        : "Ce n'est pas la bonne durée. Pense à l'impact logistique des chèques sur nos équipes.",
      correct: option.isCorrect,
    });
    setReasonScored(option.isCorrect);
    triggerUpdateScore(option.isCorrect);
  };

  const handleScenarioSelect = (scenarioIndex: number, optionIndex: number) => {
    const previousResponseIndex = scenarioResponses[scenarioIndex];
    const previousWasCorrect =
      previousResponseIndex !== null &&
      SCENARIOS[scenarioIndex].responses[previousResponseIndex].isCorrect;

    const selectedResponse = SCENARIOS[scenarioIndex].responses[optionIndex];

    setScenarioResponses((prev) => {
      const next = [...prev];
      next[scenarioIndex] = optionIndex;
      return next;
    });

    setScenarioFeedback((prev) => {
      const next = [...prev];
      next[scenarioIndex] = {
        message: selectedResponse.feedback,
        tone: selectedResponse.tone,
      };
      return next;
    });

    setScenarioScored((prev) => {
      const next = [...prev];
      next[scenarioIndex] = selectedResponse.isCorrect;
      return next;
    });

    if (!(previousWasCorrect && selectedResponse.isCorrect)) {
      triggerUpdateScore(selectedResponse.isCorrect);
    }

    setActiveScenarioIndex(scenarioIndex);
  };

  const handleScenarioActivate = (index: number) => {
    setActiveScenarioIndex(index);
  };

  const handleScenarioContinue = () => {
    setActiveScenarioIndex((prev) => Math.min(prev + 1, SCENARIOS.length - 1));
  };

  const handleScenarioReset = () => {
    setScenarioResponses(Array.from({ length: SCENARIOS.length }, () => null));
    setScenarioFeedback(Array.from({ length: SCENARIOS.length }, () => null));
    setScenarioScored(Array.from({ length: SCENARIOS.length }, () => false));
    setActiveScenarioIndex(0);
  };

  const handleFinalAnswer = (questionIndex: number, optionIndex: number) => {
    setFinalAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = optionIndex;
      return next;
    });
  };

  const handleFinalSubmit = () => {
    setFinalSubmitted(true);
    const outcomes = FINAL_QUIZ.map((question, index) => {
      const answer = finalAnswers[index];
      return answer !== null && question.correctIndex === answer;
    });
    setFinalScored(outcomes);
    outcomes.forEach((isCorrect) => triggerUpdateScore(isCorrect));
  };

  const handleFinalReset = () => {
    setFinalAnswers(Array(FINAL_QUIZ.length).fill(null));
    setFinalSubmitted(false);
    setFinalScored(Array(FINAL_QUIZ.length).fill(false));
    triggerUpdateScore(false);
  };

  const handleModuleComplete = () => {
    const win = window as WindowWithScorm;
    if (typeof win.markCompleted === "function") {
      win.markCompleted();
    }
  };

  const computedScore = useMemo(
    () => reasonScore + scenarioScore + finalScore,
    [reasonScore, scenarioScore, finalScore],
  );

  useEffect(() => {
    const win = window as WindowWithScorm;
    const totalQuestions = TOTAL_QUESTIONS;
    let completedFlag = false;

    const scormInit = () => {
      if (win.API && typeof win.API.LMSInitialize === "function") {
        win.API.LMSInitialize("");
        console.log("SCORM initialisé");
      }
    };

    const updateScore = (isCorrect: boolean) => {
      if (!isCorrect) {
        return;
      }
      if (win.API && typeof win.API.LMSSetValue === "function") {
        const percentage = Math.round((scoreRef.current / totalQuestions) * 100);
        win.API.LMSSetValue("cmi.score.raw", String(percentage));
        win.API.LMSCommit?.("");
      }
    };

    const markCompleted = () => {
      if (completedFlag) {
        return;
      }
      if (win.API && typeof win.API.LMSSetValue === "function") {
        const success = scoreRef.current / totalQuestions >= 0.7;
        win.API.LMSSetValue("cmi.completion_status", "completed");
        win.API.LMSSetValue("cmi.success_status", success ? "passed" : "failed");
        win.API.LMSCommit?.("");
        console.log(`Module marqué comme terminé. Score : ${scoreRef.current}`);
      }
      completedFlag = true;
    };

    win.scormInit = scormInit;
    win.updateScore = updateScore;
    win.markCompleted = markCompleted;

    window.addEventListener("load", scormInit);

    return () => {
      window.removeEventListener("load", scormInit);
      delete win.scormInit;
      delete win.updateScore;
      delete win.markCompleted;
    };
  }, []);

  useEffect(() => {
    scoreRef.current = computedScore;
    const display = document.getElementById("scoreDisplay");
    if (display) {
      display.textContent = `Score actuel : ${computedScore}/${TOTAL_QUESTIONS}`;
    }

    const win = window as WindowWithScorm;
    if (win.API && typeof win.API.LMSSetValue === "function") {
      const percentage = Math.round((computedScore / TOTAL_QUESTIONS) * 100);
      win.API.LMSSetValue("cmi.score.raw", String(percentage));
      win.API.LMSCommit?.("");
    }
  }, [computedScore]);

  return (
    <div className="bg-background text-foreground">
      <SiteHeader />
      <main className="flex flex-col">
        <IntroductionSection onStart={handleScrollToReasons} />
        <OverviewSection onNavigate={handleScrollTo} />
        <ReasonsSection
          id={SECTION_IDS.REASONS}
          reasonAnswer={reasonAnswer}
          reasonFeedback={reasonFeedback}
          onSelect={handleReasonAnswer}
        />
        <ReflexesSection id={SECTION_IDS.REFLEXES} />
        <ScenariosSection
          id={SECTION_IDS.SCENARIOS}
          scenarioResponses={scenarioResponses}
          scenarioFeedback={scenarioFeedback}
          onSelect={handleScenarioSelect}
          scenarioScore={scenarioScore}
          activeScenarioIndex={activeScenarioIndex}
          onActivateScenario={handleScenarioActivate}
          onContinueScenario={handleScenarioContinue}
          onResetSimulation={handleScenarioReset}
          onMarkCompleted={handleModuleComplete}
        />
        <FinalQuizSection
          id={SECTION_IDS.FINAL_QUIZ}
          answers={finalAnswers}
          submitted={finalSubmitted}
          onAnswer={handleFinalAnswer}
          onSubmit={handleFinalSubmit}
          onReset={handleFinalReset}
          score={finalScore}
        />
        <ConclusionSection
          id={SECTION_IDS.CONCLUSION}
          totalScore={totalScore}
          moduleCompleted={moduleCompleted}
          onComplete={handleModuleComplete}
        />
      </main>
      <SiteFooter />
    </div>
  );
}

type IntroductionSectionProps = {
  onStart: () => void;
};

function IntroductionSection({ onStart }: IntroductionSectionProps) {
  return (
    <section
      id="section-intro"
      className="relative isolate overflow-hidden bg-[#0082C3] text-white"
    >
      <div className="absolute inset-0 opacity-20">
        <img
          src={INTRO_HERO_IMAGE}
          alt="Equipe Decathlon dans un magasin moderne"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0082C3] via-[#0082C3]/80 to-[#3643BA]/70" />
      </div>
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-24 text-center md:px-10 md:text-left">
        <Reveal className="flex flex-col gap-6 md:max-w-2xl">
          <span className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em]">
            Decathlon Formation
          </span>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Fin du paiement par chèque – Ensemble vers 2026
          </h1>
          <p className="text-lg text-white/80">
            Chez Decathlon, chaque jour est un pas vers plus de simplicité. En 2026, la
            page du chèque se tourne. Ce module t'accompagne pour informer, rassurer et
            guider nos clients avec confiance.
          </p>
        </Reveal>
        <Reveal className="flex flex-col items-center gap-4 md:flex-row md:items-center">
          <button
            onClick={onStart}
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-white px-7 py-3 text-base font-semibold text-[#0082C3] shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#00B050] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Je commence la formation
            <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-sm font-medium text-white/70">
            Durée estimée : douze à quinze minutes – accessible à tous les collaborateurs.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

type OverviewSectionProps = {
  onNavigate: (sectionId: string) => void;
};

function OverviewSection({ onNavigate }: OverviewSectionProps) {
  return (
    <section className="bg-[#F0F6FB] py-20">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 md:px-10">
        <Reveal className="space-y-3 text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">Ta feuille de route</h2>
          <p className="text-lg text-primary/80">
            Visualise les étapes clés et accède rapidement au contenu dont tu as besoin.
          </p>
        </Reveal>
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <Reveal className="space-y-6 text-left">
            <h3 className="text-xl font-semibold text-primary">Objectifs du module</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {MODULE_OBJECTIVES.map((objective) => (
                <div
                  key={objective.title}
                  className="rounded-3xl border border-primary/20 bg-white p-5 shadow-sm shadow-primary/10 transition-transform duration-300 hover:-translate-y-1"
                >
                  <objective.icon className="h-8 w-8 text-primary" aria-hidden="true" />
                  <h4 className="mt-4 text-lg font-semibold text-primary">{objective.title}</h4>
                  <p className="mt-2 text-sm text-foreground/70">{objective.description}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className="space-y-6 text-left">
            <h3 className="text-xl font-semibold text-primary">Repères clés</h3>
            <div className="grid gap-4">
              {MODULE_HIGHLIGHTS.map((highlight) => (
                <div
                  key={highlight.value}
                  className="flex flex-col items-center justify-center rounded-3xl border border-primary/10 bg-white p-6 text-center shadow-md shadow-primary/10"
                >
                  <span className="text-4xl font-bold text-primary">{highlight.value}</span>
                  <p className="mt-2 text-sm text-foreground/70">{highlight.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal className="grid gap-4 md:grid-cols-4">
          {LEARNING_STEPS.map((step) => (
            <button
              key={step.order}
              type="button"
              onClick={() => onNavigate(step.sectionId)}
              className="group relative overflow-hidden rounded-3xl border border-primary/30 bg-white px-6 py-6 text-left shadow-lg shadow-primary/10 transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-white"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary group-hover:text-white">
                Étape {step.order}
              </span>
              <h4 className="mt-3 text-lg font-semibold">{step.title}</h4>
              <p className="mt-2 text-sm text-foreground/70 group-hover:text-white/80">
                {step.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary group-hover:text-white">
                Accéder à la section
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </button>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

type ReasonsSectionProps = {
  id: string;
  reasonAnswer: string | null;
  reasonFeedback: { message: string; correct: boolean } | null;
  onSelect: (option: ReasonOption) => void;
};

function ReasonsSection({ id, reasonAnswer, reasonFeedback, onSelect }: ReasonsSectionProps) {
  return (
    <section id={id} className="bg-white py-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 md:px-10">
        <Reveal className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">Pourquoi le chèque disparaît ?</h2>
          <p className="text-lg text-foreground/70">
            Comprendre les raisons du changement, c'est mieux accompagner les clients et faciliter ton quotidien en caisse.
          </p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {REASONS.map((reason) => (
            <Reveal key={reason.title}>
              <div className="flex h-full flex-col gap-4 rounded-3xl border border-border bg-white p-6 shadow-lg shadow-primary/10 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
                <reason.icon className="h-10 w-10 text-primary" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-primary">{reason.title}</h3>
                <p className="text-base text-foreground/70">{reason.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center shadow-inner">
          <h3 className="text-xl font-semibold text-primary">Mini quiz</h3>
          <p className="mt-2 text-foreground/70">
            Combien de jours en moyenne faut-il pour encaisser un chèque ?
          </p>
          <div className="mt-6 flex flex-col gap-3 md:flex-row md:justify-center">
            {REASON_QUESTION.map((option) => {
              const isSelected = reasonAnswer === option.label;
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => onSelect(option)}
                  className={cn(
                    "rounded-[12px] border px-5 py-3 text-sm font-semibold transition-all duration-300",
                    isSelected
                      ? option.isCorrect
                        ? "border-[#00B050] bg-[#00B050]/10 text-[#00B050]"
                        : "border-red-500 bg-red-500/10 text-red-600"
                      : "border-primary/30 bg-white text-primary hover:-translate-y-0.5 hover:border-primary",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {reasonFeedback && (
            <p
              className={cn(
                "mt-4 text-sm",
                reasonFeedback.correct ? "text-[#00B050]" : "text-red-600",
              )}
            >
              {reasonFeedback.message}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

type ReflexesSectionProps = {
  id?: string;
};

function ReflexesSection({ id }: ReflexesSectionProps) {
  const [activeReflex, setActiveReflex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setActiveReflex((prev) => (prev === index ? null : index));
  };

  return (
    <section id={id} className="bg-[#F7F7F7] py-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 md:px-10">
        <Reveal className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">
            Les 3 réflexes clés à adopter
          </h2>
          <p className="text-lg text-foreground/70">
            Empathie, clarté et alternatives : trois réflexes pour rester performants et proches de nos clients.
          </p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {REFLEXES.map((reflex, index) => {
            const isActive = activeReflex === index;
            return (
              <Reveal key={reflex.title}>
                <button
                  type="button"
                  onClick={() => handleToggle(index)}
                  aria-expanded={isActive}
                  className={cn(
                    "flex w-full flex-col gap-4 rounded-3xl border border-border bg-white p-6 text-left transition-all duration-300",
                    isActive ? "border-primary shadow-xl shadow-primary/10" : "hover:-translate-y-1 hover:border-primary/40",
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-3">
                      <Users className="h-10 w-10 text-primary" aria-hidden="true" />
                      <div>
                        <h3 className="text-xl font-semibold text-primary">{reflex.title}</h3>
                        <p className="text-base text-foreground/70">{reflex.summary}</p>
                      </div>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-6 w-6 shrink-0 text-primary transition-transform duration-300",
                        isActive && "rotate-180",
                      )}
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-sm font-semibold text-primary/70">
                    {isActive ? "Cliquer pour masquer" : "Cliquer pour découvrir le détail"}
                  </span>
                  {isActive && (
                    <p className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed text-primary">
                      {reflex.detail}
                    </p>
                  )}
                </button>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="rounded-3xl border border-primary/30 bg-white p-6 text-center shadow-inner">
          <p className="text-base text-foreground/70">
            Alternatives à proposer : carte bancaire, esp��ces, carte cadeau, paiement en trois ou quatre fois sans frais.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

type ScenariosSectionProps = {
  id?: string;
  scenarioResponses: (number | null)[];
  scenarioFeedback: (ScenarioFeedback | null)[];
  onSelect: (scenarioIndex: number, optionIndex: number) => void;
  scenarioScore: number;
  activeScenarioIndex: number;
  onActivateScenario: (index: number) => void;
  onContinueScenario: () => void;
  onResetSimulation: () => void;
  onMarkCompleted: () => void;
};

function ScenariosSection({
  id,
  scenarioResponses,
  scenarioFeedback,
  onSelect,
  scenarioScore,
  activeScenarioIndex,
  onActivateScenario,
  onContinueScenario,
  onResetSimulation,
  onMarkCompleted,
}: ScenariosSectionProps) {
  const toneToStatus: Record<ScenarioTone, ScenarioStatus> = {
    positive: "success",
    neutral: "partial",
    negative: "error",
  };

  const scenarioStatuses = SCENARIOS.map<ScenarioStatus>((scenario, index) => {
    const selectedOption = scenarioResponses[index];
    if (selectedOption === null || selectedOption === undefined) {
      return "pending";
    }
    return toneToStatus[scenario.responses[selectedOption].tone];
  });

  const statusLabels: Record<ScenarioStatus, string> = {
    pending: "À traiter",
    success: "Acquis",
    partial: "À approfondir",
    error: "À retravailler",
  };

  const statusClasses: Record<ScenarioStatus, string> = {
    pending: "border-primary/20 bg-white text-primary",
    success: "border-primary bg-primary/10 text-primary",
    partial: "border-amber-500 bg-amber-500/10 text-amber-600",
    error: "border-red-500 bg-red-500/10 text-red-600",
  };

  const toneAccentClasses: Record<ScenarioTone, string> = {
    positive: "border-primary bg-primary/10 text-primary",
    neutral: "border-amber-500/50 bg-amber-500/10 text-amber-700",
    negative: "border-red-500/50 bg-red-500/10 text-red-600",
  };

  const toneIcons: Record<ScenarioTone, LucideIcon> = {
    positive: CheckCircle2,
    neutral: HelpCircle,
    negative: AlertCircle,
  };

  const allCompleted = scenarioResponses.every((response) => response !== null);
  const safeScenarioIndex = Math.min(
    Math.max(activeScenarioIndex, 0),
    SCENARIOS.length - 1,
  );
  const currentScenario = SCENARIOS[safeScenarioIndex];
  const currentResponseIndex = scenarioResponses[safeScenarioIndex];
  const currentFeedback = scenarioFeedback[safeScenarioIndex];
  const currentTone =
    currentResponseIndex !== null
      ? currentScenario.responses[currentResponseIndex].tone
      : null;

  const scenarioScoreMessage =
    scenarioScore === SCENARIOS.length
      ? "Bravo ! Tu maîtrises les trois profils clients."
      : scenarioScore === SCENARIOS.length - 1
        ? "Très bien, identifie le dernier profil à renforcer."
        : "Rejoue la simulation pour t'entraîner sur chaque profil.";

  const encouragementMessage =
    scenarioScore === SCENARIOS.length
      ? "Tu es prêt à accompagner chaque client avec calme et empathie."
      : "Garde cette posture : écouter, rassurer, proposer puis conclure positivement.";

  const scorePercent = Math.round((scenarioScore / SCENARIOS.length) * 100);

  return (
    <section id={id} className="bg-white py-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 md:px-10">
        <Reveal className="space-y-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/60">
            Simulation client
          </span>
          <h2 className="text-3xl font-bold text-primary md:text-4xl">
            Simulation client : réagir avec calme et empathie
          </h2>
          <p className="text-lg text-foreground/70">
            Tu es à la caisse. Trois clients réagissent différemment à l’annonce de la fin du paiement par chèque. Sélectionne-les et choisis la réponse la plus adaptée.
          </p>
        </Reveal>
        <Reveal className="rounded-3xl border border-primary/30 bg-primary/5 p-6 text-primary">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">
                Score simulation
              </span>
              <p className="mt-2 text-3xl font-bold">
                {scenarioScore} / {SCENARIOS.length}
              </p>
              <p className="mt-1 text-sm text-primary/70">{scenarioScoreMessage}</p>
            </div>
            <div className="w-full md:w-64">
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/60">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${scorePercent}%` }}
                />
              </div>
              <p className="mt-2 text-right text-xs font-semibold text-primary/70">
                {scorePercent}%
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal className="grid gap-4 md:grid-cols-3">
          {SCENARIOS.map((scenario, index) => {
            const status = scenarioStatuses[index];
            const isActive = index === safeScenarioIndex;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => onActivateScenario(index)}
                className={cn(
                  "flex h-full flex-col gap-3 rounded-3xl border bg-white p-5 text-left transition-all duration-300",
                  isActive
                    ? "border-primary shadow-lg shadow-primary/10"
                    : "border-primary/20 hover:-translate-y-1 hover:border-primary/40",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">
                      {scenario.archetype}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-primary">{scenario.name}</h3>
                  </div>
                </div>
                <p className="text-sm text-foreground/70">{scenario.description}</p>
                <span
                  className={cn(
                    "mt-auto inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                    statusClasses[status],
                  )}
                >
                  {statusLabels[status]}
                </span>
              </button>
            );
          })}
        </Reveal>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <Reveal className="relative overflow-hidden rounded-3xl border border-primary/20 bg-white shadow-lg shadow-primary/10">
            <img
              src={currentScenario.image}
              alt={currentScenario.imageAlt}
              className="h-56 w-full object-cover"
            />
            <div className="space-y-4 p-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">
                  Client {safeScenarioIndex + 1}
                </span>
                <h3 className="mt-2 text-xl font-semibold text-primary">{currentScenario.name}</h3>
                <p className="mt-2 text-sm text-foreground/70">{currentScenario.archetype}</p>
              </div>
              <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/60">
                  Sa réaction
                </p>
                <p className="mt-3 text-base leading-relaxed text-primary">
                  {currentScenario.dialogue}
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal className="flex flex-col gap-6 rounded-3xl border border-primary/20 bg-white p-6 shadow-lg shadow-primary/10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/70">
                Ta réponse
              </p>
              <p className="mt-2 text-lg text-foreground/80">
                Choisis la meilleure posture pour accompagner ce client.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {currentScenario.responses.map((response, optionIndex) => {
                const isSelected = currentResponseIndex === optionIndex;
                const selectionClasses = isSelected
                  ? toneAccentClasses[response.tone]
                  : "border-primary/20 bg-white hover:-translate-y-0.5 hover:border-primary";
                return (
                  <button
                    key={response.label}
                    type="button"
                    onClick={() => onSelect(safeScenarioIndex, optionIndex)}
                    className={cn(
                      "w-full rounded-[12px] border px-5 py-3 text-left text-sm font-medium transition-all duration-300",
                      selectionClasses,
                    )}
                  >
                    {response.label}
                  </button>
                );
              })}
            </div>
            {currentFeedback && currentTone && (
              <div
                className={cn(
                  "rounded-2xl border px-4 py-4 text-sm leading-relaxed transition-colors",
                  toneAccentClasses[currentTone],
                )}
              >
                {(() => {
                  const FeedbackIcon = toneIcons[currentTone];
                  return (
                    <div className="flex items-start gap-3">
                      <FeedbackIcon className="mt-1 h-5 w-5" aria-hidden="true" />
                      <div>
                        <p className="font-semibold uppercase tracking-wide">
                          {statusLabels[toneToStatus[currentTone]]}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed">{currentFeedback.message}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
            {safeScenarioIndex < SCENARIOS.length - 1 && (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-foreground/60">
                  Une fois ta réponse choisie, passe au client suivant.
                </span>
                <button
                  type="button"
                  onClick={onContinueScenario}
                  disabled={currentResponseIndex === null}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-[12px] px-5 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    currentResponseIndex === null
                      ? "cursor-not-allowed border border-primary/20 bg-primary/10 text-primary/50"
                      : "border border-primary bg-primary text-white hover:-translate-y-0.5 hover:bg-[#0066A1]",
                  )}
                >
                  Continuer
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </Reveal>
        </div>
        {allCompleted && (
          <Reveal className="space-y-6 rounded-3xl border border-primary/30 bg-[#F0F6FB] p-8 shadow-lg shadow-primary/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-primary">Débrief pédagogique</h3>
                <p className="mt-2 text-sm text-primary/70">{encouragementMessage}</p>
              </div>
              <div className="rounded-2xl border border-primary/30 bg-white px-6 py-4 text-center text-primary">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">
                  Score simulation
                </span>
                <p className="mt-2 text-3xl font-bold">
                  {scenarioScore} / {SCENARIOS.length}
                </p>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <ul className="space-y-3 text-sm text-primary">
                <li className="rounded-2xl border border-primary/20 bg-white px-4 py-3">
                  Empathie avant explication
                </li>
                <li className="rounded-2xl border border-primary/20 bg-white px-4 py-3">
                  Reformulation pour montrer l’écoute
                </li>
                <li className="rounded-2xl border border-primary/20 bg-white px-4 py-3">
                  Proposition de solution adaptée
                </li>
                <li className="rounded-2xl border border-primary/20 bg-white px-4 py-3">
                  Clôture positive pour rassurer
                </li>
              </ul>
              <div className="space-y-4 text-sm text-primary/80">
                <p>
                  Rappelle-toi : écouter, rassurer, proposer puis conclure positivement permettent de transformer chaque échange en expérience réussie.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <button
                    type="button"
                    onClick={onMarkCompleted}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-[12px] border border-primary bg-primary px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0066A1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Terminer ma formation
                  </button>
                  <button
                    type="button"
                    onClick={onResetSimulation}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-[12px] border border-primary/30 bg-white px-5 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary"
                  >
                    Rejouer la simulation
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

type FinalQuizSectionProps = {
  id?: string;
  answers: (number | null)[];
  submitted: boolean;
  onAnswer: (questionIndex: number, optionIndex: number) => void;
  onSubmit: () => void;
  onReset: () => void;
  score: number;
};

function FinalQuizSection({
  id,
  answers,
  submitted,
  onAnswer,
  onSubmit,
  onReset,
  score,
}: FinalQuizSectionProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  const allAnswered = answers.every((answer) => answer !== null);
  const success = submitted && score >= 3;
  const answeredCount = answers.filter((answer) => answer !== null).length;
  const progressPercent = Math.round((answeredCount / FINAL_QUIZ.length) * 100);
  const progressMessage = submitted
    ? success
      ? "Excellent, tu valides la formation."
      : "Relis les scénarios ou les réflexes puis réessaie."
    : answeredCount === FINAL_QUIZ.length
      ? "Tu peux valider tes réponses."
      : "Réponds à toutes les questions pour débloquer la validation.";
  const resultAccent = success ? "text-[#00B050]" : "text-amber-600";
  const ResultIcon = success ? CheckCircle2 : HelpCircle;

  return (
    <section id={id} className="bg-[#E8F4FB] py-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 md:px-10">
        <Reveal className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">Teste-toi</h2>
          <p className="text-lg text-primary/80">
            Réponds à quatre questions et mesure ta maîtrise des bons réflexes.
          </p>
        </Reveal>
        <Reveal className="rounded-3xl border border-primary/30 bg-primary/5 p-6 shadow-inner">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-left md:max-w-md">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                Progression du quiz
              </span>
              <p className="mt-2 text-2xl font-semibold text-primary">
                {answeredCount} / {FINAL_QUIZ.length} questions répondues
              </p>
              <p className="mt-1 text-sm text-primary/70">{progressMessage}</p>
            </div>
            <div className="w-full md:w-64">
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/60">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-2 text-right text-xs font-semibold text-primary/80">
                {progressPercent}%
              </p>
            </div>
          </div>
        </Reveal>
        <form onSubmit={handleSubmit} className="space-y-6">
          {FINAL_QUIZ.map((question, questionIndex) => (
            <Reveal key={question.id}>
              <fieldset className="rounded-3xl border border-primary/30 bg-white p-6 shadow-lg shadow-primary/10">
                <legend className="text-lg font-semibold text-primary">
                  {question.question}
                </legend>
                <div className="mt-4 grid gap-3">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = answers[questionIndex] === optionIndex;
                    const isCorrect = submitted && question.correctIndex === optionIndex;
                    const isIncorrect =
                      submitted && isSelected && question.correctIndex !== optionIndex;
                    return (
                      <label
                        key={option}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-[12px] border px-4 py-3 text-sm transition-all duration-300",
                          isCorrect
                            ? "border-[#00B050] bg-[#00B050]/10 text-[#00B050]"
                            : isIncorrect
                            ? "border-red-500 bg-red-500/10 text-red-600"
                            : "border-primary/20 bg-primary/5 text-foreground/80 hover:-translate-y-0.5 hover:border-primary",
                        )}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={isSelected}
                          onChange={() => onAnswer(questionIndex, optionIndex)}
                          className="h-4 w-4 border border-primary text-primary focus:ring-primary"
                        />
                        <span>{option}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </Reveal>
          ))}
          <Reveal className="flex flex-col items-center gap-3 text-center">
            <button
              type="submit"
              disabled={!allAnswered || submitted}
              className="inline-flex items-center justify-center rounded-[12px] bg-primary px-7 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#00B050] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              Valider mes réponses
            </button>
            {submitted && (
              <div className="w-full rounded-2xl border border-primary/20 bg-white p-5 text-left shadow-sm">
                <div className="flex items-center gap-3 text-primary">
                  <ResultIcon
                    className={cn("h-5 w-5", resultAccent)}
                    aria-hidden="true"
                  />
                  <p className="text-sm font-semibold">
                    Ton score : {score} / {FINAL_QUIZ.length}
                  </p>
                </div>
                <p className={cn("mt-3 text-sm leading-relaxed", resultAccent)}>
                  {success
                    ? "Bravo, tu maîtrises les bons réflexes."
                    : "Revois les réflexes clés et réessaie."}
                </p>
                <button
                  type="button"
                  onClick={onReset}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-[12px] border border-primary/40 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Recommencer le quiz
                </button>
              </div>
            )}
          </Reveal>
        </form>
      </div>
    </section>
  );
}

type ConclusionSectionProps = {
  id?: string;
  totalScore: number;
  moduleCompleted: boolean;
  onComplete: () => void;
};

function ConclusionSection({
  id,
  totalScore,
  moduleCompleted,
  onComplete,
}: ConclusionSectionProps) {
  return (
    <section id={id} className="bg-[#0082C3] py-24 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 text-center md:px-10">
        <Reveal className="space-y-4">
          <h2 className="text-3xl font-bold md:text-4xl">Conclusion et ressources</h2>
          <p className="text-lg text-white/85">
            Merci pour ton engagement. Grâce à toi, la transition 2026 se fera en douceur et dans un esprit de service.
          </p>
        </Reveal>
        <Reveal className="text-sm font-semibold text-white">
          <p id="scoreDisplay">Score actuel : 0/{TOTAL_QUESTIONS}</p>
        </Reveal>
        <Reveal className="flex flex-col items-center gap-4 text-sm text-white/80">
          <div className="flex items-center gap-3 text-base font-semibold">
            <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            <span>Progression cumulée : {totalScore} points</span>
          </div>
          {moduleCompleted && (
            <p className="text-white">
              Module terminé - bravo pour ta montée en compétences.
            </p>
          )}
        </Reveal>
        <Reveal className="flex flex-col gap-3 md:flex-row md:justify-center">
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-white px-6 py-3 text-base font-semibold text-[#0082C3] shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#00B050] hover:text-white"
          >
            <FileText className="h-5 w-5" aria-hidden="true" />
            Télécharger la fiche mémo PDF
          </a>
          <button
            onClick={onComplete}
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-white/10 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#00B050]"
          >
            <HelpCircle className="h-5 w-5" aria-hidden="true" />
            Je termine ma formation
          </button>
        </Reveal>
        <Reveal className="text-xs text-white/70">
          Document interne – usage exclusif Decathlon France – ne pas diffuser.
        </Reveal>
      </div>
    </section>
  );
}
