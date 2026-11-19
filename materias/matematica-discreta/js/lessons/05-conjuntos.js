/* Aula 05 — Conjuntos (Gersting, cap. 4.1) */
(function (A) {
  A.lesson({
    id: 'conjuntos', module: 'd2', num: 5, minutes: 30,
    title: 'Conjuntos',
    goals: ['∈ e ⊆', 'União, interseção, diferença', 'Produto cartesiano', 'set do Python'],
    body: [
      { h2: '1. O que é um conjunto' },
      { html: '<p>Um "conjunto de panelas" é uma coleção de objetos que andam juntos. Na matemática é a mesma ideia, com duas regras:</p>' +
        '<table><thead><tr><th>Regra</th><th>Exemplo</th></tr></thead><tbody>' +
        '<tr><td>a ordem não importa</td><td>{violeta, verde} = {verde, violeta}</td></tr>' +
        '<tr><td>repetir não muda nada</td><td>{1, 1, 2} = {1, 2}</td></tr></tbody></table>' +
        '<table><thead><tr><th>Símbolo</th><th>Leitura</th><th>Exemplo com A = {violeta, verde, castanho}</th></tr></thead><tbody>' +
        '<tr><td>∈</td><td>pertence</td><td>verde ∈ A</td></tr><tr><td>∉</td><td>não pertence</td><td>magenta ∉ A</td></tr></tbody></table>' },
      { code: 'A = {"violeta", "verde", "castanho", "verde"}\nprint(len(A))            # repetidos somem\nprint("verde" in A)      # ∈\nprint("magenta" not in A) # ∉', out: '3\nTrue\nTrue' },
      { h3: 'Três jeitos de descrever um conjunto' },
      { html: '<table><thead><tr><th>Jeito</th><th>Como fica (pares positivos)</th></tr></thead><tbody>' +
        '<tr><td>1. listar</td><td>S = {2, 4, 6, …}</td></tr>' +
        '<tr><td>2. recorrência</td><td>2 ∈ S; se n ∈ S, então n + 2 ∈ S</td></tr>' +
        '<tr><td>3. propriedade</td><td>S = {x | x é inteiro positivo par}</td></tr></tbody></table>' +
        '<p>O jeito 3 lê-se "o conjunto dos x <b>tais que</b> x é inteiro positivo par". A propriedade é um <b>predicado</b> (aula 3), e em Python vira uma <b>set comprehension</b>:</p>' },
      { code: 'S = {x for x in range(1, 11) if x % 2 == 0}\nprint(S)', out: '{2, 4, 6, 8, 10}' },
      { html: '<table><thead><tr><th>Símbolo</th><th>Conjunto</th></tr></thead><tbody>' +
        '<tr><td>ℕ</td><td>naturais: 0, 1, 2, … (o 0 está incluído)</td></tr><tr><td>ℤ</td><td>inteiros</td></tr><tr><td>ℚ</td><td>racionais (frações)</td></tr><tr><td>ℝ</td><td>reais</td></tr><tr><td>∅ ou { }</td><td>conjunto vazio</td></tr></tbody></table>' },
      { warn: '<p><b>∅ e {∅} são diferentes.</b> ∅ é uma caixa vazia (0 elementos). {∅} é uma caixa que tem uma caixa vazia dentro (1 elemento). Em Python, o vazio é <code>set()</code>, e não <code>{}</code> (isso é um dicionário vazio).</p>' },

      { h2: '2. Subconjunto' },
      { html: '<p class="formula">A ⊆ B &nbsp;⇔&nbsp; (∀x)(x ∈ A → x ∈ B)</p>' +
        '<p>A cabe inteiro dentro de B. Suas músicas favoritas são um subconjunto de todas as músicas do celular. <b>A ⊂ B</b> (subconjunto próprio): A ⊆ B e sobra pelo menos um elemento de B fora de A.</p>' +
        '<p>Com A = {1, 7, 9, 15}, B = {7, 9} e C = {7, 9, 15, 20}:</p>' +
        '<table><thead><tr><th>Proposição</th><th>Valor</th><th>Por quê</th></tr></thead><tbody>' +
        '<tr><td>B ⊆ C</td><td>V</td><td>7 e 9 estão em C</td></tr>' +
        '<tr><td>B ⊂ A</td><td>V</td><td>cabe, e sobram 1 e 15 em A</td></tr>' +
        '<tr><td>A ⊆ C</td><td>F</td><td>1 ∉ C</td></tr>' +
        '<tr><td>{7} ⊂ A</td><td>V</td><td>{7} é conjunto, então usa ⊂, não ∈</td></tr>' +
        '<tr><td>∅ ⊆ C</td><td>V</td><td>∅ é subconjunto de qualquer conjunto</td></tr></tbody></table>' },
      { code: 'A = {1, 7, 9, 15}\nB = {7, 9}\nC = {7, 9, 15, 20}\nprint(B <= C)   # B ⊆ C\nprint(B < A)    # B ⊂ A (próprio)\nprint(A <= C)   # A ⊆ C\nprint(C >= B)   # C ⊇ B', out: 'True\nTrue\nFalse\nTrue' },
      { tip: '<p><b>∈ ou ⊆?</b> ∈ liga um <b>elemento</b> a um conjunto (7 ∈ B). ⊆ liga um <b>conjunto</b> a outro ({7} ⊆ B). Para provar A = B, mostre as duas inclusões: A ⊆ B <b>e</b> B ⊆ A.</p>' },

      { h2: '3. Operações binárias e unárias' },
      { html: '<p>No <b>par ordenado</b> a ordem importa: {1, 2} = {2, 1}, mas (1, 2) ≠ (2, 1), como o assento (fileira, cadeira).</p>' +
        '<p>Uma operação ∘ é <b>binária em S</b> se, para todo par x, y ∈ S, o resultado x ∘ y existe, é único (<b>bem definida</b>) e pertence a S (<b>S é fechado</b>). Pense numa máquina de café: qualquer par de botões tem que entregar uma bebida <b>do cardápio</b>.</p>' +
        '<table><thead><tr><th>Operação em ℕ</th><th>Teste com 3 e 5</th><th>Binária em ℕ?</th></tr></thead><tbody>' +
        '<tr><td>x + y</td><td>8</td><td>sim</td></tr><tr><td>x · y</td><td>15</td><td>sim</td></tr>' +
        '<tr><td>x − y</td><td>−2 ∉ ℕ: saiu do cardápio</td><td>não</td></tr><tr><td>x ÷ y</td><td>0,6 ∉ ℕ, e x ÷ 0 nem existe</td><td>não</td></tr></tbody></table>' +
        '<p>Basta <b>um</b> par que falhe. Uma operação <b>unária</b> age em um elemento só: −x é unária em ℤ, mas não em ℕ (−3 ∉ ℕ).</p>' },

      { h2: '4. Operações em conjuntos' },
      { html: '<p>Todos os conjuntos ficam dentro de um <b>universo</b> S. Exemplo: S = alunos da universidade, A = computação, B = engenharia de software.</p>' +
        '<table><thead><tr><th>Operação</th><th>Definição</th><th>No exemplo</th><th>Python</th></tr></thead><tbody>' +
        '<tr><td>A ∪ B</td><td>{x | x ∈ A ou x ∈ B}</td><td>cursa um, outro ou ambos</td><td><code>A | B</code></td></tr>' +
        '<tr><td>A ∩ B</td><td>{x | x ∈ A e x ∈ B}</td><td>cursa os dois</td><td><code>A &amp; B</code></td></tr>' +
        '<tr><td>A − B</td><td>{x | x ∈ A e x ∉ B}</td><td>só computação</td><td><code>A - B</code></td></tr>' +
        '<tr><td>A′</td><td>{x | x ∈ S e x ∉ A}</td><td>não cursa computação</td><td><code>S - A</code></td></tr></tbody></table>' +
        '<p>Mexa nos conjuntos e clique nas operações:</p>' },
      { widget: 'venn' },
      { tip: '<p>Se A ∩ B = ∅, A e B são <b>disjuntos</b>. Exemplo: A − B e B − A são sempre disjuntos.</p>' },

      { h3: 'Produto cartesiano' },
      { html: '<p><b>A × B</b> é o conjunto de todos os pares ordenados (x, y) com x ∈ A e y ∈ B. Analogia: combos de lanchonete, cada combo é um par (lanche, bebida).</p>' +
        '<table><thead><tr><th>A × B</th><th>suco</th><th>refri</th></tr></thead><tbody>' +
        '<tr><td><b>x-burguer</b></td><td>(x-burguer, suco)</td><td>(x-burguer, refri)</td></tr>' +
        '<tr><td><b>misto</b></td><td>(misto, suco)</td><td>(misto, refri)</td></tr></tbody></table>' +
        '<p>2 lanches × 2 bebidas = 4 combos: <b>|A × B| = |A| · |B|</b>. A × A se escreve A².</p>' },
      { code: 'from itertools import product\nlanches = ["x-burguer", "misto"]\nbebidas = ["suco", "refri"]\ncombos = list(product(lanches, bebidas))\nprint(combos)\nprint(len(combos))', out: "[('x-burguer', 'suco'), ('x-burguer', 'refri'), ('misto', 'suco'), ('misto', 'refri')]\n4" },

      { h2: '5. Conjuntos enumeráveis' },
      { html: '<p>A <b>cardinalidade</b> |S| é o número de elementos de um conjunto finito: |{2, 5, 9}| = 3. Um conjunto infinito é <b>enumerável</b> se dá para distribuir senhas 1, 2, 3, … de modo que <b>todo</b> elemento seja chamado em algum momento.</p>' +
        '<table><thead><tr><th>Conjunto</th><th>Enumerável?</th><th>Fila</th></tr></thead><tbody>' +
        '<tr><td>ℕ</td><td>sim</td><td>0, 1, 2, 3, …</td></tr><tr><td>pares positivos</td><td>sim</td><td>2, 4, 6, 8, …</td></tr>' +
        '<tr><td>ℚ⁺ (racionais positivos)</td><td>sim</td><td>1/1, 2/1, 1/2, 1/3, 3/1, …</td></tr>' +
        '<tr><td>reais entre 0 e 1</td><td>não</td><td>nenhuma fila chama todos (Cantor)</td></tr></tbody></table>' }
    ],
    quiz: [
      { q: 'Qual é o resultado de <code>{1, 2, 3} &amp; {2, 3, 4}</code>?', options: ['{1, 2, 3, 4}', '{2, 3}', '{1}', '{1, 4}'], answer: 1, explain: '&amp; é a interseção: só o que está nos dois.' },
      { q: 'Quantos elementos tem {∅}?', options: ['0', '1', '2', 'infinitos'], answer: 1, explain: 'Tem um elemento: o conjunto vazio.' },
      { q: 'Se |A| = 3 e |B| = 4, quanto vale |A × B|?', options: ['7', '12', '34', '81'], answer: 1, explain: '|A × B| = |A| · |B| = 12 pares ordenados.' },
      { q: 'A subtração x − y é uma operação binária em ℕ?', options: ['Sim', 'Não, pois 3 − 5 ∉ ℕ', 'Só se x = y', 'Não, pois não é única'], answer: 1, explain: 'ℕ não é fechado para subtração: o resultado pode sair do conjunto.' }
    ]
  });
})(window.ALG);
