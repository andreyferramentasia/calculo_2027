/* Aula 08 — Loops aninhados, break e continue */
(function (A) {
  A.lesson({
    id: 'loops-aninhados', module: 'm2', num: 8, minutes: 25,
    title: 'Loops aninhados, break e continue',
    goals: ['Loop dentro de loop', 'break', 'continue'],
    body: [
      { html: '<p>Para <b>cada volta do externo</b>, o <b>interno roda inteiro</b>: L × C execuções.</p>' },
      { lab: {
        title: 'Tabela de multiplicação',
        params: { linhas: 3, colunas: 4 },
        viz: 'matrix',
        code: function (P) {
          var L = Math.max(1, Math.min(6, Math.trunc(P.linhas))), C = Math.max(1, Math.min(6, Math.trunc(P.colunas)));
          return 'for i in range(1, ' + (L + 1) + '):\n    for j in range(1, ' + (C + 1) + '):\n        print(i * j, end="\\t")\n    print()';
        },
        gen: function* (P) {
          var L = Math.max(1, Math.min(6, Math.trunc(P.linhas))), C = Math.max(1, Math.min(6, Math.trunc(P.colunas)));
          var m = [], i, j, ok = [];
          for (i = 0; i < L; i++) { m.push([]); for (j = 0; j < C; j++) m[i].push(null); }
          var it = 0;
          function Z(r, c) { return { mats: [{ name: 'i × j', m: m, row: r, col: c, hl: c === null ? [] : [[r, c]], ok: ok }] }; }
          for (i = 1; i <= L; i++) {
            yield { l: 1, v: { i: i }, viz: Z(i - 1, null), n: '<b>Loop externo</b>: <code>i = ' + i + '</code>. Agora o loop interno vai rodar <b>inteiro</b> (' + C + ' voltas).' };
            for (j = 1; j <= C; j++) {
              it++;
              yield { l: 2, v: { i: i, j: j }, it: it, viz: Z(i - 1, j - 1), n: '<b>Loop interno</b>: <code>j = ' + j + '</code> (com i ainda valendo ' + i + ').' };
              m[i - 1][j - 1] = i * j;
              ok.push([i - 1, j - 1]);
              yield { l: 3, v: { i: i, j: j }, it: it, viz: Z(i - 1, j - 1), p: String(i * j), e: '\t', n: i + ' × ' + j + ' = <b>' + (i * j) + '</b>. O <code>end="\\t"</code> faz o print <b>não</b> pular linha (usa um TAB).' };
            }
            yield { l: 4, v: { i: i, j: j - 1 }, viz: Z(i - 1, null), p: '', n: 'O interno terminou. <code>print()</code> vazio só <b>quebra a linha</b>. Volta para o loop externo.' };
          }
        },
        endNote: '<b>Fim.</b> O corpo interno executou <b>linhas × colunas</b> vezes. Veja o contador "×" ao lado de cada linha do código.'
      } },
      { h2: 'break: sai do loop na hora' },
      { lab: {
        title: 'Primeiro número negativo',
        params: { numeros: [4, 7, -2, 9, -5] },
        viz: 'array',
        code: function (P) { return 'numeros = ' + A.repr(P.numeros) + '\nfor x in numeros:\n    if x < 0:\n        print("Primeiro negativo:", x)\n        break\n    print(x, "é positivo")\nprint("Fim da busca")'; },
        gen: function* (P) {
          var nums = P.numeros.filter(function (x) { return typeof x === 'number'; }).slice(0, 12), x, ok = [], bad = [];
          function Z(k) { var dim = []; return { arr: nums, ptr: { x: k }, hl: k === null ? [] : [k], ok: ok, bad: bad, dim: dim, label: 'numeros' }; }
          yield { l: 1, v: { numeros: nums }, viz: Z(null) };
          for (var k = 0; k < nums.length; k++) {
            x = nums[k];
            yield { l: 2, v: { numeros: nums, x: x }, it: k + 1, viz: Z(k) };
            var c = x < 0;
            yield { l: 3, v: { numeros: nums, x: x }, it: k + 1, c: ['x < 0', c], viz: Z(k) };
            if (c) {
              bad.push(k);
              yield { l: 4, v: { numeros: nums, x: x }, it: k + 1, viz: Z(k), p: A.print('Primeiro negativo:', x) };
              yield { l: 5, v: { numeros: nums, x: x }, it: k + 1, viz: Z(k), n: '<b>break!</b> O loop é abandonado agora. Os elementos restantes <b>nem são olhados</b>.' };
              break;
            }
            ok.push(k);
            yield { l: 6, v: { numeros: nums, x: x }, it: k + 1, viz: Z(k), p: A.print(x, 'é positivo') };
          }
          yield { l: 7, v: { numeros: nums, x: x }, viz: Z(null), p: 'Fim da busca' };
        }
      } },
      { h2: 'continue: pula para a próxima volta' },
      { lab: {
        title: 'Só os ímpares',
        params: { n: 8 },
        viz: 'array',
        code: function (P) { return 'for n in range(1, ' + Math.max(2, Math.min(15, Math.trunc(P.n))) + '):\n    if n % 2 == 0:\n        continue\n    print(n, "é ímpar")'; },
        gen: function* (P) {
          var lim = Math.max(2, Math.min(15, Math.trunc(P.n))), seq = [], k, ok = [], dim = [];
          for (k = 1; k < lim; k++) seq.push(k);
          function Z(p) { return { arr: seq, ptr: { n: p }, hl: p === null ? [] : [p], ok: ok, dim: dim, label: 'range(1, ' + lim + ')' }; }
          for (k = 0; k < seq.length; k++) {
            var n = seq[k];
            yield { l: 1, v: { n: n }, it: k + 1, viz: Z(k) };
            var c = n % 2 === 0;
            yield { l: 2, v: { n: n }, it: k + 1, c: ['n % 2 == 0', c], viz: Z(k) };
            if (c) {
              dim.push(k);
              yield { l: 3, v: { n: n }, it: k + 1, viz: Z(k), n: '<b>continue</b>: o print abaixo é pulado e o for vai direto para o próximo número.' };
              continue;
            }
            ok.push(k);
            yield { l: 4, v: { n: n }, it: k + 1, viz: Z(k), p: A.print(n, 'é ímpar') };
          }
        }
      } },
      { tip: '<p><code>break</code> e <code>continue</code> afetam apenas o loop <b>mais interno</b> onde estão.</p>' }
    ],
    quiz: [
      { q: 'Quantas vezes "*" é impresso?', code: 'for i in range(3):\n    for j in range(4):\n        print("*")', options: ['7', '12', '3', '4'], answer: 1, explain: '3 voltas externas × 4 internas = 12.' },
      { q: 'O que imprime?', code: 'for k in range(10):\n    if k == 3:\n        break\n    print(k)', options: ['0 1 2', '0 1 2 3', '3', '0 a 9 menos o 3'], answer: 0, explain: 'Quando k chega em 3, o break encerra o loop antes do print.' },
      { q: 'O que imprime?', code: 'for k in range(5):\n    if k == 2:\n        continue\n    print(k)', options: ['0 1', '0 1 3 4', '2', '0 1 2 3 4'], answer: 1, explain: 'Só a volta com k = 2 é pulada.' },
      { q: 'Que formato este código desenha?', code: 'for i in range(1, 4):\n    print("#" * i)', options: ['Quadrado', 'Triângulo (#, ##, ###)', 'Linha reta', 'Nada'], answer: 1, explain: 'Multiplicar string repete: "#" * 3 = "###".' }
    ]
  });
})(window.ALG);
