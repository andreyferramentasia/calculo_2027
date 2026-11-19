/* =========================================================
   WIDGET: explorador de matriz  —  m[i][j], linhas e colunas
   ========================================================= */
(function (A) {
  A.widgets.matrix = function (host) {
    var body = A.widgetBox(host, 'Explorador de matriz: passe o mouse (ou toque) nas células');
    body.innerHTML =
      '<div class="widget-row">' +
      '  <label class="field">linhas <input type="range" min="1" max="5" value="3"><output></output></label>' +
      '  <label class="field">colunas <input type="range" min="1" max="6" value="4"><output></output></label>' +
      '  <button class="btn sm mx-rand">🎲 valores aleatórios</button>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:auto minmax(0,1fr);gap:24px;align-items:start" class="mx-wrap">' +
      '  <div class="mx-grid"></div>' +
      '  <div class="mx-info"></div>' +
      '</div>';
    var ins = A.$$('input[type=range]', body);
    var gridBox = A.$('.mx-grid', body), info = A.$('.mx-info', body);
    var m = [], sel = [1, 2], rand = false, rng = A.rng(7);

    function build() {
      var L = +ins[0].value, C = +ins[1].value;
      ins[0].nextElementSibling.textContent = L;
      ins[1].nextElementSibling.textContent = C;
      m = [];
      for (var i = 0; i < L; i++) {
        m.push([]);
        for (var j = 0; j < C; j++) m[i].push(rand ? Math.floor(rng() * 90) + 10 : i * C + j + 1);
      }
      sel = [Math.min(sel[0], L - 1), Math.min(sel[1], C - 1)];
      draw();
    }
    function draw() {
      var L = m.length, C = m[0].length;
      var html = '<div class="vm-grid" style="grid-template-columns:16px repeat(' + C + ',42px)"><div class="vm-idx"></div>';
      for (var j = 0; j < C; j++) html += '<div class="vm-idx" style="color:var(--t-fn)">' + j + '</div>';
      for (var i = 0; i < L; i++) {
        html += '<div class="vm-idx" style="color:var(--t-int)">' + i + '</div>';
        for (j = 0; j < C; j++) {
          var cls = 'vm-cell';
          if (i === sel[0]) cls += ' row';
          if (j === sel[1]) cls += ' col';
          if (i === sel[0] && j === sel[1]) cls += ' hl';
          html += '<div class="' + cls + '" data-i="' + i + '" data-j="' + j + '" style="cursor:pointer">' + m[i][j] + '</div>';
        }
      }
      gridBox.innerHTML = html + '</div>';
      var i0 = sel[0], j0 = sel[1];
      var col = m.map(function (r) { return r[j0]; });
      info.innerHTML =
        '<div class="result-line"><span class="lbl">m[' + i0 + '][' + j0 + '] →</span> <b style="background:var(--acc);color:#17171c;padding:0 7px;border-radius:6px;border:2px solid var(--ink)">' + m[i0][j0] + '</b></div>' +
        '<div class="result-line"><span class="lbl" style="color:var(--t-int)">m[' + i0 + '] (linha) →</span> <b>' + A.repr(m[i0]) + '</b></div>' +
        '<div class="result-line"><span class="lbl" style="color:var(--t-fn)">[l[' + j0 + '] for l in m] (coluna) →</span> <b>' + A.repr(col) + '</b></div>' +
        '<div class="result-line"><span class="lbl">len(m) →</span> <b>' + L + '</b> <span class="muted">(linhas)</span></div>' +
        '<div class="result-line"><span class="lbl">len(m[0]) →</span> <b>' + C + '</b> <span class="muted">(colunas)</span></div>' +
        '<div class="result-line"><span class="lbl">sum(m[' + i0 + ']) →</span> <b>' + m[i0].reduce(function (a, b) { return a + b; }, 0) + '</b></div>' +
        '<div class="codeblock" style="margin-top:12px"><pre style="padding:10px 14px">' + A.highlight('m = ' + A.repr(m).replace(/\], \[/g, '],\n     [')) + '</pre></div>';
    }
    gridBox.addEventListener('mouseover', pick);
    gridBox.addEventListener('click', pick);
    function pick(e) {
      var c = e.target.closest('.vm-cell');
      if (!c) return;
      var ni = +c.dataset.i, nj = +c.dataset.j;
      if (ni === sel[0] && nj === sel[1]) return;
      sel = [ni, nj];
      draw();
    }
    ins.forEach(function (i) { i.addEventListener('input', build); });
    A.$('.mx-rand', body).onclick = function () { rand = !rand; build(); };
    build();
  };
})(window.ALG);
