import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Footprints, LightbulbOff, CameraOff, Heart, Trees, Info, Sparkles, ExternalLink, Search, Users, Megaphone } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { eventInfo } from '../../config/eventInfo';
import './Home.css';

export default function Home() {
  const [latestReports, setLatestReports] = useState([]);

  useEffect(() => {
    async function fetchLatestReports() {
      const { data } = await supabase
        .from('activity_reports')
        .select('*')
        .order('date', { ascending: false })
        .limit(3);
      if (data) setLatestReports(data);
    }
    fetchLatestReports();
  }, []);

  const quickLinks = [
    { path: '/map', icon: '🗺️', title: 'ほたるマップ', desc: 'リアルタイム飛翔状況' },
    { path: '/events', icon: '🎭', title: 'イベント', desc: 'ほたる祭り情報' },

    { path: '/gallery', icon: '📸', title: 'ギャラリー', desc: '歴史と思い出' },
    { path: '/local-guide', icon: '🏞️', title: '地域紹介', desc: '福井の魅力と銘店' },
    { path: '/reports', icon: '📑', title: '活動レポート', desc: '保護活動の記録' },
    { path: '/coupon', icon: '🎟️', title: '来場特典', desc: 'お得なクーポン' },
    { path: '/faq', icon: '❓', title: 'FAQ', desc: 'よくある質問' },
    { path: '/access', icon: '🚗', title: 'アクセス', desc: '駐車場・交通案内' },
    { path: '/contact', icon: '✉️', title: 'お問い合わせ', desc: 'ご意見・ご質問' },
  ];

  return (
    <div className="page">
      {/* Hero Section - Split Layout (Refined) */}
      <section className="home-hero">
        <div className="hero-evergreen">
          <h1 className="hero-title-main">
            矢垂川の<br />ほたる
          </h1>
          <p className="hero-location-top">
            新潟市西蒲区福井
          </p>
        </div>

        {/* Reservation (Moved from Events) */}
        <div className="reservation-section" id="reservation">
          <div className="glass-card reservation-card">
            <div className="reservation-card-content">
              <div className="reservation-card-left">
                <div className="hero-event-label">{eventInfo.year}年度 開催情報</div>
                <h2 className="reservation-card-title">ガイド付きほたる観賞会</h2>
                <div className="reservation-status">🔦 予約受付中</div>
                <div className="reservation-dates">
                  {eventInfo.viewingDates.map((date, i) => (
                    <span key={i} className="reservation-date-chip">{date}</span>
                  ))}
                </div>
              </div>
              <div className="reservation-card-right">
                <div className="reservation-info">
                  場所: ほたるの里公園 ほたる案内所<br />
                  集合: 19:30 ／ 終了: 20:45<br />
                  参加費: 無料 ／ 定員: 各日20名<br />
                  地元ガイドがほたるの生態を解説しながらご案内します
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
            <div className="hero-event-label">{eventInfo.year}年度 開催情報</div>
            <h2 className="hero-event-title">第{eventInfo.festivalEdition}回 福井ほたる祭り</h2>
            <div className="hero-event-date">
              <Calendar size={14} />
              {eventInfo.festivalFullDate}
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

        {/* Monitors Activities (New Section) */}
        <div id="activities" className="monitor-activities-section container">
          <div className="monitor-activities-card glass-card">
            <h3 className="section-title-small">
              <Sparkles size={20} className="title-icon" />
              福井ほたる保護監視員について
            </h3>
            <p className="monitor-purpose">
              この会の目的は、「ほたるの里」福井地区の豊かな自然環境を守り、シンボルであるほたるの保護育成を行うことにより、「ほたるの里」並びに福井地区のイメージアップに寄与することです。
            </p>
            <div className="monitor-activities-grid">
              <div className="activity-item">
                <div className="activity-icon-wrapper">
                  <Trees size={24} />
                </div>
                <div className="activity-content">
                  <h4 className="activity-title">環境整備</h4>
                  <p className="activity-desc">ほたるが自生しやすい自然環境の維持に加え、安全に観賞していただくためのコース周辺の草刈りなどを行っています。</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon-wrapper">
                  <Heart size={24} />
                </div>
                <div className="activity-content">
                  <h4 className="activity-title">保護育成</h4>
                  <p className="activity-desc">観賞コースの巡視活動や、ほたるの餌となるカワニナの採集・放流などを行っています。</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon-wrapper">
                  <Search size={24} />
                </div>
                <div className="activity-content">
                  <h4 className="activity-title">生息調査・研究</h4>
                  <p className="activity-desc">ほたる幼虫の上陸調査や発生状況の観察・記録に加え、川の水生生物の調査など、生態系全体を把握するための研究を行っています。</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon-wrapper">
                  <Users size={24} />
                </div>
                <div className="activity-content">
                  <h4 className="activity-title">情報交換</h4>
                  <p className="activity-desc">福井地区の各団体と連携協力し、地域一体となった保護活動を展開します。</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon-wrapper">
                  <Megaphone size={24} />
                </div>
                <div className="activity-content">
                  <h4 className="activity-title">PR活動</h4>
                  <p className="activity-desc">ほたる祭りの開催や観賞会を通じて、ほたるが舞う豊かな自然環境と、福井地区の魅力を広く発信しています。</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon-wrapper">
                  <Sparkles size={24} />
                </div>
                <div className="activity-content">
                  <h4 className="activity-title">その他の事業</h4>
                  <p className="activity-desc">美しい里山の風景を次世代へ引き継ぐため、自然環境の保全や地域活性化に関わる多様な活動に幅広く取り組んでいます。</p>
                </div>
              </div>
            </div>
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
            {eventInfo.viewingPeriod}（見頃：20:00〜20:30）<br />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', display: 'inline-block', marginTop: 'var(--space-xs)' }}>
              ※月明かりが少なく、風のない蒸し暑い夜に最も活発に飛び交います
            </span>
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
        {latestReports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-muted)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            レポートはまだありません
          </div>
        ) : (
          latestReports.map(report => (
            <Link to={`/reports#report-${report.id}`} key={report.id} className="glass-card report-preview-card">
              <div className="report-preview-date">{report.date} ・ {report.author}</div>
              <h3 className="report-preview-title">{report.title}</h3>
              <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start' }}>
                {(report.image_urls?.[0] || report.image_url) && (
                  <img 
                    src={report.image_urls?.[0] || report.image_url} 
                    alt="" 
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }} 
                  />
                )}
                <div className="report-preview-excerpt" style={{ whiteSpace: 'pre-wrap' }}>{report.content}</div>
              </div>
              <div className="report-preview-footer">
                <span className="report-more-btn">
                  詳しく見る <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))
        )}
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
