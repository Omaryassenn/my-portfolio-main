import React, { useState } from 'react';
import './Hero.css';
import { FiArrowUpRight } from 'react-icons/fi';
import Button from './Button';
import ScrollAnimation from './ScrollAnimation';
import TargetCursor from './TargetCursor/TargetCursor';
import heroPortrait from '../assets/hero-portrait.webp';
import { scrollToSection } from '../lib/smoothScroll';

const Hero = () => {
  const [isCursorActive, setIsCursorActive] = useState(false);

  return (
    <section
      id="home"
      className="hero-section"
      role="banner"
      aria-labelledby="hero-title"
      onMouseEnter={() => setIsCursorActive(true)}
      onMouseLeave={() => setIsCursorActive(false)}
    >
      {isCursorActive && (
        <TargetCursor
          spinDuration={2}
          hideDefaultCursor
          parallaxOn
          hoverDuration={0.2}
          cursorColor="#ffffff"
          cursorColorOnTarget="#FF4600"
        />
      )}
      <div className="hero-portrait" aria-hidden="true">
        <img src={heroPortrait} alt="" />
        <div className="hero-portrait-fade" />
      </div>

      <div className="hero-content">
        <ScrollAnimation direction="up" delay={0.2} animateOnMount>
          <div className="hero-heading">
            <p className="hero-tagline">
              Designer who <span className="hero-accent-text">ships the code</span>
            </p>
            <h1 id="hero-title" className="hero-name">
              Omar<span className="hero-accent-text">*</span>
            </h1>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.4} animateOnMount>
          <div className="hero-info">
            <p className="hero-description">
            I DESIGN PRODUCTS THAT WORK FOR USERS, BUSINESS, AND THE PEOPLE WHO BUILD THEM. PRODUCT DESIGN SHAPED BY BUSINESS GOALS AND FRONTEND REALITY.
            </p>
            <div className="hero-buttons" role="group" aria-label="Call to action buttons">
              <Button
                variant="primary"
                icon={FiArrowUpRight}
                onClick={() => scrollToSection('contact')}
                aria-label="Contact me to discuss opportunities"
                className="cursor-target"
              >
                Let's Talk
              </Button>
              <Button
                variant="secondary"
                onClick={() => scrollToSection('work')}
                aria-label="View my portfolio projects"
                className="cursor-target"
              >
                View Projects
              </Button>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default Hero;
