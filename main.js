/**
 * REALM OF STEEZ — main.js
 * Luxury interactions: scroll reveal, counter, parallax,
 * portfolio filter, nav behaviour, lightbox, form handling.
 */

'use strict';

/* ═══════════════════════════════════════════════════════════
   UTILITY
   ═══════════════════════════════════════════════════════════ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ═══════════════════════════════════════════════════════════
   FOOTER YEAR
   ═══════════════════════════════════════════════════════════ */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ═══════════════════════════════════════════════════════════
   NAVIGATION — scroll behaviour + mobile toggle
   ═══════════════════════════════════════════════════════════ */
(function initNav () {
  const nav       = $('#nav');
  const toggle    = $('#navToggle');
  const links     = $('#navLinks');
  const navLinks  = $$('.nav__link');

  // Scroll → add .scrolled class
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Mobile hamburger
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    toggle.classList.toggle('open');
    links.classList.toggle('open');
    document.body.style.overflow = expanded ? '' : 'hidden';
  });

  // Close mobile nav on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('open');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active link on scroll
  const sections = $$('section[id]');
  const observerOpts = { rootMargin: '-40% 0px -55% 0px' };
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => {
          l.classList.toggle('nav__link--active', l.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, observerOpts);
  sections.forEach(s => io.observe(s));
})();

