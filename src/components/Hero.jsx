import React from 'react';
import './Hero.css';
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import Button from './Button';
import ScrollAnimation from './ScrollAnimation';
import GradientBlinds from './GradientBlinds/GradientBlinds';
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
    <section id="home" className="hero-section" role="banner" aria-labelledby="hero-title">
      <div className="hero-background-gradient" aria-hidden="true">
        <GradientBlinds
          gradientColors={['#5ac8fa', '#5856d6', '#34aadc']}
          angle={-30}
          noise={0.7}
          blindCount={21}
          blindMinWidth={10}
          mouseDampening={0.5}
          mirrorGradient
          spotlightRadius={0.5}
          spotlightSoftness={2.1}
          spotlightOpacity={1}
          distortAmount={0.2}
          shineDirection="left"
          mixBlendMode="normal"
        />
      </div>
      <div className="hero-content">
        <ScrollAnimation direction="up" delay={0.2}>
          <h1 id="hero-title">Hi, I'm Omar — a UI/UX<br />Designer & Frontend<br />Developer.</h1>
        </ScrollAnimation>
        <ScrollAnimation direction="up" delay={0.4}>
          <p>I craft seamless user experiences and build responsive, accessible, and performant web applications.</p>
        </ScrollAnimation>
        <ScrollAnimation direction="up" delay={0.6}>
          <div className="hero-buttons" role="group" aria-label="Call to action buttons">
            <Button 
              variant="primary" 
              icon={FiArrowUpRight}
              onClick={() => scrollToSection('contact')}
              aria-label="Contact me to discuss opportunities"
            >
              Let's Talk
            </Button>
            <Button 
              variant="secondary" 
              icon={FiArrowRight}
              onClick={() => scrollToSection('work')}
              aria-label="View my portfolio projects"
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