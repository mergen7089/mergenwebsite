/* =========================================================
   MERGEN — main.js
   دارک/لایت مود · مگامنو موبایل · تب‌ها · مودال · افکنواس
   کروسل ۵ (کارت‌های لوکس) · کروسل ۶ (دو ردیفه با فوکوس)
   ریویل هنگام اسکرول · بازگشت به بالا
   ========================================================= */

/* ---------- ۱) دارک / لایت مود ---------- */
(function themeInit() {
  const root = document.documentElement;
  const toggles = () => document.querySelectorAll('[data-theme-toggle]');

  function apply(theme) {
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('mergen-theme', theme);
    toggles().forEach(btn => btn.setAttribute('aria-pressed', theme === 'dark'));
  }

  document.addEventListener('DOMContentLoaded', () => {
    toggles().forEach(btn => {
      btn.addEventListener('click', () => {
        const isDark = root.classList.contains('dark');
        apply(isDark ? 'light' : 'dark');
      });
    });
  });
})();



/* -------------> Hero Slider <------------- */
$(function(){
  const $hero = $('.mergen-hero');
  const slides = $('.mergen-slide').toArray();
  const $title = $('#slide-title');
  const $kicker = $('#slide-kicker span:last-child');
  const $desc = $('#slide-desc');
  const $current = $('#slide-current');
  const $progress = $('#progress');
  const $thumbs = $('#thumbs');
  const duration = 7000;

  slides.forEach((s,i)=>{
    const bg = s.querySelector('.slide-bg').style.backgroundImage.slice(5,-2);
    const title = s.dataset.title;
    const desc = s.dataset.desc;
    const card = $(`
      <button class="thumb ${i===0?'active':''}" data-index="${i}">
        <img src="${bg}" alt="">
        <div class="text-right">
          <div class="thumb-num">0${i+1}</div>
          <div class="thumb-title">${title}</div>
          <div class="thumb-desc">${desc}</div>
        </div>
      </button>`);
    $thumbs.append(card);
  });

  function updateUI(index){
    const s = slides[index];
    $title.html(s.dataset.title.replace(' ', ' <span>') + '</span>');
    $kicker.text(s.dataset.kicker);
    $desc.text(s.dataset.desc);
    $current.text(String(index+1).padStart(2,'0'));
    $progress.css({transition:'none',width:'0%'});
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      $progress.css({transition:`width ${duration}ms linear`,width:'100%'});
    }));
    $('.thumb').removeClass('active').eq(index).addClass('active');
  }

  $hero.owlCarousel({
    rtl:true,
    items:1,
    loop:true,
    dots:false,
    nav:false,
    autoplay:true,
    autoplayTimeout:duration,
    autoplayHoverPause:false,
    smartSpeed:1100,
    mouseDrag:true,
    touchDrag:true,
    animateOut:'fadeOut',
    animateIn:'fadeIn'
  });

  $hero.on('changed.owl.carousel', function(e){
    updateUI(e.item.index % slides.length);
  });

  $('.prev').on('click',()=> $hero.trigger('prev.owl.carousel'));
  $('.next').on('click',()=> $hero.trigger('next.owl.carousel'));
  $thumbs.on('click','.thumb',function(){
    $hero.trigger('to.owl.carousel', [$(this).data('index'), 900, true]);
  });

  updateUI(0);
});


