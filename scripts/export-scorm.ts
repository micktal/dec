import { promises as fs } from "fs";
import path from "path";
import AdmZip from "adm-zip";

import {
  TRAINING_MODULES,
  getModuleById,
  type TrainingModule,
} from "../shared/training-modules";
import {
  generateScormManifest,
  type ManifestOptions,
} from "./generate-scorm-manifest";

const DEFAULT_DIST_ROOT = path.resolve(process.cwd(), "dist", "spa");
const DEFAULT_ZIP_PATH = path.resolve(
  process.cwd(),
  "decathlon-formation-capitaine-scorm.zip",
);
const MODULE_DIST_ROOT = path.resolve(process.cwd(), "dist", "modules");

type ExportCliOptions = {
  moduleIds: string[];
  exportAll: boolean;
};

function parseCliOptions(args: string[]): ExportCliOptions {
  const options: ExportCliOptions = { moduleIds: [], exportAll: false };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--module") {
      const value = args[index + 1];
      if (!value) {
        throw new Error("L'argument --module requiert une valeur.");
      }
      options.moduleIds.push(...value.split(",").map((item) => item.trim()).filter(Boolean));
      index += 1;
      continue;
    }

    if (arg === "--all") {
      options.exportAll = true;
      continue;
    }
  }

  return options;
}

async function ensureDirectoryExists(directory: string) {
  try {
    const stats = await fs.stat(directory);
    if (!stats.isDirectory()) {
      throw new Error(`${directory} n'est pas un dossier.`);
    }
  } catch (error) {
    throw new Error(
      `Le dossier de build (${directory}) est introuvable. Lance d'abord "pnpm build". Détail: ${(error as Error).message}`,
    );
  }
}

async function addDirectoryToZip(zip: AdmZip, directory: string, base = directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await addDirectoryToZip(zip, absolutePath, base);
    } else {
      const relativePath = path.relative(base, absolutePath).replace(/\\/g, "/");
      zip.addLocalFile(absolutePath, path.dirname(relativePath));
    }
  }
}

async function createZipFromDirectory(directory: string, outputZip: string) {
  const zip = new AdmZip();
  await addDirectoryToZip(zip, directory);
  zip.writeZip(outputZip);
}

async function copyDirectory(source: string, destination: string) {
  await fs.mkdir(destination, { recursive: true });
  const entries = await fs.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, destinationPath);
    } else if (entry.isFile()) {
      await fs.copyFile(sourcePath, destinationPath);
    }
  }
}

async function injectScormModuleConfig(rootDir: string, moduleId: string) {
  const indexPath = path.join(rootDir, "index.html");
  let html = await fs.readFile(indexPath, "utf8");

  const scriptContent = `window.__SCORM_MODULE__ = "${moduleId}";`;

  if (html.includes("window.__SCORM_MODULE__")) {
    html = html.replace(
      /window\.__SCORM_MODULE__\s*=\s*"[^"]*"/,
      scriptContent,
    );
  } else {
    const snippet = `<script>\n  ${scriptContent}\n</script>`;
    const closingHead = "</head>";

    if (html.includes(closingHead)) {
      html = html.replace(closingHead, `  ${snippet}\n${closingHead}`);
    } else {
      html = `${snippet}\n${html}`;
    }
  }

  await fs.writeFile(indexPath, html, "utf8");
}

async function exportFullCourse() {
  await ensureDirectoryExists(DEFAULT_DIST_ROOT);
  await generateScormManifest();
  await createZipFromDirectory(DEFAULT_DIST_ROOT, DEFAULT_ZIP_PATH);
  console.log(`Archive SCORM créée: ${DEFAULT_ZIP_PATH}`);
}

async function exportModule(module: TrainingModule) {
  await ensureDirectoryExists(DEFAULT_DIST_ROOT);

  const moduleRoot = path.join(MODULE_DIST_ROOT, module.moduleId);
  await fs.rm(moduleRoot, { recursive: true, force: true });
  await copyDirectory(DEFAULT_DIST_ROOT, moduleRoot);
  await injectScormModuleConfig(moduleRoot, module.moduleId);

  const manifestOptions: ManifestOptions = {
    rootDir: moduleRoot,
    outFile: path.join(moduleRoot, "imsmanifest.xml"),
    moduleId: module.moduleId,
  };
  await generateScormManifest(manifestOptions);

  const outputZip = path.resolve(
    process.cwd(),
    `decathlon-formation-capitaine-${module.moduleId}-scorm.zip`,
  );
  await createZipFromDirectory(moduleRoot, outputZip);
  console.log(`Archive SCORM module créée: ${outputZip}`);
}

async function main() {
  const options = parseCliOptions(process.argv.slice(2));

  if (options.exportAll) {
    for (const module of TRAINING_MODULES) {
      await exportModule(module);
    }
    return;
  }

  if (options.moduleIds.length > 0) {
    for (const moduleId of options.moduleIds) {
      const module = getModuleById(moduleId);
      if (!module) {
        throw new Error(`Module introuvable: ${moduleId}`);
      }
      await exportModule(module);
    }
    return;
  }

  await exportFullCourse();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
