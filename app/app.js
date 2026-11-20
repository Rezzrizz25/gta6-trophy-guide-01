// GTA 6 Trophy Guide & Tracker — offline, ES module, no network requests at runtime.
// Progress is saved in localStorage; export/import moves it as JSON.
const KEY = 'gta6-trophy-guide-progress-v1';
const params = new URLSearchParams(location.search);
const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));

// --- state ---------------------------------------------------------------
let earned = new Set();
try { earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]')); } catch { earned = new Set(); }
earned = new Set([...earned].filter((id) => byId.has(id)));
let selectedId = null;

// Demo seed (?seed=N): seeds N earned trophies in memory only — never written
// to localStorage, so real saved progress is never corrupted. Documented in README.
const seedN = Number(params.get('seed') ?? 0);
if (Number.isInteger(seedN) && seedN > 0) {
  earned = new Set(trophies.slice(0, Math.min(seedN, trophies.length)).map((t) => t.id));
}

function save() {
  if (seedN > 0) return; // demo seed must not overwrite real progress
  localStorage.setItem(KEY, JSON.stringify([...earned]));
}

// --- elements ------------------------------------------------------------
const $ = (id) => document.getElementById(id);
const listEl = $('trophyList');
const detailEl = $('detail');
const searchEl = $('search');
const gradeEl = $('filterGrade');
const kindEl = $('filterKind');
const statusEl = $('filterStatus');
const missableEl = $('filterMissable');
const hideEarnedEl = $('filterHideEarned');
const spoilerEl = $('spoilerToggle');

const GRADE_LABEL = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };
const KIND_LABEL = { story: 'Story', collectibles: 'Collectibles', activities: 'Activities', side: 'Side', misc: 'Misc' };

function isHidden(t) {
  // Spoiler setting hides the name + description of story/hidden trophies until earned.
  return spoilerEl.checked && t.hidden && !earned.has(t.id);
}

function displayName(t) {
  return isHidden(t) ? 'Hidden story trophy — earn it to reveal' : t.name;
}
function displayDesc(t) {
  return isHidden(t) ? 'Hidden on PSN. Earn it to reveal the description.' : t.description;
}

function filtered() {
  const q = searchEl.value.trim().toLowerCase();
  return trophies.filter((t) => {
    if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
    if (kindEl.value !== 'all' && t.kind !== kindEl.value) return false;
    if (statusEl.value === 'earned' && !earned.has(t.id)) return false;
    if (statusEl.value === 'unearned' && earned.has(t.id)) return false;
    if (missableEl.checked && !t.missable) return false;
    if (hideEarnedEl.checked && earned.has(t.id)) return false;
    if (q) {
      const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function renderProgress() {
  const total = trophies.length;
  const n = earned.size;
  $('earnedCount').textContent = `${n} / ${total}`;
  $('earnedPct').textContent = `${Math.round((n / total) * 100)}%`;
  $('progressBar').style.width = `${(n / total) * 100}%`;
  $('gradeCounts').innerHTML = Object.keys(GRADE_LABEL).map((g) => {
    const got = trophies.filter((t) => t.grade === g && earned.has(t.id)).length;
    const tot = trophies.filter((t) => t.grade === g).length;
    return `<span><b>${GRADE_LABEL[g]}</b> ${got}/${tot}</span>`;
  }).join('');
}

function renderList() {
  const items = filtered();
  $('resultCount').textContent = `Showing ${items.length} of ${trophies.length} trophies.`;
  listEl.replaceChildren();
  for (const t of items) {
    const li = document.createElement('li');
    li.className = 'trophy' + (earned.has(t.id) ? ' earned' : '') + (selectedId === t.id ? ' selected' : '');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', `Mark ${t.name} as earned`);
    box.addEventListener('click', (e) => e.stopPropagation());
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id); else earned.delete(t.id);
      save();
      renderProgress();
      renderList();
      if (selectedId === t.id) renderDetail();
    });
    const body = document.createElement('div');
    body.className = 'body';
    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = displayName(t);
    const desc = document.createElement('div');
    desc.className = 'desc';
    desc.textContent = displayDesc(t);
    const meta = document.createElement('div');
    meta.className = 'meta';
    const badge = document.createElement('span');
    badge.className = `badge ${t.grade}`;
    badge.textContent = GRADE_LABEL[t.grade];
    meta.append(badge);
    const kind = document.createElement('span');
    kind.className = 'tag';
    kind.textContent = KIND_LABEL[t.kind] ?? t.kind;
    meta.append(kind);
    if (t.target != null) {
      const tg = document.createElement('span');
      tg.className = 'tag';
      tg.textContent = `Target: ${t.target.toLocaleString('en-US')}`;
      meta.append(tg);
    }
    if (t.missable) {
      const m = document.createElement('span');
      m.className = 'tag missable';
      m.textContent = 'Potentially missable';
      meta.append(m);
    }
    const stage = document.createElement('span');
    stage.className = 'tag';
    stage.textContent = `Stage ${t.stage}`;
    meta.append(stage);
    body.append(name, desc, meta);
    li.append(box, body);
    li.addEventListener('click', () => {
      selectedId = t.id;
      renderList();
      renderDetail();
      history.replaceState(null, '', `?view=checklist&trophy=${t.id}`);
    });
    listEl.append(li);
  }
}

function renderDetail() {
  const t = byId.get(selectedId);
  if (!t) {
    detailEl.innerHTML = '<p class="detail-empty">Select a trophy to read its full guide.</p>';
    return;
  }
  detailEl.replaceChildren();
  const h = document.createElement('h2');
  h.textContent = displayName(t);
  const badge = document.createElement('span');
  badge.className = `badge ${t.grade}`;
  badge.textContent = GRADE_LABEL[t.grade];
  const desc = document.createElement('p');
  desc.className = 'desc';
  desc.textContent = displayDesc(t);
  const facts = document.createElement('p');
  facts.className = 'facts';
  facts.innerHTML = '';
  const parts = [`Kind: <b>${KIND_LABEL[t.kind] ?? t.kind}</b>`, `Stage: <b>${t.stage}</b>`];
  if (t.target != null) parts.push(`PSN target: <b>${t.target.toLocaleString('en-US')}</b>`);
  parts.push(t.missable
    ? '<b>Potentially missable</b> — see the Missables view'
    : 'Not missable — safe in free-roam after the story');
  facts.innerHTML = parts.join('<br>');
  const guide = document.createElement('p');
  guide.className = 'guide';
  guide.textContent = isHidden(t)
    ? 'This trophy is hidden on PSN. Earn it in-game (or untick “Hide story spoilers” above) to read the full guide.'
    : t.guide;
  const srcTitle = document.createElement('h3');
  srcTitle.textContent = 'Sources';
  const srcs = document.createElement('ul');
  srcs.className = 'srcs';
  for (const s of t.sources) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = s.name;
    li.append(a);
    srcs.append(li);
  }
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'earned-state';
  toggle.textContent = earned.has(t.id) ? 'Mark as unearned' : 'Mark as earned';
  toggle.addEventListener('click', () => {
    if (earned.has(t.id)) earned.delete(t.id); else earned.add(t.id);
    save();
    renderProgress();
    renderList();
    renderDetail();
  });
  detailEl.append(h, badge, desc, facts, guide, srcTitle, srcs, toggle);
}

