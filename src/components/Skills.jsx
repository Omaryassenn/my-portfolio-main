import React, { useEffect, useState } from 'react';
import './Skills.css';
import { prefersReducedMotion } from '../lib/smoothScroll';
import { FiUser, FiCode, FiFramer } from 'react-icons/fi';
import {
  SiAdobexd,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiNotion,
} from 'react-icons/si';
import { TbBrandCss3, TbAccessible } from 'react-icons/tb';
import { RiFlowChart } from 'react-icons/ri';
import { BsPlayCircle } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';
import sitemapIcon from '../assets/sitemap.svg';
import figmaIcon from '../assets/FIGMAICON.svg';

/* Brand colours are carried but not worn: every mark sits monochrome in the
   band and only takes its own colour under the cursor, which keeps a row of
   twenty logos from turning into confetti. `tone: 'flat'` marks an image that is
   a single-colour glyph, so it is only ever inverted to match the theme. */
const CATEGORIES = [
  {
    title: 'UI/UX',
    skills: [
      { name: 'Information Architecture', img: sitemapIcon, tone: 'flat' },
      { name: 'Wireframing', icon: FiFramer },
      { name: 'Usability Testing', icon: FiUser, color: '#4CAF50' },
      { name: 'Adobe XD', icon: SiAdobexd, color: '#FF61F6' },
      { name: 'Figma', img: figmaIcon, tone: 'color' },
      { name: 'Accessibility', icon: TbAccessible },
      { name: 'Prototyping', icon: BsPlayCircle },
      { name: 'User Flow', icon: RiFlowChart, color: '#4CAF50' },
      { name: 'UX Research', icon: BiSearch },
    ],
  },
  {
    title: 'Front-end',
    skills: [
      { name: 'HTML5', icon: SiHtml5, color: '#E34F26' },
      { name: 'CSS3', icon: TbBrandCss3, color: '#1572B6' },
      { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
      { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
      { name: 'ReactJS', icon: SiReact, color: '#61DAFB' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
      { name: 'REST APIs', icon: FiCode, color: '#00FF9D' },
      { name: 'Git', icon: SiGit, color: '#F05032' },
      { name: 'GitHub', icon: SiGithub },
      { name: 'Notion', icon: SiNotion },
    ],
  },
];

/* Three passes of each list, and the track travels exactly one pass. Two would
   leave a gap on an ultrawide screen before the loop came round. With no motion
   there is no loop to fill, and the repeats would just be the same list printed
   three times. */
const LOOP_PASSES = 3;

const pad = (n) => String(n).padStart(2, '0');

const SkillMark = ({ skill }) =>
  skill.img ? (
    <img className={`skill__img skill__img--${skill.tone}`} src={skill.img} alt="" />
  ) : (
    <skill.icon className="skill__glyph" />
  );

const Skills = () => {
  const [passes, setPasses] = useState(() => (prefersReducedMotion() ? 1 : LOOP_PASSES));

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setPasses(query.matches ? 1 : LOOP_PASSES);
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return (
    <section className="skills" id="skills" aria-labelledby="skills-title">
      <div className="skills__inner">
      <header className="skills__head">
        <h2 className="skills__label" id="skills-title">
          Skills &amp; tools
        </h2>
        <span className="skills__rule" aria-hidden="true" />
       
      </header>

      <div className="skills__rows">
        {CATEGORIES.map((category, i) => (
          <section className="skill-row" key={category.title}>
            <h3 className="skill-row__title">
              <span className="skill-row__index" aria-hidden="true">
                {pad(i + 1)}
              </span>
              {category.title}
            </h3>

            {/* Full-bleed band: the header keeps the page's gutter, the marquee
                runs to the edges of the screen. */}
            <div className="skill-row__band">
              <ul className="skill-row__track">
                {Array.from({ length: passes }).flatMap((_, pass) =>
                  category.skills.map((skill) => (
                    <li
                      className="skill"
                      key={`${skill.name}-${pass}`}
                      style={skill.color ? { '--skill-color': skill.color } : undefined}
                      /* Only the first pass is read out; the rest are the same
                         list again for the loop. */
                      aria-hidden={pass > 0 ? 'true' : undefined}
                    >
                      <span className="skill__dot" aria-hidden="true" />
                      <span className="skill__mark">
                        <SkillMark skill={skill} />
                      </span>
                      <span className="skill__name">{skill.name}</span>
                    </li>
                  )),
                )}
              </ul>
            </div>
          </section>
        ))}
      </div>
      </div>
    </section>
  );
};

export default Skills;