/* ═══════════════════════════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════════════════════════ */
(function initReveal () {
  if (prefersReducedMotion) {
    $$('.reveal, .reveal-text').forEach(el => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
    return;
  }

  const targets = $$('.reveal, .reveal-text, .services__card, .portfolio__item, .about__stat, .contact__detail');
  targets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = [...entry.target.parentElement.children];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.08}s`;
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => io.observe(el));
})();

/* ═══════════════════════════════════════════════════════════
   ANIMATED COUNTERS
   ═══════════════════════════════════════════════════════════ */
(function initCounters () {
  const counters = $$('[data-target]');
  if (!counters.length) return;

  const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = prefersReducedMotion ? 0 : 1800;
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.floor(ease(progress) * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };

    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
})();

/* ═══════════════════════════════════════════════════════════
   PORTFOLIO FILTER
   ═══════════════════════════════════════════════════════════ */
(function initPortfolioFilter () {
  const filters = $$('.portfolio__filter');
  const items   = $$('.portfolio__item');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update button states
      filters.forEach(b => {
        b.classList.remove('portfolio__filter--active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('portfolio__filter--active');
      btn.setAttribute('aria-selected', 'true');

      // Filter items
      items.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hidden', !match);
        item.setAttribute('aria-hidden', String(!match));
      });
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   PROJECT GALLERY
   ═══════════════════════════════════════════════════════════ */

// Project data — add new projects here
const PROJECTS = {
  'complice-skin': {
    title: 'Complice',
    cat: 'Collaboration',
    desc: 'A cinematic beauty campaign blending luxury skincare with immersive visual storytelling.',
    products: [
      {
        name: 'AM Serum',
        images: [
          { src: 'assets/ROS/complice/images/am-serum/am-serum-01.jpeg', alt: 'AM Serum — dropper bottle close-up' },
          { src: 'assets/ROS/complice/images/am-serum/am-serum-02.jpeg', alt: 'AM Serum — model in warm morning light' },
          { src: 'assets/ROS/complice/images/am-serum/am-serum-03.jpeg', alt: 'AM Serum — hand reaching for bottle' },
          { src: 'assets/ROS/complice/images/am-serum/am-serum-04.jpeg', alt: 'AM Serum — dropper application close-up' },
          { src: 'assets/ROS/complice/images/am-serum/am-serum-05.jpeg', alt: 'AM Serum — bottle on ice editorial' },
        ],
        videos: [
          { src: 'assets/ROS/complice/videos/am-serum/am-serum-01.mp4', title: 'AM Serum Campaign' },
        ],
      },
      {
        name: 'PM Serum',
        images: [
          // Deep greens pair
          { src: 'assets/ROS/complice/images/pm-serum/pm-serum-06.jpg',  alt: 'PM Serum — cinematic green dress, dark studio' },
          { src: 'assets/ROS/complice/images/pm-serum/pm-serum-03.jpg',  alt: 'PM Serum — emerald silk bottle close-up' },
          // Navy night pair
          { src: 'assets/ROS/complice/images/pm-serum/pm-serum-07.jpg',  alt: 'PM Serum — moon night sky editorial' },
          { src: 'assets/ROS/complice/images/pm-serum/pm-serum-08.jpg',  alt: 'PM Serum — luxury villa night' },
          // Transitional pair
          { src: 'assets/ROS/complice/images/pm-serum/pm-serum-02.jpg',  alt: 'PM Serum — night campaign collage' },
          { src: 'assets/ROS/complice/images/pm-serum/pm-serum-04.jpg',  alt: 'PM Serum — luxury lifestyle portrait' },
          // Warm gold
          { src: 'assets/ROS/complice/images/pm-serum/pm-serum-05.jpg',  alt: 'PM Serum — warm golden light portrait' },
        ],
        videos: [
          { src: 'assets/ROS/complice/videos/pm-serum/pm-serum-06.mp4', title: 'Confident' },
        ],
      },
      {
        name: 'Cleanser',
        images: [
          { src: 'assets/ROS/complice/images/cleanser/cleanser-01.jpeg', alt: 'Cleanser — model with cleanser tube' },
          { src: 'assets/ROS/complice/images/cleanser/cleanser-02.jpeg', alt: 'Cleanser — model holding cleanser' },
          { src: 'assets/ROS/complice/images/cleanser/cleanser-03.jpeg', alt: 'Cleanser — cleanser product shot' },
          { src: 'assets/ROS/complice/images/cleanser/cleanser-04.jpeg', alt: 'Cleanser — product tube hero shot on marble' },
          { src: 'assets/ROS/complice/images/cleanser/cleanser-05.jpeg', alt: 'Cleanser — model with fresh skin holding tube' },
        ],
        videos: [
          { src: 'assets/ROS/complice/videos/cleanser/cleanser-01.mp4', title: 'Cleanser Campaign' },
        ],
      },
      {
        name: '24-Hour Moisturiser',
        images: [
          { src: 'assets/ROS/complice/images/24h-moisturiser/24h-moisturiser-01.jpeg', alt: '24H Moisturiser — hand dipping into open jar on marble' },
          { src: 'assets/ROS/complice/images/24h-moisturiser/24h-moisturiser-02.jpeg', alt: '24H Moisturiser — jar hero shot on marble podium' },
          { src: 'assets/ROS/complice/images/24h-moisturiser/24h-moisturiser-03.jpeg', alt: '24H Moisturiser — jar with classical statue editorial' },
          { src: 'assets/ROS/complice/images/24h-moisturiser/24h-moisturiser-04.jpeg', alt: '24H Moisturiser — model in silk robe applying moisturiser' },
        ],
        videos: [
          // best first (2026-10-14): cinematic film, product film, texture macro, then the social cuts
          { src: 'assets/ROS/complice/videos/24h-moisturiser/24h-moisturiser-02.mp4', title: '24 Hour Short Film' },
          { src: 'assets/ROS/complice/videos/24h-moisturiser/24h-moisturiser-03.mp4', title: '24' },
          { src: 'assets/ROS/complice/videos/24h-moisturiser/24h-moisturiser-01.mp4', title: 'Hand Moisturiser' },
          { src: 'assets/ROS/complice/videos/24h-moisturiser/24h-moisturiser-04.mp4', title: 'Out Last The Sun' },
          { src: 'assets/ROS/complice/videos/24h-moisturiser/24h-moisturiser-07.mp4', title: "Time Isn't a Thief" },
          { src: 'assets/ROS/complice/videos/24h-moisturiser/24h-moisturiser-06.mp4', title: 'That Is POWER' },
          { src: 'assets/ROS/complice/videos/24h-moisturiser/24h-moisturiser-05.mp4', title: 'Steal a Quiet Moment' },
        ],
      },
    ],
  }
};

(function initProjectGallery () {
  const overlay      = $('#projectGallery');
  const closeBtn     = $('#galleryClose');
  const grid         = $('#galleryGrid');
  const catEl        = $('#galleryCat');
  const titleEl      = $('#galleryTitle');
  const descEl       = $('#galleryDesc');
  const viewer       = $('#galleryViewer');
  const viewerImg    = $('#galleryViewerImg');
  const viewerVideo  = $('#galleryViewerVideo');
  const viewerClose  = $('#galleryViewerClose');
  const prevBtn      = $('#galleryPrev');
  const nextBtn      = $('#galleryNext');
  const countEl      = $('#galleryCount');

  if (!overlay || !grid) return;

  let currentMedia = [];
  let currentIndex = 0;

  // Build a grid item HTML string
  const buildItem = (item, globalIdx) => {
    const isVideo = item.type === 'video';
    const posterSrc = isVideo ? item.src.replace('.mp4', '.jpg') : '';
    const media = isVideo
      ? `<video src="${item.src}" poster="${posterSrc}" muted playsinline preload="none"></video>`
      : `<img src="${item.src}" alt="${item.alt}" loading="eager" />`;
    const icon = isVideo
      ? `<span class="project-gallery__play" aria-hidden="true">&#9654;</span>`
      : `<span class="project-gallery__zoom" aria-hidden="true">⊕</span>`;
    return `
      <div class="project-gallery__item${isVideo ? ' project-gallery__item--video' : ''}" data-index="${globalIdx}" tabindex="0" role="button" aria-label="${isVideo ? 'Play video' : 'View image'} ${globalIdx + 1}">
        ${media}
        <div class="project-gallery__item-overlay">${icon}</div>
      </div>`;
  };

  // Open gallery
  const openGallery = (projectId) => {
    const project = PROJECTS[projectId];
    if (!project) return;

    catEl.textContent   = project.cat;
    titleEl.textContent = project.title;
    descEl.textContent  = project.desc;

    // Flatten all media across products for viewer navigation
    currentMedia = (project.products || []).flatMap(p => [
      ...(p.images || []).map(img => ({ type: 'image', src: img.src, alt: img.alt })),
      ...(p.videos || []).map(v   => ({ type: 'video', src: v.src,  alt: v.title })),
    ]);

    // Render product sections
    let globalIdx = 0;
    grid.innerHTML = (project.products || []).map(p => {
      const allMedia = [
        ...(p.images || []).map(img => ({ type: 'image', src: img.src, alt: img.alt })),
        ...(p.videos || []).map(v   => ({ type: 'video', src: v.src,  alt: v.title })),
      ];
      if (!allMedia.length) return '';
      const items = allMedia.map(item => {
        const html = buildItem(item, globalIdx);
        globalIdx++;
        return html;
      }).join('');
      return `
        <div class="product-section">
          <div class="product-section__header">
            <span class="product-section__label">${p.name}</span>
          </div>
          <div class="product-section__grid">${items}</div>
        </div>`;
    }).join('');

    overlay.hidden = false;
    document.body.style.overflow = 'hidden';

    $$('.project-gallery__item', grid).forEach(item => {
      const open = () => openViewer(parseInt(item.dataset.index));
      item.addEventListener('click', open);
      item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });

    closeBtn.focus();
  };

  // Close gallery
  const closeGallery = () => {
    stopVideo();
    overlay.hidden = true;
    document.body.style.overflow = '';
    grid.innerHTML = '';
  };

  const stopVideo = () => {
    if (viewerVideo) { viewerVideo.pause(); viewerVideo.removeAttribute('src'); viewerVideo.load(); }
  };

  // Open full-size viewer
  const openViewer = (index) => {
    currentIndex = index;
    const item = currentMedia[index];
    stopVideo();

    if (item.type === 'video') {
      viewerImg.hidden   = true;
      viewerVideo.src    = item.src;
      viewerVideo.hidden = false;
      viewerVideo.play().catch(() => {});
    } else {
      viewerVideo.hidden = true;
      viewerImg.src      = item.src;
      viewerImg.alt      = item.alt;
      viewerImg.hidden   = false;
    }

    countEl.textContent = `${index + 1} / ${currentMedia.length}`;
    viewer.hidden = false;
    viewerClose.focus();
  };

  const closeViewer = () => {
    stopVideo();
    viewer.hidden = true;
  };

  const navigate = (dir) => {
    currentIndex = (currentIndex + dir + currentMedia.length) % currentMedia.length;
    openViewer(currentIndex);
  };

  // Event listeners
  closeBtn.addEventListener('click', closeGallery);
  viewerClose.addEventListener('click', closeViewer);
  prevBtn.addEventListener('click', () => navigate(-1));
  nextBtn.addEventListener('click', () => navigate(1));

  document.addEventListener('keydown', e => {
    if (!overlay.hidden) {
      if (e.key === 'Escape') { if (!viewer.hidden) closeViewer(); else closeGallery(); }
      if (!viewer.hidden) {
        if (e.key === 'ArrowLeft')  navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
      }
    }
  });

  // Wire up "View Project" buttons
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-project]');
    if (btn) { e.preventDefault(); openGallery(btn.dataset.project); }
  });
})();

