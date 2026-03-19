import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const plugins = [react(), tailwindcss(), jsxLocPlugin()];
const normalizeChunkId = (id: string) => id.replaceAll("\\", "/");

const resolveCsManualChunk = (id: string) => {
  const normalizedId = normalizeChunkId(id);

  if (normalizedId.includes("/node_modules/")) {
    return "vendor";
  }

  if (normalizedId.includes("/client/src/pages/")) {
    return "app-pages";
  }

  if (normalizedId.includes("/client/src/components/")) {
    return "app-components";
  }

  if (normalizedId.includes("/client/src/contexts/")) {
    return "app-context";
  }

  if (normalizedId.includes("/shared/")) {
    return "app-shared";
  }

  return undefined;
};

export default defineConfig({
  base: "./",
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
      "@front-fab": path.resolve(__dirname, "../../components/react/ui/FAB"),
      "@front-layout": path.resolve(__dirname, "../../components/react/layout")
    },
  },
  envDir: path.resolve(__dirname),
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "../../.generated/webapp-overlay/pages/cs"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        customer_center: path.resolve(__dirname, "client/index.html"),
      },
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name].[ext]`,
        manualChunks: resolveCsManualChunk,
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    allowedHosts: ["localhost", "127.0.0.1"],
    fs: {
      strict: true,
      allow: [
        path.resolve(__dirname, "client"),
        path.resolve(__dirname, "../../components/react/ui/FAB"),
        path.resolve(__dirname, "../../components/react/layout"),
      ],
      deny: ["**/.*"],
    },
  },
});
