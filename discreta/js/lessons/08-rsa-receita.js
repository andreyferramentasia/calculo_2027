/* Aula 08 — RSA parte 2: a receita (Gersting, cap. 2.4) */
(function (A) {
  A.lesson({
    id: 'rsa-receita', module: 'd3', num: 8, minutes: 35,
    title: 'RSA parte 2: a receita',
    goals: ['n e φ(n)', 'Chaves e e d', 'Cifrar', 'Decifrar', 'Por que é seguro'],
    body: [
      { h2: '1. A receita em 8 passos' },
      { html: '<p>A teoria de cada passo está na aula 7. Aqui é só seguir a receita, com o exemplo p = 5, q = 3 e mensagem m = 7:</p>' +
        '<table><thead><tr><th>#</th><th>Passo</th><th>Fórmula</th><th>No exemplo</th><th>Quem sabe</th></tr></thead><tbody>' +
        '<tr><td>1</td><td>escolher dois primos</td><td>p, q primos diferentes</td><td>p = 5, q = 3</td><td>segredo</td></tr>' +
        '<tr><td>2</td><td>calcular n</td><td>n = p · q</td><td>15</td><td>público</td></tr>' +
        '<tr><td>3</td><td>calcular φ(n)</td><td>(p − 1)(q − 1)</td><td>4 · 2 = 8</td><td>segredo</td></tr>' +
        '<tr><td>4</td><td>escolher e</td><td>1 &lt; e &lt; φ, mdc(e, φ) = 1</td><td>candidatos 3, 5, 7 → e = 3</td><td>público</td></tr>' +
        '<tr><td>5</td><td>achar d</td><td>(e · d) mod φ = 1</td><td>9 mod 8 = 1 → d = 3</td><td>segredo</td></tr>' +
        '<tr><td>6</td><td>montar as chaves</td><td>pública (e, n), privada (d, n)</td><td>(3, 15) e (3, 15)</td><td>—</td></tr>' +
        '<tr><td>7</td><td>cifrar</td><td>c = m<sup>e</sup> mod n</td><td>7³ mod 15 = 343 mod 15 = 13</td><td>qualquer um</td></tr>' +
        '<tr><td>8</td><td>decifrar</td><td>m = c<sup>d</sup> mod n</td><td>13³ mod 15 = 2197 mod 15 = 7</td><td>só o dono de d</td></tr></tbody></table>' +
        '<p>Mexa em p, q, e e na mensagem e acompanhe a receita inteira:</p>' },
      { widget: 'rsa', opts: { p: 5, q: 3, m: 7 } },
      { tip: '<p>Tente p = 11, q = 13 (n = 143). Repare que a mensagem precisa ser <b>menor que n</b>: o mod n só enxerga restos de 0 a n − 1.</p>' },

      { h2: '2. Passo 4 e 5 em código' },
      { html: '<p>Para escolher <b>e</b>, listamos os candidatos coprimos com φ. Para achar <b>d</b>, testamos d = 1, 2, 3, … até (e · d) mod φ dar 1:</p>' },
      { lab: {
        title: 'Achando a chave privada d',
        params: { e: 3, fi: 8 },
        code: function (P) { return 'e = ' + Math.trunc(P.e) + '\nfi = ' + Math.trunc(P.fi) + '\nd = 1\nwhile (e * d) % fi != 1:\n    d = d + 1\nprint(d)'; },
        gen: function* (P) {
          var e = Math.trunc(P.e), fi = Math.trunc(P.fi);
          var g = function (a, b) { while (b) { var t = a % b; a = b; b = t; } return a; };
          yield { l: 1, v: { e: e } };
          yield { l: 2, v: { e: e, fi: fi } };
          if (fi < 2 || g(e, fi) !== 1) {
            yield { l: 2, v: { e: e, fi: fi }, n: '⚠ mdc(' + e + ', ' + fi + ') = ' + g(e, fi) + ' ≠ 1: esse e <b>não tem</b> d. O laço nunca pararia! Por isso o passo 4 exige e coprimo com φ.' };
            return;
          }
          var d = 1;
          yield { l: 3, v: { e: e, fi: fi, d: d } };
          var it = 0;
          while (true) {
            var r = (e * d) % fi;
            it++;
            yield { l: 4, v: { e: e, fi: fi, d: d }, it: it, c: ['(e * d) % fi != 1', r !== 1], n: '(' + e + ' · ' + d + ') mod ' + fi + ' = ' + (e * d) + ' mod ' + fi + ' = <b>' + r + '</b>' + (r === 1 ? ': achou!' : '.') };
            if (r === 1) break;
            d++;
            yield { l: 5, v: { e: e, fi: fi, d: d }, it: it };
          }
          yield { l: 6, v: { e: e, fi: fi, d: d }, p: String(d), n: 'd = ' + d + '. Com números grandes esse laço demora demais: use <code>pow(e, -1, fi)</code> (Python 3.8+), que usa o Euclides estendido.' };
        }
      } },

      { h2: '3. Receita completa em Python' },
      { code: 'from math import gcd\n\np = 5\nq = 3\n\ndef calcular_n(p, q):\n    return p * q\n\ndef calcular_fi(p, q):\n    return (p - 1) * (q - 1)\n\ndef calcular_candidatos(fi):\n    return [x for x in range(2, fi) if gcd(x, fi) == 1]\n\ndef criptografar(m, e, n):\n    return pow(m, e, n)\n\ndef descriptografar(c, d, n):\n    return pow(c, d, n)\n\nn = calcular_n(p, q)\nfi = calcular_fi(p, q)\ne = calcular_candidatos(fi)[0]\nd = pow(e, -1, fi)\nprint(f"Chave pública {e, n}, Chave privada {d, n}")\n\nm = 7\nc = criptografar(m, e, n)\nprint(c)\nprint(descriptografar(c, d, n))', out: 'Chave pública (3, 15), Chave privada (3, 15)\n13\n7' },
      { tip: '<p>Variações: primos aleatórios com <code>sympy.randprime(100, 1000)</code> (precisa de <code>pip install sympy</code>); e aleatório com <code>random.choice(candidatos)</code>.</p>' },

      { h2: '4. Por que é seguro' },
      { html: '<table><thead><tr><th>Quem</th><th>Sabe</th><th>Consegue decifrar?</th></tr></thead><tbody>' +
        '<tr><td>dono da chave</td><td>d (calculado a partir de p e q)</td><td>sim, na hora</td></tr>' +
        '<tr><td>atacante</td><td>só (e, n)</td><td>precisa <b>fatorar</b> n para achar p, q, φ e d</td></tr></tbody></table>' +
        '<p>Para fatorar basta testar divisores até √n: se n = p · q com p ≤ q, então p · p ≤ n. Para n = 143 é instantâneo:</p>' },
      { code: 'n = 143\np = [x for x in range(2, int(n ** 0.5) + 1) if n % x == 0][0]\nq = n // p\nprint(p, q, pow(7, -1, (p - 1) * (q - 1)))', out: '11 13 103' },
      { html: '<p>A chave privada caiu. Mas o número de candidatos cresce com √n:</p>' +
        '<table><thead><tr><th>Tamanho de n</th><th>Candidatos até √n</th><th>Fatorar</th></tr></thead><tbody>' +
        '<tr><td>3 dígitos (143)</td><td>≈ 10</td><td>instantâneo</td></tr>' +
        '<tr><td>20 dígitos</td><td>≈ 10¹⁰</td><td>minutos</td></tr>' +
        '<tr><td>617 dígitos (RSA-2048)</td><td>≈ 10³⁰⁸</td><td>computacionalmente inviável</td></tr></tbody></table>' },

      { h2: '5. Extra: cifrando texto' },
      { html: '<p>O RSA cifra <b>números</b>. Para texto, trocamos cada letra por um número com um dicionário, e usamos primos maiores (p = 11, q = 13 → n = 143) para que todo código de letra seja menor que n.</p>' },
      { code: "from math import gcd\n\np, q = 11, 13\nn = p * q\nfi = (p - 1) * (q - 1)\ne = [x for x in range(2, fi) if gcd(x, fi) == 1][0]\nd = pow(e, -1, fi)\n\ntabela = {'a': 21, 'b': 22, 'c': 23, 'd': 24, 'e': 25, 'f': 26}\ninversa = {v: k for k, v in tabela.items()}\n\ncifra = [pow(tabela[letra], e, n) for letra in 'cafe']\nprint(cifra)\nvolta = [pow(c, d, n) for c in cifra]\nprint(''.join(inversa[m] for m in volta))", out: '[23, 109, 104, 64]\ncafe' },
      { warn: '<p>Cifrar letra por letra assim é só didático: a mesma letra sempre vira o mesmo número (e o "c", que vale 23, foi cifrado como 23: não mudou nada!). O RSA de verdade usa números enormes e um preenchimento aleatório (padding).</p>' }
    ],
    quiz: [
      { q: 'Com p = 7 e q = 11, quanto vale n?', options: ['18', '60', '77', '4'], answer: 2, explain: 'n = p · q = 77.' },
      { q: 'E quanto vale φ(n) para p = 7, q = 11?', options: ['77', '60', '70', '18'], answer: 1, explain: 'φ = (7 − 1)(11 − 1) = 6 · 10 = 60.' },
      { q: 'Qual destes números <b>pode</b> ser e se φ = 60?', options: ['4', '6', '7', '15'], answer: 2, explain: 'e precisa ser coprimo com 60. mdc(7, 60) = 1; os outros dividem com 60.' },
      { q: 'O que o atacante precisa fazer para quebrar o RSA?', options: ['Descobrir e', 'Fatorar n em p · q', 'Calcular m mod n', 'Nada, é fácil'], answer: 1, explain: 'Com p e q, ele calcula φ e depois d. Fatorar n grande é inviável.' }
    ]
  });
})(window.ALG);
