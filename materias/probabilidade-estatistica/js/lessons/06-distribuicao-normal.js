/* Aula 06 — A distribuição normal */
(function (A) {
  A.lesson({
    id: 'distribuicao-normal', module: 'p3', num: 6, minutes: 35,
    title: 'A distribuição normal',
    goals: ['Curva em sino', 'Regra Empírica', 'Escore Z', 'Tabela Z', 'Percentil'],
    body: [
      { h2: '1. A curva em forma de sino' },
      { html: '<p>Muitos dados numéricos, num histograma, formam uma curva suave em <b>forma de sino</b>: alta no meio e descendo dos dois lados. Ela é <b>simétrica</b>, por isso média e mediana ficam exatamente no centro. Ex.: altura de adultos, tempo diário de uso de um app.</p>' +
        '<p>Cada normal é definida por dois números: a <b>média μ</b> (onde fica o centro) e o <b>desvio-padrão σ</b> (o quanto ela se espalha).</p>' +
        '<table><thead><tr><th>O que muda</th><th>Efeito na curva</th></tr></thead><tbody>' +
        '<tr><td>μ maior ou menor</td><td>a curva toda anda para a direita ou para a esquerda</td></tr>' +
        '<tr><td>σ maior</td><td>mais espalhada e achatada</td></tr><tr><td>σ menor</td><td>mais estreita e alta</td></tr></tbody></table>' +
        '<p class="formula">Regra Empírica: μ ± 1σ ≈ 68% · μ ± 2σ ≈ 95% · μ ± 3σ ≈ 99,7%</p>' },
      { img: 'img/aulas/secao1-regra-empirica.jpg', alt: 'Curva normal com as faixas de 68, 95 e 99,7%', caption: 'Regra Empírica no tempo de uso diário de um app (média 60 min, desvio-padrão 15 min).', fonte: 'elaborado pelo autor.' },
      { warn: '<p>Nem todo dado é normal. Tempos de resposta do suporte (Aula 5), com cauda longa de um lado só, são <b>assimétricos</b>. A normal exige simetria.</p>' },

      { h2: '2. Padronização: o escore Z' },
      { html: '<p class="formula">z = (x − μ) ÷ σ</p>' +
        '<p>O <b>escore Z</b> diz quantos desvios-padrão um valor está acima (z &gt; 0) ou abaixo (z &lt; 0) da média. Todo escore Z segue a <b>normal padrão</b>: média 0 e desvio 1. Isso permite comparar coisas de escalas diferentes.</p>' +
        '<p>Ana tirou 8 numa prova com média 6 e desvio 1: z = 2. Bruno tirou 8 numa prova com média 7 e desvio 2: z = 0,5. Mesma nota, mas Ana foi <b>relativamente</b> muito melhor.</p>' +
        '<table><thead><tr><th>Tempo de uso (μ = 60, σ = 15)</th><th>Escore Z</th></tr></thead><tbody>' +
        '<tr><td>30 min</td><td>−2</td></tr><tr><td>45 min</td><td>−1</td></tr><tr><td>60 min</td><td>0</td></tr><tr><td>75 min</td><td>1</td></tr><tr><td>90 min</td><td>2</td></tr></tbody></table>' },
      { tip: '<p>Z alto nem sempre é "bom": tempo de carregamento com z = +2 é ruim; curtidas com z = +2 é ótimo. Depende do que está sendo medido.</p>' },

      { h2: '3. Probabilidades e percentis com a tabela Z' },
      { html: '<p>A <b>tabela Z</b> dá, para cada z, a probabilidade de um valor ser <b>menor</b>: p(Z &lt; z). Em três passos: padronizar, consultar, ajustar.</p>' +
        '<ul><li>"menor que": o valor da tabela já é a resposta.</li><li>"maior que": <b>1 − valor da tabela</b>.</li></ul>' +
        '<table><thead><tr><th>z</th><th>p(Z &lt; z)</th></tr></thead><tbody>' +
        '<tr><td>−2,00</td><td>0,0228</td></tr><tr><td>−1,28</td><td>0,1003</td></tr><tr><td>−1,00</td><td>0,1587</td></tr><tr><td>0,00</td><td>0,5000</td></tr>' +
        '<tr><td>1,00</td><td>0,8413</td></tr><tr><td>1,28</td><td>0,8997</td></tr><tr><td>2,00</td><td>0,9772</td></tr></tbody></table>' +
        '<p>Chance de um usuário passar <b>mais</b> de 90 min no app: z = (90 − 60) ÷ 15 = 2 → 1 − 0,9772 = <b>0,0228</b> (2,28%). Experimente outros valores:</p>' },
      { widget: 'normal', opts: { mu: 60, sd: 15, x: 90 } },
      { html: '<p><b>Caminho inverso (percentil):</b> qual tempo marca os 10% de usuários mais engajados? É o percentil 90; pela tabela, z ≈ 1,28. Voltando: <b>x = μ + z·σ</b> = 60 + 1,28 × 15 = <b>79,2 min</b>.</p>' },
      { code: 'import statistics\n\nd = statistics.NormalDist(60, 15)\nprint(f"P(X < 30 min): {d.cdf(30):.4f}")\nprint(f"P(X > 90 min): {1 - d.cdf(90):.4f}")\nprint(f"90º percentil: {d.inv_cdf(0.90):.1f} min")', out: 'P(X < 30 min): 0.0228\nP(X > 90 min): 0.0228\n90º percentil: 79.2 min' },
      { warn: '<p><b>Percentil ≠ percentual.</b> Percentual é um número de 0 a 100; percentil é um <b>valor de x</b> (um tempo, uma nota). E "os 10% melhores" pode ser o topo ou a base: em tempo de prova, menor é melhor.</p>' }
    ],
    quiz: [
      { q: 'Pela Regra Empírica, quantos % dos dados ficam entre μ − 2σ e μ + 2σ?', options: ['68%', '95%', '99,7%', '50%'], answer: 1, explain: '1σ: 68%; 2σ: 95%; 3σ: 99,7%.' },
      { q: 'μ = 70, σ = 5. Qual o escore Z de x = 60?', options: ['2', '−2', '−10', '0,5'], answer: 1, explain: '(60 − 70) ÷ 5 = −2.' },
      { q: 'p(Z &lt; 1) = 0,8413. Quanto vale p(Z &gt; 1)?', options: ['0,8413', '0,1587', '0,5', '1,8413'], answer: 1, explain: '1 − 0,8413 = 0,1587.' },
      { q: 'Numa distribuição normal, a média e a mediana:', options: ['são iguais', 'a média é sempre maior', 'a mediana é sempre maior', 'não existem'], answer: 0, explain: 'A curva é simétrica: as duas ficam no centro.' }
    ]
  });
})(window.ALG);
