import React, { useCallback, useEffect, useState } from 'react';
import Layout from './components/Layout';
import Preloader from './components/Preloader/Preloader';
import Hero from './components/Hero';
import HeroReveal from './components/HeroReveal/HeroReveal';
import About from './components/About';
import Experience from './components/Experience';
import Work from './components/Work';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';
import Navbar from './components/Navbar';
import { ThemeProvider } from './context/ThemeContext';
import { initSmoothScroll, pauseScroll, resumeScroll, jumpToTop } from './lib/smoothScroll';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function App() {
  const [loading, setLoading] = useState(true);
  // Split from `loading` because the page starts showing partway through the
  // logo's flight, while the preloader is still mounted.
  const [revealed, setRevealed] = useState(false);
  const handleReveal = useCallback(() => setRevealed(true), []);
  const handleLoaded = useCallback(() => setLoading(false), []);

  // Site-wide smooth scrolling. Declared before the lock effect below so Lenis
  // exists by the time that effect tries to stop it.
  useEffect(() => initSmoothScroll(), []);

  // Keep the page pinned while the preloader is up, otherwise the reveal
  // animation can land mid-scroll.
  useEffect(() => {
    if (!loading) {
      resumeScroll();
      // The preloader unmounting changes every section's offset, so the pins
      // measured during load would otherwise be stale.
      ScrollTrigger.refresh();
      return undefined;
    }
    pauseScroll();
    jumpToTop();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [loading]);

  return (
    <ThemeProvider>
      <div className={`app${revealed ? ' app--revealed' : ' app--intro'}`}>
        {/* No AnimatePresence: the preloader runs its own outro (see
            Preloader.jsx) and only unmounts once the logo has been handed to
            the navbar, so an exit animation here would fight it. */}
        {loading && <Preloader onReveal={handleReveal} onDone={handleLoaded} />}
        {/* <Layout /> */}
        <Navbar />
        {/* Grouped so the hero's pin is scoped to this pair, and so the global
            `section + section` gap does not open a seam mid-transition or
            before About. */}
        <div className="hero-reveal-group">
          <Hero />
          <HeroReveal />
        </div>
        <About />
        <Experience />
        <Work />
        <Skills />
        <Contact />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
