import React, { useState, useEffect, useRef } from 'react';
import './Experience.css';

const experiences = [
  {
    year: '2022',
    jobs: [
      {
        date: 'Jan 2022 - Dec 2022',
        title: 'Frontend Developer & UI Designer',
        company: 'Freelancing',
        description: 'Collaborated with startups to design and build responsive, user-first websites and web apps.',
      },
    ],
  },
  {
    year: '2023',
    jobs: [
      {
        date: 'Jan 2023 - Dec 2023',
        title: 'Coding Instructor',
        company: 'Techventure',
        description: 'Taught Python basics, OOP, HTML & CSS to kids aged 10–18.',
      },
    ],
  },
  {
    year: '2024',
    jobs: [
      {
        date: 'Mar 2024 - Jun 2024',
        title: 'Coding Instructor',
        company: 'iSchool',
        description: 'Taught Coding and UI/UX to kids aged 10-12.',
      },
      {
        date: 'Sep 2024 - Feb 2025',
        title: 'UI/UX Designer',
        company: 'Giza Systems',
        description: 'Enhanced AOUN Admin Portal and designed Applicant Portal with user-centric workflows.',
      },
    ],
  },
  {
    year: '2025',
    jobs: [
      {
        date: 'Mar 2025 - Present',
        title: 'UI/UX Designer',
        company: 'Onerythme',
        description: 'Designing modern, sleek dashboards focused on intuitive UX and real-time analytics for a Saudi-based start-up.',
      },
    ],
  },
];

const Experience = () => {
  const [activeYear, setActiveYear] = useState('2024');
  const [isDragging, setIsDragging] = useState(false);
  const yearsRef = useRef(null);
  const timelineRef = useRef(null);

  const handleYearClick = (year) => {
    setActiveYear(year);
    scrollToYear(year);
  };

  const scrollToYear = (year) => {
    if (yearsRef.current) {
      const yearIndex = experiences.findIndex(exp => exp.year === year);
      const yearElement = yearsRef.current.children[yearIndex];
      if (yearElement) {
        const isHorizontalScroll = window.innerWidth <= 768;
        
        if (isHorizontalScroll) {
          const containerWidth = yearsRef.current.offsetWidth;
          const yearWidth = yearElement.offsetWidth;
          const scrollTo = yearElement.offsetLeft - (containerWidth / 2) + (yearWidth / 2);
          yearsRef.current.scrollTo({
            left: scrollTo,
            behavior: 'smooth'
          });
        } else {
          const containerHeight = yearsRef.current.offsetHeight;
          const yearHeight = yearElement.offsetHeight;
          const scrollTo = yearElement.offsetTop - (containerHeight / 2) + (yearHeight / 2);
          yearsRef.current.scrollTo({
            top: scrollTo,
            behavior: 'smooth'
          });
        }
      }
    }
  };

  const handleTimelineClick = (e) => {
    if (timelineRef.current) {
      const timeline = timelineRef.current;
      const rect = timeline.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const percentage = y / rect.height;
      const index = Math.min(
        Math.floor(percentage * experiences.length),
        experiences.length - 1
      );
      const year = experiences[index].year;
      setActiveYear(year);
      scrollToYear(year);
    }
  };

  const handleTimelineMouseDown = (e) => {
    setIsDragging(true);
    handleTimelineClick(e);
  };

  const handleTimelineMouseMove = (e) => {
    if (isDragging) {
      handleTimelineClick(e);
    }
  };

  const handleTimelineMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleTimelineMouseUp);
    document.addEventListener('mousemove', handleTimelineMouseMove);

    return () => {
      document.removeEventListener('mouseup', handleTimelineMouseUp);
      document.removeEventListener('mousemove', handleTimelineMouseMove);
    };
  }, [isDragging]);

  useEffect(() => {
    scrollToYear(activeYear);
  }, []);

  const activeExperience = experiences.find(exp => exp.year === activeYear);

  return (
    <section className="experience-section" id="experience">
      <h2 className="experience-title">
        Professional <span>Experience</span>
      </h2>
      <div className="experience-content">
        <div className="experience-years" ref={yearsRef}>
          {experiences.map((exp) => (
            <div
              key={exp.year}
              className={`experience-year${exp.year === activeYear ? ' active' : ''}`}
              onClick={() => handleYearClick(exp.year)}
            >
              {exp.year}
            </div>
          ))}
        </div>
        <div 
          className="experience-timeline" 
          ref={timelineRef}
          onMouseDown={handleTimelineMouseDown}
        >
          <div className="timeline-line">
            <div 
              className="timeline-indicator"
              style={{
                top: `${(experiences.findIndex(exp => exp.year === activeYear) / (experiences.length - 1)) * 100}%`,
                left: `${(experiences.findIndex(exp => exp.year === activeYear) / (experiences.length - 1)) * 100}%`
              }}
            />
          </div>
        </div>
        <div className="experience-details">
          {activeExperience.jobs.map((job, idx) => (
            <div key={`${activeYear}-${idx}`} className="experience-detail-card">
              <div className="exp-date">{job.date}</div>
              <div className="exp-title">
                {job.title} <span>– {job.company}</span>
              </div>
              <div className="exp-desc">{job.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience; 