/* el_Szafa — panel biblioteki: wyszukiwanie, filtry, grupy, dodawanie kliknięciem i przeciąganiem. */
(function () {
  'use strict';
  const E = window.ElSzafa;
  const esc = E.esc;
  const L = { q: '', lib: 'all', open: new Set() };

  function previewTE(w) { return Math.max(6, Math.min(13, Math.floor(58 / w))); }

  function itemRow(it) {
    const meta = [it.type, it.article ? 'nr ' + it.article : '', E.modWord(it.width)].filter(Boolean).join(' · ');
    return `<div class="lib-item" data-id="${esc(it.id)}" tabindex="0" role="button" aria-label="Dodaj ${esc(it.name)}">
      <div class="lib-prev" style="--te:${previewTE(it.width)}px;--mh:4.4">${E.moduleHTML(it, '')}</div>
      <div class="row-main"><div class="row-title">${esc(it.name)}</div><div class="row-sub">${esc(meta)}${it.verify ? ' <span class="verify" title="Dane do sprawdzenia w katalogu producenta">sprawdź</span>' : ''}</div></div>
      <button class="icon-btn add" data-add="${esc(it.id)}" aria-label="Dodaj do szafy" title="Dodaj do szafy">${ic('plus')}</button></div>`;
  }

  E.renderLibrary = function () {
    const pane = E.$('#pane-library');
    if (!pane.dataset.ready) {
      pane.innerHTML = `<div class="lib-top">
        <div class="search">${ic('search')}<input id="lib-q" type="search" placeholder="Szukaj: B16, 30 mA, Relay, 194821…" autocomplete="off" aria-label="Szukaj w bibliotece"></div>
        <div class="chips" id="lib-chips"></div></div>
        <div class="lib-list" id="lib-list"></div>`;
      pane.dataset.ready = '1';
      const q = E.$('#lib-q');
      q.addEventListener('input', E.debounce(() => { L.q = q.value; E.renderLibraryList(); }, 120));
      E.$('#lib-chips').addEventListener('click', e => {
        const c = e.target.closest('[data-lib]'); if (!c) return;
        L.lib = c.dataset.lib; E.renderLibraryChips(); E.renderLibraryList();
      });
      const list = E.$('#lib-list');
      list.addEventListener('click', e => {
        const add = e.target.closest('[data-add]');
        if (add) { E.addItem(add.dataset.add); return; }
        const info = e.target.closest('[data-libinfo]');
        if (info) E.openLibraryInfo();
      });
      list.addEventListener('keydown', e => {
        const li = e.target.closest('.lib-item');
        if (li && (e.key === 'Enter' || e.key === ' ') && e.target === li) { e.preventDefault(); E.addItem(li.dataset.id); }
      });
      list.addEventListener('toggle', e => {
        const d = e.target; if (!d.dataset || !d.dataset.key) return;
        if (d.open) L.open.add(d.dataset.key); else L.open.delete(d.dataset.key);
      }, true);
      // domyślnie otwarta pierwsza grupa każdej biblioteki
      E.lib.libraries.forEach(lib => { if (lib.items[0]) L.open.add(lib.id + '|' + lib.items[0].group); });
    }
    E.renderLibraryChips();
    E.renderLibraryList();
  };

  E.renderLibraryChips = function () {
    const chips = [{ id: 'all', name: 'Wszystkie', n: E.lib.items.size }].concat(E.lib.libraries.map(l => ({ id: l.id, name: l.short || l.name, n: l.items.length })));
    E.$('#lib-chips').innerHTML = chips.map(c => `<button class="chip${L.lib === c.id ? ' on' : ''}" data-lib="${esc(c.id)}">${esc(c.name)}<span class="cnt">${c.n}</span></button>`).join('');
  };

  E.renderLibraryList = function () {
    const terms = E.norm(L.q).split(/\s+/).filter(Boolean);
    const searching = terms.length > 0;
    let html = '', total = 0;
    E.lib.libraries.forEach(lib => {
      if (L.lib !== 'all' && L.lib !== lib.id) return;
      const groups = new Map();
      lib.items.forEach(it => {
        if (searching) {
          const hay = E.norm([it.name, it.type, it.article, it.group, it.face.label, it.face.sub, lib.short, it.manufacturer].join(' '));
          if (!terms.every(t => hay.includes(t))) return;
        }
        if (!groups.has(it.group)) groups.set(it.group, []);
        groups.get(it.group).push(it);
      });
      if (!groups.size) return;
      html += `<div class="sec-title lib-sec">${esc(lib.name)}</div>`;
      groups.forEach((items, g) => {
        total += items.length;
        const key = lib.id + '|' + g;
        const open = searching || L.open.has(key);
        html += `<details class="card lib-group" data-key="${esc(key)}"${open ? ' open' : ''}><summary><span>${esc(g)}<span class="cnt">${items.length}</span></span></summary>
          <div class="lib-items">${items.map(itemRow).join('')}</div></details>`;
      });
    });
    if (!total) html = `<div class="empty">${ic('search')}<p>Brak pozycji dla „${esc(L.q)}”.<br>Spróbuj krótszej frazy, np. „C16” albo „Tree”.</p></div>`;
    const files = (self.EL_SZAFA_LIBRARY_FILES || []).length;
    html += `<button class="lib-foot" data-libinfo>${ic('info')}<span>Biblioteka: ${files} ${E.plural(files, 'plik', 'pliki', 'plików')} · ${E.lib.items.size} pozycji · ${E.lib.enclosures.length} rozmiarów szaf</span></button>`;
    if (E.lib.errors.length) html += `<div class="banner">${ic('warn')}<span>${E.lib.errors.map(esc).join('<br>')}</span></div>`;
    E.$('#lib-list').innerHTML = html;
  };

  E.openLibraryInfo = function () {
    const rows = E.lib.libraries.map(l => {
      const v = l.items.filter(i => i.verify).length;
      const file = (self.EL_SZAFA_LIBRARY_FILES || []).find(f => f.replace(/\.js$/, '') === l.id) || l.id + '.js';
      return `<div class="set-row"><b>${esc(l.name)}</b><div class="small muted">library/${esc(file)} · ${l.items.length} pozycji${v ? ` · ${v} do sprawdzenia` : ''}</div>${l.source ? `<div class="hint">${esc(l.source)}</div>` : ''}</div>`;
    }).join('');
    E.sheet.open({
      title: 'Biblioteka modułów',
      body: `<div class="card">${rows}<div class="set-row"><b>Rozmiary szaf</b><div class="small muted">library/enclosures.js · ${E.lib.enclosures.length} rozmiarów</div></div></div>
        <div class="sec-title">Jak rozbudować</div>
        <div class="card card-pad small">Każda grupa aparatów to osobny plik w folderze <code>library/</code>. Skopiuj istniejący plik, zmień nagłówek i pozycje, a nazwę pliku dopisz w <code>library/_index.js</code>. Pozycje oznaczone „sprawdź” mają numer katalogowy lub szerokość do potwierdzenia w karcie producenta.</div>`,
      foot: '<button class="btn primary block" data-close>Gotowe</button>',
      onMount: root => { E.$('[data-close]', root).onclick = () => E.sheet.close(); }
    });
  };
})();
