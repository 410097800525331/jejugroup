const fs = require("fs-extra");
const path = require("path");

const JSP_PAGE_DIRECTIVE =
  '<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="true"%>\n';
const RESERVED_ROOT_DIRS = new Set(["META-INF", "WEB-INF"]);
const HTML_EXTENSION_PATTERN = /\.html$/i;
const JSP_PAGE_DIRECTIVE_PATTERN = /^<%@\s*page[^\n]*%>\r?\n?/i;
const LEADING_BOM_PATTERN = /^\uFEFF/;

const normalizeRelativePath = (rootDir, filePath) => path.relative(rootDir, filePath).replace(/\\/g, "/");

const isReservedRelativePath = (relativePath) => {
  const [firstSegment] = relativePath.split("/");
  return RESERVED_ROOT_DIRS.has(firstSegment);
};

const collectHtmlFiles = async (targetDir, collected = []) => {
  const entries = await fs.readdir(targetDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(targetDir, entry.name);
    const relativePath = normalizeRelativePath(targetDir, fullPath);

    if (isReservedRelativePath(relativePath)) {
      continue;
    }

    if (entry.isDirectory()) {
      await collectHtmlFiles(fullPath, collected);
      continue;
    }

    if (HTML_EXTENSION_PATTERN.test(entry.name)) {
      collected.push(fullPath);
    }
  }

  return collected;
};

const toJspMirrorPath = (webappDir, htmlPath) => {
  const relativePath = normalizeRelativePath(webappDir, htmlPath);
  return path.join(webappDir, relativePath.replace(HTML_EXTENSION_PATTERN, ".jsp"));
};

const buildJspMirrorSource = (htmlSource) => {
  const normalizedHtmlSource = htmlSource.replace(LEADING_BOM_PATTERN, "");

  if (JSP_PAGE_DIRECTIVE_PATTERN.test(normalizedHtmlSource)) {
    return normalizedHtmlSource;
  }

  return `${JSP_PAGE_DIRECTIVE}${normalizedHtmlSource}`;
};

const stripJspPageDirective = (jspSource) =>
  jspSource.replace(JSP_PAGE_DIRECTIVE_PATTERN, "").replace(LEADING_BOM_PATTERN, "");

const generateJspMirrors = async (webappDir) => {
  const htmlFiles = await collectHtmlFiles(webappDir);

  await Promise.all(
    htmlFiles.map(async (htmlPath) => {
      const jspPath = toJspMirrorPath(webappDir, htmlPath);
      const htmlSource = await fs.readFile(htmlPath, "utf8");
      await fs.outputFile(jspPath, buildJspMirrorSource(htmlSource), "utf8");
    }),
  );

  return {
    htmlFileCount: htmlFiles.length,
    jspFileCount: htmlFiles.length,
  };
};

module.exports = {
  JSP_PAGE_DIRECTIVE,
  generateJspMirrors,
  stripJspPageDirective,
};
