import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Admin.css';

// デフォルトの Marker アイコンバグ回避用
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// 現在位置のブルーGPSアイコン
function createGpsDotIcon() {
  return L.divIcon({
    className: 'gps-dot-marker',
    html: `<div class="gps-dot-pulse"></div><div class="gps-dot-inner"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

// 散策コースを属性(通常/階段/橋)に分割する関数 (Map.jsxと同様)
const getRouteSegments = (path) => {
  if (!path || path.length < 2) return [];
  if (Array.isArray(path[0])) {
    return [{ type: 'normal', coordinates: path }];
  }
  const segments = [];
  let currentSegment = [path[0]];
  let currentType = path[0].type || 'normal';
  for (let i = 1; i < path.length; i++) {
    const point = path[i];
    const pointType = point.type || 'normal';
    if (pointType === currentType) {
      currentSegment.push(point);
    } else {
      currentSegment.push(point);
      segments.push({ type: currentType, coordinates: currentSegment.map(p => [p.lat, p.lng]) });
      currentSegment = [point];
      currentType = pointType;
    }
  }
  if (currentSegment.length > 1) {
    segments.push({ type: currentType, coordinates: currentSegment.map(p => [p.lat, p.lng]) });
  }
  return segments;
};

// 2点間の距離(メートル)を計算する簡易関数 (GPSノイズ除去用)
const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// JST日時フォーマット（例: 2026/04/04 21:30）
function formatJST(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

const statusOptions = {
  firefly: [
    { value: 'peak', label: '🟢 乱舞中' },
    { value: 'high', label: '🟡 数多い' },
    { value: 'medium', label: '🟠 飛び始め' },
    { value: 'low', label: '⚫ まだ見えない' },
  ],
  parking: [
    { value: 'normal', label: '⚫ 利用可' },
    { value: 'available', label: '🟢 空きあり' },
    { value: 'limited', label: '🟡 残りわずか' },
    { value: 'full', label: '🔴 満車' },
  ],
};

const reportCategories = ['観測', '準備', 'お知らせ', 'イベント'];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [activeTab, setActiveTab] = useState('firefly');
  const [updaterName, setUpdaterName] = useState(() => {
    return localStorage.getItem('admin_updater_name') || '';
  });
  const [fireflyPoints, setFireflyPoints] = useState([]);
  const [parkingLots, setParkingLots] = useState([]);
  const [reports, setReports] = useState([]);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // 編集中のステータスと詳細テキスト用
  const [pointStatuses, setPointStatuses] = useState({});
  const [pointDescriptions, setPointDescriptions] = useState({});

  // レポート用（新規・編集共通）
  const [newReport, setNewReport] = useState({ title: '', content: '', category: '観測', date: new Date().toISOString().split('T')[0] });
  const [imageFiles, setImageFiles] = useState([]); // Fileオブジェクトの配列
  const [imagePreviews, setImagePreviews] = useState([]); // プレビューURL（または既存URL）の配列
  const [editingReportId, setEditingReportId] = useState(null); // 編集中のレポートID

  // ライトボックス用
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // --- ルート記録用のステート ---
  const [selectedCourseId, setSelectedCourseId] = useState('donokoshi');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedPath, setRecordedPath] = useState([]);
  const [currentPathType, setCurrentPathType] = useState('normal'); // 'normal' | 'stairs' | 'bridge'
  const pathTypeRef = useRef('normal');
  const [watchId, setWatchId] = useState(null);
  const [gpsError, setGpsError] = useState('');
  const [currentGpsCoords, setCurrentGpsCoords] = useState(null);
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [dbRoutes, setDbRoutes] = useState({});
  const [mapInstance, setMapInstance] = useState(null);

  // 歩行タイプ (通常/階段/橋) のステートとRefを同期 (GPSコールバックのクロージャ対策)
  useEffect(() => {
    pathTypeRef.current = currentPathType;
  }, [currentPathType]);

  const courseOptions = [
    { id: 'donokoshi', name: '堂ノ腰コース' },
    { id: 'yuhodo', name: 'ほたる遊歩道' },
    { id: 'genpei', name: '源平橋コース' },
    { id: 'kanhotaru', name: '蛍観橋コース' }
  ];

  // 画像を自動圧縮（最大800px幅、JPEG 80%品質）
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          let width = img.width;
          let height = img.height;
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.8);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // 画像選択ハンドラ
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // 最大4枚まで
    const totalCount = imagePreviews.length + files.length;
    if (totalCount > 4) {
      alert('画像は最大4枚までです');
      return;
    }

    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];

    files.forEach(file => {
      newFiles.push(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews(prev => [...prev, ev.target.result]);
      };
      reader.readAsDataURL(file);
    });

    setImageFiles(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const clearForm = () => {
    setNewReport({ title: '', content: '', category: '観測', date: new Date().toISOString().split('T')[0] });
    setImageFiles([]);
    setImagePreviews([]);
    setEditingReportId(null);
  };

  // パスワード認証
  const handleLogin = async (e) => {
    e.preventDefault();
    const { data } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'admin_password')
      .single();

    if (data && data.value === passwordInput) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setPasswordError('');
    } else {
      setPasswordError('パスワードが正しくありません');
    }
  };

  // 更新者名の保存
  useEffect(() => {
    localStorage.setItem('admin_updater_name', updaterName);
  }, [updaterName]);

  // データの読み込み
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchAll();
    fetchRoutes();
  }, [isAuthenticated]);

  async function fetchAll() {
    const [fpRes, plRes, rRes] = await Promise.all([
      supabase.from('firefly_points').select('*').order('sort_order'),
      supabase.from('parking_lots').select('*').order('sort_order'),
      supabase.from('activity_reports').select('*').order('date', { ascending: false }),
    ]);
    if (fpRes.data) {
      setFireflyPoints(fpRes.data);
      const descs = {};
      const statuses = {};
      fpRes.data.forEach(p => {
        descs[p.id] = p.description || '';
        statuses[p.id] = p.status || 'low';
      });
      setPointDescriptions(descs);
      setPointStatuses(statuses);
    }
    if (plRes.data) setParkingLots(plRes.data);
    if (rRes.data) setReports(rRes.data);
  }

  const fetchRoutes = async () => {
    const { data } = await supabase.from('course_routes').select('*');
    if (data) {
      const routeMap = {};
      data.forEach(r => {
        routeMap[r.id] = r;
      });
      setDbRoutes(routeMap);
    }
  };

  // GPS追跡クリーンアップ
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  // GPS記録開始
  const startGpsTracking = () => {
    if (!navigator.geolocation) {
      setGpsError('このデバイスはGPSをサポートしていません');
      return;
    }
    if (!updaterName) {
      alert('記録を開始する前に、ページ上部で「更新者名」を入力してください');
      return;
    }

    setGpsError('');
    setIsRecording(true);

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCurrentGpsCoords([latitude, longitude]);
        setGpsAccuracy(accuracy);

        // 精度が30m以下のもののみ軌跡として採用（一時的な大きなブレを除去）
        if (accuracy > 30) return;

        setRecordedPath((prev) => {
          if (prev.length === 0) {
            return [{ lat: latitude, lng: longitude, type: pathTypeRef.current }];
          }
          const lastPoint = prev[prev.length - 1];
          const distance = getDistance(lastPoint.lat, lastPoint.lng, latitude, longitude);
          
          // 前回の記録地点から 2.5 メートル以上移動している場合のみ記録（ノイズ軽減）
          if (distance >= 2.5) {
            return [...prev, { lat: latitude, lng: longitude, type: pathTypeRef.current }];
          }
          return prev;
        });
      },
      (error) => {
        console.error(error);
        setGpsError(`位置情報の取得に失敗しました: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
    setWatchId(id);
  };

  // GPS記録一時停止
  const stopGpsTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsRecording(false);
  };

  // 記録のリセット
  const resetRecordedRoute = () => {
    if (confirm('記録中のデータをリセットして最初からやり直しますか？')) {
      setRecordedPath([]);
      setGpsError('');
    }
  };

  // 下書きとして一時保存
  const saveDraftRoute = async () => {
    if (recordedPath.length < 2) {
      alert('下書きとして保存するには少なくとも2箇所の地点を歩いて記録する必要があります');
      return;
    }
    if (!updaterName) { alert('更新者の名前を入力してください'); return; }
    
    setSaving(true);
    const { error } = await supabase
      .from('course_routes')
      .update({
        draft_path: recordedPath,
        updated_at: new Date().toISOString(),
        updated_by: updaterName
      })
      .eq('id', selectedCourseId);
      
    if (error) {
      alert(`下書き保存に失敗しました: ${error.message}`);
    } else {
      showSuccess('ルートを下書きとして一時保存しました（まだ本番には反映されていません）');
      await fetchRoutes();
    }
    setSaving(false);
  };

  // 本番環境に公開
  const publishRoute = async () => {
    const courseRoute = dbRoutes[selectedCourseId];
    if (!courseRoute || !courseRoute.draft_path || courseRoute.draft_path.length === 0) {
      alert('公開する下書きデータがありません。先に歩いて下書き保存を行ってください。');
      return;
    }
    if (!confirm('下書きルートを本番環境に公開し、一般ユーザーのマップに即座に反映しますか？')) {
      return;
    }
    if (!updaterName) { alert('更新者の名前を入力してください'); return; }

    setSaving(true);
    const { error } = await supabase
      .from('course_routes')
      .update({
        path: courseRoute.draft_path,
        updated_at: new Date().toISOString(),
        updated_by: updaterName
      })
      .eq('id', selectedCourseId);

    if (error) {
      alert(`公開に失敗しました: ${error.message}`);
    } else {
      showSuccess('ルートを本番環境に公開しました！');
      await fetchRoutes();
    }
    setSaving(false);
  };

  // デフォルトルートへ初期化
  const revertToDefaultRoute = async () => {
    if (!confirm('本当にこのコースのルートをリセットし、プログラムの初期設定（シンプルな点線）に戻しますか？（歩いて記録したデータは完全に削除されます）')) {
      return;
    }
    if (!updaterName) { alert('更新者の名前を入力してください'); return; }

    setSaving(true);
    const { error } = await supabase
      .from('course_routes')
      .update({
        path: null,
        draft_path: null,
        updated_at: new Date().toISOString(),
        updated_by: updaterName
      })
      .eq('id', selectedCourseId);

    if (error) {
      alert(`初期化に失敗しました: ${error.message}`);
    } else {
      showSuccess('ルートを初期状態（デフォルト）に戻しました');
      setRecordedPath([]);
      await fetchRoutes();
    }
    setSaving(false);
  };

  // 地図位置の自動追従
  useEffect(() => {
    if (mapInstance && currentGpsCoords) {
      mapInstance.setView(currentGpsCoords, mapInstance.getZoom());
    }
  }, [currentGpsCoords, mapInstance]);

  // タブ切り替え時に地図のサイズ再計算を行う (Leafletのグレーアウトバグ対策)
  useEffect(() => {
    if (activeTab === 'routes' && mapInstance) {
      setTimeout(() => {
        mapInstance.invalidateSize();
      }, 100);
    }
  }, [activeTab, mapInstance]);

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // 飛翔状況の更新
  const updateFireflyPoint = async (id) => {
    if (!updaterName) { alert('更新者の名前を入力してください'); return; }
    const status = pointStatuses[id];
    const description = pointDescriptions[id] || '';
    setSaving(true);
    await supabase
      .from('firefly_points')
      .update({ 
        status, 
        description,
        updated_at: new Date().toISOString(), 
        updated_by: updaterName 
      })
      .eq('id', id);
    await fetchAll();
    setSaving(false);
    showSuccess('飛翔状況を更新しました');
  };

  // 駐車場状況の更新
  const updateParkingStatus = async (id, newStatus) => {
    if (!updaterName) { alert('更新者の名前を入力してください'); return; }
    setSaving(true);
    await supabase
      .from('parking_lots')
      .update({ status: newStatus, updated_at: new Date().toISOString(), updated_by: updaterName })
      .eq('id', id);
    await fetchAll();
    setSaving(false);
    showSuccess('駐車場状況を更新しました');
  };

  // レポートの投稿・更新
  const submitReport = async (e) => {
    e.preventDefault();
    if (!updaterName) { alert('更新者の名前を入力してください'); return; }
    if (!newReport.title || !newReport.content) { alert('タイトルと内容を入力してください'); return; }
    setSaving(true);

    const finalImageUrls = [];

    // 既存のURL（プレビューに含まれているがFileオブジェクトではないもの）を保持
    for (const preview of imagePreviews) {
      if (typeof preview === 'string' && preview.startsWith('http')) {
        finalImageUrls.push(preview);
      }
    }

    // 新規画像をアップロード
    for (const file of imageFiles) {
      const compressed = await compressImage(file);
      const fileName = `report_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('report-images')
        .upload(fileName, compressed, { contentType: 'image/jpeg' });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('report-images')
          .getPublicUrl(fileName);
        finalImageUrls.push(urlData.publicUrl);
      }
    }

    const reportData = {
      title: newReport.title,
      content: newReport.content,
      category: newReport.category,
      author: updaterName,
      date: newReport.date,
      image_url: finalImageUrls[0] || null, // 互換性のため1枚目も保存
      image_urls: finalImageUrls,
    };

    if (editingReportId) {
      await supabase.from('activity_reports').update(reportData).eq('id', editingReportId);
      showSuccess('レポートを更新しました');
    } else {
      await supabase.from('activity_reports').insert(reportData);
      showSuccess('レポートを投稿しました');
    }

    clearForm();
    await fetchAll();
    setSaving(false);
  };

  // 編集モードへの切り替え
  const startEditReport = (report) => {
    setEditingReportId(report.id);
    setNewReport({
      title: report.title,
      content: report.content,
      category: report.category,
      date: report.date
    });
    setImageFiles([]); // 新規追加用なので空にする
    setImagePreviews(report.image_urls || (report.image_url ? [report.image_url] : []));
    setActiveTab('reports');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // レポートの削除
  const deleteReport = async (id) => {
    if (!confirm('このレポートを削除しますか？')) return;
    const target = reports.find(r => r.id === id);
    
    // ストレージからの画像削除（実運用ではURLからファイル名を抽出するのは慎重に）
    const urls = target.image_urls || (target.image_url ? [target.image_url] : []);
    for (const url of urls) {
      const fileName = url.split('/').pop();
      await supabase.storage.from('report-images').remove([fileName]);
    }

    await supabase.from('activity_reports').delete().eq('id', id);
    await fetchAll();
    showSuccess('レポートを削除しました');
  };

  const openLightbox = (images, index = 0) => {
    setLightboxImages(images.map(src => ({ src })));
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // パスワード認証画面
  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <div className="admin-login">
          <div className="admin-login-card">
            <h1>🔒 管理画面</h1>
            <p>パスワードを入力してください</p>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="パスワード"
                className="admin-input"
                autoFocus
              />
              {passwordError && <div className="admin-error">{passwordError}</div>}
              <button type="submit" className="admin-btn primary">ログイン</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1 className="admin-title">🔒 管理画面</h1>

        {successMessage && (
          <div className="admin-success">{successMessage}</div>
        )}

        {/* 更新者名 */}
        <div className="admin-updater">
          <label>更新者</label>
          <input
            type="text"
            value={updaterName}
            onChange={(e) => setUpdaterName(e.target.value)}
            placeholder="名前を入力"
            className="admin-input"
          />
        </div>

        {/* タブ切り替え */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'firefly' ? 'active' : ''}`}
            onClick={() => setActiveTab('firefly')}
          >
            ✨ 飛翔状況
          </button>
          <button
            className={`admin-tab ${activeTab === 'parking' ? 'active' : ''}`}
            onClick={() => setActiveTab('parking')}
          >
            🅿️ 駐車場
          </button>
          <button
            className={`admin-tab ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            📣 レポート
          </button>
          <button
            className={`admin-tab ${activeTab === 'routes' ? 'active' : ''}`}
            onClick={() => setActiveTab('routes')}
          >
            🗺️ ルート記録
          </button>
        </div>

        {/* 飛翔状況タブ */}
        {activeTab === 'firefly' && (
          <div className="admin-section">
            <h2>飛翔ポイントの状況更新</h2>
            {fireflyPoints.map(point => (
              <div key={point.id} className="admin-card">
                <div className="admin-card-header">
                  <strong>{point.name}</strong>
                  <span className="admin-card-meta">
                    {point.updated_by && `${point.updated_by}`}
                    {point.updated_at && ` ・ ${formatJST(point.updated_at)}`}
                  </span>
                </div>
                <div className="admin-firefly-edit-group">
                  <select
                    value={pointStatuses[point.id] || point.status}
                    onChange={(e) => setPointStatuses({ ...pointStatuses, [point.id]: e.target.value })}
                    className="admin-select"
                    disabled={saving}
                  >
                    {statusOptions.firefly.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="admin-desc-edit">
                    <input
                      type="text"
                      value={pointDescriptions[point.id] || ''}
                      onChange={(e) => setPointDescriptions({ ...pointDescriptions, [point.id]: e.target.value })}
                      placeholder="詳細（例: 昨晩は20匹ほど確認）"
                      className="admin-input desc-input"
                    />
                    <button
                      onClick={() => updateFireflyPoint(point.id)}
                      className="admin-btn secondary small"
                      disabled={saving}
                    >
                      保存
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 駐車場タブ */}
        {activeTab === 'parking' && (
          <div className="admin-section">
            <h2>駐車場の状況更新</h2>
            {parkingLots.map(lot => (
              <div key={lot.id} className="admin-card">
                <div className="admin-card-header">
                  <strong>{lot.id} {lot.name}</strong>
                  <span className="admin-card-meta">
                    {lot.updated_by && `${lot.updated_by}`}
                    {lot.updated_at && ` ・ ${formatJST(lot.updated_at)}`}
                  </span>
                </div>
                <select
                  value={lot.status}
                  onChange={(e) => updateParkingStatus(lot.id, e.target.value)}
                  className="admin-select"
                  disabled={saving}
                >
                  {statusOptions.parking.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        {/* レポートタブ */}
        {activeTab === 'reports' && (
          <div className="admin-section">
            <h2>{editingReportId ? 'レポートを編集' : '活動レポートの投稿'}</h2>
            <form onSubmit={submitReport} className="admin-report-form">
              <div className="admin-form-row">
                <div className="admin-date-row">
                  <label>日付</label>
                  <input
                    type="date"
                    value={newReport.date}
                    onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <select
                  value={newReport.category}
                  onChange={(e) => setNewReport({ ...newReport, category: e.target.value })}
                  className="admin-select"
                  style={{ flex: '0 0 auto', width: 'auto' }}
                >
                  {reportCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                value={newReport.title}
                onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                placeholder="タイトル"
                className="admin-input"
              />
              <textarea
                value={newReport.content}
                onChange={(e) => setNewReport({ ...newReport, content: e.target.value })}
                placeholder="内容を入力..."
                className="admin-textarea"
                rows={5}
              />
              <div className="admin-image-upload-multi">
                <div className="admin-previews-grid">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="admin-preview-item">
                      <img src={src} alt="プレビュー" />
                      <button type="button" className="admin-preview-remove" onClick={() => removeImage(index)}>✕</button>
                    </div>
                  ))}
                  {imagePreviews.length < 4 && (
                    <label className="admin-add-image-placeholder">
                      <span>＋ 写真を追加</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
                <p className="admin-help-text">最大4枚までアップロード可能です</p>
              </div>
              <div className="admin-form-actions">
                <button type="submit" className="admin-btn primary" disabled={saving}>
                  {saving ? '保存中...' : editingReportId ? '更新する' : '投稿する'}
                </button>
                {editingReportId && (
                  <button type="button" className="admin-btn secondary" onClick={clearForm} disabled={saving}>
                    キャンセル
                  </button>
                )}
              </div>
            </form>

            <h3 style={{ marginTop: 'var(--space-xl)' }}>投稿済みレポート</h3>
            {reports.map((report, index) => {
              const reportYear = report.date.split('-')[0];
              const prevReportYear = index > 0 ? reports[index - 1].date.split('-')[0] : null;
              const showYearHeader = reportYear !== prevReportYear;
              const isCurrentYear = reportYear === new Date().getFullYear().toString();
              const reportImages = report.image_urls || (report.image_url ? [report.image_url] : []);

              return (
                <div key={report.id}>
                  {showYearHeader && (
                    <div className="admin-year-header">
                      {reportYear}年度 {isCurrentYear && <span className="admin-current-badge">今年</span>}
                    </div>
                  )}
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <strong>{report.title}</strong>
                      <span className="admin-card-meta">{report.date} ・ {report.author}</span>
                    </div>
                    <div className="admin-report-body">
                      {reportImages.length > 0 && (
                        <div className="admin-report-thumbs-grid">
                          {reportImages.map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt=""
                              className="admin-report-thumb"
                              onClick={() => openLightbox(reportImages, i)}
                              style={{ WebkitTapHighlightColor: 'transparent' }}
                            />
                          ))}
                        </div>
                      )}
                      <p className="admin-card-content" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{report.content}</p>
                    </div>
                    <div className="admin-card-actions">
                      <button
                        className="admin-btn secondary small"
                        onClick={() => startEditReport(report)}
                      >
                        編集
                      </button>
                      <button
                        className="admin-btn danger small"
                        onClick={() => deleteReport(report.id)}
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ルート記録タブ */}
        {activeTab === 'routes' && (
          <div className="admin-section">
            <h2>🗺️ スマホGPSルートレコーダー</h2>
            <p className="admin-help-text" style={{ marginBottom: 'var(--space-md)' }}>
              実際にスマホを持って現地を歩き、散策ルートの曲線をマッピングできます。
              <strong>「通常の道」「階段」「橋」</strong> を切り替えながら記録可能です。
            </p>

            <div className="admin-card">
              {/* ① コース選択 */}
              <div className="admin-form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label>記録する対象コース</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => {
                    setSelectedCourseId(e.target.value);
                    setRecordedPath([]);
                  }}
                  className="admin-select"
                  disabled={isRecording}
                >
                  {courseOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
              </div>

              {/* ② GPSの精度とステータス表示 */}
              <div className="gps-status-panel">
                <div className="gps-status-row">
                  <span>GPS状態: </span>
                  <span className={isRecording ? 'status-active' : 'status-inactive'}>
                    {isRecording ? '🔴 記録中' : '⚪ 停止中'}
                  </span>
                </div>
                {gpsError && <div className="admin-error" style={{ marginTop: '5px' }}>{gpsError}</div>}
                {currentGpsCoords && (
                  <div className="gps-metadata" style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '5px' }}>
                    緯度: {currentGpsCoords[0].toFixed(6)} / 経度: {currentGpsCoords[1].toFixed(6)} 
                    {gpsAccuracy && ` (精度: ±${Math.round(gpsAccuracy)}m)`}
                  </div>
                )}
              </div>

              {/* ③ スマホ操作用の大きなコントロールボタン */}
              <div className="recorder-controls">
                {!isRecording ? (
                  <button onClick={startGpsTracking} className="recorder-btn start" disabled={saving}>
                    🔴 記録を開始
                  </button>
                ) : (
                  <button onClick={stopGpsTracking} className="recorder-btn stop">
                    ⏸ 記録を一時停止
                  </button>
                )}
                <button onClick={resetRecordedRoute} className="recorder-btn reset" disabled={isRecording || recordedPath.length === 0 || saving}>
                  🗑️ クリア (やり直し)
                </button>
              </div>

              {/* ④ 地面タイプ切り替え (記録中のみ有効) */}
              {isRecording && (
                <div className="type-selector-container">
                  <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '8px', color: 'var(--color-firefly)' }}>
                    👇 地面のタイプを切り替える（歩きながらタップしてください）
                  </label>
                  <div className="type-selector-buttons">
                    <button
                      type="button"
                      className={`type-btn normal ${currentPathType === 'normal' ? 'active' : ''}`}
                      onClick={() => setCurrentPathType('normal')}
                    >
                      🚶 通常の道
                    </button>
                    <button
                      type="button"
                      className={`type-btn stairs ${currentPathType === 'stairs' ? 'active' : ''}`}
                      onClick={() => setCurrentPathType('stairs')}
                    >
                      🪜 階段
                    </button>
                    <button
                      type="button"
                      className={`type-btn bridge ${currentPathType === 'bridge' ? 'active' : ''}`}
                      onClick={() => setCurrentPathType('bridge')}
                    >
                      🌉 橋
                    </button>
                  </div>
                </div>
              )}

              {/* ⑤ 記録中のプレビューマップ */}
              <div className="recorder-map-container" style={{ height: '300px', margin: 'var(--space-md) 0', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                <MapContainer
                  center={[37.758621, 138.831192]}
                  zoom={16.5}
                  style={{ height: '100%', width: '100%' }}
                  ref={setMapInstance}
                >
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community"
                    maxNativeZoom={19}
                    maxZoom={20}
                  />
                  {/* データベースに既に保存されている公開ルート (暗めの緑) */}
                  {dbRoutes[selectedCourseId]?.path && (
                    getRouteSegments(dbRoutes[selectedCourseId].path).map((seg, idx) => (
                      <Polyline
                        key={`pub-${idx}`}
                        positions={seg.coordinates}
                        pathOptions={{
                          color: '#047857',
                          weight: 2.5,
                          opacity: 0.4,
                          dashArray: seg.type === 'stairs' ? '2, 3' : seg.type === 'bridge' ? '' : '4, 4'
                        }}
                      />
                    ))
                  )}

                  {/* データベースに既に保存されている下書きルート (黄色の点線) */}
                  {dbRoutes[selectedCourseId]?.draft_path && (
                    getRouteSegments(dbRoutes[selectedCourseId].draft_path).map((seg, idx) => (
                      <Polyline
                        key={`draft-${idx}`}
                        positions={seg.coordinates}
                        pathOptions={{
                          color: '#eab308',
                          weight: 3,
                          opacity: 0.6,
                          dashArray: '3, 6'
                        }}
                      />
                    ))
                  )}

                  {/* 現在リアルタイムに記録している軌跡 (明るい蛍色 / 階段はオレンジ / 橋は太グレー) */}
                  {recordedPath.length > 0 && (
                    getRouteSegments(recordedPath).map((seg, idx) => {
                      let color = 'var(--color-firefly)';
                      let dashArray = '6, 10';
                      let weight = 3;

                      if (seg.type === 'stairs') {
                        color = '#f97316'; // オレンジ
                        dashArray = '3, 4';
                        weight = 4;
                      } else if (seg.type === 'bridge') {
                        color = '#a8a29e'; // 橋グレー
                        dashArray = ''; // 実線
                        weight = 5.5;
                      }

                      return (
                        <Polyline
                          key={`live-${idx}`}
                          positions={seg.coordinates}
                          pathOptions={{ color, weight, opacity: 0.9, dashArray }}
                        />
                      );
                    })
                  )}

                  {/* GPSの現在地マーカー */}
                  {currentGpsCoords && (
                    <Marker position={currentGpsCoords} icon={createGpsDotIcon()} />
                  )}
                </MapContainer>
              </div>

              {/* ⑥ 保存・公開制御 (プレビュー・承認フロー) */}
              <div className="route-actions-panel">
                <div style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>
                  <a 
                    href="/map?preview=true" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="preview-link"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'var(--color-firefly)',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      border: '1px solid var(--color-firefly)',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      background: 'rgba(200, 230, 78, 0.05)'
                    }}
                  >
                    🗺️ プレビュー用マップで下書きを確認する
                  </a>
                  <p className="admin-help-text" style={{ marginTop: '6px', fontSize: '11px' }}>
                    ※ 下書き保存した後、公開する前に必ず上記リンクから実際の見え方・端点スナップを確認してください。
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
                  <button
                    onClick={saveDraftRoute}
                    className="admin-btn secondary"
                    disabled={isRecording || recordedPath.length < 2 || saving}
                    style={{ flex: 1, minWidth: '140px' }}
                  >
                    💾 下書きとして保存
                  </button>
                  <button
                    onClick={publishRoute}
                    className="admin-btn primary"
                    disabled={isRecording || !dbRoutes[selectedCourseId]?.draft_path || saving}
                    style={{ flex: 1, minWidth: '140px' }}
                  >
                    🚀 本番に公開 (反映)
                  </button>
                </div>

                <div className="danger-zone" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-md)' }}>
                  <h4 style={{ color: '#ef4444', fontSize: '13px', marginBottom: '5px' }}>⚠️ 危険ゾーン</h4>
                  <button
                    onClick={revertToDefaultRoute}
                    className="admin-btn danger small"
                    disabled={isRecording || saving}
                  >
                    🔄 初期設定（既存の点線）に戻す
                  </button>
                </div>
              </div>

              {/* ⑦ 現在保存されているメタ情報の表示 */}
              <div className="route-meta-info" style={{ marginTop: 'var(--space-md)', fontSize: '11px', color: 'var(--color-text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '4px' }}>
                <div>・<strong>現在の本番データ</strong>: {dbRoutes[selectedCourseId]?.path ? '✅ 登録済み' : '❌ 未登録 (既存の点線を使用中)'}</div>
                <div>・<strong>現在の保存下書き</strong>: {dbRoutes[selectedCourseId]?.draft_path ? '✅ 下書きあり（黄色点線）' : '❌ なし'}</div>
                {dbRoutes[selectedCourseId]?.updated_at && (
                  <div style={{ marginTop: '4px' }}>
                    最終更新: {formatJST(dbRoutes[selectedCourseId].updated_at)} 
                    {dbRoutes[selectedCourseId].updated_by && ` (by ${dbRoutes[selectedCourseId].updated_by})`}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxImages}
        plugins={[Zoom]}
        zoom={{ maxZoomPixelRatio: 1 }}
        controller={{ closeOnBackdropClick: false }}
        styles={{ 
          container: { backgroundColor: "rgba(0, 0, 0, 0.9)" } 
        }}
        render={{
          buttonPrev: lightboxImages.length <= 1 ? () => null : undefined,
          buttonNext: lightboxImages.length <= 1 ? () => null : undefined,
        }}
      />
    </div>
  );
}
