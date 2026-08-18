import React, { useCallback, useEffect, useRef, useState } from 'react';
import './Work.css';
import hawkeye from '../assets/work/hawksm.webp';
import hawkeyeMobile from '../assets/work/hawksm.webp';
import onerythme from '../assets/work/One.webp';
import neuropulse from '../assets/work/Neuropulse.webp';
import fabmarket from '../assets/work/fab.webp';
import stackaroo from '../assets/work/stack.webp';
import chic from '../assets/work/chic.webp';
import inno from '../assets/work/innocreatives.webp';
import stego from '../assets/work/stego.webp';
import banking from '../assets/work/banking.webp';
import workhub from '../assets/work/workhub.webp';
import readlyai from '../assets/work/ReadlyAI.webp';
import { FiArrowUpRight, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const VIEW_ALL = 'https://dribbble.com/OmarYassenn';

const PROJECTS = [
  
  {
    title: 'WorkHub Egypt',
    image: workhub,
    link: 'https://www.behance.net/gallery/228002787/WorkHub-Egypt?tracking_source=search_projects|workhub+egypt&l=0',
  },
  {
    title: 'NeuroPulse Landing-Page',
    image: neuropulse,
    link: 'https://dribbble.com/shots/25991747-AI-Startup-Responsive-Landing-Page',
  },
  {
    title: 'FAB Market Mobile App',
    image: fabmarket,
    link: 'https://dribbble.com/shots/24840522-NatureNosh-Wholesale-supply-app',
  },
  {
    title: 'Hawk-Eye Website',
    image: { desktop: hawkeye, mobile: hawkeyeMobile },
    link: 'https://dribbble.com/shots/25752521-HawkEye-Revolutionizing-RFP-Analysis-with-AI',
  },
  {
    title: 'Inno-Creatives',
    image: inno,
    link: 'https://dribbble.com/shots/25868593-Landing-Page-for-an-agency-company',
  },
  {
    title: 'OneRythme Dashboards',
    image: onerythme,
    link: 'https://dribbble.com/shots/26007618-Dashboard-Analysis',
  },
  {
    title: 'Stackaroo',
    image: stackaroo,
    link: 'https://dribbble.com/shots/25895850-A-Cartoon-Themed-Landing-Page-for-Effortless-DevOps',
  },
  {
    title: 'Chic Interiors',
    image: chic,
    link: 'https://dribbble.com/shots/25885873-Chic-Interiors-Landing-Page',
  },
  
  {
    title: 'Banking Company',
    image: banking,
    link: 'https://dribbble.com/shots/25840708-A-landing-page-for-a-banking-company',
  },
  {
    title: 'ReadlyAI',
    image: readlyai,
    link: 'https://dribbble.com/shots/26161257-AI-SaaS-Hero-Section',
  },
  {
    title: 'Stegnography',
    image: stego,
    link: 'https://dribbble.com/shots/22322962-Steganography-Landing-page',
  },
];

/* Read off the link rather than stored twice: where a piece lives is a fact
   about its URL, and a hand-kept copy of it would drift. */
const hostOf = (url) => {
  if (/dribbble\.com/i.test(url)) return 'Dribbble';
  if (/behance\.net/i.test(url)) return 'Behance';
  return 'Case study';
};

const pad = (n) => String(n).padStart(2, '0');

const Work = () => {
  const railRef = useRef(null);
  const [loaded, setLoaded] = useState({});
  const [progress, setProgress] = useState({ start: 0, size: 1, atStart: true, atEnd: false });

  const handleImageLoad = (title) => setLoaded((prev) => ({ ...prev, [title]: true }));

  /* One indicator doing two jobs: how much of the rail is on screen (the bar's
     width) and where in it you are (its offset). */
  const syncProgress = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const scrollable = rail.scrollWidth - rail.clientWidth;
    const size = rail.scrollWidth ? rail.clientWidth / rail.scrollWidth : 1;
    const ratio = scrollable > 1 ? rail.scrollLeft / scrollable : 0;
    setProgress({
      size,
      start: ratio * (1 - size),
      atStart: rail.scrollLeft <= 1,
      atEnd: scrollable > 1 ? rail.scrollLeft >= scrollable - 1 : true,
    });
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;
    syncProgress();
    const ro = new ResizeObserver(syncProgress);
    ro.observe(rail);
    return () => ro.disconnect();
  }, [syncProgress]);

  // A card plus its gap, so a step always lands on a card edge.
  const step = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector('.project');
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
    const distance = card ? card.getBoundingClientRect().width + gap : rail.clientWidth * 0.8;
    rail.scrollBy({ left: distance * direction, behavior: 'smooth' });
  };

  return (
    <section className="work" id="work" aria-labelledby="work-title">
      <div className="work__inner">
        <header className="work__head">
          <span className="work__eyebrow">Selected work</span>
          <span className="work__rule" aria-hidden="true" />
          
        </header>

        <div className="work__lede">
          <h2 className="work__title" id="work-title">
            Interfaces designed and shipped
            <span className="work__accent" aria-hidden="true">
              *
            </span>
          </h2>

          <a className="work__all" href={VIEW_ALL} target="_blank" rel="noopener noreferrer">
            Open Dribbble
            <FiArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Breaks the gutter so the rail runs off both edges of the screen, while
          the first card still starts on the page's own margin. */}
      <div className="work__rail" ref={railRef} onScroll={syncProgress}>
        {PROJECTS.map((project, i) => (
          <a
            key={project.title}
            className="project"
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title} on ${hostOf(project.link)}`}
          >
            <div className="project__media">
              {!loaded[project.title] && <span className="project__skeleton" aria-hidden="true" />}
              {typeof project.image === 'object' ? (
                <>
                  <img
                    src={project.image.desktop}
                    alt={project.title}
                    className="project__img project__img--desktop"
                    style={{ opacity: loaded[project.title] ? 1 : 0 }}
                    onLoad={() => handleImageLoad(project.title)}
                  />
                  <img
                    src={project.image.mobile}
                    alt=""
                    className="project__img project__img--mobile"
                    style={{ opacity: loaded[project.title] ? 1 : 0 }}
                    onLoad={() => handleImageLoad(project.title)}
                  />
                </>
              ) : (
                <img
                  src={project.image}
                  alt={project.title}
                  className="project__img"
                  style={{ opacity: loaded[project.title] ? 1 : 0 }}
                  onLoad={() => handleImageLoad(project.title)}
                />
              )}
            </div>

            <div className="project__bar">
              <span className="project__text">
                <span className="project__meta">
                  <span className="project__index">{pad(i + 1)}</span>
                  {hostOf(project.link)}
                </span>
                <span className="project__name">{project.title}</span>
              </span>
              <span className="project__go" aria-hidden="true">
                <FiArrowUpRight />
              </span>
            </div>
          </a>
        ))}
      </div>

      <div className="work__inner">
        <div className="work__controls">
          <div className="work__progress" aria-hidden="true">
            <span
              className="work__progress-bar"
              style={{
                width: `${progress.size * 100}%`,
                transform: `translateX(${(progress.start / Math.max(progress.size, 0.0001)) * 100}%)`,
              }}
            />
          </div>

          <div className="work__nav">
            <button
              type="button"
              className="work__arrow"
              onClick={() => step(-1)}
              disabled={progress.atStart}
              aria-label="Previous projects"
            >
              <FiArrowLeft />
            </button>
            <button
              type="button"
              className="work__arrow"
              onClick={() => step(1)}
              disabled={progress.atEnd}
              aria-label="Next projects"
            >
              <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Work;
