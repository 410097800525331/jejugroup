const READY_EVENTS = {
  "main-header": "mainHeaderLoaded",
  "main-footer": "mainFooterLoaded",
} as const;

type RuntimeStage =
  | "bootstrap"
  | "main-header"
  | "main-footer"
  | "main-shell"
  | "hotel-header"
  | "hotel-footer"
  | "hotel-shell"
  | "page-shell";

const readyStages = new Set<RuntimeStage>();
const stageWaiters = new Map<RuntimeStage, Array<() => void>>();

const dispatchLegacyEvent = (stage: RuntimeStage) => {
  const eventName = READY_EVENTS[stage as keyof typeof READY_EVENTS];
  if (!eventName) {
    return;
  }

  document.dispatchEvent(new Event(eventName));
};

const resolveStageWaiters = (stage: RuntimeStage) => {
  const waiters = stageWaiters.get(stage) ?? [];
  waiters.forEach((resolve) => resolve());
  stageWaiters.delete(stage);
};

export const installRuntimeLifecycle = () => {
  window.__JEJU_RUNTIME_LIFECYCLE__ = {
    isReady: (stage: RuntimeStage) => readyStages.has(stage),
    markReady: (stage: RuntimeStage) => markRuntimeReady(stage),
    whenReady: (stage: RuntimeStage) => whenRuntimeReady(stage),
  };
};

export const markRuntimeReady = (stage: RuntimeStage) => {
  if (readyStages.has(stage)) {
    return;
  }

  readyStages.add(stage);
  dispatchLegacyEvent(stage);
  document.dispatchEvent(new CustomEvent("jeju:runtime-ready", { detail: { stage } }));
  resolveStageWaiters(stage);
};

export const whenRuntimeReady = (stage: RuntimeStage) => {
  if (readyStages.has(stage)) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const waiters = stageWaiters.get(stage) ?? [];
    waiters.push(resolve);
    stageWaiters.set(stage, waiters);
  });
};

declare global {
  interface Window {
    __JEJU_RUNTIME_LIFECYCLE__?: {
      isReady: (stage: RuntimeStage) => boolean;
      markReady: (stage: RuntimeStage) => void;
      whenReady: (stage: RuntimeStage) => Promise<void>;
    };
  }
}
