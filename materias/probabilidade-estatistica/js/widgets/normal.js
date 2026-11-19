/* =========================================================
   WIDGET: distribuição normal (Aula 6)
   Mexe em μ, σ e x: mostra a área (probabilidade), o escore Z
   e, se quiser, as faixas da Regra Empírica.
   ========================================================= */
(function (A) {
  var E = A.est;
  A.widgets.normal = function (host, opts) {
    opts = opts || {};
    var body = A.widgetBox(host, 'A curva normal na mão');
    body.innerHTML =
      '<div class="widget-row">' +
      '  <label class="field">média μ <input type="number" class="nmu" style="width:90px"></label>' +
      '  <label class="field">desvio-padrão σ <input type="number" min="0.1" step="0.5" class="nsd" style="width:90px"></label>' +
      '  <label class="field">x <input type="range" class="nx"><output></output></label>' +
      '  <label class="field">probabilidade de <select class="nmodo"><option value="menor">X &lt; x</option><option value="maior">X &gt; x</option></select></label>' +
      '  <label class="field">Regra Empírica <select class="nreg"><option value="0">esconder</option><option value="1">mostrar 68-95-99,7</option></select></label>' +
      '</div>' +
      '<svg class="est-svg" viewBox="0 0 640 240" role="img" aria-label="Curva normal"></svg>' +
      '<div class="est-nums nnums"></div>' +
      '<div class="pycall npy"></div>';
    var iMu = A.$('.nmu', body), iSd = A.$('.nsd', body), iX = A.$('.nx', body), iM = A.$('.nmodo', body), iR = A.$('.nreg', body), svg = A.$('svg', body);
    iMu.value = opts.mu !== undefined ? opts.mu : 60; iSd.value = opts.sd || 15;
    function limites() {
      var mu = +iMu.value || 0, sd = Math.max(0.1, +iSd.value || 1);
      iX.min = mu - 3.5 * sd; iX.max = mu + 3.5 * sd; iX.step = sd / 20;
      return { mu: mu, sd: sd };
    }
    var L = limites();
    iX.value = opts.x !== undefined ? opts.x : L.mu + 2 * L.sd;
    function upd() {
      var mu = L.mu, sd = L.sd, x = +iX.value;
      iX.nextElementSibling.textContent = E.fmt(x, 1);
      var lo = mu - 3.8 * sd, hi = mu + 3.8 * sd, pico = E.densidade(mu, mu, sd);
      function X(v) { return 20 + (v - lo) / (hi - lo) * 600; }
      function Y(d) { return 200 - d / pico * 170; }
      var pts = [], area = [], maior = iM.value === 'maior';
      for (var i = 0; i <= 200; i++) {
        var v = lo + (hi - lo) * i / 200, p = X(v) + ' ' + Y(E.densidade(v, mu, sd));
        pts.push(p);
        if (maior ? v >= x : v <= x) area.push(p);
      }
      var h = '';
      if (iR.value === '1') {
        [[3, '99,7%', .06], [2, '95%', .1], [1, '68%', .16]].forEach(function (f) {
          h += '<rect x="' + X(mu - f[0] * sd) + '" y="22" width="' + (X(mu + f[0] * sd) - X(mu - f[0] * sd)) + '" height="178" fill="var(--acc2)" fill-opacity="' + f[2] + '"/>' +
            '<text x="' + X(mu + f[0] * sd) + '" y="' + (30 + (3 - f[0]) * 14) + '" text-anchor="end">' + f[1] + ' </text>';
        });
      }
      if (area.length) {
        var a0 = maior ? X(x) : X(lo), a1 = maior ? X(hi) : X(x);
        h += '<path class="area" d="M' + a0 + ' 200 L' + area.join(' L') + ' L' + a1 + ' 200 Z"/>';
      }
      h += '<path class="linha" d="M' + pts.join(' L') + '"/><line class="eixo" x1="20" y1="200" x2="620" y2="200"/>';
      for (var k = -3; k <= 3; k++) h += '<line class="grade" x1="' + X(mu + k * sd) + '" y1="196" x2="' + X(mu + k * sd) + '" y2="204"/><text x="' + X(mu + k * sd) + '" y="218" text-anchor="middle">' + E.fmt(mu + k * sd, 1) + '</text><text x="' + X(mu + k * sd) + '" y="234" text-anchor="middle" fill="var(--muted)">z=' + k + '</text>';
      h += '<line x1="' + X(x) + '" y1="24" x2="' + X(x) + '" y2="200" stroke="var(--pink)" stroke-width="3"/>';
      svg.innerHTML = h;
      var z = (x - mu) / sd, pMenor = E.phi(z), p = maior ? 1 - pMenor : pMenor;
      A.$('.nnums', body).innerHTML =
        '<span>z = (x − μ) / σ = (' + E.fmt(x, 1) + ' − ' + E.fmt(mu, 1) + ') / ' + E.fmt(sd, 1) + ' = <b>' + E.fmt(z, 2) + '</b></span>' +
        '<span>p(Z &lt; ' + E.fmt(z, 2) + ') = <b>' + E.fmt(pMenor, 4) + '</b></span>' +
        (maior ? '<span>p(X &gt; x) = 1 − ' + E.fmt(pMenor, 4) + ' = <b>' + E.fmt(p, 4) + '</b></span>' : '') +
        '<span class="ok">≈ <b>' + E.fmt(p * 100, 2) + '%</b> da área</span>';
      A.$('.npy', body).innerHTML = A.highlight('d = statistics.NormalDist(' + E.py(mu) + ', ' + E.py(sd) + ')') + '<br>' +
        A.highlight('print(' + (maior ? '1 - ' : '') + 'd.cdf(' + E.py(Math.round(x * 100) / 100) + '))');
    }
    [iMu, iSd].forEach(function (i) { i.addEventListener('input', function () { var old = (+iX.value - L.mu) / L.sd; L = limites(); iX.value = L.mu + old * L.sd; upd(); }); });
    [iX, iM, iR].forEach(function (i) { i.addEventListener('input', upd); });
    upd();
  };
})(window.ALG);
