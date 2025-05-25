import React from 'react';
import './Hero.css';
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import gradientSvg from '../assets/gradient.svg';
import mobile from '../assets/mobilegradient.svg';
import Button from './Button';
import tablet from '../assets/Tabletgradient.svg';

const Hero = () => {
  return (
    <section id="home" className="hero-section">
      <div className="hero-background-gradient">
        <img src={gradientSvg} alt="Background gradient" className="gradient-desktop"/>
        <img src={mobile} alt="Gradient Mobile" className="gradient-mobile" />
        <img src={tablet} alt="Gradient Mobile" className="gradient-tablet" />
      </div>
      <div className="hero-content">
        <h1>Hi, I'm Omar — a UI/UX<br />Designer & Frontend<br />Developer.</h1>
        <p>I craft seamless user experiences and build responsive, accessible, and performant web applications.</p>
        <div className="hero-buttons">
          <Button 
            variant="primary" 
            icon={FiArrowUpRight}
          >
            Let's Talk
          </Button>
          <Button variant="secondary" icon={FiArrowRight}>
            View Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero; 