import { MapPin, Car, Train, Clock, Map as MapIcon, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { eventInfo } from '../../config/eventInfo';

export default function Access() {
  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-2xl)' }}>
        <h1 className="section-title">🚗 {eventInfo.festivalName} 当日のアクセス</h1>

        {/* Google Maps embed */}
        <div style={{
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
          marginBottom: 'var(--space-md)',
        }}>
          <iframe
            src="https://maps.google.com/maps?q=新潟県新潟市西蒲区福井 ほたるの里公園&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="450"
            style={{ border: 0, display: 'block' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="ほたるの里公園（お祭り会場）"
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
            <Clock size={18} style={{ color: 'var(--color-firefly)' }} />
            <h3 style={{ fontSize: 'var(--text-base)' }}>第{eventInfo.festivalEdition}回 ほたる祭り 開催日時</h3>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.7' }}>
            {eventInfo.festivalFullDate}<br />
            <strong style={{ color: 'var(--color-warm-light)', fontSize: 'var(--text-lg)' }}>{eventInfo.festivalTime}</strong><br />
            <span style={{ color: 'var(--color-text-muted)' }}>※ 小雨決行</span>
          </p>
        </div>

        <div className="glass-card" style={{ marginBottom: 'var(--space-md)', padding: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <MapPin size={18} style={{ color: 'var(--color-firefly)' }} />
            <h3 style={{ fontSize: 'var(--text-base)' }}>会場所在地</h3>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.7' }}>
            {eventInfo.venueAddress}<br />
            <strong>{eventInfo.venueName}</strong>（矢垂川沿い）
          </p>
        </div>

        <div className="glass-card" style={{ marginBottom: 'var(--space-md)', padding: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <Car size={18} style={{ color: 'var(--color-firefly)' }} />
            <h3 style={{ fontSize: 'var(--text-base)' }}>お車でお越しの方</h3>
          </div>
          <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '2' }}>
            <li>・ 北陸自動車道 <strong>巻潟東ICから約20分</strong></li>
            <li>・ <strong>会場周辺に駐車場がございます</strong>（すべて無料）</li>
            <li>
              ・ <Link to="/map" style={{ color: 'var(--color-firefly)', fontWeight: 'bold', textDecoration: 'underline' }}>
                ほたるマップで駐車場の場所・空き状況を確認
              </Link>
            </li>
          </ul>
        </div>

        <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <Train size={18} style={{ color: 'var(--color-firefly)' }} />
            <h3 style={{ fontSize: 'var(--text-base)' }}>公共交通機関</h3>
          </div>
          <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '2' }}>
            <li>・ JR越後線「巻駅」よりタクシーで約15分</li>
            <li>・ JR越後線「岩室駅」よりタクシーで約10分</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
