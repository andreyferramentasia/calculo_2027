/* Aula 09 — Strings */
(function (A) {
  A.lesson({
    id: 'strings', module: 'm3', num: 9, minutes: 20,
    title: 'Strings: texto como sequência',
    goals: ['Índices', 'Fatiamento', 'for em string'],
    body: [
      { html: '<p>Cada caractere tem um <b>índice</b>: começa em <b>0</b>; <code>-1</code> é o último.</p>' },
      { widget: 'slice' },
      { h2: 'Contando vogais' },
      { lab: {
        title: 'Contando vogais',
        params: { palavra: 'algoritmo' },
        viz: 'array',
        code: function (P, r) { return 'palavra = ' + r(String(P.palavra).slice(0, 14)) + '\nvogais = 0\nfor letra in palavra:\n    if letra in "aeiou":\n        vogais += 1\nprint("Vogais:", vogais)'; },
        gen: function* (P) {
          var s = String(P.palavra).slice(0, 14), chars = s.split(''), vogais = 0, letra, ok = [];
          function Z(k) { return { arr: chars, ptr: { letra: k }, hl: k === null ? [] : [k], ok: ok, label: 'palavra' }; }
          yield { l: 1, v: { palavra: s }, viz: Z(null) };
          yield { l: 2, v: { palavra: s, vogais: vogais }, viz: Z(null), n: '<code>vogais</code> é um contador.' };
          for (var k = 0; k < chars.length; k++) {
            letra = chars[k];
            yield { l: 3, v: { palavra: s, vogais: vogais, letra: letra }, it: k + 1, viz: Z(k), n: '<code>letra</code> recebe <b>\'' + A.esc(letra) + '\'</b> (palavra[' + k + ']).' };
            var c = 'aeiou'.indexOf(letra) >= 0 && letra !== '';
            yield { l: 4, v: { palavra: s, vogais: vogais, letra: letra }, it: k + 1, c: ["'" + letra + "' in \"aeiou\"", c], viz: Z(k), n: 'O operador <code>in</code> verifica se o caractere aparece dentro de "aeiou".' };
            if (c) {
              vogais++;
              ok.push(k);
              yield { l: 5, v: { palavra: s, vogais: vogais, letra: letra }, it: k + 1, viz: Z(k), n: 'Vogal! <code>vogais += 1</code> é um atalho para <code>vogais = vogais + 1</code>.' };
            }
          }
          yield { l: 6, v: { palavra: s, vogais: vogais, letra: letra }, viz: Z(null), p: A.print('Vogais:', vogais) };
        }
      } },
      { h2: 'Invertendo pelo índice' },
      { lab: {
        title: 'Invertendo uma string',
        params: { s: 'python' },
        viz: 'array',
        code: function (P, r) { return 's = ' + r(String(P.s).slice(0, 12)) + '\ninvertida = ""\nfor i in range(len(s) - 1, -1, -1):\n    invertida = invertida + s[i]\nprint(invertida)'; },
        gen: function* (P) {
          var s = String(P.s).slice(0, 12), chars = s.split(''), inv = '', ok = [];
          function Z(k) { return { arr: chars, ptr: { i: k }, hl: k === null ? [] : [k], ok: ok, label: 's' }; }
          yield { l: 1, v: { s: s }, viz: Z(null) };
          yield { l: 2, v: { s: s, invertida: inv }, viz: Z(null), n: 'String vazia: o "acumulador" de texto.' };
          var it = 0;
          for (var i = chars.length - 1; i >= 0; i--) {
            it++;
            yield { l: 3, v: { s: s, invertida: inv, i: i }, it: it, viz: Z(i), n: '<code>i = ' + i + '</code>. O range vai de ' + (chars.length - 1) + ' até 0 (o stop -1 não entra).' };
            inv += chars[i];
            ok.push(i);
            yield { l: 4, v: { s: s, invertida: inv, i: i }, it: it, viz: Z(i), n: '<code>s[' + i + ']</code> = \'' + A.esc(chars[i]) + '\' é colado no fim de <code>invertida</code>.' };
          }
          yield { l: 5, v: { s: s, invertida: inv, i: 0 }, viz: Z(null), p: inv, n: 'Pronto! (Atalho do Python: <code>s[::-1]</code>.)' };
        }
      } },
      { h2: 'Métodos úteis' },
      { code: 's = "Cálculo Diferencial"\nprint(len(s))              # tamanho\nprint(s.upper())            # MAIÚSCULAS\nprint(s.lower())            # minúsculas\nprint(s.replace("a", "@"))  # substitui\nprint(s.split())            # quebra em lista de palavras\nprint("Cálculo" in s)       # contém?\nprint(s.count("l"))         # conta ocorrências', out: "19\nCÁLCULO DIFERENCIAL\ncálculo diferencial\nCálculo Diferenci@l\n['Cálculo', 'Diferencial']\nTrue\n3" },
      { warn: '<p>Strings são <b>imutáveis</b>: <code>s[0] = "X"</code> dá erro.</p>' }
    ],
    quiz: [
      { q: 'Se <code>s = "PYTHON"</code>, quanto vale <code>s[1]</code>?', options: ['P', 'Y', 'T', 'Erro'], answer: 1, explain: 'Índices começam em 0: s[0] = P, s[1] = Y.' },
      { q: 'E <code>s[-2]</code>?', options: ['H', 'O', 'N', 'Y'], answer: 1, explain: '-1 = N, -2 = O.' },
      { q: 'Quanto vale <code>"banana"[1:4]</code>?', options: ['ban', 'ana', 'anan', 'nan'], answer: 1, explain: 'Índices 1, 2, 3 (o 4 não entra): a, n, a.' },
      { q: 'O que imprime?', code: 'c = 0\nfor ch in "arara":\n    if ch == "a":\n        c += 1\nprint(c)', options: ['2', '3', '5', '0'], answer: 1 }
    ]
  });
})(window.ALG);
