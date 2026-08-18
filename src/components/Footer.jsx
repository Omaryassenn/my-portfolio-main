import React from 'react';
import './Footer.css';
import { scrollToSection, scrollToTop } from '../lib/smoothScroll';

const SITEMAP = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'work', label: 'WORK' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'contact', label: 'CONTACT' },
];

const Footer = () => {
  /* Same routing as the navbar: Lenis's own anchor handling is switched off, so
     these have to be driven explicitly. Home is the reason — the hero is pinned
     by ScrollTrigger, so #home resolves to the reveal panel rather than the top
     of the page and a native jump lands mid-transition. The href stays for
     keyboard and no-JS use. */
  const handleNavClick = (e, id) => {
    e.preventDefault();
    if (id === 'home') scrollToTop();
    else scrollToSection(id);
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-sections">
          <div className="footer-section">
            <h3 className="footer-label">SKILLS / SERVICES</h3>
            <div className="footer-values">
              <p>UI/UX DESIGN</p>
              <p>FRONT-END DEVELOPMENT</p>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-label">SITEMAP</h3>
            <div className="footer-values">
              {SITEMAP.map(({ id, label }) => (
                <a key={id} href={`#${id}`} onClick={(e) => handleNavClick(e, id)}>
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-label" id="contact-info">CONTACT INFO</h3>
            <div className="footer-values" role="list" aria-labelledby="contact-info">
            <p role="listitem">
                  
                  CAIRO, EGYPT
                </p>
                <p role="listitem">
                  <a 
                    href="mailto:omaryassen99@outlook.com"
                    aria-label="Send email to Omar Yassen"
                  >
                    OMARYASSEN99@OUTLOOK.COM
                  </a>
                </p>
                <p role="listitem">
                  <a 
                    href="tel:+201149240296"
                    aria-label="Call Omar Yassen"
                  >
                    +201149240296
                  </a>
                </p>
            </div>
          </div>
        </div>

        <div className="footer-brand">
          <h1>CRAFTEDBYOMAR</h1>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 