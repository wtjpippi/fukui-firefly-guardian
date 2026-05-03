
import { schedule, vendors } from '../../data/mockData';
import { eventInfo } from '../../config/eventInfo';
import { Calendar } from 'lucide-react';
import './Events.css';

const vendorIcons = {
  food: '🏮',
  sweets: '🍡',
  drink: '🍺',
  sake: '🍶',
  kids: '🎠',
  sauna: '♨️',
};

export default function Events() {
  return (
    <div className="page events-page">
      <div className="container">
        <h1 className="section-title" style={{ paddingTop: 'var(--space-xl)' }}>
          🎭 イベント情報
        </h1>

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

        {/* Vendors */}
        <h2 className="section-title" style={{ marginTop: 'var(--space-2xl)' }}>出店情報</h2>
        <div className="vendor-grid">
          {vendors.map(v => (
            <div key={v.id} className="glass-card vendor-card">
              <div className="vendor-icon">{vendorIcons[v.type] || '🏪'}</div>
              <div className="vendor-info">
                <div className="vendor-name">{v.name}</div>
                <div className="vendor-location">{v.location}</div>
                {v.description && (
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-sm)' }}>
                    {v.description}
                  </div>
                )}
                <div className="vendor-items">
                  {v.items.map((item, i) => (
                    item === 'BR' ? (
                      <div key={i} style={{ flexBasis: '100%', height: 0, margin: 0 }}></div>
                    ) : item === 'ほか' ? (
                      <span key={i} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', alignSelf: 'center', marginLeft: '2px' }}>ほか</span>
                    ) : (
                      <span key={i} className="vendor-item-tag">{item}</span>
                    )
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
