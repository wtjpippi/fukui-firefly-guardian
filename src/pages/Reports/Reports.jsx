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

  useEffect(() => {
    async function fetchReports() {
      setIsLoading(true);
      const { data } = await supabase
        .from('activity_reports')
        .select('*')
        .order('date', { ascending: false });
      if (data) setReports(data);
      setIsLoading(false);
    }
    fetchReports();
  }, []);

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-2xl)' }}>
        <h1 className="section-title">📣 活動レポート</h1>

        <p style={{
          textAlign: 'center',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--space-xl)',
          lineHeight: '1.7',
        }}>
          保護監視員たちが日々の活動をお届けします
        </p>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-muted)' }}>
            読み込み中...
          </div>
        ) : reports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-muted)' }}>
            レポートはまだありません
          </div>
        ) : (
          reports.map(report => (
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
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.7' }}>
                {report.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
