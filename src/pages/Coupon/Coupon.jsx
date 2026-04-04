import { useState } from 'react';
import { Gift, Check } from 'lucide-react';

export default function Coupon() {
  const [used, setUsed] = useState(false);

  const handleUse = () => {
    if (window.confirm('このクーポンを使用しますか？\n※一度使用すると再利用できません')) {
      setUsed(true);
      localStorage.setItem('hotaru-coupon-used', 'true');
    }
  };

  // Check localStorage on initial load
  useState(() => {
    if (localStorage.getItem('hotaru-coupon-used') === 'true') {
      setUsed(true);
    }
  });

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-2xl)' }}>
        <h1 className="section-title">🎟️ 来場特典</h1>

        <div className="glass-card" style={{
          textAlign: 'center',
          padding: 'var(--space-xl)',
          marginBottom: 'var(--space-xl)',
          border: used ? '1px solid var(--color-text-muted)' : '1px solid var(--color-firefly)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {used && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-15deg)',
              fontSize: 'var(--text-4xl)',
              fontWeight: '700',
              color: 'rgba(239, 68, 68, 0.3)',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}>
              使 用 済 み
            </div>
          )}

          <div style={{
            fontSize: '3rem',
            marginBottom: 'var(--space-md)',
            opacity: used ? 0.4 : 1,
          }}>
            🎁
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-xl)',
            marginBottom: 'var(--space-sm)',
            color: used ? 'var(--color-text-muted)' : 'var(--color-firefly)',
          }}>
            ほたる祭り来場記念
          </h2>

          <p style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: '700',
            marginBottom: 'var(--space-md)',
            color: used ? 'var(--color-text-muted)' : 'var(--color-warm-light)',
          }}>
            ほたる茶屋 ドリンク1杯サービス
          </p>

          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--space-lg)',
            lineHeight: '1.7',
          }}>
            ※ お一人様1回限り有効<br />
            ※ 2025年6月21日のみ使用可能<br />
            ※ スタッフに画面を提示してください
          </p>

          {!used ? (
            <button className="btn-glow" onClick={handleUse} style={{ padding: 'var(--space-md) var(--space-xl)' }}>
              <Gift size={18} />
              クーポンを使用する
            </button>
          ) : (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              padding: 'var(--space-md) var(--space-xl)',
              background: 'rgba(107, 114, 128, 0.2)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--color-text-muted)',
              fontWeight: '700',
            }}>
              <Check size={18} />
              使用済み
            </div>
          )}
        </div>

        <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-md)' }}>📌 ご利用にあたって</h3>
          <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '2' }}>
            <li>・ 本クーポンは福井ほたる祭り会場内でのみご利用いただけます</li>
            <li>・ お一人様1回限り有効です</li>
            <li>・ 他のクーポン・割引との併用はできません</li>
            <li>・ スタッフに使用済み画面を確認してもらってください</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
