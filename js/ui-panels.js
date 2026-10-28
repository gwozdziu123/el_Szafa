/* el_Szafa — panele: właściwości aparatu, projekt i szafa, lista projektów, menu. */
(function () {
  'use strict';
  const E = window.ElSzafa;
  const S = E.state;
  const esc = E.esc;

  const CABLES = ['YDYp 3×1,5 mm²', 'YDYp 3×2,5 mm²', 'YDY 3×4 mm²', 'YDY 3×6 mm²', 'YDY 5×1,5 mm²', 'YDY 5×2,5 mm²', 'YDY 5×4 mm²', 'YDY 5×6 mm²', 'YDY 5×10 mm²', 'YDY 5×16 mm²', 'YnTKSY 2×2×0,8', 'LiYY 2×0,75 mm²', 'OMY 2×1 mm²', 'Cat 6 U/UTP'];

  /* ---------- Właściwości aparatu ---------- */
  E.propsHTML = function (uid, inSheet) {
    const f = E.findPlaced(uid); if (!f) return '';
    const m = f.m, it = E.itemFor(m);
    const where = f.parked ? 'poza szafą' : `rząd ${f.row + 1}, moduł ${m.pos + 1}`;
    const specs = Object.entries(it.specs || {}).map(([k, v]) => `<div class="kv"><span class="muted">${esc(k)}</span><span>${esc(v)}</span></div>`).join('');
    return `${inSheet ? '' : `<div class="side-head"><button class="btn-add" data-act="back">${ic('back')}Projekt</button></div>`}
      <div class="card">
        <div class="prop-head">
          <div class="prop-prev" style="--te:${Math.max(8, Math.min(24, Math.floor(96 / it.width)))}px;--mh:4.4">${E.moduleHTML(it, m.tag)}</div>
          <div class="grow"><div class="row-title">${esc(it.name)}</div>
            <div class="row-sub">${esc([it.manufacturer, it.type, it.article ? 'nr kat. ' + it.article : ''].filter(Boolean).join(' · '))}</div>
            <div class="row-sub">${E.modWord(m.w)} · ${where}</div></div>
        </div>
        <div class="card-pad prop-fields">
          <div class="field"><label for="p-tag">Oznaczenie</label><input class="inp" id="p-tag" value="${esc(m.tag)}" autocomplete="off"></div>
          <div class="field"><label for="p-desc">Opis obwodu</label><input class="inp" id="p-desc" value="${esc(m.desc)}" placeholder="np. Gniazda – kuchnia" autocomplete="off"></div>
          <div class="field full"><label for="p-cable">Przewód</label><input class="inp" id="p-cable" list="dl-cables" value="${esc(m.cable)}" placeholder="np. YDYp 3×2,5 mm²" autocomplete="off"></div>
          <div class="field full" style="margin:0"><label for="p-note">Uwagi</label><textarea class="inp" id="p-note" rows="2" placeholder="np. zasilanie z RCD Q1">${esc(m.note)}</textarea></div>
        </div>
        <div class="prop-acts">
          <button class="btn ghost" data-act="left" aria-label="Przesuń w lewo" title="Przesuń w lewo (←)"${f.parked ? ' disabled' : ''}>${ic('left')}</button>
          <button class="btn ghost" data-act="right" aria-label="Przesuń w prawo" title="Przesuń w prawo (→)"${f.parked ? ' disabled' : ''}>${ic('right')}</button>
          <button class="btn ghost grow" data-act="dup" title="Duplikuj (Ctrl+D)">${ic('copy')}Duplikuj</button>
          <button class="btn danger-ghost" data-act="del" title="Usuń (Delete)">${ic('trash')}Usuń</button>
        </div>
      </div>
      ${it.verify ? `<div class="banner">${ic('warn')}<span><b>Do sprawdzenia:</b> numer katalogowy lub szerokość tej pozycji potwierdź w katalogu producenta.</span></div>` : ''}
      ${specs ? `<div class="sec-title">Dane techniczne</div><div class="card">${specs}</div>` : ''}
      <datalist id="dl-cables">${CABLES.map(c => `<option value="${esc(c)}">`).join('')}</datalist>`;
  };

  E.bindProps = function (root, uid) {
    const field = (sel, key) => {
      const el = E.$(sel, root); if (!el) return;
      el.addEventListener('focus', () => { el._snap = false; });
      el.addEventListener('input', () => {
        const f = E.findPlaced(uid); if (!f) return;
        if (!el._snap) { E.snapshot(); el._snap = true; }
        f.m[key] = el.value;
        E.touch('canvas');
      });
    };
    field('#p-tag', 'tag'); field('#p-desc', 'desc'); field('#p-cable', 'cable'); field('#p-note', 'note');
    root.addEventListener('click', e => {
      const b = e.target.closest('[data-act]'); if (!b) return;
      const a = b.dataset.act;
      if (a === 'back') { S.selected = null; E.render(); }
      else if (a === 'left') E.moveSelected(-1);
      else if (a === 'right') E.moveSelected(1);
      else if (a === 'dup') E.duplicateSelected();
      else if (a === 'del') E.removeSelected();
    });
  };

  E.openPropsSheet = function (uid) {
    const f = E.findPlaced(uid); if (!f) return;
    E.sheet.open({
      key: 'props',
      title: f.m.tag || 'Aparat',
      body: `<div class="props-sheet">${E.propsHTML(uid, true)}</div>`,
      onMount: root => E.bindProps(E.$('.props-sheet', root), uid),
      onClose: () => { E.render(); }
    });
  };

  /* ---------- Projekt i szafa ---------- */
  function encOptions(cur) {
    const byM = new Map();
    E.lib.enclosures.forEach(e => { if (!byM.has(e.modules)) byM.set(e.modules, []); byM.get(e.modules).push(e); });
    let h = cur ? '' : '<option value="" selected>Własny rozmiar</option>';
    byM.forEach((list, mods) => {
      h += `<optgroup label="${mods} ${E.plural(mods, 'moduł', 'moduły', 'modułów')} w rzędzie">` +
        list.map(e => `<option value="${esc(e.id)}"${cur === e.id ? ' selected' : ''}>${esc(e.name)} (${e.rows * e.modules} mod.)</option>`).join('') + '</optgroup>';
    });
    return h;
  }

  E.projectHTML = function () {
    const p = S.project;
    const used = E.totalUsed(p), cap = E.capacity(p), all = E.totalWidthAll(p);
    const pct = cap ? Math.round(used / cap * 100) : 0;
    const rec = E.recommend(p);
    const custom = S.encMode ? S.encMode === 'custom' : !p.enclosure.presetId;
    const isRec = rec && rec.rows === p.enclosure.rows && rec.modules === p.enclosure.modules;
    let recHTML = '';
    if (!all) recHTML = '<div class="hint pad-x">Zalecany rozmiar pojawi się po dodaniu aparatów.</div>';
    else if (!rec) recHTML = `<div class="recom"><div class="grow">Żaden gotowy rozmiar nie pomieści aparatów (${all} mod.) z rezerwą ${p.reserve}%. Ustaw rozmiar własny.</div></div>`;
    else if (isRec) recHTML = `<div class="recom ok-rec"><div class="grow">${ic('bolt')} ${esc(rec.name)} to zalecany rozmiar: aparaty zajmują ${all} mod., rezerwa ${p.reserve}%.</div></div>`;
    else recHTML = `<div class="recom"><div class="grow">Zalecana: <b>${esc(rec.name)}</b> (${rec.rows * rec.modules} mod.) – aparaty zajmują ${all} mod., rezerwa ${p.reserve}%.</div><button class="btn primary" data-act="use-rec">Użyj</button></div>`;

    const parking = p.parking.length ? `<div class="sec-title">Poza szafą · ${p.parking.length}</div><div class="card">
      ${p.parking.map(m => { const it = E.itemFor(m); return `<button class="row" data-park="${m.uid}"><div class="row-main"><div class="row-title">${esc(m.tag)} · ${esc(it.name)}</div><div class="row-sub">${E.modWord(m.w)} · stuknij, by wstawić w wolne miejsce</div></div></button>`; }).join('')}
      <div class="btns" style="padding-top:12px"><button class="btn primary block" data-act="place-all">${ic('wand')}Rozmieść w wolnych miejscach</button></div></div>` : '';

    return `<div class="sec-title">Projekt</div>
      <div class="card card-pad">
        <div class="field"><label for="f-name">Nazwa projektu</label><input class="inp" id="f-name" value="${esc(p.name)}" autocomplete="off"></div>
        <div class="field"><label for="f-client">Obiekt / inwestor</label><input class="inp" id="f-client" value="${esc(p.client)}" placeholder="np. Dom – ul. Słoneczna 5" autocomplete="off"></div>
        <div class="field" style="margin:0"><label for="f-notes">Uwagi</label><textarea class="inp" id="f-notes" rows="2">${esc(p.notes)}</textarea></div>
      </div>
      <div class="sec-title">Szafa</div>
      <div class="card">
        <div class="card-pad">
          <div class="occ-big"><span><b>${used}</b> z ${cap} mod. zajęte</span><span class="muted">${pct}%</span></div>
          <div class="occ-bar big"><i style="width:${Math.min(100, pct)}%" class="${pct > 100 ? 'over' : ''}"></i></div>
          <div class="hint">${p.enclosure.rows} ${E.plural(p.enclosure.rows, 'rząd', 'rzędy', 'rzędów')} × ${p.enclosure.modules} mod. · wolne ${Math.max(0, cap - used)} mod.</div>
          <div class="segp" style="margin-top:14px"><button data-enc="preset" class="${custom ? '' : 'on'}">Gotowy rozmiar</button><button data-enc="custom" class="${custom ? 'on' : ''}">Własny</button></div>
          ${custom ? `<div class="two" style="margin-top:14px">
              <div class="field" style="margin:0"><label>Rzędy</label><div class="stepper"><button data-step="rows:-1" aria-label="Mniej rzędów">−</button><input class="inp" id="f-rows" inputmode="numeric" value="${p.enclosure.rows}"><button data-step="rows:1" aria-label="Więcej rzędów">+</button></div></div>
              <div class="field" style="margin:0"><label>Moduły w rzędzie</label><div class="stepper"><button data-step="modules:-1" aria-label="Mniej modułów">−</button><input class="inp" id="f-mods" inputmode="numeric" value="${p.enclosure.modules}"><button data-step="modules:1" aria-label="Więcej modułów">+</button></div></div>
            </div>`
            : `<div class="field" style="margin:14px 0 0"><label for="f-preset">Rozmiar (rzędy × moduły)</label><select class="inp" id="f-preset">${encOptions(p.enclosure.presetId)}</select>${(E.lib.enclosures.find(e => e.id === p.enclosure.presetId) || {}).note ? `<div class="hint">${esc(E.lib.enclosures.find(e => e.id === p.enclosure.presetId).note)}</div>` : ''}</div>`}
        </div>
        ${recHTML}
        <div class="card-pad" style="padding-top:0">
          <label class="flabel" for="f-reserve">Rezerwa miejsca</label>
          <div class="quick">${[0, 10, 20, 30, 50].map(v => `<button data-reserve="${v}" class="${+p.reserve === v ? 'on' : ''}">${v}%</button>`).join('')}</div>
        </div>
      </div>
      ${parking}
      <div class="sec-title">Narzędzia</div>
      <div class="card card-pad menu-list">
        <button data-act="pack">${ic('wand')}<span>Ułóż aparaty bez przerw<small>Po kolei, od lewej, rząd po rzędzie</small></span></button>
        <button data-act="renumber">${ic('tag')}<span>Numeruj oznaczenia ponownie<small>F1, F2… według kolejności w szafie</small></span></button>
        <button data-act="clear" class="danger">${ic('trash')}<span>Wyczyść szafę</span></button>
      </div>`;
  };

  function changeEnclosure(rows, modules, presetId) {
    const before = S.project.parking.length;
    E.commit(p => { E.setEnclosure(p, rows, modules, presetId); });
    const after = S.project.parking.length;
    if (after > before) E.toast(`Nie zmieściło się: ${after} – ${E.plural(after, 'aparat jest', 'aparaty są', 'aparatów jest')} w sekcji „Poza szafą”`, 3400);
    else E.toast(`Szafa ${S.project.enclosure.rows} × ${S.project.enclosure.modules}`);
  }
  E.changeEnclosure = changeEnclosure;

  E.bindProject = function (root) {
    const text = (sel, key) => {
      const el = E.$(sel, root); if (!el) return;
      el.addEventListener('focus', () => { el._snap = false; });
      el.addEventListener('input', () => { if (!el._snap) { E.snapshot(); el._snap = true; } S.project[key] = el.value; E.touch('top'); });
    };
    text('#f-name', 'name'); text('#f-client', 'client'); text('#f-notes', 'notes');
    const preset = E.$('#f-preset', root);
    if (preset) preset.addEventListener('change', () => {
      const e = E.lib.enclosures.find(x => x.id === preset.value); if (e) changeEnclosure(e.rows, e.modules, e.id);
    });
    const num = (sel, key) => {
      const el = E.$(sel, root); if (!el) return;
      el.addEventListener('change', () => {
        const v = parseInt(el.value, 10); if (!v) { el.value = S.project.enclosure[key]; return; }
        const enc = { ...S.project.enclosure, [key]: v };
        changeEnclosure(enc.rows, enc.modules, null);
      });
    };
    num('#f-rows', 'rows'); num('#f-mods', 'modules');
    root.addEventListener('click', async e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.enc) { S.encMode = b.dataset.enc; E.renderSide(); return; }
      if (b.dataset.step) {
        const [k, d] = b.dataset.step.split(':');
        const enc = { ...S.project.enclosure }; enc[k] = enc[k] + (+d);
        changeEnclosure(enc.rows, enc.modules, null); return;
      }
      if (b.dataset.reserve !== undefined) { E.commit(p => { p.reserve = +b.dataset.reserve; }); return; }
      if (b.dataset.park) {
        const uid = b.dataset.park; let ok = false;
        E.commit(p => { const m = E.detach(p, uid); const s = E.findFree(p, m.w); if (s) { m.pos = s.pos; p.rows[s.row].push(m); ok = true; } else { p.parking.push(m); return false; } });
        E.toast(ok ? 'Wstawiono' : 'Brak wolnego miejsca o tej szerokości'); return;
      }
      const a = b.dataset.act;
      if (a === 'use-rec') { const r = E.recommend(S.project); if (r) { S.encMode = 'preset'; changeEnclosure(r.rows, r.modules, r.id); } }
      else if (a === 'place-all') { let left = 0; E.commit(p => { left = E.placeParking(p); }); E.toast(left ? `Nie zmieściło się: ${left}` : 'Rozmieszczono'); }
      else if (a === 'pack') { E.commit(p => E.autoPack(p)); E.toast('Ułożono aparaty'); }
      else if (a === 'renumber') { E.commit(p => E.renumber(p)); E.toast('Ponumerowano oznaczenia'); }
      else if (a === 'clear') {
        if (await E.confirm('Usunąć wszystkie aparaty z szafy?\nMożesz to cofnąć przyciskiem Cofnij.', 'Wyczyść', true)) {
          E.commit(p => { p.rows = p.rows.map(() => []); p.parking = []; }); S.selected = null; E.render(); E.toast('Szafa wyczyszczona');
        }
      }
    });
  };

  E.renderSide = function () {
    const pane = E.$('#pane-side');
    const desk = !E.isMobile();
    const sel = desk && S.selected && E.findPlaced(S.selected);
    const key = sel ? 'props:' + S.selected : 'project';
    // zachowaj fokus pola po przerysowaniu
    const ae = document.activeElement;
    const keepId = pane.dataset.key === key && pane.contains(ae) && ae.id ? ae.id : null;
    const selStart = keepId && 'selectionStart' in ae ? ae.selectionStart : null;
    const scroll = pane.scrollTop;
    const fresh = document.createElement('div');
    fresh.className = 'side-in';
    fresh.innerHTML = sel ? E.propsHTML(S.selected) : E.projectHTML();
    pane.replaceChildren(fresh);
    if (sel) E.bindProps(fresh, S.selected); else E.bindProject(fresh);
    if (pane.dataset.key === key) pane.scrollTop = scroll;
    pane.dataset.key = key;
    if (keepId) { const el = document.getElementById(keepId); if (el) { el.focus({ preventScroll: true }); try { if (selStart != null) el.setSelectionRange(selStart, selStart); } catch (e) { /* pole bez zaznaczenia */ } } }
  };

  /* ---------- Lista projektów ---------- */
  E.openProjects = function () {
    E.flushSave();
    const list = E.storage.list();
    const rows = list.map(x => `<div class="row proj-row${S.project && x.id === S.project.id ? ' cur' : ''}">
        <button class="row-main" data-open="${x.id}"><div class="row-title">${esc(x.name || 'Bez nazwy')}</div>
        <div class="row-sub">${esc(x.size)} · ${x.count} ${E.plural(x.count, 'aparat', 'aparaty', 'aparatów')} · ${E.fmtDate(x.updated)}${S.project && x.id === S.project.id ? ' · otwarty' : ''}</div></button>
        <button class="icon-btn" data-more="${x.id}" aria-label="Więcej">${ic('more')}</button></div>`).join('');
    E.sheet.open({
      key: 'projects',
      title: 'Projekty',
      body: `<div class="card">${rows || `<div class="empty">${ic('folder')}<p>Brak zapisanych projektów.</p></div>`}</div>
        <div class="hint">Projekty zapisują się automatycznie w tej przeglądarce. Kopię zrobisz przez eksport do pliku .json.</div>`,
      foot: `<button class="btn ghost" data-act="import">${ic('upload')}Wczytaj z pliku</button><button class="btn primary" data-act="new">${ic('plus')}Nowy projekt</button>`,
      onMount: root => {
        root.querySelector('.sheet-body').onclick = e => {
          const o = e.target.closest('[data-open]');
          if (o) { E.flushSave(); const p = E.normalizeProject(E.storage.load(o.dataset.open)); if (p) { E.openProject(p); E.sheet.close(); E.toast('Otwarto „' + p.name + '”'); } else E.toast('Nie udało się otworzyć projektu'); return; }
          const m = e.target.closest('[data-more]');
          if (m) projectMenu(m.dataset.more);
        };
        root.querySelector('.sheet-foot').onclick = e => {
          const b = e.target.closest('[data-act]'); if (!b) return;
          if (b.dataset.act === 'new') { E.newProjectFlow(); }
          if (b.dataset.act === 'import') E.importFile();
        };
      }
    });
  };

  function projectMenu(id) {
    const meta = E.storage.list().find(x => x.id === id); if (!meta) return;
    E.sheet.open({
      title: meta.name || 'Projekt',
      body: `<div class="menu-list">
        <button data-a="open">${ic('folder')}<span>Otwórz</span></button>
        <button data-a="dup">${ic('copy')}<span>Duplikuj</span></button>
        <button data-a="export">${ic('download')}<span>Eksportuj do pliku .json</span></button>
        <button data-a="del" class="danger">${ic('trash')}<span>Usuń projekt</span></button></div>`,
      onMount: root => {
        root.querySelector('.sheet-body').onclick = async e => {
          const b = e.target.closest('[data-a]'); if (!b) return;
          E.flushSave();
          const p = E.normalizeProject(E.storage.load(id));
          if (!p) { E.toast('Nie udało się odczytać projektu'); return; }
          if (b.dataset.a === 'open') { E.openProject(p); E.sheet.close(); }
          if (b.dataset.a === 'dup') { const c = { ...E.clone(p), id: E.uid(), name: p.name + ' (kopia)', created: Date.now(), updated: Date.now() }; E.storage.save(c); if (S.project) E.storage.save(S.project); E.toast('Zduplikowano'); E.openProjects(); }
          if (b.dataset.a === 'export') { E.exportProject(p); }
          if (b.dataset.a === 'del') {
            if (await E.confirm(`Usunąć projekt „${p.name}”?\nTej operacji nie można cofnąć.`, 'Usuń', true)) {
              E.storage.remove(id);
              if (S.project && S.project.id === id) {
                const next = E.storage.list()[0];
                const np = next && E.normalizeProject(E.storage.load(next.id));
                E.openProject(np || E.newProject());
              }
              E.toast('Projekt usunięty'); E.openProjects();
            }
          }
        };
      }
    });
  }

  E.newProjectFlow = function () {
    E.sheet.open({
      title: 'Nowy projekt',
      body: `<div class="field"><label for="np-name">Nazwa projektu</label><input class="inp" id="np-name" placeholder="np. Rozdzielnica – dom Kowalskich" autocomplete="off"></div>
        <div class="field"><label for="np-size">Rozmiar szafy</label><select class="inp" id="np-size">${encOptions('3x18')}</select><div class="hint">Rozmiar zmienisz w każdej chwili – aplikacja podpowie zalecany po dodaniu aparatów.</div></div>`,
      foot: '<button class="btn ghost" data-a="cancel">Anuluj</button><button class="btn primary" data-a="ok">Utwórz</button>',
      focus: '#np-name',
      onMount: root => {
        const go = () => {
          const p = E.newProject(E.$('#np-name', root).value.trim() || 'Nowa rozdzielnica');
          const e = E.lib.enclosures.find(x => x.id === E.$('#np-size', root).value);
          if (e) { p.enclosure = { presetId: e.id, rows: e.rows, modules: e.modules }; p.rows = Array.from({ length: e.rows }, () => []); }
          E.flushSave(); E.openProject(p); E.sheet.close(); E.toast('Utworzono projekt');
          if (E.isMobile()) E.setTab('library');
        };
        root.querySelector('.sheet-foot').onclick = e => { const b = e.target.closest('[data-a]'); if (!b) return; if (b.dataset.a === 'ok') go(); else E.sheet.close(); };
        E.$('#np-name', root).addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
      }
    });
  };

  E.exportProject = function (p) {
    p = p || S.project;
    E.download(`${E.slug(p.name)}.elszafa.json`, JSON.stringify(p, null, 2), 'application/json');
    E.toast('Zapisano plik projektu');
  };

  E.importFile = function () {
    const input = E.$('#file-input');
    input.value = '';
    input.onchange = () => {
      const file = input.files && input.files[0]; if (!file) return;
      const rd = new FileReader();
      rd.onload = () => {
        try {
          const raw = JSON.parse(rd.result);
          const p = E.normalizeProject(raw);
          if (!p) throw new Error('format');
          p.id = E.uid(); p.updated = Date.now();
          const missing = new Set(); p.rows.flat().concat(p.parking).forEach(m => { if (!E.item(m.itemId)) missing.add(m.itemId); });
          E.flushSave(); E.openProject(p); E.sheet.close();
          E.toast(missing.size ? `Wczytano projekt · ${missing.size} pozycji spoza biblioteki` : 'Wczytano projekt', 3000);
        } catch (err) { E.toast('Nie udało się odczytać pliku'); }
      };
      rd.readAsText(file);
    };
    input.click();
  };

  /* ---------- Menu ⋮ ---------- */
  E.openMenu = function () {
    E.sheet.open({
      title: 'Menu',
      body: `<div class="menu-list">
        <button data-a="new">${ic('plus')}<span>Nowy projekt</span></button>
        <button data-a="projects">${ic('folder')}<span>Projekty<small>Otwórz, duplikuj lub usuń zapisane projekty</small></span></button>
        <button data-a="print">${ic('print')}<span>Drukuj / zapisz PDF<small>Widok szafy, zestawienie obwodów i lista materiałów</small></span></button>
        <button data-a="csv">${ic('download')}<span>Lista materiałów do CSV<small>Otworzysz w Excelu</small></span></button>
        <button data-a="csv-circ">${ic('download')}<span>Zestawienie obwodów do CSV</span></button>
        <button data-a="export">${ic('download')}<span>Eksportuj projekt (.json)<small>Kopia lub przeniesienie na inne urządzenie</small></span></button>
        <button data-a="import">${ic('upload')}<span>Wczytaj projekt z pliku (.json)</span></button>
        <button data-a="lib">${ic('box')}<span>Biblioteka modułów<small>Pliki biblioteki i jak je rozbudować</small></span></button>
      </div>`,
      onMount: root => {
        root.querySelector('.sheet-body').onclick = e => {
          const b = e.target.closest('[data-a]'); if (!b) return;
          const a = b.dataset.a;
          if (a === 'new') E.newProjectFlow();
          else if (a === 'projects') E.openProjects();
          else if (a === 'print') { E.sheet.close(); setTimeout(E.printProject, 250); }
          else if (a === 'csv') { E.exportCSV(); E.sheet.close(); }
          else if (a === 'csv-circ') { E.exportCircuitsCSV(); E.sheet.close(); }
          else if (a === 'export') { E.exportProject(); E.sheet.close(); }
          else if (a === 'import') E.importFile();
          else if (a === 'lib') E.openLibraryInfo();
        };
      }
    });
  };
})();
