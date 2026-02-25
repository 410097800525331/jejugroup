import { initUI } from './signup_ui.js';

/**
 * Main initialization entry point for the signup page.
 * Enforces Zero Monolith by connecting UI and State components loosely.
 */
export const initSignupLogic = () => {
  console.log('[SignUp] Initializing Immutability Architecture Modules');
  initUI();
};
