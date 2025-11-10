import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  FileText,
  Flag,
  HelpCircle,
  RotateCcw,
  Target,
  Users,
  Volume2,
  type LucideIcon,
} from "lucide-react";

import DecathlonLogo from "@/components/DecathlonLogo";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { cn as combineClasses } from "@/lib/utils";
import {
  SECTION_IDS,
  STEP_MODULES,
  TRAINING_MODULES,
  getModuleBadgeLabel,
} from "@shared/training-modules";

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

export type ScenarioFeedback = {
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

export const LEARNING_STEPS = STEP_MODULES;

const POSTURE_SECTION_IMAGE =
  "https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2Fdaa219c5357a45b0882f4acfb8c73563?format=webp&width=800";

const POSTURE_PILLARS = [
  {
    title: "Les mots qui apaisent",
    description:
      "Des phrases simples et positives installent immédiatement un climat de confiance.",
    guidelines: [
      "Commencer par reformuler l'émotion ou la situation vécue.",
      "Relier la transition à un bénéfice concret pour le client.",
      "Terminer par une proposition d'accompagnement ou une alternative.",
    ],
  },
  {
    title: "Le ton qui rassure",
    description:
      "Une voix posée et chaleureuse montre que tu maîtrises le changement.",
    guidelines: [
      "Parler lentement et articuler pour laisser le temps d'intégrer l'information.",
      "Sourire en parlant : le sourire s'entend et apaise.",
      "Utiliser un vocabulaire positif qui ouvre la discussion.",
    ],
  },
  {
    title: "Le corps qui confirme",
    description:
      "Regard, posture et gestes soutiennent ton message et montrent ton écoute.",
    guidelines: [
      "Garder le regard à hauteur du client pour montrer ta disponibilité.",
      "Adopter une posture ouverte, épaules détendues et mains visibles.",
      "Acquiescer en rythme pour montrer que tu suis son raisonnement.",
    ],
  },
] as const;

const POSTURE_SEQUENCE = [
  {
    title: "1. Accueillir avant d'expliquer",
    description:
      "Laisse le client exprimer sa réaction, respire et reformule sa phrase pour valider son ressenti.",
  },
  {
    title: "2. Poser le cadre simplement",
    description:
      "Annonce la fin du chèque avec des mots positifs et relie la décision à la sécurité et à la rapidité du service.",
  },
  {
    title: "3. Proposer une solution adaptée",
    description:
      "Présente immédiatement deux alternatives concrètes pour que le client se projette.",
  },
  {
    title: "4. Conclure en accompagnant",
    description:
      "Vérifie que tout est clair, reste disponible et invite le client à revenir vers toi si besoin.",
  },
] as const;

const POSTURE_WORDING_GUIDE = [
  {
    avoid: "On ne prend plus les chèques.",
    prefer: "On simplifie les paiements pour vous.",
    explanation:
      "On remplace une fermeture par une solution tournée vers le client.",
  },
  {
    avoid: "C’est comme ça maintenant.",
    prefer: "Depuis 2026, on a harmonisé les moyens de paiement.",
    explanation: "On apporte un contexte national au lieu d'opposer le client.",
  },
  {
    avoid: "C’est la règle.",
    prefer: "C’est pour sécuriser et accélérer vos encaissements.",
    explanation: "On transforme la contrainte en bénéfice tangible.",
  },
  {
    avoid: "Je ne peux rien faire.",
    prefer:
      "Je peux vous proposer une carte cadeau ou un paiement en plusieurs fois.",
    explanation: "On reste acteur en offrant immédiatement des options.",
  },
] as const;

const POSTURE_FIELD_CASES = [
  {
    title: "Client fidèle et surpris",
    context:
      "Il arrive avec son carnet de chèques et craint une erreur de paiement.",
    approach:
      "Reformule sa crainte, rappelle que l'objectif est d'éviter les retours chèque et propose la carte ou le paiement fractionné.",
    keyPoint:
      "Il repart rassuré car tu as reconnu son habitude et proposé un accompagnement.",
  },
  {
    title: "Client pressé dans la file",
    context:
      "Il s'impatiente et pense que la nouvelle règle va retarder son passage.",
    approach:
      "Montre que la carte est immédiate, propose l'encaissement sans contact et reste calme pour abaisser la tension.",
    keyPoint:
      "Il comprend que la nouvelle procédure est la plus rapide pour lui.",
  },
  {
    title: "Client professionnel",
    context:
      "Une mairie ou association doit respecter un circuit administratif précis.",
    approach:
      "Présente Decathlon Pro, explique le paiement par virement ou mandat et propose de l'aider à créer son compte.",
    keyPoint:
      "Tu valorises la solution dédiée et tu restes son point de contact.",
  },
] as const;

type ToneQuality = "recommended" | "toAdjust" | "toAvoid";

const POSTURE_TONE_SAMPLES: Array<{
  label: string;
  description: string;
  focus: string;
  quality: ToneQuality;
}> = [
  {
    label: "Version chaleureuse",
    description: "Voix souriante, rythme calme, rassurant.",
    focus:
      "C'est la référence : tu laisses le temps au client et ton sourire s'entend.",
    quality: "recommended",
  },
  {
    label: "Version neutre",
    description: "Voix correcte mais un peu distante.",
    focus:
      "À ajuster : ajoute plus de chaleur et ralentis légèrement le rythme.",
    quality: "toAdjust",
  },
  {
    label: "Version pressée",
    description: "Voix rapide, un peu stressée.",
    focus:
      "À éviter : le client ressent ton urgence et ne se sent pas accompagné.",
    quality: "toAvoid",
  },
];

const TONE_QUALITY_STYLES: Record<ToneQuality, string> = {
  recommended: "border-primary bg-primary/10 text-primary",
  toAdjust: "border-amber-500 bg-amber-500/10 text-amber-700",
  toAvoid: "border-red-500 bg-red-500/10 text-red-600",
};

type ClientGuideEntry = {
  title: string;
  situation: string;
  concerns: string[];
  posture: string[];
  objective: string;
};

const CLIENT_REACTIONS_GUIDE: ClientGuideEntry[] = [
  {
    title: "Le client fidèle et âgé",
    situation:
      "Il découvre le changement à la caisse et se sent perdu ou inquiet face à la disparition du chèque.",
    concerns: [
      "Peur de la carte bancaire et des risques de piratage",
      "Méfiance envers les outils numériques",
      "Sentiment de perdre une habitude rassurante",
    ],
    posture: [
      "Accueillir la réaction avec bienveillance et respect",
      "Expliquer que l'évolution simplifie et sécurise les encaissements",
      "Proposer immédiatement des alternatives : CB, carte cadeau ou paiement fractionné",
    ],
    objective:
      "Qu'il reparte rassuré, accompagné et confiant dans les nouvelles solutions.",
  },
  {
    title: "Le client pressé ou agacé",
    situation:
      "Dans la file d'attente, il veut aller vite et voit la fin du chèque comme une contrainte inutile.",
    concerns: [
      "Frustration liée au temps d'attente",
      "Impression que le changement complique son passage",
      "Volonté d'en finir rapidement pour poursuivre sa journée",
    ],
    posture: [
      "Rester calme et courtois même si le ton monte",
      "Reformuler avec empathie pour montrer que tu comprends son besoin de rapidité",
      "Valoriser la carte bancaire et le paiement fractionné sans frais pour gagner du temps",
    ],
    objective:
      "Transformer la tension en échange positif en démontrant que la nouvelle solution est plus fluide.",
  },
  {
    title: "Le client professionnel ou administratif",
    situation:
      "Il représente une structure (mairie, association) habituée au chèque administratif et craint d'être bloqué.",
    concerns: [
      "Peur de ne plus pouvoir commander pour son organisation",
      "Méconnaissance des solutions Decathlon Pro",
      "Sentiment de ne pas être pris en compte dans la décision",
    ],
    posture: [
      "Montrer que tu comprends son besoin professionnel",
      "Expliquer que Decathlon Pro propose des procédures adaptées à son contexte",
      "Orienter vers le bon contact ou le site Decathlon Pro pour finaliser l'achat",
    ],
    objective:
      "Apporter une solution claire et professionnelle pour transformer le changement en opportunité.",
  },
];

const SYNTHESIS_PILLARS = [
  {
    title: "Empathie active",
    description:
      "Tu mets le client en confiance dès les premiers mots. Reformule, regarde-le, fais preuve de patience : tu poses la base d'un échange respectueux.",
    checkpoints: [
      "Accueillir l'émotion avant d'apporter la solution",
      "Montrer que tu comprends son vécu et ses habitudes",
    ],
  },
  {
    title: "Clarté assumée",
    description:
      "Tu expliques la décision nationale avec simplicité. Quand le message est clair, le client per��oit notre professionnalisme et notre cohérence.",
    checkpoints: [
      "Présenter les bénéfices : sécurité, rapidité, modernisation",
      "Rester positif et aligné avec le projet 2026",
    ],
  },
  {
    title: "Solutions immédiates",
    description:
      "Tu transformes la contrainte en opportunité en proposant immédiatement une alternative adaptée à son profil.",
    checkpoints: [
      "Carte bancaire, paiement fractionné, carte cadeau, Decathlon Pro",
      "Toujours laisser le choix pour renforcer la confiance",
    ],
  },
] as const;

const SYNTHESIS_ACTIONS = [
  {
    label: "Avant la caisse",
    detail:
      "Prépare-toi en équipe : partage les propositions d’alternatives et synchronise vos discours.",
  },
  {
    label: "Pendant l'échange",
    detail:
      "Respire, écoute, rassure. Puis propose la solution la plus simple pour le client.",
  },
  {
    label: "Après le passage",
    detail:
      "Note les questions fréquentes et remonte-les pour améliorer encore notre accompagnement.",
  },
] as const;

const PODCAST_RESOURCE = {
  title: "Interview de Muriel, capitaine Decathlon",
  description:
    "Muriel partage ses astuces pour accompagner les clients avec empathie, rassurer sur la fin du chèque et mobiliser l'équipe.",
  duration: "Durée : 6 minutes",
  url: "https://cdn.builder.io/o/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2F886519d4f49444b29c0bc13eb3871646?alt=media&token=00798ddb-4c68-4ce8-a9bf-c2f4725eed1f&apiKey=d93d9a0ec7824aa1ac4d890a1f90a2ec",
} as const;

const REFLEXES_FOUNDATION = [
  {
    title: "Pourquoi ces réflexes ?",
    description:
      "Ils permettent d'absorber les réactions à chaud et d'orienter rapidement le client vers une solution qui lui donne confiance.",
    highlights: [
      "Créer un climat de dialogue dès les premi��res secondes",
      "Reformuler pour montrer que tu as bien entendu le besoin",
    ],
  },
  {
    title: "L'importance de la clarté",
    description:
      "Un message simple et assumé évite les malentendus et rassure sur notre professionnalisme.",
    highlights: [
      "Expliquer que la décision est nationale et pensée pour sécuriser",
      "Montrer les bénéfices concrets : encaissement plus rapide et sécurisé",
    ],
  },
  {
    title: "Proposer des alternatives",
    description:
      "En présentant immédiatement des options, tu transformes une frustration en opportunité de service.",
    highlights: [
      "Cartes bancaires, cartes cadeaux, paiement en plusieurs fois",
      "Orientation vers Decathlon Pro pour les professionnels",
    ],
  },
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
      "Annonce la fin du paiement par chèque avec un vocabulaire précis et positif, en rappelant que c'est une ��volution nationale.",
  },
  {
    title: "Alternative",
    summary: "Proposer immédiatement une solution adaptée.",
    detail:
      "Présente les autres moyens de paiement disponibles : carte bancaire, espèces, cartes cadeaux ou paiement en plusieurs fois.",
  },
] as const;

