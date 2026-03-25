const fs = require('fs-extra');
const path = require('path');
const { execFileSync } = require('node:child_process');

const rootDir = path.resolve(__dirname, '../../');
const frontDir = path.join(rootDir, 'front');
const springResourcesDir = path.join(rootDir, 'jeju-spring', 'src', 'main', 'resources');
const templateMirrorDir = path.join(springResourcesDir, 'templates', 'front-mirror');
const staticMirrorDir = path.join(springResourcesDir, 'static', 'front-mirror');
const generatedRuntimeDir = path.join(frontDir, '.generated', 'webapp-overlay', 'components', 'runtime');
const customerCenterOverlayDir = path.join(frontDir, '.generated', 'webapp-overlay', 'pages', 'cs');
const customerCenterTemplateDir = path.join(templateMirrorDir, 'pages', 'cs');
const customerCenterStaticDir = path.join(staticMirrorDir, 'pages', 'cs');
const customerCenterFrontSourcePrefix = path.posix.join('apps', 'cs');

const EXCLUDED_BASENAMES = new Set([
  '.git',
  '.generated',
  'node_modules',
  'scripts',
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'tsconfig.json',
  'tsconfig.node.json',
  'vite.config.ts',
  'vite.config.mjs',
  '.DS_Store',
]);

const HTML_EXTENSIONS = new Set(['.html', '.htm']);
const STATIC_EXTENSIONS = new Set([
  '.css',
  '.gif',
  '.ico',
  '.jpeg',
  '.jfif',
  '.jpg',
  '.js',
  '.json',
  '.mjs',
  '.mp4',
  '.png',
  '.svg',
  '.txt',
  '.webm',
  '.webp',
  '.woff',
  '.woff2',
]);
const URL_ATTRS = new Map([
  ['href', 'th:href'],
  ['src', 'th:src'],
  ['poster', 'th:poster'],
  ['action', 'th:action'],
]);
const BASE_TAG_PLACEHOLDER = '__FRONT_MIRROR_BASE_TAG_PLACEHOLDER__';

const parseArgs = (argv) => {
  const options = {
    clean: true,
    dryRun: false,
    buildShell: true,
  };

  for (const arg of argv) {
    if (arg === '--no-clean') {
      options.clean = false;
      continue;
    }

    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (arg === '--skip-build-shell') {
      options.buildShell = false;
      continue;
    }
  }

  return options;
};

const toPosix = (value) => value.replace(/\\/g, '/');

const shouldExclude = (absolutePath) => {
  const basename = path.basename(absolutePath);
  return EXCLUDED_BASENAMES.has(basename);
};

const isHtmlFile = (relativePath) => HTML_EXTENSIONS.has(path.posix.extname(relativePath).toLowerCase());

const isStaticCandidate = (relativePath) =>
  STATIC_EXTENSIONS.has(path.posix.extname(relativePath).toLowerCase());

const isExcludedGenericMirrorPath = (relativePath) =>
  relativePath === customerCenterFrontSourcePrefix ||
  relativePath.startsWith(`${customerCenterFrontSourcePrefix}/`);

const isExternalUrl = (value) =>
  /^(?:[a-z]+:)?\/\//i.test(value) ||
  value.startsWith('data:') ||
  value.startsWith('mailto:') ||
  value.startsWith('tel:') ||
  value.startsWith('javascript:') ||
  value.startsWith('#');

const splitUrlParts = (value) => {
  const hashIndex = value.indexOf('#');
  const beforeHash = hashIndex === -1 ? value : value.slice(0, hashIndex);
  const hash = hashIndex === -1 ? '' : value.slice(hashIndex);
  const queryIndex = beforeHash.indexOf('?');

  return {
    pathname: queryIndex === -1 ? beforeHash : beforeHash.slice(0, queryIndex),
    suffix: queryIndex === -1 ? hash : `${beforeHash.slice(queryIndex)}${hash}`,
  };
};

const resolveFrontRelativePath = (referencePath, rawUrl) => {
  const { pathname, suffix } = splitUrlParts(rawUrl);

  if (!pathname || isExternalUrl(pathname)) {
    return null;
  }

  const normalizedPath = pathname.startsWith('/')
    ? path.posix.normalize(pathname).replace(/^\/+/, '')
    : path.posix.normalize(path.posix.join(referencePath, pathname));

  if (!normalizedPath || normalizedPath.startsWith('..')) {
    return null;
  }

  return {
    relativePath: normalizedPath,
    suffix,
  };
};

