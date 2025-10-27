import React from 'react';
import { Facebook, Github, Twitter, Instagram, Linkedin } from 'lucide-react';

// Course configuration - should be moved to a config file in production
const COURSE_CONFIG = {
  logo: 'https://external-preview.redd.it/gkybTnH7Hw3y0wYt-5q7zH-hdh24Y6F4mA03JWQ_mx4.jpg?auto=webp&s=a9a0afd2b0e59767765f84d72b02909a5853acd9',
  title: 'Test Course',
  instructor: {
    name: 'David J. Malan',
    email: 'malan@harvard.edu',
    website: 'https://cs.harvard.edu/malan/',
    socialLinks: {
      facebook: 'https://www.facebook.com/dmalan',
      github: 'https://github.com/dmalan',
      instagram: 'https://www.instagram.com/davidjmalan/',
      linkedin: 'https://www.linkedin.com/in/malan/',
      twitter: 'https://twitter.com/davidjmalan',
    },
  },
};

const SocialIcon = ({ href, children, ariaLabel }) => (
  <a
    target="_blank"
    rel="noreferrer"
    href={href}
    aria-label={ariaLabel}
    className="me-2"
  >
    {children}
  </a>
);

export default function SidebarHeader({ toggleSidebar }) {
  const { logo, title, instructor } = COURSE_CONFIG;

  return (
    <>
      {/* I assume that in this model.. may be all those be passed from or hardcoded
					sinse in the model of one person one course the whole deployed front-ned is kinda 
					acting as a separate app for that particular person..
					This is something we are not sattled on yet..
			*/}
      <div className="offcanvas-header">
        <img
          src={logo}
          alt={`${title} Logo`}
          className="course-logo"
          style={{ width: '10rem', marginRight: '1rem' }}
        />
        <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
          {title}
        </h5>
        <button
          type="button"
          className="btn-close btn-close-white"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        />
      </div>

      {/* Instructor Information */}
      <div className="instructor-info text-white mx-3">
        <a
          target="_blank"
          rel="noreferrer"
          href={instructor.website}
          className="instructor-name"
        >
          {instructor.name}
        </a>
        <br />
        <a href={`mailto:${instructor.email}`} className="instructor-email">
          {instructor.email}
        </a>
        <br />
        
        {/* Social Links */}
        <div className="social-links mt-2">
          <SocialIcon 
            href={instructor.socialLinks.facebook} 
            ariaLabel="Facebook"
          >
            <Facebook size={20} />
          </SocialIcon>
          <SocialIcon 
            href={instructor.socialLinks.github} 
            ariaLabel="GitHub"
          >
            <Github size={20} />
          </SocialIcon>
          <SocialIcon 
            href={instructor.socialLinks.instagram} 
            ariaLabel="Instagram"
          >
            <Instagram size={20} />
          </SocialIcon>
          <SocialIcon 
            href={instructor.socialLinks.linkedin} 
            ariaLabel="LinkedIn"
          >
            <Linkedin size={20} />
          </SocialIcon>
          <SocialIcon 
            href={instructor.socialLinks.twitter} 
            ariaLabel="Twitter"
          >
            <Twitter size={20} />
          </SocialIcon>
        </div>
      </div>
    </>
  );
}