function renderSources() {
  const ul = $('sourceList');
  ul.replaceChildren();
  for (const s of doc.sources) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = s.name;
    li.append(a, document.createTextNode(` — ${s.url}`));
    ul.append(li);
  }
}

// --- views ----------------------------------------------------------------
const VIEWS = ['checklist', 'roadmap', 'missables', 'sources'];
function showView(view) {
  if (!VIEWS.includes(view)) view = 'checklist';
  for (const v of VIEWS) {
    $(`view-${v}`).hidden = v !== view;
    document.querySelector(`.tab[data-view="${v}"]`).classList.toggle('active', v === view);
  }
  const u = new URLSearchParams(location.search);
  u.set('view', view);
  if (view !== 'checklist') u.delete('trophy');
  history.replaceState(null, '', `?${u}`);
}
for (const tab of document.querySelectorAll('.tab')) {
  tab.addEventListener('click', () => showView(tab.dataset.view));
}

// --- toolbar ---------------------------------------------------------------
for (const el of [searchEl, gradeEl, kindEl, statusEl, missableEl, hideEarnedEl, spoilerEl]) {
  el.addEventListener('input', () => { renderList(); if (selectedId) renderDetail(); });
}

// --- export / import / reset ----------------------------------------------
$('exportBtn').addEventListener('click', () => {
  const payload = { game: 'Grand Theft Auto VI', exported: new Date().toISOString(), earned: [...earned].sort((a, b) => a - b) };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
$('importBtn').addEventListener('click', () => $('importFile').click());
$('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(ids)) throw new Error('no earned list');
    earned = new Set(ids.filter((id) => byId.has(id)));
    save();
    renderProgress();
    renderList();
    if (selectedId) renderDetail();
    $('saveNote').textContent = `Imported ${earned.size} earned trophies.`;
  } catch {
    $('saveNote').textContent = 'Import failed — that file is not a valid progress export.';
  }
  e.target.value = '';
});
$('resetBtn').addEventListener('click', () => {
  if (!confirm('Reset all progress? This clears every earned trophy.')) return;
  earned = new Set();
  save();
  renderProgress();
  renderList();
  if (selectedId) renderDetail();
});

// --- init from URL ----------------------------------------------------------
renderProgress();
renderList();
renderSources();
const startView = params.get('view') ?? 'checklist';
showView(startView);
const startTrophy = Number(params.get('trophy') ?? 0);
if (byId.has(startTrophy)) {
  selectedId = startTrophy;
  renderList();
  renderDetail();
}
