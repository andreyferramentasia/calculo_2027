/* Aula 10 — Listas (vetores) */
(function (A) {
  A.lesson({
    id: 'listas', module: 'm3', num: 10, minutes: 25,
    title: 'Listas (vetores)',
    goals: ['Listas', 'append', 'Maior elemento', 'List comprehension'],
    body: [
      { html: '<p>Lista (<b>vetor</b>) = vários valores numa variável, em ordem. Pode alterar.</p>' },
      { code: 'notas = [7.5, 8.0, 6.5, 9.0]\nprint(notas[0])      # primeiro elemento\nprint(notas[-1])     # último\nprint(len(notas))    # quantidade\nnotas[2] = 7.0       # altera o elemento de índice 2\nnotas.append(10.0)   # adiciona no final\nprint(notas)', out: '7.5\n9.0\n4\n[7.5, 8.0, 7.0, 9.0, 10.0]' },
      { h2: 'Construindo com append' },
      { lab: {
        title: 'Lista de quadrados',
        params: { n: 6 },
        viz: 'array',
        code: function (P) { var n = Math.max(1, Math.min(12, Math.trunc(P.n))); return 'quadrados = []\nfor x in range(1, ' + (n + 1) + '):\n    quadrados.append(x ** 2)\nprint(quadrados)'; },
        gen: function* (P) {
          var n = Math.max(1, Math.min(12, Math.trunc(P.n))), q = [];
          function Z(hl) { return { arr: q.slice(), hl: hl === undefined ? [] : [hl], label: 'quadrados' }; }
          yield { l: 1, v: { quadrados: q }, viz: Z(), n: 'Lista vazia: <code>len(quadrados)</code> = 0.' };
          for (var x = 1; x <= n; x++) {
            yield { l: 2, v: { quadrados: q, x: x }, it: x, viz: Z() };
            q.push(x * x);
            yield { l: 3, v: { quadrados: q, x: x }, it: x, viz: Z(q.length - 1), n: '<code>append(' + x + ' ** 2)</code> coloca <b>' + (x * x) + '</b> no <b>final</b> da lista, no índice ' + (q.length - 1) + '.' };
          }
          yield { l: 4, v: { quadrados: q, x: n }, viz: Z(), p: A.repr(q) };
        }
      } },
      { h2: 'Maior elemento' },
      { lab: {
        title: 'Maior elemento',
        params: { v: [12, 45, 7, 89, 23, 56] },
        viz: 'array',
        code: function (P) { return 'v = ' + A.repr(P.v) + '\nmaior = v[0]\nfor i in range(1, len(v)):\n    if v[i] > maior:\n        maior = v[i]\nprint("Maior:", maior)'; },
        gen: function* (P) {
          var v = P.v.filter(function (x) { return typeof x === 'number'; }).slice(0, 12);
          if (!v.length) v = [0];
          var best = 0, maior;
          function Z(i) { return { arr: v, ptr: { i: i, maior: best }, hl: i === null ? [] : [i], ok: [best], label: 'v' }; }
          yield { l: 1, v: { v: v }, viz: { arr: v, label: 'v' } };
          maior = v[0];
          yield { l: 2, v: { v: v, maior: maior }, viz: Z(null), n: 'Chute inicial: o primeiro elemento (<b>' + maior + '</b>) é o maior até agora.' };
          for (var i = 1; i < v.length; i++) {
            yield { l: 3, v: { v: v, maior: maior, i: i }, it: i, viz: Z(i) };
            var c = v[i] > maior;
            yield { l: 4, v: { v: v, maior: maior, i: i }, it: i, c: ['v[' + i + '] > maior', c], viz: Z(i), n: v[i] + ' > ' + maior + ' ? ' + (c ? '<b>Sim!</b>' : 'Não.') };
            if (c) {
              maior = v[i];
              best = i;
              yield { l: 5, v: { v: v, maior: maior, i: i }, it: i, viz: Z(i), n: 'Novo campeão: <b>' + maior + '</b>. O ponteiro <code>maior</code> pula para cá.' };
            }
          }
          yield { l: 6, v: { v: v, maior: maior, i: v.length - 1 }, viz: Z(null), p: A.print('Maior:', maior), n: 'Fizemos <b>' + (v.length - 1) + '</b> comparações para uma lista de ' + v.length + ' elementos.' };
        }
      } },
      { h2: 'Métodos úteis' },
      { code: 'v = [3, 1, 2]\nprint(len(v), sum(v), max(v), min(v))\nv.insert(0, 9)    # insere na posição 0\nv.pop()           # remove o último\nprint(2 in v)     # está na lista?\nprint(sorted(v))  # nova lista ordenada', out: '3 6 3 1\nFalse\n[1, 3, 9]' },
      { h2: 'List comprehension' },
      { compare: [
        { title: 'Loop tradicional', code: 'pares = []\nfor x in range(10):\n    if x % 2 == 0:\n        pares.append(x)' },
        { title: 'List comprehension', code: 'pares = [x for x in range(10) if x % 2 == 0]\n# [0, 2, 4, 6, 8]' }
      ] },
      { html: '<p>Lendo da esquerda para a direita: <b>[o que guardar</b> &nbsp;<code>for</code> cada item &nbsp;<code>if</code> condição<b>]</b>.</p>' },
      { lab: {
        title: 'Quadrados dos pares',
        params: { n: 8 },
        viz: ['array', 'trail'],
        code: function (P) { var n = Math.max(1, Math.min(12, Math.trunc(P.n))); return 'quad = [x ** 2 for x in range(1, ' + (n + 1) + ') if x % 2 == 0]\nprint(quad)'; },
        gen: function* (P) {
          var n = Math.max(1, Math.min(12, Math.trunc(P.n))), seq = [], ok = [], dim = [], res = [];
          for (var k = 1; k <= n; k++) seq.push(k);
          function Z(pos) {
            return {
              array: { arr: seq, ptr: { x: pos }, hl: pos === null ? [] : [pos], ok: ok.slice(), dim: dim.slice(), label: 'range(1, ' + (n + 1) + ')' },
              trail: { label: 'quad sendo montada:', items: res.slice() }
            };
          }
          for (k = 0; k < seq.length; k++) {
            var x = seq[k], c = x % 2 === 0;
            yield { l: 1, v: { x: x }, it: k + 1, viz: Z(k), n: '<b>for</b>: pega <code>x = ' + x + '</code>.' };
            yield { l: 1, v: { x: x }, it: k + 1, c: ['x % 2 == 0', c], viz: Z(k), n: c ? '<b>if</b>: é par, passa no filtro.' : '<b>if</b>: é ímpar, fica de fora.' };
            if (c) {
              res.push(x * x); ok.push(k);
              yield { l: 1, v: { x: x }, it: k + 1, viz: Z(k), n: '<b>o que guardar</b>: <code>x ** 2</code> = ' + (x * x) + ' entra na lista.' };
            } else dim.push(k);
          }
          yield { l: 1, v: { quad: res }, viz: Z(null), n: 'A lista pronta vai para <code>quad</code>. (Repare: o <code>x</code> da comprehension não fica na memória depois.)' };
          yield { l: 2, v: { quad: res }, viz: Z(null), p: A.repr(res) };
        }
      } },
      { warn: '<p><code>b = a</code> <b>não copia</b>: é a mesma lista. Use <code>b = a.copy()</code>.</p>' }
    ],
    quiz: [
      { q: 'Se <code>v = [10, 20, 30, 40]</code>, quanto vale <code>v[len(v) - 1]</code>?', options: ['30', '40', 'Erro', '4'], answer: 1, explain: 'len(v) - 1 = 3, o último índice.' },
      { q: 'O que imprime?', code: 'v = [3, 1, 2]\nv.append(5)\nv[0] = 9\nprint(v)', options: ['[3, 1, 2, 5]', '[9, 1, 2, 5]', '[9, 3, 1, 2, 5]', '[5, 1, 2]'], answer: 1 },
      { q: 'Qual código calcula a média da lista <code>v</code>?', options: ['sum(v) / len(v)', 'max(v) / min(v)', 'v / len(v)', 'sum(v) // 2'], answer: 0 },
      { q: 'Resultado de <code>[x * 2 for x in [1, 2, 3]]</code>?', options: ['[1, 2, 3, 1, 2, 3]', '[2, 4, 6]', '12', '[1, 2, 3, 2]'], answer: 1 },
      { q: 'O que imprime?', code: 'a = [1, 2]\nb = a\nb.append(3)\nprint(a)', options: ['[1, 2]', '[1, 2, 3]', '[3]', 'Erro'], answer: 1, explain: 'a e b são a mesma lista na memória.' }
    ]
  });
})(window.ALG);
