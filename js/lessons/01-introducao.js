/* Aula 01 — Algoritmos e o primeiro programa */
(function (A) {
  A.lesson({
    id: 'introducao', module: 'm1', num: 1, minutes: 15,
    title: 'Algoritmos e o primeiro programa',
    goals: ['O que é algoritmo', 'Ordem de execução', 'print()'],
    body: [
      { html: '<p><b>Algoritmo</b> = passos em ordem para resolver um problema: <b>entrada → processamento → saída</b>.</p>' },
      { h2: 'Como o Python executa' },
      { html: '<p>De <b>cima para baixo</b>, uma linha por vez. Clique em <b>▶ Executar</b>:</p>' },
      { lab: {
        title: 'Seu primeiro programa',
        code: 'print("Olá, mundo!")\nprint("Vou aprender algoritmos")\nmateria = "Cálculo"\nprint("Para usar em", materia)\nprint(2 + 3)\nprint("2 + 3")',
        gen: function* () {
          var materia;
          yield { l: 1, p: 'Olá, mundo!', n: '<code>print()</code> mostra o texto na <b>saída</b>. As aspas não aparecem: elas só marcam onde o texto começa e termina.' };
          yield { l: 2, p: 'Vou aprender algoritmos', n: 'O Python passou para a <b>próxima linha</b>. Sempre de cima para baixo.' };
          materia = 'Cálculo';
          yield { l: 3, v: { materia: materia }, n: 'Esta linha não imprime nada: ela <b>cria uma variável</b> chamada <code>materia</code> na memória. Veja o painel de memória!' };
          yield { l: 4, v: { materia: materia }, p: A.print('Para usar em', materia), n: 'O print pode receber <b>vários valores</b> separados por vírgula. Ele coloca um espaço entre eles e usa o <b>valor</b> guardado na variável.' };
          yield { l: 5, v: { materia: materia }, p: '5', n: 'Sem aspas, <code>2 + 3</code> é uma <b>expressão</b>: o Python calcula primeiro e imprime o resultado <b>5</b>.' };
          yield { l: 6, v: { materia: materia }, p: '2 + 3', n: 'Com aspas é <b>texto</b>: o Python não calcula, só mostra os caracteres <code>2 + 3</code>.' };
        }
      } },
      { tip: '<p>Atalhos no lab: <kbd>←</kbd> <kbd>→</kbd> <kbd>espaço</kbd>.</p>' },
      { h2: 'Comentários' },
      { code: '# depois do # o Python ignora\nbase = 6\naltura = 4\narea = base * altura / 2   # área do triângulo\nprint(area)', out: '12.0' }
    ],
    quiz: [
      { q: 'O que é um algoritmo?', options: ['Um tipo de computador', 'Uma sequência finita e ordenada de passos para resolver um problema', 'Uma linguagem de programação', 'Um erro no programa'], answer: 1, explain: 'Algoritmo é a "receita". A linguagem (Python) é só a forma de escrevê-la para o computador.' },
      { q: 'O que este programa mostra?', code: 'print("10 + 5")', options: ['15', '10 + 5', '"10 + 5"', 'Erro'], answer: 1, explain: 'Entre aspas é texto: o Python imprime literalmente, sem calcular e sem as aspas.' },
      { q: 'Qual a ordem de execução de um programa Python simples?', options: ['Aleatória', 'De baixo para cima', 'De cima para baixo, uma linha por vez', 'Todas as linhas ao mesmo tempo'], answer: 2 },
      { q: 'O que o print mostra?', code: 'x = 4\nprint("x vale", x * 2)', options: ['x vale x * 2', 'x vale 8', 'x vale 4', 'x vale8'], answer: 1, explain: 'O print separa os valores com um espaço e calcula a expressão x * 2 = 8.' }
    ]
  });
})(window.ALG);
