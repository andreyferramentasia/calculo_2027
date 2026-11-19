/* Aula 03 — Quantificadores, predicados e validade (Gersting, cap. 1.3) */
(function (A) {
  A.lesson({
    id: 'quantificadores', module: 'd1', num: 3, minutes: 30,
    title: 'Quantificadores e predicados',
    goals: ['Predicado P(x)', '∀ e ∃', 'Domínio', 'Simbolização', 'Negação', 'Validade'],
    body: [
      { h2: '1. Predicado' },
      { html: '<p>No português, em "João está cansado" o <b>predicado</b> é "está cansado", aquilo que se declara sobre o sujeito. Na matemática, o sujeito vira uma variável <b>x</b> e o predicado vira <b>P(x)</b>: "x está cansado".</p>' +
        '<p>Sozinho, P(x) <b>não tem valor lógico</b>: depende de quem é x. Ele só vira proposição quando x recebe um valor, ou quando é amarrado por um quantificador.</p>' +
        '<table><thead><tr><th>Expressão</th><th>Tipo</th><th>Valor lógico</th></tr></thead><tbody>' +
        '<tr><td>P(x): "x é par"</td><td>predicado</td><td>indefinido</td></tr>' +
        '<tr><td>P(4)</td><td>proposição</td><td>V</td></tr>' +
        '<tr><td>P(5)</td><td>proposição</td><td>F</td></tr></tbody></table>' },
      { code: 'def P(x):          # o predicado vira uma função que devolve bool\n    return x % 2 == 0\n\nprint(P(4), P(5))', out: 'True False' },

      { h2: '2. Quantificador universal e existencial' },
      { html: '<div class="ideias">' +
        '<div class="ideia"><h4><code>(∀x)P(x)</code> Universal <small>"para todo x"</small></h4><p>Vale para <b>cada</b> elemento, sem exceção. Chamada da turma: basta <b>um</b> aluno faltando para "todos vieram" virar F.</p><p class="resumo">Python: <code>all(P(x) for x in dominio)</code></p></div>' +
        '<div class="ideia"><h4><code>(∃x)P(x)</code> Existencial <small>"existe x"</small></h4><p>Basta <b>um</b> elemento cumprir. Estacionamento: não precisa que todas as vagas estejam livres, só achar uma.</p><p class="resumo">Python: <code>any(P(x) for x in dominio)</code></p></div>' +
        '</div>' +
        '<p>O <b>domínio</b> muda o resultado, mesmo com o mesmo predicado:</p>' +
        '<table><thead><tr><th>Domínio</th><th>(∀x)(x &gt; 0)</th></tr></thead><tbody><tr><td>inteiros positivos</td><td>V</td></tr><tr><td>todos os inteiros</td><td>F (x = −1)</td></tr></tbody></table>' },
      { lab: {
        title: 'all() e any() percorrendo o domínio',
        params: { dominio: [2, 4, 7, 8] },
        viz: 'array',
        code: function (P) { return 'dominio = ' + A.repr(P.dominio.filter(function (x) { return typeof x === 'number'; })) + '\ndef P(x):\n    return x % 2 == 0\n\nprint("∀:", all(P(x) for x in dominio))\nprint("∃:", any(P(x) for x in dominio))'; },
        gen: function* (P) {
          var d = P.dominio.filter(function (x) { return typeof x === 'number'; }).map(Math.trunc);
          if (!d.length) d = [1];
          var ok = [], bad = [];
          function Z(k) { return { arr: d, ptr: k === null ? {} : { x: k }, hl: k === null ? [] : [k], ok: ok, bad: bad, label: 'dominio' }; }
          var V = { dominio: d };
          yield { l: 1, v: V, viz: Z(null) };
          yield { l: 2, v: V, viz: Z(null), n: 'P(x): "x é par".' };
          var todos = true;
          for (var k = 0; k < d.length; k++) {
            var p = d[k] % 2 === 0;
            (p ? ok : bad).push(k);
            yield { l: 5, v: Object.assign({ x: d[k] }, V), viz: Z(k), c: ['P(' + d[k] + ')', p], n: p ? 'Cumpre. O <code>all</code> continua procurando um que falhe…' : '<b>Falhou!</b> O <code>all</code> já sabe a resposta: False. Ele para aqui.' };
            if (!p) { todos = false; break; }
          }
          yield { l: 5, v: V, viz: Z(null), p: '∀: ' + (todos ? 'True' : 'False') };
          ok.length = 0; bad.length = 0;
          var existe = false;
          for (k = 0; k < d.length; k++) {
            var q = d[k] % 2 === 0;
            (q ? ok : bad).push(k);
            yield { l: 6, v: Object.assign({ x: d[k] }, V), viz: Z(k), c: ['P(' + d[k] + ')', q], n: q ? '<b>Achou um!</b> O <code>any</code> já sabe a resposta: True. Ele para aqui.' : 'Não cumpre. O <code>any</code> continua procurando um que cumpra…' };
            if (q) { existe = true; break; }
          }
          yield { l: 6, v: V, viz: Z(null), p: '∃: ' + (existe ? 'True' : 'False'), n: 'O <code>all</code> para no primeiro que <b>falha</b>; o <code>any</code> para no primeiro que <b>cumpre</b>.' };
        }
      } },
      { tip: '<p>Todo domínio precisa ter pelo menos um elemento. Curiosidade: no Python, <code>all([])</code> é True e <code>any([])</code> é False.</p>' },

      { h2: '3. Interpretação, escopo e variável livre' },
      { html: '<p><b>Fbf</b> (fórmula bem-formulada) é uma expressão escrita com predicados, quantificadores e conectivos usados corretamente. Para ter valor lógico, ela precisa de uma <b>interpretação</b>: um <b>domínio</b> (não vazio), o <b>significado</b> de cada predicado e o <b>valor</b> de cada constante.</p>' +
        '<p>Exemplo: domínio = livros da biblioteca; P(x) = "x tem capa vermelha". Então (∃x)P(x) é V se houver pelo menos um livro de capa vermelha.</p>' +
        '<p>O <b>escopo</b> de um quantificador é a parte da fórmula onde ele age. Pergunta para decidir: existe um ∀ ou ∃ que alcança essa variável? Sim → variável <b>presa</b>. Não → variável <b>livre</b> (sem valor fixo até alguém dizer quem ela é).</p>' +
        '<p class="formula">(∀x)[Q(x, <span style="color:var(--bad)">y</span>) → (∃y)R(x, <span style="color:var(--ok)">y</span>)]</p>' +
        '<p>O <span style="color:var(--bad);font-weight:800">y</span> em Q(x, y) é livre: nenhum ∀y ou ∃y o alcança. O <span style="color:var(--ok);font-weight:800">y</span> em R(x, y) está preso pelo (∃y).</p>' },

      { h2: '4. Simbolização' },
      { html: '<table><thead><tr><th>Palavras-chave</th><th>Quantificador</th><th>Conectivo comum</th></tr></thead><tbody>' +
        '<tr><td>"todo", "para todo", "cada", "qualquer"</td><td>∀</td><td>→</td></tr>' +
        '<tr><td>"existe", "algum", "há pelo menos um"</td><td>∃</td><td>∧</td></tr></tbody></table>' +
        '<p>Com A(x): "x é aluno" e D(x): "x é dedicado":</p>' +
        '<table><thead><tr><th>Frase</th><th>Fbf</th></tr></thead><tbody>' +
        '<tr><td>"Todo aluno é dedicado."</td><td><code>(∀x)[A(x) → D(x)]</code></td></tr>' +
        '<tr><td>"Algum aluno é dedicado."</td><td><code>(∃x)[A(x) ∧ D(x)]</code></td></tr></tbody></table>' },
      { warn: '<p><b>O truque de "só", "somente" e "apenas":</b> o que vem depois dessas palavras vira a <b>conclusão</b> do condicional. "Só professores corrigem provas" → <code>(∀x)[C(x) → P(x)]</code>, com C(x) "x corrige provas" e P(x) "x é professor". A promessa só é quebrada por alguém que corrige provas <b>sem</b> ser professor.</p>' },
      { html: '<p>Por que não <code>(∀x)[P(x) → C(x)]</code>? Essa diria "todo professor corrige provas", que é outra frase. Veja quem quebra cada promessa:</p>' +
        A.ttHtml(['corrige?', 'professor?', 'C(x) → P(x)', 'P(x) → C(x)'], [['V', 'V', 'V', 'V'], ['V', 'F', 'F', 'V'], ['F', 'V', 'V', 'F'], ['F', 'F', 'V', 'V']], { res: 2 }) +
        '<p>Na coluna destacada, o único F é "corrige sem ser professor": exatamente o que "só professores corrigem provas" proíbe.</p>' },

      { h2: '5. Negando quantificadores' },
      { html: '<p>Igual a De Morgan (que troca ∧ por ∨), negar um quantificador <b>troca ∀ por ∃</b> e nega o predicado:</p>' +
        '<table><thead><tr><th>Fórmula</th><th>Negação equivalente</th></tr></thead><tbody>' +
        '<tr><td>(∀x)P(x)</td><td>(∃x)[P(x)]′</td></tr><tr><td>(∃x)P(x)</td><td>(∀x)[P(x)]′</td></tr></tbody></table>' +
        '<p>Negar "todos os convidados chegaram" <b>não</b> é "nenhum chegou": é "existe um convidado que não chegou".</p>' },
      { code: 'dominio = [1, 2, 3, 4, 5]\ndef eh_par(x):\n    return x % 2 == 0\n\nlista = [eh_par(x) for x in dominio]\nlista_neg = [not eh_par(x) for x in dominio]\nprint(lista)\nprint(lista_neg)\n# negar (∀x)P(x) é o mesmo que (∃x)[P(x)]′\nprint((not all(lista)) == any(lista_neg))', out: '[False, True, False, True, False]\n[True, False, True, False, True]\nTrue' },

      { h2: '6. Validade' },
      { html: '<p>É o "irmão" da tautologia para fórmulas com predicados: uma fbf é <b>válida</b> se for V em <b>todas</b> as interpretações possíveis.</p>' +
        '<table><thead><tr><th>Aspecto</th><th>Tautologia</th><th>Validade</th></tr></thead><tbody>' +
        '<tr><td>"sempre V" em…</td><td>todas as linhas da tabela</td><td>todas as interpretações</td></tr>' +
        '<tr><td>quantos casos</td><td>2ⁿ (finito)</td><td>infinitos</td></tr>' +
        '<tr><td>existe algoritmo?</td><td>sim</td><td>não</td></tr></tbody></table>' +
        '<p><b>Válida:</b> (∀x)P(x) → (∃x)P(x). Como o domínio nunca é vazio, "vale para todos" garante "vale para algum".</p>' +
        '<p><b>Não válida:</b> (∃x)P(x) → (∀x)P(x). Um contraexemplo derruba:</p>' },
      { code: 'dominio = [1, 2, 3, 4]\ndef P(x):\n    return x % 2 == 0\n\nexiste_par = any(P(x) for x in dominio)\ntodos_pares = all(P(x) for x in dominio)\n# o condicional falha quando a hipótese é V e a conclusão é F\nprint(existe_par, todos_pares)', out: 'True False' },
      { tip: '<p>Código pode <b>derrubar</b> uma fbf (achar uma interpretação em que ela falha), mas nunca <b>provar</b> que ela é válida: seria preciso testar infinitas interpretações.</p>' }
    ],
    quiz: [
      { q: 'P(x): "x > 3". Qual é uma proposição?', options: ['P(x)', 'P(5)', 'x > 3', 'P'], answer: 1, explain: 'P(5) tem valor definido (V). P(x) sozinho depende de x.' },
      { q: 'Simbolize "Algum gato é preto" com G(x) e P(x):', options: ['(∀x)[G(x) → P(x)]', '(∃x)[G(x) → P(x)]', '(∃x)[G(x) ∧ P(x)]', '(∀x)[G(x) ∧ P(x)]'], answer: 2, explain: '"Algum" pede ∃, e o ∃ costuma vir com ∧.' },
      { q: 'A negação de "todo aluno passou" é:', options: ['"Nenhum aluno passou"', '"Algum aluno não passou"', '"Todo aluno não passou"', '"Algum aluno passou"'], answer: 1, explain: '[(∀x)P(x)]′ ⇔ (∃x)[P(x)]′.' },
      { q: 'O que imprime <code>all(x > 0 for x in [3, -1, 5])</code>?', options: ['True', 'False', '[True, False, True]', 'Erro'], answer: 1, explain: '-1 não é > 0: basta um falhar para o "para todo" ser False.' }
    ]
  });
})(window.ALG);
