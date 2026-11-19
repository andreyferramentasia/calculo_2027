/* Aula 04 — Entrada e saída */
(function (A) {
  var F = A.F;
  A.lesson({
    id: 'entrada-saida', module: 'm1', num: 4, minutes: 15,
    title: 'Entrada e saída de dados',
    goals: ['input()', 'Conversão', 'f-strings'],
    body: [
      { html: '<p><code>input()</code> espera o usuário digitar e devolve <b>sempre texto (str)</b>. Os valores "digitados" ficam nos campos do topo do lab.</p>' },
      { lab: {
        title: 'Calculando a média',
        params: { nome: 'Ana', nota1: 7.5, nota2: 8 },
        code: 'nome = input("Seu nome: ")\nnota1 = float(input("Nota 1: "))\nnota2 = float(input("Nota 2: "))\nmedia = (nota1 + nota2) / 2\nprint(f"{nome}, sua média é {media:.2f}")',
        gen: function* (P) {
          var nome, nota1, nota2, media;
          function V() { return { nome: nome, nota1: nota1 === undefined ? undefined : F(nota1), nota2: nota2 === undefined ? undefined : F(nota2), media: media === undefined ? undefined : F(media) }; }
          nome = String(P.nome);
          yield { l: 1, v: V(), p: 'Seu nome: ', inp: nome, n: 'O programa mostra a mensagem e <b>espera</b>. O usuário digitou <b>' + A.esc(nome) + '</b> e o texto foi guardado em <code>nome</code>.' };
          nota1 = +P.nota1;
          yield { l: 2, v: V(), p: 'Nota 1: ', inp: String(P.nota1), n: 'Lido de dentro para fora: <code>input()</code> devolve o <b>texto</b> <code>\'' + P.nota1 + '\'</code>, e <code>float()</code> converte para o <b>número</b> ' + A.fmtFloat(nota1) + '.' };
          nota2 = +P.nota2;
          yield { l: 3, v: V(), p: 'Nota 2: ', inp: String(P.nota2), n: 'Mesma coisa para a segunda nota.' };
          media = (nota1 + nota2) / 2;
          yield { l: 4, v: V(), n: '(' + A.fmtFloat(nota1) + ' + ' + A.fmtFloat(nota2) + ') / 2 = <b>' + A.fmtFloat(media) + '</b>. Os parênteses garantem que a soma acontece antes da divisão.' };
          yield { l: 5, v: V(), p: nome + ', sua média é ' + media.toFixed(2), n: 'Na <b>f-string</b> (repare no <code>f</code> antes das aspas), o que está entre <code>{ }</code> é substituído pelo valor. <code>:.2f</code> formata com 2 casas decimais.' };
        }
      } },
      { h2: 'A armadilha: texto + texto' },
      { lab: {
        title: 'Texto + texto ≠ soma',
        params: { a: '5', b: '3' },
        code: 'a = input("Número: ")\nb = input("Outro: ")\nprint(a + b)\nprint(int(a) + int(b))',
        gen: function* (P) {
          var a = String(P.a), b;
          yield { l: 1, v: { a: a }, p: 'Número: ', inp: a, n: 'Repare na etiqueta: <code>a</code> é <b>str</b>, não int.' };
          b = String(P.b);
          yield { l: 2, v: { a: a, b: b }, p: 'Outro: ', inp: b };
          yield { l: 3, v: { a: a, b: b }, p: a + b, n: '<code>\'' + A.esc(a) + '\' + \'' + A.esc(b) + '\'</code> junta os textos: <b>' + A.esc(a + b) + '</b>. Isso se chama <b>concatenação</b>.' };
          if (!/^\s*[+-]?\d+\s*$/.test(a) || !/^\s*[+-]?\d+\s*$/.test(b)) {
            var bad = /^\s*[+-]?\d+\s*$/.test(a) ? b : a;
            yield { l: 4, v: { a: a, b: b }, p: "ValueError: invalid literal for int() with base 10: '" + bad + "'", n: '<b style="color:var(--bad)">Erro!</b> <code>int()</code> só converte textos que representam inteiros. O programa para aqui.' };
            return;
          }
          yield { l: 4, v: { a: a, b: b }, p: String(parseInt(a, 10) + parseInt(b, 10)), n: 'Agora sim: <code>int()</code> converte cada texto para número e o <code>+</code> soma.' };
        }
      } },
      { h2: 'Formatando a saída' },
      { widget: 'fstring' },
      { code: 'print("a", "b", "c", sep="-")\nprint("sem quebra", end=" | ")\nprint("fim")', out: 'a-b-c\nsem quebra | fim' }
    ],
    quiz: [
      { q: 'Qual é o tipo do valor devolvido por <code>input()</code>?', options: ['int', 'float', 'str', 'depende do que o usuário digitar'], answer: 2, explain: 'Sempre str. Você precisa converter com int() ou float().' },
      { q: 'O usuário digita 4 e depois 6. O que aparece?', code: 'x = input()\ny = input()\nprint(x + y)', options: ['10', '46', 'x + y', 'Erro'], answer: 1, explain: 'São textos: "4" + "6" = "46".' },
      { q: 'O que imprime?', code: 'v = 3.14159\nprint(f"{v:.2f}")', options: ['3.14159', '3.14', '3.1', '{v:.2f}'], answer: 1 },
      { q: 'Como ler um número real do teclado?', options: ['x = input(float)', 'x = float(input())', 'x = real(input())', 'x = input().float'], answer: 1 }
    ]
  });
})(window.ALG);
