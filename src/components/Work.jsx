import React, { useState } from 'react';
import './Work.css';
import hawkeye from '../assets/hawksm.svg';
import hawkeyeMobile from '../assets/hawksm.svg';
import onerythme from '../assets/One.svg';
import neuropulse from '../assets/Neuropulse.svg';
import fabmarket from '../assets/fab.svg';
import sec from '../assets/secone.svg';
import stackaroo from '../assets/stack.svg';
import chic from '../assets/chic.svg';
import inno from '../assets/innocreatives.svg';
import coffe from '../assets/coffe.svg';
import broskies from '../assets/broskies.svg';
import stego from '../assets/stego.svg';
import banking from '../assets/banking.svg';
import order from '../assets/orders.svg';
import job from '../assets/job.svg';
import workhub from '../assets/workhub.svg';
import readlyai from '../assets/ReadlyAI.svg';
import { FiArrowUpRight } from 'react-icons/fi';
import Pagination from './Pagination';

const Work = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedImages, setLoadedImages] = useState({});
  const projectsPerPage = 4;

  const allProjects = [
    {
      title: 'Hawk-Eye Website',
     
      image: {
        desktop: hawkeye,
        mobile: hawkeyeMobile
      },
      size: 'small',
      link: 'https://dribbble.com/shots/25752521-HawkEye-Revolutionizing-RFP-Analysis-with-AI',
    },
    {
      title: 'WorkHub Egypt',
     
      image: workhub,
      size: 'big',
      link: 'https://www.behance.net/gallery/228002787/WorkHub-Egypt?tracking_source=search_projects|workhub+egypt&l=0',
    },
    {
      title: 'NeuroPulse Landing-Page',
     
      image: neuropulse,
      size: 'medium',
      link: 'https://dribbble.com/shots/25991747-AI-Startup-Responsive-Landing-Page',
    },
    {
      title: 'FAB Market Mobile App',
     
      image: fabmarket,
      size: 'medium',
      link: 'https://dribbble.com/shots/24840522-NatureNosh-Wholesale-supply-app',
    },
    {
      title: 'Inno-Creatives',
     
      image: inno,
      size: 'small',
      link: 'https://dribbble.com/shots/25868593-Landing-Page-for-an-agency-company',
    },
    {
      title: 'OneRythme Dashboards',
     
      image: onerythme,
      size: 'big',
      link: 'https://dribbble.com/shots/26007618-Dashboard-Analysis',
    },
    {
      title: 'Stackaroo',
     
      image: stackaroo,
      size: 'medium',
      link: 'https://dribbble.com/shots/25895850-A-Cartoon-Themed-Landing-Page-for-Effortless-DevOps',
    },
    {
      title: 'Chic Interiors',
     
      image: chic,
      size: 'medium',
      link: 'https://dribbble.com/shots/25885873-Chic-Interiors-Landing-Page',
    },
    {
      title: 'Stegnography',
     
      image: stego,
      size: 'small',
      link: 'https://dribbble.com/shots/22322962-Steganography-Landing-page',
    },
    {
      title: 'Banking Company',
     
      image: banking,
      size: 'big',
      link: 'https://dribbble.com/shots/25840708-A-landing-page-for-a-banking-company',
    },
    {
      title: 'ReadlyAI',
     
      image: readlyai,
      size: 'medium',
      link: 'https://dribbble.com/shots/26161257-AI-SaaS-Hero-Section',
    }, 
    
    
  ];

  const totalPages = Math.ceil(allProjects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = allProjects.slice(indexOfFirstProject, indexOfLastProject);

  const handleImageLoad = (projectTitle) => {
    setLoadedImages(prev => ({
      ...prev,
      [projectTitle]: true
    }));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setLoadedImages({}); // Reset loaded images state when changing page
    document.querySelector('.work-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="work-section" id="work">
      <h2 className="work-title">
        My <span>Work</span>
      </h2>
      <div className="work-grid">
        {currentProjects.map((project, index) => (
          <div key={index} className={`work-card ${project.size}`}>
            <div className="card-content">
              {!loadedImages[project.title] && <div className="skeleton-loader" />}
              {typeof project.image === 'object' ? (
                <>
                  <img
                    src={project.image.desktop}
                    alt={project.title}
                    className="desktop-image"
                    style={{ opacity: loadedImages[project.title] ? 1 : 0 }}
                    onLoad={() => handleImageLoad(project.title)}
                  />
                  <img
                    src={project.image.mobile}
                    alt={project.title}
                    className="mobile-image"
                    style={{ opacity: loadedImages[project.title] ? 1 : 0 }}
                    onLoad={() => handleImageLoad(project.title)}
                  />
                </>
              ) : (
                <img
                  src={project.image}
                  alt={project.title}
                  style={{ opacity: loadedImages[project.title] ? 1 : 0 }}
                  onLoad={() => handleImageLoad(project.title)}
                />
              )}
              <div className="card-overlay">
                <div className="card-info">
                  <p className="card-role">{project.role}</p>
                  <h3 className="card-title">{project.title}</h3>
                </div>
                <a 
                  href={project.link} 
                  className="card-arrow" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <FiArrowUpRight />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </section>
  );
};

export default Work; 