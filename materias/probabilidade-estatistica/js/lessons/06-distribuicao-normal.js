/* Aula 06 — A distribuição normal */
(function (A) {
  A.lesson({
    id: 'distribuicao-normal', module: 'p3', num: 6, minutes: 35,
    title: 'A distribuição normal',
    goals: ['Curva em sino', 'Regra Empírica', 'Escore Z', 'Tabela Z', 'Percentil'],
    body: [
      { h2: '1. A curva em forma de sino' },
      { html: '<p>Muitos dados (altura, tempo de uso de um app) formam um <b>sino simétrico</b>: média e mediana no centro. A curva é definida pela <b>média μ</b> (onde fica) e pelo <b>desvio-padrão σ</b> (o quanto se espalha).</p>' +
        '<p class="formula">μ ± 1σ ≈ 68% · μ ± 2σ ≈ 95% · μ ± 3σ ≈ 99,7%</p>' },
      { warn: '<p>Dados com cauda de um lado só (como os tempos do suporte da Aula 5) <b>não</b> são normais.</p>' },

      { h2: '2. Padronização: o escore Z' },
      { html: '<p class="formula">z = (x − μ) ÷ σ</p>' +
        '<p>O <b>escore Z</b> diz quantos desvios-padrão o valor está acima (+) ou abaixo (−) da média. Serve para comparar escalas diferentes: Ana tirou 8 numa prova com média 6 e σ = 1 (z = 2); Bruno tirou 8 com média 7 e σ = 2 (z = 0,5). Ana foi bem melhor.</p>' },

      { h2: '3. Probabilidades e percentis com a tabela Z' },
      { html: '<p>A <b>tabela Z</b> dá p(Z &lt; z). Para "maior que": <b>1 − tabela</b>. Ex.: mais de 90 min no app → z = 2 → 1 − 0,9772 = <b>2,28%</b>.</p>' +
        '<table><thead><tr><th>z</th><th>−2</th><th>−1,28</th><th>−1</th><th>0</th><th>1</th><th>1,28</th><th>2</th></tr></thead><tbody>' +
        '<tr><td>p(Z &lt; z)</td><td>0,0228</td><td>0,1003</td><td>0,1587</td><td>0,5</td><td>0,8413</td><td>0,8997</td><td>0,9772</td></tr></tbody></table>' },
      { widget: 'normal', opts: { mu: 60, sd: 15, x: 90 } },
      { html: '<p><b>Percentil (caminho inverso):</b> os 10% mais engajados começam em x = μ + z·σ = 60 + 1,28 × 15 = <b>79,2 min</b>.</p>' },
      { code: 'import statistics\n\nd = statistics.NormalDist(60, 15)\nprint(f"P(X < 30 min): {d.cdf(30):.4f}")\nprint(f"P(X > 90 min): {1 - d.cdf(90):.4f}")\nprint(f"90º percentil: {d.inv_cdf(0.90):.1f} min")', out: 'P(X < 30 min): 0.0228\nP(X > 90 min): 0.0228\n90º percentil: 79.2 min' },
      { warn: '<p><b>Percentil ≠ percentual:</b> percentil é um valor de x (um tempo, uma nota), não uma %.</p>' },
    ],
    quiz: [
      { q: 'Pela Regra Empírica, quantos % dos dados ficam entre μ − 2σ e μ + 2σ?', options: ['68%', '95%', '99,7%', '50%'], answer: 1, explain: '1σ: 68%; 2σ: 95%; 3σ: 99,7%.' },
      { q: 'μ = 70, σ = 5. Qual o escore Z de x = 60?', options: ['2', '−2', '−10', '0,5'], answer: 1, explain: '(60 − 70) ÷ 5 = −2.' },
      { q: 'p(Z &lt; 1) = 0,8413. Quanto vale p(Z &gt; 1)?', options: ['0,8413', '0,1587', '0,5', '1,8413'], answer: 1, explain: '1 − 0,8413 = 0,1587.' },
      { q: 'Numa distribuição normal, a média e a mediana:', options: ['são iguais', 'a média é sempre maior', 'a mediana é sempre maior', 'não existem'], answer: 0, explain: 'A curva é simétrica: as duas ficam no centro.' }
    ]
  });
})(window.ALG);
