import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import './Reports.css';

const categoryColors = {
  '観測': 'badge-high',
  '準備': 'badge-medium',
  'お知らせ': 'badge-low',
  'イベント': 'badge-normal',
};

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
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
        const years = [...new Set(data.map(r => r.date.split('-')[0]))].sort((a, b) => b - a);
        setAvailableYears(years);

        if (years.length > 0 && !years.includes(selectedYear)) {
          setSelectedYear(years[0]);
        }
      }
      setIsLoading(false);
    }
    fetchReports();
  }, []);

  // ハッシュ（#report-id）がある場合にスクロール
  useEffect(() => {
    if (!isLoading && reports.length > 0) {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace('#', '');
        const targetId = id.replace('report-', '');
        
        // 現在表示されていない（別年度の）記事か確認
        const targetReport = reports.find(r => r.id.toString() === targetId);
        if (targetReport) {
          const reportYear = targetReport.date.split('-')[0];
          if (selectedYear !== reportYear) {
            setSelectedYear(reportYear);
            return; // 年度を切り替えて再レンダリングを待つ
          }
        }

        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    }
  }, [isLoading, reports, selectedYear]);

  const filteredReports = reports.filter(r => r.date.startsWith(selectedYear));

  const openLightbox = (images, index) => {
    setLightboxImages(images.map(src => ({ src })));
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

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
          filteredReports.map(report => {
            const images = report.image_urls || (report.image_url ? [report.image_url] : []);
            return (
              <div key={report.id} id={`report-${report.id}`} className="glass-card" style={{ marginBottom: 'var(--space-md)', scrollMarginTop: '100px' }}>
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
                
                {/* 複数画像表示 */}
                {images.length > 0 && (
                  <div className="report-images-container" style={{ marginBottom: 'var(--space-md)' }}>
                    <div className={`report-images-grid grid-${Math.min(images.length, 4)}`}>
                      {images.map((url, idx) => (
                        <div key={idx} className="report-image-wrapper" onClick={() => openLightbox(images, idx)}>
                          <img src={url} alt="" loading="lazy" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p style={{ 
                  fontSize: 'var(--text-sm)', 
                  color: 'var(--color-text-secondary)', 
                  lineHeight: '1.7', 
                  margin: 0,
                  whiteSpace: 'pre-wrap' 
                }}>
                  {report.content}
                </p>
              </div>
            );
          })
        )}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxImages}
        plugins={[Zoom]}
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
