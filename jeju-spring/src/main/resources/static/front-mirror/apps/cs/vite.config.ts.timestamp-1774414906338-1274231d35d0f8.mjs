// vite.config.ts
import { jsxLocPlugin } from "file:///C:/gi/git/jejugroup/node_modules/.pnpm/@builder.io+vite-plugin-jsx-loc@0.1.1_vite@5.4.21_@types+node@22.19.15_lightningcss@1.31.1_/node_modules/@builder.io/vite-plugin-jsx-loc/dist/index.js";
import tailwindcss from "file:///C:/gi/git/jejugroup/node_modules/.pnpm/@tailwindcss+vite@4.2.1_vite@5.4.21_@types+node@22.19.15_lightningcss@1.31.1_/node_modules/@tailwindcss/vite/dist/index.mjs";
import react from "file:///C:/gi/git/jejugroup/node_modules/.pnpm/@vitejs+plugin-react@4.7.0_vite@5.4.21_@types+node@22.19.15_lightningcss@1.31.1_/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "file:///C:/gi/git/jejugroup/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.15_lightningcss@1.31.1/node_modules/vite/dist/node/index.js";
var __vite_injected_original_import_meta_url = "file:///C:/gi/git/jejugroup/front/apps/cs/vite.config.ts";
var __dirname = path.dirname(fileURLToPath(__vite_injected_original_import_meta_url));
var plugins = [react(), tailwindcss(), jsxLocPlugin()];
var normalizeChunkId = (id) => id.replaceAll("\\", "/");
var resolveCsManualChunk = (id) => {
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
  return void 0;
};
var vite_config_default = defineConfig({
  base: "./",
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
      "@front-fab": path.resolve(__dirname, "../../components/react/ui/FAB"),
      "@front-layout": path.resolve(__dirname, "../../components/react/layout")
    }
  },
  envDir: path.resolve(__dirname),
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "../../.generated/webapp-overlay/pages/cs"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        customer_center: path.resolve(__dirname, "client/index.html")
      },
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name].[ext]`,
        manualChunks: resolveCsManualChunk
      }
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"]
  },
  server: {
    port: 3e3,
    strictPort: false,
    host: true,
    allowedHosts: ["localhost", "127.0.0.1"],
    fs: {
      strict: true,
      allow: [
        path.resolve(__dirname, "client"),
        path.resolve(__dirname, "../../components/react/ui/FAB"),
        path.resolve(__dirname, "../../components/react/layout")
      ],
      deny: ["**/.*"]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxnaVxcXFxnaXRcXFxcamVqdWdyb3VwXFxcXGZyb250XFxcXGFwcHNcXFxcY3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXGdpXFxcXGdpdFxcXFxqZWp1Z3JvdXBcXFxcZnJvbnRcXFxcYXBwc1xcXFxjc1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovZ2kvZ2l0L2planVncm91cC9mcm9udC9hcHBzL2NzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsganN4TG9jUGx1Z2luIH0gZnJvbSBcIkBidWlsZGVyLmlvL3ZpdGUtcGx1Z2luLWpzeC1sb2NcIjtcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tIFwiQHRhaWx3aW5kY3NzL3ZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJub2RlOnBhdGhcIjtcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tIFwibm9kZTp1cmxcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5cbmNvbnN0IF9fZGlybmFtZSA9IHBhdGguZGlybmFtZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpO1xuY29uc3QgcGx1Z2lucyA9IFtyZWFjdCgpLCB0YWlsd2luZGNzcygpLCBqc3hMb2NQbHVnaW4oKV07XG5jb25zdCBub3JtYWxpemVDaHVua0lkID0gKGlkOiBzdHJpbmcpID0+IGlkLnJlcGxhY2VBbGwoXCJcXFxcXCIsIFwiL1wiKTtcblxuY29uc3QgcmVzb2x2ZUNzTWFudWFsQ2h1bmsgPSAoaWQ6IHN0cmluZykgPT4ge1xuICBjb25zdCBub3JtYWxpemVkSWQgPSBub3JtYWxpemVDaHVua0lkKGlkKTtcblxuICBpZiAobm9ybWFsaXplZElkLmluY2x1ZGVzKFwiL25vZGVfbW9kdWxlcy9cIikpIHtcbiAgICByZXR1cm4gXCJ2ZW5kb3JcIjtcbiAgfVxuXG4gIGlmIChub3JtYWxpemVkSWQuaW5jbHVkZXMoXCIvY2xpZW50L3NyYy9wYWdlcy9cIikpIHtcbiAgICByZXR1cm4gXCJhcHAtcGFnZXNcIjtcbiAgfVxuXG4gIGlmIChub3JtYWxpemVkSWQuaW5jbHVkZXMoXCIvY2xpZW50L3NyYy9jb21wb25lbnRzL1wiKSkge1xuICAgIHJldHVybiBcImFwcC1jb21wb25lbnRzXCI7XG4gIH1cblxuICBpZiAobm9ybWFsaXplZElkLmluY2x1ZGVzKFwiL2NsaWVudC9zcmMvY29udGV4dHMvXCIpKSB7XG4gICAgcmV0dXJuIFwiYXBwLWNvbnRleHRcIjtcbiAgfVxuXG4gIGlmIChub3JtYWxpemVkSWQuaW5jbHVkZXMoXCIvc2hhcmVkL1wiKSkge1xuICAgIHJldHVybiBcImFwcC1zaGFyZWRcIjtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBiYXNlOiBcIi4vXCIsXG4gIHBsdWdpbnMsXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiY2xpZW50XCIsIFwic3JjXCIpLFxuICAgICAgXCJAc2hhcmVkXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic2hhcmVkXCIpLFxuICAgICAgXCJAYXNzZXRzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiYXR0YWNoZWRfYXNzZXRzXCIpLFxuICAgICAgXCJAZnJvbnQtZmFiXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vLi4vY29tcG9uZW50cy9yZWFjdC91aS9GQUJcIiksXG4gICAgICBcIkBmcm9udC1sYXlvdXRcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuLi8uLi9jb21wb25lbnRzL3JlYWN0L2xheW91dFwiKVxuICAgIH0sXG4gIH0sXG4gIGVudkRpcjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSksXG4gIHJvb3Q6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiY2xpZW50XCIpLFxuICBidWlsZDoge1xuICAgIG91dERpcjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuLi8uLi8uZ2VuZXJhdGVkL3dlYmFwcC1vdmVybGF5L3BhZ2VzL2NzXCIpLFxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiB7XG4gICAgICAgIGN1c3RvbWVyX2NlbnRlcjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJjbGllbnQvaW5kZXguaHRtbFwiKSxcbiAgICAgIH0sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6IGBhc3NldHMvW25hbWVdLmpzYCxcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6IGBhc3NldHMvW25hbWVdLVtoYXNoXS5qc2AsXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiBgYXNzZXRzL1tuYW1lXS5bZXh0XWAsXG4gICAgICAgIG1hbnVhbENodW5rczogcmVzb2x2ZUNzTWFudWFsQ2h1bmssXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHRlc3Q6IHtcbiAgICBnbG9iYWxzOiB0cnVlLFxuICAgIGVudmlyb25tZW50OiBcImpzZG9tXCIsXG4gICAgc2V0dXBGaWxlczogW1wiLi9zcmMvdGVzdC9zZXR1cC50c1wiXSxcbiAgICBpbmNsdWRlOiBbXCJzcmMvKiovKi50ZXN0Lnt0cyx0c3h9XCJdLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAwLFxuICAgIHN0cmljdFBvcnQ6IGZhbHNlLFxuICAgIGhvc3Q6IHRydWUsXG4gICAgYWxsb3dlZEhvc3RzOiBbXCJsb2NhbGhvc3RcIiwgXCIxMjcuMC4wLjFcIl0sXG4gICAgZnM6IHtcbiAgICAgIHN0cmljdDogdHJ1ZSxcbiAgICAgIGFsbG93OiBbXG4gICAgICAgIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiY2xpZW50XCIpLFxuICAgICAgICBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uLy4uL2NvbXBvbmVudHMvcmVhY3QvdWkvRkFCXCIpLFxuICAgICAgICBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uLy4uL2NvbXBvbmVudHMvcmVhY3QvbGF5b3V0XCIpLFxuICAgICAgXSxcbiAgICAgIGRlbnk6IFtcIioqLy4qXCJdLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVMsU0FBUyxvQkFBb0I7QUFDaFUsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHFCQUFxQjtBQUM5QixTQUFTLG9CQUFvQjtBQUwwSixJQUFNLDJDQUEyQztBQU94TyxJQUFNLFlBQVksS0FBSyxRQUFRLGNBQWMsd0NBQWUsQ0FBQztBQUM3RCxJQUFNLFVBQVUsQ0FBQyxNQUFNLEdBQUcsWUFBWSxHQUFHLGFBQWEsQ0FBQztBQUN2RCxJQUFNLG1CQUFtQixDQUFDLE9BQWUsR0FBRyxXQUFXLE1BQU0sR0FBRztBQUVoRSxJQUFNLHVCQUF1QixDQUFDLE9BQWU7QUFDM0MsUUFBTSxlQUFlLGlCQUFpQixFQUFFO0FBRXhDLE1BQUksYUFBYSxTQUFTLGdCQUFnQixHQUFHO0FBQzNDLFdBQU87QUFBQSxFQUNUO0FBRUEsTUFBSSxhQUFhLFNBQVMsb0JBQW9CLEdBQUc7QUFDL0MsV0FBTztBQUFBLEVBQ1Q7QUFFQSxNQUFJLGFBQWEsU0FBUyx5QkFBeUIsR0FBRztBQUNwRCxXQUFPO0FBQUEsRUFDVDtBQUVBLE1BQUksYUFBYSxTQUFTLHVCQUF1QixHQUFHO0FBQ2xELFdBQU87QUFBQSxFQUNUO0FBRUEsTUFBSSxhQUFhLFNBQVMsVUFBVSxHQUFHO0FBQ3JDLFdBQU87QUFBQSxFQUNUO0FBRUEsU0FBTztBQUNUO0FBRUEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLEVBQ047QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLFdBQVcsVUFBVSxLQUFLO0FBQUEsTUFDNUMsV0FBVyxLQUFLLFFBQVEsV0FBVyxRQUFRO0FBQUEsTUFDM0MsV0FBVyxLQUFLLFFBQVEsV0FBVyxpQkFBaUI7QUFBQSxNQUNwRCxjQUFjLEtBQUssUUFBUSxXQUFXLCtCQUErQjtBQUFBLE1BQ3JFLGlCQUFpQixLQUFLLFFBQVEsV0FBVywrQkFBK0I7QUFBQSxJQUMxRTtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVEsS0FBSyxRQUFRLFNBQVM7QUFBQSxFQUM5QixNQUFNLEtBQUssUUFBUSxXQUFXLFFBQVE7QUFBQSxFQUN0QyxPQUFPO0FBQUEsSUFDTCxRQUFRLEtBQUssUUFBUSxXQUFXLDBDQUEwQztBQUFBLElBQzFFLGFBQWE7QUFBQSxJQUNiLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxRQUNMLGlCQUFpQixLQUFLLFFBQVEsV0FBVyxtQkFBbUI7QUFBQSxNQUM5RDtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsY0FBYztBQUFBLE1BQ2hCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE1BQU07QUFBQSxJQUNKLFNBQVM7QUFBQSxJQUNULGFBQWE7QUFBQSxJQUNiLFlBQVksQ0FBQyxxQkFBcUI7QUFBQSxJQUNsQyxTQUFTLENBQUMsd0JBQXdCO0FBQUEsRUFDcEM7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLE1BQU07QUFBQSxJQUNOLGNBQWMsQ0FBQyxhQUFhLFdBQVc7QUFBQSxJQUN2QyxJQUFJO0FBQUEsTUFDRixRQUFRO0FBQUEsTUFDUixPQUFPO0FBQUEsUUFDTCxLQUFLLFFBQVEsV0FBVyxRQUFRO0FBQUEsUUFDaEMsS0FBSyxRQUFRLFdBQVcsK0JBQStCO0FBQUEsUUFDdkQsS0FBSyxRQUFRLFdBQVcsK0JBQStCO0FBQUEsTUFDekQ7QUFBQSxNQUNBLE1BQU0sQ0FBQyxPQUFPO0FBQUEsSUFDaEI7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
