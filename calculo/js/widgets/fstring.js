/* =========================================================
   WIDGET: formatação com f-strings
   ========================================================= */
(function (A) {
  function withCommas(s) {
    var p = s.split('.');
    p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return p.join('.');
  }
  function pyExp(x, d) {
    return x.toExponential(d).replace(/e([+-])(\d)$/, 'e$10$2');
  }
  function fmt(x, isF, spec) {
    var str = isF ? A.fmtFloat(x) : String(x);
    switch (spec) {
      case '': return str;
      case '.2f': return x.toFixed(2);
      case '.1f': return x.toFixed(1);
      case '.0f': return x.toFixed(0);
      case '.4f': return x.toFixed(4);
      case ',.2f': return withCommas(x.toFixed(2));
      case '.1%': return (x * 100).toFixed(1) + '%';
      case '.2e': return pyExp(x, 2);
      case '>12': return (' '.repeat(12) + str).slice(-Math.max(12, str.length));
      case '<12': return (str + ' '.repeat(12)).slice(0, Math.max(12, str.length));
      case '^12':
        var tot = Math.max(0, 12 - str.length), l = Math.floor(tot / 2);
        return ' '.repeat(l) + str + ' '.repeat(tot - l);
      case '08.2f':
        var s = Math.abs(x).toFixed(2);
        var sign = x < 0 ? '-' : '';
        return sign + ('0'.repeat(8) + s).slice(-Math.max(8 - sign.length, s.length));
    }
    return str;
  }
  var SPECS = [
    ['', 'sem formatação'],
    ['.2f', '2 casas decimais'],
    ['.1f', '1 casa decimal'],
    ['.0f', 'arredonda para inteiro'],
    ['.4f', '4 casas decimais'],
    [',.2f', 'separador de milhar'],
    ['.1%', 'porcentagem'],
    ['.2e', 'notação científica'],
    ['>12', 'alinha à direita (12)'],
    ['<12', 'alinha à esquerda (12)'],
    ['^12', 'centraliza (12)'],
    ['08.2f', 'zeros à esquerda']
  ];

  A.widgets.fstring = function (host) {
    var body = A.widgetBox(host, 'f-strings: formate números como quiser');
    body.innerHTML =
      '<div class="widget-row">' +
      '  <label class="field">valor = <input type="text" value="1234.5678" style="width:140px"></label>' +
      '</div>' +
      '<div class="fs-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px"></div>';
    var inp = A.$('input', body), grid = A.$('.fs-grid', body);
    function upd() {
      var p = A.parseNum(inp.value);
      if (!p) { grid.innerHTML = '<span style="color:var(--bad)">Digite um número.</span>'; return; }
      grid.innerHTML = SPECS.map(function (s) {
        var code = 'f"{valor' + (s[0] ? ':' + s[0] : '') + '}"';
        return '<div style="background:var(--bg2);border:1px solid var(--line);border-radius:10px;padding:8px 12px">' +
          '<div class="mono" style="font-size:.82rem">' + A.highlight(code) + '</div>' +
          '<div class="mono" style="font-weight:700;color:var(--ok);white-space:pre">→ \'' + A.esc(fmt(p.v, p.float, s[0])) + '\'</div>' +
          '<div class="muted" style="font-size:.75rem">' + s[1] + '</div></div>';
      }).join('');
    }
    inp.addEventListener('input', upd);
    upd();
  };
})(window.ALG);
