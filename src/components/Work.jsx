import React, { useState } from 'react';
import './Work.css';
import hawkeye from '../assets/hawk.svg';
import onerythme from '../assets/One.svg';
import neuropulse from '../assets/Neuropulse.svg';
import fabmarket from '../assets/FABmarket.svg';
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
import { FiArrowUpRight } from 'react-icons/fi';
import Pagination from './Pagination';

const Work = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 4;

  const allProjects = [
    {
      title: 'Hawk-Eye Website',
      role: 'UI/UX Designer',
      image: hawkeye,
      size: 'small',
      link: 'https://dribbble.com/shots/25752521-HawkEye-Revolutionizing-RFP-Analysis-with-AI',
    },
    {
      title: 'OneRythme Dashboards',
      role: 'UI/UX Designer',
      image: onerythme,
      size: 'big',
      link: 'https://dribbble.com/shots/26007618-Dashboard-Analysis',
    },
    {
      title: 'NeuroPulse Landing-Page',
      role: 'UI/UX Designer',
      image: neuropulse,
      size: 'medium',
      link: 'https://dribbble.com/shots/25991747-AI-Startup-Responsive-Landing-Page',
    },
    {
      title: 'FAB Market Mobile App',
      role: 'UI/UX Designer',
      image: fabmarket,
      size: 'medium',
      link: 'https://dribbble.com/shots/24840522-NatureNosh-Wholesale-supply-app',
    },
    {
      title: 'Inno-Creatives',
      role: 'UI/UX Designer',
      image: inno,
      size: 'small',
      link: 'https://dribbble.com/shots/25885873-Chic-Interiors-Landing-Page',
    },
    {
      title: 'SecOne4ALL',
      role: 'UI/UX Designer & Developer',
      image: sec,
      size: 'big',
      link: 'https://dribbble.com/shots/24848550-SecOne4all-for-hacking-services',
    },
    {
      title: 'Stackaroo',
      role: 'UI/UX Designer',
      image: stackaroo,
      size: 'medium',
      link: 'https://dribbble.com/shots/25895850-A-Cartoon-Themed-Landing-Page-for-Effortless-DevOps',
    },
    {
      title: 'Chic Interiors',
      role: 'UI/UX Designer',
      image: chic,
      size: 'medium',
      link: 'https://dribbble.com/shots/25885873-Chic-Interiors-Landing-Page',
    },
    {
      title: 'Stegnography',
      role: 'UI/UX Designer',
      image: stego,
      size: 'small',
      link: 'https://dribbble.com/shots/22322962-Steganography-Landing-page',
    },
    {
      title: 'Banking Company',
      role: 'UI/UX Designer',
      image: banking,
      size: 'big',
      link: 'https://dribbble.com/shots/25840708-A-landing-page-for-a-banking-company',
    },
    {
      title: 'Broskies yearbook',
      role: 'UI/UX Designer & Developer',
      image: broskies,
      size: 'medium',
      link: 'https://broskies-yearbook.vercel.app/',
    },
    {
      title: 'Coffee Shop App',
      role: 'UI/UX Designer',
      image: coffe,
      size: 'medium',
      link: 'https://dribbble.com/shots/25860393-Coffee-Shop-app',
    },
    {
      title: 'Order-Tracking App',
      role: 'UI/UX Designer & Developer',
      image: order,
      size: 'medium',
      link: 'https://order-tracker-chi.vercel.app/',
    },
    {
      title: 'Job-Search App',
      role: 'UI/UX Designer',
      image: job,
      size: 'medium',
      link: 'https://dribbble.com/shots/25827878-TalentCare-for-job-search',
    },

    
    
  ];

  const totalPages = Math.ceil(allProjects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = allProjects.slice(indexOfFirstProject, indexOfLastProject);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of work section smoothly
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
      <img src={project.image} alt={project.title} />
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