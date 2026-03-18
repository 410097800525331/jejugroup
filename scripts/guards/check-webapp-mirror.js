const fs = require("node:fs");
const path = require("node:path");
const { collectTargetFiles, normalizePath } = require("./lib/target-files");
const { stripJspPageDirective } = require("../pipelines/lib/jsp-mirror");

const FRONT_ROOT = "front/";
const WEBAPP_ROOT = "jeju-web/src/main/webapp/";
const WEBAPP_EXCLUDES = [`${WEBAPP_ROOT}META-INF/`, `${WEBAPP_ROOT}WEB-INF/`];

const fileExists = (filePath) => fs.existsSync(path.resolve(filePath));

const isExcludedWebappPath = (filePath) =>
  WEBAPP_EXCLUDES.some((prefix) => normalizePath(filePath).startsWith(prefix));

const mapFrontToWebapp = (filePath) =>
  normalizePath(filePath).startsWith(FRONT_ROOT)
    ? normalizePath(filePath).replace(FRONT_ROOT, WEBAPP_ROOT)
    : null;

const mapWebappToFront = (filePath) =>
  normalizePath(filePath).startsWith(WEBAPP_ROOT)
    ? normalizePath(filePath).replace(WEBAPP_ROOT, FRONT_ROOT)
    : null;

const mapFrontHtmlToWebappJsp = (filePath) =>
  normalizePath(filePath).startsWith(FRONT_ROOT) && normalizePath(filePath).endsWith(".html")
    ? normalizePath(filePath).replace(FRONT_ROOT, WEBAPP_ROOT).replace(/\.html$/i, ".jsp")
    : null;

const mapWebappJspToFrontHtml = (filePath) =>
  normalizePath(filePath).startsWith(WEBAPP_ROOT) && normalizePath(filePath).endsWith(".jsp")
    ? normalizePath(filePath).replace(WEBAPP_ROOT, FRONT_ROOT).replace(/\.jsp$/i, ".html")
    : null;

const sameContent = (leftPath, rightPath) => {
  const left = fs.readFileSync(leftPath, "utf8").replace(/\r\n/g, "\n");
  const right = fs.readFileSync(rightPath, "utf8").replace(/\r\n/g, "\n");
  return left === right;
};

const sameJspMirrorContent = (frontHtmlPath, webappJspPath) => {
  const frontHtml = fs.readFileSync(frontHtmlPath, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const webappJsp = stripJspPageDirective(fs.readFileSync(webappJspPath, "utf8")).replace(/\r\n/g, "\n");
  return frontHtml === webappJsp;
};

const targetFiles = new Set(collectTargetFiles(process.argv.slice(2)).map(normalizePath));
const issues = [];

for (const filePath of targetFiles) {
  const frontHtmlPathFromJsp = mapWebappJspToFrontHtml(filePath);
  if (frontHtmlPathFromJsp && fileExists(frontHtmlPathFromJsp)) {
    if (!sameJspMirrorContent(frontHtmlPathFromJsp, filePath)) {
      issues.push(`${filePath} :: front HTML 기반 JSP 미러와 내용 불일치 상태, sync 재실행 필요 상태`);
    }
    continue;
  }

  if (filePath.startsWith(WEBAPP_ROOT) && !isExcludedWebappPath(filePath)) {
    const frontPath = mapWebappToFront(filePath);
    if (!frontPath || !fileExists(frontPath)) {
      continue;
    }

    if (!targetFiles.has(frontPath)) {
      if (!sameContent(frontPath, filePath)) {
        issues.push(
          `${filePath} :: webapp mirror 단독 수정 금지 상태, front 원본 먼저 수정 후 sync 필요 상태`,
        );
      }
      continue;
    }

    if (!sameContent(frontPath, filePath)) {
      issues.push(`${filePath} :: front 와 webapp 내용 불일치 상태, sync 재실행 필요 상태`);
    }
  }

  if (filePath.startsWith(FRONT_ROOT)) {
    const webappJspPath = mapFrontHtmlToWebappJsp(filePath);
    if (webappJspPath && fileExists(webappJspPath) && !sameJspMirrorContent(filePath, webappJspPath)) {
      issues.push(`${filePath} :: webapp JSP 미러 와 내용 불일치 상태, sync 재실행 필요 상태`);
    }

    const webappPath = mapFrontToWebapp(filePath);
    if (!webappPath || !fileExists(webappPath)) {
      continue;
    }

    if (!targetFiles.has(webappPath)) {
      if (!sameContent(filePath, webappPath)) {
        issues.push(
          `${filePath} :: front 원본 수정 후 webapp mirror 미갱신 상태, pnpm run sync 필요 상태`,
        );
      }
      continue;
    }

    if (!sameContent(filePath, webappPath)) {
      issues.push(`${filePath} :: webapp mirror 와 내용 불일치 상태, sync 재실행 필요 상태`);
    }
  }
}

if (issues.length > 0) {
  console.error("[guard:mirror] front 단일 원본 규칙 위반 상태");
  for (const issue of issues) {
    console.error(issue);
  }
  process.exit(1);
}

console.log(`[guard:mirror] 점검 완료 상태 (${targetFiles.size} files)`);
