const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const TEXT_EXTENSIONS = new Set([
  ".css",
  ".cjs",
  ".html",
  ".java",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".properties",
  ".txt",
  ".ts",
  ".tsx",
  ".xml",
  ".yml",
  ".yaml",
]);

const IGNORED_SEGMENTS = new Set([
  ".git",
  ".next",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "out",
  "guards",
  "test-results",
]);

const normalizePath = (filePath) => filePath.replace(/\\/g, "/");

const execGit = (args) =>
  execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();

const parseArgs = (argv) => {
  const result = {
    filesFrom: null,
    mode: "all",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--staged") {
      result.mode = "staged";
      continue;
    }

    if (value === "--all") {
      result.mode = "all";
      continue;
    }

    if (value === "--files-from") {
      result.filesFrom = argv[index + 1] || null;
      index += 1;
    }
  }

  return result;
};

const isIgnoredPath = (filePath) => {
  const normalized = normalizePath(filePath);
  return normalized.split("/").some((segment) => IGNORED_SEGMENTS.has(segment));
};

const isTextCandidate = (filePath) => {
  if (!filePath || isIgnoredPath(filePath)) {
    return false;
  }

  return TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase());
};

const readFileList = (filePath) => {
  if (!filePath || !fs.existsSync(filePath)) {
    return [];
  }

  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const getAllTrackedFiles = () => {
  const output = execGit(["ls-files"]);
  return output ? output.split(/\r?\n/).filter(Boolean) : [];
};

const getStagedFiles = () => {
  const output = execGit(["diff", "--cached", "--name-only", "--diff-filter=ACMR"]);
  return output ? output.split(/\r?\n/).filter(Boolean) : [];
};

const collectTargetFiles = (argv) => {
  const options = parseArgs(argv);
  const rawFiles = options.filesFrom
    ? readFileList(options.filesFrom)
    : options.mode === "staged"
      ? getStagedFiles()
      : getAllTrackedFiles();

  const unique = new Set();
  for (const filePath of rawFiles) {
    const normalized = normalizePath(filePath);
    if (!normalized) {
      continue;
    }
    unique.add(normalized);
  }

  return Array.from(unique);
};

module.exports = {
  collectTargetFiles,
  execGit,
  isTextCandidate,
  normalizePath,
};
