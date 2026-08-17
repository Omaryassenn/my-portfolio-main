import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './Preloader.css';

const LOGO_W = 37.5088;
const LOGO_H = 42;

/* Path data lifted from assets/nav-logo.svg so the individual shapes can be
   animated — an <img> would render the mark as an opaque bitmap. That file uses
   the same 37.5088x42 viewBox as this SVG, which is what lets the mark scale
   into the navbar's <img> and land on it exactly. */
const SLASH =
  'M33.6326 0.0468558C34.6413 -0.0365535 36.4254 0.0210635 37.5088 0.00114368C37.1982 0.318115 37.065 0.620166 36.7964 0.968723C36.3587 1.5368 35.905 2.09574 35.455 2.65405L29.1119 10.5778L9.42776 34.8505C7.79136 36.86 6.18761 38.9895 4.49063 40.9425C4.17925 41.3008 4.17297 41.5853 3.76463 41.8773C2.61989 42.1218 1.24191 41.9173 0 41.9632C1.186 40.4025 2.25149 38.7983 3.48533 37.2376C4.49206 35.9641 5.85686 34.601 6.71658 33.314C7.61396 31.9707 8.3876 31.1947 9.3601 29.9907L25.2716 10.2664C26.3773 8.8823 27.5464 7.5502 28.6422 6.15717C29.2814 5.34466 33.115 0.246689 33.6326 0.0468558Z';
const ARC_LEFT =
  'M17.1272 3.79456C20.4833 3.57337 23.1621 4.62309 26.0971 5.98772C26.2528 6.65468 24.7397 7.97701 24.6996 7.96042C21.4748 6.62428 18.9268 6.08137 15.5124 6.55603C5.955 7.88479 0.556881 18.1719 4.27533 27.0259C4.87871 28.5372 5.74662 29.5921 6.75851 30.8615C6.34794 31.4225 5.6653 31.8356 5.37822 32.5566C5.30953 32.7291 5.19518 32.8169 5.02579 32.8572C4.82868 32.7756 4.68542 32.6667 4.54899 32.4987C2.26586 29.6872 1.05202 26.8886 0.629227 23.235C0.0776379 18.5458 1.44139 13.8324 4.412 10.161C6.71531 7.26664 10.4123 4.99054 14.0219 4.24208C15.0803 4.02256 16.0566 3.91598 17.1272 3.79456Z';
const ARC_RIGHT =
  'M31.4243 10.7258C32.0844 11.7138 32.5146 12.1764 33.1126 13.2996C35.1427 17.1128 35.5423 22.1526 34.3301 26.2707C33.317 29.7123 30.757 33.2945 27.8502 35.3806C27.1275 35.8992 26.4323 36.468 25.607 36.8359C22.1832 38.4882 18.3925 39.051 14.6533 38.313C13.5672 38.0987 12.5248 37.6776 11.4849 37.3272C11.0081 37.1712 10.8563 37.0576 10.4362 36.7768C10.9761 36.2482 11.4081 35.5625 12.0215 35.1309C12.1567 35.039 12.4143 35.03 12.5648 35.0916C21.0444 38.5672 30.2281 33.0429 32.2005 24.3179C32.8578 21.4097 32.4735 18.0671 31.199 15.2443C30.8027 14.3667 30.246 13.4692 29.7232 12.5867C30.3296 11.8178 30.6972 11.3673 31.4243 10.7258Z';

const EASE_OUT = [0.16, 1, 0.3, 1];
const MIN_DURATION = 900;

/* Outro timings. Kept here (not only in CSS) because the flight distance has to
   be measured in JS, so both sides must agree on the numbers. REVEAL_AT is
   mirrored by the backdrop's transition-delay in Preloader.css. */
