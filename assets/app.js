/* =============================================================
   navTo — NOTA: non usare "scrollTo" perche' collide con
   window.scrollTo(x,y) nativo; nei handler inline il browser
   risolve sempre la versione globale ignorando quella custom.
   ============================================================= */
function navTo(id) {
  var el = document.getElementById(id);
  if (!el) return;
  var disclosure = el.querySelector('details');
  if (disclosure && (id === 'quiz' || id === 'pratiche')) disclosure.open = true;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* == MOBILE DRAWER == */
function toggleDrawer(e) {
  if (e) e.stopPropagation(); // impedisce il bubbling verso il document listener
  var drawer = document.getElementById('mobileDrawer');
  var burger = document.getElementById('hamburger');
  var isOpen = drawer.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  burger.setAttribute('aria-label', isOpen ? 'Chiudi menu' : 'Apri menu');
  document.body.style.overflow = isOpen ? 'hidden' : '';
  if (isOpen) drawer.querySelector('button').focus();
  else burger.focus({ preventScroll: true });
}

document.addEventListener('click', function(e) {
  var drawer = document.getElementById('mobileDrawer');
  var burger = document.getElementById('hamburger');
  if (!drawer || !drawer.classList.contains('open')) return;
  if (!drawer.contains(e.target) && !burger.contains(e.target)) {
    drawer.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Apri menu');
    document.body.style.overflow = '';
  }
});

/* chiude il drawer con ESC */
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Escape') return;
  var drawer = document.getElementById('mobileDrawer');
  if (drawer && drawer.classList.contains('open')) toggleDrawer();
});

/* == NAV ACTIVE STATE (scroll-based, piu' affidabile di IO per sezioni alte) == */
var NAV_TARGETS = ['schools', 'percorsi', 'quiz', 'eventi3', 'pratiche'];

function updateNavActive() {
  var scrollY = window.scrollY || window.pageYOffset;
  var navH    = 76;
  var best     = null;
  var bestDist = Infinity;

  NAV_TARGETS.forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var top  = el.getBoundingClientRect().top + scrollY - navH;
    var dist = Math.abs(scrollY - top);
    // considera "attiva" la sezione il cui inizio e' piu' vicino al top corrente
    if (scrollY >= top - 10 && dist < bestDist) {
      best = id;
      bestDist = dist;
    }
  });

  document.querySelectorAll('.nav-link[data-target]').forEach(function(link) {
    link.classList.toggle('active', link.dataset.target === best);
  });
}

window.addEventListener('scroll', updateNavActive, { passive: true });
updateNavActive();

/* == REVEAL ON SCROLL == */
/* fallback: se IntersectionObserver non c'e', mostra tutto subito */
if ('IntersectionObserver' in window) {
  var revealObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function(el) { revealObs.observe(el); });
} else {
  document.querySelectorAll('.reveal').forEach(function(el) { el.classList.add('visible'); });
}

/* == QUIZ == */
var quizStep   = 1;
var totalSteps = 5;
var answers    = {};

function selectOpt(el) {
  var step = el.closest('.quiz-step');
  if (!step) return;
  step.querySelectorAll('.quiz-opt').forEach(function(o) { o.classList.remove('selected'); o.setAttribute('aria-pressed', 'false'); });
  el.classList.add('selected');
  el.setAttribute('aria-pressed', 'true');
  answers[quizStep] = el.dataset.val;
  var nextBtn = step.querySelector('.quiz-btn.next');
  if (nextBtn) nextBtn.disabled = false;
}

function nextStep() {
  if (!answers[quizStep]) return;
  if (quizStep >= totalSteps) { showResult(); return; }
  var cur = document.querySelector('.quiz-step[data-step="' + quizStep + '"]');
  if (cur) cur.classList.remove('active');
  quizStep++;
  var nxt = document.querySelector('.quiz-step[data-step="' + quizStep + '"]');
  if (nxt) { nxt.classList.add('active'); nxt.querySelector('.quiz-q').focus({ preventScroll: true }); }
  document.getElementById('quizProgress').style.width = (quizStep / totalSteps * 100) + '%';
}

