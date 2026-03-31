const { execSync } = require("node:child_process");

const UTF8_VM_OPTIONS = [
  "-J-Dfile.encoding=UTF-8",
  "-J-Dstdout.encoding=UTF-8",
  "-J-Dstderr.encoding=UTF-8",
];

const applyUtf8VmOptions = (command) => {
  const trimmedCommand = command.trim();
  const match = trimmedCommand.match(/^(javac|jar)(\s+|$)/);

  if (!match) {
    return trimmedCommand;
  }

  const existingOptions = new Set(
    Array.from(trimmedCommand.matchAll(/-J-D(?:file|stdout|stderr)\.encoding=UTF-8/g)).map(
      ([option]) => option,
    ),
  );
  const missingOptions = UTF8_VM_OPTIONS.filter((option) => !existingOptions.has(option));

  if (missingOptions.length === 0) {
    return trimmedCommand;
  }

  return `${match[1]} ${missingOptions.join(" ")}${trimmedCommand.slice(match[1].length)}`;
};

const wrapWindowsCommand = (command) =>
  process.platform === "win32" ? `chcp 65001>nul && ${command}` : command;

const runJavaTool = (command, { cwd } = {}) => {
  execSync(wrapWindowsCommand(applyUtf8VmOptions(command)), {
    cwd,
    shell: process.platform === "win32" ? "cmd.exe" : undefined,
    stdio: "inherit",
  });
};

module.exports = {
  runJavaTool,
};
