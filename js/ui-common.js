/* el_Szafa — wspólne elementy interfejsu: toast, arkusz, okno potwierdzenia, pobieranie plików. */
(function () {
  'use strict';
  const E = window.ElSzafa;
  const $ = (s, el) => (el || document).querySelector(s);
  E.$ = $;
  E.$$ = (s, el) => Array.from((el || document).querySelectorAll(s));

  /* Toast */
  let toastT;
  E.toast = function (msg, ms) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('show'), ms || 2400);
  };

  /* Arkusz (bottom sheet) */
  const sheet = {
    onClose: null,
    open(o) {
      const root = $('#sheet-root');
      $('.sheet-head h2', root).textContent = o.title || '';
      $('.sheet-body', root).innerHTML = o.body || '';
      $('.sheet-foot', root).innerHTML = o.foot || '';
      root.classList.toggle('wide', !!o.wide);
      root.classList.add('open');
      root.setAttribute('aria-hidden', 'false');
      document.body.classList.add('noscroll');
      sheet.onClose = o.onClose || null;
      sheet.key = o.key || null;
      if (o.onMount) o.onMount(root);
      const f = o.focus && $(o.focus, root);
      if (f) setTimeout(() => f.focus(), 230);
    },
    close() {
      const root = $('#sheet-root');
      if (!root.classList.contains('open')) return;
      root.classList.remove('open');
      root.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('noscroll');
      const cb = sheet.onClose; sheet.onClose = null; sheet.key = null;
      if (cb) cb();
    },
    isOpen(key) { const o = $('#sheet-root').classList.contains('open'); return key ? o && sheet.key === key : o; }
  };
  E.sheet = sheet;

  /* Okno potwierdzenia */
  E.confirm = function (text, okLabel, danger) {
    return new Promise(res => {
      const back = document.createElement('div');
      back.className = 'dlg-back';
      back.innerHTML = `<div class="dlg" role="alertdialog" aria-modal="true"><p></p><div class="dlg-btns">
        <button class="btn ghost" data-a="0">Anuluj</button><button class="btn ${danger ? 'danger' : 'primary'}" data-a="1"></button></div></div>`;
      back.querySelector('p').textContent = text;
      back.querySelector('[data-a="1"]').textContent = okLabel || 'OK';
      const done = v => { back.remove(); document.removeEventListener('keydown', key, true); res(v); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); done(false); } };
      back.addEventListener('click', e => {
        const b = e.target.closest('[data-a]');
        if (b) done(b.dataset.a === '1'); else if (e.target === back) done(false);
      });
      document.addEventListener('keydown', key, true);
      document.body.appendChild(back);
      back.querySelector('[data-a="1"]').focus();
    });
  };

  /* Pobranie pliku */
  E.download = function (name, text, mime) {
    if (window.EL_SZAFA_PREVIEW) { E.toast('W podglądzie online pobieranie plików jest wyłączone – otwórz aplikację z folderu el_Szafa', 3600); return; }
    const blob = new Blob([text], { type: mime || 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  };

  E.slug = s => (String(s || 'projekt').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l').replace(/Ł/g, 'L')
    .replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'projekt');

  E.norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l');
})();
