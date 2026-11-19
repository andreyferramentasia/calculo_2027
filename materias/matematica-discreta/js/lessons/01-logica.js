/* Aula 01 — Lógica proposicional (Gersting, cap. 1.1) */
(function (A) {
  var tt = A.ttHtml;
  function ideia(sim, nome, leitura, txt, resumo, tab) {
    return '<div class="ideia"><h4><code>' + sim + '</code> ' + nome + ' <small>' + leitura + '</small></h4><p>' + txt + '</p>' + tab + '<p class="resumo">' + resumo + '</p></div>';
  }

  A.lesson({
    id: 'logica', module: 'd1', num: 1, minutes: 30,
    title: 'Lógica proposicional',
    goals: ['Proposição', 'Conectivos', 'Tabela-verdade', 'De Morgan', 'Tautologia'],
    body: [
      { h2: '1. Proposição' },
      { html: '<p>Uma <b>proposição</b> é uma frase declarativa com <b>um único</b> valor lógico: verdadeira (V) ou falsa (F). Nunca as duas coisas, e nunca nenhuma delas.</p>' +
        '<table><thead><tr><th>Frase</th><th>É proposição?</th></tr></thead><tbody>' +
        '<tr><td>"10 é menor que 7"</td><td>Sim (F)</td></tr>' +
        '<tr><td>"Cheyenne é a capital de Wyoming"</td><td>Sim (V)</td></tr>' +
        '<tr><td>"Ela é muito talentosa"</td><td>Não: quem é "ela"? Não dá para dizer V ou F</td></tr>' +
        '<tr><td>"Feche a porta!"</td><td>Não: é uma ordem, não uma declaração</td></tr>' +
        '</tbody></table>' },

      { h2: '2. Conectivos lógicos' },
      { html: '<p>A gente já usa esses conectivos todo dia sem chamar de "lógica". Aqui eles só ganham um símbolo e uma tabela que mostra, sem ambiguidade, quando o resultado é V ou F. O valor da combinação depende <b>só</b> do valor de cada peça.</p>' +
        '<div class="ideias">' +
        ideia('A′', 'Negação', '"não A"', 'Inverte o valor. Se "a loja está aberta" é V, "a loja não está aberta" é F.', 'A′ troca V por F, e F por V.', tt(['A', 'A′'], ['VF', 'FV'])) +
        ideia('A ∧ B', 'Conjunção', '"A e B"', 'Exigência dupla: para entrar na festa você precisa ter mais de 18 anos <b>e</b> estar na lista.', 'Só é V quando A e B são V.', tt(['A', 'B', 'A ∧ B'], ['VVV', 'VFF', 'FVF', 'FFF'])) +
        ideia('A ∨ B', 'Disjunção', '"A ou B"', 'O combo vem com batata <b>ou</b> salada: uma, a outra, ou (na lógica) até as duas.', 'Só é F quando A e B são F.', tt(['A', 'B', 'A ∨ B'], ['VVV', 'VFV', 'FVV', 'FFF'])) +
        ideia('A → B', 'Condicional', '"se A, então B"', '"Se ligar o interruptor, a lâmpada acende." Só é mentira se você liga e a lâmpada <b>não</b> acende. Se não ligou, a regra não falou nada: continua V.', 'Só é F quando A é V e B é F.', tt(['A', 'B', 'A → B'], ['VVV', 'VFF', 'FVV', 'FFV'])) +
        ideia('A ↔ B', 'Bicondicional', '"A se, e somente se, B"', 'Circuito sem defeito: a lâmpada está acesa <b>exatamente</b> quando o interruptor está ligado. Qualquer descompasso é F.', 'É V quando A e B têm o mesmo valor.', tt(['A', 'B', 'A ↔ B'], ['VVV', 'VFF', 'FVF', 'FFV'])) +
        '</div>' },
      { tip: '<p>Em Python: <code>not A</code>, <code>A and B</code>, <code>A or B</code>. O condicional não tem operador próprio: <code>A → B</code> é o mesmo que <code>(not A) or B</code>, e <code>A ↔ B</code> é <code>A == B</code>.</p>' },

      { h2: '3. Negação de compostos: Leis de De Morgan' },
      { html: '<p class="formula">(A ∧ B)′ ⇔ A′ ∨ B′ &nbsp;&nbsp;·&nbsp;&nbsp; (A ∨ B)′ ⇔ A′ ∧ B′</p>' +
        '<p>Para negar um "e", nega cada parte <b>e troca para "ou"</b> (e vice-versa). O erro clássico é negar as partes e esquecer de trocar o conectivo. Compare a coluna (A ∧ B)′ com as duas tentativas:</p>' +
        tt(['A', 'B', '(A ∧ B)′', 'A′ ∧ B′ (errado)', 'A′ ∨ B′ (certo)'], [
          ['V', 'V', 'F', 'F', 'F'], ['V', 'F', 'V', 'F', 'V'], ['F', 'V', 'V', 'F', 'V'], ['F', 'F', 'V', 'V', 'V']
        ], { res: 4 }) +
        '<p>A coluna "errada" falha em duas linhas; a "certa" bate em todas. Na frase: negar "Josicleiton é alto <b>e</b> magro" é "Josicleiton não é alto <b>ou</b> não é magro", e não "é baixo e gordo".</p>' },

      { h2: '4. Ordem dos conectivos e tabelas com mais letras' },
      { html: '<p>Sem parênteses, a ordem é: <b>( )</b>, depois <b>′</b>, depois <b>∧ e ∨</b>, depois <b>→</b>, e por último <b>↔</b>. É como em 2 + 3 × 4, em que a multiplicação vem antes.</p>' +
        '<ul><li><code>A ∨ B′</code> significa <code>A ∨ (B′)</code>, não <code>(A ∨ B)′</code>.</li>' +
        '<li><code>A ∨ B → C</code> significa <code>(A ∨ B) → C</code>.</li></ul>' +
        '<p>O último conectivo aplicado é o <b>conectivo principal</b>. Cada letra é um interruptor (V ou F): cada letra a mais <b>dobra</b> as combinações, então uma tabela com <b>n</b> letras tem <b>2<sup>n</sup></b> linhas.</p>' },
      { widget: 'tabelaVerdade', opts: { expr: 'A ∨ B′ → C' } },
      { tip: '<p>Repare no padrão das linhas: a última letra alterna a cada linha, a do meio de 2 em 2, a primeira de 4 em 4. Teste as expressões da lista de exemplos.</p>' },

      { h2: '5. Tautologia e contradição' },
      { html: '<p>Na aula de português, "tautologia" é uma redundância como "subir para cima": não acrescenta informação. Na lógica é parecido: uma <b>tautologia</b> dá sempre V, só pela estrutura da frase, não importa o valor das partes. Uma <b>contradição</b> dá sempre F.</p>' +
        '<ul><li>"Ou vai chover amanhã, ou não vai chover amanhã" → <code>A ∨ A′</code> (sempre V)</li>' +
        '<li>"Está chovendo e não está chovendo" → <code>A ∧ A′</code> (sempre F)</li></ul>' +
        tt(['A', 'A′', 'A ∨ A′', 'A ∧ A′'], ['VFVF', 'FVVF'], { res: -1 }) },
      { html: '<p>Um <b>algoritmo</b> para saber se uma expressão é tautologia: testar <b>todas</b> as combinações de V/F das letras (são 2<sup>n</sup>, uma lista finita). Se alguma linha der F, não é tautologia. Veja o computador fazendo isso com a lei de De Morgan:</p>' },
      { lab: {
        title: 'Testando De Morgan em todas as linhas',
        viz: 'array',
        code: 'from itertools import product\ntautologia = True\nfor A, B in product([True, False], repeat=2):\n    valor = (not (A and B)) == ((not A) or (not B))\n    print(A, B, valor)\n    if not valor:\n        tautologia = False\nprint("Tautologia?", tautologia)',
        gen: function* () {
          var combos = [[true, true], [true, false], [false, true], [false, false]];
          var nomes = combos.map(function (c) { return (c[0] ? 'V' : 'F') + ',' + (c[1] ? 'V' : 'F'); });
          var ok = [];
          function Z(k) { return { arr: nomes, ptr: k === null ? {} : { linha: k }, hl: k === null ? [] : [k], ok: ok, label: 'linhas (A, B)' }; }
          var V = { tautologia: true };
          yield { l: 1, v: {}, viz: Z(null), n: '<code>product([True, False], repeat=2)</code> gera as 2<sup>2</sup> = 4 combinações de A e B.' };
          yield { l: 2, v: V, viz: Z(null), n: 'Começamos supondo que é tautologia. Basta <b>uma</b> linha falsa para mudar de ideia.' };
          for (var k = 0; k < 4; k++) {
            var a = combos[k][0], b = combos[k][1];
            var vv = Object.assign({}, V, { A: a, B: b });
            yield { l: 3, v: vv, it: k + 1, viz: Z(k), n: 'Linha ' + (k + 1) + ': A = ' + (a ? 'True' : 'False') + ', B = ' + (b ? 'True' : 'False') + '.' };
            var lado1 = !(a && b), lado2 = !a || !b, val = lado1 === lado2;
            vv.valor = val;
            yield { l: 4, v: vv, it: k + 1, viz: Z(k), c: ['(not (A and B)) == ((not A) or (not B))', val], n: '(A ∧ B)′ = ' + (lado1 ? 'V' : 'F') + ' e A′ ∨ B′ = ' + (lado2 ? 'V' : 'F') + ': os dois lados <b>batem</b>.' };
            ok.push(k);
            yield { l: 5, v: vv, it: k + 1, viz: Z(k), p: A.print(a, b, val) };
            yield { l: 6, v: vv, it: k + 1, viz: Z(k), c: ['not valor', !val], n: 'valor é True, então o <code>if</code> não entra.' };
          }
          yield { l: 8, v: { tautologia: true, A: false, B: false, valor: true }, viz: Z(null), p: 'Tautologia? True', n: 'As 4 linhas deram True: a equivalência vale <b>sempre</b>. Isso é uma demonstração por exaustão (próxima aula).' };
        }
      } },
      { html: '<p>A mesma ideia aparece em código de verdade. Uma loja dá frete grátis se a compra passar de R$100 <b>e</b> o cliente for VIP. A condição contrária ("pagar o frete"), por De Morgan, vira um <b>or</b> com <b>not</b>:</p>' },
      { compare: [
        { title: 'com and', code: 'valor_acima_100 = False\ncliente_vip = True\nif valor_acima_100 and cliente_vip:\n    print("Ganhou frete grátis!")\nelse:\n    print("Paga o frete.")' },
        { title: 'De Morgan: not ... or not ...', code: 'valor_acima_100 = False\ncliente_vip = True\nif not valor_acima_100 or not cliente_vip:\n    print("Paga o frete.")\nelse:\n    print("Ganhou frete grátis!")' }
      ] },
      { code: 'esta_chovendo = False\nif esta_chovendo or not esta_chovendo:\n    print("Sempre imprime (tautologia)")\nelse:\n    print("Código morto: nunca roda")', out: 'Sempre imprime (tautologia)' },
      { warn: '<p><code>while True: print("Executando...")</code> <b>não é um algoritmo</b>: nunca termina. Um algoritmo precisa parar depois de um número finito de passos.</p>' }
    ],
    quiz: [
      { q: 'Qual destas frases é uma proposição?', options: ['"Que horas são?"', '"Ele é alto."', '"2 + 2 = 5"', '"Estude para a prova!"'], answer: 2, explain: '"2 + 2 = 5" é uma declaração com valor lógico (F). As outras são pergunta, frase sem sujeito definido e ordem.' },
      { q: 'Quando <code>A → B</code> é falso?', options: ['A = F e B = V', 'A = V e B = F', 'A = F e B = F', 'Nunca'], answer: 1, explain: 'O condicional só falha quando a hipótese é V e a conclusão é F.' },
      { q: 'A negação de "comprei pão e leite" é:', options: ['"Não comprei pão e não comprei leite"', '"Não comprei pão ou não comprei leite"', '"Comprei pão ou leite"', '"Comprei só pão"'], answer: 1, explain: 'De Morgan: (A ∧ B)′ ⇔ A′ ∨ B′. Nega as partes e troca e por ou.' },
      { q: 'Quantas linhas tem a tabela-verdade de <code>(A ∧ B) → (C ∨ D)</code>?', options: ['4', '8', '16', '32'], answer: 2, explain: '4 letras diferentes → 2⁴ = 16 linhas.' }
    ]
  });
})(window.ALG);
