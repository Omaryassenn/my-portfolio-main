import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Experience.css';
import { getLenis, prefersReducedMotion } from '../lib/smoothScroll';

gsap.registerPlugin(ScrollTrigger);

/* Grouped by the year a role started, roles inside a year in the order they
   happened. `points` is a list because a role can have more than one thing
   worth saying and flattening them into one sentence loses the distinction. */
const TIMELINE = [
  {
    year: '2023',
    roles: [
      {
        date: 'Sep 2023 — Jul 2024',
        title: 'Coding Instructor',
        company: 'Techventure Academy',
        points: ['Teaching Python basics, data structures, OOP, HTML and CSS to kids aged 10–18.'],
      },
    ],
  },
  {
    year: '2024',
    roles: [
      {
        date: 'Jun 2024 — Sep 2024',
        title: 'Coding & UI/UX Instructor',
        company: 'iSchool',
        points: ['Teaching coding and UI/UX to kids aged 10–12.'],
      },
      {
        date: 'Sep 2024 — Feb 2025',
        title: 'UI/UX Designer',
        company: 'Giza Systems',
        points: [
          'Worked on the Aoun SaaS platform, redesigning the Admin Portal to improve usability and fix UX issues, and designing the Applicant Portal using the DGA Design System.',
        ],
      },
    ],
  },
  {
    year: '2025',
    roles: [
      {
        date: 'Mar 2025 — May 2025',
        title: 'UI/UX Designer (Freelance)',
        company: 'OneRythm',
        points: [
          'Designed modern, sleek dashboards focused on intuitive user experiences and real-time analytics for a Saudi-based startup.',
        ],
      },
      {
        date: 'Jul 2025 — Present',
        title: 'Product Designer',
        company: 'YOUXEL Technology',
        current: true,
        points: [
          'Sole product designer, leading the design of TORUK from its early stages — creating dashboards, workflow builder features and core product experiences.',
          'Collaborate closely with engineers and occasionally contribute to front-end implementation to ensure high-quality, consistent user experiences.',
        ],
      },
    ],
  },
  {
    year: '2026',
    roles: [
      {
        date: 'Jan 2026 — Feb 2026',
        title: 'UI/UX Designer (Freelance)',
        company: 'HUR Engineering',
        points: [
          "Designed the company's website, creating a modern, professional experience that showcases its engineering services, multidisciplinary expertise and integrated project management approach.",
        ],
      },
    ],
  },
];

const ROLE_COUNT = TIMELINE.reduce((sum, group) => sum + group.roles.length, 0);

const pad = (n) => String(n).padStart(2, '0');

const tabId = (year) => `xp-year-${year}`;
const panelId = (year) => `xp-roles-${year}`;

/* One line, as drawn. Still an array so the masked rise stays a per-line
   mechanism if the question is ever broken up again. */
const INTRO_LINES = ['So, where have I been?'];

/* Scrolling walks the years only where there is room to hold the section still
   for it. Narrow screens lay the years out as a strip and scroll normally, and
   a reduced-motion visitor should not have the page taken over at all. */
const SCRUB_QUERY = '(min-width: 901px)';

const canScrub = () =>
  typeof window !== 'undefined' &&
  !prefersReducedMotion() &&
  window.matchMedia(SCRUB_QUERY).matches;

/* How much scrolling each year is worth, as a share of a viewport. Below about
   half a viewport the years flick past faster than they can be read. */
const YEAR_RUNWAY = 0.7;

