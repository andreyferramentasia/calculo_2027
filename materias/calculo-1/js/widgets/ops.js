/* =========================================================
   WIDGETS: calculadora de operadores + tabela-verdade
   ========================================================= */
(function (A) {
  function pyNum(v, isFloat) { return isFloat ? A.F(v) : v; }

  A.widgets.ops = function (host) {
    var body = A.widgetBox(host, 'Laboratório de operadores');
    body.innerHTML =
      '<div class="widget-row">' +
      '  <label class="field">a = <input type="text" value="17" style="width:110px"></label>' +
      '  <label class="field">b = <input type="text" value="5" style="width:110px"></label>' +
      '  <span class="muted" style="font-size:.85rem">Experimente negativos (-17), floats (2.5) e zero.</span>' +
      '</div>' +
      '<div style="overflow-x:auto"><table class="ops-t"><thead><tr><th>expressão</th><th>resultado</th><th>tipo</th><th>significado</th></tr></thead><tbody></tbody></table></div>';
    var ia = A.$$('input', body)[0], ib = A.$$('input', body)[1];
    var tb = A.$('tbody', body);
    var OPS = [
      ['a + b', 'soma'],
      ['a - b', 'subtração'],
      ['a * b', 'multiplicação'],
      ['a / b', 'divisão real (sempre float)'],
      ['a // b', 'divisão inteira (arredonda para baixo)'],
      ['a % b', 'resto da divisão (módulo)'],
      ['a ** b', 'potência'],
      ['a == b', 'igual?'],
      ['a != b', 'diferente?'],
      ['a > b', 'maior?'],
      ['a <= b', 'menor ou igual?']
    ];
    function calc(op, a, b, fl) {
      var Z = { err: 'ZeroDivisionError' };
      switch (op) {
        case 'a + b': return pyNum(a + b, fl);
        case 'a - b': return pyNum(a - b, fl);
        case 'a * b': return pyNum(a * b, fl);
        case 'a / b': return b === 0 ? Z : A.F(a / b);
        case 'a // b': return b === 0 ? Z : pyNum(Math.floor(a / b), fl);
        case 'a % b': return b === 0 ? Z : pyNum(a - b * Math.floor(a / b), fl);
        case 'a ** b':
          var r = Math.pow(a, b);
          if (!isFinite(r) || Math.abs(r) > 1e300) return { err: 'número enorme!' };
          return pyNum(r, fl || b < 0 || !Number.isInteger(r));
        case 'a == b': return a === b;
        case 'a != b': return a !== b;
        case 'a > b': return a > b;
        case 'a <= b': return a <= b;
      }
    }
    function upd() {
      var pa = A.parseNum(ia.value), pb = A.parseNum(ib.value);
      if (!pa || !pb) { tb.innerHTML = '<tr><td colspan="4" style="color:var(--bad)">Digite números válidos (use ponto para decimais).</td></tr>'; return; }
      var fl = pa.float || pb.float;
      tb.innerHTML = OPS.map(function (o) {
        var r = calc(o[0], pa.v, pb.v, fl);
        var res = r && r.err ? '<span style="color:var(--bad)">' + r.err + '</span>' : '<b>' + A.esc(A.repr(r)) + '</b>';
        var t = r && r.err ? '—' : A.type(r);
        return '<tr><td class="mono">' + A.highlight(o[0].replace('a', A.repr(pyNum(pa.v, pa.float))).replace('b', A.repr(pyNum(pb.v, pb.float)))) + '</td>' +
          '<td class="mono">' + res + '</td><td class="mono" style="color:var(--t-' + t + ')">' + t + '</td><td class="muted">' + o[1] + '</td></tr>';
      }).join('');
    }
    ia.addEventListener('input', upd);
    ib.addEventListener('input', upd);
    upd();
  };

  A.widgets.logic = function (host) {
    var body = A.widgetBox(host, 'Operadores lógicos: clique para alternar');
    body.innerHTML =
      '<div class="widget-row"><button class="btn lg-p"></button><button class="btn lg-q"></button></div>' +
      '<div class="lg-out" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px"></div>';
    var p = true, q = false;
    var bp = A.$('.lg-p', body), bq = A.$('.lg-q', body), out = A.$('.lg-out', body);
    function pill(v) { return '<b style="color:' + (v ? 'var(--ok)' : 'var(--bad)') + '">' + (v ? 'True' : 'False') + '</b>'; }
    function card(expr, v, txt) {
      return '<div class="mbox new t-bool" style="padding:10px 12px"><span class="mname">' + expr + '</span><span class="mval">' + pill(v) + '</span><span class="muted" style="font-size:.75rem">' + txt + '</span></div>';
    }
    function upd() {
      bp.innerHTML = 'p = ' + pill(p);
      bq.innerHTML = 'q = ' + pill(q);
      out.innerHTML =
        card('p and q', p && q, 'True só se os DOIS forem True') +
        card('p or q', p || q, 'True se PELO MENOS UM for True') +
        card('not p', !p, 'inverte o valor') +
        card('not (p and q)', !(p && q), 'negação do "e"');
    }
    bp.onclick = function () { p = !p; upd(); };
    bq.onclick = function () { q = !q; upd(); };
    upd();
  };
})(window.ALG);
