import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqData } from '../../data/mockData';

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass-card" style={{
      marginBottom: 'var(--space-sm)',
      cursor: 'pointer',
      padding: 'var(--space-md) var(--space-lg)',
    }} onClick={() => setOpen(!open)}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 'var(--space-md)',
      }}>
        <span style={{ fontWeight: '500', fontSize: 'var(--text-sm)' }}>
          {question}
        </span>
        <ChevronDown
          size={18}
          style={{
            flexShrink: 0,
            transition: 'transform var(--transition-base)',
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            color: 'var(--color-text-muted)',
          }}
        />
      </div>
      {open && (
        <div style={{
          marginTop: 'var(--space-md)',
          paddingTop: 'var(--space-md)',
          borderTop: '1px solid var(--color-border)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)',
          lineHeight: '1.7',
        }}>
          {answer}
        </div>
      )}
    </div>
  );
}

export default function Faq() {
  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-2xl)' }}>
        <h1 className="section-title">❓ よくある質問</h1>

        {faqData.map((category) => (
          <div key={category.category} style={{ marginBottom: 'var(--space-xl)' }}>
            <h2 style={{
              fontSize: 'var(--text-lg)',
              fontFamily: 'var(--font-display)',
              marginBottom: 'var(--space-md)',
              color: 'var(--color-firefly)',
            }}>
              {category.category}
            </h2>
            {category.items.map((item, i) => (
              <FaqItem key={i} question={item.question} answer={item.answer} />
            ))}
          </div>
        ))}

      </div>
    </div>
  );
}
