import React, { useState } from 'react';
import './About.css';
import avatar from '../assets/Me.svg';
import ellipse from '../assets/about-card-dark-ellipse.svg';
import sparkles from '../assets/sparkles.svg';
import { FiDownload, FiTarget, FiUsers, FiCode } from 'react-icons/fi';
import Button from './Button';
import smavatar from '../assets/avatarmobile.svg';
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
      <img src={sparkles} alt="" className="sparkle" />
    </>
  );

  return (
    <section id="about" className="about-section">
      <div className="about-content">
        <div className="section-title">
          <div className="section-title-scroll">
            {repeatedText}
            {repeatedText}
          </div>
        </div>
        
        <div className="about-main">
          <div className="about-image">
            <img src={avatar} alt="Omar's profile" className='lgavatar' />
            <img src={smavatar} alt="Omar's profile" className="smavatar" />
          </div>
          
          <div className="about-text">
            <p>
              I'm a hybrid designer-developer who thrives at the intersection of design and code, With experience in both UI/UX and frontend development, I bring ideas to life with clean, scalable code and user-centered design.
            </p>
            <a href="/Omar-Yassen.pdf" download>
              <Button variant="primary" icon={FiDownload} id="download-cv">
                Download CV
              </Button>
            </a>

          </div>
        </div>

        <div className="feature-cards">
          <div 
            className="feature-card"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="glow-effect"></div>
            <img src={ellipse} alt="" className="blur-ellipse" />
            <div className="feature-icon">
              <FiTarget />
            </div>
            <h3>Dynamic Decision-Maker</h3>
            <p>Continuously evolves from every user interaction to deliver smarter, faster outcomes.</p>
          </div>

          <div 
            className="feature-card"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="glow-effect"></div>
            <img src={ellipse} alt="" className="blur-ellipse" />
            <div className="feature-icon">
              <FiUsers />
            </div>
            <h3>Human-Centric Design</h3>
            <p>Crafted with attention to every pixel for maximum clarity and user engagement.</p>
          </div>

          <div 
            className="feature-card"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="glow-effect"></div>
            <img src={ellipse} alt="" className="blur-ellipse" />
            <div className="feature-icon">
              <FiCode />
            </div>
            <h3>Developer-Friendly Handoff</h3>
            <p>Interfaces and components optimized for painless dev transfer and scale.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 