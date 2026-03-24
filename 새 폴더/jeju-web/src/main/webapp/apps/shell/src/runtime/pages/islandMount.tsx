import { createRoot, type Root } from "react-dom/client";
import type { ReactElement } from "react";

const roots = new Map<string, Root>();

export const mountIsland = (hostId: string, component: ReactElement) => {
  const host = document.getElementById(hostId);
  if (!host) {
    return;
  }

  const existing = roots.get(hostId);
  if (existing) {
    existing.unmount();
  }

  const root = createRoot(host);
  roots.set(hostId, root);
  root.render(component);
};

