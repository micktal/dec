import { promises as fs } from "fs";
import path from "path";
import AdmZip from "adm-zip";

const distRoot = path.resolve(process.cwd(), "dist", "spa");
const outputZip = path.resolve(
  process.cwd(),
  "decathlon-formation-capitaine-scorm.zip",
);

async function ensureManifestExists() {
  const manifestPath = path.join(distRoot, "imsmanifest.xml");
  try {
    await fs.access(manifestPath);
    return manifestPath;
  } catch {
    throw new Error(
      "Le manifest SCORM n'existe pas encore. Lance `pnpm exec tsx scripts/generate-scorm-manifest.ts`.",
    );
  }
}

async function addDirectory(zip: AdmZip, directory: string, base = directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await addDirectory(zip, absolutePath, base);
    } else {
      const relativePath = path.relative(base, absolutePath).replace(/\\/g, "/");
      zip.addLocalFile(absolutePath, path.dirname(relativePath));
    }
  }
}

async function main() {
  await ensureManifestExists();

  const zip = new AdmZip();
  await addDirectory(zip, distRoot);
  zip.writeZip(outputZip);
  console.log(`Archive SCORM créée: ${outputZip}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
