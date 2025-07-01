import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();          // highlight active link

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="main-header">
      {/* ─────── Logo ─────── */}
<div className="logo">
  <Link to="/" onClick={closeMenu}>
    <img
      src="Logo.png"     /* put the file in /public/assets or adjust the path */
      alt="Learnsy home"
      className="logo-img golden-border"   /* or: "logo-img golden-border" */
    />
  </Link>
</div>

      {/* ─────── Navigation links ─────── */}
      <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link
          to="/"
          onClick={closeMenu}
          className={pathname === '/' ? 'active' : ''}
        >
          Home
        </Link>
        <Link
          to="/courses"
          onClick={closeMenu}
          className={pathname.startsWith('/courses') ? 'active' : ''}
        >
          Courses
        </Link>
        <Link
          to="/blog"
          onClick={closeMenu}
          className={pathname.startsWith('/blog') ? 'active' : ''}
        >
          Blog
        </Link>
        <Link
          to="/contact"
          onClick={closeMenu}
          className={pathname.startsWith('/contact') ? 'active' : ''}
        >
          Contact
        </Link>

        {/* Auth buttons (stick to the end of <nav> so they sit together) */}
       <div className="auth-buttons">
  <Link to="/login" className="btn-login" onClick={closeMenu}>
    Log&nbsp;in
  </Link>
  <Link to="/signup" className="btn-signup" onClick={closeMenu}>
    Sign&nbsp;up
  </Link>
</div>

      </nav>

      {/* ─────── Hamburger ─────── */}
      <button
        className={`menu-toggle ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
};

export default Header;
