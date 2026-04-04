import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import './Admin.css';

// JST日時フォーマット（例: 2026/04/04 21:30）
function formatJST(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

const statusOptions = {
  firefly: [
    { value: 'high', label: '🟢 乱舞中' },
    { value: 'medium', label: '🟡 少し見える' },
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

  // 新規レポート用
  const [newReport, setNewReport] = useState({ title: '', content: '', category: '観測', date: new Date().toISOString().split('T')[0] });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // ライトボックス用
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

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
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
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
  }, [isAuthenticated]);

  async function fetchAll() {
    const [fpRes, plRes, rRes] = await Promise.all([
      supabase.from('firefly_points').select('*').order('sort_order'),
      supabase.from('parking_lots').select('*').order('sort_order'),
      supabase.from('activity_reports').select('*').order('date', { ascending: false }),
    ]);
    if (fpRes.data) {
      setFireflyPoints(fpRes.data);
      // 詳細テキストとステータスの初期値をセット
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

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // 飛翔状況の更新（ステータスと詳細テキストをまとめて更新）
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

  // レポートの投稿
  const submitReport = async (e) => {
    e.preventDefault();
    if (!updaterName) { alert('更新者の名前を入力してください'); return; }
    if (!newReport.title || !newReport.content) { alert('タイトルと内容を入力してください'); return; }
    setSaving(true);

    let image_url = null;

    // 画像がある場合はアップロード
    if (imageFile) {
      const compressed = await compressImage(imageFile);
      const fileName = `report_${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('report-images')
        .upload(fileName, compressed, { contentType: 'image/jpeg' });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('report-images')
          .getPublicUrl(fileName);
        image_url = urlData.publicUrl;
      }
    }

    await supabase.from('activity_reports').insert({
      title: newReport.title,
      content: newReport.content,
      category: newReport.category,
      author: updaterName,
      date: newReport.date,
      image_url,
    });
    setNewReport({ title: '', content: '', category: '観測', date: new Date().toISOString().split('T')[0] });
    clearImage();
    await fetchAll();
    setSaving(false);
    showSuccess('レポートを投稿しました');
  };

  // レポートの削除
  const deleteReport = async (id) => {
    if (!confirm('このレポートを削除しますか？')) return;
    const target = reports.find(r => r.id === id);
    if (target?.image_url) {
      const fileName = target.image_url.split('/').pop();
      await supabase.storage.from('report-images').remove([fileName]);
    }
    await supabase.from('activity_reports').delete().eq('id', id);
    await fetchAll();
    showSuccess('レポートを削除しました');
  };

  const openLightbox = (url) => {
    setLightboxImage(url);
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
            <h2>活動レポートの投稿</h2>
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
                rows={3}
              />
              <div className="admin-image-upload">
                {imagePreview ? (
                  <div className="admin-image-inline-preview">
                    <img src={imagePreview} alt="プレビュー" />
                    <button type="button" className="admin-btn danger" onClick={clearImage}>✕</button>
                  </div>
                ) : (
                  <label className="admin-btn secondary">
                    📷 写真を追加
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageSelect}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>
              <button type="submit" className="admin-btn primary" disabled={saving}>
                {saving ? '投稿中...' : '投稿する'}
              </button>
            </form>

            <h3 style={{ marginTop: 'var(--space-xl)' }}>投稿済みレポート</h3>
            {reports.map((report, index) => {
              const reportYear = report.date.split('-')[0];
              const prevReportYear = index > 0 ? reports[index - 1].date.split('-')[0] : null;
              const showYearHeader = reportYear !== prevReportYear;
              const isCurrentYear = reportYear === new Date().getFullYear().toString();

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
                      {report.image_url && (
                        <img
                          src={report.image_url}
                          alt=""
                          className="admin-report-thumb"
                          onClick={() => openLightbox(report.image_url)}
                          style={{ WebkitTapHighlightColor: 'transparent' }}
                        />
                      )}
                      <p className="admin-card-content" style={{ margin: 0 }}>{report.content}</p>
                    </div>
                    <button
                      className="admin-btn danger"
                      onClick={() => deleteReport(report.id)}
                      style={{ marginTop: 'var(--space-sm)' }}
                    >
                      削除
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={[{ src: lightboxImage }]}
        plugins={[Zoom]}
        zoom={{ maxZoomPixelRatio: 1 }}
        controller={{ closeOnBackdropClick: false }}
        styles={{ 
          container: { backgroundColor: "rgba(0, 0, 0, 0.9)" } 
        }}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
      />
    </div>
  );
}
