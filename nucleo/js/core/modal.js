/* =========================================================
   MODAL de confirmação — HTML em partials/modal.html
     A.confirm({
       icon: '↺', title: 'Limpar?', msg: 'texto…',
       ok: 'Apagar', cancel: 'Cancelar', danger: true
     }).then(function (sim) { if (sim) … });
   Sem servidor (file://) o partial não carrega: cai no
   confirm() nativo do navegador.
   ========================================================= */
(function (A) {
  A.confirm = function (o) {
    o = o || {};
    return A.partial('modal').then(function (html) {
      return open(html, o);
    }, function () {
      var txt = (o.title || 'Tem certeza?') + '\n\n' + String(o.msg || '').replace(/<[^>]+>/g, '');
      return window.confirm(txt);
    });
  };

  function open(html, o) {
    return new Promise(function (resolve) {
      var root = A.el('div', 'modal', html);
      A.$('.modal-icon', root).textContent = o.icon || '?';
      A.$('.modal-title', root).textContent = o.title || 'Tem certeza?';
      A.$('.modal-msg', root).innerHTML = o.msg || '';
      var ok = A.$('.modal-ok', root), cancel = A.$('.modal-cancel', root);
      ok.textContent = o.ok || 'Confirmar';
      cancel.textContent = o.cancel || 'Cancelar';
      if (o.danger) root.classList.add('danger');

      var last = document.activeElement;
      function close(result) {
        document.removeEventListener('keydown', onKey);
        root.classList.add('closing');
        setTimeout(function () { root.remove(); }, 160);
        if (last && last.focus) last.focus();
        resolve(result);
      }
      function onKey(e) {
        if (e.key === 'Escape') close(false);
        else if (e.key === 'Tab') {            // mantém o foco dentro do modal
          e.preventDefault();
          (document.activeElement === ok ? cancel : ok).focus();
        }
      }
      ok.onclick = function () { close(true); };
      cancel.onclick = function () { close(false); };
      A.$('[data-close]', root).onclick = function () { close(false); };
      document.addEventListener('keydown', onKey);
      document.body.appendChild(root);
      cancel.focus();
    });
  }
})(window.ALG);
