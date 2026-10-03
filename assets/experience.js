'use strict';

/* Preferences stay on this device. Storage may be disabled; memory still works. */
var CHOICES_KEY = 'orientom.choices.v1';
var schoolIndex = [];
var choices = [];
var searchQuery = '';
var curArea = 'all';
var shortlistOnly = false;
var toastTimer;
var schoolPageSize = 6;
var schoolPageLimit = schoolPageSize;

function plain(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
function node(tag, className, content) {
  var el = document.createElement(tag);
  if (className) el.className = className;
  if (content !== undefined) el.textContent = content;
  return el;
}
function button(label, className, action) {
  var el = node('button', className, label);
  el.type = 'button';
  el.addEventListener('click', action);
  return el;
}
function choiceFor(id) {
  return choices.find(function(c) { return c.id === id; });
}
function storeChoices() {
  try { localStorage.setItem(CHOICES_KEY, JSON.stringify(choices)); } catch (e) { /* keep in memory */ }
}
function readChoices() {
  try {
    var saved = JSON.parse(localStorage.getItem(CHOICES_KEY) || '[]');
    if (!Array.isArray(saved)) return [];
    var ids = [];
    return saved.filter(function(c) {
      if (!c || typeof c.id !== 'string' || ids.indexOf(c.id) !== -1) return false;
      if (!schoolIndex.some(function(s) { return s.id === c.id; })) return false;
      ids.push(c.id);
      return true;
    }).slice(0, 3).map(function(c) {
      return { id: c.id, travel: typeof c.travel === 'string' ? c.travel.slice(0, 100) : '', note: typeof c.note === 'string' ? c.note.slice(0, 600) : '' };
    });
  } catch (e) { return []; }
}
function say(message) {
  var toast = document.getElementById('choiceToast');
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = setTimeout(function() { toast.hidden = true; }, 4200);
}
function toggleSaved(id) {
  var found = choiceFor(id);
  if (found) {
    choices = choices.filter(function(c) { return c.id !== id; });
    say('Scelta rimossa. Puoi salvarla di nuovo quando vuoi.');
  } else {
    if (choices.length >= 3) {
      say('Hai già tre scelte. Apri il confronto e togline una per fare spazio.');
      return;
    }
    choices.push({ id: id, travel: '', note: '' });
    say('Salvata! La trovi nel confronto delle tue scelte.');
  }
  storeChoices();
  refreshChoices();
  applySchoolFilters();
  var dialog = document.getElementById('compareDialog');
  if (dialog.open) {
    if (choices.length) {
      renderComparison();
      dialog.querySelector('.dialog-close').focus();
    } else {
      dialog.close();
      document.getElementById('schoolSearch').focus();
    }
  }
}
function refreshChoices() {
  schoolIndex.forEach(function(s) {
    var saved = !!choiceFor(s.id);
    s.saveButton.setAttribute('aria-pressed', String(saved));
    s.saveButton.textContent = saved ? '♥ Salvata' : '♡ Salva';
    s.saveButton.setAttribute('aria-label', (saved ? 'Rimuovi ' : 'Salva ') + s.name);
  });
  document.getElementById('compareDock').hidden = !choices.length;
  document.getElementById('choicesCount').textContent = choices.length + ' / 3 scelte salvate';
  document.getElementById('savedFilter').textContent = '♡ Le tue scelte (' + choices.length + ')';
}

/* Derive type/subject pairs from the published course labels in each card.
   Liceo + informatica must not match an institute's technical informatica course. */
function schoolCourses(card) {
  var patterns = {
    scientifico:/scientifico|scienze applicate/, classico:/classico/, linguistico:/linguistico/,
    scienzeumane:/scienze umane|economico.sociale|\bles\b/, artistico:/artistico/, sportivo:/sportiv/,
    economico:/\bafm\b|\brim\b|\bsia\b|tecnico economico|tecnico.*economico/,
    informatica:/informatica/, elettronica:/elettronica|elettrotecnica|automazione|impianti|elettrici|termoidraulici/,
    meccanica:/meccanica|meccatronica|meccanico|saldocarpentiere|riparazione veicoli/, chimica:/chimica|biotecnologie/,
    costruzioni:/costruzioni/, manutenzione:/manutenzione/, logistica:/logistica/,
    commerciale:/servizi commerciali|vendita|e-commerce/, turismo:/turismo|turistico/,
    sociosanitario:/sanita|assistenza sociale/, sanitarietecniche:/odontotecnico|ottico/,
    alberghiero:/enogastronomia|ospitalita|sala e vendita|ristorazione|cucina|panificazione|pasticceria|sala e bar/,
    grafica:/grafica|servizi culturali|spettacolo/, moda:/moda|tessile/,
    agrario:/agrari|agroaliment|agricoltura|rurale|gestione dell.ambiente|produzioni e trasform|vivaismo|verde/,
    benessere:/benessere|estetica|acconciatura/, iefp:/iefp|cnos-fap/
  };
  var pairs = [];
  if (card.dataset.type === 'cfp') pairs.push('cfp:iefp');
  var tags = card.querySelectorAll('.prog-tag');
  if (!tags.length) {
    (card.dataset.ind || '').split(' ').filter(Boolean).forEach(function(ind) { pairs.push(card.dataset.type + ':' + ind); });
  }
  tags.forEach(function(tag) {
    var text = plain(tag.textContent);
    var type = card.dataset.type === 'cfp' || /iefp|cnos-fap/.test(text) ? 'cfp'
      : /liceo|scientifico|scienze applicate|scienze umane|economico.sociale|\bles\b|linguistico|classico|artistico/.test(text) ? 'liceo'
      : /\bprof\b|professionale|servizi commerciali|sanita|assistenza sociale|servizi culturali|spettacolo|enogastronomia|ospitalita|odontotecnico|ottico|made in italy|manutenzione|sala e vendita/.test(text) ? 'professionale' : 'tecnico';
    Object.keys(patterns).forEach(function(ind) {
      if (patterns[ind].test(text)) pairs.push(type + ':' + ind);
    });
    /* Some labels are intentionally broad: keep the institute's known type. */
    if (text === 'biennio area comune') pairs.push(type + ':comune');
  });
  return pairs.filter(function(pair, i) { return pairs.indexOf(pair) === i; });
}

function initSchoolExperience() {
  var grid = document.getElementById('schoolsGrid');
  grid.querySelectorAll('.school-card').forEach(function(card) {
    var name = card.querySelector('.school-name').textContent.trim();
    var id = plain(name).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    var footer = card.querySelector('.school-footer');
    var primaryLink = card.querySelector('.official-school-link') || (footer && footer.querySelector('a'));
    var programs = Array.from(card.querySelectorAll('.prog-tag')).map(function(p) { return p.textContent.trim(); });
    if (!programs.length) programs = Array.from(card.querySelectorAll('.intl-item-name')).map(function(p) { return p.textContent.trim(); });
    var coursePairs = schoolCourses(card);
    var types = coursePairs.map(function(pair) { return pair.split(':')[0]; });
    types = types.filter(function(type, i) { return types.indexOf(type) === i; });
    var school = {
      id: id, card: card, name: name,
      city: card.querySelector('.school-city').textContent.trim().replace(/^📍\s*/, ''),
      programs: programs, types: types.length ? types : [card.dataset.type],
      programNodes: Array.from(card.querySelectorAll('.prog-tag')),
      href: primaryLink ? primaryLink.href : '', intl: card.dataset.intl === 'true',
      paritaria: card.dataset.paritaria === 'true',
      searchText: plain(card.textContent + ' ' + card.dataset.ind)
    };
    card.id = 'scuola-' + id;
    card.dataset.types = school.types.join(' ');
    card.dataset.coursePairs = coursePairs.join(' ');
    card.dataset.ind = Array.from(new Set((card.dataset.ind || '').split(' ').concat(coursePairs.map(function(pair) { return pair.split(':')[1]; })))).join(' ');
    var badges = card.querySelector('.school-badges');
    badges.replaceChildren();
    var typeNames = {liceo:'Liceo', tecnico:'Tecnico', professionale:'Professionale', cfp:'CFP / IeFP'};
    badges.appendChild(node('span', 'badge', school.types.map(function(type) { return typeNames[type]; }).join(' · ')));
    if (school.paritaria) badges.appendChild(node('span', 'badge', 'Paritaria'));
    var body = card.querySelector('.school-card-body');
    var details = node('details', 'school-details');
    details.appendChild(node('summary', '', 'Altri indirizzi'));
    Array.from(body.children).forEach(function(child) {
      if (!child.matches('.school-card-top, .school-programs, .school-official-links')) details.appendChild(child);
    });
    var extraPrograms = node('div', 'school-programs more-programs');
    Array.from(card.querySelectorAll('.school-programs .prog-tag')).slice(3).forEach(function(tag) { extraPrograms.appendChild(tag); });
    if (extraPrograms.children.length) details.appendChild(extraPrograms);
    var actions = node('div', 'school-actions');
    school.saveButton = button('♡ Salva', 'save-school', function() { toggleSaved(id); });
    school.saveButton.setAttribute('aria-pressed', 'false');
    actions.appendChild(school.saveButton);
    body.appendChild(actions);
    if (details.children.length > 1) body.appendChild(details);
    schoolIndex.push(school);
  });

  var filters = document.querySelector('#schools .filter-bar');
  var indBar = document.querySelector('#schools .ind-bar');
  var tools = node('div', 'school-tools');
  var searchRow = node('div', 'search-row');
  var searchBox = node('label', 'search-box');
  searchBox.appendChild(node('span', '', '⌕'));
  searchBox.firstChild.setAttribute('aria-hidden', 'true');
  searchBox.appendChild(node('span', 'screen-reader-only', 'Cerca una scuola, un comune o una materia'));
  var input = node('input');
  input.type = 'search';
  input.id = 'schoolSearch';
  input.placeholder = 'Una scuola, un comune, una materia…';
  input.autocomplete = 'off';
  input.addEventListener('input', function() { searchQuery = plain(input.value.trim()); schoolPageLimit = schoolPageSize; applySchoolFilters(); });
  searchBox.appendChild(input);
  searchRow.appendChild(searchBox);
  var savedFilter = button('♡ Le tue scelte (0)', 'saved-filter', function() {
    shortlistOnly = !shortlistOnly;
    schoolPageLimit = schoolPageSize;
    savedFilter.setAttribute('aria-pressed', String(shortlistOnly));
    applySchoolFilters();
  });
  savedFilter.id = 'savedFilter';
  savedFilter.setAttribute('aria-pressed', 'false');
  searchRow.appendChild(savedFilter);
  filters.before(tools);
  tools.appendChild(searchRow);
  tools.appendChild(filters);
  tools.appendChild(indBar);
  filters.querySelectorAll('[data-filter^="area-"]').forEach(function(b) { b.remove(); });
  var areaLabel = node('label', '', 'Zona');
  areaLabel.htmlFor = 'areaFilter';
  var areaSelect = node('select');
  areaSelect.id = 'areaFilter';
  [['all', 'Tutte le zone'], ['mi', 'Milano est / Martesana'], ['bg', 'Bergamasca / Dalmine'], ['cr', 'Cremasco']].forEach(function(option) {
    var item = node('option', '', option[1]);
    item.value = option[0];
    areaSelect.appendChild(item);
  });
  areaSelect.addEventListener('change', function() { curArea = areaSelect.value; schoolPageLimit = schoolPageSize; applySchoolFilters(); });
  indBar.insertBefore(areaLabel, document.getElementById('indCount'));
  indBar.insertBefore(areaSelect, document.getElementById('indCount'));
  document.getElementById('indCount').setAttribute('role', 'status');
  document.getElementById('indCount').setAttribute('aria-live', 'polite');
  filters.querySelectorAll('button').forEach(function(b) { b.setAttribute('aria-pressed', String(b.classList.contains('active'))); });
  choices = readChoices();
  refreshChoices();
  applySchoolFilters();
}

function matchesChip(card) {
  if (curFilter === 'all') return true;
  if (curFilter === 'intl') return card.dataset.intl === 'true';
  if (curFilter === 'paritaria') return card.dataset.paritaria === 'true';
  return (card.dataset.types || card.dataset.type || '').split(' ').indexOf(curFilter) !== -1;
}
function matchesInd(card) {
  if (curInd === 'all') return true;
  if (['liceo', 'tecnico', 'professionale', 'cfp'].indexOf(curFilter) !== -1) {
    return (card.dataset.coursePairs || '').split(' ').indexOf(curFilter + ':' + curInd) !== -1;
  }
  return (card.dataset.ind || '').split(' ').indexOf(curInd) !== -1;
}
function applySchoolFilters() {
  var visible = 0;
  var shown = 0;
  var terms = searchQuery.split(/\s+/).filter(Boolean);
  schoolIndex.forEach(function(s) {
    var show = matchesChip(s.card) && matchesInd(s.card)
      && (curArea === 'all' || s.card.dataset.area === curArea)
      && (!shortlistOnly || !!choiceFor(s.id))
      && terms.every(function(term) { return s.searchText.indexOf(term) !== -1; });
    if (show) visible++;
    var onPage = show && visible <= schoolPageLimit;
    s.card.classList.toggle('hidden', !onPage);
    if (onPage) { shown++; updateProgramPreview(s); }
  });
  var count = document.getElementById('indCount');
  if (count) count.textContent = visible + (visible === 1 ? ' scheda trovata' : ' schede trovate');
  document.getElementById('moreSchools').hidden = shown >= visible;
  document.getElementById('schoolPageCount').textContent = shown < visible ? shown + ' di ' + visible + ' scuole e centri' : '';
  var active = curFilter !== 'all' || curInd !== 'all' || curArea !== 'all' || !!searchQuery || shortlistOnly;
  document.getElementById('indReset').hidden = !active;
  document.querySelectorAll('#schools .filter-btn').forEach(function(b) {
    b.setAttribute('aria-pressed', String(b.dataset.filter === curFilter));
  });
  var empty = document.getElementById('schoolsEmpty');
  if (!visible && !empty) {
    empty = node('div', 'schools-empty', shortlistOnly && !choices.length
      ? 'La tua lista è ancora vuota. Esplora le schede e premi Salva su quelle che ti incuriosiscono.'
      : 'Nessuna scheda con questi filtri. Allarga la zona o prova un altro indirizzo.');
    empty.id = 'schoolsEmpty';
    empty.appendChild(button('Mostra tutte le schede →', 'empty-reset', resetSchoolFilters));
    document.getElementById('schoolsGrid').appendChild(empty);
  } else if (visible && empty) empty.remove();
}
function updateProgramPreview(school) {
  var family = ['liceo', 'tecnico', 'professionale', 'cfp'].indexOf(curFilter) !== -1 ? curFilter : '';
  var preferred = [], rest = [];
  school.programNodes.forEach(function(tag) {
    var pairs = schoolCourses({dataset:school.card.dataset, querySelectorAll:function() { return [tag]; }});
    var matches = pairs.some(function(pair) {
      var parts = pair.split(':');
      return (!family || parts[0] === family) && (curInd === 'all' || parts[1] === curInd);
    });
    (matches ? preferred : rest).push(tag);
  });
  var ordered = preferred.concat(rest);
  var main = school.card.querySelector('.school-card-body > .school-programs');
  var extra = school.card.querySelector('.more-programs');
  main.replaceChildren();
  if (extra) extra.replaceChildren();
  ordered.forEach(function(tag, i) { if (i < 3) main.appendChild(tag); else if (extra) extra.appendChild(tag); });
}
function resetSchoolFilters() {
  curFilter = 'all'; curInd = 'all'; curArea = 'all'; searchQuery = ''; shortlistOnly = false;
  schoolPageLimit = schoolPageSize;
  document.getElementById('indFilter').value = 'all';
  document.getElementById('areaFilter').value = 'all';
  document.getElementById('schoolSearch').value = '';
  document.getElementById('savedFilter').setAttribute('aria-pressed', 'false');
  document.querySelectorAll('#schools .filter-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.filter === 'all');
  });
  applySchoolFilters();
}
function showMoreSchools() {
  schoolPageLimit += schoolPageSize;
  applySchoolFilters();
}
function exploreType(type) {
  resetSchoolFilters();
  var target = document.querySelector('#schools .filter-btn[data-filter="' + type + '"]');
  if (target) filterSchools(target, type);
  navTo('schools');
}
function exploreInd(ind) {
  resetSchoolFilters();
  document.getElementById('indFilter').value = ind;
  filterByInd(ind);
  navTo('schools');
}

