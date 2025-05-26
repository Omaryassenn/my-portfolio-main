import React from 'react';
import './Hero.css';
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import gradientSvg from '../assets/gradient.svg';
import mobile from '../assets/mobilegradient.svg';
import Button from './Button';
import tablet from '../assets/Tabletgradient.svg';
import ScrollAnimation from './ScrollAnimation';
import { scroller } from 'react-scroll';

const Hero = () => {
  const scrollToSection = (sectionId) => {
    scroller.scrollTo(sectionId, {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    });
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-background-gradient">
        <img src={gradientSvg} alt="Background gradient" className="gradient-desktop"/>
        <img src={mobile} alt="Gradient Mobile" className="gradient-mobile" />
        <img src={tablet} alt="Gradient Mobile" className="gradient-tablet" />
      </div>
      <div className="hero-content">
        <ScrollAnimation direction="up" delay={0.2}>
          <h1>Hi, I'm Omar — a UI/UX<br />Designer & Frontend<br />Developer.</h1>
        </ScrollAnimation>
        <ScrollAnimation direction="up" delay={0.4}>
          <p>I craft seamless user experiences and build responsive, accessible, and performant web applications.</p>
        </ScrollAnimation>
        <ScrollAnimation direction="up" delay={0.6}>
          <div className="hero-buttons">
            <Button 
              variant="primary" 
              icon={FiArrowUpRight}
              onClick={() => scrollToSection('contact')}
            >
              Let's Talk
            </Button>
            <Button 
              variant="secondary" 
              icon={FiArrowRight}
              onClick={() => scrollToSection('work')}
            >
              View Projects
            </Button>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default Hero; 