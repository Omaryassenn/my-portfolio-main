import React, { useEffect, useRef, useState } from 'react';
import Button from './Button';
import './About.css';
import { FiArrowUpRight } from 'react-icons/fi';

const TITLE_LINES = ['Designing with', 'logic, building', 'with purpose'];

const STATS = [
  { value: 3, label: 'Years' },
  { value: 10, label: 'Projects' },
  { value: 10, label: 'Clients' },
];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const useReveal = (rootRef) => {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const items = Array.from(root.querySelectorAll('[data-reveal]'));
    if (prefersReducedMotion()) {
      items.forEach((el) => el.setAttribute('data-revealed', ''));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.setAttribute('data-revealed', '');
          io.unobserve(en.target);
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${(i % 4) * 0.08}s`);
      io.observe(el);
    });
    return () => io.disconnect();
  }, [rootRef]);
};

/* Counts up once the figure scrolls into view. */
const CountUp = ({ end, duration = 1500, delay = 0 }) => {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const frameRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (prefersReducedMotion()) {
      setValue(end);
      return undefined;
    }

    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting || started) return;
          started = true;
          io.unobserve(en.target);

          timerRef.current = window.setTimeout(() => {
            const startedAt = performance.now();
            const tick = (now) => {
              const t = Math.min((now - startedAt) / duration, 1);
              // easeOutCubic — fast off the line, gentle settle onto the value.
              const eased = 1 - Math.pow(1 - t, 3);
              setValue(Math.round(end * eased));
              if (t < 1) frameRef.current = requestAnimationFrame(tick);
            };
            frameRef.current = requestAnimationFrame(tick);
          }, delay);
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(frameRef.current);
      window.clearTimeout(timerRef.current);
    };
  }, [end, duration, delay]);

  return <span ref={ref}>{value}</span>;
};

const About = () => {
  const rootRef = useRef(null);
  useReveal(rootRef);

  return (
    <section id="about" className="about" aria-labelledby="about-title" ref={rootRef}>
      <div className="about__inner">
        <div className="about__eyebrow" data-reveal>
          <span>Who am I</span>
          <span className="about__rule" aria-hidden="true" />
        </div>

        <div className="about__main">
          <h2 id="about-title" className="about__title" data-reveal>
            {TITLE_LINES.map((line, i) => (
              <span className="about__line" key={line}>
                <span className="about__line-inner">
                  {line}
                  {i === TITLE_LINES.length - 1 && (
                    <span className="about__asterisk" aria-hidden="true">
                      *
                    </span>
                  )}
                </span>
              </span>
            ))}
          </h2>

          <div className="about__intro" data-reveal>
            <p>
              I design the thing and then I build it. No handoff deck, no &ldquo;that&apos;s not
              technically possible&rdquo; three weeks in — one person accountable for how it looks
              and how it behaves.
            </p>
            <a href="/Omar-Yassen.pdf" download aria-label="Download my CV in PDF format">
              <Button variant="primary" icon={FiArrowUpRight} id="download-cv">
                Download CV
              </Button>
            </a>
          </div>
        </div>

        <dl className="about__stats">
          {STATS.map(({ value, label }, i) => (
            <div className="about-stat" key={label} data-reveal>
              <dt className="about-stat__value">
                <span className="about-stat__plus" aria-hidden="true">
                  +
                </span>
                <CountUp end={value} delay={i * 120} />
              </dt>
              <dd className="about-stat__label">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default About;
