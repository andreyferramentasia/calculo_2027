/* Aula 07 — Correlação: relações entre variáveis */
(function (A) {
  function nm(v) { return Number.isInteger(v) ? v : A.F(v); }

  A.lesson({
    id: 'correlacao', module: 'p4', num: 7, minutes: 35,
    title: 'Correlação não é causalidade',
    goals: ['Dados bivariados', 'Dispersão', 'Coeficiente r', 'Variável de confusão'],
    body: [
      { h2: '1. Diagrama de dispersão' },
      { html: '<p>Cada ponto é um par (x, y). Pontos <b>subindo</b> = relação positiva; <b>descendo</b> = negativa; <b>espalhados</b> = nenhuma.</p>' },
      { widget: 'dispersao', opts: { dados: 'seguidores' } },
      { tip: '<p>Clique no gráfico para pôr pontos. Ponha um bem longe dos outros e veja o r mudar.</p>' },

      { h2: '2. O coeficiente de correlação r' },
      { html: '<p>O <b>r</b> vai de <b>−1 a +1</b>: o sinal dá a direção e a distância de zero dá a força (|r| ≥ 0,7 forte, ≥ 0,5 moderada, ≥ 0,3 fraca).</p>' +
        '<p class="formula">r = Σ(x − x̄)(y − ȳ) ÷ [ (n − 1) · s<sub>x</sub> · s<sub>y</sub> ]</p>' },
      { html: A.ilus('correlacoes', 'Quanto mais perto de uma reta, mais forte a correlação.') },
      { lab: {
        title: 'Calculando r passo a passo',
        params: { x: [2, 4, 6], y: [3, 5, 4] },
        viz: 'array',
        code: function (P) {
          var x = P.x.filter(function (v) { return typeof v === 'number'; }), y = P.y.filter(function (v) { return typeof v === 'number'; });
          var n = Math.min(x.length, y.length, 8);
          if (n < 2) { x = [2, 4, 6]; y = [3, 5, 4]; n = 3; }
          return 'import statistics\nx = ' + A.repr(x.slice(0, n)) + '\ny = ' + A.repr(y.slice(0, n)) + '\nmx = statistics.mean(x)\nmy = statistics.mean(y)\nsoma = 0\nfor i in range(len(x)):\n    soma = soma + (x[i] - mx) * (y[i] - my)\nr = soma / ((len(x) - 1) * statistics.stdev(x) * statistics.stdev(y))\nprint(round(r, 4))';
        },
        gen: function* (P) {
          var x = P.x.filter(function (v) { return typeof v === 'number'; }), y = P.y.filter(function (v) { return typeof v === 'number'; });
          var n = Math.min(x.length, y.length, 8);
          if (n < 2) { x = [2, 4, 6]; y = [3, 5, 4]; n = 3; }
          x = x.slice(0, n); y = y.slice(0, n);
          var E = A.est, mx = E.media(x), my = E.media(y), soma = 0, ok = [];
          var pares = x.map(function (v, i) { return '(' + v + ', ' + y[i] + ')'; });
          function Z(k) { return { arr: pares, ptr: k === null ? {} : { i: k }, hl: k === null ? [] : [k], ok: ok, label: 'pares (x, y)' }; }
          var V = { x: x, y: y };
          yield { l: 2, v: { x: x }, viz: Z(null) };
          yield { l: 3, v: V, viz: Z(null) };
          V = { x: x, y: y, mx: nm(mx) };
          yield { l: 4, v: V, viz: Z(null), n: 'x̄ = ' + A.fmtFloat(mx) };
          V = { x: x, y: y, mx: nm(mx), my: nm(my) };
          yield { l: 5, v: V, viz: Z(null), n: 'ȳ = ' + A.fmtFloat(my) };
          yield { l: 6, v: Object.assign({ soma: 0 }, V), viz: Z(null) };
          for (var i = 0; i < n; i++) {
            var dx = x[i] - mx, dy = y[i] - my, p = dx * dy;
            yield { l: 7, v: Object.assign({ soma: nm(soma), i: i }, V), it: i + 1, viz: Z(i) };
            soma += p;
            ok.push(i);
            yield { l: 8, v: Object.assign({ soma: nm(soma), i: i }, V), it: i + 1, viz: Z(i), n: '(' + x[i] + ' − ' + A.fmtFloat(mx) + ') × (' + y[i] + ' − ' + A.fmtFloat(my) + ') = ' + A.fmtFloat(dx) + ' × ' + A.fmtFloat(dy) + ' = <b>' + A.fmtFloat(p) + '</b>' + (p > 0 ? ' (mesmo lado da média: puxa r para cima)' : p < 0 ? ' (lados opostos: puxa r para baixo)' : '') };
          }
          var sx = E.desvio(x), sy = E.desvio(y), r = soma / ((n - 1) * sx * sy);
          yield { l: 9, v: Object.assign({ soma: nm(soma), r: A.F(r) }, V), viz: Z(null), n: 'r = ' + A.fmtFloat(soma) + ' ÷ (' + (n - 1) + ' × ' + E.fmt(sx, 4) + ' × ' + E.fmt(sy, 4) + ') = <b>' + E.fmt(r, 4) + '</b>: relação ' + E.forca(r) + '.' };
          yield { l: 10, v: Object.assign({ soma: nm(soma), r: A.F(r) }, V), viz: Z(null), p: A.print(A.F(Math.round(r * 1e4) / 1e4)) };
        }
      } },
      { code: 'import statistics\n\nhoras = [2, 3, 4, 5, 6]\nnotificacoes = [10, 12, 15, 14, 20]\nr = statistics.correlation(horas, notificacoes)\nprint(f"Correlação: {r:.4f}")', out: 'Correlação: 0.9231' },
      { warn: '<p>Olhe o gráfico antes: r alto engana se os pontos fazem uma curva.</p>' },

      { h2: '3. Propriedades e o cuidado com causa e efeito' },
      { html: '<p>r não tem unidade e r(x, y) = r(y, x). Mas <b>correlação não é causalidade</b>: sorvete e afogamento sobem juntos no verão porque o <b>calor</b> (variável de confusão) mexe nos dois.</p>' },
      { tip: '<p>Diante de "X está ligado a Y", pergunte: <b>que terceira variável explicaria os dois?</b></p>' },
    ],
    quiz: [
      { q: 'r = −0,85 indica uma relação:', options: ['positiva fraca', 'negativa forte', 'nenhuma', 'negativa fraca'], answer: 1, explain: 'Sinal negativo = direção de descida; |r| = 0,85 = forte.' },
      { q: 'Qual valor é impossível para r?', options: ['−1', '0', '0,99', '1,3'], answer: 3, explain: 'r sempre fica entre −1 e +1.' },
      { q: 'Vendas de guarda-chuva e de capas de chuva têm r = 0,9. Conclusão correta:', options: ['guarda-chuva causa capa de chuva', 'elas sobem juntas; a chuva pode explicar as duas', 'é coincidência', 'r está errado'], answer: 1, explain: 'Correlação não prova causa; a chuva é uma variável de confusão.' },
      { q: 'Trocar x por y no cálculo de r:', options: ['inverte o sinal', 'não muda r', 'eleva r ao quadrado', 'zera r'], answer: 1, explain: 'A correlação é simétrica.' }
    ]
  });
})(window.ALG);
