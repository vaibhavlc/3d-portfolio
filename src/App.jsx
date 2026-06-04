import React from 'react';
import ParticleBackground from './components/ParticleBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="app-layout">
      {/* Background Canvas Particles */}
      <ParticleBackground />

      {/* Navigation Header */}
      <Navbar />

      {/* Hero Section with Holographic Card and 3D Spheres */}
      <Hero />

      <main>
        {/* Experience & Projects Timeline */}
        <Timeline />

        {/* Technical Skills Matrix */}
        <Skills />

        {/* HUD Contact Terminal */}
        <Contact />
      </main>

      {/* Footer Details */}
      <Footer />
    </div>
  );
}
