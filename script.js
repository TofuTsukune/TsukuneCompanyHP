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
   Hero Canvas — floating particles & gradient orbs
======================== */
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#6c63ff', '#00f5c4', '#f97316', '#a855f7', '#22d3ee'];

  // Orbs
  const orbs = Array.from({ length: 5 }, (_, i) => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 150 + Math.random() * 200,
    color: COLORS[i % COLORS.length],
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    opacity: 0.08 + Math.random() * 0.1,
  }));

  // Particles
  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 0.5 + Math.random() * 1.5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    opacity: 0.3 + Math.random() * 0.5,
  }));

  // Grid lines
  function drawGrid() {
    ctx.strokeStyle = 'rgba(108,99,255,0.04)';
    ctx.lineWidth = 1;
    const gap = 60;
    for (let x = 0; x < canvas.width; x += gap) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gap) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
  }

  let raf;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = '#09090f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    // Orbs
    orbs.forEach(o => {
      o.x += o.vx; o.y += o.vy;
      if (o.x < -o.r) o.x = canvas.width + o.r;
      if (o.x > canvas.width + o.r) o.x = -o.r;
      if (o.y < -o.r) o.y = canvas.height + o.r;
      if (o.y > canvas.height + o.r) o.y = -o.r;

      const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      g.addColorStop(0, o.color + Math.round(o.opacity * 255).toString(16).padStart(2, '0'));
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Particles
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(draw);
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
