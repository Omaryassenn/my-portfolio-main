import React from 'react';
import './Contact.css';
import Button from './Button';
import { FiArrowUpRight, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TOAST_STYLE = {
  background: 'var(--card-bg)',
  color: 'var(--text-color)',
  borderRadius: '0',
  border: '1px solid rgba(var(--text-rgb), 0.1)',
  fontSize: '1rem',
  fontFamily: 'var(--font-family)',
};

/* The placeholder is an example, never a repeat of the label — the label is
   already sitting above the field, so echoing it there would say nothing and
   still disappear the moment anyone typed. */
const FIELDS = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'name', placeholder: 'Jane Doe' },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    autoComplete: 'email',
    placeholder: 'jane@company.com',
  },
  {
    name: 'subject',
    label: 'Subject',
    type: 'text',
    autoComplete: 'off',
    placeholder: 'A landing page for…',
  },
];

const MESSAGE_PLACEHOLDER =
  'What you are building, roughly when, and anything you already know you want.';

/* Only the rows that can actually do something get an action affordance — a
   card that looks tappable and then does nothing is worse than a plain one. */
const DETAILS = [
  {
    icon: FiMail,
    label: 'Email me',
    value: 'omaryassen99@outlook.com',
    href: 'mailto:omaryassen99@outlook.com',
  },
  { icon: FiPhone, label: 'Call me', value: '+201149240296', href: 'tel:+201149240296' },
  { icon: FiMapPin, label: 'Based in', value: 'Cairo, Egypt' },
];

const SOCIALS = [
  { label: 'Dribbble', href: 'https://dribbble.com/OmarYassenn' },
  { label: 'Behance', href: 'https://www.behance.net/omaryassenn' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/omar-yassen' },
  { label: 'GitHub', href: 'https://github.com/Omaryassenn' },
];

const Contact = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      const response = await fetch('https://formsubmit.co/ajax/oyassen43@gmail.com', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      if (response.ok) {
        toast.success('Message sent successfully!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          style: TOAST_STYLE,
        });
        e.target.reset(); // Clear form
      } else {
        toast.error('Failed to send message. Please try again.', {
          position: 'top-center',
          theme: 'dark',
          style: TOAST_STYLE,
        });
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.', {
        position: 'top-center',
        theme: 'dark',
        style: TOAST_STYLE,
      });
    }
  };

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
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
        style={{ top: '20px' }}
        toastStyle={TOAST_STYLE}
      />

      {/* Ambience, both decorative: a low accent haze and the word itself set
          oversize behind the content, fading out before it reaches the form. */}
      <span className="contact__glow" aria-hidden="true" />
      <span className="contact__ghost" aria-hidden="true">
        Contact
      </span>

      <div className="contact__inner">
        

        <div className="contact__body">
          <div className="contact__aside">
            <h2 className="contact__title" id="contact-title">
              Let&apos;s build something great
              <span className="contact__accent" aria-hidden="true">
                *
              </span>
            </h2>

            <p className="contact__lede">
              Available for freelance, full-time, or just a coffee chat about design &amp; code.
            </p>

            <ul className="contact__cards">
              {DETAILS.map(({ icon: Icon, label, value, href }) => {
                const Tag = href ? 'a' : 'div';
                return (
                  <li key={label}>
                    <Tag className="info-card" {...(href ? { href } : null)}>
                      <span className="info-card__icon" aria-hidden="true">
                        <Icon />
                      </span>
                      <span className="info-card__text">
                        <span className="info-card__label">{label}</span>
                        <span className="info-card__value">{value}</span>
                      </span>
                      {href && (
                        <span className="info-card__go" aria-hidden="true">
                          <FiArrowUpRight />
                        </span>
                      )}
                    </Tag>
                  </li>
                );
              })}
            </ul>

            <ul className="contact__socials">
              {SOCIALS.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="contact__form">
            <input type="hidden" name="_captcha" value="false" />

            {FIELDS.map(({ name, label, type, autoComplete, placeholder }) => (
              <div className="field" key={name}>
                <label className="field__label" htmlFor={name}>
                  {label}
                </label>
                <input
                  className="field__input"
                  id={name}
                  name={name}
                  type={type}
                  autoComplete={autoComplete}
                  placeholder={placeholder}
                  required
                />
              </div>
            ))}

            <div className="field field--message">
              <label className="field__label" htmlFor="message">
                Message
              </label>
              <textarea
                className="field__input"
                id="message"
                name="message"
                rows="6"
                placeholder={MESSAGE_PLACEHOLDER}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="contact__submit"
              icon={FiArrowUpRight}
            >
              Send message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
