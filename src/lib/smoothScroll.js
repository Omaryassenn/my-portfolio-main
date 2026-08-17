import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ScrollTrigger keeps its own record of scroll positions and reapplies it on
   refresh, which would undo the manual scroll restoration claimed in main.jsx
   and drop the visitor back into the middle of the pinned hero transition. */
ScrollTrigger.clearScrollMemory('manual');
/* Phone address bars fire a resize mid-scroll. Re-measuring every pin at that
   moment produces a visible jump and buys nothing. */
ScrollTrigger.config({ ignoreMobileResize: true });

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis = null;

export const getLenis = () => lenis;

/* Lenis drives the real scroll position (it does not transform a wrapper), so
   position: fixed, ScrollTrigger pins and the native anchor offsets all keep
   working. That is the whole reason it is used here instead of ScrollSmoother,
   which would have required moving the navbar, cursor and preloader out of the
   scrolled content. */
export function initSmoothScroll() {
  if (lenis) return () => {};
  // Reduced-motion users keep the browser's own scrolling, untouched.
  if (prefersReducedMotion()) return () => {};

  lenis = new Lenis({
    // lerp is the fraction of the remaining distance covered per frame, so a
    // lower number reads as heavier. 0.085 feels deliberate; below ~0.06 the
    // page starts to float away from the wheel.
    lerp: 0.085,
    // Slightly under 1 so one wheel notch travels a little less than native.
    wheelMultiplier: 0.9,
    touchMultiplier: 1.6,
    // Touch devices already have OS-level momentum. Layering Lenis on top of
    // it fights the platform and reads as lag rather than polish.
    syncTouch: false,
    /* Deliberately OFF. Lenis's anchor handling is a document-level click
       listener that resolves href="#id" against the element's current offset.
       The hero is pinned by ScrollTrigger, so while the pin is engaged #home
       resolves to the reveal panel rather than the top of the page - clicking
       Home landed on "+3 Years". It also ran ahead of the component's own
       handler, so preventDefault there could not stop it. The navbar routes
       every link through scrollToSection/scrollToTop instead, which eases on
       the same curve but is explicit about the destination. */
    anchors: false,
    // gsap.ticker drives the loop below; Lenis must not also run its own rAF
    // or the scroll advances twice per frame.
    autoRaf: false,
  });

  // ScrollTrigger has to read the position Lenis just wrote, otherwise every
  // scrubbed animation trails the actual scroll by a frame.
  lenis.on('scroll', ScrollTrigger.update);

  const tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  // Without this, gsap skips ahead in time after a stall, which on a
  // scroll-scrubbed timeline surfaces as a visible jump.
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    lenis = null;
  };
}

/* Go through Lenis so programmatic jumps share the page's easing. Falls back to
   native behaviour when Lenis is absent (reduced motion). */
export const scrollToSection = (id) => {
  const selector = String(id).startsWith('#') ? String(id) : `#${id}`;
  if (lenis) {
    lenis.scrollTo(selector);
    return;
  }
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
};

/* Home has to go to the top of the document rather than to #home. The hero is
   pinned by ScrollTrigger, so while the pin is engaged the section is
   position: fixed and its offset no longer describes where it starts - an
   anchor jump would land somewhere in the middle of the reveal. Scroll position
   0 is the hero at rest, which is what "Home" actually means here. */
export const scrollToTop = () => {
  if (lenis) {
    lenis.scrollTo(0);
    return;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* Anything that used to freeze the page with body overflow: hidden has to stop
   Lenis too, since Lenis reads the wheel rather than the scrollbar. */
export const pauseScroll = () => lenis?.stop();
export const resumeScroll = () => lenis?.start();

export const jumpToTop = () => {
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
};
