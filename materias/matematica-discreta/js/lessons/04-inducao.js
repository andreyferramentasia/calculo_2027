/* Aula 04 — Indução matemática (Gersting, cap. 2.2) */
(function (A) {
  A.lesson({
    id: 'inducao', module: 'd1', num: 4, minutes: 30,
    title: 'Indução matemática',
    goals: ['Base', 'Passo indutivo', 'Recursão', '1º e 2º princípios'],
    body: [
      { h2: '1. A ideia: subir uma escada infinita' },
      { html: '<p>Como saber que você alcança um degrau arbitrariamente alto, sem testar todos? Duas hipóteses bastam:</p>' +
        '<ol><li>Você consegue alcançar o <b>primeiro</b> degrau.</li><li>De <b>qualquer</b> degrau alcançado, você sempre consegue ir ao <b>próximo</b>.</li></ol>' +
        '<p>É o efeito dominó: a primeira peça cai, e cada peça derruba a seguinte. Trocando "degrau" por "propriedade P(n)", essa é a <b>indução matemática</b>: provar que algo vale para todo inteiro a partir de um valor inicial.</p>' },

      { h2: '2. Primeiro princípio de indução' },
      { html: '<table><thead><tr><th>Passo</th><th>O que fazer</th></tr></thead><tbody>' +
        '<tr><td><b>1. Base</b></td><td>Provar P(1): vale no primeiro caso.</td></tr>' +
        '<tr><td><b>2. Passo indutivo</b></td><td>Supor P(k) verdadeira (<b>hipótese de indução</b>) e provar P(k + 1).</td></tr></tbody></table>' +
        '<p>A base não precisa ser 1: pode ser 0, 4 ou qualquer inteiro que a propriedade exija.</p>' +
        '<h3>Exemplo: a árvore genealógica</h3><p>Uma pessoa teve 2 filhos; cada filho teve 2 filhos; e assim por diante. Conjectura: a geração n tem <b>2ⁿ</b> descendentes.</p>' +
        '<details class="demo"><summary>Ver demonstração</summary><div>' +
        '<p>Base: P(1) → 2¹ = 2 descendentes. V, a pessoa teve 2 filhos.</p><p>Hipótese: P(k) → a geração k tem 2<sup>k</sup> descendentes.</p>' +
        '<p>Cada um deles tem 2 filhos: P(k+1) = 2 · 2<sup>k</sup> = 2<sup>k+1</sup></p><p class="fim">Logo, P(n) = 2ⁿ vale para todo n ≥ 1. ∎</p></div></details>' +
        '<p>A <b>recursão</b> em código espelha a indução: o <b>caso base</b> do código é a base da indução, e a chamada com um valor menor é a hipótese de indução sendo usada. Veja a pilha de chamadas:</p>' },
      { lab: {
        title: 'descendentes(n): a recursão como indução',
        params: { n: 3 },
        viz: 'stack',
        code: function (P) { var n = Math.max(1, Math.min(6, Math.trunc(P.n))); return 'def descendentes(n):\n    if n == 1:\n        return 2\n    return 2 * descendentes(n - 1)\n\nprint(descendentes(' + n + '))'; },
        gen: function* (P) {
          var N = Math.max(1, Math.min(6, Math.trunc(P.n)));
          var main = { name: '<módulo principal>', vars: {} };
          var frames = [];
          function S() { return { frames: [main].concat(frames.map(function (f) { return { name: f.name, vars: { n: f.n }, ret: f.ret }; })) }; }
          yield { l: 1, v: {}, viz: S(), n: 'Define a função recursiva.' };
          yield { l: 6, v: {}, viz: S(), n: 'Chama <code>descendentes(' + N + ')</code>.' };
          for (var n = N; n >= 1; n--) {
            frames.push({ name: 'descendentes(' + n + ')', n: n });
            yield { l: 2, v: { n: n }, viz: S(), c: ['n == 1', n === 1], n: n === 1 ? '<b>Caso base!</b> É a base da indução: P(1) = 2.' : 'n = ' + n + ' não é o caso base: vai precisar de <code>descendentes(' + (n - 1) + ')</code>, que <b>confiamos</b> que dá certo (hipótese de indução).' };
            if (n > 1) yield { l: 4, v: { n: n }, viz: S(), n: 'Fica esperando a resposta de <code>descendentes(' + (n - 1) + ')</code>. Um quadro novo vai para o topo da pilha.' };
          }
          var val = 2;
          frames[frames.length - 1].ret = 2;
          yield { l: 3, v: { n: 1 }, viz: S(), n: 'Primeiro <code>return</code>: devolve 2.' };
          for (var k = frames.length - 2; k >= 0; k--) {
            frames.pop();
            val = 2 * val;
            frames[k].ret = val;
            yield { l: 4, v: { n: frames[k].n }, viz: S(), n: 'A resposta volta e é dobrada: 2 · ' + (val / 2) + ' = <b>' + val + '</b>. É o passo indutivo: P(k+1) = 2 · P(k).' };
          }
          frames.pop();
          yield { l: 6, v: {}, viz: S(), p: String(val), n: 'descendentes(' + N + ') = ' + val + ' = 2<sup>' + N + '</sup>. ✔' };
        }
      } },

      { h3: 'Exemplo: soma dos ímpares' },
      { html: '<p class="formula">1 + 3 + 5 + … + (2n − 1) = n²</p>' +
        '<details class="demo"><summary>Ver demonstração</summary><div>' +
        '<p>Base: P(1) → 1 = 1². V.</p><p>Hipótese: P(k) → 1 + 3 + … + (2k − 1) = k²</p>' +
        '<p>1 + 3 + … + (2k − 1) + [2(k+1) − 1]</p><p>= k² + [2(k+1) − 1] &nbsp;&nbsp;(usou a hipótese)</p><p>= k² + 2k + 1</p><p>= (k + 1)²</p><p class="fim">Logo, P(k+1) vale, e a fórmula vale para todo n. ∎</p></div></details>' },
      { code: 'def soma_impares(n):\n    total = 0\n    for i in range(1, n + 1):\n        total += 2 * i - 1\n    return total\n\nfor n in range(1, 6):\n    print(n, soma_impares(n), soma_impares(n) == n ** 2)', out: '1 1 True\n2 4 True\n3 9 True\n4 16 True\n5 25 True' },

      { h2: '3. Segundo princípio de indução' },
      { html: '<p>Às vezes P(k) sozinho não basta para provar P(k+1): é preciso usar valores <b>bem mais atrás</b>.</p>' +
        '<table><thead><tr><th>Aspecto</th><th>Primeiro princípio</th><th>Segundo princípio</th></tr></thead><tbody>' +
        '<tr><td>hipótese</td><td>supõe só P(k)</td><td>supõe P(r) para todo r, 1 ≤ r ≤ k</td></tr>' +
        '<tr><td>use quando</td><td>P(k) basta para P(k+1)</td><td>P(k+1) depende de mais de uma posição atrás</td></tr>' +
        '<tr><td>força</td><td colspan="2">equivalentes: provam as mesmas coisas</td></tr></tbody></table>' +
        '<h3>Exemplo: todo inteiro ≥ 2 é primo ou produto de primos</h3>' +
        '<details class="demo"><summary>Ver demonstração</summary><div>' +
        '<p>Base: P(2) → 2 é primo.</p><p>Hipótese: P(r) vale para todo r com 2 ≤ r ≤ k.</p>' +
        '<p>Se k+1 é primo: pronto.</p><p>Se não: k+1 = a · b, com 2 ≤ a ≤ k e 2 ≤ b ≤ k</p><p>Pela hipótese, a e b são primos ou produtos de primos</p><p class="fim">Logo, k+1 = a · b também é produto de primos. ∎</p></div></details>' +
        '<p>Por que é o segundo princípio? A prova usa <b>a</b> e <b>b</b>, que podem estar bem atrás de k. Só supor P(k) não bastaria. Essa é a base dos algoritmos de fatoração usados em criptografia (aulas 7 e 8).</p>' },

      { h2: '4. Erros comuns' },
      { warn: '<p>Uma demonstração por indução precisa dos <b>dois</b> passos. Só a base: nada garante ir além do primeiro caso. Só o passo: o dominó nunca começa a cair. Em código é igual: recursão sem caso base nunca para (<code>RecursionError</code>).</p>' }
    ],
    quiz: [
      { q: 'Na indução, a "hipótese de indução" é:', options: ['Provar P(1)', 'Supor P(k) verdadeira para provar P(k+1)', 'Testar muitos valores', 'Supor que P(n) é falsa'], answer: 1, explain: 'Supõe-se P(k) e, a partir dela, prova-se P(k+1).' },
      { q: 'Em <code>def f(n): return 2 * f(n - 1)</code>, o que está faltando?', options: ['O passo indutivo', 'O caso base', 'Um laço for', 'Nada'], answer: 1, explain: 'Sem caso base (como a base da indução), a recursão nunca para.' },
      { q: 'Quanto vale 1 + 3 + 5 + 7 + 9?', options: ['20', '25', '30', '45'], answer: 1, explain: 'São os 5 primeiros ímpares: n² = 5² = 25.' },
      { q: 'O segundo princípio de indução é mais útil quando:', options: ['P(k+1) depende só de P(k)', 'P(k+1) depende de valores bem anteriores a k', 'Não há caso base', 'n é negativo'], answer: 1, explain: 'Ele permite supor P(r) para todos os r até k, não só P(k).' }
    ]
  });
})(window.ALG);
