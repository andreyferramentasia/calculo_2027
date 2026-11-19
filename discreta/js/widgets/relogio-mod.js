/* =========================================================
   WIDGET: relógio do mod — a mod n é contar em círculo
   ========================================================= */
(function (A) {
  A.widgets.relogioMod = function (host, opts) {
    opts = opts || {};
    var body = A.widgetBox(host, 'Relógio do resto: a % n');
    body.innerHTML =
      '<div class="widget-row">' +
      '  <label class="field">a (quantos passos) <input type="range" min="0" max="60" class="ra"><output></output></label>' +
      '  <label class="field">n (tamanho do relógio) <input type="range" min="2" max="24" class="rn"><output></output></label>' +
      '  <button class="btn sm rgo" type="button">▶ Andar passo a passo</button>' +
      '</div>' +
      '<div class="relogio"><svg viewBox="0 0 220 220"><g class="marcas"></g><line class="ponteiro" x1="110" y1="110" x2="110" y2="42"/><circle cx="110" cy="110" r="7" fill="var(--ink)"/></svg>' +
      '<div><div class="pycall rpy"></div><div class="result-line rres"></div><p class="muted rtip" style="font-size:.9rem;margin:6px 0 0"></p></div></div>';
    var ia = A.$('.ra', body), inn = A.$('.rn', body), go = A.$('.rgo', body);
    ia.value = opts.a !== undefined ? opts.a : 27;
    inn.value = opts.n || 24;
    var anim = null, mostrado = null;

    function desenha(passo) {
      var a = +ia.value, n = +inn.value;
      var atual = passo === null ? a : passo;
      ia.nextElementSibling.textContent = a;
      inn.nextElementSibling.textContent = n;
      var h = '';
      for (var k = 0; k < n; k++) {
        var ang = (k / n) * 2 * Math.PI - Math.PI / 2;
        var x = 110 + 86 * Math.cos(ang), y = 110 + 86 * Math.sin(ang);
        var cls = 'marca' + (k === atual % n ? ' aqui' : (atual >= n || k < atual % n) ? ' passou' : '');
        h += '<circle class="' + cls + '" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (n > 16 ? 11 : 14) + '"/><text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '">' + k + '</text>';
      }
      A.$('.marcas', body).innerHTML = h;
      A.$('.ponteiro', body).style.transform = 'rotate(' + ((atual % n) / n * 360) + 'deg)';
      var q = Math.floor(atual / n), r = atual % n;
      A.$('.rpy', body).innerHTML = A.highlight('print(' + atual + ' % ' + n + ', ' + atual + ' // ' + n + ')');
      A.$('.rres', body).innerHTML = '<span class="lbl">' + atual + ' = ' + q + ' · ' + n + ' + </span><b>' + r + '</b> &nbsp; <span class="lbl">→ resto</span> <b>' + r + '</b><span class="lbl">, voltas completas</span> <b>' + q + '</b>';
      A.$('.rtip', body).innerHTML = passo === null
        ? 'Andar <b>' + a + '</b> casas num relógio de <b>' + n + '</b> posições para no <b>' + r + '</b>. Por isso ' + a + ' ≡ ' + r + ' (mod ' + n + ').'
        : 'Passo ' + atual + ' de ' + a + '…';
    }
    function para() { if (anim) { clearInterval(anim); anim = null; go.textContent = '▶ Andar passo a passo'; } }
    go.onclick = function () {
      if (anim) { para(); desenha(null); return; }
      mostrado = 0; go.textContent = '■ Parar';
      desenha(0);
      anim = setInterval(function () {
        if (!body.isConnected) return para();
        mostrado++;
        if (mostrado >= +ia.value) { para(); desenha(null); return; }
        desenha(mostrado);
      }, Math.max(60, 2400 / Math.max(1, +ia.value)));
    };
    [ia, inn].forEach(function (x) { x.addEventListener('input', function () { para(); desenha(null); }); });
    desenha(null);
  };
})(window.ALG);
