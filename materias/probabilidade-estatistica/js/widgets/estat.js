/* =========================================================
   Funções estatísticas usadas pelos widgets (A.est).
   Mesmas regras das aulas: desvio padrão de amostra (n − 1),
   quartis pelo método "dividir ao meio" (Aula 5).
   ========================================================= */
(function (A) {
  var E = A.est = {};

  E.soma = function (v) { return v.reduce(function (a, b) { return a + b; }, 0); };
  E.media = function (v) { return E.soma(v) / v.length; };
  E.mediana = function (v) {
    var o = v.slice().sort(function (a, b) { return a - b; }), n = o.length, m = Math.floor(n / 2);
    return n % 2 ? o[m] : (o[m - 1] + o[m]) / 2;
  };
  E.desvio = function (v) {                 // amostra: divide por n − 1
    if (v.length < 2) return 0;
    var m = E.media(v);
    return Math.sqrt(E.soma(v.map(function (x) { return (x - m) * (x - m); })) / (v.length - 1));
  };
  /* resumo de cinco números: ímpar exclui a mediana das metades; par divide ao meio */
  E.cinco = function (v) {
    var o = v.slice().sort(function (a, b) { return a - b; }), n = o.length, m = Math.floor(n / 2);
    var inf = o.slice(0, m), sup = n % 2 ? o.slice(m + 1) : o.slice(m);
    var q1 = inf.length ? E.mediana(inf) : o[0], q3 = sup.length ? E.mediana(sup) : o[n - 1];
    var iqr = q3 - q1, li = q1 - 1.5 * iqr, ls = q3 + 1.5 * iqr;
    var dentro = o.filter(function (x) { return x >= li && x <= ls; });
    return {
      ord: o, min: o[0], q1: q1, med: E.mediana(o), q3: q3, max: o[n - 1], iqr: iqr, li: li, ls: ls,
      bigodeMin: dentro.length ? dentro[0] : o[0], bigodeMax: dentro.length ? dentro[dentro.length - 1] : o[n - 1],
      outliers: o.filter(function (x) { return x < li || x > ls; })
    };
  };
  E.correlacao = function (x, y) {
    var n = x.length;
    if (n < 2) return 0;
    var mx = E.media(x), my = E.media(y), sxy = 0, sxx = 0, syy = 0;
    for (var i = 0; i < n; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) * (x[i] - mx); syy += (y[i] - my) * (y[i] - my); }
    return sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0;
  };
  E.regressao = function (x, y) {           // m = r · sy/sx ; b = ȳ − m · x̄
    var r = E.correlacao(x, y), sx = E.desvio(x), sy = E.desvio(y);
    var m = sx ? r * sy / sx : 0;
    return { m: m, b: E.media(y) - m * E.media(x), r: r };
  };
  E.forca = function (r) {
    var a = Math.abs(r);
    var f = a >= 0.995 ? 'perfeita' : a >= 0.7 ? 'forte' : a >= 0.5 ? 'moderada' : a >= 0.3 ? 'fraca' : 'muito fraca ou inexistente';
    return (a < 0.3 ? '' : (r > 0 ? 'positiva ' : 'negativa ')) + f;
  };

  /* normal: função de distribuição acumulada (Abramowitz-Stegun 7.1.26, erro < 1,5e-7) */
  E.erf = function (x) {
    var s = x < 0 ? -1 : 1; x = Math.abs(x);
    var t = 1 / (1 + 0.3275911 * x);
    var y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return s * y;
  };
  E.phi = function (z) { return 0.5 * (1 + E.erf(z / Math.SQRT2)); };
  E.densidade = function (x, mu, s) { var z = (x - mu) / s; return Math.exp(-z * z / 2) / (s * Math.sqrt(2 * Math.PI)); };

  /* formatação brasileira: vírgula decimal */
  E.fmt = function (x, casas) {
    if (!isFinite(x)) return '—';
    casas = casas === undefined ? 2 : casas;
    var s = x.toFixed(casas);
    if (casas > 0) s = s.replace(/\.?0+$/, '');
    return s.replace('-', '−').replace('.', ',');
  };
  /* "2, 3; 5 7" → [2, 3, 5, 7]  (aceita vírgula decimal: "2,5" vira 2.5 quando separado por espaço/;) */
  E.lerLista = function (txt) {
    var t = String(txt).trim();
    var partes = /[;\s]/.test(t) && /\d,\d/.test(t) ? t.split(/[;\s]+/) : t.split(/[,;\s]+/);
    return partes.filter(function (p) { return p !== ''; })
      .map(function (p) { return Number(p.replace(',', '.')); })
      .filter(function (x) { return isFinite(x); }).slice(0, 60);
  };
  E.py = function (x) { return Number.isInteger(x) ? String(x) : String(Math.round(x * 1e6) / 1e6); };
})(window.ALG);
