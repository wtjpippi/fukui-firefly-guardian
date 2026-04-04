import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const categoryColors = {
  '観測': 'badge-high',
  '準備': 'badge-medium',
  'お知らせ': 'badge-low',
  'イベント': 'badge-normal',
};

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxUrl, setLightboxUrl] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    async function fetchReports() {
      setIsLoading(true);
      const { data } = await supabase
        .from('activity_reports')
        .select('*')
        .order('date', { ascending: false });
      
      if (data) {
        setReports(data);
        // ユニークな年度を抽出して降順に並べる
        const years = [...new Set(data.map(r => r.date.split('-')[0]))].sort((a, b) => b - a);
        setAvailableYears(years);
        
        // もしデータがあるのにselectedYearがリストにない（古いデータしかない場合など）は最新年を選択
        if (years.length > 0 && !years.includes(selectedYear)) {
          setSelectedYear(years[0]);
        }
      }
      setIsLoading(false);
    }
    fetchReports();
  }, []);

  const filteredReports = reports.filter(r => r.date.startsWith(selectedYear));

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-2xl)' }}>
        <h1 className="section-title">📣 活動レポート</h1>

        {/* 年度セレクター */}
        {availableYears.length > 1 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 'var(--space-sm)', 
            marginBottom: 'var(--space-lg)',
            overflowX: 'auto',
            paddingBottom: '4px'
          }}>
            {availableYears.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  border: '1px solid var(--color-border)',
                  background: selectedYear === year ? 'var(--color-firefly)' : 'var(--color-bg-secondary)',
                  color: selectedYear === year ? 'var(--color-bg-primary)' : 'var(--color-text-primary)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                {year}年
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-muted)' }}>
            読み込み中...
          </div>
        ) : filteredReports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-muted)' }}>
            {selectedYear}年のレポートはまだありません
          </div>
        ) : (
          filteredReports.map(report => (
            <div key={report.id} className="glass-card" style={{ marginBottom: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  {report.date} ・ {report.author}
                </span>
                <span className={`badge ${categoryColors[report.category] || 'badge-low'}`}>
                  {report.category}
                </span>
              </div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '700', marginBottom: 'var(--space-sm)' }}>
                {report.title}
              </h3>
              <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start' }}>
                {report.image_url && (
                  <img
                    src={report.image_url}
                    alt=""
                    onClick={() => setLightboxUrl(report.image_url)}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      flexShrink: 0,
                      border: '1px solid var(--color-border)',
                    }}
                  />
                )}
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.7', margin: 0 }}>
                  {report.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ライトボックス */}
      {lightboxUrl && (
        <div
          onClick={() => setLightboxUrl(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            cursor: 'pointer',
          }}
        >
          <img
            src={lightboxUrl}
            alt="拡大表示"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              borderRadius: 'var(--radius-md)',
              objectFit: 'contain',
            }}
          />
        </div>
      )}
    </div>
  );
}
