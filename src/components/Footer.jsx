import React from 'react';

export default function Footer() {
  const handleScrollTo = (e, sectionId) => {
    e.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-nav">
        <a href="#home" onClick={(e) => handleScrollTo(e, 'home')}>Home</a>
        <a href="#experience" onClick={(e) => handleScrollTo(e, 'experience')}>Experience</a>
        <a href="#skills" onClick={(e) => handleScrollTo(e, 'skills')}>Skills</a>
        <a href="#contact" onClick={(e) => handleScrollTo(e, 'contact')}>Contact</a>
      </div>
      <div className="footer-copy">
        &copy; {new Date().getFullYear()} Vaibhav Lakhichand Chaudhari. Built in zero-gravity with React & Three.js.
      </div>
    </footer>
  );
}
