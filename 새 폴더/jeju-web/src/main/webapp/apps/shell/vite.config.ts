import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const normalizeChunkId = (id: string) => id.replaceAll("\\", "/");

const resolveShellManualChunk = (id: string) => {
  const normalizedId = normalizeChunkId(id);

  if (normalizedId.includes("/node_modules/")) {
    if (
      normalizedId.includes("/react/") ||
      normalizedId.includes("/react-dom/") ||
      normalizedId.includes("/scheduler/")
    ) {
      return "react-vendor";
    }

    if (normalizedId.includes("/gsap/")) {
      return "gsap-vendor";
    }

    if (normalizedId.includes("/lucide-react/")) {
      return "icon-vendor";
    }

    return "vendor";
  }

  if (normalizedId.includes("/src/runtime/layout/")) {
    return "runtime-layout";
  }

  if (normalizedId.includes("/src/runtime/pages/")) {
    return "runtime-pages";
  }

  if (normalizedId.includes("/src/runtime/ui/")) {
    return "runtime-ui";
  }

  if (normalizedId.includes("/src/runtime/widget/")) {
    return "runtime-widget";
  }

  if (normalizedId.includes("/src/runtime/components/") || normalizedId.includes("/src/runtime/context/")) {
    return "runtime-components";
  }

  if (normalizedId.includes("/components/react/auth/")) {
    return "feature-auth";
  }

  if (normalizedId.includes("/components/react/mypage/")) {
    return "feature-mypage";
  }

  if (normalizedId.includes("/components/react/travel/")) {
    return "feature-travel";
  }

  if (normalizedId.includes("/components/react/hotel/")) {
    return "feature-hotel";
  }

  if (normalizedId.includes("/components/react/life/")) {
    return "feature-life";
  }

  if (normalizedId.includes("/components/react/layout/")) {
    return "feature-layout";
  }

  if (normalizedId.includes("/components/react/widget/") || normalizedId.includes("/components/react/ui/")) {
    return "feature-ui";
  }

  if (
    normalizedId.includes("/core/auth/") ||
    normalizedId.includes("/core/modules/auth/") ||
    normalizedId.includes("/core/utils/") ||
    normalizedId.includes("/core/modules/utils/") ||
    normalizedId.includes("/core/constants/") ||
    normalizedId.includes("/core/modules/constants/") ||
    normalizedId.includes("/core/modules/config/")
  ) {
    return "legacy-core";
  }

  return undefined;
};

export default defineConfig({
  define: {
    "process.env.NODE_ENV": JSON.stringify("production")
  },
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, "../../.generated/webapp-overlay/components/runtime"),
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "src/runtime/index.ts"),
      formats: ["es"],
      fileName: () => "shell-runtime.js"
    },
    rollupOptions: {
      output: {
        chunkFileNames: "[name]-[hash].js",
        assetFileNames: "[name][extname]",
        manualChunks: resolveShellManualChunk,
      }
    }
  },
  resolve: {
    alias: {
      "@runtime": path.resolve(__dirname, "src/runtime"),
      "@front-fab": path.resolve(__dirname, "../../components/react/ui/FAB"),
      "@front-components": path.resolve(__dirname, "../../components/react"),
      "@front-core-auth": path.resolve(__dirname, "../../core/auth"),
      "@front-core-utils": path.resolve(__dirname, "../../core/utils")
    }
  },
  server: {
    fs: {
      strict: true,
      allow: [
        path.resolve(__dirname, "src"),
        path.resolve(__dirname, "../../components/react/ui/FAB"),
        path.resolve(__dirname, "../../components/react")
      ]
    }
  }
});
