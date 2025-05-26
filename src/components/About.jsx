import React, { useState } from 'react';
import './About.css';
import avatar from '../assets/Me.svg';
import ellipse from '../assets/about-card-dark-ellipse.svg';
import sparkles from '../assets/sparkles.svg';
import { FiDownload, FiTarget, FiUsers, FiCode } from 'react-icons/fi';
import Button from './Button';
import smavatar from '../assets/avatarmobile.svg';
import ScrollAnimation from './ScrollAnimation';

const About = () => {
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const cardStyle = e.currentTarget.style;
    cardStyle.setProperty('--cursor-x', `${x}px`);
    cardStyle.setProperty('--cursor-y', `${y}px`);
  };

  const handleMouseLeave = (e) => {
    const cardStyle = e.currentTarget.style;
    cardStyle.setProperty('--cursor-x', '0px');
    cardStyle.setProperty('--cursor-y', '0px');
  };

  const repeatedText = Array(8).fill(
    <>
      <span className="text">About me</span>
      <img src={sparkles} alt="" className="sparkle" aria-hidden="true" />
    </>
  );

  return (
    <section id="about" className="about-section" aria-labelledby="about-title">
      <div className="about-content">
        <ScrollAnimation direction="up">
          <div className="section-title" role="heading" aria-level="2">
            <div className="section-title-scroll" aria-hidden="true">
              {repeatedText}
              {repeatedText}
            </div>
            <span id="about-title" className="visually-hidden">About me</span>
          </div>
        </ScrollAnimation>
        
        <div className="about-main">
          <ScrollAnimation direction="left" delay={0.3}>
            <div className="about-image">
              <img 
                src={avatar} 
                alt="Omar's professional headshot" 
                className='lgavatar'
                loading="lazy" 
              />
              <img 
                src={smavatar} 
                alt="Omar's professional headshot" 
                className="smavatar"
                loading="lazy" 
              />
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation direction="right" delay={0.3}>
            <div className="about-text">
              <p>
                I'm a hybrid designer-developer who thrives at the intersection of design and code, With experience in both UI/UX and frontend development, I bring ideas to life with clean, scalable code and user-centered design.
              </p>
              <a 
                href="/Omar-Yassen.pdf" 
                download 
                aria-label="Download my CV in PDF format"
              >
                <Button 
                  variant="primary" 
                  icon={FiDownload} 
                  id="download-cv"
                  aria-label="Download CV"
                >
                  Download CV
                </Button>
              </a>
            </div>
          </ScrollAnimation>
        </div>

        <div className="feature-cards" role="list">
          <ScrollAnimation direction="up" delay={0.1}>
            <div 
              className="feature-card"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              role="listitem"
            >
              <div className="glow-effect" aria-hidden="true"></div>
              <img src={ellipse} alt="" className="blur-ellipse" aria-hidden="true" />
              <div className="feature-icon" aria-hidden="true">
                <FiTarget />
              </div>
              <h3>Dynamic Decision-Maker</h3>
              <p>Continuously evolves from every user interaction to deliver smarter, faster outcomes.</p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation direction="up" delay={0.2}>
            <div 
              className="feature-card"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              role="listitem"
            >
              <div className="glow-effect" aria-hidden="true"></div>
              <img src={ellipse} alt="" className="blur-ellipse" aria-hidden="true" />
              <div className="feature-icon" aria-hidden="true">
                <FiUsers />
              </div>
              <h3>Human-Centric Design</h3>
              <p>Crafted with attention to every pixel for maximum clarity and user engagement.</p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation direction="up" delay={0.4}>
            <div 
              className="feature-card"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              role="listitem"
            >
              <div className="glow-effect" aria-hidden="true"></div>
              <img src={ellipse} alt="" className="blur-ellipse" aria-hidden="true" />
              <div className="feature-icon" aria-hidden="true">
                <FiCode />
              </div>
              <h3>Developer-Friendly Handoff</h3>
              <p>Interfaces and components optimized for painless dev transfer and scale.</p>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
};

export default About; 