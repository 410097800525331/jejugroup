const fs = require("node:fs");
const { collectTargetFiles, isTextCandidate } = require("./lib/target-files");

const LITERAL_PATTERNS = [
  "?쒖",
  "濡쒓렇",
  "留덉",
  "媛",
  "鍮",
  "硫붿",
  "硫ㅻ쾭",
  "怨좉컼",
  "덉빟",
  "섎윭",
  "?몄쬆",
  "??났沅",
  "??덈꺖",
  "??쀪문",
  "??六",
];

const HTML_BROKEN_CLOSING_TAG =
  /(?<![<\\])\/(?:title|h[1-6]|p|span|strong|button|label|a|li|option|small|div|section|script|textarea|th|td)>/;

const scanFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const text = fs.readFileSync(filePath, "utf8");
  const lines = text.split(/\r?\n/);
  const issues = [];

  lines.forEach((line, index) => {
    if (line.includes("\uFFFD")) {
      issues.push({
        filePath,
        lineNumber: index + 1,
        reason: "replacement-char",
        preview: line.trim(),
      });
    }

    for (const pattern of LITERAL_PATTERNS) {
      if (line.includes(pattern)) {
        issues.push({
          filePath,
          lineNumber: index + 1,
          reason: `mojibake:${pattern}`,
          preview: line.trim(),
        });
      }
    }

    if (HTML_BROKEN_CLOSING_TAG.test(line)) {
      issues.push({
        filePath,
        lineNumber: index + 1,
        reason: "broken-html-closing-tag",
        preview: line.trim(),
      });
    }
  });

  return issues;
};

const targetFiles = collectTargetFiles(process.argv.slice(2)).filter(isTextCandidate);
const allIssues = targetFiles.flatMap(scanFile);

if (allIssues.length > 0) {
  console.error("[guard:text] 깨진 한글 또는 HTML 태그 의심 상태");
  for (const issue of allIssues) {
    console.error(
      `${issue.filePath}:${issue.lineNumber} [${issue.reason}] ${issue.preview}`,
    );
  }
  process.exit(1);
}

console.log(`[guard:text] 점검 완료 상태 (${targetFiles.length} files)`);
