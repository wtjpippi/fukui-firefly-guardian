import { MapPin, Car, Train, Clock } from 'lucide-react';

export default function Access() {
  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-2xl)' }}>
        <h1 className="section-title">🚗 アクセス</h1>

        {/* Google Maps embed */}
        <div style={{
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
          marginBottom: 'var(--space-xl)',
        }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12600!2d138.91!3d37.766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ1JzU3LjYiTiAxMzjCsDU0JzQ4LjAiRQ!5e0!3m2!1sja!2sjp!4v1234567890"
            width="100%"
            height="300"
            style={{ border: 0, display: 'block' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="福井ほたる祭り会場マップ"
          />
        </div>

        <div className="glass-card" style={{ marginBottom: 'var(--space-md)', padding: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <MapPin size={18} style={{ color: 'var(--color-firefly)' }} />
            <h3 style={{ fontSize: 'var(--text-base)' }}>会場所在地</h3>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.7' }}>
            新潟県新潟市西蒲区福井<br />
            矢垂川沿い
          </p>
        </div>

        <div className="glass-card" style={{ marginBottom: 'var(--space-md)', padding: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <Car size={18} style={{ color: 'var(--color-firefly)' }} />
            <h3 style={{ fontSize: 'var(--text-base)' }}>お車でお越しの方</h3>
          </div>
          <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '2' }}>
            <li>・ 北陸自動車道 巻潟東ICから約20分</li>
            <li>・ 無料駐車場あり（満車時は臨時駐車場あり）</li>
            <li>・ <span style={{ color: 'var(--color-firefly)' }}>当サイトのほたるマップで駐車場空き状況を確認できます</span></li>
          </ul>
        </div>

        <div className="glass-card" style={{ marginBottom: 'var(--space-md)', padding: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <Train size={18} style={{ color: 'var(--color-firefly)' }} />
            <h3 style={{ fontSize: 'var(--text-base)' }}>公共交通機関</h3>
          </div>
          <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '2' }}>
            <li>・ JR越後線「岩室駅」下車、タクシーで約10分</li>
            <li>・ 岩室温泉からシャトルバス運行予定</li>
          </ul>
        </div>

        <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <Clock size={18} style={{ color: 'var(--color-firefly)' }} />
            <h3 style={{ fontSize: 'var(--text-base)' }}>開催時間</h3>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.7' }}>
            令和7年 6月21日（土）<br />
            <strong style={{ color: 'var(--color-warm-light)', fontSize: 'var(--text-lg)' }}>17:00 〜 21:00</strong><br />
            <span style={{ color: 'var(--color-text-muted)' }}>※ 小雨決行</span>
          </p>
        </div>
      </div>
    </div>
  );
}
