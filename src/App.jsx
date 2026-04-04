import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import FireflyParticles from './components/FireflyParticles/FireflyParticles';
import Home from './pages/Home/Home';
import MapPage from './pages/Map/Map';
import Events from './pages/Events/Events';
import Gallery from './pages/Gallery/Gallery';
import Reports from './pages/Reports/Reports';
import Coupon from './pages/Coupon/Coupon';
import Faq from './pages/Faq/Faq';
import Access from './pages/Access/Access';
import Contact from './pages/Contact/Contact';
import LocalGuide from './pages/LocalGuide/LocalGuide';
import AdminPage from './pages/Admin/Admin';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // ハッシュがある場合、少し待ってから該当要素にスクロール
      setTimeout(() => {
        const el = document.getElementById(hash.replace('#', ''));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <FireflyParticles count={40} />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/coupon" element={<Coupon />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/local-guide" element={<LocalGuide />} />
          <Route path="/access" element={<Access />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
