/**
 * 地理計算・ナビゲーション ユーティリティ
 */

/**
 * GoogleマップのナビゲーションURLを生成する
 * @param {number} lat 目的地の緯度
 * @param {number} lng 目的地の経度
 * @param {'driving'|'walking'} mode 移動手段
 * @returns {string} GoogleマップのURL
 */
export function getGoogleMapsNavUrl(lat, lng, mode = 'driving') {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=${mode}`;
}

/**
 * 2点間の方角（bearing）を計算する
 * @param {number} lat1 出発地の緯度
 * @param {number} lng1 出発地の経度
 * @param {number} lat2 目的地の緯度
 * @param {number} lng2 目的地の経度
 * @returns {number} 方角（0°=北、90°=東、180°=南、270°=西）
 */
export function getBearing(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;

  const dLng = toRad(lng2 - lng1);
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);

  const x = Math.sin(dLng) * Math.cos(phi2);
  const y = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLng);

  const bearing = toDeg(Math.atan2(x, y));
  return (bearing + 360) % 360; // 0〜360に正規化
}
