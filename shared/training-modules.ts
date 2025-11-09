export const SECTION_IDS = {
  INTRO: "section-intro",
  OVERVIEW: "section-overview",
  POSTURE: "section-posture",
  REFLEXES: "section-reflexes",
  CLIENT_GUIDE: "section-clients",
  SCENARIOS: "section-scenarios",
  PODCAST: "section-podcast",
  SYNTHESIS: "section-synthese",
  FINAL_QUIZ: "section-final-quiz",
  CONCLUSION: "section-conclusion",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

function createModuleList() {
  return [
    {
      order: "00",
      moduleId: "introduction",
      title: "Introduction à la transition",
      description:
        "Découvre les enjeux du passage à une caisse sans chèque et le rôle attendu des capitaines.",
      sectionId: SECTION_IDS.INTRO,
      type: "intro" as const,
      badgeLabel: "Introduction",
    },
    {
      order: "00B",
      moduleId: "ta-feuille-de-route",
      title: "Ta feuille de route",
      description:
        "Visualise les objectifs, repères clés et l'ensemble des modules pour préparer ton parcours.",
      sectionId: SECTION_IDS.OVERVIEW,
      type: "intro" as const,
      badgeLabel: "Ta feuille de route",
    },
    {
      order: "01",
      moduleId: "etape-01",
      title: "Adopter la posture verbale & non verbale",
      description:
        "Pose les bases : mots, ton et attitude pour désamorcer les tensions.",
      sectionId: SECTION_IDS.POSTURE,
      type: "step" as const,
    },
    {
      order: "02",
      moduleId: "etape-02",
      title: "Les 3 réflexes clés à adopter",
      description:
        "Empathie, clarté et alternatives pour accompagner chaque client avec assurance.",
      sectionId: SECTION_IDS.REFLEXES,
      type: "step" as const,
    },
    {
      order: "03",
      moduleId: "etape-03",
      title: "Comprendre les réactions",
      description: "Explore les profils clients et prépare tes réponses clés.",
      sectionId: SECTION_IDS.CLIENT_GUIDE,
      type: "step" as const,
    },
    {
      order: "04",
      moduleId: "etape-04",
      title: "Comprendre les réactions",
      description: "Explore les profils clients et prépare tes réponses clés.",
      sectionId: SECTION_IDS.CLIENT_GUIDE,
      type: "step" as const,
    },
    {
      order: "05",
      moduleId: "etape-05",
      title: "S'exercer en situation",
      description: "Choisis la bonne réponse dans les scénarios inspirés du terrain.",
      sectionId: SECTION_IDS.SCENARIOS,
      type: "step" as const,
    },
    {
      order: "06",
      moduleId: "etape-06",
      title: "Écouter le terrain",
      description:
        "Découvre l'expérience de Muriel, capitaine de magasin Decathlon.",
      sectionId: SECTION_IDS.PODCAST,
      type: "step" as const,
    },
    {
      order: "07",
      moduleId: "etape-07",
      title: "Activer tes forces",
      description:
        "Synthétise les apprentissages et prépare ton passage à l'action.",
      sectionId: SECTION_IDS.SYNTHESIS,
      type: "step" as const,
    },
    {
      order: "08",
      moduleId: "examen-final",
      title: "Valider tes acquis",
      description: "Réponds au quiz final et finalise la formation.",
      sectionId: SECTION_IDS.FINAL_QUIZ,
      type: "exam" as const,
      badgeLabel: "Examen final",
    },
  ] as const;
}

export const TRAINING_MODULES = createModuleList();

export type TrainingModule = (typeof TRAINING_MODULES)[number];
export type ModuleId = TrainingModule["moduleId"];
export type ModuleType = TrainingModule["type"];
export type LearningStep = Extract<TrainingModule, { type: "step" | "exam" }>;

export function getModuleBadgeLabel(module: TrainingModule) {
  return module.badgeLabel ?? `Étape ${module.order}`;
}

function isLearningStep(module: TrainingModule): module is LearningStep {
  return module.type !== "intro";
}

export const STEP_MODULES = TRAINING_MODULES.filter(isLearningStep);

export function getModuleById(moduleId: string) {
  return TRAINING_MODULES.find((module) => module.moduleId === moduleId);
}
