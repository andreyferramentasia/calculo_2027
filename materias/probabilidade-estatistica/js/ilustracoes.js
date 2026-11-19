/* =========================================================
   ILUSTRAÇÕES das aulas (SVG no estilo da página: placa branca,
   borda grossa, sombra sólida). Uso nas aulas:
     { html: A.ilus('balanca', 'legenda') }
   ========================================================= */
(function (A) {
  var K = '#17171c', AM = '#ffcf33', AZ = '#8fb8ff', RS = '#ff7aa6', VD = '#b6f26b', LI = '#c4a8ff';
  var T = 'font-family="JetBrains Mono, monospace" font-weight="800"';

  function placa(w, h, corpo) {
    return '<svg viewBox="0 0 ' + (w + 8) + ' ' + (h + 8) + '" role="img">' +
      '<rect x="6" y="6" width="' + w + '" height="' + h + '" rx="18" fill="' + K + '"/>' +
      '<rect x="2" y="2" width="' + w + '" height="' + h + '" rx="18" fill="#fff" stroke="' + K + '" stroke-width="3"/>' +
      corpo + '</svg>';
  }
  function txt(x, y, s, size, cor, anc) {
    return '<text x="' + x + '" y="' + y + '" ' + T + ' font-size="' + (size || 14) + '" fill="' + (cor || K) + '" text-anchor="' + (anc || 'middle') + '">' + s + '</text>';
  }
  function caixa(x, y, w, h, cor) {
    return '<rect x="' + (x + 3) + '" y="' + (y + 3) + '" width="' + w + '" height="' + h + '" rx="10" fill="' + K + '"/>' +
      '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10" fill="' + cor + '" stroke="' + K + '" stroke-width="2.5"/>';
  }
  function seta(x1, y1, x2, y2) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + (x2 - 6) + '" y2="' + y2 + '" stroke="' + K + '" stroke-width="3.5"/>' +
      '<path d="M' + (x2 - 9) + ' ' + (y2 - 7) + ' L' + x2 + ' ' + y2 + ' L' + (x2 - 9) + ' ' + (y2 + 7) + ' Z" fill="' + K + '"/>';
  }
  function pessoa(x, y, cor) {
    return '<circle cx="' + x + '" cy="' + y + '" r="7" fill="' + cor + '" stroke="' + K + '" stroke-width="2.2"/>' +
      '<path d="M' + (x - 10) + ' ' + (y + 22) + ' a10 10 0 0 1 20 0 Z" fill="' + cor + '" stroke="' + K + '" stroke-width="2.2"/>';
  }

  var F = {
    /* Aula 1: o número pronto, sem contexto */
    jornal: function () {
      var c = caixa(30, 26, 230, 150, '#fff7e8') +
        '<rect x="44" y="40" width="200" height="16" rx="4" fill="' + K + '"/>' +
        caixa(46, 70, 90, 60, AM) + txt(91, 108, '+72%', 20) +
        '<g stroke="' + K + '" stroke-width="3" stroke-linecap="round"><line x1="150" y1="76" x2="236" y2="76"/><line x1="150" y1="92" x2="226" y2="92"/><line x1="150" y1="108" x2="236" y2="108"/><line x1="150" y1="124" x2="210" y2="124"/><line x1="46" y1="150" x2="236" y2="150"/><line x1="46" y1="164" x2="190" y2="164"/></g>' +
        caixa(300, 60, 220, 84, RS) + txt(410, 96, '72% de quê?', 18) + txt(410, 122, 'qual a base?', 14) +
        '<path d="M300 102 L268 100 L300 116 Z" fill="' + RS + '" stroke="' + K + '" stroke-width="2.5" stroke-linejoin="round"/>';
      return placa(560, 200, c);
    },
    /* Aula 2: as quatro etapas */
    processo: function () {
      var et = [['👥', 'população', AZ], ['📋', 'coleta', AM], ['📊', 'análise', VD], ['✅', 'conclusão', RS]], c = '';
      et.forEach(function (e, i) {
        var x = 22 + i * 140;
        c += caixa(x, 40, 110, 96, e[2]) + txt(x + 55, 86, e[0], 30) + txt(x + 55, 120, e[1], 14);
        if (i < 3) c += seta(x + 116, 88, x + 138, 88);
        c += txt(x + 55, 30, (i + 1) + '', 14, '#5c5f68');
      });
      c += txt(290, 168, 'sempre nessa ordem', 13, '#5c5f68');
      return placa(580, 186, c);
    },
    /* Aula 2: amostra aleatória x tendenciosa */
    sorteio: function () {
      var c = txt(150, 30, 'aleatória', 15) + txt(430, 30, 'tendenciosa', 15);
      var cores = [AZ, AM, RS, VD, LI, AZ, RS, AM, VD, LI, AM, AZ];
      for (var i = 0; i < 12; i++) {
        var x = 50 + (i % 6) * 40, y = 52 + Math.floor(i / 6) * 46;
        c += pessoa(x, y, [0, 3, 8, 10].indexOf(i) >= 0 ? cores[i] : '#eee');
        x += 280;
        c += pessoa(x, y, i < 4 ? RS : '#eee');
      }
      c += '<line x1="290" y1="40" x2="290" y2="150" stroke="' + K + '" stroke-width="2" stroke-dasharray="6 5"/>';
      c += txt(150, 168, 'todos com a mesma chance', 12, '#5c5f68') + txt(430, 168, 'só um grupo responde', 12, '#5c5f68');
      return placa(580, 182, c);
    },
    /* Aula 3: a média é o ponto de equilíbrio; o outlier puxa */
    balanca: function () {
      var c = '';
      function lado(ox, pesos, apoio, titulo) {
        var s = txt(ox + 120, 28, titulo, 14);
        s += '<line x1="' + (ox + 10) + '" y1="120" x2="' + (ox + 230) + '" y2="120" stroke="' + K + '" stroke-width="5" stroke-linecap="round"/>';
        pesos.forEach(function (p) { s += '<rect x="' + (ox + p - 8) + '" y="100" width="16" height="16" rx="3" fill="' + AM + '" stroke="' + K + '" stroke-width="2.2"/>'; });
        s += '<path d="M' + (ox + apoio) + ' 124 L' + (ox + apoio - 16) + ' 150 L' + (ox + apoio + 16) + ' 150 Z" fill="' + RS + '" stroke="' + K + '" stroke-width="2.5" stroke-linejoin="round"/>';
        s += txt(ox + apoio, 170, 'média', 12, '#5c5f68');
        return s;
      }
      c += lado(20, [60, 80, 80, 100, 120], 88, 'dados equilibrados');
      c += lado(300, [40, 56, 56, 72, 220], 89, 'com um outlier');
      c += '<rect x="512" y="100" width="16" height="16" rx="3" fill="' + RS + '" stroke="' + K + '" stroke-width="2.2"/>';
      return placa(560, 184, c);
    },
    /* Aula 3: desvio padrão pequeno x grande */
    alvos: function () {
      function alvo(cx, pts, rot) {
        var s = '';
        [56, 38, 20].forEach(function (r, i) { s += '<circle cx="' + cx + '" cy="92" r="' + r + '" fill="' + [AZ, '#fff', RS][i] + '" stroke="' + K + '" stroke-width="2.5"/>'; });
        pts.forEach(function (p) { s += '<circle cx="' + (cx + p[0]) + '" cy="' + (92 + p[1]) + '" r="5" fill="' + K + '"/>'; });
        return s + txt(cx, 176, rot, 13);
      }
      return placa(500, 190,
        alvo(130, [[-4, 3], [5, -2], [2, 6], [-6, -5], [7, 4]], 'desvio pequeno') +
        alvo(370, [[-40, 20], [35, -30], [10, 44], [-30, -38], [44, 10]], 'desvio grande') +
        txt(250, 30, 'mesma média, dispersão diferente', 13, '#5c5f68'));
    },
    /* Aula 5: histograma assimétrico à direita */
    histograma: function () {
      var h = [40, 95, 120, 80, 50, 30, 18, 10], c = '<line x1="40" y1="160" x2="480" y2="160" stroke="' + K + '" stroke-width="3"/>';
      h.forEach(function (v, i) { c += '<rect x="' + (50 + i * 52) + '" y="' + (160 - v) + '" width="52" height="' + v + '" fill="' + (i < 4 ? AZ : AM) + '" stroke="' + K + '" stroke-width="2.5"/>'; });
      c += '<line x1="190" y1="20" x2="190" y2="160" stroke="' + K + '" stroke-width="4" stroke-dasharray="7 5"/>' + txt(190, 180, 'mediana', 12);
      c += '<line x1="235" y1="20" x2="235" y2="160" stroke="' + RS + '" stroke-width="4"/>' + txt(250, 180, 'média', 12, K, 'start');
      c += seta(330, 46, 440, 46) + txt(385, 34, 'cauda à direita', 13);
      return placa(520, 196, c);
    },
    /* Aula 5: mesmo dado, eixo cortado x eixo do zero */
    linhaTempo: function () {
      var d = [52, 50, 51, 53, 58, 60, 54, 53, 54, 55, 61, 63];
      function graf(ox, z, rot, cor) {
        var s = txt(ox + 120, 26, rot, 13, cor);
        s += '<line x1="' + (ox + 10) + '" y1="150" x2="' + (ox + 230) + '" y2="150" stroke="' + K + '" stroke-width="2.5"/><line x1="' + (ox + 10) + '" y1="36" x2="' + (ox + 10) + '" y2="150" stroke="' + K + '" stroke-width="2.5"/>';
        s += txt(ox + 4, 154, z, 11, '#5c5f68', 'end');
        var p = d.map(function (v, i) { return (ox + 18 + i * 19) + ' ' + (150 - (v - z) / (64 - z) * 110); });
        return s + '<path d="M' + p.join(' L') + '" fill="none" stroke="' + RS + '" stroke-width="4" stroke-linejoin="round"/>';
      }
      return placa(540, 176, graf(20, 50, 'eixo começa em 50: drama!', '#ef4466') + graf(290, 0, 'eixo começa em 0: real', '#15803d'));
    },
    /* Aula 7: forças de correlação */
    correlacoes: function () {
      var conj = [['r = +1', function (t) { return t; }], ['r ≈ +0,7', function (t, j) { return t + j * 26; }], ['r ≈ 0', function (t, j) { return 60 + j * 55; }], ['r ≈ −0,7', function (t, j) { return 120 - t + j * 26; }]];
      var jit = [0.2, -0.6, 0.9, -0.3, 0.5, -0.9, 0.1, 0.7, -0.5, 0.3], c = '';
      conj.forEach(function (k, i) {
        var ox = 16 + i * 136;
        c += caixa(ox, 20, 120, 120, '#fff7e8');
        for (var j = 0; j < 10; j++) {
          var t = 10 + j * 11, y = Math.max(6, Math.min(114, k[1](t, jit[j])));
          c += '<circle cx="' + (ox + 4 + t) + '" cy="' + (20 + 120 - y) + '" r="5" fill="' + [VD, AM, LI, RS][i] + '" stroke="' + K + '" stroke-width="1.8"/>';
        }
        c += txt(ox + 60, 164, k[0], 14);
      });
      return placa(568, 178, c);
    }
  };

  /* figura pronta para colocar numa seção html */
  A.ilus = function (nome, legenda) {
    return '<figure class="ilus">' + F[nome]() + (legenda ? '<figcaption>' + legenda + '</figcaption>' : '') + '</figure>';
  };
})(window.ALG);
