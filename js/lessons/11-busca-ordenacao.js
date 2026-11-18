/* Aula 11 — Busca e ordenação */
(function (A) {
  A.lesson({
    id: 'busca-ordenacao', module: 'm3', num: 11, minutes: 30,
    title: 'Busca e ordenação',
    goals: ['Busca linear', 'Busca binária', 'Bubble Sort'],
    body: [
      { h2: 'Busca linear' },
      { html: '<p>Olha um por um até achar: até <b>n</b> comparações.</p>' },
      { code: 'def busca_linear(v, alvo):\n    for i in range(len(v)):\n        if v[i] == alvo:\n            return i      # achou: devolve a posição\n    return -1             # não achou\n\nprint(busca_linear([4, 9, 2, 7], 2))', out: '2' },
      { h2: 'Busca binária' },
      { html: '<p>Lista <b>ordenada</b>: olha o <b>meio</b> e descarta metade a cada passo.</p>' },
      { lab: {
        title: 'Busca binária',
        params: { alvo: 57 },
        viz: 'array',
        code: function (P) { return 'v = [3, 8, 15, 23, 42, 57, 71, 90, 94, 99]\nalvo = ' + Math.trunc(P.alvo) + '\nini, fim = 0, len(v) - 1\nwhile ini <= fim:\n    meio = (ini + fim) // 2\n    if v[meio] == alvo:\n        print("Achei na posição", meio)\n        break\n    elif v[meio] < alvo:\n        ini = meio + 1\n    else:\n        fim = meio - 1'; },
        gen: function* (P) {
          var v = [3, 8, 15, 23, 42, 57, 71, 90, 94, 99], alvo = Math.trunc(P.alvo), ini, fim, meio, found = null;
          function V() { return { v: v, alvo: alvo, ini: ini, fim: fim, meio: meio }; }
          function Z() {
            var dim = [];
            for (var k = 0; k < v.length; k++) if (ini !== undefined && (k < ini || k > fim)) dim.push(k);
            var ptr = {};
            if (ini !== undefined) { ptr.ini = ini <= v.length - 1 ? ini : null; ptr.fim = fim >= 0 ? fim : null; }
            if (meio !== undefined) ptr.meio = meio;
            return { arr: v, ptr: ptr, dim: dim, hl: meio !== undefined && found === null ? [meio] : [], ok: found !== null ? [found] : [], label: 'v (ordenada)' };
          }
          yield { l: 1, v: V(), viz: Z() };
          yield { l: 2, v: V(), viz: Z() };
          ini = 0; fim = v.length - 1;
          yield { l: 3, v: V(), viz: Z(), n: 'O intervalo de busca começa sendo a lista inteira: índices ' + ini + ' a ' + fim + '.' };
          var it = 0;
          while (true) {
            var c = ini <= fim;
            yield { l: 4, v: V(), c: ['ini <= fim', c], viz: Z(), it: c ? it + 1 : undefined, n: c ? 'Ainda há ' + (fim - ini + 1) + ' candidato(s).' : 'O intervalo ficou <b>vazio</b>: o alvo <b>não está</b> na lista. Foram só ' + it + ' comparações.' };
            if (!c) break;
            it++;
            meio = Math.floor((ini + fim) / 2);
            yield { l: 5, v: V(), it: it, viz: Z(), n: 'meio = (' + ini + ' + ' + fim + ') // 2 = <b>' + meio + '</b> → v[meio] = ' + v[meio] };
            var eq = v[meio] === alvo;
            yield { l: 6, v: V(), it: it, c: ['v[meio] == alvo', eq], viz: Z() };
            if (eq) {
              found = meio;
              yield { l: 7, v: V(), it: it, viz: Z(), p: A.print('Achei na posição', meio), n: 'Encontrado em apenas <b>' + it + '</b> comparação(ões)! A busca linear teria feito ' + (meio + 1) + '.' };
              yield { l: 8, v: V(), it: it, viz: Z() };
              break;
            }
            var lt = v[meio] < alvo;
            yield { l: 9, v: V(), it: it, c: ['v[meio] < alvo', lt], viz: Z() };
            if (lt) {
              ini = meio + 1;
              yield { l: 10, v: V(), it: it, viz: Z(), n: v[meio] + ' < ' + alvo + ': o alvo só pode estar à <b>direita</b>. Descartamos a metade esquerda.' };
            } else {
              yield { l: 11, v: V(), it: it, viz: Z() };
              fim = meio - 1;
              yield { l: 12, v: V(), it: it, viz: Z(), n: v[meio] + ' > ' + alvo + ': o alvo só pode estar à <b>esquerda</b>. Descartamos a metade direita.' };
            }
          }
        }
      } },
      { tip: '<p>1 milhão de elementos: linear até <b>1.000.000</b> comparações, binária no máximo <b>20</b>.</p>' },
      { h2: 'Bubble Sort' },
      { html: '<p><b style="background:var(--acc);color:#17171c;border:2px solid var(--ink);border-radius:7px;padding:0 7px">amarelo</b> compara &nbsp; <b style="background:var(--pink);color:#17171c;border:2px solid var(--ink);border-radius:7px;padding:0 7px">rosa</b> troca &nbsp; <b style="background:var(--lime);color:#17171c;border:2px solid var(--ink);border-radius:7px;padding:0 7px">verde</b> no lugar</p>' },
      { lab: {
        title: 'Bubble Sort',
        params: { v: [5, 2, 8, 1, 9, 3] },
        viz: 'bars',
        code: function (P) { return 'v = ' + A.repr(P.v) + '\nn = len(v)\nfor i in range(n - 1):\n    for j in range(n - 1 - i):\n        if v[j] > v[j + 1]:\n            v[j], v[j + 1] = v[j + 1], v[j]\nprint(v)'; },
        gen: function* (P) {
          var v = P.v.filter(function (x) { return typeof x === 'number'; }).slice(0, 10);
          var ids = v.map(function (_, k) { return k; }), n = v.length, trocas = 0, comps = 0;
          var max = Math.max.apply(null, v.concat([1]));
          function Z(cmp, swap, sortedFrom) {
            var ok = [];
            for (var k = sortedFrom; k < n; k++) ok.push(k);
            return { arr: v.slice(), ids: ids.slice(), cmp: cmp || [], swap: swap || [], ok: ok, max: max };
          }
          yield { l: 1, v: { v: v }, viz: Z([], [], n) };
          yield { l: 2, v: { v: v, n: n }, viz: Z([], [], n) };
          for (var i = 0; i < n - 1; i++) {
            yield { l: 3, v: { v: v, n: n, i: i }, viz: Z([], [], n - i), n: '<b>Passada ' + (i + 1) + '</b>: vamos comparar os vizinhos até a posição ' + (n - 1 - i) + '.' };
            for (var j = 0; j < n - 1 - i; j++) {
              yield { l: 4, v: { v: v, n: n, i: i, j: j }, viz: Z([j, j + 1], [], n - i) };
              comps++;
              var c = v[j] > v[j + 1];
              yield { l: 5, v: { v: v, n: n, i: i, j: j }, c: [v[j] + ' > ' + v[j + 1], c], viz: Z([j, j + 1], [], n - i), n: c ? 'Fora de ordem, precisa trocar.' : 'Já estão em ordem, segue.' };
              if (c) {
                var t = v[j]; v[j] = v[j + 1]; v[j + 1] = t;
                t = ids[j]; ids[j] = ids[j + 1]; ids[j + 1] = t;
                trocas++;
                yield { l: 6, v: { v: v, n: n, i: i, j: j }, viz: Z([], [j, j + 1], n - i), n: 'Troca! (Python permite trocar dois valores numa linha só.) Total de trocas: ' + trocas + '.' };
              }
            }
          }
          yield { l: 7, v: { v: v, n: n }, viz: Z([], [], 0), p: A.repr(v), n: 'Ordenado com <b>' + comps + '</b> comparações e <b>' + trocas + '</b> trocas.' };
        }
      } },
      { html: '<p>No dia a dia, use o pronto:</p>' },
      { code: 'v = [5, 2, 8, 1, 9, 3]\nprint(sorted(v))                 # nova lista ordenada\nprint(sorted(v, reverse=True))   # decrescente\nv.sort()                         # ordena a própria lista\nprint(v)', out: '[1, 2, 3, 5, 8, 9]\n[9, 8, 5, 3, 2, 1]\n[1, 2, 3, 5, 8, 9]' },
    ],
    quiz: [
      { q: 'Qual a condição para usar busca binária?', options: ['Lista com números pares', 'Lista ordenada', 'Lista pequena', 'Lista sem repetidos'], answer: 1 },
      { q: 'Numa lista ordenada de 1024 elementos, no máximo quantas comparações a busca binária faz?', options: ['1024', '512', 'cerca de 10', '1'], answer: 2, explain: '2¹⁰ = 1024, então em ~10 cortes pela metade sobra 1 elemento.' },
      { q: 'Após a 1ª passada do Bubble Sort em [4, 3, 1, 2], qual elemento certamente está na última posição?', options: ['1', '2', '3', '4'], answer: 3, explain: 'O maior elemento "borbulha" até o fim na primeira passada.' },
      { q: 'Qual a diferença entre <code>v.sort()</code> e <code>sorted(v)</code>?', options: ['Nenhuma', 'sort() altera v; sorted() devolve uma nova lista', 'sorted() é decrescente', 'sort() só funciona com strings'], answer: 1 }
    ]
  });
})(window.ALG);
