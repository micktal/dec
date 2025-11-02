import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Cog,
  FileText,
  HelpCircle,
  Lightbulb,
  ListChecks,
  RotateCcw,
  ShieldCheck,
  Users,
} from "lucide-react";

import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { cn } from "@/lib/utils";

type ReasonOption = {
  label: string;
  isCorrect: boolean;
};

type Scenario = {
  id: number;
  title: string;
  description: string;
  options: { label: string; isCorrect: boolean; feedback: string }[];
};

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
};

const INTRO_HERO_IMAGE =
  "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1600&q=80";

const REASONS = [
  {
    icon: Lightbulb,
    title: "Moins utilisé",
    description: "Seuls trois pour cent des paiements en France sont encore effectués par chèque.",
  },
  {
    icon: Cog,
    title: "Traitement plus simple",
    description: "Les paiements électroniques réduisent le temps de gestion pour les ��quipes en magasin.",
  },
  {
    icon: ShieldCheck,
    title: "Sécurité renforcée",
    description: "Les transactions dématérialisées limitent les fraudes et sécurisent les encaissements.",
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

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "Client surpris à la caisse",
    description:
      "Un client découvre la fin du paiement par chèque au moment de régler.",
    options: [
      {
        label: "Tu l'invites à revenir avec un autre moyen de paiement sans proposer d'aide.",
        isCorrect: false,
        feedback: "Cette réponse peut générer de la frustration. Propose une solution alternative immédiatement.",
      },
      {
        label: "Tu expliques calmement la nouvelle règle et proposes une solution rapide.",
        isCorrect: true,
        feedback: "Bonne approche : tu rassures le client tout en l'orientant vers une solution concrète.",
      },
      {
        label: "Tu suggères de contacter un responsable plus tard pour trouver une solution.",
        isCorrect: false,
        feedback: "Reste acteur du changement et accompagne le client dès maintenant.",
      },
    ],
  },
  {
    id: 2,
    title: "Client mécontent",
    description:
      "Un client exprime son agacement et dit qu'il préférait le chèque.",
    options: [
      {
        label: "Tu lui rappelles que les chèques sont dépassés et qu'il n'a pas le choix.",
        isCorrect: false,
        feedback: "Garde un ton positif et inclusif pour maintenir une bonne relation client.",
      },
      {
        label: "Tu reconnais que c'est une nouveauté pour tous et expliques les avantages.",
        isCorrect: true,
        feedback: "Tu fais preuve d'empathie tout en valorisant le changement : excellente réponse.",
      },
      {
        label: "Tu demandes au client de se renseigner sur internet par lui-même.",
        isCorrect: false,
        feedback: "Propose ton aide sur place pour garder la maîtrise de la situation.",
      },
    ],
  },
  {
    id: 3,
    title: "Client administratif",
    description:
      "Un client associatif cherche une solution pour régler un achat important.",
    options: [
      {
        label: "Tu lui expliques que le chèque était réservé aux professionnels et que c'est terminé.",
        isCorrect: false,
        feedback: "Propose une alternative concrète plutôt que de fermer la discussion.",
      },
      {
        label: "Tu l'orientes vers Decathlon Pro et les solutions de paiement adaptées.",
        isCorrect: true,
        feedback: "Exact : tu restes dans l'accompagnement en proposant un parcours dédié.",
      },
      {
        label: "Tu lui conseilles de diviser l'achat en plusieurs transactions plus petites.",
        isCorrect: false,
        feedback: "Recherche une solution officielle pour éviter les complications.",
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

export default function Index() {
  const introRef = useRef<HTMLElement | null>(null);
  const [reasonAnswer, setReasonAnswer] = useState<string | null>(null);
  const [reasonFeedback, setReasonFeedback] = useState<null | {
    message: string;
    correct: boolean;
  }>(null);
  const [activeReflex, setActiveReflex] = useState<number | null>(null);
  const [scenarioResponses, setScenarioResponses] = useState<(number | null)[]>(
    Array(SCENARIOS.length).fill(null),
  );
  const [scenarioFeedback, setScenarioFeedback] = useState<(string | null)[]>(
    Array(SCENARIOS.length).fill(null),
  );
  const [finalAnswers, setFinalAnswers] = useState<(number | null)[]>(
    Array(FINAL_QUIZ.length).fill(null),
  );
  const [finalSubmitted, setFinalSubmitted] = useState(false);

  const handleStart = useCallback(() => {
    const target = document.getElementById("section-raisons");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    if (!introRef.current) {
      introRef.current = document.getElementById("section-intro");
    }
  }, []);

  const scenarioScore = useMemo(
    () =>
      scenarioResponses.reduce((count, value, index) => {
        if (value === null) return count;
        return count + (SCENARIOS[index].options[value].isCorrect ? 1 : 0);
      }, 0),
    [scenarioResponses],
  );

  const finalScore = useMemo(() => {
    if (!finalSubmitted) return 0;
    return finalAnswers.reduce((count, answer, index) => {
      if (answer === null) return count;
      return count + (FINAL_QUIZ[index].correctIndex === answer ? 1 : 0);
    }, 0);
  }, [finalAnswers, finalSubmitted]);

  const reasonScore = reasonFeedback?.correct ? 1 : 0;
  const totalScore = reasonScore + scenarioScore + finalScore;
  const moduleCompleted = totalScore >= 4;

  const handleReasonAnswer = (option: ReasonOption) => {
    setReasonAnswer(option.label);
    setReasonFeedback({
      message: option.isCorrect
        ? "Exact : trois jours sont généralement nécessaires pour qu'un chèque soit encaissé."
        : "Ce n'est pas la bonne durée. Pense à l'impact logistique des chèques sur nos équipes.",
      correct: option.isCorrect,
    });
  };

  const handleScenarioSelect = (scenarioIndex: number, optionIndex: number) => {
    setScenarioResponses((prev) => {
      const next = [...prev];
      next[scenarioIndex] = optionIndex;
      return next;
    });
    setScenarioFeedback((prev) => {
      const next = [...prev];
      next[scenarioIndex] = SCENARIOS[scenarioIndex].options[optionIndex].feedback;
      return next;
    });
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
  };

  const handleFinalReset = () => {
    setFinalAnswers(Array(FINAL_QUIZ.length).fill(null));
    setFinalSubmitted(false);
  };

  return (
    <div className="bg-background text-foreground">
      <SiteHeader />
      <main className="flex flex-col">
        <IntroductionSection onStart={handleStart} />
        <ReasonsSection
          id="section-raisons"
          reasonAnswer={reasonAnswer}
          reasonFeedback={reasonFeedback}
          onSelect={handleReasonAnswer}
        />
        <ReflexesSection activeReflex={activeReflex} onToggle={setActiveReflex} />
        <ScenariosSection
          scenarioResponses={scenarioResponses}
          scenarioFeedback={scenarioFeedback}
          onSelect={handleScenarioSelect}
          scenarioScore={scenarioScore}
        />
        <FinalQuizSection
          answers={finalAnswers}
          submitted={finalSubmitted}
          onAnswer={handleFinalAnswer}
          onSubmit={handleFinalSubmit}
          onReset={handleFinalReset}
          score={finalScore}
        />
        <ConclusionSection totalScore={totalScore} moduleCompleted={moduleCompleted} />
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
  activeReflex: number | null;
  onToggle: (index: number | null) => void;
};

function ReflexesSection({ activeReflex, onToggle }: ReflexesSectionProps) {
  const handleToggle = (index: number) => {
    onToggle(activeReflex === index ? null : index);
  };

  return (
    <section className="bg-[#F7F7F7] py-24">
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
                  className="group [perspective:2000px]"
                >
                  <div
                    className={cn(
                      "relative h-full min-h-[260px] w-full rounded-3xl border border-border bg-white text-left transition-transform duration-500 [transform-style:preserve-3d]",
                      isActive ? "[transform:rotateY(180deg)]" : "hover:-translate-y-1",
                    )}
                  >
                    <div className="absolute inset-0 flex h-full flex-col gap-4 p-6 [backface-visibility:hidden]">
                      <Users className="h-10 w-10 text-primary" aria-hidden="true" />
                      <h3 className="text-xl font-semibold text-primary">{reflex.title}</h3>
                      <p className="text-base text-foreground/70">{reflex.summary}</p>
                      <span className="mt-auto text-sm font-semibold text-primary/70">
                        Cliquer pour découvrir le détail
                      </span>
                    </div>
                    <div className="absolute inset-0 flex h-full flex-col justify-center gap-4 rounded-3xl bg-primary/95 p-6 text-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <h3 className="text-xl font-semibold">{reflex.title}</h3>
                      <p className="text-base text-white/85">{reflex.detail}</p>
                      <span className="text-sm font-semibold text-white/70">
                        Cliquer pour revenir
                      </span>
                    </div>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="rounded-3xl border border-primary/30 bg-white p-6 text-center shadow-inner">
          <p className="text-base text-foreground/70">
            Alternatives à proposer : carte bancaire, espèces, carte cadeau, paiement en trois ou quatre fois sans frais.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

type ScenariosSectionProps = {
  scenarioResponses: (number | null)[];
  scenarioFeedback: (string | null)[];
  onSelect: (scenarioIndex: number, optionIndex: number) => void;
  scenarioScore: number;
};

function ScenariosSection({
  scenarioResponses,
  scenarioFeedback,
  onSelect,
  scenarioScore,
}: ScenariosSectionProps) {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 md:px-10">
        <Reveal className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">Et toi, que ferais-tu ?</h2>
          <p className="text-lg text-foreground/70">
            Analyse trois situations vécues en magasin et choisis la réponse la plus adaptée. Le score s'affiche au fur et à mesure.
          </p>
        </Reveal>
        <div className="grid gap-6">
          {SCENARIOS.map((scenario, scenarioIndex) => (
            <Reveal key={scenario.id}>
              <div className="rounded-3xl border border-border bg-white p-6 shadow-lg shadow-primary/10">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2 md:max-w-2xl">
                    <h3 className="text-xl font-semibold text-primary">{scenario.title}</h3>
                    <p className="text-base text-foreground/70">{scenario.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary/80">
                    <ListChecks className="h-5 w-5" aria-hidden="true" />
                    <span>Question {scenarioIndex + 1}</span>
                  </div>
                </div>
                <div className="mt-6 grid gap-3">
                  {scenario.options.map((option, optionIndex) => {
                    const isSelected = scenarioResponses[scenarioIndex] === optionIndex;
                    const isCorrectSelection = isSelected && option.isCorrect;
                    const isIncorrectSelection = isSelected && !option.isCorrect;
                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => onSelect(scenarioIndex, optionIndex)}
                        className={cn(
                          "rounded-[12px] border px-5 py-3 text-left text-sm font-medium transition-all duration-300",
                          isCorrectSelection
                            ? "border-[#00B050] bg-[#00B050]/10 text-[#00B050]"
                            : isIncorrectSelection
                            ? "border-red-500 bg-red-500/10 text-red-600"
                            : "border-primary/20 bg-primary/5 text-foreground/80 hover:-translate-y-0.5 hover:border-primary",
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                {scenarioFeedback[scenarioIndex] && (
                  <p className="mt-4 text-sm text-primary">
                    {scenarioFeedback[scenarioIndex]}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="flex flex-col items-center gap-3 rounded-3xl border border-primary/30 bg-primary/5 p-6 text-center text-primary">
          <span className="text-sm font-semibold uppercase tracking-[0.3em]">Score scénarios</span>
          <span className="text-3xl font-bold">{scenarioScore} / {SCENARIOS.length}</span>
        </Reveal>
      </div>
    </section>
  );
}

type FinalQuizSectionProps = {
  answers: (number | null)[];
  submitted: boolean;
  onAnswer: (questionIndex: number, optionIndex: number) => void;
  onSubmit: () => void;
  onReset: () => void;
  score: number;
};

function FinalQuizSection({
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

  return (
    <section className="bg-[#E8F4FB] py-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 md:px-10">
        <Reveal className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">Teste-toi</h2>
          <p className="text-lg text-primary/80">
            Réponds à quatre questions et mesure ta maîtrise des bons réflexes.
          </p>
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
              <div className="space-y-2 text-sm">
                <p className="text-primary">
                  Ton score : {score} / {FINAL_QUIZ.length}
                </p>
                <p className={success ? "text-[#00B050]" : "text-amber-600"}>
                  {success
                    ? "Bravo, tu maîtrises les bons réflexes."
                    : "Revois les réflexes clés et réessaie."}
                </p>
                <button
                  type="button"
                  onClick={onReset}
                  className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-primary/40 bg-white px-4 py-2 text-xs font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary"
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
  totalScore: number;
  moduleCompleted: boolean;
};

function ConclusionSection({ totalScore, moduleCompleted }: ConclusionSectionProps) {
  return (
    <section className="bg-[#0082C3] py-24 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 text-center md:px-10">
        <Reveal className="space-y-4">
          <h2 className="text-3xl font-bold md:text-4xl">Conclusion et ressources</h2>
          <p className="text-lg text-white/85">
            Merci pour ton engagement. Grâce à toi, la transition 2026 se fera en douceur et dans un esprit de service.
          </p>
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
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-white/10 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#00B050]"
          >
            <HelpCircle className="h-5 w-5" aria-hidden="true" />
            Retour à la page d'accueil
          </Link>
        </Reveal>
        <Reveal className="text-xs text-white/70">
          Document interne – usage exclusif Decathlon France – ne pas diffuser.
        </Reveal>
      </div>
    </section>
  );
}
