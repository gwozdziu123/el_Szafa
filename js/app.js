/* el_Szafa — start aplikacji, układ ekranu, pasek górny, zakładki, skróty klawiszowe, PWA. */
(function () {
  'use strict';
  const E = window.ElSzafa;
  const S = E.state;
  const esc = E.esc;

  const mq = window.matchMedia('(max-width: 959px)');
  E.isMobile = () => mq.matches;

  E.setTab = function (tab) {
    S.tab = tab;
    document.getElementById('app').dataset.tab = tab;
    E.$$('#tabbar .tab').forEach(t => t.classList.toggle('on', t.dataset.tab === tab));
    E.render();
    const pane = tab === 'library' ? '#pane-library' : tab === 'project' ? '#pane-side' : '#pane-center';
    const el = E.$(pane); if (el) el.scrollTop = 0;
  };

  function currentView() { return E.isMobile() ? (S.tab === 'bom' ? 'bom' : 'cabinet') : S.view; }

  function renderTop() {
    const p = S.project;
    const n = p.rows.reduce((a, r) => a + r.length, 0) + p.parking.length;
    E.$('#proj-name').innerHTML = `<span class="pn-title">${esc(p.name || 'Bez nazwy')}</span><small>${p.enclosure.rows} × ${p.enclosure.modules} · ${n} ${E.plural(n, 'aparat', 'aparaty', 'aparatów')}</small>`;
    document.title = (p.name ? p.name + ' – ' : '') + 'el_Szafa';
    E.$('#btn-undo').disabled = !S.undo.length;
    E.$('#btn-redo').disabled = !S.redo.length;
  }

  function renderCenter() {
    const view = currentView();
    E.$('#canvas-wrap').hidden = view !== 'cabinet';
    E.$('#bom-view').hidden = view !== 'bom';
    E.$('#zoom-ctl').hidden = view !== 'cabinet';
    E.$$('#view-seg button').forEach(b => b.classList.toggle('on', b.dataset.view === S.view));
    if (view === 'cabinet') E.renderCanvas(); else { E.renderBOM(); E.renderOccupancy(); }
  }

  /* scope: undefined – wszystko, 'canvas' – szafa + pasek, 'top' – tylko pasek górny */
  E.render = function (scope) {
    if (!S.project) return;
    renderTop();
    if (scope === 'top') return;
    renderCenter();
    if (scope === 'canvas') return;
    E.renderSide();
  };

  function zoomBy(f) {
    const z = Math.round(Math.max(E.ZOOM_MIN, Math.min(E.ZOOM_MAX, E.currentZoom() * f)));
    S.zoom = z; E.renderCanvas();
  }

  function bindChrome() {
    E.$('#btn-undo').onclick = () => E.undoAction();
    E.$('#btn-redo').onclick = () => E.redoAction();
    E.$('#btn-projects').onclick = () => E.openProjects();
    E.$('#btn-print').onclick = () => E.printProject();
    E.$('#btn-menu').onclick = () => E.openMenu();
    E.$('#proj-name').onclick = () => {
      S.selected = null;
      if (E.isMobile()) E.setTab('project'); else E.render();
      setTimeout(() => { const f = E.$('#f-name'); if (f) { f.focus(); f.select(); } }, 30);
    };
    E.$('#view-seg').onclick = e => { const b = e.target.closest('[data-view]'); if (!b) return; S.view = b.dataset.view; E.render(); };
    E.$('#zoom-out').onclick = () => zoomBy(1 / 1.15);
    E.$('#zoom-in').onclick = () => zoomBy(1.15);
    E.$('#zoom-fit').onclick = () => { S.zoom = null; E.renderCanvas(); };
    E.$('#tabbar').onclick = e => { const t = e.target.closest('[data-tab]'); if (t) E.setTab(t.dataset.tab); };

    const root = E.$('#sheet-root');
    E.$('.backdrop', root).onclick = () => E.sheet.close();
    E.$('.sheet-close', root).onclick = () => E.sheet.close();

    mq.addEventListener('change', () => { if (!E.isMobile() && E.sheet.isOpen('props')) E.sheet.close(); E.render(); });

    document.addEventListener('keydown', e => {
      const t = e.target;
      const typing = /INPUT|TEXTAREA|SELECT/.test(t.tagName) || t.isContentEditable;
      const mod = e.ctrlKey || e.metaKey;
      if (e.key === 'Escape') {
        if (document.querySelector('.dlg-back')) return;
        if (E.sheet.isOpen()) { E.sheet.close(); return; }
        if (!typing && (S.selected || S.target)) { S.selected = null; S.target = null; E.render(); }
        return;
      }
      if (mod && !e.shiftKey && e.key.toLowerCase() === 'z' && !typing) { e.preventDefault(); E.undoAction(); return; }
      if (mod && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z')) && !typing) { e.preventDefault(); E.redoAction(); return; }
      if (mod && e.key.toLowerCase() === 'p') { e.preventDefault(); E.printProject(); return; }
      if (typing || E.sheet.isOpen()) return;
      if (!S.selected) return;
      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); E.removeSelected(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); E.moveSelected(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); E.moveSelected(1); }
      else if (mod && e.key.toLowerCase() === 'd') { e.preventDefault(); E.duplicateSelected(); }
    });
  }

  function registerSW() {
    if (!('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return;
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => { /* np. podgląd bez obsługi SW */ }); });
  }

  function start() {
    E.$$('[data-ic]').forEach(el => { el.outerHTML = ic(el.dataset.ic); });
    let p = null;
    const last = E.storage.last();
    if (last) p = E.normalizeProject(E.storage.load(last));
    if (!p) { const l = E.storage.list()[0]; if (l) p = E.normalizeProject(E.storage.load(l.id)); }
    if (!p) p = E.newProject();
    S.project = p;
    E.storage.save(p);
    bindChrome();
    E.initCanvas();
    E.renderLibrary();
    E.setTab('cabinet');
    document.body.classList.remove('loading');
    if (E.lib.errors.length) E.toast(E.lib.errors[0], 4000);
  }

  registerSW();
  E.loadLibraries().then(start);
})();