/* ═══════════════════════════════════════════════════════════
   PORTFOLIO LIGHTBOX (for non-project items)
   ═══════════════════════════════════════════════════════════ */
(function initLightbox () {
  const lightbox = $('#lightbox');
  const closeBtn = $('#lightboxClose');
  const content  = $('#lightboxContent');

  if (!lightbox || !closeBtn || !content) return;

  const close = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    content.innerHTML = '';
  };

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  // Escape key handled above

  // Only bind click to non-project portfolio items
  $$('.portfolio__item').forEach(item => {
    if (item.dataset.project || item.querySelector('[data-project]')) return; // skip — handled by project gallery

    // Direct-link items — navigate instead of showing lightbox
    if (item.dataset.href) {
      item.style.cursor = 'pointer';
      item.addEventListener('click', (e) => {
        if (e.target.closest('a')) return; // let native link clicks through
        window.location.href = item.dataset.href;
      });
      item.setAttribute('tabindex', '0');
      return;
    }

    item.addEventListener('click', () => {
      const title = item.querySelector('.portfolio__title')?.textContent || '';
      content.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;width:100%;aspect-ratio:16/9;
          background:linear-gradient(135deg,#111 0%,#1a1608 100%);border:1px solid rgba(201,168,76,0.2);">
          <div style="text-align:center;padding:40px;">
            <p style="font-family:'Cormorant Garamond',serif;font-size:2rem;color:#F5F0E8;font-style:italic;margin-bottom:12px;">${title}</p>
            <p style="font-size:0.65rem;letter-spacing:0.25em;color:rgba(201,168,76,0.6);text-transform:uppercase;">Coming soon</p>
          </div>
        </div>`;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    });
    item.setAttribute('tabindex', '0');
  });

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ═══════════════════════════════════════════════════════════
   HERO PARALLAX (subtle)
   ═══════════════════════════════════════════════════════════ */
(function initParallax () {
  if (prefersReducedMotion) return;

  const video = $('.hero__video');
  const emblem = $('.hero__emblem');
  if (!video && !emblem) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (video) video.style.transform = `translateY(${y * 0.3}px)`;
        if (emblem) emblem.style.transform = `translateY(${y * 0.05}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ═══════════════════════════════════════════════════════════
   SMOOTH SCROLL for anchor links
   ═══════════════════════════════════════════════════════════ */
(function initSmoothScroll () {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = $('#nav')?.offsetHeight ?? 80;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   CONTACT FORM — client-side validation + submit
   ═══════════════════════════════════════════════════════════ */
(function initContactForm () {
  const form    = $('#contactForm');
  const success = $('#formSuccess');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('.form__submit');
    const btnText = btn.querySelector('span');
    const originalText = btnText.textContent;

    // Basic validation
    const required = $$('[required]', form);
    let valid = true;
    required.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = 'rgba(220,80,60,0.7)';
        valid = false;
      }
    });

    // Email format
    const emailField = $('#email');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.style.borderColor = 'rgba(220,80,60,0.7)';
      valid = false;
    }

    if (!valid) return;

    // Real submission to Netlify Forms (form "contact"). Posted to the Netlify origin so it works whichever host serves the page.
    btnText.textContent = 'Sending…';
    btn.disabled = true;
    try {
      const body = new URLSearchParams(new FormData(form)).toString();
      const endpoint = location.hostname.endsWith('netlify.app') ? '/' : 'https://realm-of-steez-studio.netlify.app/';
      await fetch(endpoint, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
    } catch (err) {
      btnText.textContent = 'Could not send. Email studio@realmofsteez.com';
      btn.disabled = false;
      return;
    }

    form.reset();
    success.hidden = false;
    btnText.textContent = originalText;
    btn.disabled = false;

    setTimeout(() => { success.hidden = true; }, 6000);
  });
})();

/* ═══════════════════════════════════════════════════════════
   VIDEO — ensure autoplay on mobile (muted required)
   ═══════════════════════════════════════════════════════════ */
(function initVideo () {
  const video = $('.hero__video');
  if (!video) return;
  video.muted = true;
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay blocked — show poster frame silently
    });
  }
})();

/* ═══════════════════════════════════════════════════════════
   CURSOR — luxury gold dot (desktop only)
   ═══════════════════════════════════════════════════════════ */
(function initCursor () {
  if (prefersReducedMotion) return;
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch devices

  const cursor = document.createElement('div');
  cursor.id = 'cursor';
  Object.assign(cursor.style, {
    position: 'fixed',
    width: '8px', height: '8px',
    background: 'transparent',
    border: '1px solid rgba(201,168,76,0.7)',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: '9999',
    transition: 'transform 0.15s cubic-bezier(0.25,0.1,0.25,1), width 0.25s, height 0.25s, background 0.25s',
    transform: 'translate(-50%,-50%)',
    mixBlendMode: 'difference',
  });
  document.body.appendChild(cursor);

  let mx = 0, my = 0;
  let cx = 0, cy = 0;
  let rafId;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  const render = () => {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    rafId = requestAnimationFrame(render);
  };
  rafId = requestAnimationFrame(render);

  // Enlarge on hover over interactive elements
  const hoverTargets = 'a, button, .portfolio__item, input, textarea, select';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      Object.assign(cursor.style, {
        width: '32px', height: '32px',
        background: 'rgba(201,168,76,0.12)',
        borderColor: 'rgba(201,168,76,0.9)',
      });
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      Object.assign(cursor.style, {
        width: '8px', height: '8px',
        background: 'transparent',
        borderColor: 'rgba(201,168,76,0.7)',
      });
    }
  });
})();

