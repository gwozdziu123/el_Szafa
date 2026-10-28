/* el_Szafa — widok szafy: rysowanie rzędów, zaznaczanie, przeciąganie (mysz i dotyk). */
(function () {
  'use strict';
  const E = window.ElSzafa;
  const S = E.state;
  const esc = E.esc;

  const MOD_H = 4.4;           // wysokość aparatu w modułach
  E.ZOOM_MIN = 12; E.ZOOM_MAX = 64;

  E.itemFor = m => E.item(m.itemId) || E.missingItem(m);

  E.fitZoom = function () {
    const wrap = E.$('#canvas-wrap');
    const p = S.project;
    if (!wrap || !p) return 36;
    const avail = wrap.clientWidth - 24 - 64 - 8;   // marginesy, ramka szafy, nagłówek rzędu, końcówka szyny
    return Math.max(12, Math.min(48, Math.floor(avail / p.enclosure.modules)));
  };
  E.currentZoom = () => S.zoom || E.fitZoom();

  function placedHTML(m, r) {
    const it = E.itemFor(m);
    const sel = S.selected === m.uid ? ' sel' : '';
    const d = [m.desc, m.cable].filter(Boolean).map(esc).join('<br><span class="pm-cable">') + (m.cable && m.desc ? '</span>' : '');
    const title = `${m.tag || ''} · ${it.name}${m.desc ? ' – ' + m.desc : ''}`;
    return `<div class="pm${sel}" data-uid="${m.uid}" data-row="${r}" data-w="${m.w}" style="left:calc(var(--te) * ${m.pos});width:calc(var(--te) * ${m.w})" title="${esc(title)}" tabindex="0">
      ${E.moduleHTML(it, m.tag)}<div class="pm-desc">${d}</div></div>`;
  }

  E.cabinetHTML = function (p, opts) {
    opts = opts || {};
    const M = p.enclosure.modules;
    let rows = '';
    p.rows.forEach((row, r) => {
      let slots = '';
      if (!opts.print) {
        for (let i = 0; i < M; i++) {
          const t = S.target && S.target.row === r && S.target.pos === i ? ' target' : '';
          slots += `<button class="slot${t}" data-row="${r}" data-pos="${i}" aria-label="Rząd ${r + 1}, miejsce ${i + 1}"></button>`;
        }
      } else {
        for (let i = 0; i < M; i++) slots += '<span class="slot"></span>';
      }
      const used = E.rowUsed(row);
      rows += `<div class="cab-row">
        <div class="cab-rowhead"><b>${r + 1}</b><small>${used}/${M}</small></div>
        <div class="rail-area" data-row="${r}" style="width:calc(var(--te) * ${M})">
          <div class="slots">${slots}</div><div class="rail"></div>
          ${row.map(m => placedHTML(m, r)).join('')}
        </div></div>`;
    });
    return `<div class="cab" style="--te:${opts.te || E.currentZoom() + 'px'};--mh:${MOD_H}">${rows}</div>`;
  };

  E.renderCanvas = function () {
    const p = S.project; if (!p) return;
    const c = E.$('#canvas');
    const total = p.rows.reduce((n, r) => n + r.length, 0) + p.parking.length;
    const hint = total ? '' : `<div class="canvas-hint card card-pad">${E.isMobile()
      ? 'Szafa jest pusta. Dodawaj aparaty w zakładce <b>Biblioteka</b> – trafią w pierwsze wolne miejsce. Wolne pole na szynie możesz stuknąć, by wskazać, gdzie wstawić następny.'
      : 'Szafa jest pusta. Kliknij aparat w bibliotece, aby dodać go w pierwszym wolnym miejscu, albo przeciągnij go na szynę. Kliknięte wolne pole wskazuje, gdzie wstawić następny.'}</div>`;
    const park = p.parking.length ? `<div class="banner park-banner">${ic('warn')}<span><b>Poza szafą: ${p.parking.length}</b> – ${E.plural(p.parking.length, 'aparat się nie mieści', 'aparaty się nie mieszczą', 'aparatów się nie mieści')}. Powiększ szafę lub przeciągnij je na wolne miejsce.</span></div>
      <div class="park-tray">${p.parking.map(m => `<div class="pm parked${S.selected === m.uid ? ' sel' : ''}" data-uid="${m.uid}" data-row="-1" style="width:calc(var(--te) * ${m.w})" tabindex="0">${E.moduleHTML(E.itemFor(m), m.tag)}</div>`).join('')}</div>` : '';
    const zoom = E.currentZoom();
    c.innerHTML = hint + E.cabinetHTML(p) + (park ? `<div class="park" style="--te:${Math.min(zoom, 30)}px;--mh:${MOD_H}">${park}</div>` : '');
    E.renderOccupancy();
  };

  E.renderOccupancy = function () {
    const p = S.project;
    const used = E.totalUsed(p), cap = E.capacity(p);
    const pct = cap ? Math.round(used / cap * 100) : 0;
    const el = E.$('#occ');
    if (el) el.innerHTML = `<span class="occ-txt"><b>${used}</b> z ${cap} mod. · ${pct}%</span><span class="occ-bar"><i style="width:${Math.min(100, pct)}%" class="${pct > 100 ? 'over' : ''}"></i></span>`;
    const z = E.$('#zoom-val'); if (z) z.textContent = S.zoom ? Math.round(S.zoom / 36 * 100) + '%' : 'Dopasuj';
  };

  /* ---------- Akcje na modułach ---------- */
  E.select = function (uid, openSheet) {
    S.selected = uid; S.target = null;
    E.render();
    if (uid && openSheet && E.isMobile()) E.openPropsSheet(uid);
  };

  E.addItem = function (itemId) {
    const it = E.item(itemId); if (!it) return;
    let info = null;
    E.commit(p => {
      const m = E.makePlaced(p, it);
      let placed = false;
      if (S.target) {
        const plan = E.planInsert(p, S.target.row, S.target.pos, m.w);
        if (plan) {
          E.applyPlan(p, S.target.row, plan, m); placed = true;
          const next = plan.pos + m.w;
          S.target = next < p.enclosure.modules ? { row: S.target.row, pos: next } : null;
        }
      }
      if (!placed && S.selected) {
        const f = E.findPlaced(S.selected, p);
        if (f && !f.parked) {
          const plan = E.planInsert(p, f.row, f.m.pos + f.m.w, m.w);
          if (plan) { E.applyPlan(p, f.row, plan, m); placed = true; }
        }
      }
      if (!placed) {
        const spot = E.findFree(p, m.w, 0, 0);
        if (spot) { m.pos = spot.pos; p.rows[spot.row].push(m); placed = true; }
      }
      if (!placed) p.parking.push(m);
      if (!S.target) S.selected = m.uid;
      const f = E.findPlaced(m.uid, p);
      info = { tag: m.tag, placed, row: f ? f.row : -1 };
    });
    if (!info) return;
    if (!info.placed) E.toast(`Brak miejsca – ${info.tag} czeka w sekcji „Poza szafą”`, 3200);
    else if (E.isMobile()) E.toast(`Dodano ${info.tag} · rząd ${info.row + 1}`);
  };

  E.removeSelected = function () {
    const uid = S.selected; if (!uid) return;
    const f = E.findPlaced(uid); if (!f) return;
    const tag = f.m.tag;
    E.commit(p => { E.detach(p, uid); });
    S.selected = null; E.sheet.isOpen('props') && E.sheet.close();
    E.render();
    E.toast(`Usunięto ${tag || 'aparat'}`);
  };

  E.duplicateSelected = function () {
    const f = E.findPlaced(S.selected); if (!f) return;
    const it = E.itemFor(f.m);
    let ok = false;
    E.commit(p => {
      const src = E.findPlaced(S.selected, p).m;
      const m = { ...E.clone(src), uid: E.uid(), tag: E.nextTag(p, it.prefix || 'X') };
      const g = E.findPlaced(src.uid, p);
      let placed = false;
      if (!g.parked) { const plan = E.planInsert(p, g.row, src.pos + src.w, m.w); if (plan) { E.applyPlan(p, g.row, plan, m); placed = true; } }
      if (!placed) { const s = E.findFree(p, m.w); if (s) { m.pos = s.pos; p.rows[s.row].push(m); placed = true; } }
      if (!placed) p.parking.push(m);
      S.selected = m.uid; ok = placed;
    });
    E.toast(ok ? 'Zduplikowano' : 'Brak miejsca – kopia czeka w sekcji „Poza szafą”');
  };

  /* Przesunięcie o 1 moduł lub zamiana z sąsiadem. dir = -1 / 1 */
  E.moveSelected = function (dir) {
    const f = E.findPlaced(S.selected); if (!f || f.parked) return;
    E.commit(p => {
      const g = E.findPlaced(S.selected, p); const m = g.m; const row = p.rows[g.row];
      const np = m.pos + dir;
      if (E.isFree(p, g.row, np, m.w, m.uid)) { m.pos = np; return; }
      const nb = dir < 0 ? row.find(x => x.pos + x.w === m.pos) : row.find(x => x.pos === m.pos + m.w);
      if (!nb) return false;
      if (dir < 0) { const start = nb.pos; m.pos = start; nb.pos = start + m.w; }
      else { const start = m.pos; nb.pos = start; m.pos = start + nb.w; }
    });
  };

  /* ---------- Przeciąganie ---------- */
  let drag = null;
  let suppressClickUntil = 0;

  function ghostAt(x, y) {
    drag.ghost.style.transform = `translate(${x - drag.dx}px, ${y - drag.dy}px)`;
  }

  function clearIndicator() {
    E.$$('.drop-ind').forEach(n => n.remove());
  }

  function hitTest(x, y) {
    const el = document.elementFromPoint(x, y);
    const area = el && el.closest('.rail-area');
    clearIndicator();
    drag.plan = null; drag.row = -1;
    if (!area) return;
    const te = E.currentZoom();
    const rect = area.getBoundingClientRect();
    const r = +area.dataset.row;
    const raw = (x - drag.dx - rect.left) / te;
    const ignore = drag.source === 'placed' ? drag.uid : null;
    const plan = E.planInsert(S.project, r, raw, drag.w, ignore);
    const ind = document.createElement('div');
    const pos = plan ? plan.pos : Math.max(0, Math.min(S.project.enclosure.modules - drag.w, Math.round(raw)));
    ind.className = 'drop-ind ' + (plan ? 'ok' : 'bad');
    ind.style.left = `calc(var(--te) * ${pos})`;
    ind.style.width = `calc(var(--te) * ${Math.min(drag.w, S.project.enclosure.modules)})`;
    area.appendChild(ind);
    drag.plan = plan; drag.row = r;
  }

  function autoScroll(y) {
    const wrap = E.$('#canvas-wrap'); if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    if (y < r.top + 48) wrap.scrollTop -= 14; else if (y > r.bottom - 48) wrap.scrollTop += 14;
  }

  function startDrag() {
    const te = E.currentZoom();
    const it = drag.source === 'lib' ? E.item(drag.itemId) : E.itemFor(E.findPlaced(drag.uid).m);
    const g = document.createElement('div');
    g.className = 'drag-ghost';
    g.style.setProperty('--te', te + 'px');
    g.style.setProperty('--mh', MOD_H);
    g.innerHTML = E.moduleHTML(it, drag.source === 'placed' ? E.findPlaced(drag.uid).m.tag : '');
    document.body.appendChild(g);
    drag.ghost = g;
    if (drag.source === 'lib' || drag.parked) { drag.dx = te * drag.w / 2; drag.dy = te * MOD_H / 2; }
    else { drag.dx = Math.min(drag.dx, te * drag.w); }
    if (drag.el) drag.el.classList.add('dragging');
    document.body.classList.add('is-dragging');
    drag.started = true;
  }

  function endDrag(commit) {
    if (!drag) return;
    const d = drag; drag = null;
    clearIndicator();
    if (d.ghost) d.ghost.remove();
    if (d.el) d.el.classList.remove('dragging');
    document.body.classList.remove('is-dragging');
    clearTimeout(d.timer);
    if (d.source === 'placed' || d.started) suppressClickUntil = Date.now() + 300;
    if (!d.started) {
      if (commit) {
        if (d.source === 'lib') E.addItem(d.itemId);
        else E.select(d.uid, true);
      }
      return;
    }
    if (!commit || !d.plan) {
      if (commit && d.row >= 0) E.toast('Brak miejsca w tym rzędzie');
      return;
    }
    E.commit(p => {
      let m;
      if (d.source === 'lib') m = E.makePlaced(p, E.item(d.itemId));
      else m = E.detach(p, d.uid);
      if (!m) return false;
      E.applyPlan(p, d.row, d.plan, m);
      S.selected = m.uid; S.target = null;
    });
  }

  function onDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    if (drag) return;
    const pm = e.target.closest('.pm');
    const li = !pm && e.target.closest('.lib-item');
    if (!pm && !li) return;
    if (li && e.target.closest('[data-add]')) return;        // przycisk „+” – zwykłe kliknięcie
    const isTouch = e.pointerType === 'touch' || e.pointerType === 'pen';
    if (pm) {
      const f = E.findPlaced(pm.dataset.uid); if (!f) return;
      const rect = pm.getBoundingClientRect();
      drag = { source: 'placed', uid: f.m.uid, w: f.m.w, parked: f.parked, el: pm, x0: e.clientX, y0: e.clientY, dx: e.clientX - rect.left, dy: e.clientY - rect.top, started: false };
      e.preventDefault();
    } else {
      const it = E.item(li.dataset.id); if (!it) return;
      drag = { source: 'lib', itemId: it.id, w: it.width, el: null, x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, started: false, longPress: isTouch };
      if (isTouch) {
        // na dotyku przeciąganie z biblioteki po przytrzymaniu, żeby nie blokować przewijania listy
        drag.timer = setTimeout(() => { if (drag && !drag.started && !drag.cancelled) { startDrag(); ghostAt(drag.x0, drag.y0); navigator.vibrate && navigator.vibrate(15); } }, 380);
      }
    }
    drag.pointerId = e.pointerId;
  }

  function onMove(e) {
    if (!drag || e.pointerId !== drag.pointerId) return;
    const dist = Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0);
    if (!drag.started) {
      if (drag.longPress) { if (dist > 8) { clearTimeout(drag.timer); drag.cancelled = true; } return; }
      if (dist < 6) return;
      if (E.isMobile() && drag.source === 'lib') return;
      startDrag();
    }
    e.preventDefault();
    ghostAt(e.clientX, e.clientY);
    autoScroll(e.clientY);
    hitTest(e.clientX, e.clientY);
  }

  function onUp(e) {
    if (!drag || e.pointerId !== drag.pointerId) return;
    if (drag.cancelled) { const d = drag; drag = null; clearTimeout(d.timer); return; }
    endDrag(true);
  }

  E.initCanvas = function () {
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('pointermove', onMove, { passive: false });
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', () => endDrag(false));
    document.addEventListener('touchmove', e => { if (drag && drag.started) e.preventDefault(); }, { passive: false });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && drag) { endDrag(false); e.stopPropagation(); } }, true);

    const wrap = E.$('#canvas-wrap');
    wrap.addEventListener('click', e => {
      if (Date.now() < suppressClickUntil) return;
      const slot = e.target.closest('.slot');
      if (slot && slot.dataset.row !== undefined) {
        const r = +slot.dataset.row, pos = +slot.dataset.pos;
        S.target = (S.target && S.target.row === r && S.target.pos === pos) ? null : { row: r, pos };
        S.selected = null;
        E.render();
        if (S.target && E.isMobile()) E.toast(`Miejsce wybrane: rząd ${r + 1}, moduł ${pos + 1}. Dodaj aparat z Biblioteki.`);
        return;
      }
      if (!e.target.closest('.pm') && (S.selected || S.target)) { S.selected = null; S.target = null; E.render(); }
    });
    wrap.addEventListener('keydown', e => {
      const pm = e.target.closest('.pm');
      if (pm && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); E.select(pm.dataset.uid, true); }
    });
    window.addEventListener('resize', E.debounce(() => { if (!S.zoom) E.renderCanvas(); }, 120));
  };
})();
