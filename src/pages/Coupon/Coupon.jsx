import { Gift, ExternalLink, ClipboardList } from 'lucide-react';
import { eventInfo } from '../../config/eventInfo';

export default function Coupon() {
  const benefit = eventInfo.benefit || {};

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-2xl)' }}>
        <h1 className="section-title"><span className="title-emoji">🎁</span>来場特典</h1>

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
            {benefit.type === 'survey' ? '📋' : '🎟️'}
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-xl)',
            marginBottom: 'var(--space-sm)',
            color: 'var(--color-firefly)',
          }}>
            {eventInfo.year}年度 第{eventInfo.festivalEdition}回 {eventInfo.festivalName}
          </h2>

          <p style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: '700',
            marginBottom: 'var(--space-md)',
            color: 'var(--color-warm-light)',
          }}>
            {benefit.title}
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
            {benefit.description && (
              <p style={{ marginBottom: '1rem', textAlign: 'center', whiteSpace: 'pre-line' }}>
                {benefit.description}
              </p>
            )}
            
            {benefit.presentText && (
              <p style={{ marginBottom: '1rem', color: 'var(--color-firefly)', fontWeight: '700', textAlign: 'center', whiteSpace: 'pre-line' }}>
                {benefit.presentText}
              </p>
            )}

            {benefit.presentSubText && (
              <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-lg)', border: '1px dashed var(--color-border)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                {benefit.presentSubText}
              </p>
            )}
          </div>

          {benefit.surveyUrl && (
            <a 
              href={benefit.surveyUrl} 
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
              {benefit.type === 'survey' ? 'アンケートに回答する' : '特典を受け取る'}
              <ExternalLink size={16} style={{ marginLeft: '8px', opacity: 0.8 }} />
            </a>
          )}
        </div>

        {benefit.notes && benefit.notes.length > 0 && (
          <div className="glass-card" style={{ padding: 'var(--space-lg)', borderLeft: '4px solid var(--color-firefly)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Gift size={18} color="var(--color-firefly)" />
              プレゼント抽選・発送について
            </h3>
            <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.8', listStyle: 'none', padding: 0 }}>
              {benefit.notes.map((note, index) => (
                <li 
                  key={index} 
                  style={{ 
                    marginBottom: '8px', 
                    paddingLeft: note.startsWith('※') || note.startsWith('・') ? '1.5em' : '0', 
                    textIndent: note.startsWith('※') || note.startsWith('・') ? '-1.5em' : '0' 
                  }}
                >
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