/* ═══════════════════════════════════════════════════════════
   PAGE LOADER (optional — fades out after load)
   ═══════════════════════════════════════════════════════════ */
(function initLoader () {
  const loader = document.createElement('div');
  Object.assign(loader.style, {
    position: 'fixed', inset: '0',
    background: '#080808',
    zIndex: '9000',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexDirection: 'column', gap: '20px',
    transition: 'opacity 1.4s cubic-bezier(0.4,0,0.2,1)',
  });

  loader.innerHTML = `
    <style>
      .ldr-text {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(1rem, 3vw, 1.4rem);
        font-weight: 300;
        letter-spacing: 0.35em;
        color: #F5F0E8;
        text-transform: uppercase;
        opacity: 0;
        animation: ldrIn 0.8s ease 0.2s forwards;
      }
      .ldr-line {
        width: 80px; height: 1px;
        background: linear-gradient(90deg, transparent, #C9A84C, transparent);
        opacity: 0;
        animation: ldrIn 0.8s ease 0.5s forwards;
        transition: opacity 0.3s ease;
      }
      @keyframes ldrIn {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    </style>
    <div class="ldr-text">REALM OF STEEZ</div>
    <div class="ldr-line"></div>`;

  document.body.appendChild(loader);

  const hide = () => {
    if (prefersReducedMotion) {
      loader.style.opacity = '0';
      loader.style.pointerEvents = 'none';
      setTimeout(() => loader.remove(), 900);
      return;
    }

    const textEl = loader.querySelector('.ldr-text');
    const lineEl = loader.querySelector('.ldr-line');

    // ── Stamp the text onto a canvas so we can sample its pixels ──
    const rect = textEl.getBoundingClientRect();
    const dpr  = Math.min(window.devicePixelRatio || 1, 2);
    const PAD  = 30;
    const cw   = rect.width  + PAD * 2;
    const ch   = rect.height + PAD * 2;

    const canvas = document.createElement('canvas');
    canvas.width  = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    Object.assign(canvas.style, {
      position:      'fixed',
      top:           (rect.top  - PAD) + 'px',
      left:          (rect.left - PAD) + 'px',
      width:         cw + 'px',
      height:        ch + 'px',
      pointerEvents: 'none',
      zIndex:        '9999',
    });
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Draw text identically to the DOM element
    const cs = window.getComputedStyle(textEl);
    ctx.font          = `300 ${cs.fontSize} 'Cormorant Garamond', serif`;
    ctx.letterSpacing = '0.35em';
    ctx.fillStyle     = '#F5F0E8';
    ctx.textAlign     = 'center';
    ctx.textBaseline  = 'middle';
    ctx.fillText('REALM OF STEEZ', cw / 2, ch / 2);

    // ── Build particle list from coloured pixels ───────────────
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const bytes   = imgData.data;
    const STEP    = Math.max(2, Math.round(2 * dpr));
    const particles = [];

    for (let py = 0; py < canvas.height; py += STEP) {
      for (let px = 0; px < canvas.width; px += STEP) {
        const i = (py * canvas.width + px) * 4;
        if (bytes[i + 3] < 60) continue;

        const lx    = px / dpr;
        const ly    = py / dpr;
        particles.push({
          ox: lx, oy: ly,
          vx: (Math.random() - 0.5) * 0.6,         // very gentle horizontal drift
          vy: -(0.5 + Math.random() * 1.5),          // upward only — mist rising
          phase: Math.random() * Math.PI * 2,
          delay: (lx / cw) * 0.9 + Math.random() * 0.05, // strong left→right for letter-by-letter
          sz: (STEP / dpr) * (0.9 + Math.random() * 0.7),
        });
      }
    }

    // Hide DOM text — canvas now owns the visual
    textEl.style.opacity = '0';
    lineEl.style.opacity = '0';

    const TOTAL = 1.0; // seconds per letter's particle lifetime
    let t0 = null;

    const tick = (ts) => {
      if (!t0) t0 = ts;
      const elapsed = (ts - t0) / 1000;

      ctx.clearRect(0, 0, cw, ch);

      let alive = false;

      for (const p of particles) {
        const t = Math.max(0, elapsed - p.delay);
        if (t <= 0) { alive = true; continue; }

        const prog  = t / TOTAL;
        const alpha = Math.max(0, 1 - prog * 1.5); // soft linear mist fade
        if (alpha <= 0) continue;

        alive = true;

        // Mist physics: gentle upward drift + subtle organic sway, no gravity
        const x = p.ox + p.vx * t * 32 + Math.sin(p.phase + t * 2.5) * t * 5;
        const y = p.oy + p.vy * t * 32;

        ctx.globalAlpha = alpha;
        ctx.fillStyle   = '#F5F0E8'; // white throughout — no gold
        ctx.fillRect(x, y, p.sz, p.sz);
      }

      ctx.globalAlpha = 1;
      alive ? requestAnimationFrame(tick) : canvas.remove();
    };

    requestAnimationFrame(tick);

    // Fade the black backdrop — delayed so particles are visible mid-dissolve
    setTimeout(() => { loader.style.opacity = '0'; loader.style.pointerEvents = 'none'; }, 700);
    setTimeout(() => loader.remove(), 2800);
  };

  if (document.readyState === 'complete') {
    setTimeout(hide, prefersReducedMotion ? 100 : 1000);
  } else {
    window.addEventListener('load', () => setTimeout(hide, prefersReducedMotion ? 100 : 1000));
  }
})();

