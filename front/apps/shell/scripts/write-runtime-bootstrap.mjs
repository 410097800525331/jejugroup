import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.resolve(__dirname, "../../../../.generated/front/components/runtime");
const outputFile = path.join(outputDir, "bootstrap.js");
const sourceFile = path.resolve(__dirname, "../src/runtime/bootstrap.js");
const bootstrapImportRewrites = [
  {
    pattern: /from "\.\/index\.ts";/g,
    replacement: 'from "./shell-runtime.js";',
  },
  {
    pattern: /from "\.\/lifecycle\.js";/g,
    replacement: 'from "./shell-runtime.js";',
  },
];

const bootstrapSource = bootstrapImportRewrites.reduce(
  (source, rewrite) => source.replace(rewrite.pattern, rewrite.replacement),
  await readFile(sourceFile, "utf8"),
);

await mkdir(outputDir, { recursive: true });
await writeFile(outputFile, bootstrapSource, "utf8");
