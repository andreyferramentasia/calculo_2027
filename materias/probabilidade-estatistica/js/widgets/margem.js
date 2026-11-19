/* =========================================================
   WIDGET: margem de erro ≈ 100/√n (Aula 2)
   ========================================================= */
(function (A) {
  var E = A.est;
  var NS = [25, 50, 100, 150, 200, 400, 625, 1000, 2500, 10000];
  A.widgets.margem = function (host) {
    var body = A.widgetBox(host, 'Tamanho da amostra x margem de erro');
    body.innerHTML =
      '<div class="widget-row">' +
      '  <label class="field">tamanho da amostra (n) <input type="range" min="0" max="' + (NS.length - 1) + '" value="6" class="mn"><output></output></label>' +
      '  <label class="field">resultado na amostra (%) <input type="range" min="0" max="100" value="70" class="mp"><output></output></label>' +
      '</div>' +
      '<div class="est-regua"><span class="int"></span><span class="pt"></span>' +
      [0, 25, 50, 75, 100].map(function (v) { return '<span class="marca" style="left:' + v + '%">' + v + '%</span>'; }).join('') + '</div>' +
      '<div class="est-nums mnums"></div>' +
      '<div class="pycall mpy"></div>';
    var iN = A.$('.mn', body), iP = A.$('.mp', body);
    function upd() {
      var n = NS[+iN.value], p = +iP.value, m = 100 / Math.sqrt(n);
      var lo = Math.max(0, p - m), hi = Math.min(100, p + m);
      iN.nextElementSibling.textContent = n.toLocaleString('pt-BR');
      iP.nextElementSibling.textContent = p + '%';
      var int = A.$('.int', body);
      int.style.left = lo + '%'; int.style.width = (hi - lo) + '%';
      A.$('.pt', body).style.left = p + '%';
      A.$('.mnums', body).innerHTML =
        '<span>√' + n + ' = <b>' + E.fmt(Math.sqrt(n), 1) + '</b></span>' +
        '<span class="' + (m > 8 ? 'alerta' : 'ok') + '">margem ≈ <b>' + E.fmt(m, 1) + '</b> pontos</span>' +
        '<span>na população: entre <b>' + E.fmt(lo, 1) + '%</b> e <b>' + E.fmt(hi, 1) + '%</b></span>' +
        (m > 8 ? '<span class="alerta">amostra pequena: pouco confiável</span>' : '');
      A.$('.mpy', body).innerHTML = A.highlight('print(100 / math.sqrt(' + n + '))  # ' + E.py(Math.round(m * 100) / 100));
    }
    [iN, iP].forEach(function (i) { i.addEventListener('input', upd); });
    upd();
  };
})(window.ALG);