function initComparison() {
  var dock = node('div', 'compare-dock');
  dock.id = 'compareDock'; dock.hidden = true;
  var count = node('span'); count.id = 'choicesCount';
  dock.appendChild(count);
  dock.appendChild(button('Confronta ↗', '', function() {
    renderComparison();
    document.getElementById('compareDialog').showModal();
  }));
  var dialog = node('dialog', 'compare-dialog');
  dialog.id = 'compareDialog';
  dialog.setAttribute('aria-labelledby', 'compareTitle');
  dialog.setAttribute('aria-describedby', 'compareDescription');
  var header = node('div', 'compare-head');
  var intro = node('div');
  var title = node('h2', '', 'Le tue scelte, una accanto all’altra.'); title.id = 'compareTitle';
  var description = node('p', '', 'Guarda cosa cambia. Poi aggiungi ciò che scopri visitando le scuole.'); description.id = 'compareDescription';
  intro.appendChild(title); intro.appendChild(description); header.appendChild(intro);
  var close = button('×', 'dialog-close', function() { dialog.close(); });
  close.setAttribute('aria-label', 'Chiudi il confronto');
  header.appendChild(close); dialog.appendChild(header);
  var columns = node('div', 'compare-columns'); columns.id = 'compareColumns';
  dialog.appendChild(columns);
  dialog.appendChild(node('p', 'compare-note', 'Scelte e appunti si salvano solo qui, su questo dispositivo. Se il browser blocca il salvataggio, restano disponibili finché la pagina è aperta. Per costi, orari e corsi attivi controlla sempre il sito ufficiale.'));
  var toast = node('div', 'toast'); toast.id = 'choiceToast'; toast.hidden = true;
  toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(dock); document.body.appendChild(dialog); document.body.appendChild(toast);
}
function renderComparison() {
  var box = document.getElementById('compareColumns');
  box.replaceChildren();
  var typeNames = { liceo: 'Liceo', tecnico: 'Tecnico', professionale: 'Professionale', cfp: 'CFP / IeFP' };
  choices.forEach(function(choice) {
    var school = schoolIndex.find(function(s) { return s.id === choice.id; });
    if (!school) return;
    var article = node('article', 'compare-item');
    article.appendChild(node('h3', '', school.name));
    article.appendChild(node('p', '', school.city));
    var list = node('dl');
    [['Percorsi presenti', school.types.map(function(t) { return typeNames[t]; }).join(' · ')],
      ['Indirizzi nella scheda', school.programs.join(' · ') || 'Apri i dettagli per vedere i percorsi.'],
      ['Da controllare insieme ai tuoi', school.paritaria ? 'Retta, eventuali borse, libri e trasporti.' : 'Libri, trasporti, materiali ed eventuali contributi.']].forEach(function(row) {
      list.appendChild(node('dt', '', row[0])); list.appendChild(node('dd', '', row[1]));
    });
    article.appendChild(list);
    [['travel', 'Il viaggio: minuti, cambi, partenza', 'input', 'Es. 35 min, un cambio'],
      ['note', 'Cosa mi convince? Cosa voglio chiedere?', 'textarea', 'Le tue impressioni, dopo averla vista…']].forEach(function(field) {
      var label = node('label', '', field[1]);
      var input = node(field[2]); input.id = field[0] + '-' + school.id;
      input.maxLength = field[0] === 'travel' ? 100 : 600;
      input.placeholder = field[3]; input.value = choice[field[0]];
      label.htmlFor = input.id;
      input.addEventListener('input', function() { choice[field[0]] = input.value; storeChoices(); });
      article.appendChild(label); article.appendChild(input);
    });
    article.appendChild(button('Apri la scheda →', 'empty-reset', function() {
      document.getElementById('compareDialog').close();
      resetSchoolFilters();
      schoolPageLimit = schoolIndex.length;
      applySchoolFilters();
      var details = school.card.querySelector('.school-details');
      if (details) details.open = true;
      navTo(school.card.id);
      school.saveButton.focus({ preventScroll: true });
    }));
    article.appendChild(button('Rimuovi dalle mie scelte', 'compare-remove', function() { toggleSaved(school.id); }));
    box.appendChild(article);
  });
  if (choices.length < 3) box.appendChild(node('div', 'compare-empty', 'Un posto libero per una nuova idea. Salva un’altra scheda per confrontarla qui.'));
}

