import { promises as fs } from "fs";
import path from "path";
import { pathToFileURL } from "url";

import { getModuleById, type TrainingModule } from "../shared/training-modules";

const DEFAULT_DIST_ROOT = path.resolve(process.cwd(), "dist", "spa");
const BASE_TITLE = "Fin du paiement par chèque – Formation Capitaine";
const COURSE_IDENTIFIER_BASE = "decathlon-formation-capitaine-2026";

export type ManifestOptions = {
  rootDir?: string;
  outFile?: string;
  moduleId?: string;
};

type ResolvedManifestOptions = {
  rootDir: string;
  outFile: string;
  module?: TrainingModule;
};

function parseCliOptions(args: string[]): ManifestOptions {
  const options: ManifestOptions = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--module") {
      const value = args[index + 1];
      if (!value) {
        throw new Error("L'argument --module requiert une valeur.");
      }
      options.moduleId = value;
      index += 1;
      continue;
    }

    if (arg === "--root") {
      const value = args[index + 1];
      if (!value) {
        throw new Error("L'argument --root requiert un chemin.");
      }
      options.rootDir = path.resolve(process.cwd(), value);
      index += 1;
      continue;
    }

    if (arg === "--out" || arg === "--output") {
      const value = args[index + 1];
      if (!value) {
        throw new Error("L'argument --out requiert un chemin de fichier.");
      }
      options.outFile = path.resolve(process.cwd(), value);
      index += 1;
      continue;
    }
  }

  return options;
}

function resolveOptions(options: ManifestOptions): ResolvedManifestOptions {
  const rootDir = options.rootDir ?? DEFAULT_DIST_ROOT;
  const outFile = options.outFile ?? path.join(rootDir, "imsmanifest.xml");

  if (!outFile.toLowerCase().endsWith("imsmanifest.xml")) {
    throw new Error("Le fichier de sortie doit se terminer par 'imsmanifest.xml'.");
  }

  let module: TrainingModule | undefined;

  if (options.moduleId) {
    module = getModuleById(options.moduleId);

    if (!module) {
      throw new Error(`Module introuvable: ${options.moduleId}`);
    }
  }

  return { rootDir, outFile, module };
}

async function ensureDirectoryExists(directory: string) {
  try {
    const stats = await fs.stat(directory);
    if (!stats.isDirectory()) {
      throw new Error(`${directory} n'est pas un dossier.`);
    }
  } catch (error) {
    throw new Error(
      `Le dossier de build n'existe pas. Lance d'abord "pnpm build". Détail: ${(error as Error).message}`,
    );
  }
}

async function listFilesRecursively(
  directory: string,
  base = directory,
): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      const children = await listFilesRecursively(absolutePath, base);
      files.push(...children);
    } else {
      files.push(path.relative(base, absolutePath).replace(/\\/g, "/"));
    }
  }

  return files;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildManifestContent(
  files: string[],
  manifestPath: string,
  module?: TrainingModule,
) {
  const launchFile = "index.html";
  if (!files.includes(launchFile)) {
    throw new Error(
      `Le fichier ${launchFile} est introuvable dans ${path.dirname(manifestPath)}. Vérifie ta build client.`,
    );
  }

  const identifierSuffix = module ? `-${module.moduleId}` : "";
  const courseIdentifier = `${COURSE_IDENTIFIER_BASE}${identifierSuffix}`;
  const organizationIdentifier = `${courseIdentifier}-org`;
  const resourceIdentifier = `${courseIdentifier}-resource`;
  const resourceHref = module
    ? `${launchFile}?module=${module.moduleId}`
    : launchFile;

  const now = new Date().toISOString();
  const title = module ? `${BASE_TITLE} – ${module.title}` : BASE_TITLE;
  const description = module
    ? `Module "${module.title}" – ${module.description}`
    : "Module e-learning Decathlon sur la fin du paiement par chèque.";

  const escapedTitle = escapeXml(title);
  const escapedDescription = escapeXml(
    `${description} Généré le ${now}.`,
  );

  const fileEntries = files
    .map((file) => `      <file href="${file}" />`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${courseIdentifier}" version="1.0" xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2" xmlns:imsmd="http://www.imsglobal.org/xsd/imsmd_rootv1p2p1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 https://www.imsglobal.org/xsd/imscp_rootv1p1p2.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 https://www.adlnet.gov/adlxml.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 https://www.imsglobal.org/xsd/imsmd_rootv1p2p1.xsd">
  <metadata>
    <imsmd:lom>
      <imsmd:general>
        <imsmd:title>
          <imsmd:string language="fr">${escapedTitle}</imsmd:string>
        </imsmd:title>
        <imsmd:description>
          <imsmd:string language="fr">${escapedDescription}</imsmd:string>
        </imsmd:description>
      </imsmd:general>
    </imsmd:lom>
  </metadata>
  <organizations default="${organizationIdentifier}">
    <organization identifier="${organizationIdentifier}" structure="hierarchical">
      <title>${escapedTitle}</title>
      <item identifier="${courseIdentifier}-item" identifierref="${resourceIdentifier}" isvisible="true">
        <title>${escapedTitle}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="${resourceIdentifier}" type="webcontent" adlcp:scormtype="sco" href="${resourceHref}">
${fileEntries}
    </resource>
  </resources>
</manifest>
`;
}

export async function generateScormManifest(
  options: ManifestOptions = {},
): Promise<string> {
  const resolved = resolveOptions(options);
  await ensureDirectoryExists(resolved.rootDir);

  const files = await listFilesRecursively(resolved.rootDir);
  const manifestContent = buildManifestContent(
    files,
    resolved.outFile,
    resolved.module,
  );

  await fs.mkdir(path.dirname(resolved.outFile), { recursive: true });
  await fs.writeFile(resolved.outFile, manifestContent, "utf8");

  console.log(`Manifest SCORM généré: ${resolved.outFile}`);

  return resolved.outFile;
}

async function main() {
  const options = parseCliOptions(process.argv.slice(2));
  await generateScormManifest(options);
}

const thisFileUrl = pathToFileURL(process.argv[1] ?? "").href;

if (import.meta.url === thisFileUrl) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
