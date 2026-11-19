/* Aula 07 — Repetição com for e range */
(function (A) {
  var F = A.F;
  A.lesson({
    id: 'for-range', module: 'm2', num: 7, minutes: 25,
    title: 'Repetição com for e range()',
    goals: ['for', 'range()', 'Percorrer listas'],
    body: [
      { html: '<p><code>for</code> pega <b>um item por vez</b> da sequência. Sem inicializar, sem atualizar.</p>' },
      { compare: [
        { title: 'Com while', code: 'i = 1\nwhile i <= 5:\n    print(i)\n    i = i + 1' },
        { title: 'Com for (equivalente)', code: 'for i in range(1, 6):\n    print(i)' }
      ] },
      { h2: 'range()' },
      { widget: 'range' },
      { h2: 'Somando com for' },
      { lab: {
        title: 'Soma de 1 até n',
        params: { n: 5 },
        viz: ['array', 'ring'],
        code: function (P) { var n = Math.max(1, Math.min(14, Math.trunc(P.n))); return 'soma = 0\nfor i in range(1, ' + (n + 1) + '):\n    soma = soma + i\n    print("i =", i, "| soma =", soma)\nprint("Total:", soma)'; },
        gen: function* (P) {
          var n = Math.max(1, Math.min(14, Math.trunc(P.n)));
          var seq = [], k;
          for (k = 1; k <= n; k++) seq.push(k);
          var soma = 0, i;
          var L = { cond: 'há próximo item?', body: 'soma += i; print' };
          function Z(pos, stage, it, val) {
            var ok = [];
            for (var q = 0; q < pos; q++) ok.push(q);
            return {
              array: { arr: seq, ptr: { i: pos < seq.length ? pos : null }, hl: stage === 'body' || stage === 'cond' && val ? [pos] : [], ok: ok, label: 'range(1, ' + (n + 1) + ')' },
              ring: { stage: stage, it: it, val: val, stations: ['cond', 'body'], labels: L }
            };
          }
          yield { l: 1, v: { soma: soma }, viz: Z(0, 'init'), n: 'Acumulador zerado.' };
          for (k = 0; k < seq.length; k++) {
            i = seq[k];
            yield { l: 2, v: { soma: soma, i: i }, it: k + 1, c: ['há próximo?', true], viz: Z(k, 'cond', k + 1, true), n: 'O for pega o <b>próximo item</b> do range: <code>i = ' + i + '</code>.' };
            soma += i;
            yield { l: 3, v: { soma: soma, i: i }, it: k + 1, viz: Z(k, 'body', k + 1), n: 'soma = ' + (soma - i) + ' + ' + i + ' = <b>' + soma + '</b>' };
            yield { l: 4, v: { soma: soma, i: i }, it: k + 1, viz: Z(k, 'body', k + 1), p: A.print('i =', i, '| soma =', soma) };
          }
          yield { l: 2, v: { soma: soma, i: i }, c: ['há próximo?', false], viz: Z(seq.length, 'cond', seq.length + 1, false), n: 'Acabaram os itens do range: o loop termina.' };
          yield { l: 5, v: { soma: soma, i: i }, p: A.print('Total:', soma), viz: Z(seq.length, 'out', seq.length + 1), n: 'Fórmula de Gauss para conferir: n(n+1)/2 = ' + n + '·' + (n + 1) + '/2 = <b>' + (n * (n + 1) / 2) + '</b> ✔' };
        }
      } },
      { h2: 'Percorrendo uma lista' },
      { lab: {
        title: 'Média de uma lista de notas',
        params: { notas: [8.5, 6.0, 9.5, 7.0] },
        viz: 'array',
        code: function (P) { return 'notas = ' + A.repr(P.notas.map(function (x) { return F(+x); })) + '\ntotal = 0\nfor nota in notas:\n    total = total + nota\nmedia = total / len(notas)\nprint("Média:", media)'; },
        gen: function* (P) {
          var notas = P.notas.map(function (x) { return +x; }).filter(function (x) { return !isNaN(x); }).slice(0, 10);
          var arr = notas.map(F), total = 0, nota, media;
          function V() { return { notas: arr, total: total === 0 && nota === undefined ? 0 : F(total), nota: nota === undefined ? undefined : F(nota), media: media === undefined ? undefined : F(media) }; }
          function Z(pos, done) {
            var ok = [];
            for (var q = 0; q < done; q++) ok.push(q);
            return { arr: arr, ptr: { nota: pos }, hl: pos === null ? [] : [pos], ok: ok, label: 'notas' };
          }
          yield { l: 1, v: V(), viz: Z(null, 0) };
          yield { l: 2, v: V(), viz: Z(null, 0) };
          for (var k = 0; k < notas.length; k++) {
            nota = notas[k];
            yield { l: 3, v: V(), it: k + 1, viz: Z(k, k), n: 'Volta ' + (k + 1) + ': <code>nota</code> recebe <b>' + A.fmtFloat(nota) + '</b> (o elemento de índice ' + k + ').' };
            total += nota;
            yield { l: 4, v: V(), it: k + 1, viz: Z(k, k + 1), n: 'total acumulado = <b>' + A.fmtFloat(total) + '</b>' };
          }
          media = total / notas.length;
          yield { l: 5, v: V(), viz: Z(null, notas.length), n: '<code>len(notas)</code> = ' + notas.length + '. Média = ' + A.fmtFloat(total) + ' / ' + notas.length + '.' };
          yield { l: 6, v: V(), viz: Z(null, notas.length), p: A.print('Média:', F(media)) };
        }
      } },
      { tip: '<p><b>for</b>: sabe quantas voltas &nbsp;·&nbsp; <b>while</b>: depende de uma condição</p>' },
    ],
    quiz: [
      { q: 'Quais valores <code>range(2, 10, 3)</code> gera?', options: ['2, 5, 8', '2, 5, 8, 11', '3, 6, 9', '2, 3, 4 ... 10'], answer: 0, explain: 'Começa em 2, soma 3: 2, 5, 8. O próximo seria 11, que passa do stop 10.' },
      { q: 'Quantas vezes o loop executa?', code: 'for k in range(10):\n    print(k)', options: ['9', '10', '11', 'infinitas'], answer: 1, explain: 'range(10) = 0, 1, ..., 9 → 10 valores.' },
      { q: 'O que imprime?', code: 'p = 1\nfor i in range(1, 5):\n    p = p * i\nprint(p)', options: ['10', '24', '120', '4'], answer: 1, explain: '1·1·2·3·4 = 24. É o fatorial de 4!' },
      { q: 'Como contar de 10 até 1 (regressivo)?', options: ['range(10, 1)', 'range(10, 0, -1)', 'range(1, 10, -1)', 'range(10, 1, -1)'], answer: 1, explain: 'Com step -1, o stop 0 não é incluído, então para no 1.' }
    ]
  });
})(window.ALG);
