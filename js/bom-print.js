/* el_Szafa — lista materiałów (BOM), zestawienie obwodów, eksport CSV i wydruk. */
(function () {
  'use strict';
  const E = window.ElSzafa;
  const S = E.state;
  const esc = E.esc;

  function allPlaced(p) {
    const out = [];
    p.rows.forEach((r, ri) => r.slice().sort((a, b) => a.pos - b.pos).forEach(m => out.push({ m, row: ri })));
    p.parking.forEach(m => out.push({ m, row: -1 }));
    return out;
  }

  E.bom = function (p) {
    const map = new Map();
    allPlaced(p).forEach(({ m }) => {
      const it = E.itemFor(m);
      const k = m.itemId;
      if (!map.has(k)) map.set(k, { it, qty: 0, tags: [] });
      const r = map.get(k); r.qty++; if (m.tag) r.tags.push(m.tag);
    });
    const nat = (a, b) => a.localeCompare(b, 'pl', { numeric: true });
    map.forEach(r => r.tags.sort(nat));
    return Array.from(map.values()).sort((a, b) => (a.it.order ?? 1e9) - (b.it.order ?? 1e9));
  };

  E.circuits = p => allPlaced(p).map(({ m, row }) => ({ m, row, it: E.itemFor(m) }));

  function bomTable(p) {
    const rows = E.bom(p);
    if (!rows.length) return `<div class="empty">${ic('list')}<p>Lista jest pusta – dodaj aparaty do szafy.</p></div>`;
    const totalQty = rows.reduce((n, r) => n + r.qty, 0);
    const totalW = rows.reduce((n, r) => n + r.qty * r.it.width, 0);
    return `<div class="tbl-wrap"><table class="tbl">
      <thead><tr><th>Lp.</th><th>Producent</th><th>Typ</th><th>Nr kat.</th><th>Nazwa</th><th class="num">Ilość</th><th class="num">Mod.</th><th>Oznaczenia</th></tr></thead>
      <tbody>${rows.map((r, i) => `<tr><td>${i + 1}</td><td>${esc(r.it.manufacturer)}</td><td class="nowrap">${esc(r.it.type)}</td>
        <td class="nowrap">${esc(r.it.article)}${r.it.verify ? ' <span class="verify">sprawdź</span>' : ''}</td><td>${esc(r.it.name)}</td>
        <td class="num"><b>${r.qty}</b></td><td class="num">${r.qty * r.it.width}</td><td class="tags">${esc(r.tags.join(', '))}</td></tr>`).join('')}</tbody>
      <tfoot><tr><td colspan="5">Razem</td><td class="num">${totalQty}</td><td class="num">${totalW}</td><td></td></tr></tfoot></table></div>
      <div class="m-list">${rows.map(r => `<div class="row"><div class="row-main"><div class="row-title">${esc(r.it.name)}</div>
        <div class="row-sub">${esc([r.it.type, r.it.article ? 'nr ' + r.it.article : ''].filter(Boolean).join(' · '))}${r.it.verify ? ' <span class="verify">sprawdź</span>' : ''}</div>
        <div class="row-sub">${esc(r.tags.join(', '))}</div></div><div class="row-amt">× ${r.qty}</div></div>`).join('')}
        <div class="sec-sum"><span>Razem ${totalQty} ${E.plural(totalQty, 'aparat', 'aparaty', 'aparatów')}</span><span>${totalW} mod.</span></div></div>`;
  }

  function circuitTable(p) {
    const list = E.circuits(p);
    if (!list.length) return '';
    return `<div class="tbl-wrap"><table class="tbl">
      <thead><tr><th>Ozn.</th><th>Aparat</th><th>Opis obwodu</th><th>Przewód</th><th>Miejsce</th><th>Uwagi</th></tr></thead>
      <tbody>${list.map(({ m, row, it }) => `<tr><td class="nowrap"><b>${esc(m.tag)}</b></td><td>${esc(it.type)}<div class="sub">${esc(it.face.label)} ${esc(it.face.sub || '')}</div></td>
        <td>${esc(m.desc) || '<span class="muted">—</span>'}</td><td>${esc(m.cable)}</td>
        <td class="nowrap">${row < 0 ? 'poza szafą' : `R${row + 1} · ${m.pos + 1}`}</td><td>${esc(m.note)}</td></tr>`).join('')}</tbody></table></div>
      <div class="m-list">${list.map(({ m, row, it }) => `<div class="row"><div class="row-main"><div class="row-title">${esc(m.tag)} · ${esc(m.desc || it.face.label + ' ' + (it.face.sub || ''))}</div>
        <div class="row-sub">${esc([it.type, m.cable, m.note].filter(Boolean).join(' · '))}</div></div><div class="row-sub nowrap">${row < 0 ? 'poza szafą' : `R${row + 1} · ${m.pos + 1}`}</div></div>`).join('')}</div>`;
  }

  E.renderBOM = function () {
    const p = S.project;
    const el = E.$('#bom-view');
    const n = E.bom(p).reduce((a, r) => a + r.qty, 0);
    el.innerHTML = `<div class="bom-in">
      <div class="bom-actions">
        <button class="btn primary" data-a="csv">${ic('download')}Lista do CSV</button>
        <button class="btn ghost" data-a="print">${ic('print')}Drukuj / PDF</button>
      </div>
      <div class="sec-title">Lista materiałów · ${n} ${E.plural(n, 'aparat', 'aparaty', 'aparatów')}</div>
      <div class="card">${bomTable(p)}</div>
      ${n ? `<div class="sec-title">Zestawienie obwodów</div><div class="card">${circuitTable(p)}</div>
      <div class="btns" style="padding:0"><button class="btn ghost" data-a="csv-circ">${ic('download')}Zestawienie obwodów do CSV</button></div>` : ''}
    </div>`;
    el.onclick = e => {
      const b = e.target.closest('[data-a]'); if (!b) return;
      if (b.dataset.a === 'csv') E.exportCSV();
      if (b.dataset.a === 'csv-circ') E.exportCircuitsCSV();
      if (b.dataset.a === 'print') E.printProject();
    };
  };

  /* CSV: średnik i BOM UTF-8, żeby Excel w polskich ustawieniach otworzył plik poprawnie. */
  const cell = v => { const s = String(v == null ? '' : v); return /[;"\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const toCSV = rows => '﻿' + rows.map(r => r.map(cell).join(';')).join('\r\n');

  E.exportCSV = function () {
    const p = S.project;
    const rows = [['Lp.', 'Producent', 'Seria', 'Typ', 'Nr katalogowy', 'Nazwa', 'Ilość', 'Szerokość [mod.]', 'Razem modułów', 'Oznaczenia', 'Uwagi']];
    E.bom(p).forEach((r, i) => rows.push([i + 1, r.it.manufacturer, r.it.series, r.it.type, r.it.article, r.it.name, r.qty, r.it.width, r.qty * r.it.width, r.tags.join(', '), r.it.verify ? 'Sprawdź nr kat. w katalogu' : '']));
    E.download(`${E.slug(p.name)}-lista-materialow.csv`, toCSV(rows), 'text/csv;charset=utf-8');
    E.toast('Zapisano listę materiałów');
  };

  E.exportCircuitsCSV = function () {
    const p = S.project;
    const rows = [['Oznaczenie', 'Typ', 'Nr katalogowy', 'Aparat', 'Opis obwodu', 'Przewód', 'Rząd', 'Pozycja', 'Uwagi']];
    E.circuits(p).forEach(({ m, row, it }) => rows.push([m.tag, it.type, it.article, it.name, m.desc, m.cable, row < 0 ? 'poza szafą' : row + 1, row < 0 ? '' : m.pos + 1, m.note]));
    E.download(`${E.slug(p.name)}-obwody.csv`, toCSV(rows), 'text/csv;charset=utf-8');
    E.toast('Zapisano zestawienie obwodów');
  };

  /* Wydruk: A4 poziomo, szafa przeskalowana do szerokości strony. */
  E.printProject = function () {
    if (window.EL_SZAFA_PREVIEW) { E.toast('W podglądzie online drukowanie jest wyłączone – otwórz aplikację z folderu el_Szafa', 3600); return; }
    const p = S.project;
    const used = E.totalUsed(p), cap = E.capacity(p);
    const te = Math.min(11, Math.floor((262 / p.enclosure.modules) * 10) / 10);   // mm na moduł
    const root = E.$('#print-root');
    root.innerHTML = `<div class="pr">
      <header class="pr-head"><div><h1>${esc(p.name)}</h1>${p.client ? `<div>${esc(p.client)}</div>` : ''}</div>
        <div class="pr-meta">Szafa ${p.enclosure.rows} × ${p.enclosure.modules} mod. · zajęte ${used} z ${cap} mod.<br>${E.fmtDate(Date.now())} · el_Szafa</div></header>
      <section class="pr-cab">${E.cabinetHTML(p, { print: true, te: te + 'mm' })}</section>
      ${p.parking.length ? `<p class="pr-warn">Poza szafą: ${p.parking.map(m => esc(m.tag)).join(', ')}</p>` : ''}
      ${p.notes ? `<p class="pr-notes"><b>Uwagi:</b> ${esc(p.notes)}</p>` : ''}
      <section class="pr-break"><h2>Zestawienie obwodów</h2>${circuitTable(p) || '<p>Brak aparatów.</p>'}</section>
      <section><h2>Lista materiałów</h2>${bomTable(p)}</section>
    </div>`;
    setTimeout(() => window.print(), 50);
  };
})();
