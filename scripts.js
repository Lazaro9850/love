/* ============================================================
   NOSSO CANTINHO — scripts.js
   Corações no canvas · Reveal da timeline · Countdown flip
   ============================================================ */

// ─── 1. CORAÇÕES NO CANVAS ───────────────────────────────────

(function () {
  const canvas = document.getElementById('heart-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;
  const particles = [];
  const COUNT = 28;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Desenha um coração path
  function heartPath(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size, size);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-0.5, -0.4, -1.0,  0.2, 0, 0.8);
    ctx.bezierCurveTo( 1.0,  0.2,  0.5, -0.4, 0, 0);
    ctx.restore();
  }

  function createParticle() {
    return {
      x:        Math.random() * W,
      y:        H + 20,
      size:     4 + Math.random() * 10,
      speed:    0.4 + Math.random() * 0.7,
      drift:    (Math.random() - 0.5) * 0.4,
      opacity:  0,
      maxOp:    0.3 + Math.random() * 0.35,
      phase:    Math.random() * Math.PI * 2,
      lifespan: 0.8 + Math.random() * 0.4,  // fração de H percorrida
      progress: 0,
      rotation: (Math.random() - 0.5) * 0.3,
      rotSpd:   (Math.random() - 0.5) * 0.008,
    };
  }

  for (let i = 0; i < COUNT; i++) {
    const p = createParticle();
    p.y = Math.random() * H; // posições iniciais espalhadas
    p.progress = Math.random() * 0.5;
  }

  // pré-popula com alguns visíveis
  for (let i = 0; i < COUNT; i++) particles.push(createParticle());
  particles.forEach(p => { p.y = Math.random() * H; });

  function drawHeart(ctx, x, y, size, opacity, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(size, size);

    ctx.beginPath();
    ctx.moveTo(0, -0.3);
    // lado esquerdo
    ctx.bezierCurveTo(-0.5, -0.8,  -1.0, -0.1,  0, 0.6);
    // lado direito
    ctx.bezierCurveTo( 1.0, -0.1,   0.5, -0.8,  0, -0.3);
    ctx.closePath();

    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    grad.addColorStop(0,   `rgba(255, 160, 185, ${opacity})`);
    grad.addColorStop(0.5, `rgba(255, 77, 109,  ${opacity * 0.9})`);
    grad.addColorStop(1,   `rgba(160, 0, 60,    ${opacity * 0.4})`);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  let lastTime = 0;

  function tick(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 16.67, 3); // frames delta
    lastTime = timestamp;

    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // movimento
      p.y       -= p.speed * dt;
      p.x       += Math.sin(p.phase + p.y * 0.012) * p.drift;
      p.rotation += p.rotSpd * dt;
      p.phase   += 0.015 * dt;

      const traveled = 1 - (p.y / H);

      // fade in/out
      if (traveled < 0.15) {
        p.opacity = (traveled / 0.15) * p.maxOp;
      } else if (traveled > 0.75) {
        p.opacity = ((1 - traveled) / 0.25) * p.maxOp;
      } else {
        p.opacity = p.maxOp;
      }

      if (p.y < -30) {
        // recicla
        Object.assign(p, createParticle());
      }

      if (p.opacity > 0.01) {
        drawHeart(ctx, p.x, p.y, p.size, p.opacity, p.rotation);
      }
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();


// ─── 2. REVEAL NA TIMELINE (IntersectionObserver) ────────────

(function () {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // escalonamento de 80ms por item visível
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach(el => observer.observe(el));
})();


// ─── 3. COUNTDOWN COM FLIP ───────────────────────────────────

(function () {
  // Data de referência: primeiro encontro / data que se conheceram
  const START = new Date('2025-04-21T00:00:00');

  const elDays    = document.getElementById('cd-days');
  const elHours   = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');

  if (!elDays) return;

  let prevValues = {};

  function pad(n, len = 2) {
    return String(n).padStart(len, '0');
  }

  function flipUpdate(el, newVal) {
    if (el.textContent === newVal) return;

    // flip-out
    el.classList.add('flip-out');

    setTimeout(() => {
      el.textContent = newVal;
      // reflow
      el.classList.remove('flip-out');
      el.classList.add('flip-in');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.classList.remove('flip-in');
        });
      });
    }, 220);
  }

  function update() {
    const now    = new Date();
    const diffMs = now - START;

    if (diffMs < 0) {
      elDays.textContent    = '000';
      elHours.textContent   = '00';
      elMinutes.textContent = '00';
      elSeconds.textContent = '00';
      return;
    }

    const totalSec = Math.floor(diffMs / 1000);
    const days     = Math.floor(totalSec / 86400);
    const hours    = Math.floor((totalSec % 86400) / 3600);
    const minutes  = Math.floor((totalSec % 3600) / 60);
    const seconds  = totalSec % 60;

    flipUpdate(elDays,    pad(days, 3));
    flipUpdate(elHours,   pad(hours));
    flipUpdate(elMinutes, pad(minutes));
    flipUpdate(elSeconds, pad(seconds));
  }

  update();
  setInterval(update, 1000);
})();


// ─── 4. EFEITO PARALLAX SUAVE NO HERO ───────────────────────

(function () {
  const hero = document.querySelector('.hero-inner');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let rafId;
  document.addEventListener('mousemove', (e) => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      hero.style.transform = `translate(${dx * 5}px, ${dy * 4}px)`;
    });
  });

  document.addEventListener('mouseleave', () => {
    hero.style.transform = '';
  });
})();


// ─── 5. BRILHO NAS FOTOS DA GALERIA AO MOVER O MOUSE ────────

(function () {
  const cards = document.querySelectorAll('.gallery-card');
  if (!cards.length) return;

  cards.forEach(card => {
    const shine = card.querySelector('.gallery-shine');
    if (!shine) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      shine.style.background =
        `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.12) 0%, rgba(255,77,109,0.05) 40%, transparent 70%)`;
    });

    card.addEventListener('mouseleave', () => {
      shine.style.background = '';
    });
  });
})();
