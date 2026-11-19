/* Aula 04 — Gráficos para dados categóricos */
(function (A) {
  A.lesson({
    id: 'graficos-categoricos', module: 'p2', num: 4, minutes: 30,
    title: 'Gráficos de pizza e de barras',
    goals: ['Pizza', 'Barras', 'Frequência relativa', 'Gráfico enganoso'],
    body: [
      { h2: '1. Gráfico de pizza: proporções em fatias' },
      { html: '<p>Na <b>pizza</b>, cada indivíduo está em uma única categoria, então as fatias somam <b>100%</b>.</p>' +
        '<p class="formula">fatia (%) = quantidade ÷ total × 100 &nbsp;·&nbsp; ângulo = % × 3,6°</p>' },
      { widget: 'pizzaBarras' },
      { warn: '<p>A pizza mostra proporções, <b>nunca o total</b>. Procure sempre o <b>n</b>.</p>' },

      { h2: '2. Gráfico de barras: comparando categorias' },
      { html: '<p>Nas <b>barras</b>, cada barra pode mostrar a <b>frequência</b> (contagem) ou a <b>frequência relativa</b> (%). Elas <b>não precisam somar 100%</b>: servem para pesquisas em que cada pessoa marca várias respostas.</p>' },
      { code: 'import matplotlib.pyplot as plt\n\nincomodos = ["Demora do motorista", "Preço", "Falhas do app",\n             "Educação do motorista", "Rota errada"]\npercentuais = [45, 38, 30, 22, 15]\nplt.barh(incomodos, percentuais)\nplt.xlabel("Percentual de respondentes (%)")\nplt.title("Maiores incômodos em um app de transporte (n = 200)")\nplt.tight_layout()\nplt.show()' },
      { code: 'notas = {"5 estrelas": 90, "4 estrelas": 30, "3 estrelas": 20,\n         "2 estrelas": 7, "1 estrela": 3}\ntotal = sum(notas.values())\nfor nota, quantidade in notas.items():\n    print(f"{nota}: {quantidade / total * 100:.1f}%")', out: '5 estrelas: 60.0%\n4 estrelas: 20.0%\n3 estrelas: 13.3%\n2 estrelas: 4.7%\n1 estrela: 2.0%' },

      { h2: '3. Lendo gráficos com espírito crítico' },
      { html: '<p>O truque mais comum: <b>cortar o eixo</b>. Arraste e veja 2 pontos de diferença virarem um abismo:</p>' },
      { widget: 'eixo' },
      { tip: '<p>Checklist: <b>eixo começa em 0? tem "n ="? não é 3D? a fatia "outros" é pequena?</b></p>' },
    ],
    quiz: [
      { q: 'Em uma pizza, uma categoria tem 25% dos dados. Qual o ângulo da fatia?', options: ['25°', '45°', '90°', '180°'], answer: 2, explain: '25 × 3,6° = 90°.' },
      { q: 'Uma pesquisa permitia marcar várias respostas. Qual gráfico usar?', options: ['pizza', 'barras', 'pizza 3D', 'nenhum'], answer: 1, explain: 'Os percentuais podem passar de 100% no total; a pizza exige somar 100%.' },
      { q: 'Notas 4,1 e 4,3 num gráfico com eixo começando em 4,0. O problema é:', options: ['nenhum', 'a diferença parece muito maior do que é', 'faltam cores', 'as notas estão erradas'], answer: 1, explain: 'Eixo cortado exagera diferenças pequenas.' },
      { q: '"Frequência relativa" de uma categoria é:', options: ['a contagem bruta', 'o percentual em relação ao total', 'a média da categoria', 'o ângulo da fatia'], answer: 1, explain: 'Frequência relativa = contagem ÷ total × 100.' }
    ]
  });
})(window.ALG);
