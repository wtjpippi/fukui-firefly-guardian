/**
 * 日時情報を日本時間（Asia/Tokyo）基準でフォーマットするユーティリティ
 */

/**
 * ほたるの飛翔状況などの「最終更新」を分かりやすく表示する
 * @param {string|Date} dateStr ISO形式の日付文字列またはDateオブジェクト
 * @returns {string} 「今日 19:30」「昨日 20:00」「6/15 19:00」などの形式
 */
export function formatStatusTime(dateStr) {
  if (!dateStr) return '─';
  const d = new Date(dateStr);
  const now = new Date();

  // 日本時間での日付文字列（YYYY-MM-DD相当）を取得して比較
  const dLocale = d.toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' });
  const nowLocale = now.toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' });
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayLocale = yesterday.toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' });

  const timeStr = d.toLocaleTimeString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  if (dLocale === nowLocale) {
    return `今日 ${timeStr}`;
  } else if (dLocale === yesterdayLocale) {
    return `昨日 ${timeStr}`;
  } else {
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${month}/${day} ${timeStr}`;
  }
}

/**
 * 複数のアイテムの中から最新の更新日時を取得する
 * @param {Array} items lastUpdatedプロパティを持つオブジェクトの配列
 * @returns {string|null} 最新のISO日付文字列
 */
export function getLatestUpdate(items) {
  if (!items || items.length === 0) return null;
  
  const latest = items.reduce((max, item) => {
    const d = new Date(item.lastUpdated);
    if (!max || d > max) return d;
    return max;
  }, null);

  return latest ? latest.toISOString() : null;
}

/**
 * 本日の日付を「2026年4月1日(水)」のような形式で取得する
 * @returns {string} フォーマットされた日付文字列
 */
export function getFormattedToday() {
  const now = new Date();
  const options = {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  };
  return now.toLocaleDateString('ja-JP', options);
}