export const SCENARIOS: ClientScenario[] = [
  {
    id: 1,
    name: "Madeleine",
    archetype: "Client fidèle et âgé",
    description:
      "Cliente historique attachée à ses habitudes, elle cherche avant tout à être rassurée sur la sécurité des nouveaux moyens de paiement.",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2F9ff59852f0244eefa50bd8a2d16636c9?format=webp&width=800",
    imageAlt: "Jeune femme souriante aux cheveux roux en extérieur",
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
      "https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2Fbc78fb0da55d47f3af3c89bd0a9e1409?format=webp&width=800",
    imageAlt:
      "Homme contrarié aux cheveux bouclés portant une veste en cuir noire",
    dialogue:
      "Vous perdez du temps avec vos nouvelles règles ! J’ai pas que ça à faire.",
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
    name: "Marc",
    archetype: "Client professionnel",
    description:
      "Il représente une mairie ou une association, habitué au chèque administratif et cherche une alternative fiable.",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2F6fb5b2c534fb434d94e6dd6c25b2d333?format=webp&width=800",
    imageAlt: "Homme en entrepôt tenant une tablette",
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

const EXCEPTIONAL_SCENARIOS: never[] = [];

function shuffleArray<T>(items: readonly T[]): T[] {
  const array = [...items];
  for (let index = array.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
  }
  return array;
}

export const FINAL_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question:
      "Quel trio de réflexes te permet de sécuriser la fin du paiement par chèque ?",
    options: [
      "Empathie, clarté et alternatives proposées immédiatement",
      "Rigidité, rappel strict de la règle et distance",
      "Délégation systématique vers un collègue",
      "Humour, changement de sujet et passage rapide",
    ],
    correctIndex: 0,
  },
  {
    id: 2,
    question:
      "Face à un client pressé ou agacé, quelle posture illustre l'empathie active ?",
    options: [
      "Rester calme, reformuler et valoriser la rapidité de la CB ou du paiement fractionné",
      "Répondre sur le même ton pour s'imposer",
      "Ignorer son ressenti et encaisser sans explication",
      "Lui demander de revenir quand il sera plus disponible",
    ],
    correctIndex: 0,
  },
  {
    id: 3,
    question: "Comment accompagner un client professionnel inquiet ?",
    options: [
      "Accepter exceptionnellement son chèque administratif",
      "L'orienter vers Decathlon Pro et ses procédures adaptées",
      "Lui proposer uniquement de payer en espèces",
      "Refuser la vente s'il n'a pas de carte bancaire",
    ],
    correctIndex: 1,
  },
  {
    id: 4,
    question:
      "Selon la synthèse, quelle action mène-tu après le passage en caisse ?",
    options: [
      "Tourner immédiatement la page pour gagner du temps",
      "Partager les questions fréquentes pour renforcer l'accompagnement équipe",
      "Changer de caisse pour ne plus recroiser le client",
      "Ne rien dire pour éviter de créer de nouvelles discussions",
    ],
    correctIndex: 1,
  },
];

