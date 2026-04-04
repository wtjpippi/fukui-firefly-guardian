import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { formatStatusTime, getLatestUpdate, getFormattedToday } from '../../utils/dateUtils';
import 'leaflet/dist/leaflet.css';
import './Map.css';

const { BaseLayer } = LayersControl;

const statusLabels = {
  high: { label: '乱舞中', badge: 'badge-high' },
  medium: { label: '少し見える', badge: 'badge-medium' },
  low: { label: 'まだ見えない', badge: 'badge-low' },
};

const parkingLabels = {
  normal: { label: '利用可', badge: 'badge-normal' },
  available: { label: '空きあり', badge: 'badge-high' },
  limited: { label: '残りわずか', badge: 'badge-medium' },
  full: { label: '満車', badge: 'badge-full' },
};

function createFireflyIcon(status) {
  const colors = { high: '#4ade80', medium: '#fbbf24', low: '#6b7280' };
  const color = colors[status] || colors.low;

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 16px; height: 16px;
      background: ${color};
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 8px ${color};
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function createUserIcon() {
  return L.divIcon({
    className: 'user-location-marker',
    html: `<div class="user-dot"></div><div class="user-pulse"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

function createParkingIcon(status, label) {
  const colors = { normal: '#94a3b8', available: '#4ade80', limited: '#fbbf24', full: '#ef4444' };
  const color = colors[status] || colors.normal;

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 24px; height: 24px;
      background: ${color};
      border-radius: 4px;
      border: 2px solid white;
      box-shadow: 0 0 8px ${color};
      display: flex; align-items: center; justify-content: center;
      font-size: 9px; font-weight: bold; color: #fff;
      line-height: 1;
    ">${label}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

function createVenueIcon() {
  return L.divIcon({
    className: 'custom-marker venue-marker',
    html: `<div style="
      width: 30px; height: 30px;
      background: rgba(255, 251, 235, 0.5);
      backdrop-filter: blur(2px);
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
      display: flex; align-items: center; justify-content: center;
      font-size: 16px;
    ">🏮</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function LocationPicker() {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const coords = `[${lat.toFixed(6)}, ${lng.toFixed(6)}]`;

      navigator.clipboard.writeText(coords).then(() => {
        alert(`座標をコピーしました！\n${coords}\n\nそのままチャットに貼り付けて教えてください。`);
      }).catch(err => {
        console.error('Copy failed: ', err);
        alert(`座標: ${coords}\n\n(自動コピーに失敗しました)`);
      });
    },
  });
  return null;
}

