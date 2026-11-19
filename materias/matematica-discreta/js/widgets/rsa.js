/* =========================================================
   WIDGET: laboratório do RSA — escolha p, q, e, m e veja
   cada passo da receita (público em verde, segredo em rosa).
   ========================================================= */
(function (A) {
  var PRIMOS = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
  function mdc(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }
  function powmod(b, e, n) {           // exponenciação modular (como pow(b, e, n))
    var r = 1; b %= n;
    while (e > 0) { if (e & 1) r = (r * b) % n; b = (b * b) % n; e >>= 1; }
    return r;
  }

  A.widgets.rsa = function (host, opts) {
    opts = opts || {};
    var body = A.widgetBox(host, 'Laboratório do RSA');
    body.innerHTML =
      '<div class="widget-row">' +
      '  <label class="field">primo p <select class="rp"></select></label>' +
      '  <label class="field">primo q <select class="rq"></select></label>' +
      '  <label class="field">chave e <select class="re"></select></label>' +
      '  <label class="field">mensagem m <input type="number" class="rm" min="0" style="width:110px"></label>' +
      '</div>' +
      '<div class="rsa-passos"></div>' +
      '<div class="rsa-legenda"><span class="lp">pode ser público</span><span class="ls">segredo de quem gera as chaves</span></div>' +
      '<p class="rsa-aviso" style="margin:10px 0 0;font-weight:700"></p>';
    var sp = A.$('.rp', body), sq = A.$('.rq', body), se = A.$('.re', body), im = A.$('.rm', body);
    PRIMOS.forEach(function (p) {
      [sp, sq].forEach(function (s) { var o = A.el('option'); o.value = p; o.textContent = p; s.appendChild(o); });
    });
    sp.value = opts.p || 5; sq.value = opts.q || 3; im.value = opts.m !== undefined ? opts.m : 7;

    function candidatos(fi) { var l = []; for (var x = 2; x < fi; x++) if (mdc(x, fi) === 1) l.push(x); return l; }
    function preencheE(manter) {
      var p = +sp.value, q = +sq.value, fi = (p - 1) * (q - 1), c = candidatos(fi), ant = se.value;
      se.innerHTML = '';
      c.forEach(function (x) { var o = A.el('option'); o.value = x; o.textContent = x; se.appendChild(o); });
      if (manter && c.indexOf(+ant) >= 0) se.value = ant;
    }
    function passo(cls, form, res) {
      return '<div class="rsa-passo ' + cls + '"><span class="f">' + form + '</span><span class="r">' + res + '</span></div>';
    }
    function upd() {
      var p = +sp.value, q = +sq.value, av = A.$('.rsa-aviso', body), box = A.$('.rsa-passos', body);
      if (p === q) { box.innerHTML = ''; av.style.color = 'var(--bad)'; av.textContent = '⚠ p e q precisam ser primos diferentes.'; return; }
      var n = p * q, fi = (p - 1) * (q - 1), e = +se.value;
      var d = 1; while ((e * d) % fi !== 1) d++;
      var m = Math.trunc(+im.value);
      var h = '';
      h += passo('sec', 'escolher dois primos diferentes', 'p = ' + p + ', q = ' + q);
      h += passo('pub', 'n = p · q = ' + p + ' · ' + q, 'n = ' + n);
      h += passo('sec', 'φ(n) = (p − 1)(q − 1) = ' + (p - 1) + ' · ' + (q - 1), 'φ = ' + fi);
      h += passo('pub', '1 &lt; e &lt; φ e mdc(e, ' + fi + ') = 1 → candidatos ' + candidatos(fi).slice(0, 8).join(', ') + (candidatos(fi).length > 8 ? ', …' : ''), 'e = ' + e);
      h += passo('sec', '(e · d) mod φ = 1 → (' + e + ' · ' + d + ') mod ' + fi + ' = ' + ((e * d) % fi), 'd = ' + d);
      h += passo('pub', 'chave pública (e, n) · chave privada (d, n)', '(' + e + ', ' + n + ') · (' + d + ', ' + n + ')');
      if (!(m >= 0 && m < n)) {
        box.innerHTML = h;
        av.style.color = 'var(--bad)';
        av.textContent = '⚠ A mensagem m precisa ser um inteiro de 0 até ' + (n - 1) + ' (menor que n). Para o mod n, ' + m + ' e ' + (((m % n) + n) % n) + ' seriam o mesmo número.';
        return;
      }
      var c = powmod(m, e, n), volta = powmod(c, d, n);
      h += passo('pub', 'cifrar: c = m<sup>e</sup> mod n = ' + m + '<sup>' + e + '</sup> mod ' + n, 'c = ' + c);
      h += passo('sec', 'decifrar: m = c<sup>d</sup> mod n = ' + c + '<sup>' + d + '</sup> mod ' + n, 'm = ' + volta);
      box.innerHTML = h;
      av.style.color = volta === m ? 'var(--ok)' : 'var(--bad)';
      av.textContent = volta === m ? '✔ Decifrou de volta a mensagem original (' + m + ').' : '✘ Algo deu errado.';
    }
    sp.onchange = sq.onchange = function () { preencheE(true); upd(); };
    se.onchange = upd;
    im.addEventListener('input', upd);
    preencheE(false);
    if (opts.e) se.value = opts.e;
    upd();
  };
})(window.ALG);
