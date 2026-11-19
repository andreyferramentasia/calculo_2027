/* Aula 06 — Contagem (Gersting, cap. 4.2) */
(function (A) {
  A.lesson({
    id: 'contagem', module: 'd2', num: 6, minutes: 30,
    title: 'Contagem',
    goals: ['Multiplicação', 'Adição', 'Contar o contrário', 'Árvores de decisão'],
    body: [
      { h2: '1. Por que contar' },
      { html: '<p>Combinatória é o ramo da matemática que <b>conta</b>. Na prática, é achar a cardinalidade |S| de um conjunto finito (aula 5).</p>' +
        '<table><thead><tr><th>Pergunta do dia a dia</th><th>Conjunto contado</th></tr></thead><tbody>' +
        '<tr><td>Quantas senhas de 4 dígitos existem?</td><td>todas as senhas possíveis</td></tr>' +
        '<tr><td>Quantos endereços cabem no IPv4?</td><td>todas as sequências de 32 bits</td></tr>' +
        '<tr><td>Quantas pizzas diferentes dá para pedir?</td><td>todas as combinações do cardápio</td></tr></tbody></table>' },

      { h2: '2. Princípio da multiplicação' },
      { html: '<div class="ideias"><div class="ideia"><h4><code>n₁ × n₂</code> Multiplicação <small>"uma escolha e depois outra"</small></h4>' +
        '<p>Uma criança escolhe 1 bala (rosa ou preta) e <b>depois</b> 1 chiclete (amarelo, verde ou branco). Cada bala abre 3 caminhos: 2 × 3 = 6 resultados.</p>' +
        '<p class="resumo">Etapas em sequência → multiplique as opções de cada etapa.</p></div></div>' +
        '<table><thead><tr><th>Problema</th><th>Etapas</th><th>Conta</th></tr></thead><tbody>' +
        '<tr><td>senha de 4 dígitos</td><td>dígito, dígito, dígito, dígito</td><td>10 · 10 · 10 · 10 = 10.000</td></tr>' +
        '<tr><td>pizza</td><td>massa (3), tamanho (3), sabor (5)</td><td>3 · 3 · 5 = 45</td></tr>' +
        '<tr><td>IPv4</td><td>32 bits, cada um 0 ou 1</td><td>2³² ≈ 4,3 bilhões</td></tr>' +
        '<tr><td>IPv6</td><td>128 bits</td><td>2¹²⁸ ≈ 3,4 · 10³⁸</td></tr></tbody></table>' +
        '<p><b>Com ou sem repetição:</b> se um item não pode ser usado de novo, cada etapa tem <b>uma opção a menos</b>. Escolher 3 representantes entre 25 pessoas: sem repetir = 25 · 24 · 23 = 13.800; podendo repetir = 25³ = 15.625.</p>' },
      { widget: 'contagem' },
      { code: 'from itertools import product, permutations\nmassas = ["fina", "normal", "calzone"]\ntamanhos = ["P", "M", "G"]\nsabores = ["margherita", "calabresa", "cogumelo", "presunto", "portuguesa"]\nprint(len(list(product(massas, tamanhos, sabores))))\n\ndigitos = "0123456789"\nprint(len(list(product(digitos, repeat=4))))   # com repetição\nprint(len(list(permutations(digitos, 4))))     # sem repetição', out: '45\n10000\n5040' },
      { tip: '<p>Ligação com a aula 5: montar um par (x, y) de A × B é escolher x <b>e depois</b> y. Por isso |A × B| = |A| · |B|.</p>' },

      { h2: '3. Princípio da adição' },
      { html: '<div class="ideias"><div class="ideia"><h4><code>n₁ + n₂</code> Adição <small>"uma escolha ou outra, nunca as duas"</small></h4>' +
        '<p>Sobremesa: 3 tortas <b>ou</b> 4 bolos. Você come só uma, então são 3 + 4 = 7 opções.</p>' +
        '<p class="resumo">Casos separados (disjuntos) → some as opções.</p></div></div>' +
        '<p>Só vale para casos <b>disjuntos</b>. 23 carros e 14 caminhões: 37 veículos. Mas 23 carros, 14 caminhões e 17 vermelhos <b>não</b> dá para somar: um carro vermelho seria contado duas vezes.</p>' +
        '<table><thead><tr><th>A tarefa é…</th><th>Palavra-chave</th><th>Princípio</th></tr></thead><tbody>' +
        '<tr><td>uma sequência de etapas</td><td>"e depois"</td><td>multiplica</td></tr>' +
        '<tr><td>dividida em casos que não se misturam</td><td>"ou"</td><td>soma</td></tr></tbody></table>' },

      { h2: '4. Usando os dois juntos' },
      { html: '<p>Separe em casos (soma) e conte cada caso em etapas (multiplica).</p>' +
        '<p><b>Quantos números de 4 dígitos começam com 4 ou 5?</b> Começam com 4: 1 · 10 · 10 · 10 = 1000; com 5: mais 1000; total <b>2000</b>. Outro caminho: o 1º dígito tem 2 opções → 2 · 10 · 10 · 10 = 2000. Dois caminhos, mesma resposta: boa forma de conferir.</p>' +
        '<p><b>Quantos inteiros de 100 a 999 são pares?</b> 1º dígito 1–9 (9), 2º dígito 0–9 (10), 3º dígito 0, 2, 4, 6, 8 (5): 9 · 10 · 5 = <b>450</b>.</p>' +
        '<h3>Contar o contrário</h3><p>Às vezes é mais fácil contar o que você <b>não</b> quer e subtrair do total. Senhas de 4 dígitos com <b>pelo menos um</b> dígito repetido: total 10.000 − sem repetição 5040 = <b>4960</b>.</p>' },
      { code: 'from itertools import product\ncom_repeticao = 0\nfor senha in product("0123456789", repeat=4):\n    if len(set(senha)) < 4:     # set remove os repetidos\n        com_repeticao = com_repeticao + 1\nprint(com_repeticao)', out: '4960' },

      { h2: '5. Árvores de decisão' },
      { html: '<p>Quando o número de opções <b>depende da escolha anterior</b>, o princípio da multiplicação não funciona. Aí desenhamos a árvore e contamos as folhas.</p>' +
        '<p>Exemplo: jogar uma moeda 3 vezes (C = cara, K = coroa) <b>sem</b> sair duas caras seguidas. Depois de um C, a próxima só pode ser K. Mude o número de jogadas e veja o computador percorrer a árvore:</p>' },
      { lab: {
        title: 'Contando as folhas da árvore',
        params: { jogadas: 3 },
        viz: 'array',
        code: function (P) { var n = Math.max(1, Math.min(5, Math.trunc(P.jogadas))); return 'from itertools import product\nvalidas = []\nfor seq in product("CK", repeat=' + n + '):\n    s = "".join(seq)\n    if "CC" not in s:\n        validas.append(s)\nprint(validas, len(validas))'; },
        gen: function* (P) {
          var n = Math.max(1, Math.min(5, Math.trunc(P.jogadas)));
          var todas = [];
          for (var r = 0; r < (1 << n); r++) {
            var s = '';
            for (var i = n - 1; i >= 0; i--) s += (r >> i) & 1 ? 'K' : 'C';
            todas.push(s);
          }
          var ok = [], bad = [], val = [];
          function Z(k) { return { arr: todas, ptr: k === null ? {} : { seq: k }, hl: k === null ? [] : [k], ok: ok, bad: bad, label: 'product("CK", repeat=' + n + ')' }; }
          yield { l: 2, v: { validas: [] }, viz: Z(null), n: 'São 2<sup>' + n + '</sup> = ' + todas.length + ' sequências no total. Vamos filtrar as proibidas.' };
          for (var k = 0; k < todas.length; k++) {
            var tem = todas[k].indexOf('CC') >= 0;
            yield { l: 5, v: { validas: val.slice(), s: todas[k] }, it: k + 1, viz: Z(k), c: ['"CC" not in s', !tem], n: tem ? 'Tem duas caras seguidas: <b>ramo proibido</b>.' : 'Sequência válida: é uma folha da árvore.' };
            if (tem) bad.push(k); else { ok.push(k); val.push(todas[k]); yield { l: 6, v: { validas: val.slice(), s: todas[k] }, it: k + 1, viz: Z(k) }; }
          }
          yield { l: 7, v: { validas: val }, viz: Z(null), p: A.print(val, val.length), n: 'Sobraram <b>' + val.length + '</b> folhas. Não é 2<sup>' + n + '</sup>: depois de C há 1 opção, depois de K há 2. O número de opções muda de ramo para ramo.' };
        }
      } }
    ],
    quiz: [
      { q: 'Um restaurante tem 4 entradas e 5 pratos. Quantos jantares (1 entrada <b>e depois</b> 1 prato) existem?', options: ['9', '20', '45', '625'], answer: 1, explain: 'Etapas em sequência: 4 · 5 = 20.' },
      { q: 'Você pode escolher 1 filme entre 6 de ação <b>ou</b> 8 de comédia. Quantas opções?', options: ['14', '48', '6', '8'], answer: 0, explain: 'Casos disjuntos: 6 + 8 = 14.' },
      { q: 'Quantas senhas de 3 letras (a–z) existem <b>sem repetir</b> letra?', options: ['26³ = 17.576', '26 · 25 · 24 = 15.600', '3 · 26 = 78', '26 + 25 + 24 = 75'], answer: 1, explain: 'Sem repetição, cada etapa tem uma opção a menos.' },
      { q: 'O que <code>len(set("1231"))</code> devolve?', options: ['4', '3', '2', '1'], answer: 1, explain: 'set remove repetidos: {"1", "2", "3"} tem 3 elementos.' }
    ]
  });
})(window.ALG);
