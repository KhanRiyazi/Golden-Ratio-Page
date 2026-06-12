/* =========================================================
   DataMind — Vanilla JS
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1. NAVBAR — scroll + hamburger
  --------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobLinks = document.querySelectorAll('.mob-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    document.getElementById('backTop').classList.toggle('show', window.scrollY > 600);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---------------------------------------------------------
     2. BACK TO TOP
  --------------------------------------------------------- */
  document.getElementById('backTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------------------------------------
     3. TYPED TEXT EFFECT
  --------------------------------------------------------- */
  const phrases = [
    'competitive edge.',
    'product decisions.',
    'revenue uplift.',
    'customer insight.',
    'operational clarity.',
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;
  const typedEl = document.getElementById('typedText');

  function type() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      typedEl.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 50 : 90);
  }
  type();

  /* ---------------------------------------------------------
     4. PARTICLE CANVAS
  --------------------------------------------------------- */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [], animId;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.4 + 0.05,
    };
  }

  function initParticles() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 120);
    particles = Array.from({ length: count }, createParticle);
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,169,110,${p.alpha})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(200,169,110,${0.08 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(drawParticles);
  }

  resize();
  initParticles();
  drawParticles();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    initParticles();
    drawParticles();
  });

  /* ---------------------------------------------------------
     5. COUNTER ANIMATION (hero stats)
  --------------------------------------------------------- */
  let countersStarted = false;

  function animateCounters() {
    if (countersStarted) return;
    countersStarted = true;
    document.querySelectorAll('.stat-num[data-target]').forEach(el => {
      const target = +el.dataset.target;
      const duration = 1800;
      const start = performance.now();
      function update(now) {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(ease * target);
        if (t < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  /* ---------------------------------------------------------
     6. INTERSECTION OBSERVER — reveal + counters
  --------------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObs.observe(el));

  const statsObs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { animateCounters(); statsObs.disconnect(); }
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObs.observe(heroStats);

  /* ---------------------------------------------------------
     7. CASE STUDY FILTER
  --------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const caseCards = document.querySelectorAll('.case-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      caseCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ---------------------------------------------------------
     8. TESTIMONIALS SLIDER
  --------------------------------------------------------- */
  const cards = document.querySelectorAll('.testimonial-card');
  const dotsWrap = document.getElementById('tDots');
  let activeIdx = 0, autoPlay;

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 't-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(idx) {
    cards[activeIdx].classList.remove('active');
    dotsWrap.children[activeIdx].classList.remove('active');
    activeIdx = (idx + cards.length) % cards.length;
    cards[activeIdx].classList.add('active');
    dotsWrap.children[activeIdx].classList.add('active');
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoPlay);
    autoPlay = setInterval(() => goTo(activeIdx + 1), 6000);
  }

  document.getElementById('tPrev').addEventListener('click', () => goTo(activeIdx - 1));
  document.getElementById('tNext').addEventListener('click', () => goTo(activeIdx + 1));
  resetAuto();

  /* ---------------------------------------------------------
     9. CHURN RISK DEMO WIDGET
  --------------------------------------------------------- */
  const loginSlider = document.getElementById('loginSlider');
  const usageSlider = document.getElementById('usageSlider');
  const ticketSlider = document.getElementById('ticketSlider');
  const ageSlider = document.getElementById('ageSlider');

  const loginVal = document.getElementById('loginVal');
  const usageVal = document.getElementById('usageVal');
  const ticketVal = document.getElementById('ticketVal');
  const ageVal = document.getElementById('ageVal');

  const riskScore = document.getElementById('riskScore');
  const riskText = document.getElementById('riskText');
  const gaugeArc = document.getElementById('gaugeArc');
  const gaugeNeedle = document.getElementById('gaugeNeedle');

  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

  function computeRisk() {
    const login = +loginSlider.value;   // 1–90
    const usage = +usageSlider.value;   // 0–100
    const tickets = +ticketSlider.value;  // 0–20
    const age = +ageSlider.value;     // 1–60

    // Simplified logistic-like model
    const loginScore = clamp(login / 90, 0, 1);
    const usageScore = clamp(1 - usage / 100, 0, 1);
    const ticketScore = clamp(tickets / 20, 0, 1);
    const ageScore = clamp(1 - Math.min(age, 24) / 24, 0, 1) * 0.5;

    const weights = [0.35, 0.30, 0.25, 0.10];
    const raw = loginScore * weights[0]
      + usageScore * weights[1]
      + ticketScore * weights[2]
      + ageScore * weights[3];

    return Math.round(clamp(raw, 0, 1) * 100);
  }

  function updateGauge(risk) {
    const pct = risk / 100;
    // Arc: full path is ~251.2px. We show that fraction.
    const offset = 251.2 * (1 - pct);
    gaugeArc.style.strokeDashoffset = offset;

    // Needle: rotate from -90 (0%) to +90 (100%), centered at 100,100
    const angle = -90 + pct * 180;
    gaugeNeedle.setAttribute('transform', `rotate(${angle}, 100, 100)`);

    // Color needle based on risk
    if (risk < 35) {
      gaugeArc.style.stroke = '#22c55e';
      gaugeNeedle.style.stroke = '#22c55e';
    } else if (risk < 65) {
      gaugeArc.style.stroke = '#f59e0b';
      gaugeNeedle.style.stroke = '#f59e0b';
    } else {
      gaugeArc.style.stroke = '#ef4444';
      gaugeNeedle.style.stroke = '#ef4444';
    }

    riskScore.textContent = risk + '%';
    if (risk < 35) {
      riskText.textContent = 'Low Risk';
      riskText.style.color = '#22c55e';
    } else if (risk < 65) {
      riskText.textContent = 'Medium Risk';
      riskText.style.color = '#f59e0b';
    } else {
      riskText.textContent = 'High Risk';
      riskText.style.color = '#ef4444';
    }
  }

  function updateFeatureImportance() {
    const login = +loginSlider.value;
    const usage = +usageSlider.value;
    const tickets = +ticketSlider.value;
    const age = +ageSlider.value;

    const fi = [
      { el: document.getElementById('fiLogin'), val: Math.round((login / 90) * 100) },
      { el: document.getElementById('fiUsage'), val: Math.round((1 - usage / 100) * 100) },
      { el: document.getElementById('fiTicket'), val: Math.round((tickets / 20) * 100) },
      { el: document.getElementById('fiAge'), val: Math.round((1 - Math.min(age, 24) / 24) * 50) },
    ];
    fi.forEach(f => { f.el.style.width = f.val + '%'; });
  }

  function onSliderChange() {
    loginVal.textContent = loginSlider.value;
    usageVal.textContent = usageSlider.value;
    ticketVal.textContent = ticketSlider.value;
    ageVal.textContent = ageSlider.value;
    const risk = computeRisk();
    updateGauge(risk);
    updateFeatureImportance();
  }

  [loginSlider, usageSlider, ticketSlider, ageSlider].forEach(s => {
    s.addEventListener('input', onSliderChange);
  });
  onSliderChange(); // initial render

  /* ---------------------------------------------------------
     10. CONTACT FORM — EmailJS integration
     ─────────────────────────────────────────────────────────
     SETUP INSTRUCTIONS:
       1. Go to https://www.emailjs.com and sign in / create account.
       2. Add an Email Service  → copy the Service ID  → paste below.
       3. Create an Email Template.  In the template body use these
          exact variables (they match the name= attributes in the HTML):
            {{from_name}}   – sender's name
            {{reply_to}}    – sender's email  (also set as Reply-To)
            {{company}}     – sender's company
            {{service_type}}– selected service
            {{message}}     – message body
       4. Copy the Template ID  → paste below.
       5. In Account → API Keys copy your Public Key → paste below.
  --------------------------------------------------------- */

  const EMAILJS_PUBLIC_KEY = 'lw5zAQBaO0vplNahu';   // ← replace
  const EMAILJS_SERVICE_ID = 'service_u0xxknq';   // ← replace
  const EMAILJS_TEMPLATE_ID = 'template_tbiudtb';  // ← replace

  // Initialise EmailJS once (must be called before send)
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  } else {
    console.warn('EmailJS SDK not loaded — check your internet connection.');
  }

  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');
  const formError = document.getElementById('formError');

  // Helper: show a message in the error banner
  function showError(msg) {
    formError.textContent = msg;
    formError.classList.add('show');
    formSuccess.classList.remove('show');
  }

  // Helper: reset button state
  function resetBtn() {
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
  }

  submitBtn.addEventListener('click', async () => {
    // ── 1. Collect values ────────────────────────────────
    const nameVal = document.getElementById('fname').value.trim();
    const emailVal = document.getElementById('femail').value.trim();
    const companyVal = document.getElementById('fcompany').value.trim();
    const typeVal = document.getElementById('ftype').value;
    const msgVal = document.getElementById('fmessage').value.trim();

    // ── 2. Hide previous feedback ─────────────────────────
    formSuccess.classList.remove('show');
    formError.classList.remove('show');

    // ── 3. Validate ───────────────────────────────────────
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!nameVal) return showError('Please enter your name.');
    if (!emailVal) return showError('Please enter your email address.');
    if (!emailRe.test(emailVal)) return showError('Please enter a valid email address.');
    if (!typeVal) return showError('Please select a service.');
    if (!msgVal) return showError('Please tell us a bit about your project.');

    // ── 4. Guard: SDK loaded? ─────────────────────────────
    if (typeof emailjs === 'undefined') {
      return showError('Email service not available. Please email us directly at hello@datamind.io');
    }

    // ── 5. Guard: keys still placeholder? ────────────────
    if (
      EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY' ||
      EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' ||
      EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID'
    ) {
      // Dev mode: show success so the rest of the UI can be tested
      console.warn('⚠ EmailJS keys not configured — running in demo mode.');
      formSuccess.classList.add('show');
      ['fname', 'femail', 'fcompany', 'fmessage'].forEach(id => document.getElementById(id).value = '');
      document.getElementById('ftype').value = '';
      return;
    }

    // ── 6. Build template params (must match your template vars) ──
    const templateParams = {
      from_name: nameVal,
      reply_to: emailVal,
      company: companyVal || 'Not provided',
      service_type: typeVal,
      message: msgVal,
    };

    // ── 7. Send ───────────────────────────────────────────
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    try {
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        formSuccess.classList.add('show');
        // Clear form on success
        ['fname', 'femail', 'fcompany', 'fmessage'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('ftype').value = '';
      } else {
        // Unexpected non-200 from EmailJS
        showError(`Send failed (status ${response.status}). Please try again or email us directly.`);
      }

    } catch (err) {
      // Network / auth / template errors all land here
      console.error('EmailJS error:', err);

      let friendly = 'Something went wrong. Please try again.';

      if (err && err.status) {
        switch (err.status) {
          case 400: friendly = 'Bad request — check that your Template variables match the form field names.'; break;
          case 401: friendly = 'Unauthorised — your Public Key may be incorrect.'; break;
          case 402: friendly = 'EmailJS monthly quota reached. Please email us at hello@datamind.io'; break;
          case 403: friendly = 'Forbidden — check your Service ID and domain allowlist in EmailJS.'; break;
          case 404: friendly = 'Template or Service not found — double-check your IDs.'; break;
          case 422: friendly = 'Template variable mismatch — ensure {{from_name}}, {{reply_to}}, {{company}}, {{service_type}}, {{message}} are in your template.'; break;
          case 429: friendly = 'Too many requests. Please wait a moment and try again.'; break;
          default: friendly = `Error ${err.status}: ${err.text || 'Unknown error'}.`;
        }
      } else if (!navigator.onLine) {
        friendly = 'You appear to be offline. Please check your connection and try again.';
      }

      showError(friendly);
    } finally {
      resetBtn();
    }
  });

  /* ---------------------------------------------------------
     11. SMOOTH ANCHOR SCROLL (offset for fixed nav)
  --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});
