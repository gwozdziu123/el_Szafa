/* el_Szafa — logika rozmieszczania modułów na szynach DIN. */
(function () {
  'use strict';
  const E = window.ElSzafa;

  E.findPlaced = function (uid, p) {
    p = p || E.state.project;
    for (let r = 0; r < p.rows.length; r++) {
      const i = p.rows[r].findIndex(m => m.uid === uid);
      if (i >= 0) return { row: r, index: i, m: p.rows[r][i], parked: false };
    }
    const i = p.parking.findIndex(m => m.uid === uid);
    if (i >= 0) return { row: -1, index: i, m: p.parking[i], parked: true };
    return null;
  };

  E.detach = function (p, uid) {
    const f = E.findPlaced(uid, p);
    if (!f) return null;
    if (f.parked) p.parking.splice(f.index, 1); else p.rows[f.row].splice(f.index, 1);
    return f.m;
  };

  const sorted = row => row.slice().sort((a, b) => a.pos - b.pos);

  E.rowUsed = row => row.reduce((n, m) => n + m.w, 0);
  E.totalUsed = p => p.rows.reduce((n, r) => n + E.rowUsed(r), 0);
  E.totalWidthAll = p => E.totalUsed(p) + p.parking.reduce((n, m) => n + m.w, 0);
  E.capacity = p => p.enclosure.rows * p.enclosure.modules;

  E.isFree = function (p, r, pos, w, ignoreUid) {
    if (r < 0 || r >= p.rows.length || pos < 0 || pos + w > p.enclosure.modules) return false;
    return !p.rows[r].some(m => m.uid !== ignoreUid && pos < m.pos + m.w && m.pos < pos + w);
  };

  /* Najbliższe wolne miejsce w rzędzie względem pozycji pref. */
  E.nearestGap = function (p, r, pref, w, ignoreUid) {
    const max = p.enclosure.modules - w;
    for (let d = 0; d <= p.enclosure.modules; d++) {
      for (const pos of [pref - d, pref + d]) {
        if (pos >= 0 && pos <= max && E.isFree(p, r, pos, w, ignoreUid)) return pos;
      }
    }
    return -1;
  };

  /* Pierwsze wolne miejsce, zaczynając od rzędu startRow i pozycji startPos. */
  E.findFree = function (p, w, startRow, startPos, ignoreUid) {
    startRow = startRow || 0; startPos = startPos || 0;
    const n = p.rows.length;
    for (let k = 0; k < n; k++) {
      const r = (startRow + k) % n;
      const from = k === 0 ? startPos : 0;
      for (let pos = from; pos + w <= p.enclosure.modules; pos++) {
        if (E.isFree(p, r, pos, w, ignoreUid)) return { row: r, pos };
      }
    }
    if (startRow || startPos) return E.findFree(p, w, 0, 0, ignoreUid);
    return null;
  };

  /*
   * Plan wstawienia modułu o szerokości w w rzędzie r przy pozycji raw.
   * Gdy miejsce jest zajęte, moduł wchodzi przed/za trafiony aparat, a następne przesuwają się w prawo.
   * Zwraca {pos, shifts:[{uid,pos}]} albo null, gdy w rzędzie brak miejsca.
   */
  E.planInsert = function (p, r, raw, w, ignoreUid) {
    if (r < 0 || r >= p.rows.length || w > p.enclosure.modules) return null;
    const M = p.enclosure.modules;
    raw = Math.max(0, Math.min(M - w, Math.round(raw)));
    if (E.isFree(p, r, raw, w, ignoreUid)) return { pos: raw, shifts: [] };
    const items = sorted(p.rows[r].filter(m => m.uid !== ignoreUid));
    let pos = raw;
    const hit = items.find(m => raw >= m.pos && raw < m.pos + m.w) || items.find(m => raw < m.pos + m.w && m.pos < raw + w);
    if (hit) pos = (raw - hit.pos) < hit.w / 2 ? hit.pos : hit.pos + hit.w;
    // przesunięcie kolejnych modułów w prawo
    const tryPush = start => {
      if (start + w > M) return null;
      const shifts = []; let cursor = start + w;
      for (const m of items) {
        if (m.pos + m.w <= start) continue;
        if (m.pos < start) return null;           // moduł zachodzi z lewej
        if (m.pos >= cursor) break;
        shifts.push({ uid: m.uid, pos: cursor });
        cursor += m.w;
      }
      const last = shifts.length ? shifts[shifts.length - 1] : null;
      if (last && last.pos + items.find(m => m.uid === last.uid).w > M) return null;
      return { pos: start, shifts };
    };
    let plan = tryPush(pos);
    if (!plan && hit && pos !== hit.pos) plan = tryPush(hit.pos);
    if (plan) return plan;
    const gap = E.nearestGap(p, r, raw, w, ignoreUid);
    return gap >= 0 ? { pos: gap, shifts: [] } : null;
  };

  E.applyPlan = function (p, r, plan, m) {
    plan.shifts.forEach(s => { const f = p.rows[r].find(x => x.uid === s.uid); if (f) f.pos = s.pos; });
    m.pos = plan.pos;
    p.rows[r].push(m);
  };

  /* Nowy moduł z biblioteki (jeszcze nie umieszczony). */
  E.makePlaced = function (p, item) {
    return { uid: E.uid(), itemId: item.id, w: item.width, pos: 0, tag: E.nextTag(p, item.prefix), desc: '', cable: '', note: '' };
  };

  E.nextTag = function (p, prefix) {
    const re = new RegExp('^' + prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\d+)$');
    let max = 0;
    const scan = m => { const x = re.exec(m.tag || ''); if (x) max = Math.max(max, +x[1]); };
    p.rows.forEach(r => r.forEach(scan)); p.parking.forEach(scan);
    return prefix + (max + 1);
  };

  E.renumber = function (p) {
    const counters = {};
    const all = [];
    p.rows.forEach(r => sorted(r).forEach(m => all.push(m)));
    p.parking.forEach(m => all.push(m));
    all.forEach(m => {
      const it = E.item(m.itemId); const pre = it ? it.prefix : (String(m.tag || 'X').replace(/\d+$/, '') || 'X');
      counters[pre] = (counters[pre] || 0) + 1;
      m.tag = pre + counters[pre];
    });
  };

  /* Po zmianie rozmiaru szafy: co się nie mieści, idzie do „Poza szafą”, potem próba ponownego rozmieszczenia. */
  E.reflow = function (p) {
    const { rows, modules } = p.enclosure;
    while (p.rows.length > rows) { p.rows.pop().forEach(m => p.parking.push(m)); }
    while (p.rows.length < rows) p.rows.push([]);
    p.rows.forEach((r, i) => {
      const keep = [];
      sorted(r).forEach(m => {
        if (m.pos + m.w <= modules && !keep.some(k => m.pos < k.pos + k.w && k.pos < m.pos + m.w)) keep.push(m);
        else p.parking.push(m);
      });
      p.rows[i] = keep;
    });
    E.placeParking(p);
  };

  E.placeParking = function (p) {
    const left = [];
    p.parking.forEach(m => {
      const spot = E.findFree(p, m.w, 0, 0);
      if (spot) { m.pos = spot.pos; p.rows[spot.row].push(m); } else left.push(m);
    });
    p.parking = left;
    return left.length;
  };

  /* Ułożenie wszystkich modułów po kolei, bez przerw. */
  E.autoPack = function (p) {
    const all = [];
    p.rows.forEach(r => sorted(r).forEach(m => all.push(m)));
    p.parking.forEach(m => all.push(m));
    p.rows = p.rows.map(() => []); p.parking = [];
    let r = 0, cursor = 0;
    all.forEach(m => {
      if (m.w > p.enclosure.modules) { p.parking.push(m); return; }
      if (cursor + m.w > p.enclosure.modules) { r++; cursor = 0; }
      if (r >= p.rows.length) { p.parking.push(m); return; }
      m.pos = cursor; cursor += m.w; p.rows[r].push(m);
    });
  };

  /* Czy zestaw szerokości zmieści się w układzie rows × modules (układanie po kolei). */
  function packs(widths, rows, modules) {
    let r = 0, c = 0;
    for (const w of widths) {
      if (w > modules) return false;
      if (c + w > modules) { r++; c = 0; }
      if (r >= rows) return false;
      c += w;
    }
    return true;
  }

  /* Zalecany gotowy rozmiar szafy z rezerwą reserve %. */
  E.recommend = function (p) {
    const widths = [];
    p.rows.forEach(r => sorted(r).forEach(m => widths.push(m.w)));
    p.parking.forEach(m => widths.push(m.w));
    const used = widths.reduce((a, b) => a + b, 0);
    if (!used) return null;
    const need = Math.ceil(used * (1 + (Number(p.reserve) || 0) / 100));
    const maxW = Math.max(...widths);
    const cand = E.lib.enclosures
      .filter(e => e.modules >= maxW && e.rows * e.modules >= need && packs(widths, e.rows, e.modules))
      .sort((a, b) => (a.rows * a.modules - b.rows * b.modules) || (a.rows - b.rows));
    return cand[0] || null;
  };

  E.setEnclosure = function (p, rows, modules, presetId) {
    p.enclosure = { presetId: presetId || null, rows: Math.max(1, Math.min(12, rows | 0)), modules: Math.max(4, Math.min(48, modules | 0)) };
    E.reflow(p);
  };
})();
