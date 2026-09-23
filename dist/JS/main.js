/* =========================================================
   MERGEN — main.js
   دارک/لایت مود · مگامنو موبایل · تب‌ها · مودال · افکنواس
   کروسل ۵ (کارت‌های لوکس) · کروسل ۶ (دو ردیفه با فوکوس)
   ریویل هنگام اسکرول · بازگشت به بالا
   ========================================================= */

/* =========================================================
   01 — THEME / DARK + LIGHT MODE
   ========================================================= */
(function themeInit() {
  const root = document.documentElement;
  const toggles = () => document.querySelectorAll('[data-theme-toggle]');

  function apply(theme) {
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('mergen-theme', theme);
    toggles().forEach(btn => {
      btn.setAttribute('aria-pressed', theme === 'dark');
    });
  }

  const saved = localStorage.getItem('mergen-theme');
  apply(saved === 'light' ? 'light' : 'dark');

  document.addEventListener('DOMContentLoaded', () => {
    toggles().forEach(btn => {
      btn.addEventListener('click', () => {
        const isDark = root.classList.contains('dark');
        apply(isDark ? 'light' : 'dark');
      });
    });
  });
})();




/* ==================== 03 — HERO ==================== */
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


/* ==================== 17 — SCROLL REVEAL ==================== */
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

/* ==================== 02 — HEADER / MOBILE ==================== */
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

/* ==================== 07 — QUICK VIEW ==================== */
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

/* ==================== 13 — EXPERIENCE / TABS ==================== */
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

/* ==================== 06 — SLIDER 01 ==================== */
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

/* ==================== 07 — SLIDER 02 ==================== */
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

/* ==================== 17 — BACK TO TOP ==================== */
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('opacity-0', window.scrollY < 500);
    btn.classList.toggle('pointer-events-none', window.scrollY < 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});

/* ==================== 02 — HEADER / SCROLL ==================== */
document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('shadow-lg', window.scrollY > 40);
    header.classList.toggle('backdrop-blur-md', window.scrollY > 10);
  }, { passive: true });
});


/* =========================================================
   MIGRATED INLINE SCRIPTS — PRESERVED BEHAVIOUR
   These blocks were moved out of the HTML without changing
   their functional logic. They will be cleaned section-by-section
   after visual verification.
   ========================================================= */