const Experience = () => {
  const introRef = useRef(null);
  const recordRef = useRef(null);
  const yearRefs = useRef([]);
  const markerRef = useRef(null);
  const scrubRef = useRef(null);

  const [active, setActive] = useState(0);
  const [scrubbing, setScrubbing] = useState(canScrub);
  const group = TIMELINE[active];

  useEffect(() => {
    const queries = [
      window.matchMedia(SCRUB_QUERY),
      window.matchMedia('(prefers-reduced-motion: reduce)'),
    ];
    const sync = () => setScrubbing(canScrub());
    queries.forEach((q) => q.addEventListener('change', sync));
    return () => queries.forEach((q) => q.removeEventListener('change', sync));
  }, []);

  // Intro: the question rises a line at a time as the section arrives.
  useEffect(() => {
    const root = introRef.current;
    if (!root) return undefined;

    const title = root.querySelector('.xp-intro__question');
    if (prefersReducedMotion()) {
      title.setAttribute('data-revealed', '');
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-revealed', '');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.35 },
    );
    io.observe(title);
    return () => io.disconnect();
  }, []);

  /* The question holds one full viewport while the record rides up over it —
     the same move the hero and its panel make, and for the same reason: with
     pinSpacing off the page height is untouched, so the slide is real scrolling
     rather than a transform and cannot drift out of step with the wheel. */
  useEffect(() => {
    const intro = introRef.current;
    if (!intro || prefersReducedMotion()) return undefined;

    const panel = recordRef.current;

    /* The intro is sized in svh — the viewport with a phone's address bar
       showing. Once that bar hides, the visible area outgrows the section and
       the panel would peek above the fold before any scrolling. Pad the
       shortfall so the question always owns exactly one viewport. */
    const introSlot = () => Math.max(intro.offsetHeight, window.innerHeight);
    const syncIntroSlot = () => {
      if (!panel) return;
      const shortfall = Math.max(0, window.innerHeight - intro.offsetHeight);
      panel.style.marginTop = shortfall ? `${shortfall}px` : '';
    };
    syncIntroSlot();
    // Runs before ScrollTrigger measures, so the pin distance and the padding
    // agree on every refresh rather than only the first.
    ScrollTrigger.addEventListener('refreshInit', syncIntroSlot);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: intro,
        start: 'top top',
        end: () => `+=${introSlot()}`,
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
    }, intro);

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', syncIntroSlot);
      if (panel) panel.style.marginTop = '';
      ctx.revert();
    };
  }, []);

  /* The record holds still and the years advance under the wheel: one slice of
     the pin per year, so scrolling down walks forward through them and scrolling
     back up rewinds. The scroll position is the only state — the highlight is
     derived from it, which is what stops a click and a scroll from disagreeing
     about which year is showing. */
  useEffect(() => {
    const record = recordRef.current;
    if (!record || !scrubbing) return undefined;

    const ctx = gsap.context(() => {
      scrubRef.current = ScrollTrigger.create({
        trigger: record,
        start: 'top top',
        end: () => `+=${TIMELINE.length * window.innerHeight * YEAR_RUNWAY}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          /* The last year owns the final slice outright: without the clamp a
             progress of exactly 1 would index one past the end. */
          const index = Math.min(
            Math.floor(self.progress * TIMELINE.length),
            TIMELINE.length - 1,
          );
          setActive(index);
        },
      });
    }, record);

    return () => {
      scrubRef.current = null;
      ctx.revert();
    };
  }, [scrubbing]);

  /* Choosing a year moves the page to that year's slice rather than setting the
     highlight directly — otherwise the next wheel event would recompute the
     year from a scroll position that never moved, and snap it back. */
  const chooseYear = useCallback((index) => {
    const scrub = scrubRef.current;
    if (!scrub) {
      setActive(index);
      return;
    }

    // Aim at the middle of the slice, so a nudge either way stays on the year.
    const span = scrub.end - scrub.start;
    const target = scrub.start + ((index + 0.5) / TIMELINE.length) * span;

    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target);
    else window.scrollTo({ top: target, behavior: 'smooth' });
  }, []);

  /* The marker is sized and placed from the chosen year's own box rather than
     from a row height — the active year sets larger than the rest, so a fixed
     step would drift off it. A layout effect, so it is measured after the size
     change lands and before the frame is painted. */
  const placeMarker = useCallback(() => {
    const year = yearRefs.current[active];
    const marker = markerRef.current;
    if (!year || !marker) return;
    /* Both axes are published and the stylesheet picks the one its rail is
       running along — the column turns into a strip on narrow screens, and an
       inline top/height here would outrank the media query that flips it. */
    marker.style.setProperty('--marker-block-start', `${year.offsetTop}px`);
    marker.style.setProperty('--marker-block-size', `${year.offsetHeight}px`);
    marker.style.setProperty('--marker-inline-start', `${year.offsetLeft}px`);
    marker.style.setProperty('--marker-inline-size', `${year.offsetWidth}px`);
  }, [active]);

  useLayoutEffect(placeMarker, [placeMarker]);

  useEffect(() => {
    const list = yearRefs.current[0]?.parentElement;
    if (!list) return undefined;

    const ro = new ResizeObserver(placeMarker);
    ro.observe(list);

    /* The marker's size comes from text metrics, and the first measurement
       happens on the fallback font — Satoshi arrives over the network. Waiting
       on the swap is what keeps the marker matched to the year rather than to
       whatever the system font happened to measure. */
    let live = true;
    document.fonts?.ready.then(() => {
      if (live) placeMarker();
    });

    return () => {
      live = false;
      ro.disconnect();
    };
  }, [placeMarker]);

  // Vertical tablist: up and down move between years, Home and End to the ends.
  const onKeyDown = (event) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next = null;

    if (keys[event.key]) next = (active + keys[event.key] + TIMELINE.length) % TIMELINE.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = TIMELINE.length - 1;
    if (next === null) return;

    event.preventDefault();
    chooseYear(next);
    yearRefs.current[next]?.focus();
  };

  return (
    /* Scoped so the pinned question cannot paint over what comes after it: a
       z-index on a relative element does not create a containing block, so the
       pin's position: fixed still works inside. */
    <div className="xp-chapter">
      <section className="xp-intro" id="experience" aria-labelledby="xp-title" ref={introRef}>
        <div className="xp-intro__inner">
          <h2 className="xp-intro__question" id="xp-title">
            {INTRO_LINES.map((line, i) => (
              <span className="xp-intro__line" key={line}>
                <span className="xp-intro__line-inner">
                  {line}
                  {i === INTRO_LINES.length - 1 && (
                    <span className="xp-accent" aria-hidden="true">
                      *
                    </span>
                  )}
                </span>
              </span>
            ))}
          </h2>

          <p className="xp-intro__meta">
            {pad(ROLE_COUNT)} roles · {TIMELINE[0].year} — now
          </p>

          
        </div>
      </section>

      <section className="xp" ref={recordRef} aria-labelledby="xp-timeline-title">
        <div className="xp__inner">
          <header className="xp__head">
            <h2 className="xp__head-label" id="xp-timeline-title">
              Experience
            </h2>
            <span className="xp__head-rule" aria-hidden="true" />
          </header>

          <div className="xp__body">
            <div className="xp-years">
              <span className="xp-years__rail" aria-hidden="true" />
              <span className="xp-years__marker" ref={markerRef} aria-hidden="true" />

              <div
                className="xp-years__list"
                role="tablist"
                aria-orientation="vertical"
                aria-label="Choose a year"
                onKeyDown={onKeyDown}
              >
                {TIMELINE.map(({ year }, i) => (
                  <button
                    type="button"
                    role="tab"
                    key={year}
                    id={tabId(year)}
                    className="xp-year"
                    ref={(el) => {
                      yearRefs.current[i] = el;
                    }}
                    aria-selected={active === i}
                    aria-controls={panelId(year)}
                    // Roving focus: the tablist is one stop, arrows move inside it.
                    tabIndex={active === i ? 0 : -1}
                    onClick={() => chooseYear(i)}
                    {...(active === i ? { 'data-active': '' } : null)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Keyed on the year so switching remounts the panel and replays its
                entrance, rather than swapping the words in place. */}
            <div
              className="xp-panel"
              key={group.year}
              id={panelId(group.year)}
              role="tabpanel"
              aria-labelledby={tabId(group.year)}
              tabIndex={-1}
            >
              {group.roles.map((role, i) => (
                <article
                  className="xp-role"
                  key={`${role.company}-${role.date}`}
                  style={{ '--role-index': i }}
                  {...(role.current ? { 'data-current': '' } : null)}
                >
                  <p className="xp-role__date">
                    {role.date}
                    {/* Decorative: the date already says "Present", and a second
                        badge would only be read out as more words. */}
                    {role.current && (
                      <span className="xp-role__now" aria-hidden="true">
                        <span className="xp-role__now-dot" />
                        Now
                      </span>
                    )}
                  </p>

                  <h3 className="xp-role__title">
                    {role.title}
                    <span className="xp-role__company"> — {role.company}</span>
                  </h3>

                  {role.points.map((point) => (
                    <p className="xp-role__point" key={point}>
                      {point}
                    </p>
                  ))}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Experience;
