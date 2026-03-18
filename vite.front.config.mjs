import path from "node:path";
import fs from "node:fs/promises";
import react from "@vitejs/plugin-react";
import { createServer, defineConfig, loadConfigFromFile, mergeConfig } from "vite";

const rootDir = path.resolve(process.cwd(), "front");
const customerCenterEntryPath = path.resolve(rootDir, "apps", "cs", "client", "index.html");
const customerCenterConfigPath = path.resolve(rootDir, "apps", "cs", "vite.config.ts");
const customerCenterDevBase = "/__cs_dev__/";
const customerCenterRoutePath = "/pages/cs/customer_center.html";
const bootstrapRoutePath = "/components/runtime/bootstrap.js";
const shellRuntimeRoutePath = "/components/runtime/shell-runtime.js";
const shellRuntimeSourcePath = "/apps/shell/src/runtime/index.ts";
const bootstrapSourcePath = "/apps/shell/src/runtime/bootstrap.js";
const bootstrapVirtualModuleId = "virtual:jeju-runtime-bootstrap";
const shellRuntimeVirtualModuleId = "virtual:jeju-runtime-shell";
const sharedNodeModulesDir = path.resolve(rootDir, "components", "react", "node_modules");
const runtimeBootstrapSpecifiers = new Set([bootstrapRoutePath, bootstrapRoutePath.slice(1)]);
const runtimeShellSpecifiers = new Set([shellRuntimeRoutePath, shellRuntimeRoutePath.slice(1)]);
const localNavigatorScript = `
window.__JEJU_ROUTE_NAVIGATOR__ = {
  ...(window.__JEJU_ROUTE_NAVIGATOR__ || {}),
  appRoot: window.location.origin + "/",
  homeUrl: window.location.origin + "/index.html"
};
`.trim();
const shellRuntimeProxyModule = `
export * from "${shellRuntimeSourcePath}";
`.trim();
const bootstrapProxyModule = `
import "${bootstrapSourcePath}";
`.trim();
const resolveFrontPort = () => {
  const rawPort = process.env.FRONT_VITE_PORT;
  const parsedPort = Number(rawPort);

  return Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 3001;
};

const createChildViteServer = async ({
  appType,
  base,
  configPath,
  parentServer,
  mode,
  logger,
  logLevel,
}) => {
  const loadedConfig = await loadConfigFromFile(
    {
      command: "serve",
      mode,
    },
    configPath,
    undefined,
    logLevel,
    logger,
  );

  return createServer(
    mergeConfig(loadedConfig?.config ?? {}, {
      appType,
      base,
      clearScreen: false,
      configFile: false,
      server: {
        hmr: {
          path: `${base.slice(0, -1)}/__vite_ws`,
          server: parentServer,
        },
        middlewareMode: {
          server: parentServer,
        },
      },
    }),
  );
};

const attachChildMiddleware = (parentServer, prefix, childServer) => {
  parentServer.middlewares.use((request, response, next) => {
    const url = request.url || "";
    if (!url.startsWith(prefix)) {
      next();
      return;
    }

    childServer.middlewares.handle(request, response, next);
  });
};

export default defineConfig({
  appType: "mpa",
  resolve: {
    alias: {
      "@runtime": path.resolve(rootDir, "apps", "shell", "src", "runtime"),
      "@front-fab": path.resolve(rootDir, "components", "react", "ui", "FAB"),
      "@front-layout": path.resolve(rootDir, "components", "react", "layout"),
      "@front-components": path.resolve(rootDir, "components", "react"),
      "@front-core-auth": path.resolve(rootDir, "core", "auth"),
      "@front-core-utils": path.resolve(rootDir, "core", "utils"),
      "react/jsx-dev-runtime": path.resolve(sharedNodeModulesDir, "react", "jsx-dev-runtime.js"),
      "react/jsx-runtime": path.resolve(sharedNodeModulesDir, "react", "jsx-runtime.js"),
      react: path.resolve(sharedNodeModulesDir, "react", "index.js"),
      "react-dom/client": path.resolve(sharedNodeModulesDir, "react-dom", "client.js"),
      "react-dom": path.resolve(sharedNodeModulesDir, "react-dom", "index.js"),
      "lucide-react": path.resolve(sharedNodeModulesDir, "lucide-react", "dist", "esm", "lucide-react.js"),
      gsap: path.resolve(sharedNodeModulesDir, "gsap", "index.js"),
      "@gsap/react": path.resolve(sharedNodeModulesDir, "@gsap", "react", "dist", "index.js")
    },
  },
  root: rootDir,
  plugins: [
    react(),
    {
      name: "jeju-front-unified-customer-center-dev",
      apply: "serve",
      load(id) {
        if (id === bootstrapVirtualModuleId) {
          return bootstrapProxyModule;
        }

        if (id === shellRuntimeVirtualModuleId) {
          return shellRuntimeProxyModule;
        }

        return null;
      },
      resolveId(source) {
        if (runtimeBootstrapSpecifiers.has(source)) {
          return bootstrapVirtualModuleId;
        }

        if (runtimeShellSpecifiers.has(source)) {
          return shellRuntimeVirtualModuleId;
        }

        return null;
      },
      async configureServer(server) {
        if (!server.httpServer) {
          return;
        }

        const customerCenterServer = await createChildViteServer({
          appType: "spa",
          base: customerCenterDevBase,
          configPath: customerCenterConfigPath,
          parentServer: server.httpServer,
          mode: server.config.mode,
          logger: server.config.logger,
          logLevel: server.config.logLevel,
        });

        attachChildMiddleware(server, customerCenterDevBase, customerCenterServer);
        server.middlewares.use(customerCenterRoutePath, async (_request, response, next) => {
          try {
            const template = await fs.readFile(customerCenterEntryPath, "utf8");
            const transformedHtml = await customerCenterServer.transformIndexHtml(
              customerCenterRoutePath,
              template,
            );

            response.statusCode = 200;
            response.setHeader("Content-Type", "text/html; charset=utf-8");
            response.end(transformedHtml);
          } catch (error) {
            next(error);
          }
        });
        server.middlewares.use(bootstrapRoutePath, (_request, response) => {
          response.statusCode = 200;
          response.setHeader("Content-Type", "text/javascript; charset=utf-8");
          response.end(bootstrapProxyModule);
        });
        server.middlewares.use(shellRuntimeRoutePath, (_request, response) => {
          response.statusCode = 200;
          response.setHeader("Content-Type", "text/javascript; charset=utf-8");
          response.end(shellRuntimeProxyModule);
        });

        server.httpServer.once("close", () => {
          void customerCenterServer.close();
        });
      },
      transformIndexHtml() {
        return [
          {
            attrs: { type: "text/javascript" },
            children: localNavigatorScript,
            injectTo: "head-prepend",
            tag: "script",
          },
        ];
      },
    },
  ],
  server: {
    host: "127.0.0.1",
    port: resolveFrontPort(),
    strictPort: true,
    fs: {
      strict: true,
      allow: [rootDir],
    },
    watch: {
      ignored: ["**/.generated/**"],
    },
  },
});
