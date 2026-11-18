/* Aula 15 — NumPy */
(function (A) {
  var NP = A.NP;
  A.lesson({
    id: 'numpy', module: 'm4', num: 15, minutes: 30,
    title: 'NumPy: vetores e matrizes de verdade',
    goals: ['np.array', 'Vetorização', 'reshape · @'],
    body: [
      { html: '<p>Vetores e matrizes <b>rápidos</b>. Instale com <code>pip install numpy</code>.</p>' },
      { h2: 'Vetorização: adeus, loop' },
      { compare: [
        { title: 'Listas (com loop)', code: 'x = [1, 2, 3, 4]\ny = []\nfor v in x:\n    y.append(v ** 2)' },
        { title: 'NumPy (vetorizado)', code: 'x = np.array([1, 2, 3, 4])\ny = x ** 2' }
      ] },
      { lab: {
        title: 'Operações elemento a elemento',
        viz: 'vec',
        code: 'import numpy as np\nx = np.array([1, 2, 3, 4])\ny = x ** 2\nz = x + y\nprint(z)\nprint(z.sum(), z.mean())',
        gen: function* () {
          var G = { np: A.MOD('numpy') };
          var x = [1, 2, 3, 4], y = x.map(function (v) { return v * v; }), z = x.map(function (v, i) { return v + y[i]; });
          yield { l: 1, v: G, n: 'Importa o NumPy com o apelido <code>np</code>.' };
          yield { l: 2, v: { np: G.np, x: NP(x) }, viz: { rows: [{ name: 'x', arr: x, fresh: true }] }, n: '<code>np.array</code> converte a lista em um <b>ndarray</b>.' };
          yield { l: 3, v: { np: G.np, x: NP(x), y: NP(y) }, viz: { rows: [{ name: 'x', arr: x }, { name: 'x ** 2', arr: y, fresh: true }] }, n: 'O <code>** 2</code> é aplicado a <b>cada elemento</b>, sem escrever nenhum loop. Isso se chama <b>vetorização</b>.' };
          yield { l: 4, v: { np: G.np, x: NP(x), y: NP(y), z: NP(z) }, viz: { rows: [{ name: 'x', arr: x }, { name: 'y', arr: y }, { name: 'x + y', arr: z, fresh: true }] }, n: 'Soma <b>posição a posição</b>: [1+1, 2+4, 3+9, 4+16]. (Com listas, <code>+</code> concatenaria!)' };
          yield { l: 5, v: { np: G.np, x: NP(x), y: NP(y), z: NP(z) }, viz: { rows: [{ name: 'x', arr: x }, { name: 'y', arr: y }, { name: 'z', arr: z }] }, p: A.str(NP(z)), n: 'O print de um array não tem vírgulas.' };
          yield { l: 6, v: { np: G.np, x: NP(x), y: NP(y), z: NP(z) }, viz: { rows: [{ name: 'x', arr: x }, { name: 'y', arr: y }, { name: 'z', arr: z }] }, p: '40 10.0', n: 'Arrays têm métodos prontos: <code>sum</code>, <code>mean</code> (média), <code>max</code>, <code>min</code>, <code>std</code> (desvio padrão)…' };
        }
      } },
      { h2: 'Criando arrays' },
      { code: 'import numpy as np\n\nprint(np.arange(0, 1, 0.25))     # como range, mas aceita float\nprint(np.linspace(0, 1, 5))      # 5 pontos igualmente espaçados de 0 a 1\nprint(np.zeros((2, 3)))          # matriz 2x3 de zeros\nprint(np.eye(3))                 # identidade 3x3\n\nm = np.array([[1, 2, 3], [4, 5, 6]])\nprint(m.shape)                   # (linhas, colunas)\nprint(m[1, 2])                   # elemento: m[i, j]\nprint(m[:, 0])                   # coluna 0 inteira', out: '[0.   0.25 0.5  0.75]\n[0.   0.25 0.5  0.75 1.  ]\n[[0. 0. 0.]\n [0. 0. 0.]]\n[[1. 0. 0.]\n [0. 1. 0.]\n [0. 0. 1.]]\n(2, 3)\n6\n[1 4]' },
      { h2: 'Forma (shape) e reshape' },
      { widget: 'reshape' },
      { h2: 'Álgebra linear em uma linha' },
      { html: '<p><code>@</code> = produto de matrizes &nbsp;·&nbsp; <code>*</code> = elemento a elemento</p>' },
      { code: 'import numpy as np\n\nA = np.array([[1, 2], [3, 4]])\nB = np.array([[5, 6], [7, 8]])\n\nprint(A + B)      # soma\nprint(A * B)      # elemento a elemento (NÃO é produto de matrizes)\nprint(A @ B)      # produto de matrizes\nprint(A.T)        # transposta', out: '[[ 6  8]\n [10 12]]\n[[ 5 12]\n [21 32]]\n[[19 22]\n [43 50]]\n[[1 3]\n [2 4]]' },
      { h3: 'Resolvendo um sistema linear' },
      { html: '<p><code>2x + y = 5</code> e <code>x − y = 1</code>:</p>' },
      { code: 'import numpy as np\n\nM = np.array([[2, 1],\n              [1, -1]])\nb = np.array([5, 1])\n\nsol = np.linalg.solve(M, b)\nprint(sol)                       # [x, y]\nprint(round(np.linalg.det(M), 4)) # determinante', out: '[2. 1.]\n-3.0' },
    ],
    quiz: [
      { q: 'O que imprime?', code: 'import numpy as np\na = np.array([1, 2, 3])\nprint(a * 2)', options: ['[1, 2, 3, 1, 2, 3]', '[2 4 6]', '12', 'Erro'], answer: 1, explain: 'Com arrays, operações são elemento a elemento. (Com lista daria [1, 2, 3, 1, 2, 3].)' },
      { q: 'Qual operador faz o produto de matrizes no NumPy?', options: ['*', '@', 'x', '**'], answer: 1 },
      { q: 'Qual o shape de <code>np.zeros((3, 5))</code>?', options: ['(5, 3)', '(3, 5)', '15', '(3,)'], answer: 1 },
      { q: 'Dá para fazer <code>np.arange(12).reshape(5, 2)</code>?', options: ['Sim', 'Não: 5 × 2 = 10 ≠ 12 elementos', 'Sim, sobram 2', 'Só com floats'], answer: 1 },
      { q: 'O que <code>np.linspace(0, 10, 3)</code> gera?', options: ['[0, 3, 6, 9]', '[0. 5. 10.]', '[0, 10, 20]', '[0. 3.33 6.67]'], answer: 1, explain: '3 pontos igualmente espaçados incluindo as pontas: 0, 5 e 10.' }
    ]
  });
})(window.ALG);
