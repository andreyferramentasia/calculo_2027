/* =========================================================
   WIDGET: princípio da multiplicação (senhas)
   Escolhe tamanho, alfabeto e se pode repetir: mostra cada
   etapa (casinha), o produto e o código Python equivalente.
   ========================================================= */
(function (A) {
  var ALF = [
    { k: 10, t: 'dígitos 0–9', py: '"0123456789"' },
    { k: 2, t: 'bits 0/1', py: '"01"' },
    { k: 26, t: 'letras a–z', py: 'string.ascii_lowercase' },
    { k: 36, t: 'letras + dígitos', py: 'string.ascii_lowercase + string.digits' }
  ];
  function fmt(n) { return n.toLocaleString('pt-BR'); }

  A.widgets.contagem = function (host) {
    var body = A.widgetBox(host, 'Quantas senhas existem?');
    body.innerHTML =
      '<div class="widget-row">' +
      '  <label class="field">tamanho <input type="range" min="1" max="8" value="4" class="cn"><output></output></label>' +
      '  <label class="field">símbolos <select class="ca"></select></label>' +
      '  <label class="field">pode repetir? <select class="cr"><option value="1">sim</option><option value="0">não</option></select></label>' +
      '</div>' +
      '<div class="cont-etapas"></div>' +
      '<div class="pycall cpy"></div>' +
      '<p class="muted ctip" style="font-size:.9rem;margin:6px 0 0"></p>';
    var n = A.$('.cn', body), a = A.$('.ca', body), r = A.$('.cr', body);
    ALF.forEach(function (x, i) { var o = A.el('option'); o.value = i; o.textContent = x.t + ' (' + x.k + ')'; a.appendChild(o); });

    function upd() {
      var tam = +n.value, alf = ALF[+a.value], rep = r.value === '1';
      n.nextElementSibling.textContent = tam;
      var fatores = [], total = 1;
      for (var i = 0; i < tam; i++) {
        var f = rep ? alf.k : Math.max(alf.k - i, 0);
        fatores.push(f);
        total *= f;
      }
      A.$('.cont-etapas', body).innerHTML = fatores.map(function (f, i) {
        return '<span class="slot" style="animation-delay:' + (i * 50) + 'ms" title="etapa ' + (i + 1) + '">' + f + '</span>';
      }).join('<span>×</span>') + '<span>=</span><span class="slot total">' + fmt(total) + '</span>';
      var imp = alf.py.indexOf('string.') === 0 ? 'import string\n' : '';
      A.$('.cpy', body).innerHTML = A.highlight(imp + 'from itertools import ' + (rep ? 'product' : 'permutations') + '\n' +
        'print(len(list(' + (rep ? 'product(' + alf.py + ', repeat=' + tam + ')' : 'permutations(' + alf.py + ', ' + tam + ')') + ')))').replace(/\n/g, '<br>');
      A.$('.ctip', body).innerHTML = rep
        ? 'Com repetição, toda etapa tem as mesmas <b>' + alf.k + '</b> opções: ' + alf.k + '<sup>' + tam + '</sup> = ' + fmt(total) + '.'
        : 'Sem repetição, cada etapa tem <b>uma opção a menos</b>, porque o símbolo já usado não volta.' + (total === 0 ? ' Aqui não há símbolos suficientes!' : '');
    }
    [n, a, r].forEach(function (x) { x.addEventListener('input', upd); });
    upd();
  };
})(window.ALG);