/* ═══════════════════════════════════════════════════════════
   SHOWREEL PLAYER
   ═══════════════════════════════════════════════════════════ */
(function initReels () {
  $$('[data-reel]').forEach(player => {
    const video   = player.querySelector('video');
    const overlay = player.querySelector('[data-reel-play]');
    const muteBtn = player.querySelector('[data-reel-mute]');
    if (!video) return;

    // Autoplay muted when scrolled into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          video.muted = true;
          video.play().catch(() => {});
          if (overlay) overlay.classList.add('hidden');
          if (muteBtn) muteBtn.hidden = false;
        } else {
          video.pause();
          video.currentTime = 0;
          if (overlay) overlay.classList.remove('hidden');
          if (muteBtn) muteBtn.hidden = true;
        }
      });
    }, { threshold: 0.4 });

    observer.observe(player);

    // Click to toggle play/pause
    player.addEventListener('click', (e) => {
      if (muteBtn && (e.target === muteBtn || muteBtn.contains(e.target))) return;
      if (video.paused) {
        video.play();
        if (overlay) overlay.classList.add('hidden');
      } else {
        video.pause();
        if (overlay) overlay.classList.remove('hidden');
      }
    });

    // Mute toggle
    if (muteBtn) {
      muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        const x = muteBtn.querySelector('.reel__mute-x');
        if (x) x.style.display = video.muted ? '' : 'none';
        muteBtn.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
      });
    }
  });
})();

