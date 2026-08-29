(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =====================================================
     Small helpers
  ===================================================== */
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* =====================================================
     HOME — scattered decorative petals in the hero
  ===================================================== */
  (function heroPetals() {
    var host = document.getElementById('heroPetals');
    if (!host) return;

    var palette = ['#C89A3F', '#7A1E2C', '#2E5A3A', '#D3743A', '#E3B94A'];
    var count = window.innerWidth < 640 ? 5 : 9;
    var frag = document.createDocumentFragment();
    // Keep petals clear of the headline/body copy column (roughly the left
    // half on wide screens) so they never sit on top of readable text.
    var wide = window.innerWidth >= 900;

    for (var i = 0; i < count; i++) {
      var petal = document.createElement('span');
      var size = Math.round(lerp(9, 22, Math.random()));
      var color = palette[i % palette.length];
      var top = Math.round(lerp(3, 95, Math.random()));
      var left = wide
        ? Math.round(lerp(60, 99, Math.random()))
        : Math.round(lerp(4, 96, Math.random()));
      var rotate = Math.round(lerp(-40, 40, Math.random()));
      var duration = (lerp(6, 11, Math.random())).toFixed(1);
      var delay = (Math.random() * -8).toFixed(1);

      petal.style.width = size + 'px';
      petal.style.height = size + 'px';
      petal.style.background = color;
      petal.style.top = top + '%';
      petal.style.left = left + '%';
      petal.style.transform = 'rotate(' + rotate + 'deg)';
      petal.style.animation = 'petalFloat ' + duration + 's ease-in-out infinite';
      petal.style.animationDelay = delay + 's';

      frag.appendChild(petal);
    }
    host.appendChild(frag);

    // inject the keyframes once
    var style = document.createElement('style');
    style.textContent =
      '@keyframes petalFloat{' +
      '0%,100%{ transform: translateY(0) rotate(var(--r,0deg)); }' +
      '50%{ transform: translateY(-14px) rotate(var(--r,0deg)); }' +
      '}';
    document.head.appendChild(style);
  })();

  /* =====================================================
     HOME — Maveli ride-off transition
  ===================================================== */
  (function maveliDeparture() {
    var btn = document.getElementById('seePookalamBtn');
    if (!btn) return;

    var navigating = false;

    btn.addEventListener('click', function () {
      if (navigating) return;
      navigating = true;
      btn.setAttribute('aria-disabled', 'true');
      btn.style.pointerEvents = 'none';

      document.body.classList.add('maveli-departing');

      var wait = prefersReducedMotion ? 250 : 950;
      window.setTimeout(function () {
        window.location.href = 'pookalam.html';
      }, wait);
    });
  })();

  /* =====================================================
     POOKALAM PAGE — scroll-driven bloom
  ===================================================== */
  (function pookalamBloom() {
    var experience = document.getElementById('pkExperience');
    var stage = document.getElementById('pkStage');
    var completeImg = document.getElementById('pkComplete');
    var glow = document.getElementById('pkGlow');
    var progressFill = document.getElementById('pkProgressFill');
    var infoBox = document.getElementById('pkInfo');
    var infoEn = document.getElementById('pkInfoEn');
    var infoMl = document.getElementById('pkInfoMl');
    var infoDesc = document.getElementById('pkInfoDesc');
    var mvTrack = document.querySelector('.pk-maveli-track');
    var mv = document.getElementById('pkMaveli');

    if (!experience || !stage || !completeImg) return;

    var stages = [
      {
        t: 0.0,
        en: 'Yellow Marigold',
        ml: 'ജമന്തി',
        desc: "Every pookalam begins as an empty circle — a quiet invitation for the flowers to arrive, one ring at a time."
      },
      {
        t: 0.08,
        en: 'Mullappoo',
        ml: 'മുല്ലപ്പൂ',
        desc: 'Jasmine — small, pale and fragrant, laid closest to the centre.'
      },
      {
        t: 0.16,
        en: 'Red Hibiscus',
        ml: 'ചെമ്പരത്തി',
        desc: 'Represents energy and devotion, bringing a striking deep red radiance to the traditional concentric layers.'
      },
      {
        t: 0.24,
        en: 'Orange Marigold',
        ml: 'ജമന്തി',
        desc: "Symbolizes warmth and prosperity, adding vibrant orange brightness and bold contrast to the Pookalam."
      },
      {
        t: 0.34,
        en: 'Shankhupushpam',
        ml: 'ശംഖുപുഷ്പം',
        desc: 'Dedicated to the divine, adding a rare, deep royal blue contrast that elevates the overall design.'
      },
      {
        t: 0.4,
        en: 'Ixora',
        ml: 'തെച്ചി',
        desc: 'Symbolizes protection and festive vibrancy, widely used for its clusters of vivid red, star-shaped blossoms.'
      },
      {
        t: 0.48,
        en: 'Bougainvillea',
        ml: 'കടലാസുപ്പൂവ്',
        desc: 'Adds modern festive flair, providing crisp, long-lasting purples and pinks for sharp design outlines.'
      },
      {
        t: 0.64,
        en: 'Yellow Lantana',
        ml: 'അരിപ്പൂവ്',
        desc: 'Symbolizes local garden charm, using compact yellow clusters to fill small gaps with textured warmth.'
      },
      {
        t: 0.94,
        en: 'Outer Chendumalli',
        ml: 'പുറംവളയം',
        desc: 'A final, generous ring of yellow marigold completes the pookalam — the outermost welcome laid at the door.'
      }
    ];

    var lastStageIndex = -1;
    var ticking = false;
    var trackWidth = 0;
    var mvWidth = 0;
    var edgePx = 20;

    function measure() {
      if (mvTrack) trackWidth = mvTrack.clientWidth;
      if (mv) mvWidth = mv.getBoundingClientRect().width;
      var edgeVar = getComputedStyle(document.documentElement).getPropertyValue('--edge');
      var parsed = parseFloat(edgeVar);
      edgePx = isNaN(parsed) ? 20 : parsed;
    }

    function getProgress() {
      var rect = experience.getBoundingClientRect();
      var total = experience.offsetHeight - window.innerHeight;
      if (total <= 0) return 1;
      var scrolled = -rect.top;
      return clamp(scrolled / total, 0, 1);
    }

    function applyStageText(index) {
      if (index === lastStageIndex) return;
      lastStageIndex = index;
      var s = stages[clamp(index, 0, stages.length - 1)];

      infoBox.classList.add('is-updating');
      window.setTimeout(function () {
        infoEn.textContent = s.en;
        infoMl.textContent = s.ml;
        infoDesc.textContent = s.desc;
        infoBox.classList.remove('is-updating');
      }, prefersReducedMotion ? 0 : 180);
    }

    function findStageIndex(progress) {
      var idx = 0;
      for (var i = 0; i < stages.length; i++) {
        if (progress >= stages[i].t) idx = i;
      }
      return idx;
    }

    function render() {
      ticking = false;
      var progress = getProgress();

      // Eased radius growth for a more natural bloom
      var eased = 1 - Math.pow(1 - progress, 2);
      var radius = eased * 82; // percent
      var feather = 7;
      var r1 = Math.max(0, radius - feather);
      var maskValue = 'radial-gradient(circle at 50% 50%, #000 0%, #000 ' + r1.toFixed(2) + '%, transparent ' + radius.toFixed(2) + '%)';

      completeImg.style.webkitMaskImage = maskValue;
      completeImg.style.maskImage = maskValue;

      stage.style.setProperty('--pk-progress', (progress).toFixed(3));

      if (progressFill) progressFill.style.width = (progress * 100).toFixed(1) + '%';

      if (glow) {
        if (progress > 0.97) glow.classList.add('is-visible');
        else glow.classList.remove('is-visible');
      }

      applyStageText(findStageIndex(progress));

      if (mv && trackWidth && mvWidth) {
        var travel = Math.max(0, trackWidth - mvWidth - edgePx * 2);
        var x = edgePx + progress * travel;
        mv.style.transform = 'translateX(' + x.toFixed(1) + 'px)';
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(render);
      }
    }

    measure();
    render();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () {
      measure();
      onScroll();
    });
  })();

  /* =====================================================
     POOKALAM PAGE — finale reveal
  ===================================================== */
  (function finaleReveal() {
    var finale = document.getElementById('finale');
    if (!finale || !('IntersectionObserver' in window)) {
      if (finale) finale.classList.add('is-visible');
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          finale.classList.add('is-visible');
        }
      });
    }, { threshold: 0.35 });
    observer.observe(finale);
  })();

  /* =====================================================
     POOKALAM PAGE — like / dislike feedback
  ===================================================== */
  (function feedback() {
    var likeBtn = document.getElementById('likeBtn');
    var dislikeBtn = document.getElementById('dislikeBtn');
    var note = document.getElementById('feedbackNote');
    if (!likeBtn || !dislikeBtn) return;

    var STORAGE_KEY = 'onamPookalamFeedback';

    function safeGet() {
      try { return window.localStorage.getItem(STORAGE_KEY); }
      catch (e) { return null; }
    }
    function safeSet(value) {
      try { window.localStorage.setItem(STORAGE_KEY, value); }
      catch (e) { /* storage unavailable — fine, state stays in-memory only */ }
    }

    function applyState(choice) {
      var liked = choice === 'like';
      var disliked = choice === 'dislike';
      likeBtn.setAttribute('aria-pressed', String(liked));
      dislikeBtn.setAttribute('aria-pressed', String(disliked));
      likeBtn.setAttribute('data-locked', String(disliked));
      dislikeBtn.setAttribute('data-locked', String(liked));

      if (liked) note.textContent = 'Thanks for the love — happy Onam! 🌼';
      else if (disliked) note.textContent = "Thanks for letting us know — we'll do better next year.";
      else note.textContent = '';
    }

    likeBtn.addEventListener('click', function () {
      var next = likeBtn.getAttribute('aria-pressed') === 'true' ? '' : 'like';
      safeSet(next);
      applyState(next);
    });
    dislikeBtn.addEventListener('click', function () {
      var next = dislikeBtn.getAttribute('aria-pressed') === 'true' ? '' : 'dislike';
      safeSet(next);
      applyState(next);
    });

    applyState(safeGet());
  })();

})();
