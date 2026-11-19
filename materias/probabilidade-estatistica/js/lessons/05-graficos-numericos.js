/* Aula 05 — Gráficos para dados numéricos */
(function (A) {
  function mediana(v) {           // como statistics.median: par → float
    var n = v.length, m = Math.floor(n / 2);
    return n % 2 ? v[m] : A.F((v[m - 1] + v[m]) / 2);
  }
  function num(x) { return typeof x === 'object' ? x.$f : x; }

  A.lesson({
    id: 'graficos-numericos', module: 'p3', num: 5, minutes: 35,
    title: 'Histograma, boxplot e linha do tempo',
    goals: ['Histograma', 'Assimetria', 'Quartis', 'IQR e outliers', 'Linha do tempo'],
    body: [
      { h2: '1. Histograma: a forma dos dados numéricos' },
      { html: '<p>O <b>histograma</b> agrupa os valores em <b>faixas</b> e desenha uma barra por faixa (barras coladas, porque as faixas são contínuas). Ele mostra a <b>forma</b> dos dados.</p>' },
      { html: A.ilus('histograma', 'Poucos valores altos formam a cauda e puxam a média para a direita da mediana.') },
      { html: '<table><thead><tr><th>Forma</th><th>Média x mediana</th></tr></thead><tbody>' +
        '<tr><td>simétrica</td><td>próximas</td></tr><tr><td>cauda à direita</td><td>média &gt; mediana</td></tr><tr><td>cauda à esquerda</td><td>média &lt; mediana</td></tr></tbody></table>' },
      { tip: '<p>Comece com 6 a 10 faixas: poucas escondem o padrão, muitas viram ruído.</p>' },

      { h2: '2. Boxplot: o resumo de cinco números' },
      { html: '<p>O <b>boxplot</b> resume tudo em <b>mínimo, Q1, mediana, Q3 e máximo</b>. Q1 e Q3 são as medianas das metades de baixo e de cima.</p>' +
        '<p class="formula">IQR = Q3 − Q1 &nbsp;·&nbsp; outlier: além de Q3 + 1,5·IQR (ou Q1 − 1,5·IQR)</p>' },
      { lab: {
        title: 'Quartis dividindo ao meio',
        params: { dados: [2, 2, 3, 3, 4, 4, 5, 6, 15] },
        viz: 'array',
        code: function (P) {
          var d = P.dados.filter(function (x) { return typeof x === 'number'; }).slice(0, 12);
          if (d.length < 4) d = [2, 2, 3, 3, 4, 4, 5, 6, 15];
          var impar = d.length % 2 === 1;
          return 'import statistics\ndados = sorted(' + A.repr(d) + ')\nmeio = len(dados) // 2\ninferior = dados[:meio]\nsuperior = dados[' + (impar ? 'meio + 1' : 'meio') + ':]' + (impar ? '   # n ímpar: a mediana fica de fora' : '   # n par: metades inteiras') +
            '\nq1 = statistics.median(inferior)\nq3 = statistics.median(superior)\niqr = q3 - q1\nprint(q1, statistics.median(dados), q3, iqr)';
        },
        gen: function* (P) {
          var d = P.dados.filter(function (x) { return typeof x === 'number'; }).slice(0, 12);
          if (d.length < 4) d = [2, 2, 3, 3, 4, 4, 5, 6, 15];
          d = d.slice().sort(function (a, b) { return a - b; });
          var n = d.length, meio = Math.floor(n / 2), impar = n % 2 === 1;
          var inf = d.slice(0, meio), sup = d.slice(impar ? meio + 1 : meio);
          var ok = [], hl = [], dim = [];
          function Z(p) { return { arr: d, ptr: p || {}, hl: hl, ok: ok, dim: dim, label: 'dados (ordenados)' }; }
          yield { l: 1, v: {}, viz: Z() };
          yield { l: 2, v: { dados: d }, viz: Z(), n: 'Primeiro passo de tudo: <b>ordenar</b>.' };
          yield { l: 3, v: { dados: d, meio: meio }, viz: Z({ meio: meio }), n: 'n = ' + n + ', então meio = ' + n + ' // 2 = ' + meio + '.' + (impar ? ' A posição ' + meio + ' é a mediana (' + d[meio] + ').' : '') };
          for (var i = 0; i < meio; i++) ok.push(i);
          yield { l: 4, v: { dados: d, meio: meio, inferior: inf }, viz: Z({ meio: meio }), n: 'Metade de baixo: posições 0 a ' + (meio - 1) + '.' };
          if (impar) dim.push(meio);
          for (i = impar ? meio + 1 : meio; i < n; i++) hl.push(i);
          yield { l: 5, v: { dados: d, meio: meio, inferior: inf, superior: sup }, viz: Z({ meio: meio }), n: impar ? 'n é ímpar: a mediana (posição ' + meio + ') <b>fica de fora</b> das duas metades.' : 'n é par: as duas metades têm ' + meio + ' valores cada.' };
          var q1 = mediana(inf), q3 = mediana(sup), med = mediana(d);
          yield { l: 6, v: { inferior: inf, superior: sup, q1: q1 }, viz: Z({ meio: meio }), n: 'Q1 = mediana de ' + A.repr(inf) + ' = <b>' + A.repr(q1) + '</b>' };
          yield { l: 7, v: { inferior: inf, superior: sup, q1: q1, q3: q3 }, viz: Z({ meio: meio }), n: 'Q3 = mediana de ' + A.repr(sup) + ' = <b>' + A.repr(q3) + '</b>' };
          var iqrV = num(q3) - num(q1), iqr = (typeof q1 === 'object' || typeof q3 === 'object') ? A.F(iqrV) : iqrV;
          var ls = num(q3) + 1.5 * iqrV, outs = d.filter(function (x) { return x > ls || x < num(q1) - 1.5 * iqrV; });
          yield { l: 8, v: { q1: q1, q3: q3, iqr: iqr }, viz: Z({ meio: meio }), n: 'IQR = ' + A.repr(q3) + ' − ' + A.repr(q1) + ' = <b>' + A.repr(iqr) + '</b>. Limite de cima: Q3 + 1,5·IQR = ' + A.fmtFloat(ls) + (outs.length ? ' → <b>' + outs.join(', ') + '</b> é outlier.' : ' → nenhum outlier.') };
          yield { l: 9, v: { q1: q1, q3: q3, iqr: iqr }, viz: Z({ meio: meio }), p: A.print(q1, med, q3, iqr) };
        }
      } },
      { widget: 'boxplot' },
      { warn: '<p>Cada parte do boxplot tem <b>25%</b> dos dados. Parte comprida = dados mais espalhados, não mais dados.</p>' },
      { code: 'import matplotlib.pyplot as plt\n\ntempos = [2, 2, 3, 3, 4, 4, 5, 6, 15]\nplt.boxplot(tempos, vert=False)\nplt.xlabel("Tempo de carregamento (segundos)")\nplt.title(f"Tempo de carregamento em {len(tempos)} testes")\nplt.show()' },

      { h2: '3. Gráfico de linha do tempo' },
      { html: '<p>O <b>gráfico de linha</b> mostra um valor ao longo do tempo: <b>tendência</b> (sobe, desce) e <b>padrão cíclico</b> (picos todo fim de semana). Cuidado com a escala:</p>' },
      { html: A.ilus('linhaTempo', 'Os mesmos dados: só a escala do eixo mudou.') },
      { tip: '<p>Antes de confiar: <b>o eixo começa em 0? as datas têm espaçamento igual? é taxa ou só contagem?</b></p>' },
    ],
    quiz: [
      { q: 'Um histograma tem cauda longa à direita. Então, em geral:', options: ['média = mediana', 'média &gt; mediana', 'média &lt; mediana', 'não há mediana'], answer: 1, explain: 'Poucos valores altos puxam a média para cima.' },
      { q: 'Dados: 1, 3, 5, 7, 9, 11, 13. Qual é Q1?', options: ['3', '4', '5', '1'], answer: 0, explain: 'n = 7 (ímpar): mediana 7 fica de fora; metade de baixo 1, 3, 5 → Q1 = 3.' },
      { q: 'Q1 = 10 e Q3 = 20. A partir de que valor um dado é outlier (por cima)?', options: ['25', '30', '35', '40'], answer: 2, explain: 'IQR = 10; 20 + 1,5 · 10 = 35.' },
      { q: 'Picos de usuários todo fim de semana num gráfico de linha são um padrão:', options: ['cíclico', 'assimétrico', 'categórico', 'de outlier'], answer: 0, explain: 'Padrão que se repete em intervalos regulares é cíclico.' }
    ]
  });
})(window.ALG);
