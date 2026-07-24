/* ==========================================================
   BACKGROUND ANIMATION (matter-in-motion inspired)
   - Canvas atmospheric field (soft blobs + cursor glow)
   - Three.js particle field reactive to mouse & scroll
   ========================================================== */
(function () {
  "use strict";

  /* ---------- 1) Atmospheric Canvas ---------- */
  (function initAtmosphere() {
    const canvas = document.getElementById("atmosphere");
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: true, pulse: 0 };

    const blobs = [
      { x: 0.28, y: 0.38, r: 0.34, vx: 0.00018, vy: 0.00012, color: "184,199,217", alpha: 0.12 },
      { x: 0.70, y: 0.28, r: 0.26, vx: -0.00014, vy: 0.00011, color: "213,181,116", alpha: 0.08 },
      { x: 0.54, y: 0.72, r: 0.38, vx: 0.00010, vy: -0.00015, color: "143,168,197", alpha: 0.09 },
      { x: 0.18, y: 0.78, r: 0.24, vx: 0.00016, vy: -0.00008, color: "241,236,227", alpha: 0.045 }
    ];

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    window.addEventListener("pointermove", (event) => {
      mouse.tx = event.clientX / width;
      mouse.ty = event.clientY / height;
      mouse.active = true;
    }, { passive: true });

    window.addEventListener("pointerdown", () => { mouse.pulse = 1; });

    function draw(time) {
      const t = time * 0.001;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      mouse.pulse *= 0.94;

      ctx.clearRect(0, 0, width, height);

      const base = ctx.createRadialGradient(
        width * 0.5, height * 0.42, 0,
        width * 0.5, height * 0.5, Math.max(width, height) * 0.82
      );
      base.addColorStop(0, "#10141c");
      base.addColorStop(0.46, "#07080b");
      base.addColorStop(1, "#050506");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "screen";

      for (const blob of blobs) {
        blob.x += Math.sin(t * 0.18 + blob.r * 4) * blob.vx;
        blob.y += Math.cos(t * 0.15 + blob.r * 5) * blob.vy;
        const driftX = Math.sin(t * 0.25 + blob.r * 12) * 0.04;
        const driftY = Math.cos(t * 0.22 + blob.r * 8) * 0.035;
        const x = (blob.x + driftX) * width;
        const y = (blob.y + driftY) * height;
        const radius = blob.r * Math.max(width, height);
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(${blob.color}, ${blob.alpha})`);
        gradient.addColorStop(0.44, `rgba(${blob.color}, ${blob.alpha * 0.36})`);
        gradient.addColorStop(1, `rgba(${blob.color}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      const mx = mouse.x * width;
      const my = mouse.y * height;
      const mr = Math.max(width, height) * (0.18 + mouse.pulse * 0.18);
      const cursorGlow = ctx.createRadialGradient(mx, my, 0, mx, my, mr);
      cursorGlow.addColorStop(0, `rgba(184, 199, 217, ${mouse.active ? 0.1 + mouse.pulse * 0.12 : 0.025})`);
      cursorGlow.addColorStop(0.42, `rgba(213, 181, 116, ${mouse.active ? 0.05 + mouse.pulse * 0.08 : 0.01})`);
      cursorGlow.addColorStop(1, "rgba(184, 199, 217, 0)");
      ctx.fillStyle = cursorGlow;
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "source-over";
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  })();

  /* ---------- 2) Three.js Particle Field ---------- */
  if (typeof THREE !== "undefined") {
    const canvas = document.getElementById("webgl");
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 14;

    const isMobile = window.innerWidth < 720;
    
    // 💡 FIX 1: Dots count kafi kam kar diya hai (3600 -> 600)
    const COUNT = isMobile ? 250 : 3600;

    function createDotTexture() {
      const c = document.createElement("canvas");
      c.width = 32;
      c.height = 32;
      const g = c.getContext("2d");
      const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.3, "rgba(255,255,255,0.8)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grad;
      g.beginPath();
      g.arc(16, 16, 16, 0, Math.PI * 2);
      g.fill();
      
      const texture = new THREE.CanvasTexture(c);
      texture.needsUpdate = true;
      return texture;
    }

    const palette = [
      new THREE.Color("#9fb3cc"),
      new THREE.Color("#d5b574"),
      new THREE.Color("#b79cff"),
      new THREE.Color("#7fb6ff"),
      new THREE.Color("#ff9ed2")
    ];

    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      positions[i3]     = (Math.random() - 0.5) * 40;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i3]     = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: isMobile ? 0.08 : 0.08,
      map: createDotTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let mx = 0, my = 0, tmx = 0, tmy = 0;
    
    window.addEventListener("pointermove", (e) => {
      tmx = (e.clientX / window.innerWidth - 0.5) * 2;
      tmy = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    let scrollY = 0;
    window.addEventListener("scroll", () => {
      scrollY = window.scrollY || window.pageYOffset;
    }, { passive: true });

    const clock = new THREE.Clock();
    
    function render() {
      const t = clock.getElapsedTime();
      
      mx += (tmx - mx) * 0.05;
      my += (tmy - my) * 0.05;

      points.rotation.y = t * 0.015 + mx * 0.2;
      points.rotation.x = my * 0.15;
      points.position.y = Math.sin(t * 0.15) * 0.3;

      // 💡 FIX 2: Dynamic smooth parallax continuous scrolling till bottom
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
      camera.position.y = -scrollProgress * 6; 

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    render();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
})();