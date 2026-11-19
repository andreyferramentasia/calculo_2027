/* Aula 12 — Matrizes */
(function (A) {
  A.lesson({
    id: 'matrizes', module: 'm3', num: 12, minutes: 25,
    title: 'Matrizes (listas de listas)',
    goals: ['m[i][j]', 'Loops aninhados', 'Diagonal'],
    body: [
      { html: '<p>Matriz = <b>lista de listas</b>. <code>m[i][j]</code> = <b style="color:var(--t-int)">linha i</b>, <b style="color:var(--t-fn)">coluna j</b>.</p>' },
      { widget: 'matrix' },
      { h2: 'Percorrendo tudo' },
      { lab: {
        title: 'Somando todos os elementos',
        viz: 'matrix',
        code: 'm = [[1, 2, 3],\n     [4, 5, 6],\n     [7, 8, 9]]\ntotal = 0\nfor i in range(len(m)):\n    for j in range(len(m[i])):\n        total += m[i][j]\nprint("Soma:", total)',
        gen: function* () {
          var m = [[1, 2, 3], [4, 5, 6], [7, 8, 9]], total = 0, ok = [], it = 0;
          function Z(i, j) { return { mats: [{ name: 'm', m: m, row: i, col: j, hl: j === null || j === undefined ? [] : [[i, j]], ok: ok }] }; }
          yield { l: 1, v: { m: m }, viz: Z(null, null), n: 'Uma matriz 3×3. Repare que a expressão continua por 3 linhas do código: dentro de colchetes o Python permite quebrar linha.' };
          yield { l: 4, v: { m: m, total: total }, viz: Z(null, null) };
          for (var i = 0; i < 3; i++) {
            yield { l: 5, v: { m: m, total: total, i: i }, viz: Z(i, null), n: 'Linha <code>i = ' + i + '</code>: ' + A.repr(m[i]) };
            for (var j = 0; j < 3; j++) {
              it++;
              yield { l: 6, v: { m: m, total: total, i: i, j: j }, it: it, viz: Z(i, j) };
              total += m[i][j];
              ok.push([i, j]);
              yield { l: 7, v: { m: m, total: total, i: i, j: j }, it: it, viz: Z(i, j), n: 'm[' + i + '][' + j + '] = ' + m[i][j] + ' → total = <b>' + total + '</b>' };
            }
          }
          yield { l: 8, v: { m: m, total: total, i: 2, j: 2 }, viz: Z(null, null), p: A.print('Soma:', total) };
        }
      } },
      { h2: 'Diagonal principal (i == j)' },
      { lab: {
        title: 'Traço (soma da diagonal)',
        viz: 'matrix',
        code: 'm = [[2, 7, 1],\n     [5, 3, 8],\n     [4, 6, 9]]\ndiag = 0\nfor i in range(len(m)):\n    diag += m[i][i]\nprint("Diagonal:", diag)',
        gen: function* () {
          var m = [[2, 7, 1], [5, 3, 8], [4, 6, 9]], diag = 0, ok = [];
          function Z(i) { return { mats: [{ name: 'm', m: m, hl: i === null ? [] : [[i, i]], ok: ok }] }; }
          yield { l: 1, v: { m: m }, viz: Z(null) };
          yield { l: 4, v: { m: m, diag: diag }, viz: Z(null) };
          for (var i = 0; i < 3; i++) {
            yield { l: 5, v: { m: m, diag: diag, i: i }, it: i + 1, viz: Z(i) };
            diag += m[i][i];
            ok.push([i, i]);
            yield { l: 6, v: { m: m, diag: diag, i: i }, it: i + 1, viz: Z(i), n: 'm[' + i + '][' + i + '] = ' + m[i][i] + ' → diag = <b>' + diag + '</b>' };
          }
          yield { l: 7, v: { m: m, diag: diag, i: 2 }, viz: Z(null), p: A.print('Diagonal:', diag) };
        }
      } },
      { h2: 'Criando matrizes' },
      { code: 'L, C = 3, 4\nm = [[0] * C for _ in range(L)]\nm[0][0] = 5\nprint(m)', out: '[[5, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]' },
      { warn: '<p><code>[[0] * 3] * 3</code> repete a <b>mesma</b> linha 3 vezes. Use a versão com <code>for</code>.</p>' },
      { h2: 'Lendo do teclado' },
      { code: 'L = int(input("Linhas: "))\nC = int(input("Colunas: "))\nm = []\nfor i in range(L):\n    linha = []\n    for j in range(C):\n        linha.append(int(input(f"m[{i}][{j}] = ")))\n    m.append(linha)\n\n# imprimindo como tabela\nfor linha in m:\n    for x in linha:\n        print(x, end="\\t")\n    print()', playground: true },
    ],
    quiz: [
      { q: 'Em <code>m = [[1, 2], [3, 4], [5, 6]]</code>, quanto vale <code>m[2][0]</code>?', options: ['2', '3', '5', '6'], answer: 2, explain: 'Linha 2 = [5, 6], posição 0 = 5.' },
      { q: 'Quantas linhas e colunas tem a matriz acima?', options: ['2 × 3', '3 × 2', '3 × 3', '6 × 1'], answer: 1, explain: 'len(m) = 3 linhas, len(m[0]) = 2 colunas.' },
      { q: 'Os elementos da diagonal principal satisfazem…', options: ['i + j == n', 'i == j', 'i > j', 'j == 0'], answer: 1 },
      { q: 'Qual forma cria corretamente uma matriz 3×3 de zeros independentes?', options: ['[[0] * 3] * 3', '[[0] * 3 for _ in range(3)]', '[0] * 9', '[[0, 0, 0]] * 3'], answer: 1 }
    ]
  });
})(window.ALG);