const resolveDocumentBasePath = (htmlRelativePath, baseHref) => {
  const htmlDir = path.posix.dirname(htmlRelativePath);

  if (!baseHref) {
    return htmlDir;
  }

  const resolved = resolveFrontRelativePath(htmlDir, baseHref);
  return resolved ? resolved.relativePath : htmlDir;
};

const buildMirrorUrl = (referencePath, rawUrl, attrName) => {
  const resolved = resolveFrontRelativePath(referencePath, rawUrl);
  if (!resolved) {
    return null;
  }

  const ext = path.posix.extname(resolved.relativePath).toLowerCase();
  const logicalPath = `/${resolved.relativePath}${resolved.suffix}`;
  const staticPath = `/front-mirror/${resolved.relativePath}${resolved.suffix}`;

  if (HTML_EXTENSIONS.has(ext)) {
    return {
      literalUrl: logicalPath,
      thymeleafAttr: URL_ATTRS.get(attrName),
      thymeleafUrl: logicalPath,
    };
  }

  return {
    literalUrl: staticPath,
    thymeleafAttr: URL_ATTRS.get(attrName),
    thymeleafUrl: staticPath,
  };
};

const buildMirrorBaseHref = (htmlRelativePath, baseHref) => {
  const baseTagReferencePath = path.posix.dirname(htmlRelativePath);
  const resolved = resolveFrontRelativePath(baseTagReferencePath, baseHref);

  if (!resolved) {
    return null;
  }

  const basePathName = resolved.relativePath.replace(/\/+$/, '');
  const basePath = basePathName ? `/front-mirror/${basePathName}/` : '/front-mirror/';
  return basePath;
};

const ensureHtmlNamespace = (source) => {
  if (!/<html\b/i.test(source) || /xmlns:th=/i.test(source)) {
    return source;
  }

  return source.replace(/<html\b([^>]*)>/i, '<html$1 xmlns:th="http://www.thymeleaf.org">');
};

