/* el_Szafa — rysunek frontu aparatu modułowego (HTML/CSS skalowany zmienną --te = szerokość 1 modułu). */
(function () {
  'use strict';
  const E = window.ElSzafa;
  const esc = E.esc;

  function terminals(n, cls) {
    let s = '';
    for (let i = 0; i < n; i++) s += '<i></i>';
    return `<div class="mv-term ${cls || ''}">${s}</div>`;
  }

  function breaker(it, tag) {
    const poles = Math.max(1, it.poles || it.width);
    let levers = '';
    for (let i = 0; i < poles; i++) levers += '<span class="mv-lever"><b></b></span>';
    return `${terminals(poles)}
      <div class="mv-tag">${esc(tag)}</div>
      <div class="mv-levers">${levers}</div>
      <div class="mv-face"><strong>${esc(it.face.label)}</strong><small>${esc(it.face.sub || '')}</small></div>
      ${terminals(poles, 'bot')}`;
  }

  function rcd(it, tag) {
    const poles = Math.max(2, it.poles || it.width);
    return `${terminals(poles)}
      <div class="mv-tag">${esc(tag)}</div>
      <div class="mv-levers one"><span class="mv-lever wide"><b></b></span><span class="mv-test">T</span></div>
      <div class="mv-face"><strong>${esc(it.face.label)}</strong><small>${esc(it.face.sub || '')}</small></div>
      ${terminals(poles, 'bot')}`;
  }

  function isolator(it, tag) {
    const poles = Math.max(1, it.poles || it.width);
    return `${terminals(poles)}
      <div class="mv-tag">${esc(tag)}</div>
      <div class="mv-levers one"><span class="mv-lever wide red"><b></b></span></div>
      <div class="mv-face"><strong>${esc(it.face.label)}</strong><small>${esc(it.face.sub || '')}</small></div>
      ${terminals(poles, 'bot')}`;
  }

  function spd(it, tag) {
    const poles = Math.max(1, it.poles || it.width);
    let carts = '';
    const npe = /\+NPE/i.test(it.type || '');   // ostatni wkład N-PE (iskiernik)
    for (let i = 0; i < poles; i++) carts += (npe && i === poles - 1) ? '<span class="mv-cart npe"><i></i><b>N-PE</b></span>' : '<span class="mv-cart"><i></i><b>SPD</b></span>';
    return `${terminals(poles)}
      <div class="mv-tag">${esc(tag)}</div>
      <div class="mv-carts">${carts}</div>
      <div class="mv-face"><strong>${esc(it.face.label)}</strong><small>${esc(it.face.sub || '')}</small></div>
      ${terminals(poles, 'bot')}`;
  }

  function indicator(it, tag) {
    const leds = (it.leds || ['#22c55e']).map(c => `<i style="background:${esc(c)};box-shadow:0 0 .35em ${esc(c)}"></i>`).join('');
    let fuses = '';
    for (let i = 0; i < (it.fuses || 0); i++) fuses += '<span class="mv-fuse"><b></b></span>';
    return `${terminals(Math.max(1, it.width))}
      <div class="mv-tag">${esc(tag)}</div>
      <div class="mv-ind${it.width < 2 ? ' narrow' : ''}">${fuses ? `<div class="mv-fuses">${fuses}</div>` : ''}<div class="mv-ledrow">${leds}</div></div>
      <div class="mv-face"><strong>${esc(it.face.label)}</strong><small>${esc(it.face.sub || '')}</small></div>
      ${terminals(Math.max(1, it.width), 'bot')}`;
  }

  function distblock(it, tag) {
    const cols = 2;   // PTFIX: otwory zawsze w 2 rzędach
    const rows = Math.ceil((it.conns || 6) / cols) + (it.big ? 1.6 : 0);
    const hs = Math.min(0.26, 2.6 / (rows * 1.38)).toFixed(3);   // średnica otworu w modułach – mniejsza przy wielu zaciskach
    let holes = '';
    for (let i = 0; i < (it.big || 0); i++) holes += '<i class="big"></i>';
    for (let i = 0; i < (it.conns || 6); i++) holes += '<i></i>';
    return `<div class="mv-tag">${esc(tag)}</div>
      <div class="mv-holes" style="--cols:${cols};--hs:${hs};--hg:${(hs * 0.38).toFixed(3)}">${holes}</div>
      <div class="mv-mark"><strong>${esc(it.face.label)}</strong><small>${esc(it.face.sub || '')}</small></div>`;
  }

  function loxone(it, tag) {
    const n = Math.max(2, Math.round(it.width * 2.2));
    return `${terminals(n, 'sq')}
      <div class="mv-tag">${esc(tag)}</div>
      <div class="mv-lox"><span class="mv-leds"><i class="g"></i><i class="o"></i></span>
        <strong>${esc(it.face.label)}</strong><small>${esc(it.face.sub || '')}</small></div>
      ${terminals(n, 'sq bot')}`;
  }

  function psu(it, tag) {
    const n = Math.max(2, Math.round(it.width * 1.6));
    return `${terminals(n, 'sq')}
      <div class="mv-tag">${esc(tag)}</div>
      <div class="mv-psu"><span class="mv-pot"></span><strong>${esc(it.face.label)}</strong><small>${esc(it.face.sub || '')}</small><span class="mv-leds"><i class="g"></i></span></div>
      ${terminals(n, 'sq bot')}`;
  }

  function generic(it, tag) {
    return `${terminals(it.width)}
      <div class="mv-tag">${esc(tag)}</div>
      <div class="mv-face mid"><strong>${esc(it.face.label || it.type || '?')}</strong><small>${esc(it.face.sub || '')}</small></div>
      ${terminals(it.width, 'bot')}`;
  }

  const VIS = { breaker, rcd, isolator, spd, indicator, distblock, loxone, psu, generic };

  /* Zastępczy opis, gdy pozycji nie ma już w bibliotece. */
  E.missingItem = m => ({ id: m.itemId, width: m.w, poles: m.w, visual: 'generic', kind: 'generic', prefix: 'X', color: {}, face: { label: '?', sub: 'brak w bibl.' }, name: 'Pozycja spoza biblioteki (' + m.itemId + ')', type: m.itemId, article: '', manufacturer: '', specs: {}, group: '' });

  /* Zwraca HTML aparatu. it – pozycja biblioteki, tag – oznaczenie. */
  E.moduleHTML = function (it, tag) {
    const c = it.color || {};
    const vis = it.kind === 'rcbo' ? 'rcd' : (VIS[it.visual] ? it.visual : 'generic');
    const style = [`--w:${it.width}`];
    if (c.body) style.push(`--mv-body:${c.body}`);
    if (c.lever) style.push(`--mv-lever:${c.lever}`);
    if (c.accent) style.push(`--mv-accent:${c.accent}`);
    if (c.test) style.push(`--mv-test:${c.test}`);
    if (c.terminal) style.push(`--mv-terminal:${c.terminal}`);
    if (c.cartridge) style.push(`--mv-cart:${c.cartridge}`);
    return `<div class="mv mv-${vis}" style="${style.join(';')}">${VIS[vis](it, tag || '')}</div>`;
  };
})();