const SETTLE_MS = 260;
const FLIGHT_MS = 900;
const REVEAL_AT = 0.35;
const EASE_INTRO = 'cubic-bezier(0.76, 0, 0.24, 1)';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Preloader = ({ onReveal, onDone }) => {
  const [progress, setProgress] = useState(0);
  // loading -> settling (meter/word/tagline fade) -> flying (mark travels)
  const [phase, setPhase] = useState('loading');

  const progressRef = useRef(0);
  const markRef = useRef(null);
  const timersRef = useRef([]);
  const outroStartedRef = useRef(false);

  const onDoneRef = useRef(onDone);
  const onRevealRef = useRef(onReveal);
  onDoneRef.current = onDone;
  onRevealRef.current = onReveal;

  const later = (fn, ms) => {
    timersRef.current.push(window.setTimeout(fn, ms));
  };

  /* Hands the mark over to the navbar, then unmounts. The class is dropped a
     frame BEFORE onDone so the navbar's own mark is already painted when this
     one disappears — otherwise there is a frame with either no logo or two. */
  const finish = useCallback(() => {
    document.documentElement.classList.remove('intro-logo-flying');
    // rAF gives the navbar's mark one frame to paint before this unmounts.
    // Background tabs pause rAF entirely, so a timeout backs it up — otherwise
    // the preloader could hang on screen forever in a tab opened in the
    // background.
    let handed = false;
    const hand = () => {
      if (handed) return;
      handed = true;
      onDoneRef.current?.();
    };
    requestAnimationFrame(hand);
    later(hand, 120);
  }, []);

  const startOutro = useCallback(() => {
    if (outroStartedRef.current) return;
    outroStartedRef.current = true;

    if (prefersReducedMotion()) {
      onRevealRef.current?.();
      finish();
      return;
    }

    setPhase('settling');

    later(() => {
      const mark = markRef.current;
      const target = document.querySelector('.navbar-logo-mark');

      // No navbar to fly into (or nothing laid out yet) — reveal plainly rather
      // than animating to a bogus position.
      if (!mark || !target) {
        onRevealRef.current?.();
        finish();
        return;
      }

      const from = mark.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      if (!from.width || !to.width) {
        onRevealRef.current?.();
        finish();
        return;
      }

      // Uniform scale keeps the proportions; the deltas are centre-to-centre to
      // match transform-origin: center.
      const scale = to.width / from.width;
      const dx = to.left + to.width / 2 - (from.left + from.width / 2);
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);

      // While in flight this is the only mark on screen, which is what makes it
      // read as one physical object moving rather than a cross-fade.
      document.documentElement.classList.add('intro-logo-flying');
      setPhase('flying');

      mark.style.transition = `transform ${FLIGHT_MS}ms ${EASE_INTRO}`;
      mark.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;

      later(() => onRevealRef.current?.(), FLIGHT_MS * REVEAL_AT);
      later(finish, FLIGHT_MS);
    }, SETTLE_MS);
  }, [finish]);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const minDuration = reduced ? 350 : MIN_DURATION;

    // Real signal: hold until the browser reports every asset in (the hero
    // portrait is ~900KB), but never flash by for less than minDuration.
    let assetsReady = document.readyState === 'complete';
    const markReady = () => { assetsReady = true; };
    if (!assetsReady) window.addEventListener('load', markReady);

    const started = performance.now();
    let frame;

    // Safety net: the loop below is driven by requestAnimationFrame, which
    // browsers pause entirely in background tabs, and it waits on `load`,
    // which never fires if an asset hangs. Either case would leave the user
    // stuck behind a black screen, so hard-release after a ceiling. Timeouts
    // are only throttled in background tabs, not paused.
    const failSafe = window.setTimeout(() => {
      cancelAnimationFrame(frame);
      progressRef.current = 100;
      setProgress(100);
      startOutro();
    }, 8000);

    const loop = () => {
      const elapsed = performance.now() - started;
      // Stall at 92% while assets are still in flight so the bar never claims
      // to be finished before the page actually is.
      const cap = assetsReady ? 100 : 92;
      const target = Math.min((elapsed / minDuration) * 100, cap);

      progressRef.current += (target - progressRef.current) * 0.14;
      if (target >= 100 && progressRef.current > 99.2) progressRef.current = 100;
      setProgress(progressRef.current);

      if (progressRef.current === 100) {
        window.clearTimeout(failSafe);
        later(startOutro, reduced ? 60 : 140);
        return;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(failSafe);
      timersRef.current.forEach(window.clearTimeout);
      window.removeEventListener('load', markReady);
      document.documentElement.classList.remove('intro-logo-flying');
    };
  }, [startOutro]);

  // The clip rect slides down over the mark, so the orange slash literally
  // draws itself in step with how much has actually loaded.
  const revealY = -LOGO_H + (progress / 100) * LOGO_H;

  return (
    <div className="preloader" data-phase={phase} role="status" aria-label="Loading">
      {/* The black sits on its own layer so it can fade away while the mark, a
          sibling, stays fully opaque for the whole flight. */}
      <div className="preloader__backdrop" />

      <div className="preloader__inner">
        <svg
          className="preloader__mark"
          ref={markRef}
          viewBox={`0 0 ${LOGO_W} ${LOGO_H}`}
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <clipPath id="preloader-slash-clip">
              <rect x="0" y={revealY} width={LOGO_W} height={LOGO_H} />
            </clipPath>
          </defs>

          <motion.g
            initial={{ opacity: 0, scale: 0.72 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          >
            <path d={ARC_LEFT} fill="#F7F6F7" />
            <path d={ARC_RIGHT} fill="#F7F6F7" />
          </motion.g>

          {/* Faint ghost of the slash marks out the distance still to travel. */}
          <path d={SLASH} fill="#FF4600" opacity="0.16" />
          <g clipPath="url(#preloader-slash-clip)">
            <path d={SLASH} fill="#FF4600" />
          </g>
        </svg>

        {/* Wordmark, subtitle and meter all fade together and leave their space
            behind, so the mark does not shift before it starts travelling. */}
        <div className="preloader__word" aria-hidden="true">
          {['O', 'M', 'A', 'R'].map((letter, i) => (
            <motion.span
              key={letter}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.05, duration: 0.45, ease: EASE_OUT }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        

        
      </div>
    </div>
  );
};

export default Preloader;
