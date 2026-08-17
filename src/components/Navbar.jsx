import React, { useState, useEffect } from 'react';
import './Navbar.css';
import navLogo from '../assets/nav-logo.svg';
import { FiMenu, FiX, FiArrowUpRight } from 'react-icons/fi';
import Button from './Button';
import { scrollToSection, scrollToTop, pauseScroll, resumeScroll } from '../lib/smoothScroll';

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState(NAV_LINKS[0].id);

  // Lenis reads the wheel rather than the scrollbar, so overflow: hidden alone
  // no longer freezes the page behind the open menu.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
    if (menuOpen) pauseScroll();
    else resumeScroll();
    return () => {
      document.body.style.overflow = 'auto';
      resumeScroll();
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Highlight whichever section the reader is actually in. */
  useEffect(() => {
    const sections = NAV_LINKS
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return undefined;

    let frame = null;

    const update = () => {
      frame = null;
      // A section counts as current once its top passes this line.
      const anchor = window.innerHeight * 0.35;
      let current = sections[0].id;
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= anchor) current = section.id;
      });

      // The last nav section is shorter than the page tail (contact + footer
      // sit below it), so pin it once the page bottoms out.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) current = sections[sections.length - 1].id;

      setActiveId((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleContactClick = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToSection('contact');
  };

  /* Every link is driven from here rather than from its href, because Lenis's
     own anchor handling is switched off (see lib/smoothScroll). Home is the
     reason: the hero is pinned, so #home does not resolve to the top of the
     page while the pin is engaged. The href stays for keyboard and no-JS use. */
  const handleNavClick = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    if (id === 'home') scrollToTop();
    else scrollToSection(id);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="nav-content">
        <div className="navbar-logo">
          <img src={navLogo} alt="" className="navbar-logo-mark" />
          {/* <div className="navbar-logo-text">
            <span className="navbar-logo-name">OMAR</span>
            <span className="navbar-logo-tagline">Designer • Developer</span>
          </div> */}
        </div>

        {/* Hamburger icon */}
        <div className="hamburger" onClick={toggleMenu} aria-label="Toggle navigation menu">
          {menuOpen ? <FiX /> : <FiMenu />}
        </div>

        {/* Links */}
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <div className="nav-links-list">
            {NAV_LINKS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={activeId === id ? 'active' : undefined}
                aria-current={activeId === id ? 'true' : undefined}
                onClick={(e) => handleNavClick(e, id)}
              >
                {label}
              </a>
            ))}
          </div>

          <Button
            variant="primary"
            icon={FiArrowUpRight}
            onClick={handleContactClick}
            className="nav-button"
          >
            Let's Talk
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
