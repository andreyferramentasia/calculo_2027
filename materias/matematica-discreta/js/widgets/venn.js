/* =========================================================
   WIDGET: diagrama de Venn com operações (∪ ∩ − ′)
   Os elementos de A e B aparecem na região certa, e o
   resultado é mostrado também como set do Python.
   ========================================================= */
(function (A) {
  var uid = 0;
  var OPS = [
    { k: 'uniao', t: 'A ∪ B', py: 'A | B', r: ['a', 'ab', 'b'] },
    { k: 'inter', t: 'A ∩ B', py: 'A & B', r: ['ab'] },
    { k: 'amb', t: 'A − B', py: 'A - B', r: ['a'] },
    { k: 'bma', t: 'B − A', py: 'B - A', r: ['b'] },
    { k: 'compA', t: 'A′', py: 'S - A', r: ['b', 'fora'] },
    { k: 'compU', t: '(A ∪ B)′', py: 'S - (A | B)', r: ['fora'] },
    { k: 'dif', t: 'A ⊕ B', py: 'A ^ B', r: ['a', 'b'] }
  ];

  function parseSet(s) {
    var out = [];
    String(s).split(',').forEach(function (x) {
      x = x.trim();
      if (x && out.indexOf(x) < 0) out.push(x);
    });
    return out.slice(0, 14);
  }
  function ordena(l) {
    return l.slice().sort(function (a, b) {
      var na = Number(a), nb = Number(b);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return a < b ? -1 : a > b ? 1 : 0;
    });
  }
  function pySet(l) {
    if (!l.length) return 'set()';
    return '{' + ordena(l).map(function (x) { return isNaN(Number(x)) ? "'" + x + "'" : x; }).join(', ') + '}';
  }

  A.widgets.venn = function (host, opts) {
    opts = opts || {};
    var id = 'vn' + (++uid);
    var body = A.widgetBox(host, 'Operações com conjuntos no diagrama de Venn');
    body.innerHTML =
      '<div class="widget-row">' +
      '  <label class="field" style="flex:1 1 180px">elementos de A <input type="text" class="vA"></label>' +
      '  <label class="field" style="flex:1 1 180px">elementos de B <input type="text" class="vB"></label>' +
      '  <label class="field" style="flex:1 1 180px">resto do universo S <input type="text" class="vS"></label>' +
      '</div>' +
      '<div class="venn-ops"></div>' +
      '<svg class="venn-svg" viewBox="0 0 520 290" role="img" aria-label="Diagrama de Venn">' +
      '  <defs>' +
      '    <clipPath id="' + id + 'cA"><circle cx="205" cy="150" r="105"/></clipPath>' +
      '    <mask id="' + id + 'mA"><rect width="520" height="290" fill="#fff"/><circle cx="315" cy="150" r="105" fill="#000"/></mask>' +
      '    <mask id="' + id + 'mB"><rect width="520" height="290" fill="#fff"/><circle cx="205" cy="150" r="105" fill="#000"/></mask>' +
      '    <mask id="' + id + 'mF"><rect width="520" height="290" fill="#fff"/><circle cx="205" cy="150" r="105" fill="#000"/><circle cx="315" cy="150" r="105" fill="#000"/></mask>' +
      '  </defs>' +
      '  <rect class="reg" data-r="fora" x="6" y="6" width="508" height="278" rx="14" mask="url(#' + id + 'mF)"/>' +
      '  <circle class="reg" data-r="a" cx="205" cy="150" r="105" mask="url(#' + id + 'mA)"/>' +
      '  <circle class="reg" data-r="b" cx="315" cy="150" r="105" mask="url(#' + id + 'mB)"/>' +
      '  <circle class="reg" data-r="ab" cx="315" cy="150" r="105" clip-path="url(#' + id + 'cA)"/>' +
      '  <rect class="borda" x="6" y="6" width="508" height="278" rx="14"/>' +
      '  <circle class="borda" cx="205" cy="150" r="105"/><circle class="borda" cx="315" cy="150" r="105"/>' +
      '  <text class="nome" x="120" y="62">A</text><text class="nome" x="388" y="62">B</text><text class="nome" x="22" y="34">S</text>' +
      '  <g class="els"></g>' +
      '</svg>' +
      '<div class="pycall vpy"></div>' +
      '<div class="result-line vres"></div>' +
      '<p class="muted vtip" style="font-size:.9rem;margin:6px 0 0"></p>';
    var iA = A.$('.vA', body), iB = A.$('.vB', body), iS = A.$('.vS', body);
    iA.value = opts.A || '1, 3, 5, 7, 9';
    iB.value = opts.B || '3, 5, 6, 10, 11';
    iS.value = opts.S || '2, 4, 8';
    var cur = OPS[0];
    var opsBox = A.$('.venn-ops', body);
    OPS.forEach(function (o) {
      var b = A.el('button', '', o.t);
      b.type = 'button';
      b.onclick = function () { cur = o; upd(); };
      o.btn = b;
      opsBox.appendChild(b);
    });

    function upd() {
      var a = parseSet(iA.value), b = parseSet(iB.value), extra = parseSet(iS.value);
      var reg = { a: [], ab: [], b: [], fora: [] };
      a.forEach(function (x) { (b.indexOf(x) >= 0 ? reg.ab : reg.a).push(x); });
      b.forEach(function (x) { if (a.indexOf(x) < 0) reg.b.push(x); });
      extra.forEach(function (x) { if (a.indexOf(x) < 0 && b.indexOf(x) < 0) reg.fora.push(x); });
      OPS.forEach(function (o) { o.btn.classList.toggle('on', o === cur); });
      A.$$('.reg', body).forEach(function (r) { r.classList.toggle('on', cur.r.indexOf(r.getAttribute('data-r')) >= 0); });

      // elementos em cada região
      var pos = { a: [148, 150], ab: [260, 150], b: [372, 150] };
      var g = A.$('.els', body), h = '';
      ['a', 'ab', 'b'].forEach(function (k) {
        var l = ordena(reg[k]), cols = l.length > 5 ? 2 : 1, rows = Math.ceil(l.length / cols);
        l.forEach(function (x, i) {
          var c = i % cols, r = Math.floor(i / cols);
          var px = pos[k][0] + (cols === 2 ? (c ? 22 : -22) : 0), py = pos[k][1] + (r - (rows - 1) / 2) * 22;
          h += '<text x="' + px + '" y="' + (py + 5) + '" text-anchor="middle">' + A.esc(x) + '</text>';
        });
      });
      ordena(reg.fora).forEach(function (x, i) {
        var lado = i % 2, k = Math.floor(i / 2);
        h += '<text x="' + (lado ? 490 : 30) + '" y="' + (90 + k * 26) + '" text-anchor="middle">' + A.esc(x) + '</text>';
      });
      g.innerHTML = h;

      var res = [];
      cur.r.forEach(function (k) { res = res.concat(reg[k]); });
      A.$('.vpy', body).innerHTML = A.highlight('A = ' + pySet(a) + '\nB = ' + pySet(b) + '\nS = A | B | ' + pySet(reg.fora)).replace(/\n/g, '<br>');
      A.$('.vres', body).innerHTML = '<span class="lbl">' + A.esc(cur.t) + ' &nbsp;·&nbsp; Python <code>' + A.esc(cur.py) + '</code> →</span> <b>' + A.esc(pySet(res)) + '</b>';
      var tips = {
        uniao: 'União: tudo que está em A <b>ou</b> em B (sem repetir).',
        inter: 'Interseção: só o que está em A <b>e</b> em B ao mesmo tempo.' + (reg.ab.length ? '' : ' Aqui deu vazio: A e B são <b>disjuntos</b>.'),
        amb: 'Diferença: o que está em A e <b>não</b> está em B.',
        bma: 'B − A é diferente de A − B: a ordem importa na diferença.',
        compA: 'Complemento: tudo do universo S que não está em A.',
        compU: '(A ∪ B)′ = A′ ∩ B′: De Morgan também vale para conjuntos.',
        dif: 'Diferença simétrica: está em um <b>ou</b> no outro, mas não nos dois (o XOR dos conjuntos).'
      };
      A.$('.vtip', body).innerHTML = tips[cur.k];
    }
    [iA, iB, iS].forEach(function (i) { i.addEventListener('input', upd); });
    upd();
  };
})(window.ALG);
