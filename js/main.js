/* =====================================================
   POUSADA VALE DAS ÁGUAS — JS
   ===================================================== */

/* ---- NAV: scroll + hamburger + hero logo ---- */
(function () {
  const nav         = document.getElementById('nav');
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const navLogoWrap = document.getElementById('navLogoWrap');
  const hero        = document.getElementById('hero');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 80);
    if (navLogoWrap && hero) {
      const heroBottom = hero.getBoundingClientRect().bottom;
      const pastHero   = heroBottom <= 0;
      navLogoWrap.style.opacity       = pastHero ? '0' : '1';
      navLogoWrap.style.pointerEvents = pastHero ? 'none' : '';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();


/* ---- HERO SLIDESHOW ---- */
(function () {
  const slides  = Array.from(document.querySelectorAll('.hero-slide'));
  const dotsEl  = document.getElementById('heroDots');
  const btnPrev = document.getElementById('heroPrev');
  const btnNext = document.getElementById('heroNext');
  if (!slides.length) return;

  let current = 0, timer;

  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'hero-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Slide ${i + 1}`);
    d.addEventListener('click', () => { stopTimer(); goTo(i); startTimer(); });
    dotsEl.appendChild(d);
  });

  const getDots = () => Array.from(dotsEl.querySelectorAll('.hero-dot'));

  function goTo(idx) {
    const prevVideo = slides[current].querySelector('video');
    if (prevVideo) prevVideo.pause();
    slides[current].classList.remove('active');
    getDots()[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    getDots()[current].classList.add('active');
    const currVideo = slides[current].querySelector('video');
    if (currVideo) currVideo.play();
  }

  slides[0].classList.add('active');
  const startTimer = () => { timer = setInterval(() => goTo(current + 1), 5500); };
  const stopTimer  = () => clearInterval(timer);

  btnPrev.addEventListener('click', () => { stopTimer(); goTo(current - 1); startTimer(); });
  btnNext.addEventListener('click', () => { stopTimer(); goTo(current + 1); startTimer(); });

  const track = document.querySelector('.hero-track');
  if (track) {
    let tx = 0;
    track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 50) { stopTimer(); goTo(current + (dx < 0 ? 1 : -1)); startTimer(); }
    });
  }
  startTimer();
})();


/* ---- BOTÃO RESERVA (WhatsApp) ---- */
(function () {
  document.getElementById('rbBtn')?.addEventListener('click', () => {
    const ci   = document.getElementById('rbCheckin')?.value  || 'não definido';
    const co   = document.getElementById('rbCheckout')?.value || 'não definido';
    const hosp = document.getElementById('rbHospedes')?.value || '2';
    const msg  = encodeURIComponent(
      `Olá! Gostaria de verificar disponibilidade na Pousada Vale das Águas.\n` +
      `Check-in: ${ci}\nCheck-out: ${co}\nHóspedes: ${hosp}`
    );
    window.open(`https://wa.me/5524993340530?text=${msg}`, '_blank');
  });
})();


/* ---- REVEAL ---- */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => obs.observe(el));
})();


/* ---- ACOMODAÇÕES carrossel ---- */
(function () {
  const slider  = document.getElementById('acomSlider');
  const dotsEl  = document.getElementById('acomDots');
  const btnPrev = document.getElementById('acomPrev');
  const btnNext = document.getElementById('acomNext');
  if (!slider) return;

  const cards = Array.from(slider.querySelectorAll('.acom-card'));
  let perView = getPerView(), current = 0, total;

  function getPerView() {
    return window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
  }

  function buildDots() {
    dotsEl.innerHTML = '';
    total = Math.ceil(cards.length / perView);
    for (let i = 0; i < total; i++) {
      const d = document.createElement('button');
      d.className = 'acom-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(d);
    }
  }

  function getDots() { return Array.from(dotsEl.querySelectorAll('.acom-dot')); }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, total - 1));
    const gap = 24;
    const cardW = cards[0].offsetWidth + gap;
    slider.style.transform = `translateX(-${current * cardW * perView}px)`;
    getDots().forEach((d, i) => d.classList.toggle('active', i === current));
  }

  buildDots(); goTo(0);
  btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext.addEventListener('click', () => goTo(current + 1));

  window.addEventListener('resize', () => {
    const pv = getPerView();
    if (pv !== perView) { perView = pv; buildDots(); goTo(0); }
  });

  let tx = 0;
  slider.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
  });
})();


/* ---- GALERIA tabs ---- */
(function () {
  const tabs   = document.querySelectorAll('.gal-tab');
  const panels = document.querySelectorAll('.gal-panel');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('gal-' + tab.dataset.gal)?.classList.add('active');
    });
  });
})();


