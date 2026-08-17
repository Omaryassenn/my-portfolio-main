import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HeroReveal.css';
import { prefersReducedMotion } from '../../lib/smoothScroll';

gsap.registerPlugin(ScrollTrigger);

/* Card artwork is whatever sits in assets/reveal, sorted by filename - so the
   set is changed by adding or removing files, with no code edit. Prefix them
   1-, 2-, 3- to control the order they enter the frame. Everything downstream
   (slots, travel depth, scroll timing) is derived from the count.
   Keep them as raster files at roughly twice their largest on-screen width; the
   source project SVGs run 0.3-5.5MB each and would put ~10MB of artwork into
   the second viewport. */
const ART = import.meta.glob('../../assets/reveal/*.{webp,png,jpg,jpeg,avif}', {
  eager: true,
  import: 'default',
});

/* Slot drives horizontal placement. `travelTime` is how much of the scrub a card
   spends crossing the frame - every card covers the same distance, so a shorter
   time means a faster card, which is what sells the parallax. Cycled so any
   number of cards stays alternating left/right with varied speeds. */
const SLOTS = ['one', 'two', 'three'];
const TRAVEL_TIMES = [0.62, 0.78, 0.55];

const CARDS = Object.keys(ART)
  .sort()
  .map((path, i) => ({
    src: ART[path],
    key: path.split('/').pop(),
    slot: SLOTS[i % SLOTS.length],
    travelTime: TRAVEL_TIMES[i % TRAVEL_TIMES.length],
  }));

const LINES = [
  { text: '+3 Years' },
  { text: 'Between the file' },
  { text: 'and the branch', star: true },
];

const TEXT_START = '#1f1f1f';
const TEXT_END = '#ffffff';

/* The heading brightens a line at a time, and within each line the lift travels
   left to right across the words. LINE_STEP is when each line starts, SWEEP is
   how long the lift takes to cross one line, WORD_DUR is how long a single word
   takes to go dark grey -> white. The last line lands on
   2*0.24 + 0.22 + 0.28 = 0.98, so the heading is fully white just before the
   scrub ends. */
const LINE_STEP = 0.24;
const SWEEP = 0.22;
const WORD_DUR = 0.28;

/* Two viewports of runway on desktop is enough for the cards to cross the frame
   without the pin overstaying its welcome. Phones get less because the same
   distance costs many more swipes. */
const runway = () =>
  window.innerHeight * (window.matchMedia('(max-width: 768px)').matches ? 1.5 : 2.2);

/* Spread the entrances across the first half of the scrub so the field stays in
   continuous motion instead of reading as N separate entrances. Derived from the
   card count so the rhythm holds whether there are two cards or six. */
const leadFor = (i, total) => (total < 2 ? 0 : (i / (total - 1)) * 0.5);

const HeroReveal = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const lines = section.querySelectorAll('.hero-reveal-line');
    const cards = section.querySelectorAll('.hero-reveal-card');
    const hero = document.querySelector('.hero-section');

    if (prefersReducedMotion()) {
      // Land straight on the finished state rather than animating into it.
      gsap.set(section.querySelectorAll('.hero-reveal-word'), { color: TEXT_END });
      gsap.set(cards, { y: 0 });
      return undefined;
    }

    /* The hero uses min-height: 100svh, which on phones is the viewport with the
       address bar showing. Once that bar hides, the visible area grows past the
       hero and this panel would peek above the fold before any scrolling. Pad
       the shortfall so the hero always owns exactly one full viewport, and
       nothing below it is visible at rest. */
    const heroSlot = () => Math.max(hero?.offsetHeight ?? 0, window.innerHeight);
    const syncHeroSlot = () => {
      if (!hero) return;
      const shortfall = Math.max(0, window.innerHeight - hero.offsetHeight);
      section.style.marginTop = shortfall ? `${shortfall}px` : '';
    };
    syncHeroSlot();
    // Runs before ScrollTrigger measures, so the pin distances below agree with
    // the padding on every refresh, not just the first.
    ScrollTrigger.addEventListener('refreshInit', syncHeroSlot);

    const ctx = gsap.context(() => {
      /* 1. Lock the hero for exactly one viewport of scrolling.
            pinSpacing: false leaves the page height untouched, so this panel
            rides up over the hero at true scroll speed. That upward slide is
            real scrolling rather than a transform, which is precisely why it
            cannot drift out of sync with the wheel. */
      if (hero) {
        ScrollTrigger.create({
          trigger: hero,
          start: 'top top',
          end: () => `+=${heroSlot()}`,
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
      }

      /* 2. Once the panel has covered the hero, hold it and scrub the text
            brightening and the card travel off a single timeline, so both are
            mapped to scroll progress instead of firing on their own clocks. */
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${runway()}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      /* Dark grey through mid grey to white, a line at a time, with the lift
         travelling left to right across each line's words. A linear tween passes
         through the mid greys on its own, so no intermediate keyframe is needed.
         `stagger.amount` spreads the sweep over a fixed slice of the scrub no
         matter how many words a line has, which keeps every line taking the same
         time to cross even though they are different lengths. */
      lines.forEach((line, i) => {
        const words = line.querySelectorAll('.hero-reveal-word');
        if (!words.length) return;
        tl.fromTo(
          words,
          { color: TEXT_START },
          {
            color: TEXT_END,
            duration: WORD_DUR,
            stagger: { amount: SWEEP, from: 'start' },
          },
          i * LINE_STEP,
        );
      });

      /* Below the fold, up through the section, out past the top.
         `fromTo` renders its start value as soon as it is created, so the start
         has to put the card COMPLETELY below the viewport - parking it partly
         on screen leaves every card that is waiting its turn stacked as a visible
         strip along the bottom edge. Likewise the end clears the card's own
         height so it fully exits rather than clipping at the top. */
      cards.forEach((card, i) => {
        tl.fromTo(
          card,
          { y: () => window.innerHeight + 40 },
          {
            y: () => -(card.offsetHeight + 40),
            duration: CARDS[i].travelTime,
          },
          leadFor(i, cards.length),
        );
      });
    }, section);

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', syncHeroSlot);
      section.style.marginTop = '';
      ctx.revert();
    };
  }, []);

  return (
    <section className="hero-reveal" ref={sectionRef} aria-label="Introduction">
      <div className="hero-reveal-stage">
        {/* Split per word so the brightening can travel across each line rather
            than lifting the whole line at once. Real spaces are kept between the
            spans, so wrapping, centring and text selection behave as if this
            were plain text. */}
        <h2 className="hero-reveal-heading">
          {LINES.map((line) => {
            const words = line.text.split(' ');
            return (
              <span className="hero-reveal-line" key={line.text}>
                {words.map((word, i) => (
                  <React.Fragment key={`${line.text}-${word}-${i}`}>
                    {i > 0 && ' '}
                    <span className="hero-reveal-word">
                      {word}
                      {/* Glued to the final word so it can never wrap alone. */}
                      {line.star && i === words.length - 1 && (
                        <span className="hero-reveal-accent">*</span>
                      )}
                    </span>
                  </React.Fragment>
                ))}
              </span>
            );
          })}
        </h2>

        <div className="hero-reveal-cards" aria-hidden="true">
          {CARDS.map((card) => (
            <figure className={`hero-reveal-card slot-${card.slot}`} key={card.key}>
              <img src={card.src} alt="" loading="lazy" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroReveal;