/* ---------- ۲) ریویل هنگام اسکرول (fallback بدون AOS) ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || !items.length) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  items.forEach(el => io.observe(el));
});

/* ---------- ۳) موبایل: افکنواس منو ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-offcanvas-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.getAttribute('data-offcanvas-open'));
      openOffcanvas(target);
    });
  });
  document.querySelectorAll('[data-offcanvas-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.closest('[data-offcanvas]');
      closeOffcanvas(target);
    });
  });
});

function openOffcanvas(panel) {
  if (!panel) return;
  const backdrop = panel.querySelector('[data-offcanvas-backdrop]');
  const sheet = panel.querySelector('[data-offcanvas-sheet]');
  panel.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
  requestAnimationFrame(() => {
    if (backdrop) backdrop.classList.remove('opacity-0');
    if (sheet) sheet.classList.remove('translate-x-full', 'translate-y-full');
  });
}
function closeOffcanvas(panel) {
  if (!panel) return;
  const backdrop = panel.querySelector('[data-offcanvas-backdrop]');
  const sheet = panel.querySelector('[data-offcanvas-sheet]');
  if (backdrop) backdrop.classList.add('opacity-0');
  if (sheet) {
    const dir = sheet.dataset.dir === 'bottom' ? 'translate-y-full' : 'translate-x-full';
    sheet.classList.add(dir);
  }
  document.body.classList.remove('overflow-hidden');
  setTimeout(() => panel.classList.add('hidden'), 350);
}

/* ---------- ۴) مودال محصول (Quick View) ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('productModal');
  if (!modal) return;
  const titleEl = modal.querySelector('[data-modal-title]');
  const descEl = modal.querySelector('[data-modal-desc]');
  const metaEl = modal.querySelector('[data-modal-meta]');

  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      titleEl.textContent = btn.dataset.title || '';
      descEl.textContent = btn.dataset.desc || '';
      metaEl.textContent = btn.dataset.meta || '';
      modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
      requestAnimationFrame(() => {
        modal.querySelector('[data-modal-backdrop]').classList.remove('opacity-0');
        modal.querySelector('[data-modal-box]').classList.remove('opacity-0', 'scale-95');
      });
    });
  });

  function closeModal() {
    modal.querySelector('[data-modal-backdrop]').classList.add('opacity-0');
    modal.querySelector('[data-modal-box]').classList.add('opacity-0', 'scale-95');
    document.body.classList.remove('overflow-hidden');
    setTimeout(() => modal.classList.add('hidden'), 300);
  }
  modal.querySelectorAll('[data-modal-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
});

/* ---------- ۵) تب‌ها (Nav Tab) ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const tabWrap = document.querySelector('[data-tabs]');
  if (!tabWrap) return;
  const buttons = tabWrap.querySelectorAll('[data-tab-btn]');
  const panels = tabWrap.querySelectorAll('[data-tab-panel]');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tabBtn;
      buttons.forEach(b => {
        const active = b === btn;
        b.classList.toggle('bg-ink', active);
        b.classList.toggle('text-bg', active);
        b.classList.toggle('text-ink-soft', !active);
        b.setAttribute('aria-selected', active);
      });
      panels.forEach(p => {
        const show = p.dataset.tabPanel === target;
        p.classList.toggle('hidden', !show);
        if (show) {
          p.classList.add('is-visible');
          p.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'));
        }
      });
    });
  });
});

/* ---------- ۶) کروسل ۵ — کارت‌های لوکس با فوکوس مرکزی ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('carousel5Track');
  if (!track) return;
  const cards = Array.from(track.children);
  const prevBtn = document.getElementById('c5Prev');
  const nextBtn = document.getElementById('c5Next');

  function updateCenter() {
    const trackRect = track.getBoundingClientRect();
    const center = trackRect.left + trackRect.width / 2;
    let closest = null, closestDist = Infinity;
    cards.forEach(card => {
      const r = card.getBoundingClientRect();
      const cardCenter = r.left + r.width / 2;
      const dist = Math.abs(cardCenter - center);
      card.classList.remove('c5-center');
      if (dist < closestDist) { closestDist = dist; closest = card; }
    });
    if (closest) closest.classList.add('c5-center');
  }

  let ticking = false;
  track.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { updateCenter(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  function scrollByCard(dir) {
    const card = cards[0];
    const gap = parseFloat(getComputedStyle(track).columnGap || 24);
    const step = card.getBoundingClientRect().width + gap;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  }
  if (nextBtn) nextBtn.addEventListener('click', () => scrollByCard(track.dir === 'rtl' ? -1 : 1));
  if (prevBtn) prevBtn.addEventListener('click', () => scrollByCard(track.dir === 'rtl' ? 1 : -1));

  updateCenter();
  window.addEventListener('resize', updateCenter);

  /* اتوپلی ملایم */
  let autoTimer = setInterval(() => scrollByCard(-1), 4500);
  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', () => { autoTimer = setInterval(() => scrollByCard(-1), 4500); });
});

