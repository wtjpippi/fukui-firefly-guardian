import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Footprints, LightbulbOff, CameraOff, Heart, Trees, Info, Sparkles, ExternalLink } from 'lucide-react';
import { reports } from '../../data/mockData';
import './Home.css';

export default function Home() {

  const quickLinks = [
    { path: '/map', icon: '🗺️', title: 'ほたるマップ', desc: 'リアルタイム飛翔状況' },
    { path: '/events', icon: '🎭', title: 'イベント', desc: '出店・神楽舞情報' },
    { path: '/events#reservation', icon: '📝', title: '鑑賞会予約', desc: 'ガイド付き鑑賞会' },
    { path: '/gallery', icon: '📸', title: 'ギャラリー', desc: '歴史と思い出' },
    { path: '/local-guide', icon: '🏞️', title: '地域紹介', desc: '福井の魅力と銘店' },
    { path: '/reports', icon: '📑', title: '活動レポート', desc: '保護活動の記録' },
    { path: '/coupon', icon: '🎟️', title: '来場特典', desc: 'お得なクーポン' },
    { path: '/faq', icon: '❓', title: 'FAQ', desc: 'よくある質問' },
    { path: '/access', icon: '🚗', title: 'アクセス', desc: '駐車場・交通案内' },
    { path: '/contact', icon: '✉️', title: 'お問い合わせ', desc: 'ご意見・ご質問' },
  ];

  const latestReports = reports.slice(-3).reverse();

  return (
    <div className="page">
      {/* Hero Section - Split Layout (Refined) */}
      <section className="home-hero">
        <div className="hero-evergreen">
          <h1 className="hero-title-main">
            福井の<br />ほたる
          </h1>
          <p className="hero-location-top">
            新潟市西蒲区　矢垂川
          </p>
        </div>

        {/* Reservation (Moved from Events) */}
        <div className="reservation-section" id="reservation">
          <div className="glass-card reservation-card">
            <div className="reservation-card-content">
              <div className="reservation-card-left">
                <div className="hero-event-label">2026年度 開催情報</div>
                <h2 className="reservation-card-title">ガイド付きほたる鑑賞会</h2>
                <div className="reservation-status">🔦 予約受付中</div>
                <div className="reservation-dates">
                  <span className="reservation-date-chip">6月13日（土）</span>
                  <span className="reservation-date-chip">6月14日（日）</span>
                  <span className="reservation-date-chip">6月20日（土）</span>
                  <span className="reservation-date-chip">6月21日（日）</span>
                </div>
              </div>
              <div className="reservation-card-right">
                <div className="reservation-info">
                  集合: 19:30 ／ 終了: 20:45<br />
                  地元ガイドがほたるの生態を解説しながら<br />
                  観賞コースをご案内します
                </div>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfuBonebE4miSo-8r2O-W86cZVpqo7rWJ1WfJTdGLRQFdPDbA/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glow"
                >
                  <ExternalLink size={16} />
                  Googleフォームで予約する
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-event-card glass-card">
          <div className="hero-event-info-group">
            <div className="hero-event-label">2026年度 開催情報</div>
            <h2 className="hero-event-title">第32回 福井ほたる祭り</h2>
            <div className="hero-event-date">
              <Calendar size={14} />
              令和8年 6月20日（土）
            </div>
          </div>

          <div className="hero-cta">
            <Link to="/map" className="btn-glow">
              🗺️ ほたるマップを見る
              <ArrowRight size={16} />
            </Link>
            <Link to="/events" className="hero-secondary-link">
              当日のスケジュールはこちら →
            </Link>
          </div>
        </div>

        {/* Viewing Manners (Refined Design) */}
        <div id="manners" className="v-manners-section container">
          <div className="v-manners-card glass-card">
            <h3 className="v-manners-title">
              <Info size={20} className="title-icon" />
              ほたる観賞のマナー
            </h3>
            <div className="v-manners-grid">
              <div className="v-manners-item">
                <div className="v-manners-icon-wrapper">
                  <Footprints size={20} />
                </div>
                <p>観賞コースは最低限の明かりにとどめてあります。足元に十分注意してください。</p>
              </div>
              <div className="v-manners-item">
                <div className="v-manners-icon-wrapper">
                  <LightbulbOff size={20} />
                </div>
                <p>ホタルは光で合図をしています。懐中電灯などで照らさないでください。</p>
              </div>
              <div className="v-manners-item">
                <div className="v-manners-icon-wrapper">
                  <CameraOff size={20} />
                </div>
                <p>観賞の妨げとなりますのでフラッシュ撮影はしないでください。</p>
              </div>
              <div className="v-manners-item">
                <div className="v-manners-icon-wrapper">
                  <Heart size={20} />
                </div>
                <p>ホタルは持ち帰らないでください。愛護の気持ちをもって観賞しましょう。</p>
              </div>
              <div className="v-manners-item">
                <div className="v-manners-icon-wrapper">
                  <Trees size={20} />
                </div>
                <p>自然保護のため、草むらや林の中には立ち入らないでください。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <section className="container">
        <div className="info-banner">
          <div className="info-banner-title">
            <Sparkles size={18} className="title-icon" />
            ゲンジボタル観賞期間
          </div>
          <div className="info-banner-text">
            6月上旬〜下旬<br />
            日没後（20:00ごろ〜）が見頃です
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="quick-links container">
        <h2 className="section-title">メニュー</h2>
        <div className="quick-links-grid">
          {quickLinks.map(link => (
            <Link key={link.path} to={link.path} className="glass-card quick-link-card">
              <div className="quick-link-icon">{link.icon}</div>
              <div className="quick-link-title">{link.title}</div>
              <div className="quick-link-desc">{link.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Reports */}
      <section className="latest-reports container">
        <h2 className="section-title">最新の活動レポート</h2>
        {latestReports.map(report => (
          <div key={report.id} className="glass-card report-preview-card">
            <div className="report-preview-date">{report.date} ・ {report.author}</div>
            <div className="report-preview-title">{report.title}</div>
            <div className="report-preview-excerpt">{report.content}</div>
          </div>
        ))}
        <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
          <Link to="/reports" className="btn-glow">
            すべてのレポートを見る
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
