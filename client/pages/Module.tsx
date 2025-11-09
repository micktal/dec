import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  ClientUnderstandingSection,
  FINAL_QUIZ,
  FinalQuizSection,
  IntroductionSection,
  OverviewSection,
  PostureChapter,
  PodcastSection,
  ReflexesSection,
  SCENARIOS,
  ScenariosSection,
  SynthesisSection,
  type ScenarioFeedback,
} from "./Index";
import {
  SECTION_IDS,
  TRAINING_MODULES,
  getModuleBadgeLabel,
  type ModuleId,
  type TrainingModule,
} from "@shared/training-modules";

const MODULE_MAP = TRAINING_MODULES.reduce<Record<string, number>>(
  (acc, step, index) => {
    acc[step.moduleId] = index;
    return acc;
  },
  {},
);

type ModuleHeroProps = {
  title: string;
  description: string;
  badgeLabel: string;
};

type NavigationContext = {
  previous?: TrainingModule;
  next?: TrainingModule;
};

type ModuleRendererProps = {
  onNavigateNext: () => void;
  canNavigateForward: boolean;
};

type ModuleRenderer = (props: ModuleRendererProps) => JSX.Element;

const moduleRenderers: Record<ModuleId, ModuleRenderer> = {
  introduction: (props) => <IntroductionModule {...props} />,
  "ta-feuille-de-route": () => <OverviewSection />,
  "etape-01": () => <PostureChapter id={SECTION_IDS.POSTURE} />,
  "etape-02": () => <ReflexesSection id={SECTION_IDS.REFLEXES} />,
  "etape-03": () => <ClientUnderstandingSection id={SECTION_IDS.CLIENT_GUIDE} />,
  "etape-04": (props) => <ScenariosModule {...props} />,
  "etape-05": () => <PodcastSection id={SECTION_IDS.PODCAST} />,
  "etape-06": () => <SynthesisSection id={SECTION_IDS.SYNTHESIS} />,
  "examen-final": () => <ExamModule />,
};

type ModulePageProps = {
  scormModule?: string;
};

export default function ModulePage({ scormModule }: ModulePageProps) {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();

  if (!moduleId || !(moduleId in MODULE_MAP)) {
    return <Navigate to="/" replace />;
  }

  if (scormModule && moduleId !== scormModule) {
    return <Navigate to={`/modules/${scormModule}`} replace />;
  }

  const moduleIndex = MODULE_MAP[moduleId];
  const moduleMeta = TRAINING_MODULES[moduleIndex];
  let previous = moduleIndex > 0 ? TRAINING_MODULES[moduleIndex - 1] : undefined;
  let next =
    moduleIndex < TRAINING_MODULES.length - 1
      ? TRAINING_MODULES[moduleIndex + 1]
      : undefined;

  const isStandalone = Boolean(scormModule);

  if (isStandalone) {
    previous = undefined;
    next = undefined;
  }

  const handleNavigate = (target?: TrainingModule) => {
    if (!target || isStandalone) {
      return;
    }
    navigate(`/modules/${target.moduleId}`);
  };

  const Renderer = moduleRenderers[moduleMeta.moduleId as ModuleId];
  const canNavigateForward = Boolean(next);

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F6FF]">
      <SiteHeader />
      <main className="flex-1">
        <ModuleHero
          title={moduleMeta.title}
          description={moduleMeta.description}
          badgeLabel={getModuleBadgeLabel(moduleMeta)}
        />
        <div className="bg-white">
          <Renderer
            onNavigateNext={() => handleNavigate(next)}
            canNavigateForward={canNavigateForward}
          />
        </div>
        <ModuleNavigation previous={previous} next={next} />
      </main>
      <SiteFooter />
    </div>
  );
}

function ModuleHero({ title, description, badgeLabel }: ModuleHeroProps) {
  return (
    <section className="bg-[#0A1F7A] py-16 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 md:px-10">
        <Link
          to="/"
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Retour à l'accueil formation
        </Link>
        <div className="space-y-3">
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
            {badgeLabel}
          </span>
          <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
          <p className="max-w-3xl text-base text-white/80 md:text-lg">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}

function ModuleNavigation({ previous, next }: NavigationContext) {
  if (!previous && !next) {
    return null;
  }

  return (
    <section className="bg-white py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between">
        {previous ? (
          <Link
            to={`/modules/${previous.moduleId}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-[#163FAF]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {getModuleBadgeLabel(previous)}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            to={`/modules/${next.moduleId}`}
            className="inline-flex items-center gap-2 rounded-[12px] bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#163FAF]"
          >
            {getModuleBadgeLabel(next)}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </section>
  );
}

function IntroductionModule(_: ModuleRendererProps) {
  return <IntroductionSection />;
}

function ScenariosModule({ onNavigateNext }: ModuleRendererProps) {
  const [scenarioResponses, setScenarioResponses] = useState<(number | null)[]>(
    () => Array(SCENARIOS.length).fill(null),
  );
  const [scenarioFeedback, setScenarioFeedback] = useState<
    (ScenarioFeedback | null)[]
  >(() => Array.from({ length: SCENARIOS.length }, () => null));
  const [scenarioScoreFlags, setScenarioScoreFlags] = useState<boolean[]>(
    () => Array(SCENARIOS.length).fill(false),
  );
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);

  const scenarioScore = useMemo(
    () => scenarioScoreFlags.filter(Boolean).length,
    [scenarioScoreFlags],
  );

  const handleSelect = (scenarioIndex: number, optionIndex: number) => {
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

    setScenarioScoreFlags((prev) => {
      const next = [...prev];
      next[scenarioIndex] = selectedResponse.isCorrect;
      return next;
    });

    setActiveScenarioIndex(scenarioIndex);
  };

  const handleActivateScenario = (index: number) => {
    setActiveScenarioIndex(index);
  };

  const handleContinueScenario = () => {
    setActiveScenarioIndex((prev) => Math.min(prev + 1, SCENARIOS.length - 1));
  };

  const handleResetSimulation = () => {
    setScenarioResponses(Array(SCENARIOS.length).fill(null));
    setScenarioFeedback(Array.from({ length: SCENARIOS.length }, () => null));
    setScenarioScoreFlags(Array(SCENARIOS.length).fill(false));
    setActiveScenarioIndex(0);
  };

  const handleComplete = () => {
    onNavigateNext();
  };

  return (
    <ScenariosSection
      id={SECTION_IDS.SCENARIOS}
      scenarioResponses={scenarioResponses}
      scenarioFeedback={scenarioFeedback}
      onSelect={handleSelect}
      scenarioScore={scenarioScore}
      activeScenarioIndex={activeScenarioIndex}
      onActivateScenario={handleActivateScenario}
      onContinueScenario={handleContinueScenario}
      onResetSimulation={handleResetSimulation}
      onMarkCompleted={handleComplete}
    />
  );
}

function ExamModule() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => Array(FINAL_QUIZ.length).fill(null),
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = optionIndex;
      return next;
    });
  };

  const handleSubmit = () => {
    const computedScore = answers.reduce((total, answer, index) => {
      if (answer === null) {
        return total;
      }
      return total + (FINAL_QUIZ[index].correctIndex === answer ? 1 : 0);
    }, 0);
    setScore(computedScore);
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers(Array(FINAL_QUIZ.length).fill(null));
    setSubmitted(false);
    setScore(0);
  };

  return (
    <FinalQuizSection
      id={SECTION_IDS.FINAL_QUIZ}
      answers={answers}
      submitted={submitted}
      onAnswer={handleAnswer}
      onSubmit={handleSubmit}
      onReset={handleReset}
      score={score}
    />
  );
}
