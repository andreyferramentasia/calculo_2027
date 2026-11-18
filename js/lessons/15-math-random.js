/* Aula 15 — Bibliotecas: math e random */
(function (A) {
  var F = A.F;
  A.lesson({
    id: 'math-random', module: 'm4', num: 15, minutes: 25,
    title: 'Bibliotecas: math e random',
    goals: ['import', 'math', 'random'],
    body: [
      { html: '<p>Biblioteca = código pronto para reutilizar.</p>' },
      { code: 'import math                # módulo inteiro\nfrom math import pi, sin   # só alguns nomes\nimport random as rd        # com apelido', playground: false },
      { h2: 'O módulo math' },
      { code: 'import math\nprint(math.sqrt(16))       # raiz\nprint(math.pi)             # π\nprint(math.floor(2.7), math.ceil(2.1))\nprint(math.factorial(5))   # 5!', out: '4.0\n3.141592653589793\n2 3\n120' },
      { h2: 'Exemplo completo: Bhaskara' },
      { html: '<p>Mude <code>a</code>, <code>b</code>, <code>c</code> (tente <code>c = 10</code>).</p>' },
      { lab: {
        title: 'Raízes da equação do 2º grau',
        params: { a: 1, b: -5, c: 6 },
        viz: 'plot',
        plot: function (P) {
          var a = P.a || 1, b = P.b, c = P.c, xv = -b / (2 * a), yv = a * xv * xv + b * xv + c;
          var span = Math.max(3, Math.sqrt(Math.abs(yv / a)) * 1.6);
          var ys = [yv, a * Math.pow(span, 2) + yv, 0];
          var y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
          var pad = (y1 - y0) * 0.12 + 0.5;
          return { f: function (x) { return a * x * x + b * x + c; }, xmin: xv - span, xmax: xv + span, ymin: y0 - pad, ymax: y1 + pad };
        },
        code: function (P) { return 'import math\na, b, c = ' + P.a + ', ' + P.b + ', ' + P.c + '\ndelta = b ** 2 - 4 * a * c\nif delta >= 0:\n    x1 = (-b + math.sqrt(delta)) / (2 * a)\n    x2 = (-b - math.sqrt(delta)) / (2 * a)\n    print("Raízes:", x1, x2)\nelse:\n    print("Sem raízes reais")'; },
        gen: function* (P) {
          var a = P.a, b = P.b, c = P.c, delta, x1, x2;
          function num(x) { return Number.isInteger(x) ? x : F(x); }
          var G = { math: A.MOD('math') };
          function V() { return Object.assign({}, G, { a: num(a), b: num(b), c: num(c), delta: delta === undefined ? undefined : num(delta), x1: x1 === undefined ? undefined : F(x1), x2: x2 === undefined ? undefined : F(x2) }); }
          yield { l: 1, v: G, n: 'Importamos o módulo <code>math</code>. Ele vira uma variável do tipo <b>module</b>.' };
          yield { l: 2, v: V(), n: '<b>Atribuição múltipla</b>: três variáveis numa linha.' };
          delta = b * b - 4 * a * c;
          yield { l: 3, v: V(), n: 'Δ = (' + b + ')² − 4·' + a + '·' + c + ' = <b>' + delta + '</b>' };
          var cnd = delta >= 0;
          yield { l: 4, v: V(), c: ['delta >= 0', cnd] };
          if (!cnd) {
            yield { l: 8, v: V() };
            yield { l: 9, v: V(), p: 'Sem raízes reais', n: 'Δ &lt; 0: a parábola <b>não cruza</b> o eixo x. Veja no gráfico!' };
            return;
          }
          if (a === 0) {
            yield { l: 5, v: V(), p: 'ZeroDivisionError: float division by zero', n: '<b style="color:var(--bad)">Erro!</b> Com a = 0 não é equação do 2º grau e dividimos por zero.' };
            return;
          }
          x1 = (-b + Math.sqrt(delta)) / (2 * a);
          yield { l: 5, v: V(), viz: { marks: [[x1, 0]] }, n: '<code>math.sqrt(' + delta + ')</code> = ' + A.fmtFloat(Math.sqrt(delta)) + ' → x1 = <b>' + A.fmtFloat(x1) + '</b>. Note que sqrt sempre devolve <b>float</b>.' };
          x2 = (-b - Math.sqrt(delta)) / (2 * a);
          yield { l: 6, v: V(), viz: { marks: [[x1, 0], [x2, 0]] }, n: 'x2 = <b>' + A.fmtFloat(x2) + '</b>' };
          yield { l: 7, v: V(), viz: { marks: [[x1, 0], [x2, 0]] }, p: A.print('Raízes:', F(x1), F(x2)), n: 'As raízes são onde a parábola corta o eixo x (pontos verdes).' };
        }
      } },
      { h2: 'O módulo random' },
      { code: 'import random\nprint(random.randint(1, 6))            # inteiro de 1 a 6 (inclui o 6!)\nprint(random.random())                 # float em [0, 1)\nprint(random.choice(["a", "b", "c"]))  # sorteia um', out: '(valores aleatórios)' },
      { lab: {
        title: 'Lançando um dado muitas vezes',
        params: { lances: 30 },
        viz: 'bars',
        code: function (P) { return 'import random\nfreq = [0] * 6\nfor lance in range(' + Math.max(1, Math.min(150, Math.trunc(P.lances))) + '):\n    face = random.randint(1, 6)\n    freq[face - 1] += 1\nprint(freq)'; },
        gen: function* (P) {
          var N = Math.max(1, Math.min(150, Math.trunc(P.lances))), freq = [0, 0, 0, 0, 0, 0], face;
          var rnd = A.rng((Math.random() * 1e9) | 0);
          var G = { random: A.MOD('random') };
          var labels = ['1', '2', '3', '4', '5', '6'];
          function V(l) { return Object.assign({}, G, { freq: freq, lance: l, face: face }); }
          yield { l: 1, v: G, viz: { arr: freq, labels: labels, max: Math.max(5, Math.ceil(N / 3)) } };
          yield { l: 2, v: V(), viz: { arr: freq, labels: labels, max: Math.max(5, Math.ceil(N / 3)) }, n: '<code>[0] * 6</code> cria <code>[0, 0, 0, 0, 0, 0]</code>: um contador para cada face.' };
          for (var l = 0; l < N; l++) {
            yield { l: 3, v: V(l), it: l + 1, viz: { arr: freq.slice(), labels: labels, max: Math.max(5, Math.ceil(N / 3)) } };
            face = 1 + Math.floor(rnd() * 6);
            yield { l: 4, v: V(l), it: l + 1, viz: { arr: freq.slice(), labels: labels, cmp: [face - 1], max: Math.max(5, Math.ceil(N / 3)) }, n: l < 3 ? 'Sorteou <b>' + face + '</b>. Repare: o índice na lista é <code>face - 1</code>, porque listas começam em 0.' : 'Sorteou ' + face + '.' };
            freq[face - 1]++;
            yield { l: 5, v: V(l), it: l + 1, viz: { arr: freq.slice(), labels: labels, swap: [face - 1], max: Math.max(5, Math.ceil(N / 3)) } };
          }
          yield { l: 6, v: V(N - 1), viz: { arr: freq, labels: labels, max: Math.max(5, Math.ceil(N / 3)) }, p: A.repr(freq), n: 'Com poucos lances as barras ficam desiguais. Mude <code>lances</code> para 150 e use velocidade 4×: as frequências tendem a ficar parecidas (≈ 1/6 cada).' };
        }
      } },
      { widget: 'montecarlo' },
      { code: 'import random\n\nN = 100000\ndentro = 0\nfor _ in range(N):\n    x = random.random()\n    y = random.random()\n    if x**2 + y**2 <= 1:\n        dentro += 1\nprint("π ≈", 4 * dentro / N)', out: 'π ≈ 3.14... (varia a cada execução)' },
    ],
    quiz: [
      { q: 'O que <code>math.sqrt(25)</code> devolve?', options: ['5', '5.0', '25', '"5"'], answer: 1, explain: 'sqrt sempre devolve float.' },
      { q: 'Quais valores <code>random.randint(1, 3)</code> pode gerar?', options: ['1 e 2', '1, 2 e 3', '0, 1, 2', 'qualquer real de 1 a 3'], answer: 1, explain: 'Diferente do range, randint inclui o limite superior.' },
      { q: 'Para calcular sen(30°) você escreve…', options: ['math.sin(30)', 'math.sin(math.radians(30))', 'math.sen(30)', 'sin(30°)'], answer: 1, explain: 'As funções trigonométricas do math usam radianos.' },
      { q: 'Depois de <code>from math import sqrt</code>, como chamar a raiz?', options: ['math.sqrt(9)', 'sqrt(9)', 'math(sqrt(9))', 'import sqrt(9)'], answer: 1 }
    ]
  });
})(window.ALG);
