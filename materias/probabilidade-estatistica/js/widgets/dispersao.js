/* =========================================================
   WIDGET: diagrama de dispersão, correlação e reta (Aulas 7 e 8)
   Clique no gráfico para pôr pontos. Com opts.reta, mostra a
   reta de regressão e faz previsões (avisando extrapolação).
   ========================================================= */
(function (A) {
  var E = A.est;
  var CONJ = {
    seguidores: { t: 'Seguidores (mil) x curtidas', x: [5, 10, 15, 22, 30, 38, 45, 55, 65, 80], y: [180, 150, 330, 240, 300, 560, 420, 700, 540, 820], ex: 'seguidores (mil)', ey: 'curtidas' },
    wifi: { t: 'Wi-Fi (Mbps) x carregamento (s)', x: [10, 20, 30, 50, 80], y: [25, 18, 14, 9, 5], ex: 'Mbps', ey: 'segundos' },
    celular: { t: 'Horas de celular x notificações', x: [2, 3, 4, 5, 6], y: [10, 12, 15, 14, 20], ex: 'horas', ey: 'notificações' },
    stories: { t: 'Stories x respostas', x: [2, 4, 6], y: [3, 5, 4], ex: 'stories', ey: 'respostas' },
    nada: { t: 'Sem relação', x: [1, 2, 3, 4, 5, 6, 7, 8], y: [5, 2, 7, 3, 6, 1, 5, 4], ex: 'x', ey: 'y' }
  };

  A.widgets.dispersao = function (host, opts) {
    opts = opts || {};
    var comReta = !!opts.reta;
    var body = A.widgetBox(host, comReta ? 'Reta de regressão e previsão' : 'Diagrama de dispersão e correlação');
    body.innerHTML =
      '<div class="widget-row">' +
      '  <label class="field">dados <select class="sc"></select></label>' +
      '  <button class="btn sm ghost slimpa" type="button">limpar pontos</button>' +
      (comReta ? '  <label class="field">prever y para x = <input type="number" class="sx" style="width:100px"></label>' : '') +
      '</div>' +
      '<svg class="est-svg" viewBox="0 0 640 300" role="img" aria-label="Diagrama de dispersão" style="cursor:crosshair"></svg>' +
      '<p class="muted" style="font-size:.85rem;margin:0 0 6px">Clique no gráfico para acrescentar um ponto.</p>' +
      '<div class="est-nums snums"></div>' +
      '<div class="pycall spy"></div>';
    var sel = A.$('.sc', body), svg = A.$('svg', body), iX = A.$('.sx', body);
    Object.keys(CONJ).forEach(function (k) { var o = A.el('option'); o.value = k; o.textContent = CONJ[k].t; sel.appendChild(o); });
    sel.value = opts.dados || 'seguidores';
    var xs, ys, esc, rot;
    function carrega() {
      var c = CONJ[sel.value];
      xs = c.x.slice(); ys = c.y.slice(); rot = c;
      var mxX = Math.max.apply(null, xs), mxY = Math.max.apply(null, ys);
      esc = { x0: 0, x1: mxX * 1.25, y0: 0, y1: mxY * 1.2 };
      if (iX) iX.value = Math.round((Math.min.apply(null, xs) + mxX) / 2);
    }
    function PX(x) { return 60 + (x - esc.x0) / (esc.x1 - esc.x0) * 560; }
    function PY(y) { return 260 - (y - esc.y0) / (esc.y1 - esc.y0) * 240; }
    svg.addEventListener('click', function (e) {
      var r = svg.getBoundingClientRect(), sx = (e.clientX - r.left) / r.width * 640, sy = (e.clientY - r.top) / r.height * 300;
      if (sx < 60 || sx > 620 || sy < 20 || sy > 260) return;
      var x = esc.x0 + (sx - 60) / 560 * (esc.x1 - esc.x0), y = esc.y0 + (260 - sy) / 240 * (esc.y1 - esc.y0);
      xs.push(Math.round(x * 10) / 10); ys.push(Math.round(y * 10) / 10);
      upd();
    });
    A.$('.slimpa', body).onclick = function () { xs = []; ys = []; upd(); };
    function upd() {
      var h = '<line class="eixo" x1="60" y1="260" x2="620" y2="260"/><line class="eixo" x1="60" y1="20" x2="60" y2="260"/>';
      for (var i = 0; i <= 4; i++) {
        var vx = esc.x0 + (esc.x1 - esc.x0) * i / 4, vy = esc.y0 + (esc.y1 - esc.y0) * i / 4;
        h += '<text x="' + PX(vx) + '" y="278" text-anchor="middle">' + E.fmt(vx, 1) + '</text><line class="grade" x1="60" y1="' + PY(vy) + '" x2="620" y2="' + PY(vy) + '"/><text x="54" y="' + (PY(vy) + 4) + '" text-anchor="end">' + E.fmt(vy, 0) + '</text>';
      }
      h += '<text x="620" y="296" text-anchor="end" fill="var(--muted)">' + A.esc(rot.ex) + '</text><text x="64" y="14" fill="var(--muted)">' + A.esc(rot.ey) + '</text>';
      var n = xs.length, nums = '<span>n = <b>' + n + '</b> pares</span>', py = '';
      if (n >= 2) {
        var reg = E.regressao(xs, ys), r = reg.r;
        nums += '<span class="m">r = <b>' + E.fmt(r, 4) + '</b></span><span>relação <b>' + E.forca(r) + '</b></span>';
        py = A.highlight('x = [' + xs.map(E.py).join(', ') + ']') + '<br>' + A.highlight('y = [' + ys.map(E.py).join(', ') + ']') + '<br>' +
          A.highlight('print(statistics.correlation(x, y))  # ' + E.fmt(r, 4).replace(',', '.'));
        if (comReta) {
          var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
          h = '<rect class="extrap" x="60" y="20" width="' + (PX(minX) - 60) + '" height="240"/><rect class="extrap" x="' + PX(maxX) + '" y="20" width="' + (620 - PX(maxX)) + '" height="240"/>' + h;
          var y0 = reg.m * esc.x0 + reg.b, y1 = reg.m * esc.x1 + reg.b;
          h += '<line class="reta" x1="' + PX(esc.x0) + '" y1="' + PY(y0) + '" x2="' + PX(esc.x1) + '" y2="' + PY(y1) + '"/>';
          nums += '<span>m = r·s<sub>y</sub>/s<sub>x</sub> = <b>' + E.fmt(reg.m, 4) + '</b></span><span>b = ȳ − m·x̄ = <b>' + E.fmt(reg.b, 4) + '</b></span>';
          var xp = +iX.value;
          if (iX.value !== '' && isFinite(xp)) {
            var yp = reg.m * xp + reg.b, fora = xp < minX || xp > maxX;
            if (xp >= esc.x0 && xp <= esc.x1) h += '<circle cx="' + PX(xp) + '" cy="' + PY(yp) + '" r="9" fill="var(--pink)" stroke="var(--ink)" stroke-width="2.5"/>';
            nums += '<span class="' + (fora ? 'alerta' : 'ok') + '">previsão: y = ' + E.fmt(reg.m, 4) + ' · ' + E.fmt(xp, 2) + ' + ' + E.fmt(reg.b, 4) + ' = <b>' + E.fmt(yp, 2) + '</b>' + (fora ? ' ⚠ extrapolação (x fora de ' + E.fmt(minX, 1) + ' a ' + E.fmt(maxX, 1) + ')' : ' (dentro dos dados)') + '</span>';
          }
          py += '<br>' + A.highlight('reta = statistics.linear_regression(x, y)');
          if (Math.abs(r) < 0.5) nums += '<span class="alerta">|r| &lt; 0,50: a reta não deveria ser usada para prever</span>';
        }
      }
      xs.forEach(function (x, i) { h += '<circle class="ponto" cx="' + PX(x) + '" cy="' + PY(ys[i]) + '" r="7"/>'; });
      svg.innerHTML = h;
      A.$('.snums', body).innerHTML = nums;
      A.$('.spy', body).innerHTML = py || A.highlight('# acrescente pelo menos 2 pontos');
    }
    sel.addEventListener('change', function () { carrega(); upd(); });
    if (iX) iX.addEventListener('input', upd);
    carrega();
    upd();
  };
})(window.ALG);