/* A conversation starter, not an aptitude test. Interests carry the most weight.
   Future plans never gate access to a course: all school diplomas allow further study. */
var QUIZ_PATHS = [
  { id:'science', ind:'scientifico', title:'Scienze e domande grandi', description:'Esplora scientifico e scienze applicate. Confronta matematica, fisica, scienze e la presenza del latino nei diversi percorsi.' },
  { id:'tech', ind:'informatica', title:'Tecnologia da costruire', description:'Esplora informatica e telecomunicazioni. Se ti incuriosiscono impianti o macchine, guarda anche elettronica e meccanica nel menu degli indirizzi.' },
  { id:'languages', ind:'linguistico', title:'Lingue, storie e culture', description:'Esplora il linguistico: lingue straniere, letteratura e culture. Per italiano, storia e mondo antico, guarda anche il classico.' },
  { id:'economy', ind:'economico', title:'Economia e idee che diventano progetti', description:'Esplora AFM: amministrazione, finanza e marketing. Confronta anche SIA, più legato all’informatica per le aziende, e RIM, alle relazioni internazionali.' },
  { id:'people', ind:'scienzeumane', title:'Capire le persone', description:'Esplora scienze umane ed economico-sociale. Confrontali anche con i professionali per la sanità e l’assistenza sociale: materie e obiettivi cambiano.' },
  { id:'creative', ind:'artistico', title:'Idee da disegnare e trasformare', description:'Esplora l’artistico. Guarda anche grafica e comunicazione: creare immagini e progettare sono attività presenti in percorsi diversi.' },
  { id:'hands', ind:'iefp', title:'Un mestiere da imparare sul campo', description:'Esplora i percorsi IeFP nei CFP e nelle scuole che li offrono. Confrontali con i professionali: durata e titolo finale sono diversi.' }
];
function calcResult() {
  var scores = {};
  QUIZ_PATHS.forEach(function(p) { scores[p.id] = 0; });
  function add(ids, weight) { ids.forEach(function(id) { scores[id] += weight; }); }
  var interests = { scienze:['science','tech'], lingue:['languages'], economia:['economy'], umano:['people'] };
  add(interests[answers[3]] || [], 5);
  var learning = { teoria:['science','languages','people'], pratica:['hands','tech'], mix:['tech','economy','people'], arte:['creative'] };
  add(learning[answers[1]] || [], answers[1] === 'arte' ? 6 : 2);
  var curiosity = { curioso:['science','tech'], creativo:['creative','tech'], pratico:['hands','tech','economy'], sociale:['people'] };
  add(curiosity[answers[5]] || [], 2);
  if (answers[2] === 'intl-high') add(['languages','economy'], 1);
  /* No bonus for undecided: uncertainty isn't an aptitude. */
  if (answers[4] === 'lavoro') add(['hands','tech','economy'], 1);
  if (answers[4] === 'its') add(['tech','economy'], 1);
  return QUIZ_PATHS.map(function(p, i) { return { path:p, score:scores[p.id], order:i }; })
    .sort(function(a,b) { return b.score - a.score || a.order - b.order; }).slice(0,3).map(function(p) { return p.path; });
}
function showResult() {
  document.querySelectorAll('.quiz-step').forEach(function(s) { s.classList.remove('active'); });
  document.getElementById('quizProgress').style.width = '100%';
  document.getElementById('resultEmoji').textContent = '↗';
  var badge = document.getElementById('resultType'); badge.textContent = 'Il tuo punto di partenza'; badge.className = 'result-type badge';
  document.getElementById('resultTitle').textContent = 'Tre piste da esplorare.';
  document.getElementById('resultDesc').textContent = 'Partono dai tuoi interessi e da come ti piace imparare. Non misurano quanto sei bravo e non decidono per te. Anche le altre strade restano aperte.';
  var box = document.getElementById('resultSchools'); box.replaceChildren();
  calcResult().forEach(function(path) {
    var article = node('article', 'result-path');
    article.appendChild(node('h3', '', path.title));
    article.appendChild(node('p', '', path.description));
    article.appendChild(button('Guarda le schede di questa pista →', '', function() { exploreInd(path.ind); }));
    box.appendChild(article);
  });
  box.appendChild(node('p', 'result-reason', 'Come funziona: contano soprattutto l’area che ti incuriosisce e le attività che preferisci. Il quiz usa regole semplici; non è un test psicologico validato.'));
  document.getElementById('quizResult').classList.add('show');
  var title = document.getElementById('resultTitle'); title.tabIndex = -1; title.focus({ preventScroll:true });
}

function initQuizAccessibility() {
  document.querySelectorAll('.quiz-opt').forEach(function(opt) { opt.setAttribute('aria-pressed', 'false'); });
  document.querySelectorAll('.quiz-q').forEach(function(q) { q.tabIndex = -1; });
  document.querySelectorAll('.quiz-counter').forEach(function(counter) { counter.setAttribute('aria-live', 'polite'); });
}

initComparison();
initSchoolExperience();
initQuizAccessibility();

/* Keep keyboard navigation inside the expanded menu until it closes. */
document.addEventListener('keydown', function(event) {
  var drawer = document.getElementById('mobileDrawer');
  if (event.key !== 'Tab' || !drawer.classList.contains('open')) return;
  var burger = document.getElementById('hamburger');
  var items = Array.from(drawer.querySelectorAll('button'));
  if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); burger.focus(); }
  else if (!event.shiftKey && document.activeElement === items[items.length - 1]) { event.preventDefault(); burger.focus(); }
  else if (document.activeElement === burger) { event.preventDefault(); (event.shiftKey ? items[items.length - 1] : items[0]).focus(); }
});