/* ═══════════════════════════════════════════════════════════
   RESPONSIVE REEL VIDEOS — mobile-optimised sources
   ═══════════════════════════════════════════════════════════ */
(function initReelResponsive () {
  const mq = window.matchMedia('(max-width: 768px)');
  $$('[data-reel] video').forEach(video => {
    const srcDesktop = video.dataset.srcDesktop;
    const srcMobile  = video.dataset.srcMobile;
    if (!srcDesktop || !srcMobile) return;
    const source = video.querySelector('source');
    if (!source) return;
    function apply (isMobile) {
      const next = isMobile ? srcMobile : srcDesktop;
      if (source.getAttribute('src') === next) return;
      source.setAttribute('src', next);
      video.load();
    }
    apply(mq.matches);
    mq.addEventListener('change', e => apply(e.matches));
  });
})();

/* ═══════════════════════════════════════════════════════════
   RESPONSIVE HERO VIDEO — portrait on mobile, landscape on desktop
   ═══════════════════════════════════════════════════════════ */
(function initHeroVideo () {
  const video = document.querySelector('.hero__video');
  if (!video) return;

  const srcDesktop = video.dataset.srcDesktop;
  const srcMobile  = video.dataset.srcMobile;
  if (!srcDesktop || !srcMobile) return;

  const source = video.querySelector('source');
  if (!source) return;

  const mq = window.matchMedia('(max-width: 768px)');

  function applySource (isMobile) {
    const next = isMobile ? srcMobile : srcDesktop;
    if (source.src.endsWith(next)) return; // already correct
    source.src = next;
    video.load();
    video.play().catch(() => {});
  }

  applySource(mq.matches);
  mq.addEventListener('change', e => applySource(e.matches));
})();
