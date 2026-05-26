import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { galleryData } from '../../data/mockData';
import './Gallery.css';

export default function Gallery() {
  const [index, setIndex] = useState(-1);
  const [currentImages, setCurrentImages] = useState([]);

  // 最新年度（Recent）とそれ以外（Archive）に分ける
  const recentData = galleryData.find(d => d.year === 'Recent');
  const archiveData = galleryData.filter(d => d.year !== 'Recent');

  const openLightbox = (images, photoIndex) => {
    setCurrentImages(images.map(img => ({ src: img.url, alt: img.alt, title: img.title })));
    setIndex(photoIndex);
  };

  return (
    <div className="page">
      <div className="container" style={{ paddingBottom: 'var(--space-3xl)' }}>
        
        <header className="gallery-hero">
          <h1 className="section-title"><span className="title-emoji">📸</span>ほたる祭りの風景</h1>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            30年以上にわたり受け継がれてきた福井の初夏の風物詩。<br />
            地域に愛され続けるお祭りの魅力と歩みを、写真で振り返ります。
          </p>
        </header>

        {/* Latest / Featured Section */}
        {recentData && (
          <section style={{ marginBottom: 'var(--space-3xl)' }}>
            <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
              <div style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-firefly)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-xs)' }}>
                  {recentData.title}
                </h2>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                  {recentData.description}
                </p>
              </div>

              {recentData.images.length > 0 ? (
                <div className="gallery-grid">
                  {recentData.images.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="gallery-item"
                      onClick={() => openLightbox(recentData.images, idx)}
                    >
                      <img src={img.url} alt={img.alt} className="gallery-image" />
                      {/* PC用ホバーオーバーレイ */}
                      <div className="gallery-overlay pc-only">
                        <span className="gallery-item-title">{img.title}</span>
                      </div>
                      {/* モバイル用常時表示ラベル */}
                      <div className="gallery-mobile-label mobile-only">
                        {img.title}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="placeholder-gallery">
                  <span style={{ fontSize: '3rem' }}>📷</span>
                  <p>写真は準備中です。お楽しみに！</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Archive Section */}
        {archiveData.length > 0 && (
          <section className="archive-section">
            <h2 className="archive-title">🕯️ 過去の歩み</h2>
            <div className="archive-grid">
              {archiveData.map((yearData) => (
                <div key={yearData.year} className="glass-card archive-card">
                  <div className="archive-year">{yearData.year}</div>
                  <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-sm)' }}>{yearData.title}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: 'var(--space-md)' }}>
                    {yearData.description}
                  </p>
                  {yearData.images.length > 0 ? (
                    <button 
                      className="btn-glow" 
                      style={{ fontSize: 'var(--text-xs)', padding: '6px 12px' }}
                      onClick={() => openLightbox(yearData.images, 0)}
                    >
                      写真を見る
                    </button>
                  ) : (
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      写真は今後追加予定です
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div> {/* containerの閉じタグ */}

      <Lightbox
        index={index}
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={currentImages}
      />
    </div> // pageの閉じタグ
  );
}
