import { MapPin, Car, Train, Clock, Map as MapIcon, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { eventInfo } from '../../config/eventInfo';

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
          marginBottom: 'var(--space-md)',
        }}>
          <iframe
            src="https://www.google.com/maps?q=37.758621,138.831192&z=15&output=embed"
            width="100%"
            height="450"
            style={{ border: 0, display: 'block' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="福井農村改善センター（お祭り会場）"
          />
        </div>

        {/* Firefly Map Link Button */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <Link 
            to="/map" 
            className="btn-glow" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 'var(--space-sm)',
              padding: 'var(--space-md)',
              textDecoration: 'none',
              width: '100%'
            }}
          >
            <MapIcon size={20} />
            ほたるマップ・駐車場情報を確認
            <ExternalLink size={16} style={{ opacity: 0.7 }} />
          </Link>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: 'var(--space-xs)' }}>
            ※駐車場の位置や交通規制エリアを確認できます
          </p>
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
            {eventInfo.festivalFullDate}<br />
            <strong style={{ color: 'var(--color-warm-light)', fontSize: 'var(--text-lg)' }}>17:00 〜 21:00</strong><br />
            <span style={{ color: 'var(--color-text-muted)' }}>※ 小雨決行</span>
          </p>
        </div>
      </div>
    </div>
  );
}
