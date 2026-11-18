/* Aula 13 — Operações com matrizes */
(function (A) {
  function zeros(r, c) { var m = []; for (var i = 0; i < r; i++) { m.push([]); for (var j = 0; j < c; j++) m[i].push(0); } return m; }
  function cp(m) { return m.map(function (r) { return r.slice(); }); }

  A.lesson({
    id: 'operacoes-matrizes', module: 'm3', num: 13, minutes: 30,
    title: 'Operações com matrizes',
    goals: ['A + B', 'Transposta', 'A × B'],
    body: [
      { h2: 'Soma de matrizes' },
      { html: '<p><code>C[i][j] = A[i][j] + B[i][j]</code></p>' },
      { lab: {
        title: 'C = A + B',
        viz: 'matrix',
        code: 'A = [[1, 2], [3, 4]]\nB = [[5, 6], [7, 8]]\nC = [[0, 0], [0, 0]]\nfor i in range(2):\n    for j in range(2):\n        C[i][j] = A[i][j] + B[i][j]\nprint(C)',
        gen: function* () {
          var Am = [[1, 2], [3, 4]], Bm = [[5, 6], [7, 8]], C = zeros(2, 2), ok = [];
          function Z(i, j) {
            var h = i === null ? [] : [[i, j]];
            return { mats: [{ name: 'A', m: Am, hl: h }, { name: 'B', m: Bm, hl: h }, { name: 'C', m: C, hl: h, ok: ok }], ops: ['+', '='] };
          }
          yield { l: 1, v: { A: Am }, viz: Z(null) };
          yield { l: 2, v: { A: Am, B: Bm }, viz: Z(null) };
          yield { l: 3, v: { A: Am, B: Bm, C: C }, viz: Z(null), n: 'C começa zerada, só para ter o tamanho certo.' };
          var it = 0;
          for (var i = 0; i < 2; i++) {
            yield { l: 4, v: { A: Am, B: Bm, C: C, i: i }, viz: Z(null) };
            for (var j = 0; j < 2; j++) {
              it++;
              yield { l: 5, v: { A: Am, B: Bm, C: C, i: i, j: j }, it: it, viz: Z(i, j) };
              C[i][j] = Am[i][j] + Bm[i][j];
              ok.push([i, j]);
              yield { l: 6, v: { A: Am, B: Bm, C: C, i: i, j: j }, it: it, viz: Z(i, j), n: 'C[' + i + '][' + j + '] = ' + Am[i][j] + ' + ' + Bm[i][j] + ' = <b>' + C[i][j] + '</b>. Mesma posição nas três matrizes.' };
            }
          }
          yield { l: 7, v: { A: Am, B: Bm, C: C, i: 1, j: 1 }, viz: Z(null), p: A.repr(C) };
        }
      } },
      { h2: 'Transposta' },
      { html: '<p><code>T[j][i] = M[i][j]</code>: linhas viram colunas.</p>' },
      { lab: {
        title: 'T = transposta de M',
        viz: 'matrix',
        code: 'M = [[1, 2, 3],\n     [4, 5, 6]]\nT = [[0, 0],\n     [0, 0],\n     [0, 0]]\nfor i in range(2):\n    for j in range(3):\n        T[j][i] = M[i][j]\nprint(T)',
        gen: function* () {
          var M = [[1, 2, 3], [4, 5, 6]], T = [[null, null], [null, null], [null, null]], ok = [];
          function Z(i, j) {
            return { mats: [{ name: 'M (2×3)', m: M, hl: i === null ? [] : [[i, j]] }, { name: 'T (3×2)', m: T, hl: i === null ? [] : [[j, i]], ok: ok }], ops: ['→'] };
          }
          function Tv() { return T.map(function (r) { return r.map(function (x) { return x === null ? 0 : x; }); }); }
          yield { l: 1, v: { M: M }, viz: Z(null) };
          yield { l: 3, v: { M: M, T: Tv() }, viz: Z(null), n: 'T tem as dimensões invertidas: 3 linhas e 2 colunas.' };
          var it = 0;
          for (var i = 0; i < 2; i++) {
            yield { l: 6, v: { M: M, T: Tv(), i: i }, viz: Z(null) };
            for (var j = 0; j < 3; j++) {
              it++;
              yield { l: 7, v: { M: M, T: Tv(), i: i, j: j }, it: it, viz: Z(i, j) };
              T[j][i] = M[i][j];
              ok.push([j, i]);
              yield { l: 8, v: { M: M, T: Tv(), i: i, j: j }, it: it, viz: Z(i, j), n: 'M[' + i + '][' + j + '] = ' + M[i][j] + ' vai para T[<b>' + j + '</b>][<b>' + i + '</b>]: os índices trocam de lugar.' };
            }
          }
          yield { l: 9, v: { M: M, T: Tv(), i: 1, j: 2 }, viz: Z(null), p: A.repr(Tv()), n: 'A linha 0 de M virou a coluna 0 de T.' };
        }
      } },
      { h2: 'Multiplicação de matrizes' },
      { html: '<p><b style="color:var(--t-int)">linha i de A</b> × <b style="color:var(--t-fn)">coluna j de B</b> → C[i][j]. Três loops: <code>i</code>, <code>j</code>, <code>k</code>.</p>' },
      { lab: {
        title: 'C = A × B',
        viz: 'matrix',
        code: 'A = [[1, 2],\n     [3, 4]]\nB = [[5, 6],\n     [7, 8]]\nC = [[0, 0],\n     [0, 0]]\nfor i in range(2):\n    for j in range(2):\n        for k in range(2):\n            C[i][j] += A[i][k] * B[k][j]\nprint(C)',
        gen: function* () {
          var Am = [[1, 2], [3, 4]], Bm = [[5, 6], [7, 8]], C = zeros(2, 2), ok = [];
          function Z(i, j, k) {
            return {
              mats: [
                { name: 'A', m: Am, row: i, hl: k === null || k === undefined ? [] : [[i, k]] },
                { name: 'B', m: Bm, col: j, hl: k === null || k === undefined ? [] : [[k, j]] },
                { name: 'C', m: C, hl: i === null || j === null || j === undefined ? [] : [[i, j]], ok: ok }
              ], ops: ['×', '=']
            };
          }
          function V(i, j, k) { return { A: Am, B: Bm, C: cp(C), i: i, j: j, k: k }; }
          yield { l: 1, v: { A: Am }, viz: Z(null) };
          yield { l: 3, v: { A: Am, B: Bm }, viz: Z(null) };
          yield { l: 5, v: { A: Am, B: Bm, C: C }, viz: Z(null) };
          var it = 0;
          for (var i = 0; i < 2; i++) {
            yield { l: 7, v: V(i), viz: Z(i, null), n: 'Linha <code>i = ' + i + '</code> de C ← usa a <b style="color:var(--t-int)">linha ' + i + ' de A</b>.' };
            for (var j = 0; j < 2; j++) {
              yield { l: 8, v: V(i, j), viz: Z(i, j), n: 'Elemento C[' + i + '][' + j + ']: <b style="color:var(--t-int)">linha ' + i + ' de A</b> · <b style="color:var(--t-fn)">coluna ' + j + ' de B</b>.' };
              var parts = [];
              for (var k = 0; k < 2; k++) {
                it++;
                yield { l: 9, v: V(i, j, k), it: it, viz: Z(i, j, k) };
                var before = C[i][j];
                C[i][j] += Am[i][k] * Bm[k][j];
                parts.push(Am[i][k] + '·' + Bm[k][j]);
                yield { l: 10, v: V(i, j, k), it: it, viz: Z(i, j, k), n: 'A[' + i + '][' + k + '] · B[' + k + '][' + j + '] = ' + Am[i][k] + ' · ' + Bm[k][j] + ' = ' + (Am[i][k] * Bm[k][j]) + ' → C[' + i + '][' + j + '] = ' + before + ' + ' + (Am[i][k] * Bm[k][j]) + ' = <b>' + C[i][j] + '</b>' + (k === 1 ? '<br>Pronto: ' + parts.join(' + ') + ' = <b>' + C[i][j] + '</b>' : '') };
              }
              ok.push([i, j]);
            }
          }
          yield { l: 11, v: V(1, 1, 1), viz: Z(null), p: A.repr(C), n: 'O corpo do loop mais interno rodou 2 × 2 × 2 = <b>8</b> vezes. Para matrizes n×n são n³ multiplicações.' };
        }
      } },
      { warn: '<p>A×B ≠ B×A &nbsp;·&nbsp; (m×<b>n</b>)·(<b>n</b>×p) = m×p</p>' },
      { h2: 'Versão genérica' },
      { code: 'def multiplica(A, B):\n    m, n, p = len(A), len(B), len(B[0])\n    if len(A[0]) != n:\n        raise ValueError("colunas de A != linhas de B")\n    C = [[0] * p for _ in range(m)]\n    for i in range(m):\n        for j in range(p):\n            for k in range(n):\n                C[i][j] += A[i][k] * B[k][j]\n    return C\n\nA = [[1, 2, 3],\n     [4, 5, 6]]          # 2×3\nB = [[1, 0],\n     [0, 1],\n     [1, 1]]             # 3×2\nprint(multiplica(A, B))  # 2×2', out: '[[4, 5], [10, 11]]' }
    ],
    quiz: [
      { q: 'A é 2×3 e B é 3×4. Qual o tamanho de A×B?', options: ['2×4', '3×3', '4×2', 'Não dá para multiplicar'], answer: 0, explain: '(m×n)·(n×p) = m×p.' },
      { q: 'A é 2×3 e B é 2×3. Dá para calcular A×B?', options: ['Sim, resulta 2×3', 'Sim, resulta 3×3', 'Não, colunas de A (3) ≠ linhas de B (2)', 'Sim, elemento a elemento'], answer: 2 },
      { q: 'Na transposta, o elemento M[1][2] vai para…', options: ['T[1][2]', 'T[2][1]', 'T[2][2]', 'T[0][1]'], answer: 1 },
      { q: 'Quanto vale C[0][0] em [[1, 2], [3, 4]] × [[5, 6], [7, 8]]?', options: ['5', '19', '12', '22'], answer: 1, explain: '1·5 + 2·7 = 19.' }
    ]
  });
})(window.ALG);
