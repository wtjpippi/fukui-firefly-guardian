import { useState, useEffect } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { galleryData } from '../../data/mockData';
import { festival2026Categories, festival2026Images } from '../../data/festival2026';
import './Gallery.css';

export default function Gallery() {
  const [activeTheme, setActiveTheme] = useState(null); // null | 'festival2026' | 'recent'
  const [index, setIndex] = useState(-1);
  const [currentImages, setCurrentImages] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');

  // 近年の様子（Recent）のデータを取得
  const recentData = galleryData.find(d => d.year === 'Recent');

  // 戻るボタンなどの履歴操作を検知してLightboxを閉じる
  useEffect(() => {
    const handlePopState = (event) => {
      if (!event.state || !event.state.lightbox) {
        setIndex(-1);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const openLightbox = (images, photoIndex) => {
    setCurrentImages(images.map(img => ({ src: img.url, alt: img.alt || 'ほたるまつり写真', title: img.title || '' })));
    window.history.pushState({ lightbox: true }, '');
    setIndex(photoIndex);
  };

  const closeLightbox = () => {
    if (window.history.state && window.history.state.lightbox) {
      window.history.back();
    }
    setIndex(-1);
  };

  // 2026年の選択されたカテゴリに応じた画像フィルタリング
  const filteredImages = activeCategory === 'all'
    ? festival2026Images
    : festival2026Images.filter(img => img.category === activeCategory);

  return (
    <div className="page">
      <div className="container" style={{ paddingBottom: 'var(--space-3xl)' }}>
        
        <header className="gallery-hero">
          <h1 className="section-title"><span className="title-emoji">📸</span>ほたる祭りの風景</h1>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            30年以上にわたり受け継がれてきた福井の初夏の風物詩。<br />
            地域に愛され続けるお祭りの魅力を写真でご紹介します。
          </p>
        </header>

        {/* 1. テーマ選択画面 (初期状態) */}
        {activeTheme === null && (
          <section className="theme-selection-section">
            <h2 className="theme-selection-title">ギャラリーを選ぶ</h2>
            <div className="theme-grid">
              
              {/* カード①：第32回 福井ほたる祭り (2026年) */}
              <div className="theme-card" onClick={() => setActiveTheme('festival2026')}>
                <div className="theme-card-image-wrapper">
                  <img 
                    src="/images/gallery/2026年第32回ほたるまつり/会場風景/1.jpg" 
                    alt="第32回 福井ほたる祭り" 
                    className="theme-card-image"
                  />
                  <div className="theme-card-tag">最新</div>
                </div>
                <div className="theme-card-content">
                  <h3 className="theme-card-title">🏮 第32回 福井ほたる祭り</h3>
                  <p className="theme-card-desc">
                    令和8年6月20日に開催されたお祭り当日の様子や、お祭りを支える地元の各団体の活動風景、知事のご来訪などの記録です。
                  </p>
                  <span className="theme-card-link">写真を見る (計{festival2026Images.length}枚) →</span>
                </div>
              </div>

              {/* カード②：近年の開催の様子 */}
              {recentData && (
                <div className="theme-card" onClick={() => setActiveTheme('recent')}>
                  <div className="theme-card-image-wrapper">
                    <img 
                      src={recentData.images[0]?.url || "/images/gallery/recent/photo-1.jpg"} 
                      alt="近年の開催の様子" 
                      className="theme-card-image"
                    />
                  </div>
                  <div className="theme-card-content">
                    <h3 className="theme-card-title">🕯️ 近年の開催の様子</h3>
                    <p className="theme-card-desc">
                      お祭りの雰囲気を彩る灯籠、賑わう出店の様子、地元に伝わる神楽舞の演舞など、これまでの開催風景をまとめています。
                    </p>
                    <span className="theme-card-link">写真を見る (計{recentData.images.length}枚) →</span>
                  </div>
                </div>
              )}

            </div>
          </section>
        )}

        {/* 2. 「第32回 福井ほたる祭り」特設ギャラリー */}
        {activeTheme === 'festival2026' && (
          <section className="gallery-section">
            <div className="back-button-container">
              <button className="btn-back" onClick={() => { setActiveTheme(null); setActiveCategory('all'); }}>
                ← テーマ一覧に戻る
              </button>
            </div>

            <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
              <div style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 className="festival-title" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-firefly)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-xs)' }}>
                  🏮 第32回 福井ほたる祭り
                </h2>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                  令和8年6月20日開催。当日の会場風景やほたる観賞会、地元のお店・団体の活動などの記録です。見たいシーンのタブをタップしてご覧ください。
                </p>
              </div>

              {/* カテゴリー選択タブ */}
              <div className="category-tabs-container">
                <div className="category-tabs">
                  {festival2026Categories.map(cat => (
                    <button
                      key={cat.id}
                      className={`tab-button ${activeCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 画像グリッド */}
              {filteredImages.length > 0 ? (
                <div className="gallery-grid">
                  {filteredImages.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="gallery-item no-label"
                      onClick={() => openLightbox(filteredImages, idx)}
                    >
                      <img src={img.url} alt="ほたるまつり写真" className="gallery-image" loading="lazy" />
                      <div className="gallery-overlay">
                        <span className="zoom-icon">🔍 拡大表示</span>
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

        {/* 3. 「近年の開催の様子」ギャラリー */}
        {activeTheme === 'recent' && recentData && (
          <section className="gallery-section">
            <div className="back-button-container">
              <button className="btn-back" onClick={() => setActiveTheme(null)}>
                ← テーマ一覧に戻る
              </button>
            </div>

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
                      <img src={img.url} alt={img.alt} className="gallery-image" loading="lazy" />
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

      </div>

      <Lightbox
        index={index}
        open={index >= 0}
        close={closeLightbox}
        slides={currentImages}
      />
    </div>
  );
}
