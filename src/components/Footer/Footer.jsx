import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Share2, Twitter, Facebook, MessageCircle, Instagram, Copy, Check, QrCode, X } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const siteUrl = window.location.origin;
  const siteTitle = "福井ほたる祭り | 新潟市西蒲区";

  const shareLinks = {
    x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(siteTitle)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`,
    line: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(siteUrl)}`,
    instagram: "https://www.instagram.com/explore/tags/福井のほたる/" // タグ検索または公式アカウント
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(siteUrl)}`;

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/icons/custom-logo.png" alt="ロゴ" className="footer-logo-img" />
            <span className="footer-logo-text">福井ほたる祭り</span>
          </div>
          <p className="footer-description">
            角田山麓の伏流水に育まれた源氏ぼたる。福井ほたる保護監視員を中心に、地域一丸となってこの美しい景観を守り続けています。
          </p>
          <div className="footer-sns">
            <span className="footer-sns-label">
              <Share2 size={16} /> サイトをシェアする
            </span>
            <div className="footer-sns-buttons">
              <a href={shareLinks.x} target="_blank" rel="noopener noreferrer" className="sns-btn x" title="Xでシェア">
                <Twitter size={18} />
              </a>
              <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="sns-btn facebook" title="Facebookでシェア">
                <Facebook size={18} />
              </a>
              <a href={shareLinks.line} target="_blank" rel="noopener noreferrer" className="sns-btn line" title="LINEでシェア">
                <MessageCircle size={18} />
              </a>
              <a href={shareLinks.instagram} target="_blank" rel="noopener noreferrer" className="sns-btn instagram" title="Instagram（タグ検索）">
                <Instagram size={18} />
              </a>
              <button onClick={handleCopy} className={`sns-btn copy ${copied ? 'active' : ''}`} title="URLをコピー">
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied && <span className="copy-tooltip">コピーしました！</span>}
              </button>
              <button onClick={() => setShowQr(true)} className="sns-btn qr" title="QRコードを表示">
                <QrCode size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-link-group">
            <h4>メニュー</h4>
            <ul>
              <li><Link to="/">ホーム</Link></li>
              <li><Link to="/map">ほたるマップ</Link></li>
              <li><Link to="/events">イベント情報</Link></li>
              <li><Link to="/gallery">ギャラリー</Link></li>
              <li><Link to="/local-guide">地域紹介</Link></li>
            </ul>
          </div>
          <div className="footer-link-group">
            <h4>お役立ち</h4>
            <ul>
              <li><Link to="/#manners">ほたる観賞マナー</Link></li>
              <li><Link to="/faq">FAQ / よくある質問</Link></li>
              <li><Link to="/access">アクセス</Link></li>
              <li><Link to="/coupon">来場特典</Link></li>
              <li><Link to="/contact">お問い合わせ</Link></li>
            </ul>
          </div>
          <div className="footer-link-group">
            <h4 className="footer-sub-title">運営</h4>
            <ul className="footer-links">
              <li className="footer-info-item">福井ほたる保護監視員 事務局</li>
              <li className="footer-info-item">(福井自治会内)</li>
              <li className="footer-info-item">新潟市西蒲区福井</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-copy">
          &copy; {new Date().getFullYear()} 福井ほたる保護監視員. All Rights Reserved.
        </div>
      </div>

      {/* QR Modal */}
      {showQr && (
        <div className="qr-modal-overlay" onClick={() => setShowQr(false)}>
          <div className="qr-modal-content" onClick={e => e.stopPropagation()}>
            <button className="qr-modal-close" onClick={() => setShowQr(false)}>
              <X size={24} />
            </button>
            <h3>スマートフォンでシェア</h3>
            <p>カメラでスキャンしてサイトを表示できます</p>
            <div className="qr-image-container">
              <img src={qrImageUrl} alt="QR Code" />
            </div>
            <div className="qr-url">{siteUrl}</div>
          </div>
        </div>
      )}
    </footer>
  );
}