export default function MapPage() {
  const [map, setMap] = useState(null);
  const [fireflyPoints, setFireflyPoints] = useState([]);
  const [parkingLots, setParkingLots] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [shouldFollowUser, setShouldFollowUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const markerRefs = useRef({});
  const center = [37.758621, 138.831192];

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [fpRes, plRes] = await Promise.all([
        supabase.from('firefly_points').select('*').order('sort_order'),
        supabase.from('parking_lots').select('*').order('sort_order'),
      ]);
      if (fpRes.data) setFireflyPoints(fpRes.data);
      if (plRes.data) setParkingLots(plRes.data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!map) return;

    const onLocationFound = (e) => {
      setUserPosition(e.latlng);
      setIsLocating(false);
      if (shouldFollowUser) {
        map.flyTo(e.latlng, 16);
      }
    };

    const onLocationError = (e) => {
      setIsLocating(false);
      setShouldFollowUser(false);
      alert('現在地の取得に失敗しました。');
    };

    const onDragStart = () => {
      setShouldFollowUser(false);
    };

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
    map.on('dragstart', onDragStart);

    return () => {
      map.off('locationfound', onLocationFound);
      map.off('locationerror', onLocationError);
      map.off('dragstart', onDragStart);
    };
  }, [map, shouldFollowUser]);

  const handleLocateUser = () => {
    if (map) {
      setIsLocating(true);
      setShouldFollowUser(true);
      map.locate({ setView: false, watch: true, enableHighAccuracy: true });
    }
  };

  const handleJumpToLocation = (locationId, lat, lng) => {
    if (map) {
      map.flyTo([lat, lng], 16, {
        duration: 2,
        easeLinearity: 0.25
      });
      const marker = markerRefs.current[locationId];
      if (marker) {
        marker.openPopup();
      }
      const mapElement = document.querySelector('.map-container');
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const latestUpdate = getLatestUpdate(fireflyPoints.map(p => ({ ...p, lastUpdated: p.updated_at })));
  const todayLabel = getFormattedToday();

  return (
    <div className="page map-page">
      <div className="container">
        <h1 className="section-title" style={{ paddingTop: 'var(--space-xl)' }}>
          🗺️ ほたるマップ
        </h1>

        <div className="last-updated-banner">
          🔄 <strong>{todayLabel}</strong> 最終更新: {formatStatusTime(latestUpdate)} ─ ほたる保護監視員がリアルタイムで更新中
        </div>

        <div className="map-container">
          <button
            className={`locate-button ${isLocating ? 'loading' : ''} ${shouldFollowUser ? 'active' : ''}`}
            onClick={handleLocateUser}
            title={shouldFollowUser ? "追従中" : "現在地を表示"}
          >
            <Navigation
              size={20}
              fill={shouldFollowUser ? "var(--color-firefly)" : "none"}
              className={shouldFollowUser ? 'active-icon' : ''}
            />
            <span>
              {isLocating ? '取得中...' :
                shouldFollowUser ? '追従中' :
                  userPosition ? '現在地へ' : '現在地'}
            </span>
          </button>
          <MapContainer center={center} zoom={15.5} scrollWheelZoom={true} ref={setMap}>
            <LayersControl position="bottomleft">
              <BaseLayer checked name="ダーク (標準)">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
              </BaseLayer>
              <BaseLayer name="航空写真 (現地確認用)">
                <TileLayer
                  attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
              </BaseLayer>
            </LayersControl>
            {import.meta.env.DEV && <LocationPicker />}

            <Marker position={[37.758621, 138.831192]} icon={createVenueIcon()}>
              <Popup>
                <div style={{ color: '#333', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: '#f97316', fontWeight: 'bold' }}>MAIN VENUE</div>
                  <strong style={{ fontSize: '14px' }}>福井ほたる祭り 会場</strong><br />
                  <span style={{ fontSize: '12px' }}>（お祭り当日の本部・広場）</span>
                </div>
              </Popup>
            </Marker>

            {userPosition && (
              <Marker position={userPosition} icon={createUserIcon()}>
                <Popup>現在地</Popup>
              </Marker>
            )}
            {fireflyPoints.map(point => (
              <Marker
                key={point.id}
                ref={(el) => { if (el) markerRefs.current[point.id] = el; }}
                position={[point.lat, point.lng]}
                icon={createFireflyIcon(point.status)}
              >
                <Popup>
                  <div style={{ color: '#333', minWidth: '180px', padding: '4px' }}>
                    <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '8px', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>
                      {point.name}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <span className={`badge ${statusLabels[point.status]?.badge}`} style={{ padding: '2px 10px', fontSize: '11px' }}>
                        {statusLabels[point.status]?.label}
                      </span>
                    </div>
                    {point.description && (
                      <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.5', marginBottom: '8px', background: '#f9f9f9', padding: '6px', borderRadius: '4px' }}>
                        {point.description}
                      </div>
                    )}
                    <div style={{ fontSize: '10px', color: '#999', textAlign: 'right' }}>
                      更新: {formatStatusTime(point.updated_at)}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
            {parkingLots.map(lot => (
              <Marker
                key={lot.id}
                ref={(el) => { if (el) markerRefs.current[lot.id] = el; }}
                position={[lot.lat, lot.lng]}
                icon={createParkingIcon(lot.status, lot.id)}
              >
                <Popup>
                  <div style={{ color: '#333', minWidth: '160px' }}>
                    <strong>🅿️ {lot.id} {lot.name}</strong><br />
                    <span>{parkingLabels[lot.status]?.label}</span><br />
                    <small>収容台数: {lot.capacity}台 ・ {lot.walk_time}</small>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="map-legend">
          <div className="map-legend-header">
            <div className="map-legend-title">💡 マップの見方</div>
          </div>

          <div className="map-legend-content">
            <div className="map-legend-group">
              <div className="map-legend-sub">ほたるの飛翔状況 / 会場</div>
              <div className="map-legend-items">
                <div className="map-legend-item">
                  <span className="legend-dot high" /> 乱舞中
                </div>
                <div className="map-legend-item">
                  <span className="legend-dot medium" /> 少し見える
                </div>
                <div className="map-legend-item">
                  <span className="legend-dot low" /> まだ見えない
                </div>
                <div className="map-legend-item" style={{ marginLeft: '8px' }}>
                  <span style={{ fontSize: '14px' }}>🏮</span> 祭り会場
                </div>
              </div>
            </div>

            <div className="map-legend-group">
              <div className="map-legend-sub">駐車場の空き状況</div>
              <div className="map-legend-items">
                <div className="map-legend-item">
                  <span className="legend-dot normal" style={{ borderRadius: '3px', background: '#94a3b8' }} /> 利用可
                </div>
                <div className="map-legend-item">
                  <span className="live-dot" style={{ position: 'relative', top: 'auto', left: 'auto', marginRight: '4px' }} /> ライブ更新中
                </div>
              </div>
              <div className="map-legend-items" style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
                <div className="map-legend-item">
                  <span className="legend-dot available" style={{ borderRadius: '3px' }} /> 空きあり
                </div>
                <div className="map-legend-item">
                  <span className="legend-dot limited" style={{ borderRadius: '3px' }} /> 残りわずか
                </div>
                <div className="map-legend-item">
                  <span className="legend-dot full" style={{ borderRadius: '3px' }} /> 満車
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="map-section-title">✨ 飛翔ポイント</h2>
        {fireflyPoints.map(point => (
          <div key={point.id} className="glass-card point-card">
            <div className="point-info">
              <div className="point-name">
                {point.name.includes('　') ? (
                  <>
                    <span className="point-name-course">{point.name.split('　')[0]}</span>
                    <span className="point-name-sep"> </span>
                    <span className="point-name-spot">{point.name.split('　')[1]}</span>
                  </>
                ) : (
                  point.name
                )}
              </div>
            </div>
            <button
              className="jump-button"
              onClick={() => handleJumpToLocation(point.id, point.lat, point.lng)}
              title="地図で見る"
            >
              <MapPin size={14} />
              <span>地図で見る</span>
            </button>
            <div className="point-status">
              <span className={`badge ${statusLabels[point.status]?.badge}`}>
                {statusLabels[point.status]?.label}
              </span>
              <span className="point-updated">{formatStatusTime(point.updated_at)}</span>
            </div>
          </div>
        ))}

        <h2 className="map-section-title">🅿️ 駐車場（P1〜P8）</h2>
        <p className="map-section-note">※ 駐車場の空き状況は、ほたる祭り当日のみリアルタイムで更新されます。</p>
        {parkingLots.map(lot => (
          <div key={lot.id} className="glass-card parking-card">
            <div className="parking-info">
              <div className="parking-name">
                <span style={{ color: 'var(--color-firefly)', fontWeight: '700', marginRight: '6px' }}>{lot.id}</span>
                {lot.name}
              </div>
              <div className="parking-capacity">{lot.capacity}台 ・ {lot.walk_time}</div>
              {lot.hint && <div className="parking-hint">💡 {lot.hint}</div>}
            </div>
            <div className="parking-actions">
              <button
                className="jump-button parking-jump"
                onClick={() => handleJumpToLocation(lot.id, lot.lat, lot.lng)}
                title="地図で見る"
              >
                <MapPin size={14} />
                <span>地図で見る</span>
              </button>
              <span className={`badge ${parkingLabels[lot.status]?.badge}`}>
                {lot.status !== 'normal' && <span className="live-dot" />}
                {parkingLabels[lot.status]?.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