function prevStep() {
  if (quizStep <= 1) return;
  var cur = document.querySelector('.quiz-step[data-step="' + quizStep + '"]');
  if (cur) cur.classList.remove('active');
  quizStep--;
  var prv = document.querySelector('.quiz-step[data-step="' + quizStep + '"]');
  if (prv) { prv.classList.add('active'); prv.querySelector('.quiz-q').focus({ preventScroll: true }); }
  document.getElementById('quizProgress').style.width = (quizStep / totalSteps * 100) + '%';
}

function restartQuiz() {
  quizStep = 1;
  answers  = {};
  document.getElementById('quizResult').classList.remove('show');
  document.querySelectorAll('.quiz-opt').forEach(function(o) { o.classList.remove('selected'); o.setAttribute('aria-pressed', 'false'); });
  document.querySelectorAll('.quiz-btn.next').forEach(function(b) { b.disabled = true; });
  document.querySelectorAll('.quiz-step').forEach(function(s) { s.classList.remove('active'); });
  var first = document.querySelector('.quiz-step[data-step="1"]');
  if (first) { first.classList.add('active'); first.querySelector('.quiz-q').focus({ preventScroll: true }); }
  document.getElementById('quizProgress').style.width = '20%';
}

/* == SCHOOL FILTER ==
   NOTA: il selettore e' limitato a "#schools .filter-btn". Nella versione
   precedente usava ".filter-btn" globale e resettava anche i filtri di
   altre sezioni. */
/* Stato dei due filtri combinabili: la chip in alto e il menu degli indirizzi. */
var curFilter = 'all';
var curInd    = 'all';

function filterSchools(btn, filter) {
  document.querySelectorAll('#schools .filter-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  curFilter = filter;
  schoolPageLimit = schoolPageSize;
  applySchoolFilters();
}

function filterByInd(value) {
  curInd = value;
  schoolPageLimit = schoolPageSize;
  applySchoolFilters();
}

(function bindStaticHandlers() {
  document.querySelectorAll('#mainNav .nav-link[data-target], #mobileDrawer .nav-link[data-target], .hero-actions button[data-target], #mainNav .nav-cta[data-target]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      navTo(btn.dataset.target);
      if (btn.closest('#mobileDrawer')) toggleDrawer();
    });
  });
  var burger = document.getElementById('hamburger');
  if (burger) burger.addEventListener('click', toggleDrawer);
  document.querySelectorAll('#schools .filter-btn[data-filter]').forEach(function(btn) {
    btn.addEventListener('click', function() { filterSchools(btn, btn.dataset.filter); });
  });
  var ind = document.getElementById('indFilter');
  if (ind) ind.addEventListener('change', function() { filterByInd(ind.value); });
  var indReset = document.getElementById('indReset');
  if (indReset) indReset.addEventListener('click', function() { if (typeof resetSchoolFilters === 'function') resetSchoolFilters(); });
  var more = document.getElementById('moreSchools');
  if (more) more.addEventListener('click', function() { if (typeof showMoreSchools === 'function') showMoreSchools(); });
  document.querySelectorAll('.route-card button[data-explore]').forEach(function(btn) {
    btn.addEventListener('click', function() { if (typeof exploreType === 'function') exploreType(btn.dataset.explore); });
  });
  document.querySelectorAll('.quiz-opt').forEach(function(opt) {
    opt.addEventListener('click', function() { selectOpt(opt); });
  });
  document.querySelectorAll('.quiz-btn.next').forEach(function(btn) {
    btn.addEventListener('click', nextStep);
  });
  document.querySelectorAll('.quiz-btn.back').forEach(function(btn) {
    btn.addEventListener('click', prevStep);
  });
  document.querySelectorAll('.quiz-restart').forEach(function(btn) {
    btn.addEventListener('click', restartQuiz);
  });
})();
