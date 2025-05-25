import React, { useState, useEffect } from 'react';
import './Layout.css';
import Hero from './Hero';
import About from './About';
import Experience from './Experience';
import Navbar from './Navbar';

const Layout = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const sections = ['hero', 'about', 'experience'];

  const handleWheel = (e) => {
    if (isScrolling) return;

    setIsScrolling(true);
    if (e.deltaY > 0 && activeSection < sections.length - 1) {
      // Scrolling down
      setActiveSection(prev => prev + 1);
    } else if (e.deltaY < 0 && activeSection > 0) {
      // Scrolling up
      setActiveSection(prev => prev - 1);
    }

    setTimeout(() => {
      setIsScrolling(false);
    }, 1000); // Debounce scroll events
  };

  useEffect(() => {
    const section = document.getElementById(sections[activeSection]);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSection]);

  return (
    <>
      <Navbar />
      <div className="layout-container" onWheel={handleWheel}>
        <div className="section" id="hero">
          <Hero />
        </div>
        <div className="section" id="about">
          <About />
        </div>
        <div className="section" id="experience">
          <Experience />
        </div>
      </div>
    </>
  );
};

export default Layout; 