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
   Hero Canvas — soft green field
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

  // 畑の畝（うね）— 水平のなだらかな波線
  const FURROW_COUNT = 14;
  const furrows = Array.from({ length: FURROW_COUNT }, (_, i) => ({
    yBase: (i + 1) / (FURROW_COUNT + 1),
    amp:   4 + Math.random() * 6,
    freq:  0.002 + Math.random() * 0.002,
    phase: Math.random() * Math.PI * 2,
    speed: 0.003 + Math.random() * 0.003,
    alpha: 0.10 + Math.random() * 0.12,
    width: 1.5 + Math.random(),
    color: Math.random() < 0.5 ? '#6dbf6d' : '#8bc34a',
  }));

  // ゆっくり流れる葉っぱ・タネ
  function makeLeaf() {
    return {
      x:   Math.random() * W,
      y:   H + 20,
      size: 4 + Math.random() * 7,
      vx:  (Math.random() - 0.5) * 0.6,
      vy:  -(0.4 + Math.random() * 0.5),
      rot:  Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.015,
      opacity: 0.25 + Math.random() * 0.35,
      hue:  100 + Math.random() * 50,
    };
  }
  const leaves = Array.from({ length: 28 }, () => {
    const l = makeLeaf();
    l.y = Math.random() * H;
    return l;
  });

  // ふわっとした光のにじみ（小さく・薄く・暖かい色）
  const glows = [
    { rx: 0.15, ry: 0.25, r: 320, h: 110, s: 55, l: 35, a: 0.13 },
    { rx: 0.85, ry: 0.55, r: 260, h: 90,  s: 50, l: 38, a: 0.10 },
    { rx: 0.50, ry: 0.80, r: 380, h: 125, s: 45, l: 30, a: 0.09 },
    { rx: 0.70, ry: 0.15, r: 200, h: 75,  s: 60, l: 40, a: 0.08 },
  ];

  let t = 0;
  function draw() {
    t += 0.5;
    ctx.clearRect(0, 0, W, H);

    // ── 背景グラデーション（明るい緑〜柔らかい深緑）──
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0,   '#1e3d20');   // 上: 少し明るい森の緑
    bg.addColorStop(0.5, '#162b18');   // 中: 落ち着いた緑
    bg.addColorStop(1,   '#1a2e14');   // 下: 土混じりの深緑
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // ── 光のにじみ（大きすぎず、淡く）──
    glows.forEach(g => {
      const x = g.rx * W, y = g.ry * H;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, g.r);
      const c0 = `hsla(${g.h},${g.s}%,${g.l}%,${g.a})`;
      grad.addColorStop(0,   c0);
      grad.addColorStop(0.5, `hsla(${g.h},${g.s}%,${g.l}%,${g.a * 0.3})`);
      grad.addColorStop(1,   'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    });

    // ── 畝の波線 ──
    furrows.forEach(f => {
      const y0 = f.yBase * H;
      ctx.beginPath();
      ctx.moveTo(0, y0);
      for (let x = 0; x <= W; x += 4) {
        const wave = Math.sin(x * f.freq + t * f.speed + f.phase) * f.amp;
        ctx.lineTo(x, y0 + wave);
      }
      ctx.strokeStyle = f.color;
      ctx.globalAlpha = f.alpha;
      ctx.lineWidth = f.width;
      ctx.stroke();
    });

    // ── 葉っぱ・タネがふんわり舞う ──
    leaves.forEach(lf => {
      lf.x   += lf.vx + Math.sin(t * 0.012 + lf.y * 0.01) * 0.25;
      lf.y   += lf.vy;
      lf.rot += lf.vrot;
      if (lf.y < -30) Object.assign(lf, makeLeaf());

      ctx.save();
      ctx.translate(lf.x, lf.y);
      ctx.rotate(lf.rot);
      ctx.globalAlpha = lf.opacity;
      ctx.fillStyle = `hsl(${lf.hue},55%,52%)`;
      // 葉の形（楕円）
      ctx.beginPath();
      ctx.ellipse(0, 0, lf.size, lf.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
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
