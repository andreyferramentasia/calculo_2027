/* =========================================================
   Configuração da matéria Probabilidade e Estatística (CEAD).
   O motor (aulas, labs, quiz, desafio, playground) fica em
   ../../nucleo. Aqui ficam só os textos e o id.
   ========================================================= */
window.ALG = window.ALG || {};
window.ALG.MATERIA = 'probabilidade';                 // mesmo id de js/hub.js e de Questoes.gs
window.ALG.PARTIALS_BASE = '../../nucleo/partials/';

window.ALG.SITE = {
  titulo: 'Probabilidade e Estatística',
  eyebrow: 'dados · gráficos · normal · regressão',
  h1: 'Números que <span>contam</span> histórias.',
  intro: 'Taxas, amostras, média, desvio padrão, gráficos, distribuição normal, correlação e regressão, sempre com exemplos de tecnologia, Python ao lado e gráficos que você mexe.',
  hero: 'img/hero.svg',
  heroAlt: 'Ilustração de um histograma com a curva normal por cima'
};

window.ALG.PG_EXAMPLES = {
  'Taxa por mil': 'def taxa_por_mil(ocorrencias, base):\n    return ocorrencias / base * 1000\n\nprint(f"{taxa_por_mil(18, 12000):.1f} travamentos por mil sessões")',
  'Média, mediana, desvio': 'import statistics\n\ndados = [2, 3, 3, 5, 7]\nprint("média:", statistics.mean(dados))\nprint("mediana:", statistics.median(dados))\nprint("desvio padrão:", statistics.stdev(dados))',
  'Gráfico de barras': 'import matplotlib.pyplot as plt\n\nnotas = {"5★": 90, "4★": 30, "3★": 20, "2★": 7, "1★": 3}\nplt.bar(notas.keys(), notas.values())\nplt.title(f"Avaliações (n = {sum(notas.values())})")\nplt.show()',
  'Boxplot': 'import matplotlib.pyplot as plt\n\ntempos = [2, 2, 3, 3, 4, 4, 5, 6, 15]\nplt.boxplot(tempos, vert=False)\nplt.xlabel("segundos")\nplt.show()',
  'Distribuição normal': 'import statistics\n\nd = statistics.NormalDist(60, 15)\nprint("P(X < 30):", round(d.cdf(30), 4))\nprint("P(X > 90):", round(1 - d.cdf(90), 4))\nprint("percentil 90:", round(d.inv_cdf(0.90), 1))',
  'Correlação e regressão': 'import statistics\n\nx = [2, 3, 4, 5, 6]\ny = [10, 12, 15, 14, 20]\nprint("r =", round(statistics.correlation(x, y), 4))\nreta = statistics.linear_regression(x, y)\nprint(f"y = {reta.slope:.2f}x + {reta.intercept:.2f}")'
};
