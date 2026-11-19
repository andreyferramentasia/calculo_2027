/* =========================================================
   WIDGET: range(start, stop, step) ao vivo
   ========================================================= */
(function (A) {
  A.widgets.range = function (host) {
    var body = A.widgetBox(host, 'Explore o range()');
    body.innerHTML =
      '<div class="widget-row">' +
      '  <label class="field">start <input type="range" min="-5" max="15" value="0" data-k="start"><output></output></label>' +
      '  <label class="field">stop <input type="range" min="-5" max="20" value="10" data-k="stop"><output></output></label>' +
      '  <label class="field">step <input type="range" min="-5" max="5" value="2" data-k="step"><output></output></label>' +
      '</div>' +
      '<div class="pycall"></div>' +
      '<div class="rg-line" style="position:relative;overflow-x:auto;padding:8px 0 4px"></div>' +
      '<div class="result-line rg-list"></div>' +
      '<div class="result-line rg-len"></div>' +
      '<p class="muted rg-tip" style="font-size:.88rem;margin:8px 0 0"></p>';
    var ins = A.$$('input', body);
    var call = A.$('.pycall', body), line = A.$('.rg-line', body), list = A.$('.rg-list', body), len = A.$('.rg-len', body), tip = A.$('.rg-tip', body);

    function upd() {
      var v = {};
      ins.forEach(function (i) {
        if (i.dataset.k === 'step' && +i.value === 0) i.value = 1;
        v[i.dataset.k] = +i.value;
        i.nextElementSibling.textContent = i.value;
      });
      var res = [];
      if (v.step > 0) for (var x = v.start; x < v.stop; x += v.step) res.push(x);
      else for (x = v.start; x > v.stop; x += v.step) res.push(x);

      var c = 'range(' + v.start + ', ' + v.stop + ', ' + v.step + ')';
      if (v.step === 1) c = v.start === 0 ? 'range(' + v.stop + ')' : 'range(' + v.start + ', ' + v.stop + ')';
      call.innerHTML = A.highlight('for i in ' + c + ':');

      // régua numérica de -5 a 20
      var lo = -5, hi = 20, html = '<div style="display:flex;gap:3px;min-width:max-content">';
      for (var n = lo; n <= hi; n++) {
        var k = res.indexOf(n);
        var isStop = n === v.stop, isStart = n === v.start;
        var bg = k >= 0 ? 'var(--acc)' : 'var(--panel2)';
        var col = k >= 0 ? 'var(--acc-ink)' : 'var(--faint)';
        html += '<div style="width:30px;text-align:center;font-family:var(--mono);font-size:.75rem">' +
          '<div style="height:16px;color:var(--t-int);font-weight:800">' + (isStart ? 'start' : '') + '</div>' +
          '<div style="height:30px;display:grid;place-items:center;border-radius:7px;background:' + bg + ';color:' + col + ';font-weight:700;' +
          (k >= 0 ? 'animation:boxIn .35s ' + (k * 60) + 'ms both cubic-bezier(.2,1.4,.4,1);' : '') +
          (isStop ? 'outline:2px dashed var(--bad);outline-offset:1px;' : '') + '">' + n + '</div>' +
          '<div style="height:16px;color:var(--bad);font-size:.65rem;font-weight:800">' + (isStop ? 'stop ✕' : (k >= 0 ? '#' + (k + 1) : '')) + '</div></div>';
      }
      line.innerHTML = html + '</div>';
      list.innerHTML = '<span class="lbl">list(' + c + ') →</span> <b>' + A.esc(A.repr(res)) + '</b>';
      len.innerHTML = '<span class="lbl">quantidade de voltas do for →</span> <b>' + res.length + '</b>';
      if (!res.length) tip.innerHTML = '⚠ Sequência <b>vazia</b>: com step ' + (v.step > 0 ? 'positivo, start precisa ser menor que stop' : 'negativo, start precisa ser maior que stop') + '. O for não executaria nenhuma vez.';
      else tip.innerHTML = 'Repare: o <b style="color:var(--bad)">stop nunca entra</b> na sequência. Ele é só o limite. ' + (v.step < 0 ? 'Com step negativo, a contagem é regressiva.' : '');
    }
    ins.forEach(function (i) { i.addEventListener('input', upd); });
    upd();
  };
})(window.ALG);
