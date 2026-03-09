/* 마이페이지 공용 포맷 유틸 */
const numberFormatter = new Intl.NumberFormat('ko-KR');

export const formatNumber = (value) => numberFormatter.format(Number.isFinite(Number(value)) ? Number(value) : 0);
export const formatCurrency = (value) => `${formatNumber(value)}원`;
export const formatPoints = (value) => `${formatNumber(value)}P`;

export const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

export const resolveToneClass = (tone) => ({
  ready: 'tone-ready',
  live: 'tone-live',
  done: 'tone-done'
}[tone] || 'tone-ready');
