import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
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

  return (
    <>
      <header className="header">
        <Link to="/" className="header-logo">
          {/* public/icons フォルダ内の custom-logo.png を読み込みます */}
          <img src="/icons/custom-logo.png" alt="福井ほたる祭り ロゴ" className="header-logo-icon-img" />
          <span className="header-logo-text">福井ほたる祭り</span>
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
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニュー"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <Navigation
        items={navItems}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}
