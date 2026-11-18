/* Aula 05 — Estruturas condicionais */
(function (A) {
  A.lesson({
    id: 'condicionais', module: 'm2', num: 5, minutes: 20,
    title: 'Decisões: if, elif, else',
    goals: ['if', 'elif', 'else', 'Indentação'],
    body: [
      { code: 'if condicao:\n    # roda se True\nelif outra:\n    # roda se a anterior foi False e esta True\nelse:\n    # roda se nenhuma foi True', playground: false },
      { warn: '<p>Não esqueça os <b>dois-pontos</b> <code>:</code> e os <b>4 espaços</b> de indentação.</p>' },
      { h2: 'Veja o desvio' },
      { html: '<p>Mude a <code>nota</code> (tente 8, 5 e 2):</p>' },
      { lab: {
        title: 'Classificando uma nota',
        params: { nota: 6.5 },
        viz: 'branch',
        code: function (P, r) { return 'nota = ' + r(P.nota) + '\nif nota >= 7:\n    print("Aprovado")\nelif nota >= 4:\n    print("Recuperação")\nelse:\n    print("Reprovado")\nprint("Fim")'; },
        gen: function* (P) {
          var nota = P.nota;
          var V = { nota: Number.isInteger(nota) ? nota : A.F(nota) };
          var rows = [
            { k: 'if', e: 'nota >= 7', b: '"Aprovado"', val: null, run: false },
            { k: 'elif', e: 'nota >= 4', b: '"Recuperação"', val: null, run: false },
            { k: 'else', e: '', b: '"Reprovado"', val: null, run: false }
          ];
          function B() { return { rows: rows }; }
          yield { l: 1, v: V, viz: B() };
          var c1 = nota >= 7;
          rows[0].val = c1;
          yield { l: 2, v: V, c: ['nota >= 7', c1], viz: B(), n: c1 ? A.repr(nota) + ' >= 7 é <b>True</b> → entra no bloco do <code>if</code>.' : A.repr(nota) + ' >= 7 é <b>False</b> → <b>pula</b> o bloco e vai testar o próximo caso.' };
          if (c1) {
            rows[0].run = true;
            yield { l: 3, v: V, viz: B(), p: 'Aprovado', n: 'Executou o bloco do if. Os casos <code>elif</code> e <code>else</code> serão <b>ignorados</b>, nem chegam a ser testados.' };
          } else {
            var c2 = nota >= 4;
            rows[1].val = c2;
            yield { l: 4, v: V, c: ['nota >= 4', c2], viz: B(), n: c2 ? 'Agora sim: ' + A.repr(nota) + ' >= 4 é <b>True</b>.' : 'Também <b>False</b>. Sobrou o <code>else</code>.' };
            if (c2) {
              rows[1].run = true;
              yield { l: 5, v: V, viz: B(), p: 'Recuperação' };
            } else {
              rows[2].val = true;
              yield { l: 6, v: V, viz: B(), n: 'O <code>else</code> não tem condição: ele pega <b>tudo o que sobrou</b>.' };
              rows[2].run = true;
              yield { l: 7, v: V, viz: B(), p: 'Reprovado' };
            }
          }
          yield { l: 8, v: V, viz: B(), p: 'Fim', n: 'Esta linha está <b>fora</b> do if (sem indentação), então roda sempre.' };
        }
      } },
      { h2: 'Condições compostas' },
      { html: '<p><b>Ano bissexto</b>: ÷4 e não ÷100, <em>ou</em> ÷400.</p>' },
      { lab: {
        title: 'Ano bissexto',
        params: { ano: 2024 },
        viz: 'branch',
        code: function (P, r) { return 'ano = ' + r(Math.trunc(P.ano)) + '\nif (ano % 4 == 0 and ano % 100 != 0) or ano % 400 == 0:\n    print(ano, "é bissexto")\nelse:\n    print(ano, "não é bissexto")'; },
        gen: function* (P) {
          var ano = Math.trunc(P.ano);
          var a = ano % 4 === 0, b = ano % 100 !== 0, c = ano % 400 === 0;
          var res = (a && b) || c;
          var rows = [
            { k: 'if', e: '(÷4 and não ÷100) or ÷400', b: 'bissexto', val: null },
            { k: 'else', e: '', b: 'não bissexto', val: null }
          ];
          yield { l: 1, v: { ano: ano }, viz: { rows: rows } };
          rows[0].val = res;
          yield {
            l: 2, v: { ano: ano }, c: ['condição', res], viz: { rows: rows },
            n: '<code>ano % 4 == 0</code> → ' + (a ? 'True' : 'False') + ' &nbsp;·&nbsp; <code>ano % 100 != 0</code> → ' + (b ? 'True' : 'False') +
              ' &nbsp;·&nbsp; <code>ano % 400 == 0</code> → ' + (c ? 'True' : 'False') + '<br>(' + (a ? 'True' : 'False') + ' and ' + (b ? 'True' : 'False') + ') or ' + (c ? 'True' : 'False') + ' = <b>' + (res ? 'True' : 'False') + '</b>'
          };
          if (res) { rows[0].run = true; yield { l: 3, v: { ano: ano }, viz: { rows: rows }, p: ano + ' é bissexto' }; }
          else {
            rows[1].val = true;
            yield { l: 4, v: { ano: ano }, viz: { rows: rows } };
            rows[1].run = true;
            yield { l: 5, v: { ano: ano }, viz: { rows: rows }, p: ano + ' não é bissexto' };
          }
        }
      } },
      { tip: '<p>Teste 1900 e 2000.</p>' },
      { h2: 'if sem else e ifs aninhados' },
      { code: 'x = -4\nif x < 0:\n    x = -x          # valor absoluto\nprint(x)\n\nidade = 20\ntem_carteira = True\nif idade >= 18:\n    if tem_carteira:\n        print("Pode dirigir")\n    else:\n        print("Precisa tirar a carteira")', out: '4\nPode dirigir' },
    ],
    quiz: [
      { q: 'O que imprime?', code: 'x = 10\nif x > 5:\n    print("A")\nelif x > 8:\n    print("B")\nelse:\n    print("C")', options: ['A', 'B', 'A e B', 'C'], answer: 0, explain: 'A primeira condição verdadeira vence; os elif seguintes nem são testados.' },
      { q: 'O que imprime?', code: 'n = 7\nif n % 2 == 0:\n    print("par")\nprint("fim")', options: ['par e fim', 'fim', 'par', 'nada'], answer: 1, explain: '7 é ímpar, o bloco é pulado; print("fim") está fora do if.' },
      { q: 'Qual condição testa se x está entre 1 e 10 (inclusive)?', options: ['x >= 1 or x <= 10', '1 <= x <= 10', 'x > 1 and x < 10', 'x == 1 to 10'], answer: 1, explain: 'Python permite encadear: 1 <= x <= 10 equivale a (1 <= x and x <= 10).' },
      { q: 'O que falta no código <code>if x > 0 print(x)</code>?', options: ['Parênteses', 'Os dois-pontos e a indentação', 'A palavra then', 'Nada'], answer: 1 }
    ]
  });
})(window.ALG);
