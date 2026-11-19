/* Aula 03 — Medidas de tendência central e de dispersão */
(function (A) {
  A.lesson({
    id: 'medidas', module: 'p2', num: 3, minutes: 35,
    title: 'Média, mediana e desvio padrão',
    goals: ['Média', 'Mediana', 'Outlier', 'Desvio padrão'],
    body: [
      { h2: '1. Medindo o centro: média e mediana' },
      { html: '<div class="ideias">' +
        '<div class="ideia"><h4>Média (x̄)</h4><p class="resumo">soma ÷ n</p><p>40, 45, 50, 52, 58, 60 → 305 ÷ 6 ≈ 50,8</p></div>' +
        '<div class="ideia"><h4>Mediana</h4><p class="resumo">ordenar e pegar o do meio</p><p>n par: média dos dois do meio → (50 + 52) ÷ 2 = 51</p></div>' +
        '</div>' },
      { html: A.ilus('balanca', 'A média é o ponto de equilíbrio: um peso lá longe (outlier) arrasta o apoio.') },

      { h2: '2. Quando a média engana: outliers' },
      { html: '<p><b>Outlier</b> é um valor muito fora da maioria. Ele puxa a <b>média</b>; a <b>mediana</b> quase não se mexe (é <b>resistente</b>). Na padaria, salários de 1.800 a 2.100 e o dono com 12.000: média R$ 3.960, mediana R$ 2.000. Clique em <b>+ outlier</b>:</p>' },
      { widget: 'medidas', opts: { valores: '1, 2, 2, 3, 3, 4' } },

      { h2: '3. Medindo a dispersão: o desvio padrão' },
      { html: '<p>O <b>desvio padrão</b> mede o quanto os dados se <b>espalham</b> em torno da média. Dois apps com nota média 4,0: desvio 0,3 = usuários concordam; desvio 1,5 = opiniões divididas.</p>' +
        '<p class="formula">s = √( Σ(x − x̄)² ÷ (n − 1) )</p>' },
      { html: A.ilus('alvos') },
      { lab: {
        title: 'Desvio padrão passo a passo',
        params: { dados: [2, 3, 3, 5, 7] },
        viz: 'array',
        code: function (P) {
          var d = P.dados.filter(function (x) { return typeof x === 'number'; }).slice(0, 8);
          return 'dados = ' + A.repr(d.length > 1 ? d : [2, 3, 3, 5, 7]) + '\nmedia = sum(dados) / len(dados)\nsoma = 0\nfor x in dados:\n    soma = soma + (x - media) ** 2\nvariancia = soma / (len(dados) - 1)\ndesvio = variancia ** 0.5\nprint(media, desvio)';
        },
        gen: function* (P) {
          var d = P.dados.filter(function (x) { return typeof x === 'number'; }).slice(0, 8);
          if (d.length < 2) d = [2, 3, 3, 5, 7];
          function F(v) { return Number.isInteger(v) ? A.F(v) : A.F(v); }
          var n = d.length, m = d.reduce(function (a, b) { return a + b; }, 0) / n, soma = 0, ok = [];
          function Z(k) { return { arr: d, ptr: k === null ? {} : { x: k }, hl: k === null ? [] : [k], ok: ok, label: 'dados' }; }
          yield { l: 1, v: { dados: d }, viz: Z(null) };
          yield { l: 2, v: { dados: d, media: F(m) }, viz: Z(null), n: '(1) média = ' + d.join(' + ') + ' ÷ ' + n + ' = <b>' + A.fmtFloat(m) + '</b>' };
          yield { l: 3, v: { dados: d, media: F(m), soma: 0 }, viz: Z(null) };
          for (var k = 0; k < n; k++) {
            var x = d[k], dif = x - m, q = dif * dif;
            yield { l: 4, v: { dados: d, media: F(m), soma: Number.isInteger(soma) ? soma : A.F(soma), x: x }, it: k + 1, viz: Z(k) };
            soma += q;
            ok.push(k);
            yield { l: 5, v: { dados: d, media: F(m), soma: A.F(soma), x: x }, it: k + 1, viz: Z(k), n: '(2) ' + x + ' − ' + A.fmtFloat(m) + ' = ' + A.fmtFloat(dif) + ' → (3) ao quadrado: ' + A.fmtFloat(q) + ' → (4) soma vai para <b>' + A.fmtFloat(soma) + '</b>' };
          }
          var vr = soma / (n - 1), s = Math.sqrt(vr);
          yield { l: 6, v: { media: F(m), soma: A.F(soma), variancia: A.F(vr) }, viz: Z(null), n: '(5) divide por n − 1 = ' + (n - 1) + ': variância = <b>' + A.fmtFloat(vr) + '</b>. Por que n − 1? Porque é uma <b>amostra</b>: corrige uma pequena subestimação.' };
          yield { l: 7, v: { media: F(m), variancia: A.F(vr), desvio: A.F(s) }, viz: Z(null), n: '(6) raiz quadrada: desvio padrão = <b>' + A.fmtFloat(s) + '</b>, na mesma unidade dos dados.' };
          yield { l: 8, v: { media: F(m), variancia: A.F(vr), desvio: A.F(s) }, viz: Z(null), p: A.print(A.F(m), A.F(s)) };
        }
      } },
      { code: 'import statistics\n\ntravamentos = [2, 3, 3, 5, 7]\nprint(f"Média: {statistics.mean(travamentos):.1f}")\nprint(f"Mediana: {statistics.median(travamentos):.1f}")\nprint(f"Desvio padrão: {statistics.stdev(travamentos):.1f}")', out: 'Média: 4.0\nMediana: 3.0\nDesvio padrão: 2.0' },
      { warn: '<p>O desvio padrão <b>nunca é negativo</b> (só é 0 se todos os valores forem iguais). <code>statistics.stdev</code> divide por n − 1 (amostra).</p>' },
    ],
    quiz: [
      { q: 'Qual a mediana de 7, 1, 9, 3, 5?', options: ['3', '5', '9', '5,0 e 7'], answer: 1, explain: 'Ordenando: 1, 3, 5, 7, 9. O do meio é 5.' },
      { q: 'Qual medida é resistente a outliers?', options: ['média', 'mediana', 'desvio padrão', 'soma'], answer: 1, explain: 'A mediana só depende da posição central dos dados ordenados.' },
      { q: 'Dois apps têm nota média 4,0. O desvio padrão de A é 0,2 e o de B é 1,8. Então:', options: ['A tem mais avaliações', 'Em B as opiniões são mais divididas', 'B é melhor', 'Os dois são iguais'], answer: 1, explain: 'Desvio maior = notas mais espalhadas em torno da média.' },
      { q: 'No desvio padrão de uma amostra, a soma dos quadrados é dividida por:', options: ['n', 'n − 1', 'n + 1', '2'], answer: 1, explain: 'Para amostras usa-se n − 1.' }
    ]
  });
})(window.ALG);
