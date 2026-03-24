const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const CONTENT_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const normalizeRootDirs = ({ rootDir, rootDirs }) => {
  if (Array.isArray(rootDirs) && rootDirs.length > 0) {
    return rootDirs.map((dir) => path.resolve(dir));
  }

  return [path.resolve(rootDir)];
};

const createStaticServerController = ({ fallbackPath, host, port, rootDir, rootDirs }) => {
  let server;
  const resolvedRootDirs = normalizeRootDirs({ rootDir, rootDirs });

  const resolveFilePath = (requestUrl = "/") => {
    const pathname = decodeURIComponent(new URL(requestUrl, `http://${host}:${port}`).pathname);
    const normalizedPath = pathname === "/" ? fallbackPath : pathname;

    for (const currentRootDir of resolvedRootDirs) {
      const filePath = path.resolve(currentRootDir, `.${normalizedPath}`);
      if (!filePath.startsWith(currentRootDir)) {
        continue;
      }

      if (fs.existsSync(filePath)) {
        return filePath;
      }
    }

    return path.resolve(resolvedRootDirs[resolvedRootDirs.length - 1], `.${normalizedPath}`);
  };

  const createStaticServer = () =>
    http.createServer((request, response) => {
      const filePath = resolveFilePath(request.url);

      if (!filePath) {
        response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Forbidden");
        return;
      }

      fs.readFile(filePath, (error, file) => {
        if (error) {
          if (filePath.endsWith(`${path.sep}favicon.ico`)) {
            response.writeHead(204);
            response.end();
            return;
          }

          response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          response.end("Not Found");
          return;
        }

        const contentType =
          CONTENT_TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";

        response.writeHead(200, { "Content-Type": contentType });
        response.end(file);
      });
    });

  const start = async () =>
    new Promise((resolve) => {
      server = createStaticServer();
      server.listen(port, host, () => resolve());
    });

  const stop = async () =>
    new Promise((resolve, reject) => {
      if (!server) {
        resolve();
        return;
      }

      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

  return {
    start,
    stop,
    url: (pathname = "") => `http://${host}:${port}${pathname}`,
  };
};

module.exports = {
  createStaticServerController,
};
