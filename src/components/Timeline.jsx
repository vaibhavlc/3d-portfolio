import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Activity, Tractor, HelpCircle, Layers } from 'lucide-react';
import audioManager from '../utils/audio';

export default function Timeline() {
  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const tiltX = -((y - yc) / yc) * 8;
    const tiltY = ((x - xc) / xc) * 8;
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  // --- Project 1: AgriConnect Farm Grid State ---
  const [farmCells, setFarmCells] = useState(Array(25).fill('empty'));
  const [sales, setSales] = useState(0);

  const handleCellClick = (index) => {
    audioManager.playFX('click');
    setFarmCells(prev => {
      const next = [...prev];
      if (next[index] === 'empty') {
        next[index] = 'seeded'; // Phase 1: Seeded
      } else if (next[index] === 'seeded') {
        next[index] = 'harvested'; // Phase 2: Harvested
      } else if (next[index] === 'harvested') {
        next[index] = 'sold'; // Phase 3: Sold
        setSales(s => s + 150);
        // Play success tone for the sale
        setTimeout(() => audioManager.playFX('success'), 50);
      } else {
        next[index] = 'empty'; // Cycle back
      }
      return next;
    });
  };

  const getCellContent = (status) => {
    switch (status) {
      case 'seeded': return '🌱';
      case 'harvested': return '🌾';
      case 'sold': return '💰';
      default: return '';
    }
  };

  // --- Project 2: DSA Visualizer State ---
  const defaultBars = [45, 80, 20, 95, 60, 30, 75, 10, 50, 85];
  const [bars, setBars] = useState([...defaultBars]);
  const [comparing, setComparing] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [sortingSpeed, setSortingSpeed] = useState(300);
  const sortingRef = useRef(false);

  const resetVisualizer = () => {
    sortingRef.current = false;
    setIsSorting(false);
    setBars([...defaultBars]);
    setComparing([]);
    setSorted([]);
    audioManager.playFX('click');
  };

  const startSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    sortingRef.current = true;
    audioManager.playFX('click');
    let arr = [...bars];
    let n = arr.length;
    let tempSorted = [];

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (!sortingRef.current) return;
        
        // Show comparison
        setComparing([j, j + 1]);
        await new Promise((resolve) => setTimeout(resolve, sortingSpeed));

        if (arr[j] > arr[j + 1]) {
          // Swap
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setBars([...arr]);
          // Sound effect on swap
          audioManager.playFX('hover');
        }
      }
      // Add to sorted elements
      tempSorted.unshift(n - i - 1);
      setSorted([...tempSorted]);
    }

    setComparing([]);
    setIsSorting(false);
    // Success chime when fully sorted
    audioManager.playFX('success');
  };

  // --- Experience 3: Automated Workflow Pipelines State ---
  const [packetPos, setPacketPos] = useState(0); // 0 to 100% position along the pipeline
  const [pipelineActive, setPipelineActive] = useState(true);
  const [activeStep, setActiveStep] = useState(0); // 0: Input, 1: Transform, 2: Database

  useEffect(() => {
    if (!pipelineActive) return;
    
    const interval = setInterval(() => {
      setPacketPos(prev => {
        const next = prev + 2;
        if (next >= 100) {
          // Cycle step
          setActiveStep(step => (step + 1) % 3);
          return 0;
        }
        return next;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [pipelineActive]);

  return (
    <section id="experience" className="section">
      <div className="section-header">
        <p className="section-subtitle">Chronicles of Code</p>
        <h2 className="section-title">Projects & Experience</h2>
      </div>

      <div className="timeline-container">
        <div className="timeline-line"></div>

        {/* Node 1: AgriConnect */}
        <div className="timeline-item">
          <div className="timeline-node"></div>
          <div className="timeline-content-wrapper">
            <div className="timeline-card glass-panel tilt-card" onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
              <span className="timeline-tag secondary">Academic Project | VII Semester</span>
              <h3>AgriConnect</h3>
              <p className="timeline-company">Full-Stack MERN Application</p>
              <p className="timeline-date">Submitted to ICSTEMSD International Conference 2024</p>
              <p className="timeline-desc">
                Designed and deployed a full-stack platform enabling direct farmer-buyer interactions, tested with 50+ users. Reduced deployment bugs by 30% through systematic manual test cases and 20+ validated REST endpoints.
              </p>

              {/* Farm Grid Interactive space */}
              <div className="interactive-panel">
                <div className="farm-grid-container">
                  <div className="farm-grid-header">
                    <span className="text-neon-emerald" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Tractor size={14} /> AgriConnect Farm Grid Simulator
                    </span>
                    <span>Direct Sales: <strong className="text-neon-cyan">${sales}</strong></span>
                  </div>
                  <div className="farm-grid">
                    {farmCells.map((status, idx) => (
                       <button
                         key={idx}
                         className={`farm-cell ${status === 'seeded' || status === 'harvested' ? 'planted' : ''} ${status === 'sold' ? 'sold' : ''}`}
                         onClick={() => handleCellClick(idx)}
                         onMouseEnter={() => audioManager.playFX('hover')}
                         title={`Status: ${status}. Click to cycle crop phase.`}
                       >
                         {getCellContent(status)}
                       </button>
                    ))}
                  </div>
                  <p style={{ fontSize: '0.65rem', color: '#9ca3af', marginTop: '0.75rem', textAlign: 'center' }}>
                    Click cells to: plant seed 🌱 → harvest wheat 🌾 → sell 💰 to buyers directly!
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Node 2: DSA Visualizer */}
        <div className="timeline-item">
          <div className="timeline-node"></div>
          <div className="timeline-content-wrapper">
            <div className="timeline-card glass-panel tilt-card" onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
              <span className="timeline-tag primary">Personal Project</span>
              <h3>DSA Visualizer</h3>
              <p className="timeline-company">Java Swing Application</p>
              <p className="timeline-date">Independent Design</p>
              <p className="timeline-desc">
                An interactive desktop application visualizing 10+ sorting, searching, and graph traversal algorithms. Applied OOP design patterns to reduce code duplication by 40%.
              </p>

              {/* Sorting Visualizer Interactive space */}
              <div className="interactive-panel">
                <div className="sorting-container">
                  <div className="sorting-controls">
                    <span className="text-neon-cyan" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                      <Activity size={14} /> Bubble Sort Visualizer
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="sorting-btn" 
                        onClick={startSort} 
                        disabled={isSorting}
                        onMouseEnter={() => audioManager.playFX('hover')}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Play size={10} /> Play
                      </button>
                      <button 
                        className="sorting-btn" 
                        onClick={resetVisualizer}
                        onMouseEnter={() => audioManager.playFX('hover')}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <RotateCcw size={10} /> Reset
                      </button>
                    </div>
                  </div>
                  <div className="sorting-bars">
                    {bars.map((val, idx) => {
                      const isComparing = comparing.includes(idx);
                      const isSorted = sorted.includes(idx);
                      return (
                        <div
                          key={idx}
                          className={`sorting-bar ${isComparing ? 'comparing' : ''} ${isSorted ? 'sorted' : ''}`}
                          style={{ height: `${val}%` }}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Node 3: ProMX / Bharat Intern Professional Experience */}
        <div className="timeline-item">
          <div className="timeline-node"></div>
          <div className="timeline-content-wrapper">
            <div className="timeline-card glass-panel tilt-card" onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
              <span className="timeline-tag accent">Professional Experience</span>
              <h3>Workflow Automation & Trainee</h3>
              <p className="timeline-company">ProMX & Bharat Intern</p>
              <p className="timeline-date">Jun 2023 - Oct 2023</p>
              <p className="timeline-desc">
                Configured Dynamics 365 Sales & Customer service workflows. Automated 5+ business pipelines with Power Apps, cutting manual data entry by 40% and improving efficiency by 30%. Created responsive React interfaces, reducing UI overhead by 25%.
              </p>

              {/* Automated Pipeline Interactive Space */}
              <div className="interactive-panel">
                <div className="pipeline-container">
                  <div className="farm-grid-header">
                    <span className="text-neon-purple" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Layers size={14} /> Power Automate & Dynamics 365 pipeline
                    </span>
                    <button 
                      className="sorting-btn" 
                      onClick={() => { audioManager.playFX('click'); setPipelineActive(!pipelineActive); }}
                      onMouseEnter={() => audioManager.playFX('hover')}
                    >
                      {pipelineActive ? 'Pause Flow' : 'Resume Flow'}
                    </button>
                  </div>

                  <div className="pipeline-nodes">
                    <div className="pipeline-connection-line"></div>
                    
                    {/* Data Packet moving */}
                    {pipelineActive && (
                      <div 
                        className="pipeline-data-packet"
                        style={{ left: `${packetPos}%` }}
                      ></div>
                    )}

                    <div className={`pipeline-node-item ${activeStep === 0 ? 'active' : 'completed'}`} title="CRM Trigger Info">
                      📥
                    </div>
                    <div className={`pipeline-node-item ${activeStep === 1 ? 'active' : (activeStep > 1 ? 'completed' : '')}`} title="Automated Validation Flow">
                      ⚙️
                    </div>
                    <div className={`pipeline-node-item ${activeStep === 2 ? 'active' : ''}`} title="Database Sync">
                      💾
                    </div>
                  </div>

                  <div className="pipeline-status">
                    {activeStep === 0 && 'STATUS: Listening for CRM Sales lead events...'}
                    {activeStep === 1 && 'STATUS: Processing Validation & Routing protocols via Power Apps...'}
                    {activeStep === 2 && 'STATUS: Database records synchronized successfully! (40% time saved)'}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
