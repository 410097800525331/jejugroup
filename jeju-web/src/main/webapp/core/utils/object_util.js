/**
 * 프레임워크 전역 상태 및 상수의 불변성을 보장하기 위한 유틸리티
 */

/**
 * 얕은 동결(Object.freeze)의 한계를 극복하고 중첩된 모든 프로퍼티를 재귀적으로 동결합니다.
 * @param {Object} object - 동결할 객체
 * @returns {Object} 완벽히 동결된 객체
 */
export const deepFreeze = (object) => {
  // 정의되지 않은 프로퍼티나 null 등에 대해서는 바로 반환
  if (object === null || typeof object !== 'object') {
    return object;
  }

  // 객체의 모든 프로퍼티 이름 추출
  const propNames = Object.getOwnPropertyNames(object);

  for (const name of propNames) {
    const value = object[name];

    // 프로퍼티가 객체이면서 아직 동결되지 않았다면 재귀 호출
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  }

  // 최상위 객체 동결
  return Object.freeze(object);
};