/* ==================== 01 — THEME + MEGA MENU ==================== */
    const html=document.documentElement; const saved=localStorage.getItem('mergen-theme'); if(saved==='dark')html.classList.add('dark');
    const themeToggle=document.getElementById('themeToggle'); themeToggle?.addEventListener('click',()=>{html.classList.toggle('dark');localStorage.setItem('mergen-theme',html.classList.contains('dark')?'dark':'light')});
    const sticky=document.getElementById('sticky');window.addEventListener('scroll',()=>{sticky.classList.toggle('show',scrollY>150);document.getElementById('backTop').classList.toggle('show',scrollY>650)},{passive:true});
    const mega=document.getElementById('megaMenu'),overlay=document.getElementById('megaOverlay'),megaButtons=[...document.querySelectorAll('.mega-nav')];const megaData={products:['MERGEN INTERIOR / COLLECTION','طراحی برای<br>زندگی متفاوت',['مبلمان','مبل راحتی','مبل مدرن','صندلی','میز جلو مبلی'],['اتاق خواب','سرویس خواب','تخت و دراور','کمد دیواری','کلوزت روم'],['دکوراسیون','کابینت','TV Wall','دکور فروشگاه','طراحی داخلی']],living:['COLLECTION / 01','Living<br>Collection',['مجموعه‌ها','مبل مدرن','مبل مینیمال','مبل راحتی'],['تکمیل فضا','میز جلو مبلی','کنسول','میز عسلی'],['خدمات','طراحی سفارشی','اجرای پروژه','مشاوره']],bedroom:['COLLECTION / 02','Bedroom<br>Collection',['محصولات','تخت خواب','سرویس کامل','میز آرایش'],['فضا','کمد دیواری','کلوزت روم','دراور'],['سفارش','طراحی اختصاصی','مشاوره','اندازه‌گیری']],tables:['COLLECTION / 03','Tables<br>& Chairs',['میزها','میز ناهارخوری','میز مدیریت','میز کامپیوتر'],['میزهای کوچک','جلو مبلی','میز عسلی','کنسول'],['صندلی','صندلی ناهارخوری','صندلی اداری','صندلی سفارشی']],interior:['INTERIOR DESIGN','Architecture<br>of Living',['فضای داخلی','کابینت','TV Wall','دکور فروشگاه'],['چوب و کف','درب چوبی','پارکت','قرنیز و روکوب'],['پروژه','طراحی داخلی','اجرای کامل','پروژه تجاری']]};function renderMega(key){const d=megaData[key]||megaData.products;document.getElementById('megaKicker').innerHTML=d[0];document.getElementById('megaTitle').innerHTML=d[1];['megaCol1','megaCol2','megaCol3'].forEach((id,n)=>{document.getElementById(id.replace('megaCol','megaCol')+'Title').textContent=d[n+2][0];document.getElementById(id).innerHTML=d[n+2].slice(1).map(x=>`<a href="#${key==='bedroom'?'layers':key==='interior'?'slider02':'slider01'}">${x}</a>`).join('')})}function openMega(key){renderMega(key);mega.classList.add('open');overlay.classList.add('open');megaButtons.forEach(b=>b.classList.toggle('active',b.dataset.mega===key))}function closeMega(){mega.classList.remove('open');overlay.classList.remove('open');megaButtons.forEach(b=>b.classList.remove('active'))}megaButtons.forEach(b=>{b.addEventListener('mouseenter',()=>openMega(b.dataset.mega));b.addEventListener('click',e=>{e.stopPropagation();openMega(b.dataset.mega)})});document.getElementById('menuButton').addEventListener('click',()=>mega.classList.toggle('open'));document.getElementById('mobileToggle').addEventListener('click',()=>mega.classList.toggle('open'));overlay.addEventListener('click',closeMega);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMega()});mega.addEventListener('mouseleave',()=>closeMega());
    /* ==================== 03 — HERO / MIGRATED ==================== */
    $(function(){const $hero=$('.mergen-hero'),slides=$('.mergen-slide').toArray(),$title=$('.hero-title'),$kicker=$('.hero-kicker'),$desc=$('.hero-desc'),$current=$('#slide-current'),$progress=$('#progress'),$thumbs=$('#thumbs'),duration=7000;slides.forEach((s,i)=>{const bg=s.querySelector('.slide-bg').style.backgroundImage.slice(5,-2);$thumbs.append(`<button class="hero-thumb ${i===0?'active':''}" data-index="${i}"><img src="${bg}" alt=""><div class="text-right"><div class="hero-thumb-num">0${i+1}</div><div class="hero-thumb-title">${s.dataset.title}</div><div class="hero-thumb-desc">${s.dataset.desc}</div></div></button>`)});function ui(i){const s=slides[i];$kicker.text(s.dataset.kicker);$desc.text(s.dataset.desc);$current.text(String(i+1).padStart(2,'0'));$progress.css({transition:'none',width:'0%'});requestAnimationFrame(()=>requestAnimationFrame(()=>{$progress.css({transition:`width ${duration}ms linear`,width:'100%'})}));$('.hero-thumb').removeClass('active').eq(i).addClass('active')} $hero.owlCarousel({rtl:true,items:1,loop:true,dots:false,nav:false,autoplay:true,autoplayTimeout:duration,smartSpeed:1100,mouseDrag:true,touchDrag:true,animateOut:'fadeOut',animateIn:'fadeIn'});$hero.on('changed.owl.carousel',e=>ui(e.item.index%slides.length));$('.prev').on('click',()=> $hero.trigger('prev.owl.carousel'));$('.next').on('click',()=> $hero.trigger('next.owl.carousel'));$thumbs.on('click','.hero-thumb',function(){$hero.trigger('to.owl.carousel',[$(this).data('index'),900,true])});ui(0);
    /* ==================== 06 — SLIDER 01 / FURNITURE ==================== */ $('#furnitureCarousel').owlCarousel({rtl:true,loop:true,center:true,margin:20,nav:true,dots:false,autoplay:true,autoplayTimeout:3000,autoplayHoverPause:true,smartSpeed:700,responsive:{0:{items:1},600:{items:2},900:{items:3}}}); $('#customCarousel').owlCarousel({rtl:true,loop:true,center:true,margin:22,nav:true,dots:false,autoplay:true,autoplayTimeout:3200,autoplayHoverPause:true,smartSpeed:750,responsive:{0:{items:1.1},600:{items:2},900:{items:3}}});});
    /* ==================== 04 — LAYERS ==================== */
    const layers=[...document.querySelectorAll('[data-layer]')];function updateLayers(){const vh=innerHeight;layers.forEach((s,i)=>{const next=layers[i+1];const r=s.getBoundingClientRect();let p=next?Math.max(0,Math.min(1,(vh-next.getBoundingClientRect().top)/vh)):0;let outgoing=p>0&&p<1;s.style.transform=`scale(${1-p*.055})`;s.style.opacity=1-p*.88;s.style.filter=`blur(${p*2.8}px)`;s.classList.toggle('outgoing',outgoing);s.classList.toggle('is-current',p<.05);const bg=s.querySelector('.layer-bg');if(bg)bg.style.transform=`scale(${1.04+p*.08}) translateY(${-p*2}%)`})}addEventListener('scroll',updateLayers,{passive:true});addEventListener('resize',updateLayers);updateLayers();
    /* ==================== 07 — SLIDER 02 / FOCUS ==================== */
    (() => {
        const scene = document.querySelector('#slider02 .ms-scene');
        if (!scene) return;

        const row1Items = [
            { title:"سرویس مدل اول", desc:"طراحی مینیمال با درب‌های بدون دستگیره", img:"./IMG/takht1.jfif" },
            { title:"سرویس مدل دوم", desc:"ترکیب چوب و نور مخفی پشت پنل", img:"./IMG/takht2.jfif" },
            { title:"سرویس مدل سوم", desc:"قفسه‌بندی باز با نورپردازی نقطه‌ای", img:"./IMG/takht3.jfif" },
            { title:"سرویس مدل چهارم", desc:"درب‌های براق با هندل مخفی", img:"./IMG/takht4.jfif" },
            { title:"سرویس مدل پنجم", desc:"رنگ‌بندی خنثی و خطوط ساده", img:"./IMG/takht5.jfif" },
            { title:"سرویس مدل ششم", desc:"جداکننده فضا با طرح هندسی", img:"./IMG/takht6.jfif" },
            { title:"سرویس مدل هفتم", desc:"ترکیب سنگ و فلز در طراحی نشیمن", img:"./IMG/takht7.jfif" },
            { title:"سرویس مدل هشتم", desc:"نورپردازی غیرمستقیم دور سقف", img:"./IMG/takht8.jfif" }
        ];

        const row2Items = [
            { title:"سرویس مدل نهم", desc:"طراحی با قاب‌های برجسته و رنگ گرم", img:"./IMG/takht9.jpg" },
            { title:"سرویس مدل دهم", desc:"بافت سنگ طبیعی در دیوار پذیرایی", img:"./IMG/takht10.jpg" },
            { title:"سرویس مدل یازدهم", desc:"نمایش دکوری اشیا در طبقات باز", img:"./IMG/takht11.jpg" },
            { title:"سرویس مدل دوازدهم", desc:"طراحی جزیره‌ای با روشنایی آویز", img:"./IMG/takht12.jpg" },
            { title:"سرویس مدل سیزدهم", desc:"بافت گرم چوب در فضای خواب", img:"./IMG/takht13.jpg" },
            { title:"سرویس مدل چهاردهم", desc:"طرح مشبک فلزی برای تفکیک فضا", img:"./IMG/takht14.webp" },
            { title:"سرویس مدل پانزدهم", desc:"طراحی ساده با صندلی‌های هماهنگ", img:"./IMG/takht15.webp" },
            { title:"سرویس مدل شانزدهم", desc:"خطوط نوری کم‌مصرف در طراحی سقف", img:"./IMG/takht16.webp" }
        ];

        const track1 = document.getElementById('msTrack1');
        const track2 = document.getElementById('msTrack2');
        const row1El = document.querySelector('#slider02 .ms-row-1');
        const row2El = document.querySelector('#slider02 .ms-row-2');
        const title1 = document.getElementById('msTitle1');
        const title2 = document.getElementById('msTitle2');
        const LEN = row1Items.length;

        const tripled = items => [...items, ...items, ...items];

        function buildTrack(trackEl, items) {
            trackEl.innerHTML = tripled(items).map((it, i) => `
                <article class="ms-card" data-i="${i}">
                    <img src="${it.img}" alt="${it.title}" loading="lazy">
                    <div class="ms-info">
                        <h3>${it.title}</h3>
                        <p>${it.desc}</p>
                    </div>
                </article>
            `).join('');
        }

        buildTrack(track1, row1Items);
        buildTrack(track2, row2Items);

        function metrics() {
            const mobile = window.innerWidth <= 600;
            return {
                width: mobile ? 180 : 220,
                gap: mobile ? 14 : 20
            };
        }

        function offsetFor(rowEl, idx) {
            const {width, gap} = metrics();
            const step = width + gap;
            return rowEl.clientWidth / 2 - width / 2 - idx * step;
        }

        function render(trackEl, rowEl, idx, skipAnim = false) {
            if (skipAnim) trackEl.classList.add('ms-no-anim');

            trackEl.querySelectorAll('.ms-card').forEach((card, i) => {
                card.classList.remove('ms-center', 'ms-neighbor');
                if (i === idx) card.classList.add('ms-center');
                else if (i === idx - 1 || i === idx + 1) card.classList.add('ms-neighbor');
            });

            trackEl.style.transform = `translateX(${offsetFor(rowEl, idx)}px)`;

            if (skipAnim) {
                void trackEl.offsetWidth;
                trackEl.classList.remove('ms-no-anim');
            }
        }

        const state = {
            row1: {idx: LEN, dir: 1, track: track1, el: row1El},
            row2: {idx: LEN * 2 - 1, dir: -1, track: track2, el: row2El}
        };

        render(track1, row1El, state.row1.idx, true);
        render(track2, row2El, state.row2.idx, true);

        let focusedRow = 'row1';
        let paused = false;
        let timer;

        function setFocus(rowKey) {
            title1.classList.toggle('focused', rowKey === 'row1');
            title2.classList.toggle('focused', rowKey === 'row2');

            scene.querySelectorAll('.ms-card.ms-focused').forEach(c => c.classList.remove('ms-focused'));
            const s = state[rowKey];
            const center = s.track.querySelector(`.ms-card[data-i="${s.idx}"]`);
            if (center) center.classList.add('ms-focused');
        }

        function advance(rowKey) {
            const s = state[rowKey];
            s.idx += s.dir;
            render(s.track, s.el, s.idx);

            setTimeout(() => {
                if (s.idx >= LEN * 2) {
                    s.idx -= LEN;
                    render(s.track, s.el, s.idx, true);
                } else if (s.idx < LEN) {
                    s.idx += LEN;
                    render(s.track, s.el, s.idx, true);
                }
            }, 950);
        }

        function tick() {
            if (paused) return;
            const next = focusedRow === 'row1' ? 'row2' : 'row1';
            advance(next);

            setTimeout(() => {
                if (paused) return;
                focusedRow = next;
                setFocus(next);
            }, 820);
        }

        function start() {
            clearInterval(timer);
            timer = setInterval(tick, 2700);
        }

        scene.querySelectorAll('.ms-row').forEach(row => {
            row.addEventListener('mouseenter', () => paused = true);
            row.addEventListener('mouseleave', () => paused = false);
        });

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                render(track1, row1El, state.row1.idx, true);
                render(track2, row2El, state.row2.idx, true);
            }, 120);
        });

        setFocus('row1');
        start();
    })();
    /* ==================== 09 — SHOPPING GUIDE ==================== */
    const guide=document.getElementById('guide');
    document.getElementById('guideOpen').onclick=()=>guide.classList.add('open');
    document.getElementById('guideClose').onclick=()=>guide.classList.remove('open');
    guide.addEventListener('click',e=>{if(e.target===guide)guide.classList.remove('open')});
    /* ==================== 10 — COLLECTION ==================== */

    /* ==================== 12 — SIGNATURE V3 ==================== */

    /* ==================== 13 — EXPERIENCE / NAV TABS ==================== */
    const mTabs=[...document.querySelectorAll('#tabs .mergen-tab')],mPanels=[...document.querySelectorAll('#tabs .mergen-tab-content')];let mIndex=0,mTimer;function activateMTab(i){mIndex=i;mTabs.forEach((b,n)=>b.classList.toggle('active',n===i));mPanels.forEach((p,n)=>p.classList.toggle('active',n===i));}function startMTabs(){clearInterval(mTimer);mTimer=setInterval(()=>activateMTab((mIndex+1)%mTabs.length),5000)}mTabs.forEach((b,i)=>b.addEventListener('mouseenter',()=>{activateMTab(i);startMTabs()}));startMTabs();
    /* ==================== 14 — FAQ ==================== */
    document.querySelectorAll('.faq-q').forEach(q=>q.onclick=()=>{const item=q.parentElement;document.querySelectorAll('.faq-item').forEach(x=>{if(x!==item)x.classList.remove('open')});item.classList.toggle('open')});
    /* ==================== 17 — BACK TO TOP / SECTION NAV ==================== */
    document.getElementById('backTop').onclick=()=>scrollTo({top:0,behavior:'smooth'});
    /* active second nav */
    const links=[...document.querySelectorAll('.section-nav a')],targets=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-35% 0px -55%'});targets.forEach(x=>io.observe(x));
    /* ==================== 13 — EXPERIENCE / VERTICAL ==================== */
    const vcCollections=[
    {number:'01',title:'کنسول',english:'BEDROOM COLLECTION',description:'طراحی و اجرای سرویس خواب مدرن و سفارشی با جزئیات دقیق، متناسب با فضای شما.',image:'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2000&q=90'},
    {number:'02',title:'کاور رادیاتور',english:'LIVING COLLECTION',description:'مبلمان مدرن و لوکس برای ایجاد فضایی متفاوت، گرم و ماندگار.',image:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=2000&q=90'},
    {number:'03',title:'میز و صندلی',english:'DINING COLLECTION',description:'میزهای غذاخوری، مدیریتی و سفارشی با تمرکز بر فرم، متریال و جزئیات.',image:'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=2000&q=90'},
    {number:'04',title:'کمد لباس',english:'CONSOLE COLLECTION',description:'کنسول‌های مینیمال و خاص برای کامل کردن هویت بصری فضای داخلی.',image:'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=90'},
    {number:'05',title:'کتابخانه',english:'INTERIOR DESIGN',description:'از ایده تا اجرا؛ طراحی فضاهای مسکونی و تجاری با نگاه یکپارچه.',image:'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=90'}
    ];
    let currentIndex=0,changing=false;
    function selectCollection(index){if(index===currentIndex&&!changing)return;currentIndex=index;changing=true;const item=vcCollections[index],content=document.getElementById('heroContent'),image=document.getElementById('heroImage');content.style.opacity='0';content.style.transform='translateY(25px)';image.style.opacity='0';image.style.transform='scale(1.08)';setTimeout(()=>{document.getElementById('title').innerText=item.title;document.getElementById('english').innerText=item.english;document.getElementById('description').innerText=item.description;document.getElementById('largeNumber').innerText=item.number;image.style.backgroundImage=`url("${item.image}")`;document.querySelectorAll('#collection .collection').forEach(btn=>btn.classList.remove('active'));const btn=document.querySelector(`#collection .collection[data-index="${index}"]`);if(btn)btn.classList.add('active');document.getElementById('counter').innerText=`${item.number} / 05`;document.getElementById('imageProgress').style.width=`${((index+1)/vcCollections.length)*100}%`;document.getElementById('verticalProgress').style.height=`${((index+1)/vcCollections.length)*100}%`;setTimeout(()=>{image.style.opacity='1';image.style.transform='scale(1)';content.style.opacity='1';content.style.transform='translateY(0)';changing=false},100)},350)}
    document.getElementById('heroImage').style.backgroundImage=`url("${vcCollections[0].image}")`;
    document.querySelectorAll('#collection .collection').forEach(btn=>{const i=+btn.dataset.index;btn.addEventListener('mouseenter',()=>selectCollection(i));btn.addEventListener('click',()=>selectCollection(i))});
    let autoPlay=setInterval(()=>selectCollection((currentIndex+1)%vcCollections.length),7000);const collectionHero=document.getElementById('hero');collectionHero.addEventListener('mouseenter',()=>clearInterval(autoPlay));collectionHero.addEventListener('mouseleave',()=>{clearInterval(autoPlay);autoPlay=setInterval(()=>selectCollection((currentIndex+1)%vcCollections.length),7000)});

    /* ==================== 12 — SIGNATURE V3 / DATA ==================== */
    const v3Products=[
    {title:'مدل اول',desc:'آرامش در جزئیات',img:'./IMG/naharkhori1.jfif'},
    {title:'مدل دوم',desc:'راحتی در کنار زیبایی',img:'./IMG/naharkhori2.jfif'},
    {title:'مدل سوم',desc:'ترکیب زیبایی و کارایی',img:'./IMG/naharkhori3.jfif'},
    {title:'مدل چهارم',desc:'نظم با طراحی اختصاصی',img:'./IMG/naharkhori4.jpg'},
    {title:'مدل پنجم',desc:'طراحی مدرن و ماندگار',img:'./IMG/naharkhori5.jpg'},
    {title:'مدل ششم',desc:'فضایی که شبیه شماست',img:'./IMG/naharkhori6.webp'}
    ];
    const v3Carousel=document.getElementById('carousel'),v3Thumbs=document.getElementById('v3Thumbs');let v3Current=0,v3Animating=false,v3StartX=0,v3Dragging=false;const v3Cards=[];
    v3Products.forEach((p,i)=>{const c=document.createElement('article');c.className='card';c.innerHTML=`<img src="${p.img}" alt="${p.title}"><div class="meta"><small>MERGEN / ${String(i+1).padStart(2,'0')}</small><strong>${p.title}</strong><span>${p.desc}</span></div>`;c.addEventListener('click',()=>{if(!v3Animating){const d=(i-v3Current+v3Products.length)%v3Products.length;if(d===0)return;if(d<=3)v3Go(d);else v3Go(d-v3Products.length)}});v3Carousel.appendChild(c);v3Cards.push(c);const t=document.createElement('button');t.className='thumb';t.innerHTML=`<img src="${p.img}" alt="">`;t.addEventListener('click',()=>v3Select(i));v3Thumbs.appendChild(t)});
    function v3Wrap(n){return(n+v3Products.length)%v3Products.length}
    function v3Position(){v3Cards.forEach((c,i)=>{let d=i-v3Current;if(d>3)d-=v3Products.length;if(d<-3)d+=v3Products.length;c.className='card '+(d===0?'pos0':d===1?'pos1':d===2?'pos2':d===3?'pos3':d===-1?'pos-1':d===-2?'pos-2':'posm3')+(d===0?' active':'')});document.getElementById('v3title').textContent=v3Products[v3Current].title;document.getElementById('v3desc').textContent=v3Products[v3Current].desc;document.getElementById('v3counter').textContent=String(v3Current+1).padStart(2,'0');document.getElementById('v3progress').style.width=((v3Current+1)/v3Products.length*100)+'%';[...v3Thumbs.children].forEach((t,i)=>t.classList.toggle('active',i===v3Current))}
    function v3Select(i){let d=i-v3Current;if(d>v3Products.length/2)d-=v3Products.length;if(d<-v3Products.length/2)d+=v3Products.length;v3Go(d)}
    function v3Go(step){if(v3Animating||step===0)return;v3Animating=true;v3Current=v3Wrap(v3Current+step);v3Position();setTimeout(()=>v3Animating=false,870)}
    document.getElementById('next').onclick=()=>v3Go(1);document.getElementById('prev').onclick=()=>v3Go(-1);window.addEventListener('keydown',e=>{if(e.key==='ArrowRight')v3Go(1);if(e.key==='ArrowLeft')v3Go(-1)});
    v3Carousel.addEventListener('pointerdown',e=>{v3Dragging=true;v3StartX=e.clientX;v3Carousel.setPointerCapture(e.pointerId);clearInterval(v3Timer)});v3Carousel.addEventListener('pointerup',e=>{if(!v3Dragging)return;v3Dragging=false;const dx=e.clientX-v3StartX;if(Math.abs(dx)>55)v3Go(dx<0?1:-1);restartV3Timer()});v3Carousel.addEventListener('pointercancel',()=>{v3Dragging=false;restartV3Timer()});v3Position();let v3Timer=setInterval(()=>v3Go(1),5200);function restartV3Timer(){clearInterval(v3Timer);v3Timer=setInterval(()=>v3Go(1),5200)}['mouseenter','touchstart'].forEach(ev=>v3Carousel.addEventListener(ev,()=>clearInterval(v3Timer)));['mouseleave','touchend'].forEach(ev=>v3Carousel.addEventListener(ev,restartV3Timer));

(()=>{const f=document.querySelector('.mergen-footer');if(!f)return;const plan=f.querySelector('.plan');const rooms=[...f.querySelectorAll('.room')];rooms.forEach(r=>{r.addEventListener('mouseenter',()=>{f.classList.add('room-focus');rooms.forEach(x=>x.classList.toggle('is-hovered',x===r))});r.addEventListener('mouseleave',()=>{f.classList.remove('room-focus');rooms.forEach(x=>x.classList.remove('is-hovered'))})});plan.addEventListener('mousemove',e=>{const b=plan.getBoundingClientRect();const x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;rooms.forEach((r,i)=>{const dx=x*(i%3-1)*10,dy=y*(i%2-.5)*8;r.style.transform=`translate3d(${dx}px,${dy}px,0)`})});plan.addEventListener('mouseleave',()=>rooms.forEach(r=>r.style.transform=''));})();

(function(){const root=document.querySelector('.mergen-experience');if(!root)return;const items=[...root.querySelectorAll('.me-item')],image=root.querySelector('#meImage'),index=root.querySelector('#meVisualIndex'),label=root.querySelector('#meVisualLabel'),title=root.querySelector('#meVisualTitle'),desc=root.querySelector('#meVisualDesc');const data=[{label:'EXHIBITION',title:'فضا را قبل از انتخاب لمس کن.',desc:'نمونه‌کارها، متریال و جزئیات را در فضایی واقعی ببینید و انتخاب دقیق‌تری داشته باشید.',image:'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1500&q=90'},{label:'SHOWROOM',title:'محصول را از نزدیک ببین.',desc:'در فروشگاه مرگن، فرم، متریال، رنگ و جزئیات را از نزدیک مقایسه و انتخاب کنید.',image:'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1500&q=90'},{label:'3D DESIGN',title:'قبل از ساخت، نتیجه را ببین.',desc:'تناسبات، رنگ، چیدمان و نورپردازی را پیش از تولید بررسی کنید تا تصمیم نهایی دقیق‌تر باشد.',image:'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1500&q=90'},{label:'SERVICES',title:'از ایده تا اجرای نهایی، کنار شما.',desc:'طراحی، CNC، ساخت سفارشی و اجرای پروژه در یک مسیر منسجم و دقیق انجام می‌شود.',image:'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1500&q=90'}];let active=-1,timer=null;function activate(i){if(i===active)return;active=i;items.forEach((e,n)=>e.classList.toggle('active',n===i));const d=data[i];image.style.opacity='0';image.style.transform='scale(1.035)';setTimeout(()=>{image.src=d.image;label.textContent=d.label;title.textContent=d.title;desc.textContent=d.desc;index.textContent=String(i+1).padStart(2,'0')+' / 04';requestAnimationFrame(()=>{image.style.opacity='1';image.style.transform='scale(1)'})},220)}function start(){clearInterval(timer);timer=setInterval(()=>activate((active+1)%data.length),5200)}items.forEach((e,i)=>{['mouseenter','focus','click'].forEach(ev=>e.addEventListener(ev,()=>{activate(i);start()}))});root.addEventListener('mouseenter',()=>clearInterval(timer));root.addEventListener('mouseleave',start);activate(0);start()})();

(function(){const materials=document.getElementById('materialsCanvas'),open=document.getElementById('materialsOpen'),close=document.getElementById('materialsClose'),grid=document.getElementById('materialGrid');if(materials&&open&&close){open.addEventListener('click',()=>{materials.classList.add('open');materials.setAttribute('aria-hidden','false');document.body.classList.add('canvas-open')});close.addEventListener('click',()=>{materials.classList.remove('open');materials.setAttribute('aria-hidden','true');document.body.classList.remove('canvas-open')});materials.addEventListener('click',e=>{if(e.target===materials)close.click()})}const materialData={wood:[['بلوط طبیعی','https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=700&q=80'],['گردو','https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=700&q=80'],['راش','https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=700&q=80'],['ونگه','https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80']],color:[['سبز مرگن','#173b32'],['سبز تیره','#0b1713'],['زغالی','#171b19'],['کرم گرم','#c9bca7'],['سفید گرم','#eee9df'],['قهوه‌ای گردویی','#4b3628']],vacuum:[['روکش چوب','https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=700&q=80'],['مات سنگ','https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=700&q=80'],['طرح مرمر','https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=700&q=80'],['طرح بتن','https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=700&q=80']],fabric:[['Linen 01','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=80'],['Boucle 02','https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=700&q=80'],['Velvet 03','https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=700&q=80'],['Texture 04','https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=700&q=80']]};function renderMaterial(type){if(!grid)return;grid.innerHTML=materialData[type].map(x=>type==='color'?`<button class="mm-swatch"><span style="background:${x[1]}"></span><b>${x[0]}</b></button>`:`<button class="mm-sample"><img src="${x[1]}" alt="${x[0]}"><b>${x[0]}</b></button>`).join('')}document.querySelectorAll('.mm-tab').forEach(t=>t.addEventListener('click',()=>{document.querySelectorAll('.mm-tab').forEach(x=>x.classList.remove('active'));t.classList.add('active');renderMaterial(t.dataset.material)}));renderMaterial('wood');const support=document.getElementById('supportButton'),panel=document.getElementById('supportPanel'),sc=document.getElementById('supportClose');function toggleSupport(v){panel.classList.toggle('open',v);panel.setAttribute('aria-hidden',String(!v))}support&&support.addEventListener('click',()=>toggleSupport(!panel.classList.contains('open')));sc&&sc.addEventListener('click',()=>toggleSupport(false));document.addEventListener('click',e=>{if(panel&&panel.classList.contains('open')&&!panel.contains(e.target)&&!support.contains(e.target))toggleSupport(false)});document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(materials&&materials.classList.contains('open'))close.click();if(panel&&panel.classList.contains('open'))toggleSupport(false)}})})();
