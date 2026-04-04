import './LocalGuide.css';
import { Map, Store, Trees, Camera, ArrowRight, Heart, Info, Coffee, Instagram, ExternalLink } from 'lucide-react';

export default function LocalGuide() {
  const spots = [
    {
      id: 'fukui',
      title: '福井集落の概要',
      icon: <Map size={24} />,
      description: '新潟市西蒲区の角田山麓に位置する、豊かな自然に囲まれた静かな集落です。万葉の昔から歌に詠まれるなど歴史も古く、ほたるの里としての景観を大切に守り続けています。',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&q=80&w=800', // イメージ画像
    },
    {
      id: 'ameya',
      title: '尚古堂 あめ屋',
      icon: <Store size={24} />,
      description: '1817年（文化14年）創業、良寛（りょうかん）さまが名付け親と伝えられる歴史ある菓子店。「福ほたる饅頭」は、ほたる観賞のお土産として長く愛されています。名僧ゆかりの地で、江戸の情緒を感じるひとときを。',
      tags: ['1817年創業', '良寛さまゆかり', '福ほたる饅頭'],
    },
    {
      id: 'honmaya',
      title: '本間屋',
      icon: <Coffee size={24} />,
      description: '江戸時代から 180 年続く柚餅子（ゆべし）の専門店。時の長岡藩主や 14 代将軍・徳川家茂にも献上された、唯一無二の伝統の味を守り続けています。京都の僧侶から伝授されたという秘伝の製法が特徴です。',
      tags: ['将軍家献上', '柚餅子', '180 年の伝統'],
      instagram: 'https://www.instagram.com/honmaya1845/?hl=ja'
    },
    {
      id: 'yatari',
      title: '矢垂川（やたれがわ）',
      icon: <Trees size={24} />,
      description: '集落を流れる清流。ほたる観賞のメインスポットであり、初夏には数多くのゲンジボタルが舞い、幻想的な光景を作り出します。',
    }
  ];

  return (
    <div className="page local-guide-page">
      <div className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-3xl)' }}>
        <h1 className="section-title">🏞️ 地域紹介</h1>
        <p className="guide-intro">
          新潟市西蒲区福井地区。ここは、ほたるが舞う清流と、古き良き日本の営みが息づく場所です。
          ほたる観賞と合わせて、ぜひゆっくりと集落を巡ってみてください。
        </p>

        <div className="guide-grid">
          {/* Main Overview */}
          <div className="guide-card main-overview glass-card">
            <div className="guide-card-header">
              <div className="guide-icon-box">{spots[0].icon}</div>
              <h2>{spots[0].title}</h2>
            </div>
            <p className="guide-text">{spots[0].description}</p>
          </div>

          {/* Shop Row */}
          <div className="shops-container">
            <h3 className="sub-title">🏠 地元のお店</h3>
            <div className="shops-grid">
              <div className="guide-card shop-card glass-card" id="ameya">
                <div className="guide-card-header">
                  <div className="guide-icon-box"><Store size={20} /></div>
                  <h3>あめ屋</h3>
                </div>
                <p className="guide-text">{spots[1].description}</p>
                <div className="guide-tags">
                  {spots[1].tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
                </div>
              </div>

              <div className="guide-card shop-card glass-card" id="honmaya">
                <div className="guide-card-header">
                  <div className="guide-icon-box"><Coffee size={20} /></div>
                  <h3>本間屋</h3>
                </div>
                <p className="guide-text">{spots[2].description}</p>
                <div className="guide-tags">
                  {spots[2].tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
                </div>
                {spots[2].instagram && (
                  <a href={spots[2].instagram} target="_blank" rel="noopener noreferrer" className="shop-link instagram">
                    <Instagram size={16} /> Instagramを見る
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Spots Row */}
          <div className="other-spots-container">
              <h3 className="sub-title">📍 周辺スポット</h3>
              <div className="spots-list">
                <div className="spot-item glass-card">
                   <div className="spot-icon"><Trees size={20} /></div>
                   <div className="spot-content">
                     <h4>矢垂川（やたれがわ）</h4>
                     <p>ほたる観賞の聖地。清らかな水の流れと静寂が楽しめます。</p>
                   </div>
                </div>
                <div className="spot-item glass-card">
                   <div className="spot-icon"><Camera size={20} /></div>
                   <div className="spot-content">
                     <h4>角田山 登山道</h4>
                     <p>集落の背後にそびえる山の入り口。豊かな植生が魅力です。</p>
                   </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
