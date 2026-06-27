import { useState, useEffect } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import './LocalGuide.css';
import { Map, Store, Trees, Camera, Coffee, Instagram, ExternalLink, Building2, Wheat, Bath, Target, Landmark, HelpCircle } from 'lucide-react';

export default function LocalGuide() {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [imageErrors, setImageErrors] = useState({}); // 画像読み込みエラー検知用

  // 戻るボタンなどの履歴操作を検知してLightboxを閉じる
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash !== '#shop-gallery') {
        setLightboxIndex(-1);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const openProductLightbox = (images) => {
    setLightboxImages(images.map(img => ({ src: img, alt: '商品写真' })));
    window.location.hash = 'shop-gallery';
    setLightboxIndex(0);
  };

  const closeProductLightbox = () => {
    if (window.location.hash === '#shop-gallery') {
      window.history.back();
    }
    setLightboxIndex(-1);
  };

  const shops = [
    {
      id: 'ameya',
      title: '尚古堂 あめ屋',
      icon: <Store size={20} />,
      description: '1817年（文化14年）創業、良寛（りょうかん）さまが名付け親と伝えられる歴史ある菓子店。「福ほたる饅頭」は、ほたる観賞のお土産として長く愛されています。',
      tags: ['1817年創業', '福ほたる饅頭'],
      headerImage: '/images/shops/ameya/header.jpg',
      productImages: [
        '/images/shops/ameya/products/1.jpg',
        '/images/shops/ameya/products/2.jpg',
        '/images/shops/ameya/products/3.jpg'
      ],
    },
    {
      id: 'honmaya',
      title: '本間屋',
      icon: <Coffee size={20} />,
      description: '江戸時代から 180 年続く柚餅子（ゆべし）の専門店。時の長岡藩主や 14 代将軍・徳川家茂にも献上された、唯一無二の伝統の味を守り続けています。',
      tags: ['将軍家献上', '柚餅子'],
      instagram: 'https://www.instagram.com/honmaya1845/?hl=ja',
      headerImage: '/images/shops/honmaya/header.jpg',
      productImages: [
        '/images/shops/honmaya/products/1.jpg'
      ],
    },
    {
      id: 'honmatatami',
      title: '本間畳店',
      icon: <Store size={20} />,
      description: '地元に根ざし、丁寧な手仕事で日本の伝統である畳造りを守り続けています。畳の表替えや新調など、お客様の和の暮らしに寄り添った施工をお届けします。',
      tags: ['畳専門店', '丁寧な手仕事'],
      headerImage: '/images/shops/honmatatami/header.jpg',
      productImages: [
        '/images/shops/honmatatami/products/1.jpg',
        '/images/shops/honmatatami/products/2.jpg',
        '/images/shops/honmatatami/products/3.jpg'
      ],
    }
  ];

  const spots = [
    {
      id: 'yatari',
      title: '矢垂川（やたれがわ）',
      icon: <Trees size={20} />,
      description: 'ほたる観賞のメインスポット。清流のせせらぎと共に幻想的な光を楽しめます。',
    },
    {
      id: 'kakuda',
      title: '角田山 登山道',
      icon: <Camera size={20} />,
      description: '四季折々の花々を楽しめる人気の登山道。集落のすぐ裏手から山頂を目指せます。',
    },
    {
      id: 'satoke',
      title: '旧庄屋 佐藤家',
      icon: <Building2 size={20} />,
      description: '築250年以上の歴史を誇る、江戸時代後期の庄屋の古民家。かつては三根山藩主の本陣としても利用され、現在は地域の文化・イベントの拠点として親しまれています。',
      link: 'https://syoyasatoke.localinfo.jp/'
    },
    {
      id: 'yamadani',
      title: '山谷古墳（やまやこふん）',
      icon: <Landmark size={20} />,
      description: '4世紀中頃に築造された全長37mの前方後方墳。市指定史跡であり、出土品は有形文化財にも指定されています。福井神社近くから徒歩で登ることができます。',
    }
  ];

  const facilities = [
    {
      id: 'shooting',
      title: '巻射撃場',
      icon: <Target size={20} />,
      description: '日本クレー射撃協会A級公認 of トラップ射面2面とスキート射面2面を備える射撃場。日本一美しい射撃場造りを目指し、快適な射撃空間を提供しています。',
      link: 'https://makishagekijou.opal.ne.jp/'
    },
    {
      id: 'ryoyukai-rifle',
      title: '新潟県猟友会ライフル射撃場',
      icon: <Target size={20} />,
      description: '福井地区に新設された大口径ライフル対応の射撃場。新潟県猟友会により整備・運営され、狩猟者の射撃技術向上や教習・安全対策の訓練拠点となっています。',
    },
    {
      id: 'jonnobi',
      title: 'サウナと天然温泉 じょんのび館',
      icon: <Bath size={20} />,
      description: '『温まりの湯』『美肌の湯』を楽しめる天然温泉。趣の異なる二つの湯殿でゆったりと湯に浸かり、心ゆくまで「じょんのび」したひとときを過ごせます。',
      link: 'https://www.jonnobi.com/'
    },
    {
      id: 'shirame',
      title: '峰乃白梅酒造',
      icon: <Wheat size={20} />,
      description: '角田山の麓で約400年の歴史を持つ蔵元。「越後の三梅」の一つとして知られ、現在は芳醇旨口を軸とした新しい日本酒造りに挑戦し続けています。',
      link: 'https://minenohakubai.com/'
    }
  ];

  return (
    <div className="page local-guide-page">
      <div className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-3xl)' }}>
        <h1 className="section-title"><span className="title-emoji">🏞️</span>地域紹介</h1>
        <p className="guide-intro">
          新潟市西蒲区福井地区。ここは、ほたるが舞う清流と、古き良き日本の営みが息づく場所です。<br />
          周辺の魅力的な施設や史跡をご紹介します。
        </p>

        <div className="guide-grid">
          {/* Main Overview */}
          <section className="guide-section main-overview glass-card">
            <div className="guide-card-header">
              <div className="guide-icon-box"><Map size={24} /></div>
              <h2>福井集落の概要</h2>
            </div>
            <p className="guide-text">
              新潟市西蒲区の角田山麓に位置する、豊かな自然に囲まれた静かな集落です。
              万葉の昔から歌に詠まれるなど歴史も古く、ほたるの里としての景観を大切に守り続けています。
            </p>
          </section>

          {/* Shops Section */}
          <section className="guide-section">
            <h3 className="sub-title">🏠 地元のお店</h3>
            <div className="shops-grid">
              {shops.map(shop => {
                const headerErrorKey = `${shop.id}-header`;
                const hasHeaderImage = !!shop.headerImage && !imageErrors[headerErrorKey];
                return (
                  <div key={shop.id} className="guide-card shop-card glass-card">
                    {/* ヘッダー画像エリア */}
                    <div className="shop-card-image-wrapper">
                      {hasHeaderImage ? (
                        <img 
                          src={shop.headerImage} 
                          alt={shop.title} 
                          className="shop-card-image" 
                          onError={() => setImageErrors(prev => ({ ...prev, [headerErrorKey]: true }))}
                        />
                      ) : (
                        <div className="shop-card-no-image">
                          <Camera size={22} className="placeholder-icon" />
                          <span>店舗写真 準備中</span>
                        </div>
                      )}
                    </div>

                    <div className="shop-card-body-content">
                      <div className="guide-card-header">
                        <div className="guide-icon-box">{shop.icon}</div>
                        <h3>{shop.title}</h3>
                      </div>
                      <p className="guide-text">{shop.description}</p>
                      
                      <div className="guide-tags">
                        {shop.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
                      </div>

                      {/* 商品写真閲覧ボタン */}
                      <div className="product-btn-container">
                        {shop.productImages && shop.productImages.length > 0 ? (
                          <button 
                            className="btn-glow product-btn" 
                            onClick={() => openProductLightbox(shop.productImages)}
                          >
                            📸 写真で見る (計{shop.productImages.length}枚)
                          </button>
                        ) : (
                          <button className="product-btn disabled" disabled>
                            📸 写真 準備中
                          </button>
                        )}
                      </div>

                      <div className="card-links">
                        {shop.instagram && (
                          <a href={shop.instagram} target="_blank" rel="noopener noreferrer" className="card-link">
                            <Instagram size={14} /> Instagram
                          </a>
                        )}
                        {shop.link && (
                          <a href={shop.link} target="_blank" rel="noopener noreferrer" className="card-link">
                            <ExternalLink size={14} /> 公式サイト
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Spots Section */}
          <section className="guide-section">
            <h3 className="sub-title">📍 スポット・史跡</h3>
            <div className="spots-grid">
              {spots.map(item => (
                <div key={item.id} className="spot-item glass-card">
                  <div className="spot-icon">{item.icon}</div>
                  <div className="spot-content">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="card-link mt-sm">
                        <ExternalLink size={12} /> 公式サイト
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Facilities Section */}
          <section className="guide-section">
            <h3 className="sub-title">🏢 周辺施設</h3>
            <div className="shops-grid"> {/* 使い回して横並びに */}
              {facilities.map(facility => (
                <div key={facility.id} className="guide-card glass-card">
                  <div className="guide-card-header">
                    <div className="guide-icon-box">{facility.icon}</div>
                    <h3>{facility.title}</h3>
                  </div>
                  <p className="guide-text">{facility.description}</p>
                  {facility.link && (
                    <div className="card-links">
                      <a href={facility.link} target="_blank" rel="noopener noreferrer" className="card-link">
                        <ExternalLink size={14} /> 公式サイト
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Sponsors Section */}
          <section className="guide-section">
            <h3 className="sub-title">🤝 スポンサー</h3>
            <div className="placeholder-frame glass-card">
              <HelpCircle size={32} className="placeholder-icon" />
              <p>当活動を支えてくださるスポンサー様を募集しております。</p>
              <p style={{ fontSize: '10px', marginTop: '8px' }}>詳細は事務局までお問い合わせください。</p>
            </div>
          </section>
        </div>
      </div>

      <Lightbox
        index={lightboxIndex}
        open={lightboxIndex >= 0}
        close={closeProductLightbox}
        slides={lightboxImages}
      />
    </div>
  );
}
