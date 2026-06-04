import React, { useState } from 'react';
import { Mail, Phone, MapPin, Terminal, Send } from 'lucide-react';

const GithubIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [isAirplaneFlying, setIsAirplaneFlying] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isSending || sendSuccess) return;
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSending(true);
    setIsAirplaneFlying(true);

    try {
      const responsePromise = fetch("https://formsubmit.co/ajax/vc654810@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `New Portfolio Message from ${formData.name}`
        })
      });

      // Enforce a minimum 1.5s delay for airplane flight visual flow
      const [response] = await Promise.all([
        responsePromise,
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);

      const result = await response.json();

      if (response.ok) {
        setSendSuccess(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error(result.message || 'Transmission failed');
      }
    } catch (err) {
      alert(`Telemetry Error: ${err.message}`);
    } finally {
      setIsSending(false);
      setIsAirplaneFlying(false);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="section-header">
        <p className="section-subtitle">Communications Portal</p>
        <h2 className="section-title">Get In Touch</h2>
      </div>

      <div className="contact-grid">
        {/* Info panel */}
        <div className="contact-info">
          <div className="contact-card glass-panel">
            <div className="contact-icon-box">
              <Mail size={22} />
            </div>
            <div className="contact-details">
              <h4>Direct Email</h4>
              <p><a href="mailto:vaibhavc3040@gmail.com">vaibhavc3040@gmail.com</a></p>
            </div>
          </div>

          <div className="contact-card glass-panel secondary">
            <div className="contact-icon-box">
              <Phone size={22} />
            </div>
            <div className="contact-details">
              <h4>Call / Text</h4>
              <p><a href="tel:+917414933040">+91 7414933040</a></p>
            </div>
          </div>

          <div className="contact-card glass-panel">
            <div className="contact-icon-box">
              <MapPin size={22} />
            </div>
            <div className="contact-details">
              <h4>Location Base</h4>
              <p>Mumbai, Maharashtra, India</p>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
              External Nodes
            </h4>
            <div className="social-links">
              <a 
                href="https://github.com/Vaibhavc3040" 
                target="_blank" 
                rel="noreferrer" 
                className="social-btn glass-panel"
                title="GitHub Core Node"
              >
                <GithubIcon size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/in/vaibhav-chaudhari-5a7a92237" 
                target="_blank" 
                rel="noreferrer" 
                className="social-btn glass-panel"
                title="LinkedIn Core Node"
              >
                <LinkedinIcon size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* HUD terminal form container */}
        <div className="contact-hud-form glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="terminal-header" style={{ marginBottom: '1rem' }}>
            <div className="terminal-dots">
              <div className="terminal-dot"></div>
              <div className="terminal-dot"></div>
              <div className="terminal-dot"></div>
            </div>
            <span className="terminal-title">VAIBHAV_COMMS_LINK.sh</span>
            <Terminal size={14} style={{ color: 'var(--color-primary)' }} />
          </div>

          {isAirplaneFlying && (
            <div className="airplane-animation-container">
              <div className="airplane-trail"></div>
              <svg className="paper-airplane" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </div>
          )}

          {!sendSuccess ? (
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="hud-group">
                <label className="hud-label">SENDER_NAME:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="hud-input"
                  placeholder="e.g. John Doe"
                  required
                  disabled={isSending}
                />
              </div>

              <div className="hud-group">
                <label className="hud-label">SENDER_EMAIL:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="hud-input"
                  placeholder="e.g. client@domain.com"
                  required
                  disabled={isSending}
                />
              </div>

              <div className="hud-group">
                <label className="hud-label">TRANSMISSION_PAYLOAD:</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  className="hud-textarea"
                  placeholder="Enter message details here..."
                  required
                  disabled={isSending}
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="glow-btn"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                disabled={isSending}
              >
                <Send size={14} /> Dispatch Stream
              </button>
            </form>
          ) : (
            <div className="form-success-card">
              <div className="success-icon-ring">
                <svg className="success-checkmark" viewBox="0 0 52 52">
                  <circle className="success-checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                  <path className="success-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
              </div>
              <h3 className="text-neon-emerald" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Transmission Stable</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                Your message packets have been successfully encrypted and routed to remote base <strong className="text-neon-cyan">vc654810@gmail.com</strong>.
              </p>
              <button className="sorting-btn" style={{ marginTop: '1.75rem', padding: '0.6rem 1.25rem' }} onClick={() => setSendSuccess(false)}>
                Establish Another Connection
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
