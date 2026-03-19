import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

const plugins = [react(), tailwindcss(), jsxLocPlugin()];

export default defineConfig({
  base: "./",
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      "@front-fab": path.resolve(import.meta.dirname, "../../components/react/ui/FAB"),
      "@front-layout": path.resolve(import.meta.dirname, "../../components/react/layout")
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "../../.generated/webapp-overlay/pages/cs"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        customer_center: path.resolve(import.meta.dirname, "client/index.html"),
      },
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name].[ext]`,
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
    proxy: {
      "/inquiry": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
      },
    },
    allowedHosts: ["localhost", "127.0.0.1"],
    fs: {
      strict: true,
      allow: [
        path.resolve(import.meta.dirname, "client"),
        path.resolve(import.meta.dirname, "../../components/react/ui/FAB"),
        path.resolve(import.meta.dirname, "../../components/react/layout"),
      ],
      deny: ["**/.*"],
    },
  },
});
