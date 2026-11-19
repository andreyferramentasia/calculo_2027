/* Aula 09 — Big O (Gersting, cap. 5.5) */
(function (A) {
  var NUM = [3, 7, 12, 18, 25, 31, 40, 52];

  A.lesson({
    id: 'big-o', module: 'd4', num: 9, minutes: 35,
    title: 'Big O: quanto o trabalho cresce',
    goals: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
    body: [
      { h2: '1. O que é Big O' },
      { html: '<p><b>Big O responde: "se a entrada dobrar, o trabalho faz o quê?"</b> O "O" vem de <b>ordem</b> de grandeza; <b>n</b> é o tamanho da entrada (itens da lista, usuários, páginas).</p>' +
        '<table><thead><tr><th>Big O mede</th><th>Big O não mede</th></tr></thead><tbody>' +
        '<tr><td>como o número de passos cresce quando n cresce</td><td>o tempo exato em segundos</td></tr>' +
        '<tr><td>o pior caso (o cenário mais azarado)</td><td>a velocidade do computador</td></tr>' +
        '<tr><td>a forma da curva</td><td>detalhes pequenos (constantes)</td></tr></tbody></table>' +
        '<p><b>Dia a dia:</b> mandar fotos para um amigo em outra cidade. Pela internet, 2× mais fotos = 2× mais tempo: <b>O(n)</b>. Levando o HD de carro, 10 fotos ou 1 milhão demoram o mesmo: <b>O(1)</b>. Com poucas fotos a internet ganha; com muitas, o carro ganha. Big O olha para o que acontece quando n fica <b>enorme</b>.</p>' },
      { widget: 'bigO' },

      { h2: '2. Cada O com um exemplo' },
      { html: '<p>Os exemplos usam a mesma lista ordenada de 8 números (n = 8):</p>' },
      { code: 'numeros = [3, 7, 12, 18, 25, 31, 40, 52]', playground: false },
      { h3: 'O(1): constante' },
      { html: '<p>Vai direto na posição: 1 passo, sempre. Dia a dia: pegar o livro do topo da pilha.</p>' },
      { code: 'numeros = [3, 7, 12, 18, 25, 31, 40, 52]\nprint(numeros[3])', out: '18' },
      { h3: 'O(n): linear' },
      { html: '<p>Olha um por um até achar. Dobrou n, dobrou o trabalho. Dia a dia: fazer a chamada da turma, nome por nome.</p>' },
      { lab: {
        title: 'Busca linear: um por um',
        params: { alvo: 52 },
        viz: 'array',
        code: function (P) { return 'numeros = [3, 7, 12, 18, 25, 31, 40, 52]\npassos = 0\nfor item in numeros:\n    passos = passos + 1\n    if item == ' + Math.trunc(P.alvo) + ':\n        break\nprint(passos)'; },
        gen: function* (P) {
          var alvo = Math.trunc(P.alvo), dim = [], ok = [];
          function Z(k) { return { arr: NUM, ptr: k === null ? {} : { item: k }, hl: k === null ? [] : [k], dim: dim, ok: ok, label: 'numeros' }; }
          var passos = 0;
          yield { l: 1, v: { numeros: NUM }, viz: Z(null) };
          yield { l: 2, v: { passos: 0 }, viz: Z(null) };
          for (var k = 0; k < NUM.length; k++) {
            yield { l: 3, v: { passos: passos, item: NUM[k] }, it: k + 1, viz: Z(k) };
            passos++;
            yield { l: 4, v: { passos: passos, item: NUM[k] }, it: k + 1, viz: Z(k) };
            var achou = NUM[k] === alvo;
            yield { l: 5, v: { passos: passos, item: NUM[k] }, it: k + 1, viz: Z(k), c: ['item == ' + alvo, achou] };
            if (achou) { ok.push(k); yield { l: 6, v: { passos: passos, item: NUM[k] }, viz: Z(k), n: 'Achou depois de olhar ' + passos + ' de ' + NUM.length + ' itens.' }; break; }
            dim.push(k);
          }
          yield { l: 7, v: { passos: passos }, viz: Z(null), p: String(passos), n: passos === NUM.length ? 'Pior caso: olhou <b>todos</b> os n itens. Por isso a busca linear é O(n).' : 'Desta vez teve sorte, mas o Big O conta o pior caso: n passos.' };
        }
      } },
      { h3: 'O(log n): logarítmico' },
      { html: '<p>Olha o <b>meio</b> e joga fora a metade errada (a lista precisa estar <b>ordenada</b>). Dia a dia: procurar "girafa" no dicionário abrindo no meio.</p>' },
      { lab: {
        title: 'Busca binária: corta pela metade',
        params: { alvo: 52 },
        viz: 'array',
        code: function (P) { return 'numeros = [3, 7, 12, 18, 25, 31, 40, 52]\ninicio = 0\nfim = 7\npassos = 0\nwhile inicio <= fim:\n    meio = (inicio + fim) // 2\n    passos = passos + 1\n    if numeros[meio] == ' + Math.trunc(P.alvo) + ':\n        break\n    if numeros[meio] < ' + Math.trunc(P.alvo) + ':\n        inicio = meio + 1\n    else:\n        fim = meio - 1\nprint(passos)'; },
        gen: function* (P) {
          var alvo = Math.trunc(P.alvo), ini = 0, fim = 7, passos = 0, dim = [], ok = [];
          function Z(m) { var p = { inicio: ini, fim: fim }; if (m !== null) p.meio = m; return { arr: NUM, ptr: p, hl: m === null ? [] : [m], dim: dim.slice(), ok: ok, label: 'numeros' }; }
          yield { l: 1, v: {}, viz: Z(null) };
          yield { l: 4, v: { inicio: ini, fim: fim, passos: 0 }, viz: Z(null), n: 'Começa olhando a lista inteira: posições 0 a 7.' };
          while (true) {
            var c = ini <= fim;
            yield { l: 5, v: { inicio: ini, fim: fim, passos: passos }, viz: Z(null), c: ['inicio <= fim', c] };
            if (!c) break;
            var m = Math.floor((ini + fim) / 2);
            yield { l: 6, v: { inicio: ini, fim: fim, passos: passos, meio: m }, viz: Z(m), n: 'meio = (' + ini + ' + ' + fim + ') // 2 = ' + m + ' → numeros[' + m + '] = ' + NUM[m] };
            passos++;
            yield { l: 7, v: { inicio: ini, fim: fim, passos: passos, meio: m }, viz: Z(m) };
            var ach = NUM[m] === alvo;
            yield { l: 8, v: { inicio: ini, fim: fim, passos: passos, meio: m }, viz: Z(m), c: ['numeros[meio] == ' + alvo, ach] };
            if (ach) { ok.push(m); yield { l: 9, v: { inicio: ini, fim: fim, passos: passos, meio: m }, viz: Z(m), n: 'Achou em ' + passos + ' passos.' }; break; }
            if (NUM[m] < alvo) {
              yield { l: 10, v: { inicio: ini, fim: fim, passos: passos, meio: m }, viz: Z(m), c: ['numeros[meio] < ' + alvo, true], n: NUM[m] + ' é menor: o alvo só pode estar à <b>direita</b>. A metade esquerda é descartada.' };
              for (var k = ini; k <= m; k++) dim.push(k);
              ini = m + 1;
              yield { l: 11, v: { inicio: ini, fim: fim, passos: passos, meio: m }, viz: Z(null) };
            } else {
              yield { l: 10, v: { inicio: ini, fim: fim, passos: passos, meio: m }, viz: Z(m), c: ['numeros[meio] < ' + alvo, false], n: NUM[m] + ' é maior: o alvo só pode estar à <b>esquerda</b>.' };
              for (k = m; k <= fim; k++) dim.push(k);
              fim = m - 1;
              yield { l: 13, v: { inicio: ini, fim: fim, passos: passos, meio: m }, viz: Z(null) };
            }
          }
          yield { l: 14, v: { passos: passos }, viz: Z(null), p: String(passos), n: 'No máximo log₂ 8 + 1 = 4 passos. Com 1 milhão de itens: cerca de 20 passos, contra 1 milhão da busca linear.' };
        }
      } },
      { h3: 'O(n log n): linearítmico' },
      { html: '<p>São log n rodadas, e cada rodada mexe nos n itens. Dia a dia: ordenar as provas da turma: divide a pilha, ordena cada metade, junta. É o custo das boas ordenações, como o <code>sorted</code> do Python.</p>' },
      { code: 'embaralhada = [31, 7, 52, 3, 40, 12, 25, 18]\nprint(sorted(embaralhada))', out: '[3, 7, 12, 18, 25, 31, 40, 52]' },
      { h3: 'O(n²): quadrático' },
      { html: '<p>Um laço dentro de outro: cada item com cada item. Dia a dia: no grupo da turma, cada pessoa manda mensagem para cada outra.</p>' },
      { code: 'numeros = [3, 7, 12, 18, 25, 31, 40, 52]\npassos = 0\nfor a in numeros:\n    for b in numeros:\n        passos = passos + 1\nprint(passos)', out: '64' },
      { h3: 'O(2ⁿ): exponencial' },
      { html: '<p>Cada item novo <b>dobra</b> o trabalho. Dia a dia: adivinhar uma senha de n dígitos 0 ou 1 testando todas (princípio da multiplicação, aula 6).</p>' },
      { code: 'from itertools import product\nsenhas = list(product("01", repeat=3))\nprint(senhas)\nprint(len(senhas))', out: "[('0', '0', '0'), ('0', '0', '1'), ('0', '1', '0'), ('0', '1', '1'), ('1', '0', '0'), ('1', '0', '1'), ('1', '1', '0'), ('1', '1', '1')]\n8" },
      { warn: '<p>Com <code>repeat=10</code> são 1.024 senhas; com 60, nem em 30 anos termina.</p>' },

      { h2: '3. Como descobrir o O de um código' },
      { html: '<table><thead><tr><th>Se o código tem…</th><th>Big O</th></tr></thead><tbody>' +
        '<tr><td>nenhum laço, só contas e acessos</td><td>O(1)</td></tr>' +
        '<tr><td>um laço que corta n pela metade</td><td>O(log n)</td></tr>' +
        '<tr><td>um laço que passa por todos os itens</td><td>O(n)</td></tr>' +
        '<tr><td>uma ordenação (<code>sorted</code>)</td><td>O(n log n)</td></tr>' +
        '<tr><td>um laço dentro de outro laço</td><td>O(n²)</td></tr>' +
        '<tr><td>testar todas as combinações</td><td>O(2ⁿ)</td></tr></tbody></table>' +
        '<h3>Regra de ouro: fica só a parte que mais cresce</h3>' +
        '<table><thead><tr><th>Passos contados</th><th>O que some</th><th>Big O</th></tr></thead><tbody>' +
        '<tr><td>500</td><td>número fixo, não depende de n</td><td>O(1)</td></tr>' +
        '<tr><td>3n + 5</td><td>o 3 e o 5</td><td>O(n)</td></tr>' +
        '<tr><td>n² + n</td><td>o n (perto de n² é nada)</td><td>O(n²)</td></tr></tbody></table>' +
        '<p>Com n = 1 milhão: n² = 1 trilhão e n = 1 milhão. O n vira poeira, por isso some.</p>' },
      { tip: '<p>Dois laços <b>um depois do outro</b> (não um dentro do outro) dão n + n = 2n → <b>O(n)</b>, e não O(n²).</p>' }
    ],
    quiz: [
      { q: 'Qual o Big O de acessar <code>lista[500]</code>?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 0, explain: 'Acesso por índice vai direto na posição: constante.' },
      { q: 'Um algoritmo faz 4n² + 100n + 7 passos. Qual o Big O?', options: ['O(n)', 'O(4n²)', 'O(n²)', 'O(100n)'], answer: 2, explain: 'Fica só a parte que mais cresce, sem a constante: O(n²).' },
      { q: 'A busca binária exige que a lista esteja…', options: ['vazia', 'ordenada', 'com números pares', 'sem repetidos'], answer: 1, explain: 'Só dá para descartar metade se a lista estiver em ordem.' },
      { q: 'Com n = 1 milhão e 1 bilhão de passos por segundo, qual destes trava?', options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'], answer: 3, explain: 'n² = 10¹² passos ≈ 17 minutos. Os outros terminam em frações de segundo.' }
    ]
  });
})(window.ALG);
