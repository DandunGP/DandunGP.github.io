/**
 * script.js — Portfolio Dandun Gigih Prakoso
 * Features: Nav toggle, smooth scroll, metric counter, terminal log
 */

(function () {
  'use strict';

  /* =====================
     1. NAV TOGGLE (Mobile)
  ===================== */
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on nav link click
    navMenu.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ===========================
     2. HEADER SCROLL BEHAVIOR
  =========================== */
  const header = document.querySelector('.site-header');

  if (header) {
    const onScroll = () => {
      header.style.borderBottomColor = window.scrollY > 40
        ? 'rgba(42,42,42,0.8)'
        : 'var(--clr-border)';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ===========================
     3. INTERSECTION OBSERVER
        (Fade-in on scroll)
  =========================== */
  const observeTargets = document.querySelectorAll(
    '.project-card, .stat-card, .stack__group, .monitor__card, .exp-item'
  );

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    observeTargets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      fadeObserver.observe(el);
    });

    // Inject reveal class
    document.head.insertAdjacentHTML('beforeend', '<style>.reveal { opacity: 1 !important; transform: translateY(0) !important; }</style>');
  }

  /* ===========================
     4. METRIC COUNTER ANIMATION
  =========================== */
  function animateCounter(el, target, isFloat, duration) {
    const start     = performance.now();
    const startVal  = 0;

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current  = startVal + (target - startVal) * eased;

      el.textContent = isFloat
        ? current.toFixed(1)
        : Math.round(current).toString();

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  const metricEls = document.querySelectorAll('.monitor__value[data-target]');

  if ('IntersectionObserver' in window && metricEls.length) {
    const metricObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseFloat(el.dataset.target);
          const isFloat = el.dataset.target.includes('.');
          animateCounter(el, target, isFloat, 1200);
          metricObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    metricEls.forEach(el => metricObserver.observe(el));
  }

  /* ===========================
     5. TERMINAL LOG ANIMATION
  =========================== */
  const terminalLog = document.getElementById('terminalLog');

  const LOG_LINES = [
    { type: 'cmd', text: 'docker ps' },
    { type: 'out', text: 'CONTAINER ID   IMAGE           STATUS' },
    { type: 'out', text: 'a3f1b2c4d5e6   portfolio:v1    Up 42 days' },
    { type: 'cmd', text: 'curl -s localhost/health | jq .status' },
    { type: 'out', text: '"ok"' },
    { type: 'cmd', text: 'echo "All systems operational ✓"' },
    { type: 'out', text: 'All systems operational ✓' },
  ];

  function renderTerminalLine(lineData, delay) {
    return new Promise(resolve => {
      setTimeout(() => {
        const p = document.createElement('p');
        p.className = 'terminal__line';
        p.style.animationDelay = '0ms';

        if (lineData.type === 'cmd') {
          p.innerHTML = `<span class="terminal__prompt" aria-hidden="true">$</span> <span class="terminal__cmd">${lineData.text}</span>`;
        } else {
          p.innerHTML = `<span class="terminal__out" aria-hidden="true">${lineData.text}</span>`;
        }

        terminalLog.appendChild(p);
        terminalLog.scrollTop = terminalLog.scrollHeight;
        resolve();
      }, delay);
    });
  }

  function startTerminal() {
    // Clear the initial static line
    terminalLog.innerHTML = '';
    let delay = 0;

    LOG_LINES.forEach((line, i) => {
      delay += i === 0 ? 300 : line.type === 'cmd' ? 600 : 200;
      renderTerminalLine(line, delay);
    });
  }

  if (terminalLog && 'IntersectionObserver' in window) {
    const terminalObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startTerminal();
          terminalObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    terminalObserver.observe(terminalLog);
  }

})();
