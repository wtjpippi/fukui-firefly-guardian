
import { schedule } from '../../data/mockData';
import { eventInfo } from '../../config/eventInfo';
import { Calendar, ZoomIn, Download } from 'lucide-react';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import './Events.css';

export default function Events() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const flyerUrl = '/images/flyer.png';

  return (
    <div className="page events-page">
      <div className="container">
        <h1 className="section-title" style={{ paddingTop: 'var(--space-xl)' }}><span className="title-emoji">🏮</span>イベント情報</h1>

        <div className="hero-event-card glass-card" style={{ marginBottom: 'var(--space-2xl)' }}>
          <div className="hero-event-info-group">
            <div className="hero-event-label">{eventInfo.year}年度 開催情報</div>
            <h2 className="hero-event-title">第{eventInfo.festivalEdition}回 福井ほたる祭り</h2>
            <div className="hero-event-date">
              <Calendar size={14} />
              {eventInfo.festivalFullDate}
            </div>
          </div>
        </div>

        {/* Poster (Flyer) */}
        <h2 className="section-title">ほたる祭り パンフレット</h2>
        <div className="flyer-container glass-card" style={{ marginBottom: 'var(--space-2xl)' }}>
          <div className="flyer-wrapper" onClick={() => setLightboxOpen(true)}>
            <img 
              src={flyerUrl} 
              alt="第32回 福井ほたる祭り チラシ" 
              className="flyer-image"
              onError={(e) => {
                // 画像読み込みエラー時のフォールバック処理（プレースホルダー）
                e.target.src = 'https://placehold.co/800x1130/1e293b/a3e635?text=%E3%83%81%E3%83%A9%E3%82%B7%E3%81%AF%E6%BA%96%E5%82%99%E4%B8%AD%E3%81%A7%E3%81%99';
              }}
            />
            <div className="flyer-overlay">
              <ZoomIn size={24} />
              <span>タップして拡大表示</span>
            </div>
          </div>
          <div className="flyer-actions">
            <a href={flyerUrl} download="第32回福井ほたる祭りチラシ.png" className="btn btn-primary download-btn">
              <Download size={16} />
              チラシをダウンロードする
            </a>
            <p className="flyer-note">
              ※出店情報（ほたる茶屋）や会場マップ、各種コーナーの詳細については上記チラシをご覧ください。
            </p>
          </div>
        </div>

        {/* Schedule */}
        <h2 className="section-title">ほたる祭り当日のスケジュール</h2>
        <div className="schedule-timeline">
          {schedule.map((item, i) => (
            <div key={i} className="schedule-item">
              <div className="schedule-time">{item.time}</div>
              <div className="schedule-title">
                <span>{item.icon}</span>
                {item.title}
              </div>
              <div className="schedule-desc">{item.description}</div>
            </div>
          ))}
        </div>

      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={[{ src: flyerUrl, alt: '第32回 福井ほたる祭り チラシ' }]}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
        carousel={{ finite: true }}
      />
    </div>
  );
}