export const TOTAL_QUESTIONS = 7;

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

function markScormCompletion() {
  if (typeof window === "undefined") {
    return;
  }
  const win = window as WindowWithScorm;
  if (typeof win.markCompleted === "function") {
    win.markCompleted();
    return;
  }
  if (win.API?.LMSSetValue && win.API?.LMSCommit) {
    win.API.LMSSetValue("lesson_status", "completed");
    win.API.LMSCommit("");
  }
}

const COMPLETION_BUTTON_BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-[12px] px-5 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 w-full md:w-auto";

const COMPLETION_BUTTON_VARIANTS: Record<"light" | "dark", string> = {
  light:
    "border border-primary/20 bg-primary/5 text-primary hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 focus-visible:outline-primary",
  dark:
    "border border-white/30 bg-white/10 text-white hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/20 focus-visible:outline-white",
};

type CompletionButtonProps = {
  variant?: "light" | "dark";
  label?: string;
  className?: string;
};

function CompletionButton({
  variant = "light",
  label,
  className,
}: CompletionButtonProps) {
  return (
    <button
      type="button"
      onClick={markScormCompletion}
      className={combineClasses(
        COMPLETION_BUTTON_BASE_CLASSES,
        COMPLETION_BUTTON_VARIANTS[variant],
        className,
      )}
    >
      {label ?? "Marquer le module comme terminé"}
    </button>
  );
}

