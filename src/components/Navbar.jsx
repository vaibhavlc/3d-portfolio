import React, { useState, useEffect } from 'react';
import { Download, Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import downloadResume from '../utils/downloadResume';
import audioManager from '../utils/audio';

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [isAudioMuted, setIsAudioMuted] = useState(() => {
    const saved = localStorage.getItem('isAudioMuted');
    return saved !== null ? JSON.parse(saved) : true;
  });

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

  // Theme Sync
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Audio Sync
  useEffect(() => {
    audioManager.setMute(isAudioMuted);
    localStorage.setItem('isAudioMuted', JSON.stringify(isAudioMuted));
  }, [isAudioMuted]);

  const toggleTheme = () => {
    audioManager.playFX('click');
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleAudio = () => {
    const nextMute = !isAudioMuted;
    setIsAudioMuted(nextMute);
    if (!nextMute) {
      setTimeout(() => {
        audioManager.playFX('success');
      }, 50);
    } else {
      audioManager.playFX('click');
    }
  };

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    setMenuOpen(false);
    audioManager.playFX('click');
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
              onMouseEnter={() => audioManager.playFX('hover')}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#experience"
              className={activeSection === 'experience' ? 'active' : ''}
              onClick={(e) => handleNavClick(e, 'experience')}
              onMouseEnter={() => audioManager.playFX('hover')}
            >
              Experience
            </a>
          </li>
          <li>
            <a
              href="#skills"
              className={activeSection === 'skills' ? 'active' : ''}
              onClick={(e) => handleNavClick(e, 'skills')}
              onMouseEnter={() => audioManager.playFX('hover')}
            >
              Skills
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className={activeSection === 'contact' ? 'active' : ''}
              onClick={(e) => handleNavClick(e, 'contact')}
              onMouseEnter={() => audioManager.playFX('hover')}
            >
              Contact
            </a>
          </li>
        </ul>

        <div className="nav-contact-btn">
          {/* Audio controller */}
          <button 
            className="audio-controller-btn" 
            onClick={toggleAudio}
            onMouseEnter={() => audioManager.playFX('hover')}
            title={isAudioMuted ? "Unmute Ambient Music" : "Mute Ambient Music"}
          >
            {isAudioMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            <div className={`audio-wave-container ${!isAudioMuted ? 'playing' : ''}`}>
              <div className="audio-wave-bar"></div>
              <div className="audio-wave-bar"></div>
              <div className="audio-wave-bar"></div>
            </div>
          </button>

          {/* Theme toggler */}
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            onMouseEnter={() => audioManager.playFX('hover')}
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <button 
            className="glow-btn secondary" 
            onClick={() => { audioManager.playFX('click'); downloadResume(); }} 
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={13} /> Resume
          </button>
          <button className="glow-btn" onClick={(e) => handleNavClick(e, 'contact')}>
            Establish Comms
          </button>
        </div>

        {/* Hamburger Menu Icon */}
        <button 
          className={`mobile-menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => { audioManager.playFX('click'); setMenuOpen(!menuOpen); }}
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
          {/* Mobile Theme and Audio Control Row */}
          <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
            <button 
              className="audio-controller-btn" 
              onClick={toggleAudio}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              <span style={{ fontSize: '0.7rem' }}>{isAudioMuted ? "Unmute" : "Mute"}</span>
            </button>
            <button 
              className="theme-toggle-btn" 
              onClick={toggleTheme}
              style={{ flex: 1, borderRadius: '20px', width: 'auto', gap: '8px' }}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-display)' }}>Theme</span>
            </button>
          </div>

          <button 
            className="glow-btn secondary" 
            onClick={() => { audioManager.playFX('click'); setMenuOpen(false); downloadResume(); }}
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
