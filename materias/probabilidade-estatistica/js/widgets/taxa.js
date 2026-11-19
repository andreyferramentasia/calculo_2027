/* =========================================================
   WIDGET: contagem x taxa (Aula 1)
   Dois grupos de tamanhos diferentes: a contagem aponta um
   "pior", a taxa pode apontar outro.
   ========================================================= */
(function (A) {
  var E = A.est;
  A.widgets.taxa = function (host, opts) {
    opts = opts || {};
    var body = A.widgetBox(host, 'Contagem ou taxa: quem está pior?');
    body.innerHTML =
      '<div class="widget-row">' +
      '  <label class="field">App A: travamentos <input type="number" min="0" class="ta1"></label>' +
      '  <label class="field">App A: sessões <input type="number" min="1" class="ta2"></label>' +
      '  <label class="field">App B: travamentos <input type="number" min="0" class="tb1"></label>' +
      '  <label class="field">App B: sessões <input type="number" min="1" class="tb2"></label>' +
      '  <label class="field">por <select class="tk"><option>100</option><option selected>1000</option><option>100000</option></select></label>' +
      '</div>' +
      '<div class="est-titulo">Contagem (número bruto)</div><div class="est-barras tc"></div>' +
      '<div class="est-titulo">Taxa (por <span class="tkk"></span> sessões)</div><div class="est-barras tt"></div>' +
      '<div class="pycall tpy"></div>' +
      '<p class="ttip" style="margin:6px 0 0;font-weight:600"></p>';
    var f = {};
    ['ta1', 'ta2', 'tb1', 'tb2', 'tk'].forEach(function (k) { f[k] = A.$('.' + k, body); });
    f.ta1.value = opts.a1 || 18; f.ta2.value = opts.a2 || 12000; f.tb1.value = opts.b1 || 12; f.tb2.value = opts.b2 || 3000;

    function barras(el, va, vb, fmt) {
      var mx = Math.max(va, vb) || 1;
      el.innerHTML = [['App A', va, '#8fb8ff'], ['App B', vb, '#ff7aa6']].map(function (x) {
        return '<div class="est-barra"><span>' + x[0] + '</span><span class="trilho"><i style="width:' + (x[1] / mx * 100) + '%;--c:' + x[2] + '"></i></span><span class="v">' + fmt(x[1]) + '</span></div>';
      }).join('');
    }
    function upd() {
      var a1 = +f.ta1.value || 0, a2 = +f.ta2.value || 1, b1 = +f.tb1.value || 0, b2 = +f.tb2.value || 1, k = +f.tk.value;
      var ta = a1 / a2 * k, tb = b1 / b2 * k;
      A.$('.tkk', body).textContent = k.toLocaleString('pt-BR');
      barras(A.$('.tc', body), a1, b1, function (v) { return v.toLocaleString('pt-BR'); });
      barras(A.$('.tt', body), ta, tb, function (v) { return E.fmt(v, 2); });
      A.$('.tpy', body).innerHTML = A.highlight('print(' + a1 + ' / ' + a2 + ' * ' + k + ', ' + b1 + ' / ' + b2 + ' * ' + k + ')');
      var piorC = a1 === b1 ? null : a1 > b1 ? 'A' : 'B', piorT = ta === tb ? null : ta > tb ? 'A' : 'B';
      A.$('.ttip', body).innerHTML = piorC && piorT && piorC !== piorT
        ? '⚠ A contagem diz que o App ' + piorC + ' trava mais, mas a <b>taxa</b> mostra que o App ' + piorT + ' é que está pior. As bases são diferentes!'
        : 'Aqui contagem e taxa concordam. Mude o número de sessões de um dos apps e veja o que acontece.';
    }
    A.$$('input, select', body).forEach(function (i) { i.addEventListener('input', upd); });
    upd();
  };
})(window.ALG);
