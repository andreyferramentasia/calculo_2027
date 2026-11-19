/* Aula 02 — Técnicas de demonstração (Gersting, cap. 2.1) */
(function (A) {
  A.lesson({
    id: 'demonstracao', module: 'd1', num: 2, minutes: 30,
    title: 'Técnicas de demonstração',
    goals: ['Contraexemplo', 'Exaustão', 'Prova direta', 'Contraposição', 'Absurdo'],
    body: [
      { h2: '1. Conjectura, contraexemplo e prova' },
      { html: '<p>Uma <b>conjectura</b> é uma afirmação P → Q que ainda não sabemos se é verdadeira. Alguns casos que funcionam (raciocínio <b>indutivo</b>) não provam nada. Só duas coisas decidem: um <b>contraexemplo</b> (derruba) ou uma <b>demonstração</b> completa (raciocínio <b>dedutivo</b>, confirma).</p>' +
        '<p>Dia a dia: conhecer três pessoas simpáticas de uma cidade não prova que "todo mundo lá é simpático". <b>Uma</b> pessoa mal-educada já derruba a afirmação.</p>' +
        '<p>Conjectura: "para todo inteiro positivo n, n! ≤ n²". Mude o <code>limite</code> e veja até onde ela resiste:</p>' },
      { lab: {
        title: 'Procurando um contraexemplo',
        params: { limite: 6 },
        viz: 'array',
        code: function (P) {
          var L = Math.max(2, Math.min(8, Math.trunc(P.limite)));
          return 'def fatorial(n):\n    resultado = 1\n    for i in range(1, n + 1):\n        resultado *= i\n    return resultado\n\nfor n in range(1, ' + (L + 1) + '):\n    if fatorial(n) > n ** 2:\n        print("contraexemplo:", n)\n        break\n    print(n, "ok")';
        },
        gen: function* (P) {
          var L = Math.max(2, Math.min(8, Math.trunc(P.limite)));
          var ns = [], ok = [], bad = [];
          for (var i = 1; i <= L; i++) ns.push(i);
          function Z(k) { return { arr: ns, ptr: k === null ? {} : { n: k }, hl: k === null ? [] : [k], ok: ok, bad: bad, label: 'n' }; }
          function fat(n) { var r = 1; for (var i = 1; i <= n; i++) r *= i; return r; }
          yield { l: 1, v: {}, viz: Z(null), n: 'Define a função <code>fatorial</code> (o corpo ainda não roda).' };
          for (var k = 0; k < L; k++) {
            var n = k + 1, f = fat(n);
            yield { l: 7, v: { n: n }, it: n, viz: Z(k), n: 'Testando n = ' + n + '.' };
            var falha = f > n * n;
            yield { l: 8, v: { n: n }, it: n, viz: Z(k), c: ['fatorial(' + n + ') > ' + n + ' ** 2', falha], n: n + '! = ' + f + ' e ' + n + '² = ' + (n * n) + '.' };
            if (falha) {
              bad.push(k);
              yield { l: 9, v: { n: n }, it: n, viz: Z(k), p: 'contraexemplo: ' + n, n: '<b>Achou!</b> ' + f + ' > ' + (n * n) + '. Um único contraexemplo derruba a conjectura inteira.' };
              yield { l: 10, v: { n: n }, viz: Z(null), n: '<code>break</code>: não precisa testar mais nada.' };
              return;
            }
            ok.push(k);
            yield { l: 11, v: { n: n }, it: n, viz: Z(k), p: n + ' ok' };
          }
          yield { l: 11, v: {}, viz: Z(null), n: 'Até ' + L + ' não apareceu contraexemplo, mas isso <b>não prova</b> nada: aumente o limite.' };
        }
      } },

      { h2: '2. Demonstração por exaustão' },
      { html: '<p><b>Ideia:</b> com um número <b>finito</b> de casos, teste todos. É conferir a lista de chamada de uma turma pequena, aluno por aluno.</p>' +
        '<p>"Se um inteiro entre 1 e 20 for divisível por 6, também é divisível por 3." São só 20 casos:</p>' },
      { code: 'for n in range(1, 21):\n    if n % 6 == 0:\n        print(n, "é divisível por 6 e por 3:", n % 3 == 0)', out: '6 é divisível por 6 e por 3: True\n12 é divisível por 6 e por 3: True\n18 é divisível por 6 e por 3: True' },
      { tip: '<p>Variante: <b>demonstração por casos</b>. Quebre a hipótese em poucas partes que cobrem tudo (ex.: "x par" ou "x ímpar") e prove cada parte.</p>' },

      { h2: '3. Demonstração direta' },
      { html: '<p><b>Ideia:</b> suponha P e deduza Q passo a passo. É a primeira técnica a tentar: um fato leva ao outro sem pular etapas.</p><p>Exemplo: <b>a soma de dois inteiros pares é par.</b></p>' +
        '<details class="demo"><summary>Ver demonstração</summary><div>' +
        '<p>x par → x = 2m &nbsp;&nbsp; y par → y = 2n</p><p>x + y = 2m + 2n = 2(m + n)</p><p>x + y = 2k, com k = m + n inteiro</p><p class="fim">Logo, x + y é par. ∎</p></div></details>' },
      { code: 'def eh_par(n):\n    return n % 2 == 0\n\ndef verificar(n, m):\n    if eh_par(n) and eh_par(m):\n        print(n + m, eh_par(n + m))\n    else:\n        print("algum dos números não é par")\n\nverificar(4, 6)\nverificar(3, 6)', out: '10 True\nalgum dos números não é par' },
      { warn: '<p>O código só <b>testa exemplos</b>; quem prova para <b>todos</b> os pares é a álgebra acima. Código ajuda a achar contraexemplos e a ganhar confiança.</p>' },

      { h2: '4. Demonstração por contraposição' },
      { html: '<p><b>Ideia:</b> em vez de P → Q, prove <b>Q′ → P′</b> (são equivalentes). Use quando negar a conclusão dá mais informação que a hipótese.</p><p>Exemplo: <b>se n² é ímpar, então n é ímpar.</b></p>' +
        '<details class="demo"><summary>Ver demonstração</summary><div>' +
        '<p>Contrapositiva: n par → n² par</p><p>n = 2m</p><p>n² = (2m)² = 4m² = 2(2m²)</p><p class="fim">Logo, n² é par, e a conjectura original vale. ∎</p></div></details>' +
        A.ttHtml(['A', 'B', 'A → B', 'B′ → A′ (contrapositiva)', 'B → A (recíproca)'], [['V', 'V', 'V', 'V', 'V'], ['V', 'F', 'F', 'F', 'V'], ['F', 'V', 'V', 'V', 'F'], ['F', 'F', 'V', 'V', 'V']], { res: 3 }) },
      { warn: '<p>Não confunda com a <b>recíproca</b> B → A, que pode ser falsa: "a > 5 → a > 2" é verdadeira, mas "a > 2 → a > 5" é falsa (a = 3). Veja na tabela: a contrapositiva bate com A → B em todas as linhas; a recíproca não.</p>' },

      { h2: '5. Demonstração por absurdo' },
      { html: '<p><b>Ideia:</b> suponha P <b>e</b> Q′ juntos e chegue numa contradição. Ótima para provar que algo <b>não existe</b>. É o álibi: "se eu estivesse na festa, alguém teria me visto; ninguém viu; logo eu não estava lá."</p>' +
        '<details class="demo"><summary>Ver demonstração: não dá para estar na água e pegando fogo ao mesmo tempo</summary><div>' +
        '<p>Suponha P: "estar na água" e Q′: "estar pegando fogo", os dois ao mesmo tempo.</p><p>água apaga fogo → as duas coisas não podem valer juntas</p><p class="fim">Contradição! Logo, a suposição é falsa. ∎</p></div></details>' },
      { code: 'esta_na_agua = True\nesta_pegando_fogo = False\ncontradicao = esta_na_agua and esta_pegando_fogo\nif contradicao:\n    print("Contradição!")\nelse:\n    print("É possível")', out: 'É possível' },

      { h2: '6. Resumo das técnicas' },
      { html: '<table><thead><tr><th>Técnica</th><th>Você supõe</th><th>Quando usar</th></tr></thead><tbody>' +
        '<tr><td><b>Exaustão</b></td><td>nada: testa cada caso</td><td>número finito (e pequeno) de casos</td></tr>' +
        '<tr><td><b>Direta</b></td><td>P, deduz Q</td><td>abordagem padrão, a primeira a tentar</td></tr>' +
        '<tr><td><b>Contraposição</b></td><td>Q′, deduz P′</td><td>Q′ dá mais informação que P</td></tr>' +
        '<tr><td><b>Absurdo</b></td><td>P e Q′, deduz contradição</td><td>provar que algo não existe</td></tr>' +
        '</tbody></table>' }
    ],
    quiz: [
      { q: 'Testei a conjectura para n = 1, 2, …, 1000 e funcionou. Ela está provada?', options: ['Sim, 1000 casos é muito', 'Não, só uma demonstração para todo n prova', 'Sim, se for um código Python', 'Depende do computador'], answer: 1, explain: 'Exemplos que funcionam não provam. Só uma demonstração (ou, se forem finitos casos, testar todos) prova.' },
      { q: 'A contrapositiva de "se chove, então a rua molha" é:', options: ['"Se a rua molha, então chove"', '"Se não chove, a rua não molha"', '"Se a rua não molha, então não choveu"', '"Chove e a rua não molha"'], answer: 2, explain: 'Contrapositiva de A → B é B′ → A′. A opção 1 é a recíproca; a 2 é a inversa.' },
      { q: 'Qual técnica supõe a hipótese e a negação da conclusão ao mesmo tempo?', options: ['Exaustão', 'Direta', 'Contraposição', 'Absurdo'], answer: 3, explain: 'No absurdo, supõe-se P e Q′ e busca-se uma contradição.' },
      { q: 'Para refutar "todo número primo é ímpar" basta:', options: ['Uma demonstração por indução', 'Um contraexemplo: 2', 'Testar os 100 primeiros primos', 'Nada, ela é verdadeira'], answer: 1, explain: '2 é primo e par: um único contraexemplo derruba a afirmação.' }
    ]
  });
})(window.ALG);