/* ---------- ۷) کروسل ۶ — دو ردیفه با فوکوس و حرکت متناوب ---------- */
(function carousel6() {
  document.addEventListener('DOMContentLoaded', () => {
    const scene = document.getElementById('c6Scene');
    if (!scene) return;

    /* row1 = لِین ۱ = فروشگاه (مبلمان و سرویس خواب) */
    const row1Items = [
      { title: "مبل راحتی مدولار", desc: "قابل تغییر چیدمان بر اساس فضا" },
      { title: "میز ناهارخوری چوب گردو", desc: "طراحی مدرن با پایه‌های فلزی" },
      { title: "صندلی اسکاندیناوی", desc: "راحتی و سبکی در طراحی روزمره" },
      { title: "سرویس خواب کلاسیک", desc: "قاب‌های برجسته و رنگ گرم" },
      { title: "میز عسلی مرمری", desc: "ترکیب سنگ مرمر و برنز" },
      { title: "مبل کرسی راحتی", desc: "مناسب فضاهای مطالعه و استراحت" },
      { title: "بوفه و باربر دیواری", desc: "فضای نگهداری ظروف و پذیرایی" },
      { title: "چراغ ایستاده آتلیه‌ای", desc: "نورپردازی نقطه‌ای کنار مبلمان" }
    ];
    /* row2 = لِین ۲ = نمایشگاه (کابینت، کمد و دکور) */
    const row2Items = [
      { title: "کمد دیواری هوشمند", desc: "طراحی مینیمال با درب‌های بدون دستگیره" },
      { title: "تی‌وی وال مدرن", desc: "ترکیب چوب و نور مخفی پشت پنل" },
      { title: "کتابخانه دیواری", desc: "قفسه‌بندی باز با نورپردازی نقطه‌ای" },
      { title: "کابینت آشپزخانه گلاس", desc: "درب‌های براق با هندل مخفی" },
      { title: "سرویس خواب مینیمال", desc: "رنگ‌بندی خنثی و خطوط ساده" },
      { title: "پارتیشن چوبی دکوراتیو", desc: "جداکننده فضا با طرح هندسی" },
      { title: "میز جلومبلی سنگی", desc: "ترکیب سنگ و فلز در طراحی نشیمن" },
      { title: "سقف کاذب نور مخفی", desc: "نورپردازی غیرمستقیم دور سقف" }
    ];

    function tripled(items) { return [...items, ...items, ...items]; }

    function buildTrack(trackEl, items, toneClass) {
      trackEl.innerHTML = tripled(items).map((it, i) => `
        <div class="c6-card ${toneClass} shrink-0 w-[180px] sm:w-[240px] h-[245px] sm:h-[320px] rounded-2xl overflow-hidden relative border border-white/10 bg-surface-2 flex items-end" data-i="${i}">
          <div class="absolute inset-0 opacity-70" style="background:radial-gradient(120% 100% at 30% 0%, rgba(203,168,113,.25), transparent 60%)"></div>
          <div class="relative z-10 p-4 text-white">
            <h3 class="font-bold text-sm sm:text-base mb-1">${it.title}</h3>
            <p class="text-xs text-white/70 leading-relaxed c6-desc">${it.desc}</p>
          </div>
        </div>
      `).join('');
    }

    const track1 = document.getElementById('c6Track1');
    const track2 = document.getElementById('c6Track2');
    const lane1 = document.getElementById('c6Lane1');
    const lane2 = document.getElementById('c6Lane2');
    buildTrack(track1, row1Items, 'c6-tone-a');
    buildTrack(track2, row2Items, 'c6-tone-b');

    const LEN = row1Items.length;
    function getCardStep() {
      const w = window.innerWidth <= 576 ? 180 : 240;
      const gap = window.innerWidth <= 576 ? 14 : 22;
      return w + gap;
    }
    function getCardWidth() { return window.innerWidth <= 576 ? 180 : 240; }

    function offsetFor(laneEl, idx) {
      const cardWidth = getCardWidth();
      const step = getCardStep();
      const viewport = laneEl.clientWidth;
      const C = viewport / 2 - cardWidth / 2;
      return C - idx * step;
    }

    function render(trackEl, laneEl, idx, skipAnim) {
      if (skipAnim) trackEl.classList.add('c6-no-anim');
      const cards = trackEl.querySelectorAll('.c6-card');
      cards.forEach((card, i) => {
        card.classList.remove('c6-center', 'c6-neighbor');
        if (i === idx) card.classList.add('c6-center');
        else if (i === idx - 1 || i === idx + 1) card.classList.add('c6-neighbor');
      });
      trackEl.style.transform = `translateX(${offsetFor(laneEl, idx)}px)`;
      if (skipAnim) { void trackEl.offsetWidth; trackEl.classList.remove('c6-no-anim'); }
    }

    const state = {
      row1: { idx: LEN, dir: 1, track: track1, el: lane1 },
      row2: { idx: LEN * 2 - 1, dir: -1, track: track2, el: lane2 }
    };
    render(track1, lane1, state.row1.idx, true);
    render(track2, lane2, state.row2.idx, true);

    const title1 = document.getElementById('c6Title1');
    const title2 = document.getElementById('c6Title2');
    function setFocus(rowKey) {
      title1 && title1.classList.toggle('opacity-100', rowKey === 'row1');
      title1 && title1.classList.toggle('opacity-40', rowKey !== 'row1');
      title2 && title2.classList.toggle('opacity-100', rowKey === 'row2');
      title2 && title2.classList.toggle('opacity-40', rowKey !== 'row2');
    }

    function advance(rowKey) {
      const s = state[rowKey];
      s.idx += s.dir;
      render(s.track, s.el, s.idx, false);
      setTimeout(() => {
        if (s.idx >= LEN * 2) { s.idx -= LEN; render(s.track, s.el, s.idx, true); }
        else if (s.idx < LEN) { s.idx += LEN; render(s.track, s.el, s.idx, true); }
      }, 950);
    }

    let focusedRow = 'row1';
    setFocus('row1');
    let paused = false;
    const CYCLE = 2700;
    function tick() {
      if (paused) return;
      const unfocused = focusedRow === 'row1' ? 'row2' : 'row1';
      advance(unfocused);
      setTimeout(() => { if (!paused) { setFocus(unfocused); focusedRow = unfocused; } }, 820);
    }
    const timer = setInterval(tick, CYCLE);
    [lane1, lane2].forEach(lane => {
      lane.addEventListener('mouseenter', () => paused = true);
      lane.addEventListener('mouseleave', () => paused = false);
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        render(track1, lane1, state.row1.idx, true);
        render(track2, lane2, state.row2.idx, true);
      }, 100);
    });
  });
})();

/* ---------- ۸) بازگشت به بالا ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('opacity-0', window.scrollY < 500);
    btn.classList.toggle('pointer-events-none', window.scrollY < 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});

/* ---------- ۹) هدر: سایه هنگام اسکرول ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('shadow-lg', window.scrollY > 40);
    header.classList.toggle('backdrop-blur-md', window.scrollY > 10);
  }, { passive: true });
});
