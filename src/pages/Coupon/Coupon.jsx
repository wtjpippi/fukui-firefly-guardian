import { Gift, ExternalLink, ClipboardList } from 'lucide-react';
import { eventInfo } from '../../config/eventInfo';

export default function Coupon() {
  const surveyUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfnwCzSj_z6DuRwRtfQiTufTSJ8QNmb9JIdl66e6uN0kYbGCw/viewform";

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-2xl)' }}>
        <h1 className="section-title">🎁 来場特典</h1>

        <div className="glass-card" style={{
          textAlign: 'center',
          padding: 'var(--space-xl)',
          marginBottom: 'var(--space-xl)',
          border: '1px solid var(--color-firefly)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          
          <div style={{
            fontSize: '3.5rem',
            marginBottom: 'var(--space-md)',
          }}>
            📋
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-xl)',
            marginBottom: 'var(--space-sm)',
            color: 'var(--color-firefly)',
          }}>
            {eventInfo.year}年度 第{eventInfo.festivalEdition}回 ほたる祭り
          </h2>

          <p style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: '700',
            marginBottom: 'var(--space-md)',
            color: 'var(--color-warm-light)',
          }}>
            アンケート実施中！
          </p>

          <div style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-xl)',
            lineHeight: '1.7',
            textAlign: 'left',
            maxWidth: '600px',
            margin: '0 auto var(--space-xl) auto'
          }}>
            <p style={{ marginBottom: '1rem', textAlign: 'center' }}>
              今後のほたる鑑賞、ほたる祭り運営の参考にさせていただきます。<br />
              入力内容はすべて匿名で守られます。
            </p>
            
            <p style={{ marginBottom: '1rem', color: 'var(--color-firefly)', fontWeight: '700', textAlign: 'center' }}>
              ☆アンケートにお答えいただいた方の中から抽選で、<br />
              「ほたるの里福井の詰め合わせセット」をお送りします。
            </p>

            <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-lg)', border: '1px dashed var(--color-border)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
              詰め合わせセットへの申し込みを希望される方は、アンケートの最後にある質問より入力をお願いします。
            </p>
          </div>

          <a 
            href={surveyUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-glow" 
            style={{ 
              display: 'inline-flex',
              textDecoration: 'none',
              padding: 'var(--space-md) var(--space-2xl)',
              fontSize: 'var(--text-lg)'
            }}
          >
            <ClipboardList size={20} style={{ marginRight: '8px' }} />
            アンケートに回答する
            <ExternalLink size={16} style={{ marginLeft: '8px', opacity: 0.8 }} />
          </a>
        </div>

        <div className="glass-card" style={{ padding: 'var(--space-lg)', borderLeft: '4px solid var(--color-firefly)' }}>
          <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Gift size={18} color="var(--color-firefly)" />
            プレゼント抽選・発送について
          </h3>
          <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.8', listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px', paddingLeft: '1.5em', textIndent: '-1.5em' }}>※ 詰め合わせセットには酒類が含まれています。</li>
            <li style={{ marginBottom: '8px', paddingLeft: '1.5em', textIndent: '-1.5em' }}>※ 20歳未満の方が当選された場合は代替品に変更させていただきます。</li>
            <li style={{ marginBottom: '8px' }}>・ 入力いただいた情報は本抽選でのみ使われます。</li>
            <li>・ 当選は発送をもって代えさせていただきます。</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
