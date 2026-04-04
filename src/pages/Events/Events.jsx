
import { schedule, vendors } from '../../data/mockData';
import './Events.css';

const vendorIcons = {
  food: '🍡',
  drink: '🍺',
  sake: '🍶',
  kids: '🎠',
};

export default function Events() {
  return (
    <div className="page events-page">
      <div className="container">
        <h1 className="section-title" style={{ paddingTop: 'var(--space-xl)' }}>
          🎭 イベント情報
        </h1>

        {/* Schedule */}
        <h2 className="section-title">当日のスケジュール</h2>
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
                    <span key={i} className="vendor-item-tag">{item}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Jonnobikan */}
        <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
          <h3 style={{ marginBottom: 'var(--space-md)' }}>🏛️ じょんのび館</h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.7' }}>
            ほたる祭り会場にて<br />
            <strong style={{ color: 'var(--color-firefly)' }}>貸しタオルセット</strong>と
            <strong style={{ color: 'var(--color-firefly)' }}>当日無料チケット</strong>を配布！<br />
            お祭りの後は温泉でゆっくりどうぞ
          </p>
        </div>
      </div>
    </div>
  );
}
