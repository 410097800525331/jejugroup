const { execFileSync } = require("node:child_process");

const configs = [
  ["core.hooksPath", ".githooks"],
  ["core.quotepath", "false"],
  ["i18n.commitEncoding", "utf-8"],
  ["i18n.logOutputEncoding", "utf-8"],
];

for (const [key, value] of configs) {
  execFileSync("git", ["config", "--local", key, value], {
    stdio: ["ignore", "inherit", "inherit"],
  });
}

console.log("[guard:hooks] 로컬 Git 훅 경로와 UTF-8 설정 고정 상태");

