import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import downloadResume from '../utils/downloadResume';

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'experience', 'skills', 'contact'];
      const scrollPosition = window.scrollY + 120; // offset

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-logo" onClick={(e) => handleNavClick(e, 'home')}>
          VLC // PORTFOLIO
        </div>

        <ul className="nav-links">
          <li>
            <a
              href="#home"
              className={activeSection === 'home' ? 'active' : ''}
              onClick={(e) => handleNavClick(e, 'home')}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#experience"
              className={activeSection === 'experience' ? 'active' : ''}
              onClick={(e) => handleNavClick(e, 'experience')}
            >
              Experience
            </a>
          </li>
          <li>
            <a
              href="#skills"
              className={activeSection === 'skills' ? 'active' : ''}
              onClick={(e) => handleNavClick(e, 'skills')}
            >
              Skills
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className={activeSection === 'contact' ? 'active' : ''}
              onClick={(e) => handleNavClick(e, 'contact')}
            >
              Contact
            </a>
          </li>
        </ul>

        <div className="nav-contact-btn">
          <button className="glow-btn secondary" onClick={downloadResume} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={13} /> Resume
          </button>
          <button className="glow-btn" onClick={(e) => handleNavClick(e, 'contact')}>
            Establish Comms
          </button>
        </div>

        {/* Hamburger Menu Icon */}
        <button 
          className={`mobile-menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Overlay Menu */}
      <div className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`}>
        <a
          href="#home"
          className={activeSection === 'home' ? 'active' : ''}
          onClick={(e) => handleNavClick(e, 'home')}
        >
          Home
        </a>
        <a
          href="#experience"
          className={activeSection === 'experience' ? 'active' : ''}
          onClick={(e) => handleNavClick(e, 'experience')}
        >
          Experience
        </a>
        <a
          href="#skills"
          className={activeSection === 'skills' ? 'active' : ''}
          onClick={(e) => handleNavClick(e, 'skills')}
        >
          Skills
        </a>
        <a
          href="#contact"
          className={activeSection === 'contact' ? 'active' : ''}
          onClick={(e) => handleNavClick(e, 'contact')}
        >
          Contact
        </a>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '80%', marginTop: '2rem' }}>
          <button 
            className="glow-btn secondary" 
            onClick={() => { setMenuOpen(false); downloadResume(); }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Download size={15} /> Download Resume
          </button>
          <button 
            className="glow-btn" 
            onClick={(e) => handleNavClick(e, 'contact')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            Establish Comms
          </button>
        </div>
      </div>
    </>
  );
}
