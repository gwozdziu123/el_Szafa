/* el_Szafa — rdzeń: rejestr biblioteki, narzędzia, stan aplikacji, historia i zapis. */
(function () {
  'use strict';
  const E = (window.ElSzafa = window.ElSzafa || {});

  /* ---------- Rejestr biblioteki ---------- */
  E.lib = { libraries: [], items: new Map(), enclosures: [], errors: [] };

  E.registerLibrary = function (lib) {
    if (!lib || !lib.id || !Array.isArray(lib.items)) { E.lib.errors.push('Nieprawidłowy plik biblioteki'); return; }
    const resolved = { ...lib, items: [] };
    lib.items.forEach((it, idx) => {
      if (!it.id || !it.width) return;
      if (E.lib.items.has(it.id)) { E.lib.errors.push('Powtórzony identyfikator: ' + it.id); return; }
      const item = {
        ...it,
        order: E.lib.items.size,
        libId: lib.id,
        libName: lib.name,
        manufacturer: it.manufacturer || lib.manufacturer || '',
        series: it.series || lib.series || '',
        visual: it.visual || lib.visual || 'generic',
        kind: it.kind || lib.visual || 'generic',
        prefix: it.prefix || lib.prefix || 'X',
        color: { ...(lib.color || {}), ...(it.color || {}) },
        group: it.group || 'Inne',
        face: it.face || { label: it.type || '', sub: '' },
        specs: it.specs || {},
        poles: it.poles || 1,
        width: Number(it.width)
      };
      E.lib.items.set(item.id, item);
      resolved.items.push(item);
    });
    E.lib.libraries.push(resolved);
  };

  E.registerEnclosures = function (list) {
    (list || []).forEach(e => { if (e && e.rows && e.modules) E.lib.enclosures.push({ ...e }); });
  };

  /* Ładowanie plików biblioteki zwykłymi tagami <script> – działa też z dysku (file://). */
  E.loadLibraries = function () {
    const files = (self.EL_SZAFA_LIBRARY_FILES || []).slice();
    return files.reduce((p, f) => p.then(() => new Promise(res => {
      const s = document.createElement('script');
      s.src = 'library/' + f;
      s.onload = () => res();
      s.onerror = () => { E.lib.errors.push('Nie udało się wczytać pliku library/' + f); res(); };
      document.head.appendChild(s);
    })), Promise.resolve());
  };

  E.item = id => E.lib.items.get(id) || null;

  /* ---------- Narzędzia ---------- */
  E.uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
  E.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  E.fmtDate = ts => { const d = new Date(ts); const p = n => String(n).padStart(2, '0'); return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`; };
  E.plural = (n, one, few, many) => {
    if (n === 1) return one;
    const d = n % 10, t = n % 100;
    return (d >= 2 && d <= 4 && (t < 12 || t > 14)) ? few : many;
  };
  E.modWord = n => `${n} ${E.plural(n, 'moduł', 'moduły', 'modułów')}`;
  E.debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  E.clone = o => JSON.parse(JSON.stringify(o));

  /* ---------- Zapis w przeglądarce ---------- */
  const KEY_INDEX = 'elSzafa.projects';
  const KEY_PROJECT = id => 'elSzafa.project.' + id;
  const KEY_LAST = 'elSzafa.last';
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* brak dostępu */ } }
  };
  E.storage = {
    list() { try { return JSON.parse(store.get(KEY_INDEX) || '[]'); } catch (e) { return []; } },
    saveIndex(list) { store.set(KEY_INDEX, JSON.stringify(list)); },
    load(id) { try { return JSON.parse(store.get(KEY_PROJECT(id)) || 'null'); } catch (e) { return null; } },
    save(p) {
      const ok = store.set(KEY_PROJECT(p.id), JSON.stringify(p));
      const list = E.storage.list().filter(x => x.id !== p.id);
      list.unshift(E.storage.meta(p));
      E.storage.saveIndex(list);
      store.set(KEY_LAST, p.id);
      return ok;
    },
    remove(id) {
      store.del(KEY_PROJECT(id));
      E.storage.saveIndex(E.storage.list().filter(x => x.id !== id));
    },
    last() { return store.get(KEY_LAST); },
    meta(p) {
      const placed = p.rows.reduce((n, r) => n + r.length, 0) + p.parking.length;
      return { id: p.id, name: p.name, updated: p.updated, count: placed, size: `${p.enclosure.rows} × ${p.enclosure.modules}` };
    }
  };

  /* ---------- Projekt ---------- */
  E.newProject = function (name) {
    const now = Date.now();
    return {
      app: 'el_Szafa', version: 1,
      id: E.uid(), name: name || 'Nowa rozdzielnica', client: '', notes: '',
      created: now, updated: now,
      enclosure: { presetId: '3x18', rows: 3, modules: 18 },
      reserve: 20,
      rows: [[], [], []],
      parking: []
    };
  };

  E.normalizeProject = function (p) {
    if (!p || typeof p !== 'object' || !p.enclosure || !Array.isArray(p.rows)) return null;
    const out = { ...E.newProject(), ...p };
    out.enclosure = { presetId: p.enclosure.presetId || null, rows: Math.max(1, +p.enclosure.rows || 1), modules: Math.max(1, +p.enclosure.modules || 12) };
    // szerokość z biblioteki ma pierwszeństwo (np. po poprawce w pliku biblioteki)
    const width = m => (E.item(m.itemId) || {}).width || +m.w || 1;
    out.rows = Array.from({ length: out.enclosure.rows }, (_, i) => (p.rows[i] || []).map(m => ({ ...m, uid: m.uid || E.uid(), w: width(m), pos: +m.pos || 0 })));
    out.parking = (p.parking || []).map(m => ({ ...m, uid: m.uid || E.uid(), w: width(m) }));
    // moduły z rzędów, które nie istnieją, trafiają do „Poza szafą”
    (p.rows.slice(out.enclosure.rows) || []).forEach(r => r.forEach(m => out.parking.push({ ...m, uid: m.uid || E.uid() })));
    if (E.reflow) E.reflow(out);   // aparaty, które po zmianie szerokości zachodzą na siebie, trafiają w wolne miejsce
    return out;
  };

  /* ---------- Stan i historia ---------- */
  const S = (E.state = {
    project: null,
    selected: null,      // uid zaznaczonego modułu
    target: null,        // {row, pos} wybrane wolne miejsce
    view: 'cabinet',     // cabinet | bom (komputer)
    tab: 'cabinet',      // cabinet | library | bom | project (telefon)
    zoom: null,          // px na moduł; null = dopasuj
    undo: [], redo: []
  });

  const persist = E.debounce(() => { if (S.project) E.storage.save(S.project); }, 300);

  E.snapshot = function () {
    S.undo.push(JSON.stringify(S.project));
    if (S.undo.length > 100) S.undo.shift();
    S.redo = [];
  };

  /* Zmiana projektu z zapisem w historii. fn otrzymuje projekt i może zwrócić false, by anulować. */
  E.commit = function (fn, opts) {
    opts = opts || {};
    const before = JSON.stringify(S.project);
    const res = fn(S.project);
    if (res === false) { S.project = JSON.parse(before); return false; }
    if (opts.history !== false) { S.undo.push(before); if (S.undo.length > 100) S.undo.shift(); S.redo = []; }
    S.project.updated = Date.now();
    persist();
    E.render && E.render(opts.render);
    return res === undefined ? true : res;
  };

  /* Zmiana bez nowego wpisu w historii (np. pisanie w polu po wcześniejszym snapshot()). */
  E.touch = function (render) {
    S.project.updated = Date.now();
    persist();
    E.render && E.render(render || 'canvas');
  };

  E.undoAction = function () {
    if (!S.undo.length) return false;
    S.redo.push(JSON.stringify(S.project));
    S.project = JSON.parse(S.undo.pop());
    if (S.selected && !E.findPlaced(S.selected)) S.selected = null;
    persist(); E.render(); return true;
  };
  E.redoAction = function () {
    if (!S.redo.length) return false;
    S.undo.push(JSON.stringify(S.project));
    S.project = JSON.parse(S.redo.pop());
    if (S.selected && !E.findPlaced(S.selected)) S.selected = null;
    persist(); E.render(); return true;
  };

  E.openProject = function (p) {
    S.project = p; S.selected = null; S.target = null; S.undo = []; S.redo = []; S.zoom = null;
    E.storage.save(p);
    E.render && E.render();
  };

  E.flushSave = function () { if (S.project) E.storage.save(S.project); };
  window.addEventListener('beforeunload', () => E.flushSave());
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') E.flushSave(); });
})();