export default function Index() {
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

  const totalScore = scenarioScore + finalScore;
  const moduleCompleted = totalScore >= 4;

  const scenarioAttempted = scenarioResponses.some((value) => value !== null);
  const finalAttempted = finalAnswers.some((value) => value !== null);
  const shouldShowProgress =
    moduleCompleted || finalSubmitted || scenarioAttempted || finalAttempted;

  const progressSummary = useMemo(
    () => ({
      totalScore,
      totalQuestions: SCENARIOS.length + FINAL_QUIZ.length,
    }),
    [totalScore],
  );

  const handleScrollTo = (sectionId: string) => {
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const triggerUpdateScore = (isCorrect: boolean) => {
    const win = window as WindowWithScorm;
    if (typeof win.updateScore === "function") {
      win.updateScore(isCorrect);
    }
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
    markScormCompletion();
  };

  const computedScore = useMemo(
    () => scenarioScore + finalScore,
    [scenarioScore, finalScore],
  );

  useEffect(() => {
    const win = window as WindowWithScorm;
    const totalQuestions = TOTAL_QUESTIONS;
    let completedFlag = false;

    const scormInit = () => {
      if (win.API && typeof win.API.LMSInitialize === "function") {
        win.API.LMSInitialize("");
        console.log("SCORM initialis��");
      }
    };

    const updateScore = (isCorrect: boolean) => {
      if (!isCorrect) {
        return;
      }
      if (win.API && typeof win.API.LMSSetValue === "function") {
        const percentage = Math.round(
          (scoreRef.current / totalQuestions) * 100,
        );
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
        win.API.LMSSetValue(
          "cmi.success_status",
          success ? "passed" : "failed",
        );
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
        <IntroductionSection />
        <OverviewSection />
        <PostureChapter id={SECTION_IDS.POSTURE} />
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
        <ClientUnderstandingSection id={SECTION_IDS.CLIENT_GUIDE} />
        <PodcastSection id={SECTION_IDS.PODCAST} />
        <SynthesisSection id={SECTION_IDS.SYNTHESIS} />
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
          shouldShowProgress={shouldShowProgress}
          moduleCompleted={moduleCompleted}
          progress={progressSummary}
        />
      </main>
      <SiteFooter />
    </div>
  );
}

export function IntroductionSection() {
  return (
    <section
      id={SECTION_IDS.INTRO}
      className="relative isolate overflow-hidden bg-[#1C4ED8] text-white"
    >
      <div className="absolute inset-0 opacity-20">
        <img
          src={INTRO_HERO_IMAGE}
          alt="Equipe Decathlon dans un magasin moderne"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1C4ED8] via-[#1C4ED8]/85 to-[#142F8A]/75" />
      </div>
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-24 text-center md:px-10 md:text-left">
        <Reveal className="flex flex-col gap-6 md:max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Ensemble vers 2026
          </h1>
          <p className="text-lg text-white/85">
            Depuis toujours, Decathlon évolue pour rendre le sport accessible à
            tous — facilement, rapidement et en toute confiance. En 2026, nous
            franchissons une nouvelle étape avec l’arrêt progressif du paiement
            par chèque dans nos magasins, pour offrir des parcours plus sûrs et
            plus fluides.
          </p>
        </Reveal>
        <Reveal className="grid gap-8 rounded-3xl bg-white/10 p-8 text-left text-white backdrop-blur md:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4 text-base leading-relaxed">
            <p>
              Ce changement est une évolution naturelle : les chèques sont
              désormais rares et longs à traiter, alors que nos solutions
              digitales sont plus sûres, rapides et déjà largement adoptées.
            </p>
            <p>
              Cette formation t’accompagne pour vivre la transition dans un
              esprit positif, clair et bienveillant. Ton rôle est déterminant
              pour rassurer, expliquer et guider chaque client vers la solution
              qui lui convient.
            </p>
            <div className="space-y-2 rounded-2xl bg-white/10 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
                Pourquoi cette formation ?
              </h3>
              <ul className="space-y-2 text-sm text-white/85">
                <li>
                  Anticiper les réactions en caisse et y répondre avec sérénité.
                </li>
                <li>
                  Clarifier le changement et en expliquer les bénéfices
                  concrets.
                </li>
                <li>
                  Proposer immédiatement des alternatives de paiement adaptées.
                </li>
              </ul>
            </div>
          </div>
          <div className="space-y-6 rounded-2xl bg-white/5 p-6 text-white">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
              Ce que tu vas apprendre
            </h3>
            <ol className="space-y-3 text-sm leading-relaxed">
              <li className="rounded-2xl border border-white/20 bg-white/5 p-4">
                Expliquer calmement la fin du paiement par chèque et ses
                bénéfices.
              </li>
              <li className="rounded-2xl border border-white/20 bg-white/5 p-4">
                Identifier les attentes de chaque profil client pour adapter ton
                discours.
              </li>
              <li className="rounded-2xl border border-white/20 bg-white/5 p-4">
                Répondre avec empathie, reformuler et maintenir une relation
                positive.
              </li>
              <li className="rounded-2xl border border-white/20 bg-white/5 p-4">
                Proposer des solutions alternatives : CB, paiement fractionné,
                cartes cadeaux ou accompagnement Decathlon Pro.
              </li>
            </ol>
            <div className="rounded-2xl border border-white/20 bg-white/5 p-4 text-sm leading-relaxed text-white/85">
              Tu trouveras des explications simples, des réponses types et des
              mises en situation interactives pour t’entraîner avant la
              rencontre client.
            </div>
          </div>
        </Reveal>
        <Reveal>
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/15 bg-white/5 p-2 shadow-lg shadow-black/20">
              <div className="relative aspect-video w-full overflow-hidden rounded-[20px]">
                <video
                  className="h-full w-full object-cover"
                  controls
                  preload="metadata"
                  poster="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2Fcc1ffb661a2148659931e8d42572c5a9?format=webp&width=800"
                >
                  <source
                    src="https://cdn.builder.io/o/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2F0d8db92093804cbabdfb9b951b363788?alt=media&token=838e0f80-f4b9-42b8-baae-967cdb4c7e14&apiKey=d93d9a0ec7824aa1ac4d890a1f90a2ec"
                    type="video/mp4"
                  />
                  Votre navigateur ne prend pas en charge la lecture vidéo.
                </video>
              </div>
            </div>
            <CompletionButton variant="dark" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export type OverviewSectionProps = {
  id?: string;
};

export function OverviewSection({
  id = SECTION_IDS.OVERVIEW,
}: OverviewSectionProps) {
  return (
    <section id={id} className="bg-[#EEF2FF] py-20">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 md:px-10">
        <Reveal className="space-y-4 text-center">
          <DecathlonLogo
            className="mx-auto h-10 w-auto drop-shadow-sm"
            aria-label="Decathlon"
          />
          <h2 className="text-3xl font-bold text-primary md:text-4xl">
            Ta feuille de route
          </h2>
          <p className="text-lg text-primary/80">
            Visualise les étapes clés et accède rapidement au contenu dont tu as
            besoin.
          </p>
        </Reveal>
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <Reveal className="space-y-6 text-left">
            <h3 className="text-xl font-semibold text-primary">
              Objectifs du module
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {MODULE_OBJECTIVES.map((objective) => (
                <div
                  key={objective.title}
                  className="rounded-3xl border border-primary/20 bg-white p-5 shadow-sm shadow-primary/10 transition-transform duration-300 hover:-translate-y-1"
                >
                  <objective.icon
                    className="h-8 w-8 text-primary"
                    aria-hidden="true"
                  />
                  <h4 className="mt-4 text-lg font-semibold text-primary">
                    {objective.title}
                  </h4>
                  <p className="mt-2 text-sm text-foreground/70">
                    {objective.description}
                  </p>
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
                  <span className="text-4xl font-bold text-primary">
                    {highlight.value}
                  </span>
                  <p className="mt-2 text-sm text-foreground/70">
                    {highlight.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal className="grid gap-4 md:grid-cols-4">
          {TRAINING_MODULES.map((module) => (
            <div
              key={module.moduleId}
              className="group relative overflow-hidden rounded-3xl border border-primary/30 bg-white px-6 py-6 text-left shadow-lg shadow-primary/10 transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-white"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary group-hover:text-white">
                {getModuleBadgeLabel(module)}
              </span>
              <h4 className="mt-3 text-lg font-semibold">{module.title}</h4>
              <p className="mt-2 text-sm text-foreground/70 group-hover:text-white/80">
                {module.description}
              </p>
            </div>
          ))}
        </Reveal>
        <Reveal className="flex justify-center md:justify-start">
          <CompletionButton variant="light" />
        </Reveal>
      </div>
    </section>
  );
}

type PostureChapterProps = {
  id?: string;
};

export function PostureChapter({ id }: PostureChapterProps) {
  return (
    <section id={id} className="bg-[#0E1A5F] py-24 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 md:px-10">
        <Reveal className="space-y-4 text-left">
          <h2 className="text-3xl font-bold md:text-4xl">
            Posture verbale et non verbale
          </h2>
          <p className="text-sm text-white/80">
            Cette première étape te donne la méthode pour annoncer la fin du
            chèque sans créer de tension. Tu vas ancrer des réflexes de
            communication qui rassurent, expliquent et ouvrent la discussion.
          </p>
        </Reveal>
        <Reveal className="overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-lg shadow-black/30">
          <video
            controls
            preload="none"
            className="h-full w-full"
            poster="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2F3c4a13fa5f384fd794dc351ae2c88966?format=webp&width=800"
          >
            <source
              src="https://cdn.builder.io/o/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2Fed02354c607e4c948da46f9e36552d6b?alt=media&token=45c7913d-2f95-40c0-8036-6ce183629083&apiKey=d93d9a0ec7824aa1ac4d890a1f90a2ec"
              type="video/mp4"
            />
            Ton navigateur ne supporte pas la lecture vidéo.
          </video>
        </Reveal>

        <Reveal className="rounded-3xl border border-white/15 bg-white/10 p-8 shadow-lg shadow-black/30">
          <div className="space-y-6 text-left">
            <h3 className="text-2xl font-semibold text-white">
              Les fondamentaux à retenir
            </h3>
            <p className="text-sm text-white/80">
              Pour sécuriser l'annonce, combine toujours les mots, le ton et le
              langage corporel. Voici comment les travailler ensemble.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {POSTURE_PILLARS.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-3xl border border-white/20 bg-white/5 p-6 text-white"
                >
                  <h4 className="text-lg font-semibold text-white">
                    {pillar.title}
                  </h4>
                  <p className="mt-2 text-sm text-white/80">
                    {pillar.description}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-white/70">
                    {pillar.guidelines.map((item) => (
                      <li
                        key={item}
                        className="rounded-2xl border border-white/20 bg-white/5 px-3 py-2"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="rounded-3xl border border-white/15 bg-white/10 p-8 shadow-lg shadow-black/30">
          <div className="space-y-6 text-left">
            <h3 className="text-2xl font-semibold text-white">
              Déroulé conseillé en caisse
            </h3>
            <p className="text-sm text-white/80">
              Suis ces étapes dans l'ordre pour guider le client de l'émotion
              vers la solution.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {POSTURE_SEQUENCE.map((step) => (
                <div
                  key={step.title}
                  className="rounded-3xl border border-white/20 bg-white/5 p-6 text-white"
                >
                  <h4 className="text-base font-semibold text-white">
                    {step.title}
                  </h4>
                  <p className="mt-2 text-sm text-white/75">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="rounded-3xl border border-white/15 bg-white/10 p-8 shadow-lg shadow-black/30">
          <div className="space-y-6 text-left">
            <h3 className="text-2xl font-semibold text-white">
              Exemples terrain guidés
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              {POSTURE_FIELD_CASES.map((item) => (
                <div
                  key={item.title}
                  className="flex h-full flex-col gap-4 rounded-3xl border border-white/20 bg-white/5 p-6 text-sm text-white/80"
                >
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {item.title}
                    </h4>
                    <p className="mt-2">{item.context}</p>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-white/80">
                    <p className="font-semibold text-white">
                      Approche conseillée
                    </p>
                    <p className="mt-2">{item.approach}</p>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-white">
                    {item.keyPoint}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="rounded-3xl border border-white/15 bg-white/10 p-8 shadow-lg shadow-black/30">
          <div className="space-y-6 text-left">
            <h3 className="text-2xl font-semibold text-white">
              Phrases à privilégier
            </h3>
            <p className="text-sm text-white/80">
              Remplace les formulations qui ferment la discussion par des
              phrases qui montrent l'accompagnement.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {POSTURE_WORDING_GUIDE.map((pair) => (
                <div
                  key={pair.avoid}
                  className="rounded-3xl border border-white/20 bg-white/5 p-6 text-white"
                >
                  <div className="space-y-2 text-sm">
                    <div className="rounded-2xl border border-red-400/40 bg-red-400/10 px-3 py-2 text-red-100">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em]">
                        À éviter
                      </p>
                      <p className="mt-1 text-white">{pair.avoid}</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-3 py-2 text-emerald-100">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em]">
                        À privilégier
                      </p>
                      <p className="mt-1 text-white">{pair.prefer}</p>
                    </div>
                    <p className="text-white/75">{pair.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="rounded-3xl border border-white/15 bg-white/10 p-8 shadow-lg shadow-black/30">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white">
              Travailler son ton de voix
            </h3>
            <p className="text-sm text-white/80">
              Compare les trois versions et retiens les points forts à amplifier
              ou les défauts à corriger pour rester engageant.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {POSTURE_TONE_SAMPLES.map((sample) => (
                <div
                  key={sample.label}
                  className={combineClasses(
                    "flex h-full flex-col gap-3 rounded-[18px] border px-5 py-4 text-left text-sm transition-all duration-300",
                    TONE_QUALITY_STYLES[sample.quality],
                  )}
                >
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                      {sample.label}
                    </p>
                    <p className="text-sm text-white/85">
                      {sample.description}
                    </p>
                  </div>
                  <p className="rounded-[12px] border border-white/20 bg-white/10 p-3 text-xs leading-relaxed text-white/85">
                    {sample.focus}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal className="flex justify-center md:justify-start">
          <CompletionButton variant="dark" />
        </Reveal>
      </div>
    </section>
  );
}

type ReflexesSectionProps = {
  id?: string;
};

export function ReflexesSection({ id }: ReflexesSectionProps) {
  const [activeReflex, setActiveReflex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setActiveReflex((prev) => (prev === index ? null : index));
  };

  return (
    <section id={id} className="bg-[#F3F6FF] py-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 md:px-10">
        <Reveal className="space-y-4 text-center">
          <DecathlonLogo
            className="mx-auto h-9 w-auto drop-shadow-sm"
            aria-label="Decathlon"
          />
          <h2 className="text-3xl font-bold text-primary md:text-4xl">
            Les 3 réflexes clés à adopter
          </h2>
          <p className="text-lg text-foreground/70">
            Empathie, clarté et alternatives : trois réflexes pour rester
            performants et proches de nos clients.
          </p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {REFLEXES_FOUNDATION.map((foundation) => (
            <Reveal key={foundation.title}>
              <div className="flex h-full flex-col gap-3 rounded-3xl border border-primary/20 bg-white/70 p-6 text-left shadow-sm shadow-primary/10">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">
                    À retenir
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-primary">
                    {foundation.title}
                  </h3>
                </div>
                <p className="text-sm text-foreground/70">
                  {foundation.description}
                </p>
                <ul className="space-y-2 text-sm text-primary">
                  {foundation.highlights.map((point) => (
                    <li
                      key={point}
                      className="rounded-2xl border border-primary/20 bg-primary/5 px-3 py-2"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-3 md:gap-8 mt-8">
          {REFLEXES.map((reflex, index) => {
            const isActive = activeReflex === index;
            return (
              <Reveal key={reflex.title}>
                <button
                  type="button"
                  onClick={() => handleToggle(index)}
                  aria-expanded={isActive}
                  className={combineClasses(
                    "flex w-full flex-col gap-4 rounded-3xl border border-border bg-white p-6 text-left transition-all duration-300",
                    isActive
                      ? "border-primary shadow-xl shadow-primary/10"
                      : "hover:-translate-y-1 hover:border-primary/40",
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-3">
                      <Users
                        className="h-10 w-10 text-primary"
                        aria-hidden="true"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-primary">
                          {reflex.title}
                        </h3>
                        <p className="text-base text-foreground/70">
                          {reflex.summary}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={combineClasses(
                        "h-6 w-6 shrink-0 text-primary transition-transform duration-300",
                        isActive && "rotate-180",
                      )}
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-sm font-semibold text-primary/70">
                    {isActive
                      ? "Cliquer pour masquer"
                      : "Cliquer pour découvrir le détail"}
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
            Alternatives à proposer : carte bancaire, espèces, carte cadeau,
            paiement en trois ou quatre fois sans frais.
          </p>
        </Reveal>
        <Reveal className="flex justify-center md:justify-start">
          <CompletionButton variant="light" />
        </Reveal>
      </div>
    </section>
  );
}

export function ClientUnderstandingSection({ id }: { id?: string }) {
  return (
    <section id={id} className="bg-white py-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 md:px-10">
        <Reveal className="space-y-4 text-center">
          <DecathlonLogo
            className="mx-auto h-9 w-auto drop-shadow-sm"
            aria-label="Decathlon"
          />
          <h2 className="text-3xl font-bold text-primary md:text-4xl">
            Comprendre les réactions de nos clients
          </h2>
          <p className="text-lg text-foreground/70">
            Chaque client vit la fin du paiement par chèque à sa manière. En
            identifiant leurs besoins, tu peux rester dans l'écoute, la clarté
            et la solution.
          </p>
        </Reveal>
        <Reveal className="rounded-3xl border border-primary/30 bg-primary/5 p-8 text-left text-sm leading-relaxed text-primary shadow-inner">
          <p>
            Ton rôle : ��couter sans jugement, comprendre la situation de chacun
            puis accompagner avec patience. Les profils ci-dessous t'aident à
            anticiper leurs réactions et à adopter la bonne posture.
          </p>
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-3">
          {CLIENT_REACTIONS_GUIDE.map((entry) => (
            <Reveal key={entry.title}>
              <div className="flex h-full flex-col gap-4 rounded-3xl border border-primary/20 bg-white p-6 shadow-lg shadow-primary/10">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">
                    Profil client
                  </span>
                  <h3 className="mt-2 text-xl font-semibold text-primary">
                    {entry.title}
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-foreground/70">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/70">
                    Ce qui peut se passer
                  </h4>
                  <p>{entry.situation}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/70">
                    Réticences possibles
                  </h4>
                  <ul className="space-y-1 text-sm text-foreground/70">
                    {entry.concerns.map((item) => (
                      <li
                        key={item}
                        className="rounded-2xl bg-primary/5 px-3 py-2"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/70">
                    Ta posture
                  </h4>
                  <ul className="space-y-1 text-sm text-foreground/70">
                    {entry.posture.map((item) => (
                      <li
                        key={item}
                        className="rounded-2xl bg-primary/5 px-3 py-2"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm font-semibold text-primary">
                  {entry.objective}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="overflow-hidden rounded-3xl border border-primary/30 bg-primary/10 shadow-2xl shadow-primary/10">
          <div className="grid gap-8 p-8 md:grid-cols-[2fr_3fr] md:items-center">
            <div className="space-y-3 text-left text-sm text-primary">
              <span className="inline-flex w-fit items-center rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
                Focus terrain
              </span>
              <h3 className="text-2xl font-semibold text-primary">
                Étude des trois cas clients en vidéo
              </h3>
              <p className="text-primary/80">
                Revois les réactions typiques et adopte la posture la plus
                adaptée pour chaque profil : fidèle et âgé, pressé ou
                professionnel.
              </p>
            </div>
            <div className="relative aspect-video w-full overflow-hidden rounded-3xl border-2 border-primary/25 bg-black/40 shadow-xl shadow-primary/20">
              <video
                controls
                preload="metadata"
                playsInline
                className="h-full w-full"
                poster="https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2F6ee05ab3af6c43caa575223490c40142?format=webp&width=800"
              >
                <source
                  src="https://xnwexjnaiffdcifcnton.supabase.co/storage/v1/object/sign/video%201/decathlon%203%20cas%20final%20%281%29.mov?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMWE2Y2M1ZS1kN2E2LTRjY2EtOTg1Ny1iOTc0Njg3NGQzNmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlbyAxL2RlY2F0aGxvbiAzIGNhcyBmaW5hbCAoMSkubW92IiwiaWF0IjoxNzYyNDMzODg3LCJleHAiOjE3OTM5Njk4ODd9.zhlPq-5eI57OIBQlAaaG60HHVgG3ghZ8_sooYHtKGHc"
                  type="video/quicktime"
                />
                <source
                  src="https://xnwexjnaiffdcifcnton.supabase.co/storage/v1/object/sign/video%201/decathlon%203%20cas%20final%20%281%29.mov?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMWE2Y2M1ZS1kN2E2LTRjY2EtOTg1Ny1iOTc0Njg3NGQzNmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlbyAxL2RlY2F0aGxvbiAzIGNhcyBmaW5hbCAoMSkubW92IiwiaWF0IjoxNzYyNDMzODg3LCJleHAiOjE3OTM5Njk4ODd9.zhlPq-5eI57OIBQlAaaG60HHVgG3ghZ8_sooYHtKGHc"
                  type="video/mp4"
                />
                Ton navigateur ne supporte pas la lecture vidéo.
              </video>
            </div>
          </div>
        </Reveal>
        <Reveal className="rounded-3xl border border-primary/30 bg-[#EEF2FF] p-6 text-center shadow-inner">
          <p className="text-base text-primary">
            Chaque échange compte : garde ton calme, ton sourire et ton sens du
            service pour transformer une réticence en confiance. C'est ça,
            l'esprit Decathlon.
          </p>
        </Reveal>
        <Reveal className="flex justify-center md:justify-start">
          <CompletionButton variant="light" />
        </Reveal>
      </div>
    </section>
  );
}

export function PodcastSection({ id }: { id?: string }) {
  return (
    <section id={id} className="bg-[#0A1F7A] py-24 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 md:px-10">
        <Reveal className="space-y-4 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
            Decathlon
          </span>
          <DecathlonLogo
            variant="white"
            className="mx-auto h-10 w-auto drop-shadow"
            aria-label="Decathlon"
          />
          <h2 className="text-3xl font-bold md:text-4xl">
            Podcast terrain : Muriel, capitaine Decathlon
          </h2>
          <p className="text-lg text-white/80">
            Découvre comment elle accompagne son équipe et rassure les clients
            sur la fin du paiement par chèque.
          </p>
        </Reveal>
        <Reveal className="overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-xl shadow-black/30 backdrop-blur">
          <div className="grid gap-6 p-8 md:grid-cols-[2fr_3fr] md:items-center">
            <div className="space-y-4 text-sm text-white/80">
              <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
                Audio exclusif
              </span>
              <h3 className="text-2xl font-semibold text-white">
                {PODCAST_RESOURCE.title}
              </h3>
              <p>{PODCAST_RESOURCE.description}</p>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                {PODCAST_RESOURCE.duration}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={PODCAST_RESOURCE.url}
                  download
                  className="inline-flex items-center gap-2 rounded-[12px] bg-white px-4 py-2 text-sm font-semibold text-primary shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Télécharger le podcast
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <span className="text-xs text-white/60">Format MP3</span>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-3xl bg-black/30 p-6">
              <audio
                controls
                preload="none"
                className="h-12 w-full rounded-[14px] bg-white/90 text-primary shadow-inner"
              >
                <source src={PODCAST_RESOURCE.url} type="audio/mpeg" />
                Ton navigateur ne supporte pas la lecture audio.
              </audio>
              <p className="text-sm text-white/70">
                Tip : partage ce témoignage lors de vos briefs d'équipe pour
                inspirer le passage à l'action.
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal className="flex justify-center md:justify-start">
          <CompletionButton variant="dark" />
        </Reveal>
      </div>
    </section>
  );
}

export function SynthesisSection({ id }: { id?: string }) {
  return (
    <section id={id} className="bg-[#0F2AA5] py-24 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 md:px-10">
        <Reveal className="space-y-4 text-center">
          <DecathlonLogo
            variant="white"
            className="mx-auto h-10 w-auto drop-shadow"
            aria-label="Decathlon"
          />
          <h2 className="text-3xl font-bold md:text-4xl">
            Synthèse : à toi de jouer
          </h2>
          <p className="text-lg text-white/80">
            Tu as toutes les clés : empathie, clarté et solutions. Voici comment
            transformer chaque échange en victoire client.
          </p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {SYNTHESIS_PILLARS.map((pillar) => (
            <Reveal key={pillar.title}>
              <div className="flex h-full flex-col gap-4 rounded-3xl border border-white/15 bg-white/10 p-6 text-left shadow-lg shadow-black/20 backdrop-blur">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                    Pilier
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-sm text-white/80">{pillar.description}</p>
                <ul className="space-y-2 text-sm text-white">
                  {pillar.checkpoints.map((point) => (
                    <li
                      key={point}
                      className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur">
          <div className="grid gap-6 md:grid-cols-3">
            {SYNTHESIS_ACTIONS.map((action) => (
              <div
                key={action.label}
                className="flex flex-col gap-2 text-sm text-white/80"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                  {action.label}
                </span>
                <p>{action.detail}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal className="flex flex-col items-center gap-4 text-center">
          <p className="max-w-2xl text-sm text-white/80">
            Continue de partager tes bonnes pratiques en magasin, observe les
            réactions positives et capitalise sur ce que tu viens d'apprendre.
          </p>
        </Reveal>
        <Reveal className="flex justify-center md:justify-start">
          <CompletionButton variant="dark" />
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

export function ScenariosSection({
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
  const shuffledScenarioOptions = useMemo(
    () =>
      SCENARIOS.map((scenario) =>
        shuffleArray(
          scenario.responses.map((response, originalIndex) => ({
            ...response,
            originalIndex,
          })),
        ),
      ),
    [],
  );

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
  const currentResponseOptions =
    shuffledScenarioOptions[safeScenarioIndex] ??
    currentScenario.responses.map((response, originalIndex) => ({
      ...response,
      originalIndex,
    }));
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
          <DecathlonLogo
            className="mx-auto h-9 w-auto drop-shadow-sm"
            aria-label="Decathlon"
          />
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/60">
            Decathlon · Simulation client
          </span>
          <h2 className="text-3xl font-bold text-primary md:text-4xl">
            Simulation client : réagir avec calme et empathie
          </h2>
          <p className="text-lg text-foreground/70">
            Tu es à la caisse. Trois clients réagissent différemment à l’annonce
            de la fin du paiement par chèque. Sélectionne-les et choisis la
            réponse la plus adaptée.
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
              <p className="mt-1 text-sm text-primary/70">
                {scenarioScoreMessage}
              </p>
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
                className={combineClasses(
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
                    <h3 className="mt-1 text-lg font-semibold text-primary">
                      {scenario.name}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-foreground/70">
                  {scenario.description}
                </p>
                {status !== "pending" && (
                  <span
                    className={combineClasses(
                      "mt-auto inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                      statusClasses[status],
                    )}
                  >
                    {statusLabels[status]}
                  </span>
                )}
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
                <h3 className="mt-2 text-xl font-semibold text-primary">
                  {currentScenario.name}
                </h3>
                <p className="mt-2 text-sm text-foreground/70">
                  {currentScenario.archetype}
                </p>
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
              {currentResponseOptions.map(({ originalIndex, ...response }) => {
                const isSelected = currentResponseIndex === originalIndex;
                const selectionClasses = isSelected
                  ? toneAccentClasses[response.tone]
                  : "border-primary/20 bg-white hover:-translate-y-0.5 hover:border-primary";
                return (
                  <button
                    key={`${currentScenario.id}-${originalIndex}`}
                    type="button"
                    onClick={() => onSelect(safeScenarioIndex, originalIndex)}
                    className={combineClasses(
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
                className={combineClasses(
                  "rounded-2xl border px-4 py-4 text-sm leading-relaxed transition-colors",
                  toneAccentClasses[currentTone],
                )}
              >
                {(() => {
                  const FeedbackIcon = toneIcons[currentTone];
                  return (
                    <div className="flex items-start gap-3">
                      <FeedbackIcon
                        className="mt-1 h-5 w-5"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="font-semibold uppercase tracking-wide">
                          {statusLabels[toneToStatus[currentTone]]}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed">
                          {currentFeedback.message}
                        </p>
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
                  className={combineClasses(
                    "inline-flex items-center justify-center gap-2 rounded-[12px] px-5 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    currentResponseIndex === null
                      ? "cursor-not-allowed border border-primary/20 bg-primary/10 text-primary/50"
                      : "border border-primary bg-primary text-white hover:-translate-y-0.5 hover:bg-[#163FAF]",
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
          <Reveal className="space-y-6 rounded-3xl border border-primary/30 bg-[#EEF2FF] p-8 shadow-lg shadow-primary/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-primary">
                  Débrief pédagogique
                </h3>
                <p className="mt-2 text-sm text-primary/70">
                  {encouragementMessage}
                </p>
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
                  Rappelle-toi : écouter, rassurer, proposer puis conclure
                  positivement permettent de transformer chaque échange en
                  expérience réussie.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <button
                    type="button"
                    onClick={onMarkCompleted}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-[12px] border border-primary bg-primary px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#163FAF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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

export function FinalQuizSection({
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
  const shuffledQuizOptions = useMemo(
    () =>
      FINAL_QUIZ.map((question) =>
        shuffleArray(
          question.options.map((option, originalIndex) => ({
            option,
            originalIndex,
          })),
        ),
      ),
    [],
  );
  const progressMessage = submitted
    ? success
      ? "Excellent, tu valides la formation."
      : "Relis les scénarios ou les réflexes puis réessaie."
    : answeredCount === FINAL_QUIZ.length
      ? "Tu peux valider tes réponses."
      : "Réponds à toutes les questions pour débloquer la validation.";
  const resultAccent = success ? "text-primary" : "text-amber-600";
  const ResultIcon = success ? CheckCircle2 : HelpCircle;

  return (
    <section id={id} className="bg-[#E2E8FF] py-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 md:px-10">
        <Reveal className="space-y-4 text-center">
          <DecathlonLogo
            className="mx-auto h-9 w-auto drop-shadow-sm"
            aria-label="Decathlon"
          />
          <h2 className="text-3xl font-bold text-primary md:text-4xl">
            Teste-toi
          </h2>
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
          {FINAL_QUIZ.map((question, questionIndex) => {
            const displayOptions = shuffledQuizOptions[questionIndex];
            return (
              <Reveal key={question.id}>
                <fieldset className="rounded-3xl border border-primary/30 bg-white p-6 shadow-lg shadow-primary/10">
                  <legend className="sr-only">{question.question}</legend>
                  <p className="text-lg font-semibold text-primary">
                    {question.question}
                  </p>
                  <div className="mt-4 grid gap-3">
                    {displayOptions.map(({ option, originalIndex }) => {
                      const isSelected =
                        answers[questionIndex] === originalIndex;
                      const isCorrect =
                        submitted && question.correctIndex === originalIndex;
                      const isIncorrect =
                        submitted &&
                        isSelected &&
                        question.correctIndex !== originalIndex;
                      return (
                        <label
                          key={`${question.id}-${originalIndex}`}
                          className={combineClasses(
                            "flex cursor-pointer items-center gap-3 rounded-[12px] border px-4 py-3 text-sm transition-all duration-300",
                            isCorrect
                              ? "border-primary bg-primary/10 text-primary"
                              : isIncorrect
                                ? "border-red-500 bg-red-500/10 text-red-600"
                                : "border-primary/20 bg-primary/5 text-foreground/80 hover:-translate-y-0.5 hover:border-primary",
                          )}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={originalIndex}
                            checked={isSelected}
                            onChange={() =>
                              onAnswer(questionIndex, originalIndex)
                            }
                            className="h-4 w-4 border border-primary text-primary focus:ring-primary"
                          />
                          <span>{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </Reveal>
            );
          })}
          <Reveal className="flex flex-col items-center gap-3 text-center">
            <button
              type="submit"
              disabled={!allAnswered || submitted}
              className="inline-flex items-center justify-center rounded-[12px] bg-primary px-7 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#163FAF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              Valider mes réponses
            </button>
            {submitted && (
              <div className="w-full rounded-2xl border border-primary/20 bg-white p-5 text-left shadow-sm">
                <div className="flex items-center gap-3 text-primary">
                  <ResultIcon
                    className={combineClasses("h-5 w-5", resultAccent)}
                    aria-hidden="true"
                  />
                  <p className="text-sm font-semibold">
                    Ton score : {score} / {FINAL_QUIZ.length}
                  </p>
                </div>
                <p
                  className={combineClasses(
                    "mt-3 text-sm leading-relaxed",
                    resultAccent,
                  )}
                >
                  {success
                    ? "Bravo, tu maîtrises les bons réflexes."
                    : "Revois les réflexes clés et réessaie."}
                </p>
                {success && (
                  <div className="mt-4 space-y-3 rounded-2xl border border-primary/30 bg-primary/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                      À télécharger
                    </p>
                    <a
                      href="https://cdn.builder.io/o/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2F7bc4c7a836c94ebca78cc285c6eb2f45?alt=media&token=recap-aides&apiKey=d93d9a0ec7824aa1ac4d890a1f90a2ec"
                      download
                      className="inline-flex items-center gap-2 rounded-[12px] bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#163FAF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      Fiche récap' à imprimer
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <p className="text-xs text-primary/70">
                      Retrouve les ��tapes clés, les profils clients et les
                      alternatives à proposer.
                    </p>
                  </div>
                )}
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

type ConclusionProgress = {
  totalScore: number;
  totalQuestions: number;
};

type ConclusionSectionProps = {
  id?: string;
  memoHref?: string;
  shouldShowProgress?: boolean;
  moduleCompleted?: boolean;
  progress?: ConclusionProgress;
};

type WindowWithScormFlag = Window & {
  __SCORM_MODULE__?: string | null;
};

export function ConclusionSection({
  id,
  memoHref,
  shouldShowProgress = false,
  moduleCompleted = false,
  progress,
}: ConclusionSectionProps) {
  const defaultHref = (() => {
    const relativePath = "memo-bonnes-pratiques-ensemble-vers-2026.pdf";
    if (typeof window === "undefined") {
      return `/${relativePath}`;
    }
    const win = window as WindowWithScormFlag;
    return win.__SCORM_MODULE__ ? relativePath : `/${relativePath}`;
  })();

  const downloadHref = memoHref ?? defaultHref;
  const showProgressCard = shouldShowProgress && Boolean(progress);
  const totalScore = progress?.totalScore ?? 0;
  const totalQuestions = progress?.totalQuestions ?? 0;
  const completionPercent = totalQuestions
    ? Math.min(100, Math.round((totalScore / totalQuestions) * 100))
    : 0;

  return (
    <section id={id} className="bg-[#1C4ED8] py-24 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 text-center md:px-10">
        <Reveal className="space-y-4">
          <DecathlonLogo
            variant="white"
            className="mx-auto h-12 w-auto drop-shadow"
            aria-label="Decathlon"
          />
          <h2 className="text-3xl font-bold md:text-4xl">
            Conclusion et ressources
          </h2>
          <p className="text-lg text-white/85">
            Merci pour ton engagement. Grâce à toi, la transition 2026 se fera
            en douceur et dans un esprit de service.
          </p>
        </Reveal>
        {showProgressCard && (
          <Reveal className="overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-6 text-left backdrop-blur">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                  Ta progression
                </p>
                <p className="text-lg font-semibold text-white">
                  {totalScore} / {totalQuestions} activités validées
                </p>
                <p className="text-sm text-white/75">
                  {moduleCompleted
                    ? "Bravo ! Tu as validé ce module. Télécharge la fiche mémo pour diffuser les bonnes pratiques."
                    : "Tu progresses ! Continue les scénarios et le quiz final pour valider le module."}
                </p>
              </div>
              <div className="w-full rounded-2xl border border-white/15 bg-white/5 p-4 md:w-64">
                <div className="flex items-center justify-between text-xs font-semibold text-white/70">
                  <span>Progression</span>
                  <span>{completionPercent}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </Reveal>
        )}
        <Reveal className="flex flex-col items-center gap-3 md:flex-row md:justify-center">
          <a
            href={downloadHref}
            download="Mémo & Bonnes Pratiques ensemble vers 2026.pdf"
            className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-white px-6 py-3 text-base font-semibold text-primary shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-white"
          >
            <FileText className="h-5 w-5" aria-hidden="true" />
            Télécharger la fiche mémo PDF
          </a>
        </Reveal>
        <Reveal className="text-xs text-white/70">
          Document interne – usage exclusif Decathlon France – ne pas diffuser.
        </Reveal>
      </div>
    </section>
  );
}
