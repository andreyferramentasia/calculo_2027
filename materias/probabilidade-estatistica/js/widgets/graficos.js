/* =========================================================
   WIDGETS da Aula 4
   pizzaBarras: as mesmas categorias em pizza e em barras
   eixo:        o mesmo dado com o eixo começando em 0 ou cortado
   ========================================================= */
(function (A) {
  var E = A.est;
  var CORES = ['#ff7aa6', '#8fb8ff', '#ffcf33', '#b6f26b', '#c4a8ff', '#ff8a3d'];

  A.widgets.pizzaBarras = function (host, opts) {
    opts = opts || {};
    var cats = opts.cats || [['Carro', 16], ['Ônibus', 12], ['A pé', 6], ['Bicicleta', 4], ['Outro', 2]];
    var body = A.widgetBox(host, 'Pizza ou barras? Mexa nas quantidades');
    body.innerHTML =
      '<div class="est-duplo"><svg class="est-svg ppie" viewBox="-130 -130 260 260" role="img" aria-label="Gráfico de pizza"></svg>' +
      '<div><div class="est-cats"></div></div></div>' +
      '<svg class="est-svg pbar" viewBox="0 0 640 200" role="img" aria-label="Gráfico de barras"></svg>' +
      '<div class="est-nums pnums"></div>';
    var box = A.$('.est-cats', body);
    cats.forEach(function (c, i) {
      var l = A.el('label');
      l.innerHTML = '<span class="cor" style="background:' + CORES[i] + '"></span><input type="text" aria-label="categoria"><input type="number" min="0" aria-label="quantidade">';
      A.$$('input', l)[0].value = c[0]; A.$$('input', l)[1].value = c[1];
      box.appendChild(l);
    });
    function upd() {
      var dados = A.$$('label', box).map(function (l) { var i = A.$$('input', l); return { nome: i[0].value || '—', q: Math.max(0, +i[1].value || 0) }; });
      var total = dados.reduce(function (a, d) { return a + d.q; }, 0);
      // pizza
      var h = '', ang = -Math.PI / 2;
      if (!total) h = '<circle r="110" fill="var(--panel2)" stroke="var(--ink)" stroke-width="3"/>';
      dados.forEach(function (d, i) {
        if (!d.q) return;
        var a = d.q / total * 2 * Math.PI, a2 = ang + a;
        var x1 = 110 * Math.cos(ang), y1 = 110 * Math.sin(ang), x2 = 110 * Math.cos(a2), y2 = 110 * Math.sin(a2);
        h += a >= 2 * Math.PI - 1e-9
          ? '<circle r="110" fill="' + CORES[i] + '" stroke="var(--ink)" stroke-width="3"/>'
          : '<path d="M0 0 L' + x1 + ' ' + y1 + ' A110 110 0 ' + (a > Math.PI ? 1 : 0) + ' 1 ' + x2 + ' ' + y2 + ' Z" fill="' + CORES[i] + '" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>';
        var mid = ang + a / 2;
        if (d.q / total >= 0.05) h += '<text x="' + 70 * Math.cos(mid) + '" y="' + (70 * Math.sin(mid) + 4) + '" text-anchor="middle" fill="#17171c">' + Math.round(d.q / total * 100) + '%</text>';
        ang = a2;
      });
      A.$('.ppie', body).innerHTML = h;
      // barras
      var mx = Math.max.apply(null, dados.map(function (d) { return d.q; }).concat([1]));
      var w = 560 / dados.length, b = '<line class="eixo" x1="40" y1="160" x2="620" y2="160"/>';
      dados.forEach(function (d, i) {
        var bh = d.q / mx * 130;
        b += '<rect x="' + (50 + i * w) + '" y="' + (160 - bh) + '" width="' + (w - 20) + '" height="' + bh + '" fill="' + CORES[i] + '" stroke="var(--ink)" stroke-width="2.5"/>' +
          '<text x="' + (50 + i * w + (w - 20) / 2) + '" y="' + (154 - bh) + '" text-anchor="middle">' + d.q + '</text>' +
          '<text x="' + (50 + i * w + (w - 20) / 2) + '" y="180" text-anchor="middle">' + A.esc(d.nome.slice(0, 12)) + '</text>';
      });
      A.$('.pbar', body).innerHTML = b;
      A.$('.pnums', body).innerHTML = '<span>n = <b>' + total + '</b></span>' + dados.filter(function (d) { return d.q; }).map(function (d) {
        var p = d.q / total * 100;
        return '<span>' + A.esc(d.nome) + ': <b>' + E.fmt(p, 1) + '%</b> = ' + E.fmt(p * 3.6, 1) + '°</span>';
      }).join('');
    }
    A.$$('input', box).forEach(function (i) { i.addEventListener('input', upd); });
    upd();
  };

  A.widgets.eixo = function (host, opts) {
    opts = opts || {};
    var vals = opts.vals || [['Janeiro', 89], ['Março', 91]];
    var body = A.widgetBox(host, 'O eixo que engana');
    body.innerHTML =
      '<div class="widget-row"><label class="field">o eixo vertical começa em <input type="range" min="0" max="' + (Math.min(vals[0][1], vals[1][1]) - 1) + '" value="0" class="ei"><output></output></label></div>' +
      '<svg class="est-svg" viewBox="0 0 640 230" role="img" aria-label="Gráfico de barras com eixo ajustável"></svg>' +
      '<p class="etip" style="margin:4px 0 0;font-weight:600"></p>';
    var inp = A.$('.ei', body), svg = A.$('svg', body);
    function upd() {
      var z = +inp.value, top = Math.max(vals[0][1], vals[1][1]) + 1;
      inp.nextElementSibling.textContent = z;
      function Y(v) { return 190 - (v - z) / (top - z) * 160; }
      var h = '<line class="eixo" x1="70" y1="20" x2="70" y2="190"/><line class="eixo" x1="70" y1="190" x2="600" y2="190"/>';
      [z, (z + top) / 2, top].forEach(function (t) { h += '<line class="grade" x1="70" y1="' + Y(t) + '" x2="600" y2="' + Y(t) + '"/><text x="62" y="' + (Y(t) + 4) + '" text-anchor="end">' + E.fmt(t, 1) + '</text>'; });
      vals.forEach(function (v, i) {
        var x = 150 + i * 240;
        h += '<rect x="' + x + '" y="' + Y(v[1]) + '" width="140" height="' + (190 - Y(v[1])) + '" fill="' + (i ? '#ff7aa6' : '#8fb8ff') + '" stroke="var(--ink)" stroke-width="2.5"/>' +
          '<text x="' + (x + 70) + '" y="' + (Y(v[1]) - 8) + '" text-anchor="middle">' + v[1] + '%</text><text x="' + (x + 70) + '" y="210" text-anchor="middle">' + v[0] + '</text>';
      });
      svg.innerHTML = h;
      var r = (vals[1][1] - z) / (vals[0][1] - z);
      A.$('.etip', body).innerHTML = z === 0
        ? '✔ Eixo começando em 0: a diferença real (' + vals[0][1] + '% → ' + vals[1][1] + '%) parece pequena, como é.'
        : '⚠ Eixo cortado em ' + z + ': a barra de ' + vals[1][0] + ' parece <b>' + E.fmt(r, 1) + '×</b> maior, mas a diferença real é de só ' + (vals[1][1] - vals[0][1]) + ' pontos.';
    }
    inp.addEventListener('input', upd);
    upd();
  };
})(window.ALG);
