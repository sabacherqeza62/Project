/**
 * AURA INTELLIGENCE — INTERACTIVE CORE LOGIC & ANIMATIONS
 * Modern Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. NEURAL CONSTELLATION CANVAS ANIMATION
     ========================================================================== */
  const canvas = document.getElementById('neural-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 35 : 70;
    const maxDistance = 140;

    let mouse = {
      x: null,
      y: null,
      radius: 120
    };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1;
        this.baseColor = Math.random() > 0.5 ? 'rgba(6, 182, 212,' : 'rgba(99, 102, 241,';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Boundary bounce
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 3;
            this.y -= Math.sin(angle) * force * 3;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.baseColor + ' 0.8)';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#06b6d4';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function initParticles() {
      resizeCanvas();
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Connect lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.25;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
    });
  }

  /* ==========================================================================
     2. 3D TILT EFFECT FOR HERO SHOWCASE
     ========================================================================== */
  const showcaseContainer = document.getElementById('showcase-container');
  const showcaseCard = document.getElementById('showcase-card');

  if (showcaseContainer && showcaseCard) {
    let bounds;

    function onMouseEnter() {
      bounds = showcaseContainer.getBoundingClientRect();
      showcaseCard.style.transition = 'transform 0.1s ease-out';
    }

    function onMouseMove(e) {
      if (!bounds) bounds = showcaseContainer.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const leftX = mouseX - bounds.x;
      const topY = mouseY - bounds.y;
      const center = {
        x: leftX - bounds.width / 2,
        y: topY - bounds.height / 2
      };

      const distance = Math.hypot(center.x, center.y);
      const maxDistance = Math.hypot(bounds.width / 2, bounds.height / 2);
      const degree = (distance / maxDistance) * 12;

      const rotateX = -(center.y / (bounds.height / 2)) * degree;
      const rotateY = (center.x / (bounds.width / 2)) * degree;

      showcaseCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    }

    function onMouseLeave() {
      showcaseCard.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      showcaseCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }

    showcaseContainer.addEventListener('mouseenter', onMouseEnter);
    showcaseContainer.addEventListener('mousemove', onMouseMove);
    showcaseContainer.addEventListener('mouseleave', onMouseLeave);
  }

  /* ==========================================================================
     3. BENTO CARD SPOTLIGHT CURSOR GLOW
     ========================================================================== */
  const bentoCards = document.querySelectorAll('.bento-card');
  bentoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* ==========================================================================
     4. NAVBAR SCROLL & ACTIVE LINK HIGHLIGHTING
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  function handleScroll() {
    const scrollPos = window.scrollY;

    // Toggle header glass shadow
    if (navbar) {
      if (scrollPos > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Active Section Link Highlight
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     5. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggleBtn.classList.toggle('active');
      mobileToggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggleBtn.classList.remove('active');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ==========================================================================
     6. THEME ACCENT SWITCHER
     ========================================================================== */
  const accentDots = document.querySelectorAll('.accent-dot');
  accentDots.forEach(dot => {
    dot.addEventListener('click', () => {
      accentDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      const accent = dot.getAttribute('data-accent');
      if (accent === 'default') {
        document.documentElement.removeAttribute('data-theme-accent');
      } else {
        document.documentElement.setAttribute('data-theme-accent', accent);
      }
    });
  });

  /* ==========================================================================
     7. SCROLL REVEAL OBSERVER & STATS COUNTER
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const statNumbers = document.querySelectorAll('.stat-number');

  let statsAnimated = false;

  function animateCounters() {
    statNumbers.forEach(stat => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      const duration = 2000;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = easeOut * target;

        stat.textContent = isDecimal ? currentVal.toFixed(2) : Math.floor(currentVal);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          stat.textContent = target + (stat.getAttribute('data-target') === '100' ? 'M+' : '');
        }
      }
      requestAnimationFrame(update);
    });
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        // Check if statistics card is revealed
        if (!statsAnimated && entry.target.querySelector('.stat-number')) {
          animateCounters();
          statsAnimated = true;
        }

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ==========================================================================
     8. BENTO GRID CATEGORY FILTER TABS
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const gridCards = document.querySelectorAll('.bento-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      gridCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filter === 'all' || cardCat === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     9. INTERACTIVE LAB / NEURAL SIMULATION TERMINAL
     ========================================================================== */
  const terminalScreen = document.getElementById('terminal-screen');
  const runSimBtn = document.getElementById('run-simulation-btn');
  const terminalStatusText = document.getElementById('terminal-status-text');
  const presetBtns = document.querySelectorAll('.preset-btn');

  let currentPreset = 'architecture';

  const simulationsData = {
    architecture: [
      { type: 'info', text: 'Initiating distributed topology synthesis...' },
      { type: 'accent', text: 'Querying 4,812 domain entities across repository mesh...' },
      { type: 'code', text: 'Partitioning microservices: [Auth-Service], [Event-Bus], [Payment-Vault]' },
      { type: 'accent', text: 'Validating gRPC protocol buffers & zero-leak contract verification...' },
      { type: 'success', text: '✓ 12 Microservices compiled. Deployment manifest staged with 0 lint errors.' }
    ],
    security: [
      { type: 'info', text: 'Commencing cryptographic & vulnerability audit...' },
      { type: 'accent', text: 'Scanning dependency AST and memory safety barriers...' },
      { type: 'code', text: 'Inspecting: CVE-2026-X memory safety and injection vectors...' },
      { type: 'accent', text: 'Injecting zero-knowledge AES-256 boundary guards...' },
      { type: 'success', text: '✓ 0 Critical CVEs found. SOC2 Type II compliance seal generated.' }
    ],
    performance: [
      { type: 'info', text: 'Analyzing distributed database query bottlenecks...' },
      { type: 'accent', text: 'Simulating 1,000,000 concurrent vector read operations...' },
      { type: 'code', text: 'Re-indexing HNSW graphs & parallelizing query sharding...' },
      { type: 'accent', text: 'P99 Latency reduced from 148ms → 8.2ms (-94.4%)...' },
      { type: 'success', text: '✓ Query optimizer active. Resource throughput improved by 4.2x.' }
    ]
  };

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPreset = btn.getAttribute('data-preset');
      
      // Update terminal preview
      terminalScreen.innerHTML = `
        <div class="terminal-line">
          <span class="prompt-symbol">&gt;</span>
          <span class="log-info">Selected Preset: [${btn.textContent.trim()}]</span>
        </div>
        <div class="terminal-line">
          <span class="prompt-symbol">&gt;</span>
          <span class="log-accent">Ready to orchestrate neural agents for this scenario.</span>
        </div>
      `;
      terminalStatusText.textContent = `Status: Ready (${btn.textContent.trim()})`;
    });
  });

  if (runSimBtn) {
    runSimBtn.addEventListener('click', () => {
      runSimBtn.disabled = true;
      runSimBtn.style.opacity = '0.6';
      terminalStatusText.textContent = 'Status: Executing autonomous agents...';

      terminalScreen.innerHTML = '';
      const lines = simulationsData[currentPreset];
      let lineIndex = 0;

      function printLine() {
        if (lineIndex < lines.length) {
          const item = lines[lineIndex];
          const div = document.createElement('div');
          div.className = 'terminal-line';
          div.innerHTML = `
            <span class="prompt-symbol">&gt;</span>
            <span class="log-${item.type}">${item.text}</span>
          `;
          terminalScreen.appendChild(div);
          terminalScreen.scrollTop = terminalScreen.scrollHeight;
          lineIndex++;
          setTimeout(printLine, 450);
        } else {
          runSimBtn.disabled = false;
          runSimBtn.style.opacity = '1';
          terminalStatusText.textContent = 'Status: Execution Completed Successfully';
        }
      }

      printLine();
    });
  }

  /* ==========================================================================
     10. FAQ ACCORDION
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    // Initialize initial active item max-height
    if (item.classList.contains('active')) {
      content.style.maxHeight = content.scrollHeight + 30 + 'px';
    }

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other accordion items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.faq-content').style.maxHeight = null;
        }
      });

      if (!isActive) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 30 + 'px';
      } else {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      }
    });
  });

  /* ==========================================================================
     11. INTERACTIVE TOUR MODAL
     ========================================================================== */
  const openTourBtn = document.getElementById('open-tour-modal-btn');
  const closeTourBtn = document.getElementById('close-tour-modal-btn');
  const tourModal = document.getElementById('tour-modal');

  function openModal() {
    if (tourModal) {
      tourModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (tourModal) {
      tourModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (openTourBtn) openTourBtn.addEventListener('click', openModal);
  if (closeTourBtn) closeTourBtn.addEventListener('click', closeModal);

  if (tourModal) {
    tourModal.addEventListener('click', (e) => {
      if (e.target === tourModal) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && tourModal && tourModal.classList.contains('open')) {
      closeModal();
    }
  });

  /* ==========================================================================
     12. CONTACT FORM SUBMISSION & CLIENT-SIDE VALIDATION
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  const submitSpinner = document.getElementById('submit-spinner');
  const submitBtnText = document.getElementById('submit-btn-text');
  const toastMsg = document.getElementById('form-toast-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('full-name');
      const emailInput = document.getElementById('work-email');
      const msgInput = document.getElementById('message');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.style.borderColor = '#ef4444';
        isValid = false;
      } else {
        nameInput.style.borderColor = '';
      }

      // Validate Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value.trim())) {
        emailInput.style.borderColor = '#ef4444';
        isValid = false;
      } else {
        emailInput.style.borderColor = '';
      }

      // Validate Message
      if (!msgInput.value.trim()) {
        msgInput.style.borderColor = '#ef4444';
        isValid = false;
      } else {
        msgInput.style.borderColor = '';
      }

      if (!isValid) return;

      // Dynamic submission state
      submitBtn.disabled = true;
      submitSpinner.style.display = 'inline-block';
      submitBtnText.textContent = 'Encrypting & Dispatching...';

      setTimeout(() => {
        submitSpinner.style.display = 'none';
        submitBtnText.textContent = 'Request Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';
        toastMsg.style.display = 'flex';

        // Reset form
        contactForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtnText.textContent = 'Submit Request';
          submitBtn.style.background = '';
          toastMsg.style.display = 'none';
        }, 5000);
      }, 1200);
    });
  }

  /* ==========================================================================
     13. NEWSLETTER SUBSCRIPTION
     ========================================================================== */
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const btn = newsletterForm.querySelector('button');
      if (input && input.value) {
        btn.textContent = 'Subscribed!';
        btn.style.background = 'var(--accent-emerald)';
        input.value = '';
        setTimeout(() => {
          btn.textContent = 'Join';
          btn.style.background = '';
        }, 3000);
      }
    });
  }

  /* ==========================================================================
     14. DYNAMIC CURRENT YEAR
     ========================================================================== */
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     15. BILINGUAL INTERNATIONALIZATION (GEORGIAN / ENGLISH)
     ========================================================================== */
  const translations = {
    ka: {
      nav_about: 'არქიტექტურა',
      nav_features: 'შესაძლებლობები',
      nav_playground: 'ლაბორატორია',
      nav_testimonials: 'შეფასებები',
      nav_faq: 'FAQ',
      nav_contact: 'კონტაქტი',
      btn_launch: 'კონსოლის გაშვება',
      
      hero_pill: '<strong>Aura 2.5 ნეირონული სუბსტრატი</strong> &bull; ნულოვანი შეყოვნების ინფერენცია',
      hero_title: 'ავტონომიური ინტელექტის მართვა <span class="text-gradient">გლობალურ მასშტაბში</span>',
      hero_desc: 'ერთიანი კოგნიტური სამუშაო სივრცე საინჟინრო გუნდებისთვის. შექმენით, მართეთ და გაუშვით ავტონომიური მრავალ-აგენტიანი სისტემები მათემატიკური სიზუსტით და ნულოვანი ცოდნის კონფიდენციალურობით.',
      btn_trial: 'დაიწყე უფასოდ',
      btn_tour: 'ინტერაქტიული ტური',
      proof_label: 'ენდობიან ინჟინრები და ტექნოლოგიური გუნდები მთელ მსოფლიოში',
      
      about_kicker: 'არქიტექტურა',
      about_title: 'შექმნილია კოგნიტური უპირატესობისთვის',
      about_desc: 'ტრადიციული AI პლატფორმები ფრაგმენტირებულია. Aura აერთიანებს რეალურ დროში მულტიმოდალურ ნაკადს, გადანაწილებულ კონსენსუსს და ნულოვანი ცოდნის უსაფრთხოებას ერთიან მაღალსიჩქარიან ნეირონულ ქსელში.',
      stat_tasks: 'მილიონი ოპერაცია / დღეში',
      stat_latency: 'მწ საშუალო შეყოვნება',
      stat_uptime: '% გარანტირებული მუშაობა',
      about_lead: 'Aura შეიქმნა ერთი უმთავრესი ხედვით: ხელოვნური ინტელექტი რეალურ გარღვევას აღწევს მაშინ, როდესაც ავტონომიური აგენტები უწყვეტად და სინქრონულად თანამშრომლობენ ადამიანებთან.',
      pillar1_title: 'დინამიური კონტექსტის მქსოველი',
      pillar1_desc: 'უწყვეტად ახდენს კოდის, API ნაკადების და საუბრის მდგომარეობის ინდექსირებას მეხსიერების გაჟონვის გარეშე.',
      pillar2_title: 'დეცენტრალიზებული AI აგენტები',
      pillar2_desc: 'სპეციალიზებული აგენტები ინაწილებენ როლებს (არქიტექტორი, კოდის სინთეზატორი, ტესტერი, უსაფრთხოება) რთული ამოცანების ავტონომიურად გადასაჭრელად.',
      pillar3_title: 'ნულოვანი ცოდნის უსაფრთხოების გარემო',
      pillar3_desc: 'თქვენი კორპორატიული მონაცემები და წონები მუშავდება აპარატურულად იზოლირებულ უსაფრთხო გარემოში (TEE).',
      
      features_kicker: 'შესაძლებლობების მატრიცა',
      features_title: 'ყველაფერი ავტონომიური სისტემების შესაქმნელად',
      features_desc: 'გაეცანით თანამედროვე დეველოპერულ პლატფორმას, შექმნილს ადამიანისა და AI აგენტების უწყვეტი, ეფექტური თანამშრომლობისთვის.',
      filter_all: 'ყველა შესაძლებლობა',
      filter_swarms: 'აგენტების გუნდები',
      filter_engine: 'კოგნიტური ძრავი',
      filter_security: 'უსაფრთხოება და მონიტორინგი',
      bento1_title: 'ავტონომიური აგენტების კონსენსუსი',
      bento1_desc: 'გაუშვით ავტონომიური ჯგუფები, რომლებიც ანაწილებენ კოდს, წერენ ტესტებს, ამოწმებენ უსაფრთხოებას და ქმნიან Pull Request-ებს სრული აუდიტირებით.',
      bento2_title: 'მულტიმოდალური სინთეზი',
      bento2_desc: 'გადაეცით UI დიზაინები, ვიდეო ჩანაწერები, API სქემები და არქიტექტურული დიაგრამები პირდაპირ სამუშაო პროცესში.',
      bento3_title: 'მოდელების ცხელი ჩანაცვლება',
      bento3_desc: 'მომენტალურად გადაამისამართეთ მოთხოვნები საუკეთესო მოდელზე ნებისმიერი კონკრეტული ქვეამოცანისთვის.',
      bento4_title: 'ნულოვანი ცოდნის უსაფრთხოება',
      bento4_desc: 'კლიენტის მხარეს კრიპტოგრაფიული დაცვა. თქვენი კოდი არასოდეს გამოიყენება გარე მოდელების საწვრთნელად.',
      bento5_title: 'სუბ-მილიწამიანი ტელემეტრია',
      bento5_desc: 'აკონტროლეთ ტოკენების ხარჯი, ლოგიკური მსჯელობის ხე, შეყოვნების გრაფიკები და ხარჯების ავტომატური ოპტიმიზაცია.',
      bento6_title: 'მყისიერი Edge განთავსება',
      bento6_desc: 'განათავსეთ თქვენი აგენტები პირდაპირ 300+ გლობალურ ლოკაციაზე. გარანტირებული უწყვეტი მუშაობა და სწრაფი სინქრონიზაცია.',
      
      lab_kicker: 'ინტერაქტიული დემო',
      lab_title: 'გამოცადეთ ნეირონული ძრავი',
      lab_desc: 'აირჩიეთ დავალების სცენარი და გაუშვით რეალურ დროში ავტონომიური მსჯელობა Aura-ს სისტემის მუშაობის სანახავად.',
      btn_run_sim: 'სიმულაციის გაშვება',
      
      testimonials_kicker: 'შეფასებები',
      testimonials_title: 'რას ამბობენ წამყვანი საინჟინრო გუნდები',
      testimonials_desc: 'გაიგეთ, როგორ ეხმარება Aura მსოფლიო დონის გუნდებს კოდის 5x უფრო სწრაფად და საიმედოდ შექმნაში.',
      
      faq_kicker: 'კითხვა-პასუხი',
      faq_title: 'ხშირად დასმული კითხვები',
      faq_desc: 'ყველაფერი, რაც უნდა იცოდეთ Aura-ს თქვენს ინფრასტრუქტურაში ინტეგრაციის შესახებ.',
      
      contact_kicker: 'კონტაქტი',
      contact_title: 'მზად ხართ სამუშაო პროცესის ტრანსფორმაციისთვის?',
      contact_desc: 'დაუკავშირდით ჩვენს ინჟინრებს პერსონალური დემოს ჩასანიშნად ან კორპორატიული გადაწყვეტის შესარჩევად.',
      btn_contact_submit: 'მოთხოვნის გაგზავნა'
    },
    en: {
      nav_about: 'Architecture',
      nav_features: 'Capabilities',
      nav_playground: 'Interactive Lab',
      nav_testimonials: 'Testimonials',
      nav_faq: 'FAQ',
      nav_contact: 'Contact',
      btn_launch: 'Launch Console',
      
      hero_pill: '<strong>Aura 2.5 Neural Substrate</strong> &bull; Zero-Latency Inference Active',
      hero_title: 'Orchestrate Autonomous Intelligence at <span class="text-gradient">Planetary Scale</span>',
      hero_desc: 'The unified cognitive workspace designed for visionary engineering teams. Train, coordinate, and deploy autonomous multi-agent swarms with mathematical precision and zero-knowledge privacy.',
      btn_trial: 'Start Free Trial',
      btn_tour: 'Watch Interactive Tour',
      proof_label: 'Trusted by engineers & builders across world-class teams',
      
      about_kicker: 'The Architecture',
      about_title: 'Engineered for Cognitive Supremacy',
      about_desc: 'Traditional AI pipelines fragment context across silos. Aura unifies real-time multi-modal streaming, distributed consensus, and zero-knowledge privacy into a single high-performance neural mesh.',
      stat_tasks: 'Million Tasks / Day',
      stat_latency: 'ms Avg Latency',
      stat_uptime: '% Uptime SLA',
      about_lead: 'We started Aura with a singular realization: artificial intelligence achieves genuine breakthrough value only when autonomous agents collaborate seamlessly with human operators in real time.',
      pillar1_title: 'Dynamic Context Weaver',
      pillar1_desc: 'Continuously indexes complex codebases, API streams, and conversational states into an active vector substrate with zero memory leakage.',
      pillar2_title: 'Decentralized Agent Swarms',
      pillar2_desc: 'Specialized agents self-elect roles (architect, synthesizer, tester, security reviewer) to execute complex, multi-stage engineering sprints autonomously.',
      pillar3_title: 'Zero-Knowledge Neural Enclave',
      pillar3_desc: 'Your enterprise data and fine-tuned weights are processed within hardware-isolated trusted execution environments (TEE) with cryptographically verifiable privacy.',
      
      features_kicker: 'Capabilities Matrix',
      features_title: 'Everything You Need to Build Autonomy',
      features_desc: 'Explore our state-of-the-art developer suite engineered for seamless human-agent pair programming, automated workflows, and planetary scale.',
      filter_all: 'All Capabilities',
      filter_swarms: 'Agent Swarms',
      filter_engine: 'Cognitive Engine',
      filter_security: 'Security & Observability',
      bento1_title: 'Autonomous Agent Swarm Consensus',
      bento1_desc: 'Deploy autonomous task forces that partition large codebases, write unit tests, verify memory safety, and submit pull requests with full auditability.',
      bento2_title: 'Cross-Attention Synthesis',
      bento2_desc: 'Feed raw wireframes, video recordings, API schemas, and architecture diagrams directly into your working session.',
      bento3_title: 'Model Hot-Swapping',
      bento3_desc: 'Route queries instantaneously to the highest-performing model for any given subtask without touching your codebase.',
      bento4_title: 'Zero-Knowledge Enclave',
      bento4_desc: 'Client-side cryptographic sealing. Your proprietary code never trains external models and stays within SOC2 Type II vaults.',
      bento5_title: 'Sub-Millisecond Telemetry',
      bento5_desc: 'Inspect token consumption, reasoning tree steps, latency graphs, and automatic model cost optimization live.',
      bento6_title: 'Instant Edge Deployment',
      bento6_desc: 'Deploy your agents directly to 300+ global edge locations. Self-healing state synchronization with guaranteed zero-downtime rollback.',
      
      lab_kicker: 'Live Interactive Demo',
      lab_title: 'Experience the Neural Engine',
      lab_desc: 'Select a task scenario below and trigger real-time autonomous reasoning to observe how Aura orchestrates planning, linting, and execution.',
      btn_run_sim: 'Run Neural Simulation',
      
      testimonials_kicker: 'Social Proof',
      testimonials_title: 'Loved by High-Velocity Engineering Teams',
      testimonials_desc: 'See how world-class engineering organizations rely on Aura to ship software 5x faster with fewer bugs.',
      
      faq_kicker: 'Clear Answers',
      faq_title: 'Frequently Asked Questions',
      faq_desc: 'Everything you need to know about integrating Aura into your enterprise engineering stack.',
      
      contact_kicker: 'Get In Touch',
      contact_title: 'Ready to Supercharge Your Velocity?',
      contact_desc: 'Connect directly with our solutions architects to schedule a customized enterprise proof-of-concept or explore private cloud deployment.',
      btn_contact_submit: 'Submit Request'
    }
  };

  const langToggleBtn = document.getElementById('lang-toggle-btn');
  const langFlag = document.getElementById('lang-flag');
  const langText = document.getElementById('lang-text');
  let currentLang = localStorage.getItem('aura_lang') || 'ka';

  function applyLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('aura_lang', lang);
    document.documentElement.lang = lang;

    // Update button text and flag
    if (langFlag && langText) {
      if (lang === 'ka') {
        langFlag.textContent = '🇬🇪';
        langText.textContent = 'KA';
      } else {
        langFlag.textContent = '🇬🇧';
        langText.textContent = 'EN';
      }
    }

    // Update all translatable elements
    const translatableElements = document.querySelectorAll('[data-i18n]');
    translatableElements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });
  }

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const nextLang = currentLang === 'ka' ? 'en' : 'ka';
      applyLanguage(nextLang);
    });
  }

  // Initialize language on startup
  applyLanguage(currentLang);

});
