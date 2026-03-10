let runtimePromise = null;

const getRuntime = () => {
  if (!runtimePromise) {
    const runtimeUrl = new URL("../../runtime/shell-runtime.js", import.meta.url).href;
    runtimePromise = import(runtimeUrl);
  }

  return runtimePromise;
};

export const reservationDrawer = {
  open: async () => {
    const runtime = await getRuntime();
    await runtime.openReservationDrawer();
  },
  close: async () => {
    const runtime = await getRuntime();
    runtime.closeReservationDrawer();
  }
};
