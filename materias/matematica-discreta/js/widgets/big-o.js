/* =========================================================
   WIDGET: Big O — quantos passos (e quanto tempo) para cada n
   Supõe 1 bilhão de passos por segundo.
   ========================================================= */
(function (A) {
  var NS = [10, 100, 1000, 10000, 100000, 1000000, 10000000, 1000000000];
  var ORDENS = [
    { t: 'O(1)', c: '#b6f26b', lg: function () { return 0; } },
    { t: 'O(log n)', c: '#8fb8ff', lg: function (n) { return Math.log10(Math.max(1, Math.log2(n))); } },
    { t: 'O(n)', c: '#ffcf33', lg: function (n) { return Math.log10(n); } },
    { t: 'O(n log n)', c: '#ff8a3d', lg: function (n) { return Math.log10(n * Math.log2(n)); } },
    { t: 'O(n²)', c: '#ff5c93', lg: function (n) { return 2 * Math.log10(n); } },
    { t: 'O(2ⁿ)', c: '#c4a8ff', lg: function (n) { return n * Math.log10(2); } }
  ];
  function passos(lg) {
    if (lg < 15) return Math.round(Math.pow(10, lg)).toLocaleString('pt-BR');
    return '≈ 10^' + Math.floor(lg);
  }
  function tempo(lg) {                  // lg = log10(passos); 1e9 passos/s
    var s = Math.pow(10, lg - 9);
    if (lg - 9 > 17.6) return 'mais que a idade do universo';
    if (s < 1e-6) return 'instantâneo';
    if (s < 1e-3) return (s * 1e6).toFixed(1).replace('.', ',') + ' µs';
    if (s < 1) return (s * 1e3).toFixed(1).replace('.', ',') + ' ms';
    if (s < 60) return s.toFixed(1).replace('.', ',') + ' s';
    if (s < 3600) return (s / 60).toFixed(0) + ' min';
    if (s < 86400) return (s / 3600).toFixed(1).replace('.', ',') + ' h';
    if (s < 3.15e7) return (s / 86400).toFixed(0) + ' dias';
    return (s / 3.15e7).toExponential(1).replace('.', ',') + ' anos';
  }

  A.widgets.bigO = function (host) {
    var body = A.widgetBox(host, 'E se a entrada crescer?');
    body.innerHTML =
      '<div class="widget-row"><label class="field">n (tamanho da entrada) <input type="range" min="0" max="' + (NS.length - 1) + '" value="2" class="bn"><output></output></label></div>' +
      '<div class="bigo-barras"></div>' +
      '<p class="muted btip" style="font-size:.88rem;margin:10px 0 0">Barras em escala logarítmica (cada marca é 10× mais). Tempo supondo 1 bilhão de passos por segundo.</p>';
    var inp = A.$('.bn', body), box = A.$('.bigo-barras', body);
    function upd() {
      var n = NS[+inp.value];
      inp.nextElementSibling.textContent = n.toLocaleString('pt-BR');
      var max = 30;    // 10^30 passos = barra cheia
      box.innerHTML = ORDENS.map(function (o) {
        var lg = o.lg(n), w = Math.min(100, Math.max(1, lg / max * 100));
        var trava = lg - 9 > 0;   // mais de 1 s
        return '<div class="bigo-linha' + (trava ? ' trava' : '') + '"><b>' + o.t + '</b>' +
          '<div class="bigo-barra"><i style="width:' + w + '%;--c:' + o.c + '"></i></div>' +
          '<span class="t">' + passos(lg) + (lg === 0 ? ' passo' : ' passos') + '<br>' + tempo(lg) + (trava ? ' ⚠' : '') + '</span></div>';
      }).join('');
    }
    inp.addEventListener('input', upd);
    upd();
  };
})(window.ALG);
