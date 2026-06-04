import React from 'react';
import { Code, Globe, Database, Cpu, GitBranch, Users, MessageSquare } from 'lucide-react';

export default function Skills() {
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

  const skillCategories = [
    {
      title: 'Programming',
      icon: <Code size={20} className="skills-card-icon" />,
      skills: [
        { name: 'Java', level: 90 },
        { name: 'C++', level: 85 },
        { name: 'Data Structures & Algorithms', level: 90 },
        { name: 'OOP & C', level: 80 }
      ]
    },
    {
      title: 'Web Technologies',
      icon: <Globe size={20} className="skills-card-icon" />,
      skills: [
        { name: 'ReactJS', level: 88 },
        { name: 'JavaScript & Node.js', level: 85 },
        { name: 'HTML5 & CSS3', level: 92 },
        { name: 'REST APIs & ExpressJS', level: 85 }
      ]
    },
    {
      title: 'Databases',
      icon: <Database size={20} className="skills-card-icon" />,
      skills: [
        { name: 'SQL', level: 82 },
        { name: 'MongoDB', level: 85 },
        { name: 'MySQL', level: 80 }
      ]
    },
    {
      title: 'Software Engineering',
      icon: <Cpu size={20} className="skills-card-icon" />,
      skills: [
        { name: 'SDLC & ALM', level: 88 },
        { name: 'Software Design Principles', level: 85 },
        { name: 'Research & Design', level: 80 }
      ]
    },
    {
      title: 'Config & Release',
      icon: <GitBranch size={20} className="skills-card-icon" />,
      skills: [
        { name: 'Git & Version Control', level: 90 },
        { name: 'GitHub Branch Management', level: 88 },
        { name: 'CI/CD Workflows', level: 75 }
      ]
    },
    {
      title: 'Collaboration',
      icon: <Users size={20} className="skills-card-icon" />,
      skills: [
        { name: 'Agile & Scrum Cycles', level: 85 },
        { name: 'Cross-functional Teamwork', level: 88 },
        { name: 'Peer Code Reviews', level: 85 }
      ]
    },
    {
      title: 'Soft Skills',
      icon: <MessageSquare size={20} className="skills-card-icon" />,
      skills: [
        { name: 'Analytical Thinking', level: 92 },
        { name: 'Problem-Solving', level: 90 },
        { name: 'Independent Delivery', level: 88 }
      ]
    }
  ];

  return (
    <section id="skills" className="section">
      <div className="section-header">
        <p className="section-subtitle">Cognitive Matrix</p>
        <h2 className="section-title">Technical Expertise</h2>
      </div>

      <div className="skills-grid">
        {skillCategories.map((category, idx) => (
          <div key={idx} className="skills-card glass-panel tilt-card" onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
            <h3>
              {category.icon}
              {category.title}
            </h3>
            <div className="skills-list">
              {category.skills.map((skill, sIdx) => (
                <div key={sIdx} className="skill-item">
                  <div className="skill-item-info">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-pct">{skill.level}%</span>
                  </div>
                  <div className="skill-bar-outer">
                    <div 
                      className="skill-bar-inner" 
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
