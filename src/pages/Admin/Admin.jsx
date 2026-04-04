import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './Admin.css';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [activeTab, setActiveTab] = useState('firefly');
  const [updaterName, setUpdaterName] = useState('');
  const [fireflyPoints, setFireflyPoints] = useState([]);
  const [parkingLots, setParkingLots] = useState([]);
  const [reports, setReports] = useState([]);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // 新規レポート用
  const [newReport, setNewReport] = useState({ title: '', content: '', category: '観測' });

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
      setPasswordError('');
    } else {
      setPasswordError('パスワードが正しくありません');
    }
  };

  // データの読み込み
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchAll();
  }, [isAuthenticated]);

  async function fetchAll() {
    const [fpRes, plRes, rRes] = await Promise.all([
      supabase.from('firefly_points').select('*'),
      supabase.from('parking_lots').select('*'),
      supabase.from('activity_reports').select('*').order('date', { ascending: false }),
    ]);
    if (fpRes.data) setFireflyPoints(fpRes.data);
    if (plRes.data) setParkingLots(plRes.data);
    if (rRes.data) setReports(rRes.data);
  }

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // 飛翔状況の更新
  const updateFireflyStatus = async (id, newStatus) => {
    if (!updaterName) { alert('更新者の名前を入力してください'); return; }
    setSaving(true);
    await supabase
      .from('firefly_points')
      .update({ status: newStatus, updated_at: new Date().toISOString(), updated_by: updaterName })
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
    await supabase.from('activity_reports').insert({
      title: newReport.title,
      content: newReport.content,
      category: newReport.category,
      author: updaterName,
      date: new Date().toISOString().split('T')[0],
    });
    setNewReport({ title: '', content: '', category: '観測' });
    await fetchAll();
    setSaving(false);
    showSuccess('レポートを投稿しました');
  };

  // レポートの削除
  const deleteReport = async (id) => {
    if (!confirm('このレポートを削除しますか？')) return;
    await supabase.from('activity_reports').delete().eq('id', id);
    await fetchAll();
    showSuccess('レポートを削除しました');
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
                    {point.updated_by && `${point.updated_by} が更新`}
                  </span>
                </div>
                <select
                  value={point.status}
                  onChange={(e) => updateFireflyStatus(point.id, e.target.value)}
                  className="admin-select"
                  disabled={saving}
                >
                  {statusOptions.firefly.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
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
                    {lot.updated_by && `${lot.updated_by} が更新`}
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
              <select
                value={newReport.category}
                onChange={(e) => setNewReport({ ...newReport, category: e.target.value })}
                className="admin-select"
              >
                {reportCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
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
                rows={4}
              />
              <button type="submit" className="admin-btn primary" disabled={saving}>
                {saving ? '投稿中...' : '投稿する'}
              </button>
            </form>

            <h3 style={{ marginTop: 'var(--space-xl)' }}>投稿済みレポート</h3>
            {reports.map(report => (
              <div key={report.id} className="admin-card">
                <div className="admin-card-header">
                  <strong>{report.title}</strong>
                  <span className="admin-card-meta">{report.date} ・ {report.author}</span>
                </div>
                <p className="admin-card-content">{report.content}</p>
                <button
                  className="admin-btn danger"
                  onClick={() => deleteReport(report.id)}
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
