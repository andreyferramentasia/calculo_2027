/* =========================================================
   WIDGET: boxplot e resumo de cinco números (Aula 5)
   Quartis pelo método "dividir ao meio" e outliers pela
   regra de 1,5 × IQR.
   ========================================================= */
(function (A) {
  var E = A.est;
  A.widgets.boxplot = function (host, opts) {
    opts = opts || {};
    var original = opts.valores || '2, 2, 3, 3, 4, 4, 5, 6, 15';
    var body = A.widgetBox(host, 'Monte o boxplot');
    body.innerHTML =
      '<div class="widget-row"><label class="field" style="flex:1 1 260px">valores <input type="text" class="bv"></label>' +
      '<button class="btn sm ghost bres" type="button">↺ original</button></div>' +
      '<svg class="est-svg" viewBox="0 0 640 150" role="img" aria-label="Boxplot"></svg>' +
      '<div class="est-nums bnums"></div>' +
      '<p class="muted btip" style="font-size:.9rem;margin:6px 0 0"></p>';
    var inp = A.$('.bv', body), svg = A.$('svg', body);
    inp.value = original;
    A.$('.bres', body).onclick = function () { inp.value = original; upd(); };
    function upd() {
      var v = E.lerLista(inp.value);
      if (v.length < 2) { svg.innerHTML = ''; A.$('.bnums', body).innerHTML = '<span class="alerta">digite pelo menos 2 números</span>'; return; }
      var c = E.cinco(v);
      var lo = Math.min(c.min, c.li > c.min ? c.min : c.min), hi = c.max;
      if (hi === lo) { hi += 1; lo -= 1; }
      var pad = (hi - lo) * 0.06; lo -= pad; hi += pad;
      function X(x) { return 30 + (x - lo) / (hi - lo) * 580; }
      var h = '<line class="eixo" x1="30" y1="120" x2="610" y2="120"/>';
      var passo = Math.pow(10, Math.floor(Math.log10((hi - lo) / 5)));
      if ((hi - lo) / passo > 10) passo *= 2;
      for (var t = Math.ceil(lo / passo) * passo; t <= hi; t += passo) h += '<line class="grade" x1="' + X(t) + '" y1="116" x2="' + X(t) + '" y2="124"/><text x="' + X(t) + '" y="140" text-anchor="middle">' + E.fmt(t, 2) + '</text>';
      if (c.ls < hi) h += '<line x1="' + X(c.ls) + '" y1="20" x2="' + X(c.ls) + '" y2="110" stroke="var(--bad)" stroke-width="2" stroke-dasharray="5 4"/><text x="' + X(c.ls) + '" y="14" text-anchor="middle" fill="var(--bad)">limite ' + E.fmt(c.ls, 2) + '</text>';
      h += '<line class="eixo" x1="' + X(c.bigodeMin) + '" y1="65" x2="' + X(c.q1) + '" y2="65"/><line class="eixo" x1="' + X(c.q3) + '" y1="65" x2="' + X(c.bigodeMax) + '" y2="65"/>' +
        '<line class="eixo" x1="' + X(c.bigodeMin) + '" y1="50" x2="' + X(c.bigodeMin) + '" y2="80"/><line class="eixo" x1="' + X(c.bigodeMax) + '" y1="50" x2="' + X(c.bigodeMax) + '" y2="80"/>' +
        '<rect class="caixa" x="' + X(c.q1) + '" y="38" width="' + Math.max(2, X(c.q3) - X(c.q1)) + '" height="54" rx="4"/>' +
        '<line x1="' + X(c.med) + '" y1="38" x2="' + X(c.med) + '" y2="92" stroke="var(--ink)" stroke-width="4"/>';
      c.outliers.forEach(function (o) { h += '<circle class="ponto out" cx="' + X(o) + '" cy="65" r="7"/>'; });
      svg.innerHTML = h;
      A.$('.bnums', body).innerHTML =
        '<span>mín. <b>' + E.fmt(c.min, 2) + '</b></span><span>Q1 <b>' + E.fmt(c.q1, 2) + '</b></span><span class="md">mediana <b>' + E.fmt(c.med, 2) + '</b></span>' +
        '<span>Q3 <b>' + E.fmt(c.q3, 2) + '</b></span><span>máx. <b>' + E.fmt(c.max, 2) + '</b></span><span>IQR = Q3 − Q1 = <b>' + E.fmt(c.iqr, 2) + '</b></span>' +
        (c.outliers.length ? '<span class="alerta">outlier: <b>' + c.outliers.map(function (x) { return E.fmt(x, 2); }).join(', ') + '</b></span>' : '<span class="ok">sem outliers</span>');
      A.$('.btip', body).innerHTML = 'Ordenados: ' + c.ord.map(function (x) { return E.fmt(x, 2); }).join(', ') + '. ' +
        (v.length % 2 ? 'n = ' + v.length + ' é ímpar: a mediana fica de fora das metades.' : 'n = ' + v.length + ' é par: as metades são as duas partes inteiras.') +
        ' Limites: Q1 − 1,5·IQR = ' + E.fmt(c.li, 2) + ' e Q3 + 1,5·IQR = ' + E.fmt(c.ls, 2) + '.';
    }
    inp.addEventListener('input', upd);
    upd();
  };
})(window.ALG);
