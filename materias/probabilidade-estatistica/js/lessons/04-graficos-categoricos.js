/* Aula 04 — Gráficos para dados categóricos */
(function (A) {
  A.lesson({
    id: 'graficos-categoricos', module: 'p2', num: 4, minutes: 30,
    title: 'Gráficos de pizza e de barras',
    goals: ['Pizza', 'Barras', 'Frequência relativa', 'Gráfico enganoso'],
    body: [
      { h2: '1. Gráfico de pizza: proporções em fatias' },
      { html: '<p>O <b>gráfico de pizza</b> (de setores) mostra como um total se divide em categorias. Como cada indivíduo está em <b>uma única</b> categoria, as fatias somam <b>100%</b>.</p>' +
        '<p class="formula">Fatia (%) = quantidade ÷ total × 100 &nbsp;·&nbsp; ângulo = % × 3,6°</p>' +
        '<p>Exemplo: 100 de 250 usuários usam mais o Instagram → 100 ÷ 250 = 40% → 40 × 3,6 = <b>144°</b> do círculo.</p>' },
      { widget: 'pizzaBarras' },
      { warn: '<p>A pizza mostra <b>proporções</b>, nunca o total. "35% do tempo em redes sociais" pode ser 1 hora ou 8 horas. Procure sempre o <b>n</b> da amostra.</p>' },

      { h2: '2. Gráfico de barras: comparando categorias' },
      { html: '<p>O <b>gráfico de barras</b> também mostra categorias, mas pelo comprimento das barras. Cada barra pode mostrar:</p>' +
        '<table><thead><tr><th>O que a barra mostra</th><th>Significa</th></tr></thead><tbody>' +
        '<tr><td><b>frequência</b></td><td>contagem de indivíduos na categoria</td></tr>' +
        '<tr><td><b>frequência relativa</b></td><td>percentual de indivíduos na categoria</td></tr></tbody></table>' +
        '<p>Diferente da pizza, as barras <b>não precisam somar 100%</b>. Por isso servem para pesquisas em que cada pessoa pode marcar mais de uma resposta:</p>' },
      { img: 'img/aulas/python-incomodos-app.jpg', alt: 'Gráfico de barras horizontais com os incômodos de um app de transporte', caption: 'Maiores incômodos de 200 usuários de um app de transporte: respostas múltiplas, os percentuais não somam 100%.', fonte: 'elaborado pelo autor.' },
      { code: 'import matplotlib.pyplot as plt\n\nincomodos = ["Demora do motorista", "Preço", "Falhas do app",\n             "Educação do motorista", "Rota errada"]\npercentuais = [45, 38, 30, 22, 15]\nplt.barh(incomodos, percentuais)\nplt.xlabel("Percentual de respondentes (%)")\nplt.title("Maiores incômodos em um app de transporte (n = 200)")\nplt.tight_layout()\nplt.show()' },
      { code: 'notas = {"5 estrelas": 90, "4 estrelas": 30, "3 estrelas": 20,\n         "2 estrelas": 7, "1 estrela": 3}\ntotal = sum(notas.values())\nfor nota, quantidade in notas.items():\n    print(f"{nota}: {quantidade / total * 100:.1f}%")', out: '5 estrelas: 60.0%\n4 estrelas: 20.0%\n3 estrelas: 13.3%\n2 estrelas: 4.7%\n1 estrela: 2.0%' },

      { h2: '3. Lendo gráficos com espírito crítico' },
      { html: '<p>O truque mais comum é mudar <b>onde o eixo começa</b>. Cortar a base faz diferenças pequenas parecerem enormes. Arraste o início do eixo:</p>' },
      { widget: 'eixo' },
      { html: '<table><thead><tr><th>Sinal de alerta</th><th>Por que desconfiar</th></tr></thead><tbody>' +
        '<tr><td>eixo não começa em zero</td><td>exagera diferenças pequenas</td></tr>' +
        '<tr><td>pizza em 3D</td><td>distorce o tamanho das fatias mais perto da "câmera"</td></tr>' +
        '<tr><td>fatia "outros" muito grande</td><td>esconde informação que poderia ser detalhada</td></tr>' +
        '<tr><td>sem informar o total (n)</td><td>impede avaliar se a amostra é confiável</td></tr></tbody></table>' },
      { tip: '<p>Checklist antes de confiar num gráfico: <b>o eixo começa em 0? tem "n ="? não é 3D? "outros" é pequeno?</b></p>' }
    ],
    quiz: [
      { q: 'Em uma pizza, uma categoria tem 25% dos dados. Qual o ângulo da fatia?', options: ['25°', '45°', '90°', '180°'], answer: 2, explain: '25 × 3,6° = 90°.' },
      { q: 'Uma pesquisa permitia marcar várias respostas. Qual gráfico usar?', options: ['pizza', 'barras', 'pizza 3D', 'nenhum'], answer: 1, explain: 'Os percentuais podem passar de 100% no total; a pizza exige somar 100%.' },
      { q: 'Notas 4,1 e 4,3 num gráfico com eixo começando em 4,0. O problema é:', options: ['nenhum', 'a diferença parece muito maior do que é', 'faltam cores', 'as notas estão erradas'], answer: 1, explain: 'Eixo cortado exagera diferenças pequenas.' },
      { q: '"Frequência relativa" de uma categoria é:', options: ['a contagem bruta', 'o percentual em relação ao total', 'a média da categoria', 'o ângulo da fatia'], answer: 1, explain: 'Frequência relativa = contagem ÷ total × 100.' }
    ]
  });
})(window.ALG);
