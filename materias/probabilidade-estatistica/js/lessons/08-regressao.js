/* Aula 08 — Regressão linear: fazendo previsões */
(function (A) {
  A.lesson({
    id: 'regressao', module: 'p4', num: 8, minutes: 35,
    title: 'Regressão linear: fazendo previsões',
    goals: ['X explicativa, Y resposta', 'Inclinação m', 'Intercepto b', 'Previsão', 'Extrapolação'],
    body: [
      { h2: '1. A reta de regressão' },
      { html: '<p>Quando a relação é <b>linear</b> e a correlação é pelo menos moderada (<b>|r| ≥ 0,50</b>), traçamos a <b>reta de regressão</b>: a reta que melhor se ajusta aos pontos e serve para prever o valor médio de uma variável a partir da outra.</p>' +
        '<div class="ideias">' +
        '<div class="ideia"><h4>X: variável explicativa</h4><p>O que você <b>já sabe</b>. Ex.: horas de estudo, número de seguidores.</p></div>' +
        '<div class="ideia"><h4>Y: variável resposta</h4><p>O que você <b>quer prever</b>. Ex.: nota da prova, curtidas médias.</p></div>' +
        '</div>' +
        '<p class="formula">y = m·x + b</p>' +
        '<p>Diferente da correlação, aqui a ordem <b>importa</b>: X prevê, Y é previsto.</p>' },
      { img: 'img/aulas/secao1-reta-seguidores.jpg', alt: 'Diagrama de dispersão de seguidores e curtidas com a reta de regressão', caption: 'Seguidores e curtidas médias da Aula 7, agora com a reta ajustada.', fonte: 'elaborado pelo autor.' },

      { h2: '2. Inclinação e intercepto' },
      { html: '<p>Junte as <b>"cinco grandes"</b>: x̄, ȳ, s<sub>x</sub>, s<sub>y</sub> e r. Depois:</p>' +
        '<p class="formula">m = r · s<sub>y</sub> ÷ s<sub>x</sub> &nbsp;&nbsp;·&nbsp;&nbsp; b = ȳ − m · x̄</p>' +
        '<ul><li><b>Inclinação m:</b> quanto y muda, em média, a cada unidade a mais de x. Se m = 5 entre horas de estudo e nota, cada hora extra vale 5 pontos a mais, em média.</li>' +
        '<li><b>Intercepto b:</b> o y previsto quando x = 0 (onde a reta corta o eixo vertical).</li></ul>' +
        '<details class="demo"><summary>Ver exemplo resolvido: stories (x) e respostas (y)</summary><div>' +
        '<p>x̄ = 4, ȳ = 4, s<sub>x</sub> = 2, s<sub>y</sub> = 1, r = 0,50</p><p>m = 0,50 · 1 ÷ 2 = 0,25</p><p>b = 4 − 0,25 · 4 = 3</p><p>reta: y = 0,25x + 3</p>' +
        '<p class="fim">Para 5 stories: y = 0,25 · 5 + 3 = 4,25 respostas.</p></div></details>' },
      { warn: '<p>Calcule <b>m antes de b</b>: a fórmula de b usa m. E o sinal de m é sempre o mesmo de r.</p>' },
      { code: 'import statistics\n\nstories = [2, 4, 6]\nrespostas = [3, 5, 4]\nreta = statistics.linear_regression(stories, respostas)\nprint(f"Inclinação (m): {reta.slope}")\nprint(f"Intercepto (b): {reta.intercept}")\nprevisao = reta.slope * 5 + reta.intercept\nprint(f"Previsão para 5 stories: {previsao} respostas")', out: 'Inclinação (m): 0.25\nIntercepto (b): 3.0\nPrevisão para 5 stories: 4.25 respostas' },

      { h2: '3. Fazendo previsões e evitando armadilhas' },
      { html: '<p>Prever é substituir x na equação. O resultado é uma previsão do valor <b>médio</b> de y, não uma certeza. Mexa no valor de x e veja o aviso quando ele sai da faixa observada:</p>' },
      { widget: 'dispersao', opts: { reta: true, dados: 'wifi' } },
      { html: '<table><thead><tr><th>Armadilha</th><th>Por que evitar</th></tr></thead><tbody>' +
        '<tr><td><b>extrapolação</b></td><td>prever y para x fora do intervalo observado: nada garante que a reta continue valendo</td></tr>' +
        '<tr><td>intercepto sem sentido</td><td>nem sempre x = 0 é uma situação real ou observada</td></tr>' +
        '<tr><td>outliers</td><td>pontos longe da reta podem distorcer a previsão</td></tr></tbody></table>' },
      { img: 'img/aulas/secao3-extrapolacao.jpg', alt: 'Reta de regressão com a área de extrapolação sombreada', caption: 'Fora do intervalo observado (sombreado), a reta deixa de ser confiável.', fonte: 'elaborado pelo autor.' },
      { code: 'import statistics\n\nvelocidade = [10, 20, 30, 50, 80]\ntempo = [25, 18, 14, 9, 5]\nreta = statistics.linear_regression(velocidade, tempo)\nprevisao = reta.slope * 40 + reta.intercept\nprint(f"m: {reta.slope:.4f} | b: {reta.intercept:.4f}")\nprint(f"Previsão para 40 Mbps: {previsao:.2f} segundos")\nif min(velocidade) <= 40 <= max(velocidade):\n    print("Dentro do intervalo observado")\nelse:\n    print("Fora do intervalo (extrapolação)")', out: 'm: -0.2656 | b: 24.2922\nPrevisão para 40 Mbps: 13.67 segundos\nDentro do intervalo observado' },
      { tip: '<p>Uma reta feita com contas de 5 mil a 80 mil seguidores <b>não</b> deve prever curtidas de uma conta com 2 milhões: é extrapolação.</p>' }
    ],
    quiz: [
      { q: 'Para prever a nota a partir das horas de estudo, qual é a variável resposta?', options: ['horas de estudo', 'a nota', 'a correlação', 'o intercepto'], answer: 1, explain: 'Y é o que se quer prever: a nota.' },
      { q: 'r = 0,6, s<sub>y</sub> = 10, s<sub>x</sub> = 2. Quanto vale m?', options: ['0,12', '3', '12', '30'], answer: 1, explain: 'm = 0,6 · 10 ÷ 2 = 3.' },
      { q: 'm = 3, x̄ = 4, ȳ = 20. Quanto vale b?', options: ['8', '12', '17', '32'], answer: 0, explain: 'b = 20 − 3 · 4 = 8.' },
      { q: 'Os dados de x vão de 1 a 10. Prever y para x = 50 é:', options: ['interpolação', 'extrapolação', 'correlação', 'sempre confiável'], answer: 1, explain: 'x fora do intervalo observado: extrapolação.' }
    ]
  });
})(window.ALG);
