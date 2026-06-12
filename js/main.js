/* ============================================
   MSquare — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Loader ---
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 1400);
  });
  // Fallback: hide loader after 3s regardless
  setTimeout(() => loader.classList.add('hidden'), 3000);

  // --- Theme Toggle ---
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeToggleMobile = document.getElementById('themeToggleMobile');
  const themeIconMobile = document.getElementById('themeIconMobile');
  const stored = localStorage.getItem('msquare-theme');

  function updateThemeUI(theme) {
    const iconClass = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    const label = theme === 'light' ? 'Light Mode' : 'Dark Mode';
    if (themeIcon) themeIcon.className = iconClass;
    if (themeIconMobile) themeIconMobile.className = iconClass;
    const mobileLabel = themeToggleMobile?.querySelector('span');
    if (mobileLabel) mobileLabel.textContent = label;
  }

  if (stored) {
    html.setAttribute('data-theme', stored);
    updateThemeUI(stored);
  }

  function toggleTheme() {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('msquare-theme', next);
    updateThemeUI(next);
  }

  themeToggle.addEventListener('click', toggleTheme);
  if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

  // --- Mobile Menu ---
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', navMenu.classList.contains('active'));
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // --- Header Scroll ---
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // --- Mobile: hide header on scroll down, show on hero ---
  let lastScrollY = 0;
  const heroSection = document.getElementById('hero');
  const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);

    if (window.matchMedia('(max-width: 768px)').matches) {
      if (window.scrollY > heroHeight) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
    } else {
      header.style.transform = '';
    }

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });

    // Parallax orbs
    const orbs = document.querySelectorAll('.orb');
    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 0.03;
      orb.style.transform = `translateY(${window.scrollY * speed}px)`;
    });
  }, { passive: true });

  // --- Scroll Reveal ---
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => revealObserver.observe(el));

  // --- Counter Animation ---
  const counters = document.querySelectorAll('.stat-number[data-count], .impact-number[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const duration = 1500;
        const start = performance.now();
        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased);
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  // --- Card Tilt Effect (desktop only) ---
  if (window.matchMedia('(min-width: 769px)').matches) {
    document.querySelectorAll('.service-card, .about-card, .training-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -4;
        const rotateY = (x - centerX) / centerX * 4;
        card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // --- Smooth Section Transitions with Stagger ---
  document.querySelectorAll('.services-grid .service-card, .about-grid .about-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
  });

  // --- Contact Form ---
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.pointerEvents = 'none';
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.pointerEvents = '';
      form.reset();
    }, 2500);
  });

  // --- Mobile Carousel Manual Swipe + Dot Indicators ---
  if (window.matchMedia('(max-width: 768px)').matches) {
    const carousels = document.querySelectorAll('.about-grid, .services-grid, .training-grid, .tech-row');

    carousels.forEach(carousel => {
      const items = Array.from(carousel.children).filter(el => el.nodeType === 1 && el.offsetWidth > 0);
      if (items.length < 2) return;

      // Create dot indicators
      const dotsWrap = document.createElement('div');
      dotsWrap.className = 'carousel-dots';
      items.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => {
          carousel.scrollTo({ left: items[i].offsetLeft - carousel.offsetLeft - 16, behavior: 'smooth' });
        });
        dotsWrap.appendChild(dot);
      });
      carousel.parentNode.insertBefore(dotsWrap, carousel.nextSibling);

      // Update dots on scroll
      let scrollTimeout;
      carousel.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const scrollLeft = carousel.scrollLeft;
          const center = scrollLeft + carousel.offsetWidth / 2;
          let closest = 0;
          let minDist = Infinity;
          items.forEach((item, i) => {
            const itemCenter = item.offsetLeft - carousel.offsetLeft + item.offsetWidth / 2;
            const dist = Math.abs(center - itemCenter);
            if (dist < minDist) { minDist = dist; closest = i; }
          });
          dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
            d.classList.toggle('active', i === closest);
          });
        }, 50);
      }, { passive: true });
    });
  }

  // --- Magnetic Buttons ---
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // --- Smooth Appear on Scroll (enhanced) ---
  const observeOptions = { threshold: 0.05, rootMargin: '0px 0px -60px 0px' };
  const appearObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = entry.target.dataset.delay || '0s';
        entry.target.classList.add('in-view');
      }
    });
  }, observeOptions);
  document.querySelectorAll('.section-header, .hero-content').forEach(el => {
    el.classList.add('appear-target');
    appearObserver.observe(el);
  });

  // --- Hero Canvas Animation (Neural Network) ---
  const canvas = document.getElementById('heroCanvas');
  if (canvas) initHeroCanvas(canvas);
});

function initHeroCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  let width, height, nodes, mouse, raf;

  mouse = { x: -1000, y: -1000 };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createNodes();
  }

  function createNodes() {
    const count = Math.min(Math.floor((width * height) / 12000), 120);
    nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const nodeColor = isDark ? 'rgba(99, 130, 255, 0.6)' : 'rgba(59, 100, 246, 0.35)';
    const lineColor = isDark ? 'rgba(99, 130, 255,' : 'rgba(59, 100, 246,';
    const maxDist = 140;

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      // Mouse interaction
      const dx = mouse.x - n.x;
      const dy = mouse.y - n.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        n.x -= dx * 0.005;
        n.y -= dy * 0.005;
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor;
      ctx.fill();

      for (let j = i + 1; j < nodes.length; j++) {
        const m = nodes[j];
        const ddx = n.x - m.x;
        const ddy = n.y - m.y;
        const d = Math.sqrt(ddx * ddx + ddy * ddy);
        if (d < maxDist) {
          const alpha = (1 - d / maxDist) * 0.25;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.strokeStyle = lineColor + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(draw);
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });

  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    resize();
    draw();
  });

  resize();
  draw();
}
