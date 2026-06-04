import React, { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle Classes
    class BackgroundStar {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.baseSpeed = Math.random() * 0.15 + 0.05;
        this.vx = (Math.random() - 0.5) * this.baseSpeed;
        this.vy = (Math.random() - 0.5) * this.baseSpeed;
        this.alpha = Math.random() * 0.5 + 0.2;
        this.glow = Math.random() > 0.8;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen boundaries
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = '#00f2fe';
        if (this.glow) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#00f2fe';
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class MouseTrailParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 4; // Particle size
        // Liquid metal physics
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 0.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1.0; // Life starts at 1 and decays
        this.decay = Math.random() * 0.015 + 0.015;
      }

      update(mouseX, mouseY) {
        // Attract slightly to current mouse position for elastic/liquid metal effect
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        this.vx += dx * 0.005;
        this.vy += dy * 0.005;

        // Apply friction
        this.vx *= 0.95;
        this.vy *= 0.95;

        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
      }

      draw() {
        if (this.life <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.life;
        
        // Gradient color: Cyan to Emerald
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 1.5);
        grad.addColorStop(0, 'rgba(0, 242, 254, 0.8)');   // Primary Cyan
        grad.addColorStop(0.4, 'rgba(0, 245, 160, 0.6)'); // Emerald Accent
        grad.addColorStop(1, 'rgba(127, 0, 255, 0)');     // Fades to transparent

        ctx.fillStyle = grad;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00f2fe';
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * (0.3 + this.life * 0.7), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize Background Stars
    const starCount = 80;
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push(new BackgroundStar());
    }

    // Interactive Mouse Coordinates
    const mouse = { x: -100, y: -100, active: false };
    const trail = [];

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      // Spawn trail particles
      if (Math.random() > 0.3) {
        trail.push(new MouseTrailParticle(mouse.x, mouse.y));
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw and update background stars
      stars.forEach(star => {
        star.update();
        star.draw();
      });

      // 2. Draw and update mouse trail particles
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.update(mouse.x, mouse.y);
        p.draw();

        // Connect nearby trail particles for liquid-metal mesh look
        for (let j = i - 1; j >= 0; j--) {
          const p2 = trail[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 60) {
            ctx.save();
            ctx.globalAlpha = Math.min(p.life, p2.life) * 0.15;
            ctx.strokeStyle = '#00f2fe';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.restore();
          }
        }

        // Remove dead particles
        if (p.life <= 0) {
          trail.splice(i, 1);
        }
      }

      // 3. Draw a glow at mouse cursor
      if (mouse.active) {
        ctx.save();
        const glowGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 100);
        glowGrad.addColorStop(0, 'rgba(0, 242, 254, 0.05)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas id="liquid-metal-canvas" ref={canvasRef} />;
}
