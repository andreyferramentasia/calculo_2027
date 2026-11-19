/* Aula 07 — Correlação: relações entre variáveis */
(function (A) {
  function nm(v) { return Number.isInteger(v) ? v : A.F(v); }

  A.lesson({
    id: 'correlacao', module: 'p4', num: 7, minutes: 35,
    title: 'Correlação não é causalidade',
    goals: ['Dados bivariados', 'Dispersão', 'Coeficiente r', 'Variável de confusão'],
    body: [
      { h2: '1. Diagrama de dispersão' },
      { html: '<p>Quando cada observação traz <b>duas</b> informações numéricas (um par x, y), o dado é <b>bivariado</b>. No <b>diagrama de dispersão</b>, cada par vira um ponto.</p>' +
        '<table><thead><tr><th>O que você vê</th><th>Significa</th></tr></thead><tbody>' +
        '<tr><td>pontos subindo da esquerda para a direita</td><td>relação <b>positiva</b></td></tr>' +
        '<tr><td>pontos descendo</td><td>relação <b>negativa</b></td></tr>' +
        '<tr><td>pontos espalhados, sem padrão</td><td>nenhuma relação (linear)</td></tr></tbody></table>' },
      { widget: 'dispersao', opts: { dados: 'seguidores' } },
      { tip: '<p>Troque o conjunto de dados, clique no gráfico para pôr pontos e veja o <b>r</b> mudar. Tente colocar um ponto bem longe dos outros.</p>' },

      { h2: '2. O coeficiente de correlação r' },
      { html: '<p>O <b>r</b> resume em um número, entre <b>−1 e +1</b>, a força e a direção de uma relação <b>linear</b>. Perto de ±1: pontos quase em linha reta. Perto de 0: espalhados. O sinal dá a direção.</p>' +
        '<table><thead><tr><th>r</th><th>Leitura</th></tr></thead><tbody>' +
        '<tr><td>−1</td><td>negativa perfeita</td></tr><tr><td>−0,70</td><td>negativa forte</td></tr><tr><td>−0,50</td><td>negativa moderada</td></tr><tr><td>−0,30</td><td>negativa fraca</td></tr>' +
        '<tr><td>0</td><td>nenhuma relação linear</td></tr><tr><td>+0,30</td><td>positiva fraca</td></tr><tr><td>+0,50</td><td>positiva moderada</td></tr><tr><td>+0,70</td><td>positiva forte</td></tr><tr><td>+1</td><td>positiva perfeita</td></tr></tbody></table>' +
        '<p class="formula">r = Σ(x − x̄)(y − ȳ) ÷ [ (n − 1) · s<sub>x</sub> · s<sub>y</sub> ]</p>' },
      { img: 'img/aulas/secao2-forcas-correlacao.jpg', alt: 'Seis diagramas de dispersão com correlações diferentes', caption: 'Quanto mais perto de uma reta, mais forte a correlação.', fonte: 'elaborado pelo autor.' },
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
      { warn: '<p>Calcule r só depois de <b>olhar o gráfico</b>. Um r alto pode enganar se os pontos seguem uma curva, e não uma reta.</p>' },

      { h2: '3. Propriedades e o cuidado com causa e efeito' },
      { html: '<table><thead><tr><th>Propriedade</th><th>Significa</th></tr></thead><tbody>' +
        '<tr><td>−1 ≤ r ≤ 1</td><td>nunca sai desse intervalo</td></tr>' +
        '<tr><td>não tem unidade</td><td>trocar metros por centímetros não muda r</td></tr>' +
        '<tr><td>x e y podem trocar de lugar</td><td>r(x, y) = r(y, x)</td></tr>' +
        '<tr><td><b>correlação ≠ causalidade</b></td><td>relação forte não prova que uma causa a outra</td></tr></tbody></table>' +
        '<p>Vendas de sorvete e afogamentos sobem juntos no verão. Sorvete não causa afogamento: o <b>calor</b> é a <b>variável de confusão</b> que mexe nas duas. No app: quem recebe mais notificações usa mais, mas talvez quem já é engajado gere mais notificações.</p>' },
      { tip: '<p>Diante de "estudo encontra relação entre X e Y", pergunte: <b>existe uma terceira variável que explique as duas?</b></p>' }
    ],
    quiz: [
      { q: 'r = −0,85 indica uma relação:', options: ['positiva fraca', 'negativa forte', 'nenhuma', 'negativa fraca'], answer: 1, explain: 'Sinal negativo = direção de descida; |r| = 0,85 = forte.' },
      { q: 'Qual valor é impossível para r?', options: ['−1', '0', '0,99', '1,3'], answer: 3, explain: 'r sempre fica entre −1 e +1.' },
      { q: 'Vendas de guarda-chuva e de capas de chuva têm r = 0,9. Conclusão correta:', options: ['guarda-chuva causa capa de chuva', 'elas sobem juntas; a chuva pode explicar as duas', 'é coincidência', 'r está errado'], answer: 1, explain: 'Correlação não prova causa; a chuva é uma variável de confusão.' },
      { q: 'Trocar x por y no cálculo de r:', options: ['inverte o sinal', 'não muda r', 'eleva r ao quadrado', 'zera r'], answer: 1, explain: 'A correlação é simétrica.' }
    ]
  });
})(window.ALG);
