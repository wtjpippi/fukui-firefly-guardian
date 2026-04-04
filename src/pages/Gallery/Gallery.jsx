import { galleryData } from '../../data/mockData';

export default function Gallery() {
  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-2xl)' }}>
        <h1 className="section-title">📸 ギャラリー</h1>

        <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.7' }}>
            福井ほたる祭りの歩みを振り返ります。<br />
            30年以上にわたり、地域の皆さまとともにほたるを守り続けてきました。
          </p>
        </div>

        {galleryData.map((yearData) => (
          <div key={yearData.year} style={{ marginBottom: 'var(--space-xl)' }}>
            <div className="glass-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-2xl)',
                  fontWeight: '700',
                  color: 'var(--color-firefly)',
                }}>
                  {yearData.year}
                </span>
                <span style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-muted)',
                }}>
                  {yearData.title}
                </span>
              </div>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-md)',
                lineHeight: '1.7',
              }}>
                {yearData.description}
              </p>
              {/* Placeholder for future images */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'var(--space-sm)',
              }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{
                    aspectRatio: '1',
                    background: 'var(--color-bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--text-2xl)',
                    opacity: 0.4,
                  }}>
                    🌿
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            写真は今後追加予定です 📷
          </p>
        </div>
      </div>
    </div>
  );
}
