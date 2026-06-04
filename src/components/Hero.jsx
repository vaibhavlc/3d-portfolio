import React, { useState, useRef } from 'react';
import ThreeSphereCanvas from './ThreeSphereCanvas';
import { Shield, Sparkles, FolderOpen, ArrowRight, Download, X } from 'lucide-react';
import downloadResume from '../utils/downloadResume';
import vaibhavImg from '../assets/vaibhav.png';

export default function Hero() {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [holoTilt, setHoloTilt] = useState({ x: 0, y: 0 });
  const [isScanned, setIsScanned] = useState(false);
  const [scanStatus, setScanStatus] = useState("STANDBY");
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  const handleHoloMouseMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    const tiltX = (x / (rect.width / 2)) * 18;
    const tiltY = -(y / (rect.height / 2)) * 18;
    setHoloTilt({ x: tiltX, y: tiltY });
  };

  const handleHoloMouseLeave = () => {
    setHoloTilt({ x: 0, y: 0 });
  };

  const handleHoloClick = async () => {
    if (isScanned) return;
    setIsScanned(true);
    setScanStatus("SCANNING PAYLOAD...");

    await new Promise((resolve) => setTimeout(resolve, 850));
    setScanStatus("DECRYPTING IDENTITY...");

    await new Promise((resolve) => setTimeout(resolve, 850));
    setScanStatus("VAIBHAV L. ACCESS GRANTED");

    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Trigger dossier popup
    setIsDossierOpen(true);
    
    // Auto reset scanner status
    setIsScanned(false);
    setScanStatus("STANDBY");
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Card center coordinates
    const cardX = rect.left + rect.width / 2;
    const cardY = rect.top + rect.height / 2;
    
    // Mouse offset from center
    const mouseX = e.clientX - cardX;
    const mouseY = e.clientY - cardY;
    
    // Map to rotation degrees (limit to max 12deg)
    const tiltX = (mouseX / (rect.width / 2)) * 12;
    const tiltY = -(mouseY / (rect.height / 2)) * 12;
    
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleScrollTo = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header id="home" className="hero-section">
      <div className="hero-grid">
        {/* Left Side: CopywritingHUD & stats */}
        <div className="hero-left">
          <span className="hero-subtitle">
            <Sparkles size={14} style={{ color: 'var(--color-primary)' }} /> Zero-Gravity Universe
          </span>
          <h1 className="hero-title">
            Designing Fluid <br />
            Interactive Solutions
          </h1>
          <p className="hero-desc">
            Hi, I'm Vaibhav Lakhichand Chaudhari. A Computer Science Graduate (CGPA: 9.18) specializing in building highly performant full-stack systems, dynamic web architectures, and automated workflow pipelines.
          </p>

          {/* Key Stats HUD */}
          <div className="hero-stats">
            <div className="hero-stat-card glass-panel">
              <div className="hero-stat-val">9.18</div>
              <div className="hero-stat-lbl">CGPA SCORE</div>
            </div>
            <div className="hero-stat-card glass-panel">
              <div className="hero-stat-val">1+ Yr</div>
              <div className="hero-stat-lbl">EXPERIENCE</div>
            </div>
            <div className="hero-stat-card glass-panel">
              <div className="hero-stat-val">10+</div>
              <div className="hero-stat-lbl">ALGORITHMS</div>
            </div>
          </div>

          <div className="hero-actions">
            <button className="glow-btn" onClick={() => handleScrollTo('experience')}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FolderOpen size={15} /> Explore Projects <ArrowRight size={14} />
              </span>
            </button>
            <button className="glow-btn secondary" onClick={downloadResume}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Download size={14} /> Resume CV
              </span>
            </button>
            <button className="sorting-btn" style={{ padding: '0.75rem 1rem' }} onClick={() => handleScrollTo('contact')}>
              Contact Base
            </button>
          </div>
        </div>

        {/* Right Side: WebGL Spheres + Floating ID Card + Holographic Scanner */}
        <div className="hero-right">
          {/* Three.js Background canvas */}
          <ThreeSphereCanvas />

          {/* Interactive Tilt Holographic ID Card */}
          <div 
            ref={cardRef}
            className="holo-id-card glass-panel"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) translateY(-10px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            {/* Drifting glowing tag */}
            <div className="cgpa-drifting-tag">
              CGPA: 9.18
            </div>

            <div className="holo-card-inner">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="holo-chip"></div>
                <Shield size={24} style={{ color: 'var(--color-primary)', opacity: 0.7 }} />
              </div>

              <div className="id-photo-slot">
                <img src={vaibhavImg} alt="Vaibhav L. Chaudhari" className="id-photo-img" />
              </div>

              <div className="id-details">
                <h3>Vaibhav L. Chaudhari</h3>
                <p>Software Engineer</p>
              </div>

              <div className="id-footer">
                <div className="id-footer-item">
                  IDENTIFIER
                  <span>VLC-3040</span>
                </div>
                <div className="id-footer-item">
                  CLASS RANK
                  <span>CS GRADUATE</span>
                </div>
                <div className="id-footer-item">
                  SECURE BASE
                  <span>MUMBAI, IN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Holographic Portrait next to/behind the card */}
          <div 
            className={`holo-portrait-wrapper ${isScanned ? 'scanned' : ''}`}
            onMouseMove={handleHoloMouseMove}
            onMouseLeave={handleHoloMouseLeave}
            onClick={handleHoloClick}
            style={{
              transform: `rotateY(${holoTilt.x}deg) rotateX(${holoTilt.y}deg) scale(${holoTilt.x !== 0 || isScanned ? 1.15 : 1})`,
              transition: isScanned ? 'transform 0.1s ease-out' : 'transform 0.1s ease-out, border-color 0.3s ease',
              cursor: 'pointer'
            }}
          >
            <div className="holo-grid-overlay"></div>
            <div className={`holo-scanner-line ${isScanned ? 'active-scan' : ''}`}></div>
            <img src={vaibhavImg} alt="Vaibhav Holographic Projection" className="holo-portrait-img" />
            
            {/* Holographic readout HUD panel */}
            <div className="holo-readout">
              <div className="readout-status">{scanStatus}</div>
              {isScanned && (
                <div className="readout-metrics">
                  <div>SYS_VAL: 9.18</div>
                  <div>ENG_LOAD: 100%</div>
                  <div>PORT: ONLINE</div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Classified Holographic Dossier Modal (Pop-up Profile) */}
      {isDossierOpen && (
        <div className="dossier-overlay" onClick={() => setIsDossierOpen(false)}>
          <div 
            className="dossier-card glass-panel" 
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'zoomInHUD 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) forwards' }}
          >
            {/* Close Button */}
            <button className="dossier-close-btn" onClick={() => setIsDossierOpen(false)}>
              <X size={18} />
            </button>

            {/* Dossier Left: Holographic Enlarged Profile */}
            <div className="dossier-left">
              <div className="holo-grid-overlay"></div>
              <div className="holo-scanner-line active-scan"></div>
              <img src={vaibhavImg} alt="Vaibhav Dossier Large" className="dossier-img" />
              <div className="dossier-img-badge">SYSTEMS ACTIVE</div>
            </div>

            {/* Dossier Right: Telemetry data read-out */}
            <div className="dossier-right">
              <div className="dossier-header">
                <span className="dossier-indicator"></span>
                <span>SECURE DATABASE DOSSIER // VLC-3040</span>
              </div>
              
              <h2 className="dossier-title">Vaibhav Chaudhari</h2>
              <div className="dossier-subtitle">Software Engineer // CS Graduate</div>

              <div className="dossier-stats-grid">
                <div className="dossier-stat-item">
                  <div className="dossier-stat-lbl">CGPA SCORE</div>
                  <div className="dossier-stat-val text-neon-emerald">9.18 / 10.00</div>
                </div>
                <div className="dossier-stat-item">
                  <div className="dossier-stat-lbl">EDUCATION LEVEL</div>
                  <div className="dossier-stat-val text-neon-cyan">B.E. COMPUTER SCIENCE</div>
                </div>
              </div>

              <div className="dossier-details-list">
                <div className="dossier-detail-row">
                  <span>SECURITY BASE:</span>
                  <strong>MUMBAI, MAHARASHTRA, IN</strong>
                </div>
                <div className="dossier-detail-row">
                  <span>SPECIALTIES:</span>
                  <strong>REACTJS, JAVA, MONGO, DYNAMICS 365</strong>
                </div>
                <div className="dossier-detail-row">
                  <span>COMMUNICATION PATH:</span>
                  <strong>vaibhavc3040@gmail.com | +91 7414933040</strong>
                </div>
                <div className="dossier-detail-row">
                  <span>REPRESENTATIVE STACK:</span>
                  <strong>MERN, OOP, DATA STRUCTURES & ALGORITHMS</strong>
                </div>
              </div>

              <div className="dossier-footer-actions">
                <button className="glow-btn" onClick={() => { setIsDossierOpen(false); downloadResume(); }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Download size={14} /> Download Secure CV
                  </span>
                </button>
                <button className="glow-btn secondary" onClick={() => { setIsDossierOpen(false); handleScrollTo('contact'); }}>
                  Initiate Handshake
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </header>
  );
}
