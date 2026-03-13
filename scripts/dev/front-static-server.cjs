const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const HOST = process.env.FRONT_STATIC_HOST || "127.0.0.1";
const PORT = Number(process.env.FRONT_STATIC_PORT || "4175");
const ROOT_DIR = path.resolve(__dirname, "../../front");

const CONTENT_TYPES = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".otf": "font/otf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url || "/", `http://${HOST}:${PORT}`).pathname);
  const normalizedPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.resolve(ROOT_DIR, `.${normalizedPath}`);

  if (!filePath.startsWith(ROOT_DIR)) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, file) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not Found");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = CONTENT_TYPES[extension] || "application/octet-stream";

    response.writeHead(200, { "Content-Type": contentType });
    response.end(file);
  });
});

server.listen(PORT, HOST, () => {
  process.stdout.write(`front static server listening on http://${HOST}:${PORT}\n`);
});
