/* =========================================================
   WIDGET: numpy reshape / transposta com animação
   ========================================================= */
(function (A) {
  var N = 12, S = 38, G = 6;
  var SHAPES = [[1, 12, '(12,)'], [2, 6, '(2, 6)'], [3, 4, '(3, 4)'], [4, 3, '(4, 3)'], [6, 2, '(6, 2)'], [12, 1, '(12, 1)']];

  A.widgets.reshape = function (host) {
    var body = A.widgetBox(host, 'np.arange(12).reshape(...) — veja os elementos se reorganizarem', 'NUMPY');
    body.innerHTML =
      '<div class="widget-row rs-btns" style="gap:6px"></div>' +
      '<div class="widget-row"><button class="btn sm rs-t">↔ transpor (.T)</button><span class="muted" style="font-size:.85rem">O <b>total de elementos</b> precisa continuar 12: linhas × colunas = 12.</span></div>' +
      '<div class="pycall rs-code"></div>' +
      '<div style="overflow-x:auto"><div class="rs-stage" style="position:relative;transition:height .5s,width .5s"></div></div>' +
      '<div class="codeblock"><div class="cb-head"><span>print(a)</span></div><pre class="rs-out" style="padding:10px 16px"></pre></div>';
    var stage = A.$('.rs-stage', body), code = A.$('.rs-code', body), out = A.$('.rs-out', body);
    var cur = 2, T = false;
    var cells = [];
    for (var k = 0; k < N; k++) {
      var c = A.el('div');
      c.textContent = k;
      c.style.cssText = 'position:absolute;left:0;top:0;width:' + S + 'px;height:' + S + 'px;display:grid;place-items:center;border-radius:8px;' +
        'font-family:var(--mono);font-weight:700;font-size:.85rem;color:#0b1020;transition:transform .7s cubic-bezier(.5,0,.2,1.15);' +
        'background:hsl(' + (200 + k * 12) + ' 80% 66%)';
      stage.appendChild(c);
      cells.push(c);
    }
    var btns = A.$('.rs-btns', body);
    SHAPES.forEach(function (s, i) {
      var b = A.el('button', 'btn sm mono', s[2]);
      b.onclick = function () { cur = i; T = false; upd(); };
      btns.appendChild(b);
    });
    A.$('.rs-t', body).onclick = function () {
      if (cur === 0) { A.toast('Em um vetor 1D, .T não muda nada!'); return; }
      T = !T; upd();
    };

    function upd() {
      var r = SHAPES[cur][0], c = SHAPES[cur][1];
      var rows = T ? c : r, cols = T ? r : c;
      cells.forEach(function (el, k) {
        var i = Math.floor(k / c), j = k % c;
        if (T) { var t = i; i = j; j = t; }
        el.style.transform = 'translate(' + (j * (S + G)) + 'px,' + (i * (S + G)) + 'px)';
        el.style.transitionDelay = (k * 25) + 'ms';
      });
      stage.style.width = (cols * (S + G)) + 'px';
      stage.style.height = (rows * (S + G)) + 'px';
      A.$$('button', btns).forEach(function (b, i) { b.classList.toggle('primary', i === cur); });
      var expr = cur === 0 ? 'a = np.arange(12)' : 'a = np.arange(12).reshape(' + r + ', ' + c + ')';
      if (T) expr += '.T';
      code.innerHTML = A.highlight(expr) + '   <span class="muted"># a.shape = ' + (cur === 0 ? '(12,)' : '(' + rows + ', ' + cols + ')') + '</span>';
      // texto impresso
      var mat = [];
      for (var i = 0; i < rows; i++) {
        mat.push([]);
        for (var j = 0; j < cols; j++) {
          mat[i].push(T ? j * c + i : i * c + j);
        }
      }
      out.textContent = cur === 0 ? A.npStr(mat[0] || [], ' ', true) : A.npStr(mat, ' ', true);
    }
    upd();
  };
})(window.ALG);
