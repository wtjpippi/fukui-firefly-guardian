import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import './Navigation.css';

const navIcons = {
  '/': '🏠',
  '/map': '🗺️',
  '/events': '🎭',
  '/gallery': '📸',
  '/local-guide': '🏞️',
  '/reports': '📑',
  '/coupon': '🎟️',
  '/faq': '❓',
  '/access': '🚗',
  '/contact': '✉️',
};

export default function Navigation({ items, isOpen, onClose }) {
  return (
    <>
      <div
        className={`nav-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <nav className={`nav-drawer ${isOpen ? 'open' : ''}`}>
        <div className="nav-drawer-header">
          <span className="nav-drawer-title">メニュー</span>
          <button className="nav-close-btn" onClick={onClose} aria-label="閉じる">
            <X size={20} />
          </button>
        </div>
        <div className="nav-links">
          {items.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
              end={item.path === '/'}
            >
              <span className="nav-link-icon">{navIcons[item.path]}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
