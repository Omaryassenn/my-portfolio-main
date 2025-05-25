import React, { useState, useEffect } from 'react';
import './Navbar.css';
import darkLogo from '../assets/Logoo.svg';
import lightLogo from '../assets/Logoo.svg';
import { FiMenu, FiX, FiArrowUpRight } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import Button from './Button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDarkMode } = useTheme();
  
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
    return () => (document.body.style.overflow = 'auto');
  }, [menuOpen]);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleContactClick = (e) => {
    e.preventDefault();
    document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="nav-content">
        <div className="navbar-logo">
          <img src={isDarkMode ? darkLogo : lightLogo} alt="Crafted by Omar Logo" />
        </div>

        {/* Hamburger icon */}
        <div className="hamburger" onClick={toggleMenu} aria-label="Toggle navigation menu">
          {menuOpen ? <FiX /> : <FiMenu />}
        </div>

        {/* Links */}
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a>
          <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
          <a href="#skills" onClick={() => setMenuOpen(false)}>Skills</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
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
