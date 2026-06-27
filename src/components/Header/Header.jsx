import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Navigation from '../Navigation/Navigation';
import './Header.css';

const navItems = [
  { path: '/', label: 'ホーム' },
  { path: '/map', label: 'ほたるマップ' },
  { path: '/events', label: 'イベント' },
  { path: '/gallery', label: 'ギャラリー' },
  { path: '/local-guide', label: '地域紹介' },
  { path: '/reports', label: '活動レポート' },
  { path: '/coupon', label: '来場特典' },
  { path: '/faq', label: 'FAQ' },
  { path: '/access', label: 'アクセス' },
  { path: '/contact', label: 'お問い合わせ' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // ページ遷移（URL変更）を検知してメニューを閉じ、履歴状態をリセット
  useEffect(() => {
    setMenuOpen(false);
    if (window.history.state && window.history.state.menu) {
      // 履歴状態をクリアして、新しいページで「戻る」を押した際にメニューが開かないようにする
      window.history.replaceState(null, '');
    }
  }, [location]);

  // 戻るボタンなどの履歴操作を検知してメニューを閉じる
  useEffect(() => {
    const handlePopState = (event) => {
      if (!event.state || !event.state.menu) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const toggleMenu = (open) => {
    if (open) {
      window.history.pushState({ menu: true }, '');
      setMenuOpen(true);
    } else {
      if (window.history.state && window.history.state.menu) {
        window.history.back();
      }
      setMenuOpen(false);
    }
  };

  return (
    <>
      <header className="header">
        <Link to="/" className="header-logo" onClick={() => toggleMenu(false)}>
          {/* public/icons フォルダ内の custom-logo.png を読み込みます */}
          <img src="/icons/custom-logo.png" alt="福井のほたる ロゴ" className="header-logo-icon-img" />
          <span className="header-logo-text">福井のほたる</span>
        </Link>

        <nav className="desktop-nav">
          {navItems.slice(1).map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="menu-button"
          onClick={() => toggleMenu(!menuOpen)}
          aria-label="メニュー"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <Navigation
        items={navItems}
        isOpen={menuOpen}
        onClose={() => toggleMenu(false)}
        onLinkClick={() => setMenuOpen(false)} // リンククリック時は直接閉じる
      />
    </>
  );
}
