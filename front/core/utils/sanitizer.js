/**
 * Security Protocol: XSS Sanitization Utility
 * All dynamic data rendered via innerHTML MUST be passed through sanitizeHTML.
 */

export function sanitizeHTML(str) {
    if (typeof str !== 'string') return str;
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return str.replace(/[&<>"']/g, function(m) { return map[m]; });
}

/**
 * Validates basic parameter integrity (preventing NoSQL/SQLi patterns)
 */
export function validateParam(param) {
    const invalidPatterns = /[<>'";\(\)={}]/;
    if (invalidPatterns.test(param)) {
        console.warn('Security Warning: Invalid parameter detected');
        return false;
    }
    return true;
}
