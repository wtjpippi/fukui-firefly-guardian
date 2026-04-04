import { Phone, Mail, ExternalLink } from 'lucide-react';

export default function Contact() {
  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-2xl)' }}>
        <h1 className="section-title">📞 お問い合わせ</h1>

        <div className="glass-card" style={{ padding: 'var(--space-xl)', textAlign: 'center', marginBottom: 'var(--space-md)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>📱</div>
          <h3 style={{ marginBottom: 'var(--space-sm)' }}>お電話でのお問い合わせ</h3>
          <a
            href="tel:XXX-XXXX-XXXX"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              fontSize: 'var(--text-xl)',
              fontWeight: '700',
              color: 'var(--color-firefly)',
              marginBottom: 'var(--space-sm)',
            }}
          >
            <Phone size={20} />
            XXX-XXXX-XXXX
          </a>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            ほたる保護監視員 事務局
          </p>
        </div>

        <div className="glass-card" style={{ padding: 'var(--space-xl)', textAlign: 'center', marginBottom: 'var(--space-md)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>🏛️</div>
          <h3 style={{ marginBottom: 'var(--space-sm)' }}>福井集落開発センター</h3>
          <a
            href="tel:XXXX-XX-XXXX"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              fontSize: 'var(--text-xl)',
              fontWeight: '700',
              color: 'var(--color-firefly)',
              marginBottom: 'var(--space-sm)',
            }}
          >
            <Phone size={20} />
            XXXX-XX-XXXX
          </a>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            福井自治会
          </p>
        </div>

        <div className="glass-card" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>💬</div>
          <h3 style={{ marginBottom: 'var(--space-md)' }}>フォームでのお問い合わせ</h3>
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-lg)',
            lineHeight: '1.7',
          }}>
            取材・協賛・その他のお問い合わせは<br />
            下記のフォームよりお気軽にどうぞ
          </p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScxdHCPEZMjgXCL-Do1-RxV857a3G8bqst09o74YPU3feB6uw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow"
          >
            <ExternalLink size={16} />
            お問い合わせフォーム
          </a>
        </div>
      </div>
    </div>
  );
}
