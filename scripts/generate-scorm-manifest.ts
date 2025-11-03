import { promises as fs } from "fs";
import path from "path";

const distRoot = path.resolve(process.cwd(), "dist", "spa");
const manifestPath = path.join(distRoot, "imsmanifest.xml");

const COURSE_IDENTIFIER = "decathlon-formation-capitaine-2026";
const ORGANIZATION_IDENTIFIER = `${COURSE_IDENTIFIER}-org`;
const RESOURCE_IDENTIFIER = `${COURSE_IDENTIFIER}-resource`;
const TITLE = "Fin du paiement par chèque – Formation Capitaine";

async function ensureDistExists(directory: string) {
  try {
    const stats = await fs.stat(directory);
    if (!stats.isDirectory()) {
      throw new Error(`${directory} is not a directory`);
    }
  } catch (error) {
    throw new Error(
      `Le dossier de build n'existe pas. Lance d'abord \"pnpm build\". Détail: ${(error as Error).message}`,
    );
  }
}

async function listFilesRecursively(directory: string, base = directory): Promise<string[]> {
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

async function createManifest(fileList: string[]) {
  const launchFile = "index.html";
  if (!fileList.includes(launchFile)) {
    throw new Error(
      `Le fichier ${launchFile} est introuvable dans dist/spa. Vérifie ta build client.`,
    );
  }

  const now = new Date().toISOString();
  const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${COURSE_IDENTIFIER}" version="1.0" xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2" xmlns:imsmd="http://www.imsglobal.org/xsd/imsmd_rootv1p2p1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 https://www.imsglobal.org/xsd/imscp_rootv1p1p2.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 https://www.adlnet.gov/adlxml.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 https://www.imsglobal.org/xsd/imsmd_rootv1p2p1.xsd">
  <metadata>
    <imsmd:lom>
      <imsmd:general>
        <imsmd:title>
          <imsmd:string language="fr">${TITLE}</imsmd:string>
        </imsmd:title>
        <imsmd:description>
          <imsmd:string language="fr">Module e-learning Decathlon sur la fin du paiement par chèque. Généré le ${now}.</imsmd:string>
        </imsmd:description>
      </imsmd:general>
    </imsmd:lom>
  </metadata>
  <organizations default="${ORGANIZATION_IDENTIFIER}">
    <organization identifier="${ORGANIZATION_IDENTIFIER}" structure="hierarchical">
      <title>${TITLE}</title>
      <item identifier="${COURSE_IDENTIFIER}-item" identifierref="${RESOURCE_IDENTIFIER}" isvisible="true">
        <title>${TITLE}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="${RESOURCE_IDENTIFIER}" type="webcontent" adlcp:scormtype="sco" href="${launchFile}">
${fileList
  .map((file) => `      <file href="${file}" />`)
  .join("\n")}
    </resource>
  </resources>
</manifest>
`;

  await fs.writeFile(manifestPath, manifest, "utf8");
}

async function main() {
  await ensureDistExists(distRoot);
  const files = await listFilesRecursively(distRoot);
  await createManifest(files);
  console.log(`Manifest SCORM généré: ${manifestPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
