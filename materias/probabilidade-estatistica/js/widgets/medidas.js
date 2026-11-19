/* =========================================================
   WIDGET: média, mediana e desvio padrão num gráfico de pontos
   (Aula 3). Botão para colocar um outlier e ver a média fugir.
   ========================================================= */
(function (A) {
  var E = A.est;
  A.widgets.medidas = function (host, opts) {
    opts = opts || {};
    var original = opts.valores || '2, 3, 3, 5, 7';
    var body = A.widgetBox(host, 'O centro e a dispersão dos dados');
    body.innerHTML =
      '<div class="widget-row">' +
      '  <label class="field" style="flex:1 1 240px">valores (separados por vírgula) <input type="text" class="dv"></label>' +
      '  <button class="btn sm dout" type="button">+ outlier</button>' +
      '  <button class="btn sm ghost dres" type="button">↺ original</button>' +
      '</div>' +
      '<svg class="est-svg" viewBox="0 0 640 170" role="img" aria-label="Gráfico de pontos"></svg>' +
      '<div class="est-legenda"><span><i style="border-color:var(--pink)"></i>média</span><span><i style="border-color:var(--acc2);border-top-style:dashed"></i>mediana</span><span><i style="border-color:var(--acc2);border-top-width:8px;opacity:.3"></i>média ± 1 desvio padrão</span></div>' +
      '<div class="est-nums dnums"></div>' +
      '<div class="pycall dpy"></div>' +
      '<p class="muted dtip" style="font-size:.9rem;margin:6px 0 0"></p>';
    var inp = A.$('.dv', body), svg = A.$('svg', body);
    inp.value = original;
    A.$('.dres', body).onclick = function () { inp.value = original; upd(); };
    A.$('.dout', body).onclick = function () {
      var v = E.lerLista(inp.value);
      var mx = v.length ? Math.max.apply(null, v) : 10;
      inp.value = v.concat([Math.round(mx * 4 + 10)]).join(', ');
      upd();
    };
    function upd() {
      var v = E.lerLista(inp.value);
      if (!v.length) { svg.innerHTML = ''; A.$('.dnums', body).innerHTML = '<span class="alerta">digite números</span>'; return; }
      var m = E.media(v), md = E.mediana(v), s = E.desvio(v);
      var lo = Math.min.apply(null, v.concat([m - s])), hi = Math.max.apply(null, v.concat([m + s]));
      if (hi === lo) { hi += 1; lo -= 1; }
      var pad = (hi - lo) * 0.06; lo -= pad; hi += pad;
      function X(x) { return 30 + (x - lo) / (hi - lo) * 580; }
      var h = '<rect class="faixa" x="' + X(m - s) + '" y="18" width="' + Math.max(0, X(m + s) - X(m - s)) + '" height="112"/>';
      h += '<line class="eixo" x1="30" y1="130" x2="610" y2="130"/>';
      // marcas do eixo
      var passo = Math.pow(10, Math.floor(Math.log10((hi - lo) / 5)));
      if ((hi - lo) / passo > 10) passo *= 2;
      for (var t = Math.ceil(lo / passo) * passo; t <= hi; t += passo) h += '<line class="grade" x1="' + X(t) + '" y1="126" x2="' + X(t) + '" y2="134"/><text x="' + X(t) + '" y="150" text-anchor="middle">' + E.fmt(t, 2) + '</text>';
      // pontos empilhados
      var pilha = {}, outs = v.length >= 4 ? E.cinco(v).outliers : [];
      v.forEach(function (x) {
        var k = x.toFixed(6); pilha[k] = (pilha[k] || 0) + 1;
        var out = outs.indexOf(x) >= 0;
        h += '<circle class="ponto' + (out ? ' out' : '') + '" cx="' + X(x) + '" cy="' + (118 - (pilha[k] - 1) * 16) + '" r="7"/>';
      });
      h += '<line class="media" x1="' + X(m) + '" y1="12" x2="' + X(m) + '" y2="132"/><text x="' + X(m) + '" y="10" text-anchor="middle" fill="var(--pink)">x̄</text>';
      h += '<line class="mediana" x1="' + X(md) + '" y1="22" x2="' + X(md) + '" y2="132"/>';
      svg.innerHTML = h;
      var dif = md ? Math.abs(m - md) / Math.abs(md) : 0;
      A.$('.dnums', body).innerHTML =
        '<span>n = <b>' + v.length + '</b></span>' +
        '<span class="m">média = <b>' + E.fmt(m, 2) + '</b></span>' +
        '<span class="md">mediana = <b>' + E.fmt(md, 2) + '</b></span>' +
        '<span>desvio padrão = <b>' + E.fmt(s, 2) + '</b></span>';
      A.$('.dpy', body).innerHTML = A.highlight('dados = [' + v.map(E.py).join(', ') + ']') + '<br>' +
        A.highlight('print(statistics.mean(dados), statistics.median(dados), statistics.stdev(dados))');
      A.$('.dtip', body).innerHTML = dif > 0.3
        ? '⚠ A média está bem longe da mediana: tem <b>outlier</b> puxando a média. A mediana quase não se mexeu, porque é <b>resistente</b>.'
        : 'Média e mediana próximas: dados equilibrados. Clique em <b>+ outlier</b> e veja quem se mexe mais.';
    }
    inp.addEventListener('input', upd);
    upd();
  };
})(window.ALG);
