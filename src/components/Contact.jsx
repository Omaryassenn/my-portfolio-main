import React from 'react';
import './Contact.css';
import { FiArrowUpRight, FiMapPin, FiMail, FiPhone } from 'react-icons/fi';
import { FaDribbble, FaLinkedinIn, FaInstagram, FaGithub } from 'react-icons/fa';
import contactGlow from '../assets/contactglow.svg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      const response = await fetch("https://formsubmit.co/ajax/oyassen43@gmail.com", {
        method: "POST",
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      if (response.ok) {
        toast.success("Message sent successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          style: {
            background: 'var(--card-bg)',
            color: 'var(--text-color)',
            borderRadius: '12px',
            border: '1px solid rgba(var(--text-rgb), 0.1)',
            fontSize: '1rem',
            fontFamily: 'Inter, sans-serif',
          },
        });
        e.target.reset(); // Clear form
      } else {
        toast.error("Failed to send message. Please try again.", {
          position: "top-center",
          theme: "dark",
          style: {
            background: 'var(--card-bg)',
            color: 'var(--text-color)',
            borderRadius: '12px',
            border: '1px solid rgba(var(--text-rgb), 0.1)',
            fontSize: '1rem',
            fontFamily: 'Inter, sans-serif',
          },
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.", {
        position: "top-center",
        theme: "dark",
        style: {
          background: 'var(--card-bg)',
          color: 'var(--text-color)',
          borderRadius: '12px',
          border: '1px solid rgba(var(--text-rgb), 0.1)',
          fontSize: '1rem',
          fontFamily: 'Inter, sans-serif',
        },
      });
    }
  };

  return (
    
    <section className="contact-section" id="contact">
      
      <div className="contact-container">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{
          top: '20px',
        }}
        toastStyle={{
          background: 'var(--card-bg)',
          color: 'var(--text-color)',
          borderRadius: '12px',
          border: '1px solid rgba(var(--text-rgb), 0.1)',
          fontSize: '1rem',
          fontFamily: 'Inter, sans-serif',
        }}
      />
        <img src={contactGlow} alt="" className="contact-glow" />
        <h2 className="contact-title">Let's build something great together.</h2>
        <p className="contact-subtitle">
          Available for freelance, full-time, or just a coffee chat about design & code.
        </p>
       
        <div className="contact-content">
       
        <form  
              onSubmit={handleSubmit} className="contact-form"
            >
             <input type="hidden" name="_captcha" value="false" />

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input name="name" placeholder='Enter your name' type="text" id="name" required />
              </div>

              <div className="form-group">
                <label htmlFor="email">Your Email</label>
                <input name="email" placeholder='Enter youe email' type="email" id="email" required />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input name="subject" placeholder='Enter the subject of your message' type="text" id="subject" required />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea name="message" placeholder='Enter your message' id="message" rows="6" required />
            </div>

            <button type="submit" className="submit-button">
              Send Message
              <FiArrowUpRight className="button-icon" />
            </button>
            </form>


          <div className="contact-info">
            <h3>Contact Information</h3>
            
            <div className="info-items">
              <div className="info-item">
                <div className="info-icon">
                  <FiMapPin />
                </div>
                <div className="info-content">
                  <h4>Location</h4>
                  <p>Cairo, Egypt</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FiMail />
                </div>
                <div className="info-content">
                  <h4>Email</h4>
                  <p>omaryassen@outlook.com</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FiPhone />
                </div>
                <div className="info-content">
                  <h4>Phone</h4>
                  <p>+201145240296</p>
                </div>
              </div>
            </div>

            <div className="social-links">
              <a href="https://dribbble.com/OmarYassenn" target="_blank" rel="noopener noreferrer">
                <FaDribbble />
              </a>
              <a href="www.linkedin.com/in/omar-yassen" target="_blank" rel="noopener noreferrer">
                <FaLinkedinIn />
              </a>
              <a href="https://www.instagram.com/omaryassenn/" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://github.com/Omaryassenn" target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 