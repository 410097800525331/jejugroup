import { sanitizeHTML } from '../../../core/utils/sanitizer.js';

/**
 * [Immutability Doctrine] State must never be mutated directly.
 * All updates create a new state object.
 */

const initialState = {
  currentStep: 1,
  maxStep: 4, // Changed from 5 to 4
  terms: {
    service: false,
    privacy: false,
    marketing: false
  },
  verification: {
    isVerified: false,
    method: null,
    name: '',
    phone: '',
    gender: ''
  },
  account: {
    userId: '',
    isIdAvailable: false,
    password: ''
  }
};

let _state = { ...initialState };
const listeners = [];

export const getState = () => ({ ..._state });

export const updateState = (updater) => {
  const nextState = updater({ ..._state });
  _state = Object.freeze(nextState);
  notifyListeners();
};

export const subscribe = (listener) => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
};

const notifyListeners = () => {
  const currentState = getState();
  listeners.forEach(listener => listener(currentState));
};

// State update helpers (Domain specific)
export const nextStepAction = () => {
  updateState(state => {
    if (state.currentStep < state.maxStep) {
      return { ...state, currentStep: state.currentStep + 1 };
    }
    return state;
  });
};

export const jumpToStepAction = (stepIndex) => {
  updateState(state => {
    if (stepIndex >= 1 && stepIndex <= state.maxStep) {
      return { ...state, currentStep: stepIndex };
    }
    return state;
  });
};

export const prevStepAction = () => {
  updateState(state => {
    if (state.currentStep > 1) {
      return { ...state, currentStep: state.currentStep - 1 };
    }
    return state;
  });
};

export const updateTermsAction = (termsData) => {
  updateState(state => ({
    ...state,
    terms: { ...state.terms, ...termsData }
  }));
};

export const setVerificationSuccessAction = (data) => {
  updateState(state => ({
    ...state,
    verification: {
      isVerified: true,
      method: sanitizeHTML(data.method),
      name: sanitizeHTML(data.name),
      phone: sanitizeHTML(data.phone),
      gender: sanitizeHTML(data.gender)
    }
  }));
};

export const setUsernameCheckAction = (userId, isAvailable) => {
  updateState(state => ({
    ...state,
    account: {
      ...state.account,
      userId: sanitizeHTML(userId),
      isIdAvailable: isAvailable
    }
  }));
};

export const setAccountDataAction = (data) => {
  updateState(state => ({
    ...state,
    account: {
      ...state.account,
      password: sanitizeHTML(data.password)
    }
  }));
};
