import React from 'react';
import './Skills.css';
import { FiUser, FiCode, FiFramer } from 'react-icons/fi';
import { SiAdobexd, SiReact, SiTypescript, SiTailwindcss, SiGit, SiGithub, SiHtml5, SiJavascript, SiNotion } from 'react-icons/si';
import { TbBrandCss3, TbAccessible } from 'react-icons/tb';
import { RiFlowChart } from 'react-icons/ri';
import { BsPlayCircle } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';
import sitemapIcon from '../assets/sitemap.svg';
import figmaIcon from '../assets/FIGMAICON.svg';
import skillsGlow from '../assets/skillss.svg';
import { useTheme } from '../context/ThemeContext';
import ScrollAnimation from './ScrollAnimation';

const Skills = () => {
  const { isDarkMode } = useTheme();

  const skillCategories = [
    {
      title: 'UI/UX',
      description: 'User Interface and User Experience Design skills',
      skills: [
        { 
          name: 'Information Architecture', 
          icon: () => (
            <img 
              src={sitemapIcon} 
              alt=""
              role="presentation"
              className="skill-icon"
              style={{ 
                filter: isDarkMode ? 'brightness(0) invert(1)' : 'brightness(0)' 
              }} 
            />
          ), 
          color: '#4CAF50',
          isImage: true
        },
        { name: 'Wireframing', icon: FiFramer, color: isDarkMode ? '#ffffff' : '#000000' },
        { name: 'Usability testing', icon: FiUser, color: '#4CAF50' },
        { name: 'Adobe XD', icon: SiAdobexd, color: '#FF61F6' },
        { 
          name: 'Figma', 
          icon: () => (
            <img 
              src={figmaIcon} 
              alt=""
              role="presentation"
              className="skill-icon"
              style={{ 
                filter: isDarkMode ? 'none' : 'brightness(0)' 
              }} 
            />
          ), 
          color: '#F24E1E',
          isImage: true
        },
        { name: 'Accessibility', icon: TbAccessible, color: isDarkMode ? '#ffffff' : '#000000' },
        { name: 'Prototyping', icon: BsPlayCircle, color: isDarkMode ? '#ffffff' : '#000000' },
        { name: 'User flow', icon: RiFlowChart, color: '#4CAF50' },
        { name: 'UX Research', icon: BiSearch, color: isDarkMode ? '#ffffff' : '#000000' }
      ]
    },
    {
      title: 'Front-end',
      description: 'Front-end Development Technologies and Tools',
      skills: [
        { name: 'Notion', icon: SiNotion, color: isDarkMode ? '#ffffff' : '#000000' },
        { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
        { name: 'CSS3', icon: TbBrandCss3, color: '#1572B6' },
        { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
        { name: 'ReactJS', icon: SiReact, color: '#61DAFB' },
        { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
        { name: 'git', icon: SiGit, color: '#F05032' },
        { name: 'GitHub', icon: SiGithub, color: isDarkMode ? '#ffffff' : '#000000' },
        { name: 'REST APIs', icon: FiCode, color: '#00FF9D' },
        { name: 'HTML5', icon: SiHtml5, color: '#E34F26' }
      ]
    }
  ];

  const renderSkillItems = (skills) => {
    const repeatedSkills = [...skills, ...skills, ...skills];
    
    return repeatedSkills.map((skill, skillIndex) => (
      <div 
        key={`${skill.name}-${skillIndex}`} 
        className="skill-item"
        role="listitem"
        aria-label={`${skill.name} skill`}
      >
        <div 
          className="skill-icon-wrapper" 
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          aria-hidden="true"
        >
          {skill.isImage ? (
            <skill.icon />
          ) : (
            <skill.icon style={{ color: skill.color }} className="skill-icon" />
          )}
        </div>
        <span className="skill-name" data-skill={skill.name}>{skill.name}</span>
      </div>
    ));
  };

  return (
    <section className="skills-section" id="skills" aria-labelledby="skills-title">
      <img src={skillsGlow} alt="" className="skills-glow" aria-hidden="true" />
      
        <h2 className="skills-title" id="skills-title">
          Skills <span className="visually-hidden">and</span> <span className="gradient-text">Tools</span>
        </h2>
      

      <div className="skills-container">
        {skillCategories.map((category, index) => (
            <div className="skill-category" role="region" aria-label={category.description}>
              <h3 className="category-title">{category.title}</h3>
              <div 
                className="skills-scroll-container"
                role="list"
                aria-label={`${category.title} skills`}
              >
                <div className="skills-track">
                  {renderSkillItems(category.skills)}
                </div>
              </div>
            </div>
            
        ))}
      </div>
    </section>
  );
};

export default Skills; 