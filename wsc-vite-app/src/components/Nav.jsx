import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Nav.css';

function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const scrollPositionRef = React.useRef(0);

  // Navigation items (shared between desktop and mobile)
  const navItems = [
    { to: "/about", label: "About Us" },
    { to: "/executive-team", label: "Executive Team" },
    { to: "/events", label: "Events" },
    { to: "/sponsors", label: "Partners" },
    { to: "/contact-us", label: "Contact Us" }
  ];

  // Auto-close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Comprehensive scroll prevention for mobile menu - preserves scroll position
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      // Save current scroll position
      scrollPositionRef.current = window.scrollY;

      // Prevent scrolling
      document.body.classList.add('mobile-menu-open');
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scrolling
      document.body.classList.remove('mobile-menu-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';

      // Restore scroll position
      window.scrollTo(0, scrollPositionRef.current);
    }

    // Cleanup: always restore scroll on unmount
    return () => {
      document.body.classList.remove('mobile-menu-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isMobileMenuOpen]);

  // Safe handlers to prevent race conditions
  const openMobileMenu = React.useCallback(() => {
    setIsMobileMenuOpen(true);
  }, []);

  const closeMobileMenu = React.useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = React.useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  // Check if link is active
  const isActive = (path) => location.pathname === path;

  return (
    <header className="top-0 left-0 w-full z-50 text-white bg-transparent">
      <div className="px-4 md:px-10 lg:px-16 py-3 md:py-6 lg:py-8 flex items-center justify-between">

        {/* ==================== MOBILE HAMBURGER BUTTON ==================== */}
        <button
          className="hamburger-button md:hidden flex flex-col justify-center items-center w-12 h-12 focus:outline-none relative z-[10000]"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          <span className={`hamburger-line hamburger-line-top ${isMobileMenuOpen ? 'open' : ''}`} />
          <span className={`hamburger-line hamburger-line-middle ${isMobileMenuOpen ? 'open' : ''}`} />
          <span className={`hamburger-line hamburger-line-bottom ${isMobileMenuOpen ? 'open' : ''}`} />
        </button>

        {/* ==================== LOGO ==================== */}
        <Link to="/" className="text-md pr-4 lg:text-2xl font-bold">
          Western Sales Club
        </Link>

        {/* ==================== DESKTOP NAVIGATION ==================== */}
        <nav className="hidden md:flex desktop-nav">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`desktop-nav-link ${isActive(item.to) ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* ==================== MOBILE BACKDROP ==================== */}
        <div
          className={`mobile-backdrop md:hidden ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={closeMobileMenu}
          aria-hidden="true"
        />

        {/* ==================== MOBILE NAVIGATION ==================== */}
        <div className={`mobile-menu md:hidden ${isMobileMenuOpen ? 'open' : ''}`}>
          {/* Mobile Menu Items */}
          <ul className="mobile-menu-list">
            {navItems.map((item, index) => (
              <li
                key={item.to}
                className={`mobile-menu-item ${isMobileMenuOpen ? 'open' : ''}`}
              >
                <Link
                  to={item.to}
                  className={`mobile-menu-link ${isActive(item.to) ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Nav;