import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  define: {
    "process.env.NODE_ENV": JSON.stringify("production")
  },
  plugins: [react()],
  build: {
    outDir: path.resolve(import.meta.dirname, "../../../.generated/front/components/runtime"),
    emptyOutDir: true,
    lib: {
      entry: path.resolve(import.meta.dirname, "src/runtime/index.ts"),
      formats: ["es"],
      fileName: () => "shell-runtime.js"
    },
    rollupOptions: {
      output: {
        chunkFileNames: "[name]-[hash].js",
        assetFileNames: "[name][extname]"
      }
    }
  },
  resolve: {
    alias: {
      "@runtime": path.resolve(import.meta.dirname, "src/runtime"),
      "@front-fab": path.resolve(import.meta.dirname, "../../components/react/ui/FAB"),
      "@front-components": path.resolve(import.meta.dirname, "../../components/react"),
      "@front-core-auth": path.resolve(import.meta.dirname, "../../core/auth"),
      "@front-core-utils": path.resolve(import.meta.dirname, "../../core/utils")
    }
  },
  server: {
    fs: {
      strict: true,
      allow: [
        path.resolve(import.meta.dirname, "src"),
        path.resolve(import.meta.dirname, "../../components/react/ui/FAB"),
        path.resolve(import.meta.dirname, "../../components/react")
      ]
    }
  }
});
