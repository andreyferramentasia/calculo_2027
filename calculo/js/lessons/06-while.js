/* Aula 06 — Repetição com while */
(function (A) {
  var F = A.F;
  A.lesson({
    id: 'while', module: 'm2', num: 6, minutes: 25,
    title: 'Repetição com while',
    goals: ['while', 'Condição · corpo · atualização', 'Contadores e acumuladores'],
    body: [
      { html: '<p><code>while</code> = <b>enquanto</b> a condição for True, repete. Três partes: <b>início</b> (<code>i = 1</code>) → <b>condição</b> (<code>i &lt;= 5</code>) → <b>atualização</b> (<code>i = i + 1</code>).</p>' },
      { h2: 'O circuito do loop' },
      { lab: {
        title: 'Contando de 1 até n',
        params: { n: 5 },
        viz: ['ring', 'trail'],
        code: function (P) { return 'i = 1\nwhile i <= ' + Math.min(30, Math.trunc(P.n)) + ':\n    print("Volta", i)\n    i = i + 1\nprint("Saiu do loop!")'; },
        gen: function* (P) {
          var n = Math.min(30, Math.trunc(P.n)), i = 1, hist = [], it = 1;
          var L = { cond: 'i <= ' + n, body: 'print("Volta", i)', upd: 'i = i + 1' };
          function R(stage, k, val) { return { ring: { stage: stage, it: k, val: val, labels: L }, trail: { label: 'i impressos:', items: hist.slice() } }; }
          yield { l: 1, v: { i: i }, viz: R('init'), n: '<b>Inicialização</b>: a variável de controle <code>i</code> começa em 1.' };
          while (true) {
            var c = i <= n;
            yield {
              l: 2, v: { i: i }, c: ['i <= ' + n, c], it: c ? it : undefined, viz: R('cond', it, c),
              n: c ? '<b>Condição</b>: ' + i + ' <= ' + n + ' é True → entra no loop para a volta ' + it + '.' : '<b>Condição</b>: ' + i + ' <= ' + n + ' é <b>False</b> → o loop termina e o programa segue depois dele.'
            };
            if (!c) break;
            hist.push(i);
            yield { l: 3, v: { i: i }, it: it, p: A.print('Volta', i), viz: R('body', it), n: '<b>Corpo</b> do loop: imprime o valor atual de <code>i</code>.' };
            i = i + 1;
            yield { l: 4, v: { i: i }, it: it, viz: R('upd', it), n: '<b>Atualização</b>: <code>i</code> passa a valer ' + i + '. Agora o Python <b>volta</b> para a linha 2.' };
            it++;
          }
          yield { l: 5, v: { i: i }, p: 'Saiu do loop!', viz: R('out', it), n: 'Repare: depois do loop <code>i</code> vale <b>' + i + '</b>, o primeiro valor que tornou a condição falsa. O loop rodou <b>' + (it - 1) + '</b> vezes.' };
        }
      } },
      { warn: '<p>Sem a atualização o loop é <b>infinito</b>. Para parar: <kbd>Ctrl</kbd>+<kbd>C</kbd>.</p>' },
      { h2: 'Contando dígitos' },
      { lab: {
        title: 'Contando dígitos',
        params: { n: 4321 },
        viz: ['ring', 'trail'],
        code: function (P, r) { return 'n = ' + r(Math.abs(Math.trunc(P.n))) + '\ndigitos = 0\nwhile n > 0:\n    n = n // 10\n    digitos = digitos + 1\nprint("Dígitos:", digitos)'; },
        gen: function* (P) {
          var n = Math.abs(Math.trunc(P.n)), digitos, hist = [n], it = 1;
          var L = { cond: 'n > 0', body: 'n = n // 10', upd: 'digitos += 1' };
          function R(stage, k, val) { return { ring: { stage: stage, it: k, val: val, labels: L }, trail: { label: 'valores de n:', items: hist.slice() } }; }
          yield { l: 1, v: { n: n }, viz: R('init') };
          digitos = 0;
          yield { l: 2, v: { n: n, digitos: digitos }, viz: R('init'), n: '<code>digitos</code> é um <b>contador</b>: começa em 0 e soma 1 a cada volta.' };
          while (true) {
            var c = n > 0;
            yield { l: 3, v: { n: n, digitos: digitos }, c: ['n > 0', c], it: c ? it : undefined, viz: R('cond', it, c) };
            if (!c) break;
            var old = n;
            n = Math.floor(n / 10);
            hist.push(n);
            yield { l: 4, v: { n: n, digitos: digitos }, it: it, viz: R('body', it), n: '<code>' + old + ' // 10</code> = ' + n + ': o último dígito foi "arrancado".' };
            digitos++;
            yield { l: 5, v: { n: n, digitos: digitos }, it: it, viz: R('upd', it) };
            it++;
          }
          yield { l: 6, v: { n: n, digitos: digitos }, p: A.print('Dígitos:', digitos), viz: R('out', it) };
        }
      } },
      { h2: 'Acumulador' },
      { html: '<p>1/2 + 1/4 + 1/8 + … quantos termos até passar de 0.99?</p>' },
      { lab: {
        title: 'Soma de uma série geométrica',
        params: { alvo: 0.99 },
        viz: ['ring', 'trail'],
        code: function (P) { return 'soma = 0\ntermo = 0.5\nn = 0\nwhile soma < ' + P.alvo + ':\n    soma = soma + termo\n    termo = termo / 2\n    n = n + 1\nprint(n, "termos, soma =", soma)'; },
        gen: function* (P) {
          var alvo = Math.min(0.999999, Math.max(0.1, P.alvo));
          var soma = 0, termo = 0.5, n = 0, hist = [], it = 1;
          var L = { cond: 'soma < ' + alvo, body: 'soma += termo', upd: 'termo /= 2' };
          function V() { return { soma: soma === 0 && n === 0 ? 0 : F(soma), termo: F(termo), n: n }; }
          function R(stage, k, val) { return { ring: { stage: stage, it: k, val: val, labels: L }, trail: { label: 'soma:', items: hist.slice() } }; }
          yield { l: 1, v: { soma: 0 }, viz: R('init'), n: 'O <b>acumulador</b> começa em 0.' };
          yield { l: 2, v: { soma: 0, termo: F(termo) }, viz: R('init') };
          yield { l: 3, v: V(), viz: R('init') };
          while (true) {
            var c = soma < alvo;
            yield { l: 4, v: V(), c: ['soma < ' + alvo, c], it: c ? it : undefined, viz: R('cond', it, c) };
            if (!c) break;
            soma += termo;
            hist.push(+soma.toFixed(6));
            yield { l: 5, v: V(), it: it, viz: R('body', it), n: 'Soma parcial: <b>' + A.fmtFloat(soma) + '</b>. Cada vez mais perto de 1.' };
            termo /= 2;
            yield { l: 6, v: V(), it: it, viz: R('upd', it), n: 'O próximo termo é a metade: ' + A.fmtFloat(termo) };
            n++;
            yield { l: 7, v: V(), it: it, viz: R('upd', it) };
            it++;
          }
          yield { l: 8, v: V(), p: A.print(n, 'termos, soma =', F(soma)), viz: R('out', it) };
        }
      } },
    ],
    quiz: [
      { q: 'Quantas vezes "oi" é impresso?', code: 'i = 0\nwhile i < 3:\n    print("oi")\n    i = i + 1', options: ['2', '3', '4', 'infinitas'], answer: 1, explain: 'i assume 0, 1, 2 (3 voltas). Com i = 3 a condição é falsa.' },
      { q: 'O que acontece?', code: 'x = 1\nwhile x < 10:\n    print(x)', options: ['Imprime 1 a 9', 'Imprime 1 uma vez', 'Loop infinito', 'Erro de sintaxe'], answer: 2, explain: 'x nunca muda, então x < 10 é sempre True.' },
      { q: 'Qual o valor final de <code>s</code>?', code: 's = 0\nk = 1\nwhile k <= 4:\n    s = s + k\n    k = k + 1', options: ['4', '6', '10', '15'], answer: 2, explain: '1 + 2 + 3 + 4 = 10. s é um acumulador.' },
      { q: 'Quando a condição do while é testada?', options: ['Só uma vez, no início', 'Antes de cada volta', 'Depois do loop acabar', 'No meio do bloco'], answer: 1 }
    ]
  });
})(window.ALG);
