const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const outputFilename = "memo-bonnes-pratiques-ensemble-vers-2026.pdf";
const outputPath = path.resolve(__dirname, "../public", outputFilename);

const sections = [
  {
    title: "À retenir",
    items: [
      "QUAND : Depuis début 2026, les chèques ne sont plus acceptés.",
      "POURQUOI : Simplifier, sécuriser et fluidifier les paiements.",
      "MESSAGE CLÉ : « On simplifie nos paiements pour que ce soit plus rapide et plus sûr. »",
      "POSTURE DECATHLON : Positive, orientée solution, bienveillante et claire.",
    ],
  },
  {
    title: "Les solutions",
    items: [
      "PARTICULIERS : Carte bancaire – Espèces – Cartes cadeaux – Paiement 3x/4x sans frais.",
      "PROFESSIONNELS : Compte Decathlon Pro (virement, facturation simplifiée, suivi en ligne).",
    ],
  },
  {
    title: "Les postures essentielles",
    items: [
      "Verbale : Utiliser un langage positif — « On simplifie les paiements. »",
      "Non verbale : Sourire, regard franc, posture ouverte.",
      "Vocale : Ton calme et confiant, rythme régulier.",
    ],
  },
  {
    title: "Les mots qui apaisent",
    items: [
      "À ÉVITER : « C'est la règle. » — « On ne peut plus. » — « C'est comme ça. »",
      "À DIRE : « C'est pour simplifier vos paiements. » — « Voici les solutions disponibles. » — « Bonne nouvelle, c'est encore plus rapide maintenant. »",
    ],
  },
  {
    title: "Les 3 cas clients",
    items: [
      "Client fidèle : Patience et pédagogie.",
      "Client pressé : Clarté et rapidité.",
      "Client professionnel : Orientation solution (Decathlon Pro).",
    ],
  },
  {
    title: "Les réflexes terrain",
    items: [
      "Écouter avant de répondre.",
      "Expliquer le pourquoi du changement.",
      "Utiliser des mots positifs.",
      "Éviter la lassitude, la justification ou les débats inutiles.",
    ],
  },
];

function generate() {
  const doc = new PDFDocument({ size: "A4", margin: 56 });
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  doc
    .font("Helvetica-Bold")
    .fontSize(26)
    .fillColor("#0b3d91")
    .text("Mémo & Bonnes Pratiques", {
      align: "left",
    });

  doc.moveDown(0.5);
  doc
    .font("Helvetica")
    .fontSize(14)
    .fillColor("#1f2933")
    .text("Transition vers le paiement sans chèque");

  doc.moveDown(1.2);

  sections.forEach((section, index) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor("#0b3d91")
      .text(section.title);
    doc.moveDown(0.4);

    doc.font("Helvetica").fontSize(12).fillColor("#1f2933");

    section.items.forEach((item) => {
      doc.circle(doc.x - 6, doc.y + 6, 2).fill("#0b3d91");
      doc
        .fillColor("#1f2933")
        .text(item, doc.x + 6, doc.y - 2, {
          width: 460,
          lineGap: 4,
        })
        .moveDown(0.6);
    });

    if (index < sections.length - 1) {
      doc.moveDown(0.4);
      doc.fillColor("#cbd5f5").rect(doc.x, doc.y, 460, 1.5).fill();
      doc.moveDown(0.8);
      doc.fillColor("#1f2933");
    }
  });

  doc.moveDown(1.5);
  doc
    .font("Helvetica-Oblique")
    .fontSize(11)
    .fillColor("#4b5563")
    .text(
      "Document interne – usage exclusif Decathlon France – ne pas diffuser.",
      { align: "center" },
    );

  doc.end();

  stream.on("finish", () => {
    console.log(`PDF généré : ${outputPath}`);
  });
}

generate();