/* ---- GALERIA lightbox ---- */
(function () {
  const lb      = document.getElementById('lb');
  const lbImg   = document.getElementById('lbImg');
  const lbCap   = document.getElementById('lbCap');
  const lbClose = document.getElementById('lbClose');
  const lbPrev  = document.getElementById('lbPrev');
  const lbNext  = document.getElementById('lbNext');
  if (!lb) return;

  let items = [], current = 0;

  function open(idx) {
    items = Array.from(document.querySelector('.gal-panel.active')?.querySelectorAll('.gal-item') || []);
    current = (idx + items.length) % items.length;
    lbImg.src = items[current].dataset.src;
    lbCap.textContent = items[current].dataset.cap || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  }

  document.querySelectorAll('.gal-panel').forEach(panel => {
    panel.addEventListener('click', e => {
      const item = e.target.closest('.gal-item');
      if (!item) return;
      open(Array.from(panel.querySelectorAll('.gal-item')).indexOf(item));
    });
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click',  () => open(current - 1));
  lbNext.addEventListener('click',  () => open(current + 1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  open(current - 1);
    if (e.key === 'ArrowRight') open(current + 1);
  });
})();


/* ---- DEPOIMENTOS carrossel + formulário (Supabase) ---- */
(function () {
  /* ==============================================================
     CONFIGURAÇÃO SUPABASE
     Substitua os valores abaixo após criar o projeto no Supabase.
     Veja as instruções em: SUPABASE_SETUP.md
  ============================================================== */
  const SUPABASE_URL    = 'https://gayzlnseqauonjrduycq.supabase.co';
  const SUPABASE_ANON   = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdheXpsbnNlcWF1b25qcmR1eWNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NDI3NjIsImV4cCI6MjA5MzAxODc2Mn0.Q9uWBVO6nj3XiAdaLVarA2lGmO_QGTKqmRTnm64JIUY';
  /* ============================================================== */

  const slider  = document.getElementById('depSlider');
  const dotsEl  = document.getElementById('depDots');
  const btnPrev = document.getElementById('depPrev');
  const btnNext = document.getElementById('depNext');
  const form    = document.getElementById('depForm');
  if (!slider) return;

  const supabaseConfigured = SUPABASE_URL !== 'COLE_AQUI_A_URL_DO_PROJETO';
  const db = supabaseConfigured
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON)
    : null;

  let current = 0;
  let pairs   = [];

  /* ---- card DOM ---- */
  function makeCard(dep) {
    const c = document.createElement('div');
    c.className = 'dep-card';
    c.innerHTML =
      `<div class="dep-quote"><i class="fas fa-quote-left"></i></div>` +
      `<p>"${dep.texto}"</p>` +
      `<div class="dep-autor">— ${dep.nome}</div>`;
    return c;
  }

  /* ---- carousel ---- */
  const getDots = () => Array.from(dotsEl.querySelectorAll('.dep-dot'));

  function goTo(idx) {
    current = (idx + pairs.length) % pairs.length;
    slider.style.transform = `translateX(-${current * 100}%)`;
    getDots().forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function buildCarousel() {
    pairs = Array.from(slider.querySelectorAll('.dep-pair'));
    current = 0;
    dotsEl.innerHTML = '';
    pairs.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'dep-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(d);
    });
    slider.style.transform = 'translateX(0)';
  }

  btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext.addEventListener('click', () => goTo(current + 1));

  let tx = 0;
  slider.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
  });

  /* ---- carrega depoimentos do Supabase ---- */
  async function loadUserDeps() {
    slider.querySelectorAll('.dep-pair--user').forEach(p => p.remove());

    let saved = [];
    if (db) {
      const { data } = await db
        .from('depoimentos')
        .select('nome, texto')
        .order('created_at', { ascending: true });
      saved = data || [];
    }

    for (let i = 0; i < saved.length; i += 2) {
      const pair = document.createElement('div');
      pair.className = 'dep-pair dep-pair--user';
      pair.appendChild(makeCard(saved[i]));
      if (saved[i + 1]) pair.appendChild(makeCard(saved[i + 1]));
      slider.appendChild(pair);
    }
    buildCarousel();
  }

  /* ---- formulário ---- */
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const nome  = document.getElementById('depNome').value.trim();
      const texto = document.getElementById('depTexto').value.trim();
      if (!nome || !texto) return;

      const btn = form.querySelector('.dep-form-btn');
      btn.disabled = true;

      if (db) {
        const { error } = await db.from('depoimentos').insert({ nome, texto });
        if (error) {
          showToast('Erro ao enviar. Tente novamente.');
          btn.disabled = false;
          return;
        }
      }

      await loadUserDeps();
      form.reset();
      btn.disabled = false;
      showToast('Depoimento enviado! Obrigado pela sua avaliação 😊');
    });
  }

  loadUserDeps();
})();


/* ---- TOAST ---- */
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}


/* ---- FORMULÁRIO CONTATO ---- */
(function () {
  const form = document.getElementById('formContato');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-btn');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.disabled = false;
      form.reset();
      showToast('Mensagem enviada! Entraremos em contato em breve.');
    }, 1200);
  });
})();


