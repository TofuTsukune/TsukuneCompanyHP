/* ========================
   Navbar scroll effect
======================== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ========================
   Hero Canvas — field / farm theme
======================== */
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // --- Field rows (furrows) ---
  const ROW_GAP = 56;
  const FURROW_COLOR = 'rgba(92,184,92,0.06)';

  // --- Grid cells like hatakeru map ---
  const CELL = 70;
  const COLS = Math.ceil(window.innerWidth  / CELL) + 2;
  const ROWS_N = Math.ceil(window.innerHeight / CELL) + 2;
  const cells = [];
  const CELL_COLORS = ['#3a7d44','#5cb85c','#a3e635','#c2713a','#6b9e3a'];
  for (let r = 0; r < ROWS_N; r++) {
    for (let c = 0; c < COLS; c++) {
      if (Math.random() < 0.13) {
        cells.push({
          cx: c * CELL + Math.random() * 20 - 10,
          cy: r * CELL + Math.random() * 20 - 10,
          color: CELL_COLORS[Math.floor(Math.random() * CELL_COLORS.length)],
          opacity: 0.04 + Math.random() * 0.09,
          size: 28 + Math.random() * 24,
          phase: Math.random() * Math.PI * 2,
          speed: 0.003 + Math.random() * 0.005,
        });
      }
    }
  }

  // --- Floating seed/pollen particles ---
  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 1 + Math.random() * 2,
    vy: -0.2 - Math.random() * 0.4,
    vx: (Math.random() - 0.5) * 0.3,
    opacity: 0.15 + Math.random() * 0.4,
    color: Math.random() < 0.6 ? '#a3e635' : '#c2713a',
  }));

  // --- Glowing orbs (sunlight patches) ---
  const orbs = [
    { x: 0.2, y: 0.3, r: 280, color: '#3a7d44', op: 0.12 },
    { x: 0.8, y: 0.6, r: 220, color: '#a3e635', op: 0.08 },
    { x: 0.5, y: 0.1, r: 350, color: '#5cb85c', op: 0.07 },
    { x: 0.1, y: 0.8, r: 200, color: '#c2713a', op: 0.06 },
  ];

  let t = 0;
  function draw() {
    t++;
    ctx.clearRect(0, 0, W, H);

    // Sky-to-soil gradient background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0,   '#0a1a0c');
    bg.addColorStop(0.6, '#0d1a0f');
    bg.addColorStop(1,   '#161008');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Sunlight orbs
    orbs.forEach(o => {
      const g = ctx.createRadialGradient(o.x*W, o.y*H, 0, o.x*W, o.y*H, o.r);
      g.addColorStop(0, o.color + Math.round(o.op*255).toString(16).padStart(2,'0'));
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(o.x*W, o.y*H, o.r, 0, Math.PI*2);
      ctx.fill();
    });

    // Furrow lines (horizontal field rows)
    ctx.lineWidth = 1;
    for (let y = 0; y < H; y += ROW_GAP) {
      ctx.strokeStyle = FURROW_COLOR;
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(W, y);
      ctx.stroke();
    }
    // Thin vertical dividers
    ctx.strokeStyle = 'rgba(92,184,92,0.03)';
    for (let x = 0; x < W; x += CELL) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }

    // Pulsing cell highlights (畑マップ区画)
    cells.forEach(c => {
      const pulse = Math.sin(t * c.speed + c.phase) * 0.5 + 0.5;
      ctx.globalAlpha = c.opacity * (0.5 + pulse * 0.5);
      ctx.fillStyle = c.color;
      const s = c.size * (0.85 + pulse * 0.15);
      ctx.beginPath();
      ctx.roundRect(c.cx - s/2, c.cy - s/2, s, s, 6);
      ctx.fill();
    });

    // Floating seed particles (drift upward)
    particles.forEach(p => {
      p.x += p.vx + Math.sin(t * 0.01 + p.y * 0.02) * 0.2;
      p.y += p.vy;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  draw();
})();

/* ========================
   Counter animation
======================== */
function animateCounters() {
  document.querySelectorAll('.stat-item').forEach(item => {
    const target = parseInt(item.dataset.count, 10);
    const counter = item.querySelector('.counter');
    let start = 0;
    const duration = 1800;
    const step = target / (duration / 16);

    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      counter.textContent = Math.floor(start);
      if (start >= target) clearInterval(timer);
    }, 16);
  });
}

/* ========================
   Scroll-triggered visibility
======================== */
function reveal() {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      const delay = parseInt(card.dataset.delay || '0', 10);
      setTimeout(() => card.classList.add('visible'), delay);
    }
  });
}

let countersTriggered = false;
function onScroll() {
  reveal();
  if (!countersTriggered) {
    const stats = document.getElementById('stats');
    if (stats && stats.getBoundingClientRect().top < window.innerHeight - 40) {
      countersTriggered = true;
      animateCounters();
    }
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ========================
   Product card 3D tilt
======================== */
const card3d = document.querySelector('.product-card-3d');
if (card3d) {
  card3d.addEventListener('mousemove', e => {
    const rect = card3d.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card3d.style.transform = `perspective(600px) rotateY(${x * 20}deg) rotateX(${-y * 20}deg) translateY(-8px)`;
  });
  card3d.addEventListener('mouseleave', () => {
    card3d.style.transform = '';
  });
}

/* ========================
   Contact form
======================== */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.textContent = '送信しました ✓';
    btn.style.background = 'linear-gradient(135deg, #4ade80, #22d3ee)';
    btn.disabled = true;
    setTimeout(() => {
      form.reset();
      btn.textContent = '送信する';
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  });
}