const rewriteUrlAttributes = (source, referencePath) =>
  source.replace(/\s(href|src|poster|action)=(['"])([^'"]*)\2/gi, (match, attrName, quote, attrValue) => {
    const rewritten = buildMirrorUrl(referencePath, attrValue, attrName.toLowerCase());
    if (!rewritten || !rewritten.thymeleafAttr) {
      return match;
    }

    return ` ${rewritten.thymeleafAttr}="@{${rewritten.thymeleafUrl}}" ${attrName}=${quote}${rewritten.literalUrl}${quote}`;
  });

const rewriteDynamicImports = (source, referencePath) =>
  source.replace(/import\((['"])([^'"]+)\1\)/g, (match, quote, importPath) => {
    const rewritten = buildMirrorUrl(referencePath, importPath, 'src');
    if (!rewritten) {
      return match;
    }

    return `import(${quote}${rewritten.literalUrl}${quote})`;
  });

const transformHtmlSource = (source, htmlRelativePath) => {
  const baseTagMatch = source.match(/<base\b([^>]*?)\bhref=(['"])([^'"]*)\2([^>]*?)>/i);
  const baseHref = baseTagMatch ? baseTagMatch[3] : null;
  const documentBasePath = resolveDocumentBasePath(htmlRelativePath, baseHref);
  const baseTagReplacement = baseHref ? buildMirrorBaseHref(htmlRelativePath, baseHref) : null;

  let transformed = source;
  if (baseTagMatch && baseTagReplacement) {
    transformed = transformed.replace(baseTagMatch[0], BASE_TAG_PLACEHOLDER);
  }

  transformed = ensureHtmlNamespace(transformed);
  transformed = rewriteUrlAttributes(transformed, documentBasePath);
  transformed = rewriteDynamicImports(transformed, documentBasePath);

  if (baseTagMatch && baseTagReplacement) {
    transformed = transformed.replace(
      BASE_TAG_PLACEHOLDER,
      `<base th:href="@{${baseTagReplacement}}" href="${baseTagReplacement}">`,
    );
  }

  return transformed;
};

const collectFrontFiles = async (currentDir, files = []) => {
  const entries = await fs.readdir(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(currentDir, entry.name);
    if (shouldExclude(absolutePath)) {
      continue;
    }

    const relativePath = toPosix(path.relative(frontDir, absolutePath));
    if (isExcludedGenericMirrorPath(relativePath)) {
      continue;
    }

    if (entry.isDirectory()) {
      await collectFrontFiles(absolutePath, files);
      continue;
    }

    files.push({
      absolutePath,
      relativePath,
    });
  }

  return files;
};

const copyStaticFile = async (file, options) => {
  const targetPath = path.join(staticMirrorDir, file.relativePath);
  if (options.dryRun) {
    return targetPath;
  }

  await fs.ensureDir(path.dirname(targetPath));
  await fs.copyFile(file.absolutePath, targetPath);
  return targetPath;
};

const writeTemplateFile = async (file, options) => {
  const targetPath = path.join(templateMirrorDir, file.relativePath);
  const source = await fs.readFile(file.absolutePath, 'utf8');
  const transformed = transformHtmlSource(source, file.relativePath);

  if (options.dryRun) {
    return targetPath;
  }

  await fs.ensureDir(path.dirname(targetPath));
  await fs.writeFile(targetPath, transformed, 'utf8');
  return targetPath;
};

const copyGeneratedRuntime = async (options) => {
  const targetPath = path.join(staticMirrorDir, 'components', 'runtime');
  if (!(await fs.pathExists(generatedRuntimeDir))) {
    return false;
  }

  if (!options.dryRun) {
    await fs.ensureDir(path.dirname(targetPath));
    await fs.copy(generatedRuntimeDir, targetPath, { overwrite: true });
  }

  return true;
};

const copyCustomerCenterOverlay = async (options) => {
  if (!(await fs.pathExists(customerCenterOverlayDir))) {
    return false;
  }

  const htmlSourcePath = path.join(customerCenterOverlayDir, 'customer_center.html');
  const htmlTargetPath = path.join(customerCenterTemplateDir, 'customer_center.html');

  if (!options.dryRun) {
    await fs.ensureDir(customerCenterTemplateDir);
    await fs.ensureDir(customerCenterStaticDir);

    if (await fs.pathExists(htmlSourcePath)) {
      const source = await fs.readFile(htmlSourcePath, 'utf8');
      const transformed = transformHtmlSource(source, 'pages/cs/customer_center.html');
      await fs.writeFile(htmlTargetPath, transformed, 'utf8');
    }

    await fs.copy(customerCenterOverlayDir, customerCenterStaticDir, {
      overwrite: true,
      filter: (sourcePath) => {
        const baseName = path.basename(sourcePath);
        return baseName !== '.gitkeep' && baseName !== 'customer_center.html';
      },
    });
  }

  return true;
};

const buildShellRuntime = (options) => {
  if (!options.buildShell) {
    return;
  }

  execFileSync('pnpm', ['run', 'build:shell'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
};

const cleanTargets = async (options) => {
  if (!options.clean || options.dryRun) {
    return;
  }

  await fs.remove(templateMirrorDir);
  await fs.remove(staticMirrorDir);
  await fs.remove(customerCenterTemplateDir);
  await fs.remove(customerCenterStaticDir);
};

async function mirrorFrontToThymeleaf(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);

  console.log('[mirror-front-to-thymeleaf] front -> jeju-spring Thymeleaf 미러를 시작한다');
  if (options.dryRun) {
    console.log('[mirror-front-to-thymeleaf] dry-run 모드라 실제 파일은 쓰지 않는다');
  }

  buildShellRuntime(options);
  await cleanTargets(options);

  const files = await collectFrontFiles(frontDir);
  const htmlFiles = files.filter((file) => isHtmlFile(file.relativePath));
  const staticFiles = files.filter((file) => !isHtmlFile(file.relativePath) && isStaticCandidate(file.relativePath));

  for (const file of htmlFiles) {
    await writeTemplateFile(file, options);
  }

  for (const file of staticFiles) {
    await copyStaticFile(file, options);
  }

  const runtimeCopied = await copyGeneratedRuntime(options);
  const customerCenterCopied = await copyCustomerCenterOverlay(options);

  console.log(`[mirror-front-to-thymeleaf] template ${htmlFiles.length}개, static ${staticFiles.length}개 처리`);
  console.log(`[mirror-front-to-thymeleaf] template target: ${templateMirrorDir}`);
  console.log(`[mirror-front-to-thymeleaf] static target: ${staticMirrorDir}`);
  console.log(`[mirror-front-to-thymeleaf] generated runtime copied: ${runtimeCopied ? 'yes' : 'no'}`);
  console.log(`[mirror-front-to-thymeleaf] customer center overlay copied: ${customerCenterCopied ? 'yes' : 'no'}`);
}

if (require.main === module) {
  mirrorFrontToThymeleaf().catch((error) => {
    console.error('[mirror-front-to-thymeleaf] 실패:', error);
    process.exit(1);
  });
}

module.exports = {
  mirrorFrontToThymeleaf,
  transformHtmlSource,
};
