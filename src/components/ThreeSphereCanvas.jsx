import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeSphereCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 7;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0c0822, 1.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f2fe, 3);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7f00ff, 2.5);
    dirLight2.position.set(-5, -5, -2);
    scene.add(dirLight2);

    // Glowing point light that follows the mouse
    const mousePointLight = new THREE.PointLight(0x00f5a0, 4, 15);
    scene.add(mousePointLight);

    // Helper functions to generate logo textures dynamically using canvas
    const createLogoTexture = (techName) => {
      const size = 256;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      // Transparent background
      ctx.clearRect(0, 0, size, size);

      // Antialiasing styling
      ctx.imageSmoothingEnabled = true;

      if (techName === 'ReactJS') {
        // Draw React Orbital Logo in Cyan
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 8;
        ctx.fillStyle = '#00f2fe';

        // Draw center dot
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, 14, 0, Math.PI * 2);
        ctx.fill();

        // Save state and rotate for 3 ellipses
        ctx.save();
        ctx.translate(size / 2, size / 2);
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.ellipse(0, 0, 80, 26, (i * Math.PI) / 3, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      } else if (techName === 'Java') {
        // Draw high-tech styling of Java Cup
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 7;
        ctx.fillStyle = '#00f2fe';

        // Draw coffee cup base
        ctx.beginPath();
        ctx.moveTo(size / 2 - 40, size / 2 - 10);
        ctx.lineTo(size / 2 + 30, size / 2 - 10);
        ctx.lineTo(size / 2 + 20, size / 2 + 40);
        ctx.bezierCurveTo(size / 2 + 10, size / 2 + 60, size / 2 - 30, size / 2 + 60, size / 2 - 35, size / 2 + 40);
        ctx.closePath();
        ctx.stroke();

        // Draw handle
        ctx.beginPath();
        ctx.arc(size / 2 + 35, size / 2 + 15, 18, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();

        // Draw heat waves (vapors)
        ctx.lineWidth = 5;
        for (let i = 0; i < 3; i++) {
          const xo = (i - 1) * 20;
          ctx.beginPath();
          ctx.moveTo(size / 2 - 15 + xo, size / 2 - 25);
          ctx.bezierCurveTo(
            size / 2 - 25 + xo, size / 2 - 35,
            size / 2 - 5 + xo, size / 2 - 45,
            size / 2 - 15 + xo, size / 2 - 55
          );
          ctx.stroke();
        }
      } else if (techName === 'MongoDB') {
        // Draw green leaf shape
        ctx.strokeStyle = '#00f5a0';
        ctx.fillStyle = '#00f5a0';
        ctx.lineWidth = 7;

        ctx.save();
        ctx.translate(size / 2, size / 2);
        // Draw Leaf
        ctx.beginPath();
        ctx.moveTo(0, -70);
        ctx.bezierCurveTo(35, -30, 45, 10, 0, 60);
        ctx.bezierCurveTo(-45, 10, -35, -30, 0, -70);
        ctx.closePath();
        ctx.stroke();

        // Draw center leaf rib
        ctx.beginPath();
        ctx.moveTo(0, -60);
        ctx.lineTo(0, 50);
        ctx.stroke();
        ctx.restore();
      } else if (techName === 'Dynamics365') {
        // Draw Microsoft Dynamics abstract polygon/geometric layout
        ctx.strokeStyle = '#a5b4fc';
        ctx.fillStyle = '#7f00ff';
        ctx.lineWidth = 6;

        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.beginPath();
        
        // Custom geometric ribbon shape
        ctx.moveTo(-50, -40);
        ctx.lineTo(10, -50);
        ctx.lineTo(50, 20);
        ctx.lineTo(-10, 40);
        ctx.closePath();
        ctx.stroke();

        // Draw inner shard
        ctx.fillStyle = 'rgba(165, 180, 252, 0.4)';
        ctx.beginPath();
        ctx.moveTo(-10, -10);
        ctx.lineTo(30, -5);
        ctx.lineTo(10, 25);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    // Glass Material
    const createGlassMaterial = (colorCode) => {
      return new THREE.MeshPhysicalMaterial({
        color: colorCode,
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.9,     // Transparency
        thickness: 1.5,        // Refraction thickness
        ior: 1.52,             // Index of refraction
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
      });
    };

    // Creating Spheres
    const techData = [
      { name: 'Java', color: 0x00f2fe, angleOffset: 0 },
      { name: 'ReactJS', color: 0x00f2fe, angleOffset: Math.PI / 2 },
      { name: 'MongoDB', color: 0x00f5a0, angleOffset: Math.PI },
      { name: 'Dynamics365', color: 0x7f00ff, angleOffset: (3 * Math.PI) / 2 },
    ];

    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    const spheres = techData.map((tech) => {
      // 1. Create Glass Sphere outer shell
      const sphereGeo = new THREE.SphereGeometry(0.75, 64, 64);
      const glassMat = createGlassMaterial(tech.color);
      const glassMesh = new THREE.Mesh(sphereGeo, glassMat);

      // 2. Create Logo Card Inside Sphere (A flat plane mapped with the texture)
      const cardGeo = new THREE.PlaneGeometry(0.8, 0.8);
      const texture = createLogoTexture(tech.name);
      const cardMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const cardMesh = new THREE.Mesh(cardGeo, cardMat);
      glassMesh.add(cardMesh); // Put the card inside the sphere

      // Add metadata for position and animations
      const item = {
        mesh: glassMesh,
        card: cardMesh,
        angleOffset: tech.angleOffset,
        speed: 0.5,
        orbitRadius: 3.3,
        hoverScale: 1.0,
        yOffset: (Math.random() - 0.5) * 0.5,
      };

      sphereGroup.add(glassMesh);
      return item;
    });

    // Particle field inside 3D space
    const particlesCount = 100;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 15;     // X
      positions[i + 1] = (Math.random() - 0.5) * 15; // Y
      positions[i + 2] = (Math.random() - 0.5) * 10; // Z
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.4,
    });
    const pointsMesh = new THREE.Points(particleGeo, particleMat);
    scene.add(pointsMesh);

    // Mouse Interactions (Raycaster)
    const mouse = new THREE.Vector2(-999, -999);
    const raycaster = new THREE.Raycaster();

    const handleMouseMove = (event) => {
      // Calculate normalized device coordinates
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

      // Update 3D Point Light to track mouse (mapped coordinates)
      mousePointLight.position.x = mouse.x * 6;
      mousePointLight.position.y = mouse.y * 4;
      mousePointLight.position.z = 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let time = 0;
    let reqId;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      time += 0.005;

      // 1. Raycast for Hover Interactions
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(spheres.map((s) => s.mesh));

      let hoveredMesh = null;
      if (intersects.length > 0) {
        hoveredMesh = intersects[0].object;
      }

      // 2. Animate Spheres (Drift and Orbit)
      spheres.forEach((s) => {
        const isHovered = s.mesh === hoveredMesh;

        // Target Scale
        const targetScale = isHovered ? 1.3 : 1.0;
        s.hoverScale += (targetScale - s.hoverScale) * 0.1;
        s.mesh.scale.set(s.hoverScale, s.hoverScale, s.hoverScale);

        // Target speed/emissive glow
        const targetSpeed = isHovered ? 1.5 : 0.4;
        s.speed += (targetSpeed - s.speed) * 0.05;

        // Materials details
        s.mesh.material.emissiveIntensity = isHovered ? 0.3 : 0.0;
        s.mesh.material.emissive = new THREE.Color(isHovered ? 0x00f2fe : 0x000000);

        // Orbit math around card (zero-gravity elliptic orbits)
        const angle = time * s.speed + s.angleOffset;
        const targetX = Math.cos(angle) * s.orbitRadius;
        // Float vertically
        const targetY = Math.sin(time * 0.5 + s.angleOffset) * 0.6 + s.yOffset;
        const targetZ = Math.sin(angle) * 1.5;

        s.mesh.position.x += (targetX - s.mesh.position.x) * 0.05;
        s.mesh.position.y += (targetY - s.mesh.position.y) * 0.05;
        s.mesh.position.z += (targetZ - s.mesh.position.z) * 0.05;

        // Spin the sphere self
        s.mesh.rotation.y += isHovered ? 0.04 : 0.008;
        s.mesh.rotation.x += isHovered ? 0.02 : 0.004;

        // Keep inner logo card facing the camera (billboard effect)
        s.card.quaternion.copy(camera.quaternion);
      });

      // Slowly rotate points space
      pointsMesh.rotation.y += 0.0005;
      pointsMesh.rotation.x += 0.0002;

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(reqId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
    };
  }, []);

  return <div className="three-canvas-container" ref={containerRef} />;
}
