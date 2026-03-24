/**
 * XSS 방지용 기본 sanitize 유틸
 */

export function sanitizeHTML(str) {
  if (typeof str !== "string") {
    return str;
  }

  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return str.replace(/[&<>"']/g, (matched) => map[matched]);
}

/**
 * 파라미터 기본 무결성 검사
 */
export function validateParam(param) {
  const invalidPatterns = /[<>'";\(\)={}]/;

  if (invalidPatterns.test(param)) {
    console.warn("Security Warning: Invalid parameter detected");
    return false;
  }

  return true;
}
