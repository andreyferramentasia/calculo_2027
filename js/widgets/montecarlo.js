/* =========================================================
   WIDGET: estimando π com pontos aleatórios (Monte Carlo)
   ========================================================= */
(function (A) {
  A.widgets.montecarlo = function (host) {
    var body = A.widgetBox(host, 'Estimando π com random (Monte Carlo)');
    body.innerHTML =
      '<div style="display:grid;grid-template-columns:auto minmax(0,1fr);gap:22px;align-items:start" class="mc-wrap">' +
      '  <canvas width="260" height="260" style="width:260px;height:260px;border-radius:10px;background:var(--bg2);max-width:100%"></canvas>' +
      '  <div>' +
      '    <div class="widget-row" style="gap:6px">' +
      '      <button class="btn sm" data-n="1">+1</button><button class="btn sm" data-n="100">+100</button>' +
      '      <button class="btn sm" data-n="1000">+1000</button><button class="btn sm primary" data-n="run">▶ chuva de pontos</button>' +
      '      <button class="btn sm ghost" data-n="reset">limpar</button>' +
      '    </div>' +
      '    <div class="mc-stats"></div>' +
      '    <p class="muted" style="font-size:.85rem">Cada ponto é <code>(random.random(), random.random())</code>. A fração que cai dentro do quarto de círculo tende a <b>π/4</b>. Quanto mais pontos, melhor a estimativa: é a <b>lei dos grandes números</b>.</p>' +
      '  </div>' +
      '</div>';
    var cv = A.$('canvas', body), g = cv.getContext('2d');
    var stats = A.$('.mc-stats', body);
    var total = 0, inside = 0, raf = null, rng = Math.random;

    function bg() {
      g.clearRect(0, 0, 260, 260);
      g.strokeStyle = A.cssVar('--line');
      g.strokeRect(0.5, 0.5, 259, 259);
      g.strokeStyle = A.cssVar('--acc');
      g.lineWidth = 2;
      g.beginPath(); g.arc(0, 260, 260, -Math.PI / 2, 0); g.stroke();
      g.lineWidth = 1;
    }
    function add(n) {
      var cIn = A.cssVar('--ok'), cOut = A.cssVar('--bad');
      for (var k = 0; k < n; k++) {
        var x = rng(), y = rng();
        var ok = x * x + y * y <= 1;
        if (ok) inside++;
        total++;
        g.fillStyle = ok ? cIn : cOut;
        g.globalAlpha = .8;
        g.fillRect(x * 260 - 1, 260 - y * 260 - 1, 2.4, 2.4);
      }
      g.globalAlpha = 1;
      show();
    }
    function show() {
      var est = total ? 4 * inside / total : 0;
      stats.innerHTML =
        '<div class="result-line"><span class="lbl">pontos →</span> <b>' + total + '</b></div>' +
        '<div class="result-line"><span class="lbl">dentro →</span> <b style="color:var(--ok)">' + inside + '</b></div>' +
        '<div class="result-line"><span class="lbl">π ≈ 4 · dentro / pontos →</span> <b style="color:var(--t-fn);font-size:1.3rem">' + (total ? est.toFixed(5) : '—') + '</b></div>' +
        '<div class="result-line"><span class="lbl">erro →</span> <b>' + (total ? Math.abs(est - Math.PI).toFixed(5) : '—') + '</b></div>';
    }
    body.addEventListener('click', function (e) {
      var b = e.target.closest('[data-n]');
      if (!b) return;
      var n = b.dataset.n;
      if (n === 'reset') { cancelAnimationFrame(raf); raf = null; total = inside = 0; bg(); show(); return; }
      if (n === 'run') {
        if (raf) { cancelAnimationFrame(raf); raf = null; b.textContent = '▶ chuva de pontos'; return; }
        b.textContent = '⏸ parar';
        (function loop() {
          if (!document.body.contains(cv) || total > 60000) { raf = null; b.textContent = '▶ chuva de pontos'; return; }
          add(40);
          raf = requestAnimationFrame(loop);
        })();
        return;
      }
      add(+n);
    });
    bg(); show();
  };
})(window.ALG);
