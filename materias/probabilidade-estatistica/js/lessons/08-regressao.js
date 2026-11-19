/* Aula 08 — Regressão linear: fazendo previsões */
(function (A) {
  A.lesson({
    id: 'regressao', module: 'p4', num: 8, minutes: 35,
    title: 'Regressão linear: fazendo previsões',
    goals: ['X explicativa, Y resposta', 'Inclinação m', 'Intercepto b', 'Previsão', 'Extrapolação'],
    body: [
      { h2: '1. A reta de regressão' },
      { html: '<p>Se o padrão é <b>linear</b> e <b>|r| ≥ 0,50</b>, dá para traçar a <b>reta de regressão</b> e prever Y (o que se quer saber) a partir de X (o que já se sabe).</p>' +
        '<p class="formula">y = m·x + b</p>' },

      { h2: '2. Inclinação e intercepto' },
      { html: '<p class="formula">m = r · s<sub>y</sub> ÷ s<sub>x</sub> &nbsp;&nbsp;·&nbsp;&nbsp; b = ȳ − m · x̄</p>' +
        '<p><b>m</b>: quanto y muda a cada 1 de x. <b>b</b>: o y quando x = 0. Ex. (stories): r = 0,5, s<sub>y</sub> = 1, s<sub>x</sub> = 2, x̄ = ȳ = 4 → m = 0,25 e b = 3 → para 5 stories, 4,25 respostas.</p>' },
      { warn: '<p>Calcule <b>m antes de b</b>. O sinal de m é sempre o mesmo de r.</p>' },
      { code: 'import statistics\n\nstories = [2, 4, 6]\nrespostas = [3, 5, 4]\nreta = statistics.linear_regression(stories, respostas)\nprint(f"Inclinação (m): {reta.slope}")\nprint(f"Intercepto (b): {reta.intercept}")\nprevisao = reta.slope * 5 + reta.intercept\nprint(f"Previsão para 5 stories: {previsao} respostas")', out: 'Inclinação (m): 0.25\nIntercepto (b): 3.0\nPrevisão para 5 stories: 4.25 respostas' },

      { h2: '3. Fazendo previsões e evitando armadilhas' },
      { html: '<p>Prever = substituir x na reta. Fora da faixa de x observada é <b>extrapolação</b> (zona vermelha): a reta pode até dar tempo negativo. Teste x = 120:</p>' },
      { widget: 'dispersao', opts: { reta: true, dados: 'wifi' } },
      { code: 'import statistics\n\nvelocidade = [10, 20, 30, 50, 80]\ntempo = [25, 18, 14, 9, 5]\nreta = statistics.linear_regression(velocidade, tempo)\nprevisao = reta.slope * 40 + reta.intercept\nprint(f"m: {reta.slope:.4f} | b: {reta.intercept:.4f}")\nprint(f"Previsão para 40 Mbps: {previsao:.2f} segundos")\nif min(velocidade) <= 40 <= max(velocidade):\n    print("Dentro do intervalo observado")\nelse:\n    print("Fora do intervalo (extrapolação)")', out: 'm: -0.2656 | b: 24.2922\nPrevisão para 40 Mbps: 13.67 segundos\nDentro do intervalo observado' },
    ],
    quiz: [
      { q: 'Para prever a nota a partir das horas de estudo, qual é a variável resposta?', options: ['horas de estudo', 'a nota', 'a correlação', 'o intercepto'], answer: 1, explain: 'Y é o que se quer prever: a nota.' },
      { q: 'r = 0,6, s<sub>y</sub> = 10, s<sub>x</sub> = 2. Quanto vale m?', options: ['0,12', '3', '12', '30'], answer: 1, explain: 'm = 0,6 · 10 ÷ 2 = 3.' },
      { q: 'm = 3, x̄ = 4, ȳ = 20. Quanto vale b?', options: ['8', '12', '17', '32'], answer: 0, explain: 'b = 20 − 3 · 4 = 8.' },
      { q: 'Os dados de x vão de 1 a 10. Prever y para x = 50 é:', options: ['interpolação', 'extrapolação', 'correlação', 'sempre confiável'], answer: 1, explain: 'x fora do intervalo observado: extrapolação.' }
    ]
  });
})(window.ALG);
