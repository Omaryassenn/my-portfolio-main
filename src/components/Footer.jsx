import React from 'react';
import './Footer.css';

const Footer = () => {
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
              <a href="#home">HOME</a>
              <a href="#about">ABOUT</a>
              <a href="#experience">EXPERIENCE</a>
              <a href="#work">WORK</a>
              <a href="#skills">SKILLS</a>
              <a href="#contact">CONTACT</a>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-label" id="contact-info">CONTACT INFO</h3>
            <div className="footer-values" role="list" aria-labelledby="contact-info">
            <p role="listitem">
                  <span className="visually-hidden">Location: </span>
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