/* Aula 07 — RSA parte 1: fundamentos (Gersting, cap. 2.3 e 2.4) */
(function (A) {
  A.lesson({
    id: 'rsa-fundamentos', module: 'd3', num: 7, minutes: 35,
    title: 'RSA parte 1: as peças',
    goals: ['Divisores', 'Primos', 'MDC e Euclides', 'mod', 'pow', 'φ de Euler'],
    body: [
      { h2: '1. Aonde queremos chegar' },
      { html: '<p><b>RSA</b> (Rivest, Shamir e Adleman, 1977) é a criptografia por trás do cadeado do navegador, do PIX e do login do banco.</p>' +
        '<div class="ideias"><div class="ideia"><h4><code>(e, n)</code> e <code>(d, n)</code> Chave pública e privada</h4><p>Você distribui <b>cadeados abertos</b> para todo mundo. Quem quiser te mandar algo põe numa caixa e fecha. Só a <b>sua chave</b> abre.</p><p class="resumo">Chave pública cifra, chave privada decifra.</p></div></div>' +
        '<table><thead><tr><th>Peça matemática (esta aula)</th><th>Papel no RSA (aula 8)</th></tr></thead><tbody>' +
        '<tr><td>divisores e primos</td><td>escolher p e q, calcular n = p · q</td></tr>' +
        '<tr><td>MDC, coprimos e Euclides</td><td>escolher e coprimo com φ(n), achar d</td></tr>' +
        '<tr><td>aritmética modular</td><td>cifrar e decifrar</td></tr>' +
        '<tr><td>função φ de Euler</td><td>o número secreto que liga e a d</td></tr></tbody></table>' },

      { h2: '2. Divisores e list comprehension' },
      { html: '<table><thead><tr><th>Notação</th><th>Leitura</th><th>Python</th></tr></thead><tbody>' +
        '<tr><td>3 | 12</td><td>"3 divide 12": V, 12 = 3 · 4</td><td><code>12 % 3 == 0</code></td></tr>' +
        '<tr><td>5 | 12</td><td>F, sobra resto 2</td><td><code>12 % 5 == 0</code></td></tr></tbody></table>' +
        '<p>Para listar os divisores de n, testamos cada candidato de 1 até n. Dois jeitos de escrever a mesma coisa:</p>' },
      { compare: [
        { title: 'com laço for', code: 'n = 8\ndivisores = []\nfor i in range(1, n + 1):\n    if n % i == 0:\n        divisores.append(i)\nprint(divisores)' },
        { title: 'com list comprehension', code: 'n = 8\ndivisores = [i for i in range(1, n + 1) if n % i == 0]\nprint(divisores)' }
      ] },
      { html: '<p>Saída dos dois: <code>[1, 2, 4, 8]</code>. A list comprehension se lê como a notação de conjuntos da aula 5: D = { i | 1 ≤ i ≤ 8 e 8 % i = 0 }.</p>' +
        '<table><thead><tr><th>Parte</th><th>Pergunta</th><th>No exemplo</th></tr></thead><tbody>' +
        '<tr><td>expressão</td><td>o que vai para a lista?</td><td><code>i</code></td></tr>' +
        '<tr><td>origem (<code>for</code>)</td><td>de onde vêm os candidatos?</td><td><code>range(1, n + 1)</code></td></tr>' +
        '<tr><td>filtro (<code>if</code>, opcional)</td><td>quem entra?</td><td><code>n % i == 0</code></td></tr></tbody></table>' },
      { code: 'print([i * i for i in range(1, 6)])\nprint([i for i in range(1, 11) if i % 2 == 0])\nprint([i % 5 for i in range(10)])', out: '[1, 4, 9, 16, 25]\n[2, 4, 6, 8, 10]\n[0, 1, 2, 3, 4, 0, 1, 2, 3, 4]' },

      { h2: '3. Números primos' },
      { html: '<p>Um <b>primo</b> é um inteiro &gt; 1 com <b>exatamente 2</b> divisores naturais: D(p) = {1, p}. Os outros inteiros &gt; 1 são <b>compostos</b> (4, 6, 8, 9, …).</p>' },
      { code: 'def divisores(n):\n    return [i for i in range(1, n + 1) if n % i == 0]\n\ndef eh_primo(n):\n    return len(divisores(n)) == 2\n\nprint(divisores(12))\nprint([n for n in range(2, 54) if eh_primo(n)])', out: '[1, 2, 3, 4, 6, 12]\n[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53]' },

      { h2: '4. MDC e o algoritmo de Euclides' },
      { html: '<p>O <b>mdc</b> (máximo divisor comum) de a e b é o maior inteiro que divide os dois. Divisores de 12: {1, 2, 3, 4, 6, 12}; de 18: {1, 2, 3, 6, 9, 18}; em comum: {1, 2, 3, 6} → mdc(12, 18) = 6. "Em comum" é a <b>interseção</b> da aula 5:</p>' },
      { code: 'def divisores(n):\n    return [i for i in range(1, n + 1) if n % i == 0]\n\ncomum = set(divisores(12)) & set(divisores(18))\nprint(comum, max(comum))', out: '{1, 2, 3, 6} 6' },
      { html: '<div class="ideias"><div class="ideia"><h4><code>mdc(a, b) = 1</code> Coprimos <small>(primos entre si)</small></h4><p>Os dois não têm nenhum fator em comum além do 1. 8 = 2·2·2 e 15 = 3·5 são coprimos, <b>sem</b> nenhum dos dois ser primo.</p><p class="resumo">Primo fala de <b>um</b> número; coprimos fala de um <b>par</b>.</p></div></div>' +
        '<p>Listar divisores fica lento para números grandes. <b>Euclides</b> troca o par (a, b) por (b, a % b) até o resto zerar; o último a que sobra é o mdc:</p>' +
        '<p class="formula">mdc(a, b) = mdc(b, a mod b)</p>' },
      { lab: {
        title: 'Algoritmo de Euclides',
        params: { a: 420, b: 66 },
        code: function (P) { return 'def mdc(a, b):\n    while b != 0:\n        a, b = b, a % b\n    return a\n\nprint(mdc(' + Math.abs(Math.trunc(P.a)) + ', ' + Math.abs(Math.trunc(P.b)) + '))'; },
        gen: function* (P) {
          var a = Math.abs(Math.trunc(P.a)), b = Math.abs(Math.trunc(P.b)), it = 0;
          yield { l: 6, v: {}, n: 'Chama <code>mdc(' + a + ', ' + b + ')</code>.' };
          yield { l: 1, v: { a: a, b: b } };
          while (true) {
            var c = b !== 0;
            yield { l: 2, v: { a: a, b: b }, it: it || undefined, c: ['b != 0', c], n: c ? '' : 'O resto zerou: o mdc é o <b>a</b> que sobrou.' };
            if (!c) break;
            it++;
            var r = a % b;
            yield { l: 3, v: { a: b, b: r }, it: it, n: a + ' = ' + Math.floor(a / b) + ' · ' + b + ' + <b>' + r + '</b>. O par (' + a + ', ' + b + ') vira (' + b + ', ' + r + ').' };
            a = b; b = r;
            if (it > 40) break;
          }
          yield { l: 4, v: { a: a, b: b }, n: '<code>return ' + a + '</code>' };
          yield { l: 6, v: {}, p: String(a), n: 'mdc = ' + a + (a === 1 ? ': os números são <b>coprimos</b>.' : '.') + ' Em Python também existe pronto: <code>from math import gcd</code>.' };
        }
      } },
      { tip: '<p>Teste <code>a = 8, b = 15</code> (coprimos) e <code>a = 1071, b = 462</code>. Mesmo com números grandes, Euclides termina em poucas voltas.</p>' },
      { html: '<p><b>O mdc como combinação linear.</b> Para quaisquer a, b positivos existem inteiros i e j com <b>mdc(a, b) = i · a + j · b</b>. Eles saem das divisões de Euclides de baixo para cima:</p>' +
        '<details class="demo"><summary>Ver como achar i e j para mdc(420, 66) = 6</summary><div>' +
        '<p>420 = 6 · 66 + 24 → 24 = 420 − 6 · 66</p><p>66 = 2 · 24 + 18 → 18 = 66 − 2 · 24</p><p>24 = 1 · 18 + 6 → 6 = 24 − 1 · 18</p>' +
        '<p>6 = 24 − 1 · (66 − 2 · 24) = 3 · 24 − 66</p><p>6 = 3 · (420 − 6 · 66) − 66 = 3 · 420 − 19 · 66</p>' +
        '<p class="fim">Logo, i = 3 e j = −19. Confira: 1260 − 1254 = 6. Na aula 8 esse truque acha a chave privada d.</p></div></details>' },

      { h2: '5. Aritmética modular' },
      { html: '<div class="ideias"><div class="ideia"><h4><code>a mod n</code> Resto da divisão</h4><p>Contar em círculo, como o relógio. São 22h e você vai dormir 5 horas: o relógio mostra 3h, não 27h. 27 mod 24 = 3.</p><p class="resumo">mod é o operador <code>%</code> do Python.</p></div></div>' +
        '<p><b>a ≡ b (mod n)</b>: a e b deixam o mesmo resto na divisão por n (ou seja, n | (a − b)). Exemplo: 27 ≡ 3 (mod 24).</p>' },
      { widget: 'relogioMod', opts: { a: 27, n: 24 } },
      { h3: 'Potência com resto: o pow' },
      { html: '<p>No RSA a conta é sempre do tipo m<sup>e</sup> mod n. <code>7 ** 3 % 15</code> calcula 343 inteiro e depois o resto. <code>pow(7, 3, 15)</code> tira o resto <b>a cada multiplicação</b> (7·7 = 49 → 4; 4·7 = 28 → 13), então o número nunca passa de n:</p>' },
      { code: 'print(7 ** 3 % 15)\nprint(pow(7, 3, 15))\nprint(pow(123456789, 65537, 999999937))  # instantâneo', out: '13\n13\n900618501' },
      { warn: '<p>Com <code>**</code>, a última conta geraria um número de mais de 500 mil dígitos antes do <code>%</code>. Com números de criptografia de verdade, só o <code>pow</code> de três argumentos termina.</p>' },

      { h2: '6. A função fi de Euler' },
      { html: '<div class="ideias"><div class="ideia"><h4><code>φ(n)</code> Fi de Euler</h4><p>Quantos números de 1 até n são <b>coprimos</b> com n.</p><p class="resumo">φ(n) = quantidade de k entre 1 e n com mdc(k, n) = 1.</p></div></div>' +
        '<p>Para n = 12, só 1, 5, 7 e 11 são coprimos com 12, então φ(12) = 4.</p>' +
        '<table><thead><tr><th>Caso</th><th>Fórmula</th><th>Por quê</th></tr></thead><tbody>' +
        '<tr><td>n = p primo</td><td>φ(p) = p − 1</td><td>todo k de 1 a p − 1 é coprimo com p; só o próprio p não é</td></tr>' +
        '<tr><td>n = p · q, primos diferentes</td><td>φ(p · q) = (p − 1)(q − 1)</td><td>é exatamente o caso do RSA</td></tr></tbody></table>' +
        '<p>Exemplo: n = 15 = 3 · 5. Coprimos com 15: {1, 2, 4, 7, 8, 11, 13, 14} → φ(15) = 8 = (3 − 1) · (5 − 1).</p>' },
      { code: 'from math import gcd\n\ndef fi(n):\n    return len([k for k in range(1, n + 1) if gcd(k, n) == 1])\n\nprint(fi(12), fi(7), fi(15))', out: '4 6 8' },
      { html: '<table><thead><tr><th>Conceito</th><th>Matemática</th><th>Python</th></tr></thead><tbody>' +
        '<tr><td>divisores</td><td>a | n</td><td><code>[i for i in range(1, n + 1) if n % i == 0]</code></td></tr>' +
        '<tr><td>primo</td><td>|D(n)| = 2</td><td><code>len(divisores(n)) == 2</code></td></tr>' +
        '<tr><td>coprimos</td><td>mdc(a, b) = 1</td><td><code>gcd(a, b) == 1</code></td></tr>' +
        '<tr><td>mdc</td><td>mdc(a, b) = mdc(b, a mod b)</td><td><code>gcd(a, b)</code></td></tr>' +
        '<tr><td>resto</td><td>a mod n</td><td><code>a % n</code></td></tr>' +
        '<tr><td>potência modular</td><td>a<sup>b</sup> mod n</td><td><code>pow(a, b, n)</code></td></tr>' +
        '<tr><td>fi de Euler</td><td>φ(pq) = (p − 1)(q − 1)</td><td><code>(p - 1) * (q - 1)</code></td></tr></tbody></table>' }
    ],
    quiz: [
      { q: 'O que imprime <code>[i for i in range(1, 7) if 6 % i == 0]</code>?', options: ['[1, 2, 3, 6]', '[2, 3]', '[1, 6]', '[0, 1, 2, 3, 4, 5]'], answer: 0, explain: 'São os divisores de 6 entre 1 e 6.' },
      { q: '9 e 10 são…', options: ['ambos primos', 'coprimos', 'não coprimos, mdc = 3', 'não coprimos, mdc = 2'], answer: 1, explain: '9 = 3·3 e 10 = 2·5 não têm fator em comum: mdc = 1.' },
      { q: 'Quanto é 38 mod 7?', options: ['3', '5', '6', '0'], answer: 0, explain: '38 = 5 · 7 + 3.' },
      { q: 'Quanto vale φ(11)?', options: ['11', '10', '5', '1'], answer: 1, explain: '11 é primo, então φ(11) = 11 − 1 = 10.' }
    ]
  });
})(window.ALG);
