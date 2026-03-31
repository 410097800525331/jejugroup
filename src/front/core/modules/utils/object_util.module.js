/**
 * 전역 상수와 공용 설정의 변경을 막는 유틸
 */

export const deepFreeze = (object) => {
  if (object === null || typeof object !== "object") {
    return object;
  }

  const propNames = Object.getOwnPropertyNames(object);

  for (const name of propNames) {
    const value = object[name];

    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  }

  return Object.freeze(object);
};
