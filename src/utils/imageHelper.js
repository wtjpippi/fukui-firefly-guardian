// src/utils/imageHelper.js
// Supabase休止時でも画像が表示できるよう、ローカル保存された画像パスに変換するヘルパー

export function getReportImageUrl(url) {
  if (!url) return '';
  if (url.includes('report-images/')) {
    const fileName = url.split('report-images/').pop().split('?')[0];
    return `/images/reports/${fileName}`;
  }
  return url;
}
