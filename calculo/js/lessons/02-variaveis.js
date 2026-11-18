/* Aula 02 — Variáveis e tipos de dados */
(function (A) {
  var F = A.F;
  A.lesson({
    id: 'variaveis', module: 'm1', num: 2, minutes: 20,
    title: 'Variáveis e tipos de dados',
    goals: ['Variáveis', 'int · float · str · bool', 'type() e conversões'],
    body: [
      { html: '<p>Variável = <b>caixa com etiqueta</b> na memória. <code>x = 5</code> guarda 5 na caixa <code>x</code>.</p>' },
      { h2: 'Os 4 tipos básicos' },
      { html: '<div class="type-cards">' +
        '<div class="type-card" style="--tc:var(--t-int)"><b>int</b><p>números inteiros</p><code>19</code> <code>-3</code> <code>0</code></div>' +
        '<div class="type-card" style="--tc:var(--t-float)"><b>float</b><p>números reais (com ponto)</p><code>1.75</code> <code>-0.5</code> <code>2.0</code></div>' +
        '<div class="type-card" style="--tc:var(--t-str)"><b>str</b><p>texto, entre aspas</p><code>"Ana"</code> <code>\'42\'</code></div>' +
        '<div class="type-card" style="--tc:var(--t-bool)"><b>bool</b><p>lógico: verdadeiro/falso</p><code>True</code> <code>False</code></div>' +
        '</div>' },
      { lab: {
        title: 'Criando e alterando variáveis',
        code: 'idade = 19\naltura = 1.75\nnome = "Ana"\nestudante = True\nprint(type(altura))\nidade = idade + 1\ntexto = str(idade)\nprint(nome, "tem", texto, "anos")',
        gen: function* () {
          var idade, altura, nome, estudante, texto;
          idade = 19;
          yield { l: 1, v: { idade: idade }, n: 'Uma caixa <code>idade</code> é criada com o valor <b>19</b>. Sem ponto decimal → tipo <b>int</b>.' };
          altura = 1.75;
          yield { l: 2, v: { idade: idade, altura: F(altura) }, n: 'Com ponto decimal → <b>float</b>. Em Python o separador decimal é sempre o <b>ponto</b>, nunca a vírgula.' };
          nome = 'Ana';
          yield { l: 3, v: { idade: idade, altura: F(altura), nome: nome }, n: 'Entre aspas → <b>str</b> (string, texto).' };
          estudante = true;
          var V = function () { return { idade: idade, altura: F(altura), nome: nome, estudante: estudante, texto: texto }; };
          yield { l: 4, v: V(), n: '<code>True</code> (com T maiúsculo) → <b>bool</b>. Só existem dois valores: True e False.' };
          yield { l: 5, v: V(), p: "<class 'float'>", n: '<code>type()</code> responde qual é o tipo de um valor.' };
          idade = idade + 1;
          yield { l: 6, v: V(), n: 'Primeiro o Python calcula o lado <b>direito</b> (<code>19 + 1 = 20</code>), depois guarda o resultado em <code>idade</code>. O valor antigo é <b>substituído</b> (veja a caixa piscar).' };
          texto = String(idade);
          yield { l: 7, v: V(), n: '<code>str()</code> <b>converte</b> o número 20 no texto <code>\'20\'</code>. Repare: a nova caixa é laranja (str).' };
          yield { l: 8, v: V(), p: A.print(nome, 'tem', texto, 'anos'), n: 'Os valores das variáveis são usados na hora de imprimir.' };
        }
      } },
      { h2: 'Nomes válidos' },
      { html: '<p><code>nota1</code> ✔ &nbsp; <code>media_final</code> ✔ &nbsp; <code>1nota</code> ✘ &nbsp; <code>media final</code> ✘ &nbsp; <code>for</code> ✘</p>' },
      { h2: 'Teste tipos e conversões' },
      { widget: 'types' },
      { h2: 'Trocar valores' },
      { lab: {
        title: 'Troca com variável auxiliar',
        params: { a: 5, b: 9 },
        code: function (P, r) { return 'a = ' + r(P.a) + '\nb = ' + r(P.b) + '\naux = a\na = b\nb = aux\nprint(a, b)'; },
        gen: function* (P) {
          var a, b, aux;
          a = P.a; yield { l: 1, v: { a: a }, n: 'Guardamos ' + A.repr(a) + ' em <code>a</code>.' };
          b = P.b; yield { l: 2, v: { a: a, b: b } };
          aux = a; yield { l: 3, v: { a: a, b: b, aux: aux }, n: 'Fazemos um <b>backup</b> de <code>a</code> em <code>aux</code> antes de perdê-lo.' };
          a = b; yield { l: 4, v: { a: a, b: b, aux: aux }, n: 'Agora <code>a</code> recebe o valor de <code>b</code>. O valor antigo de <code>a</code> só existe em <code>aux</code>.' };
          b = aux; yield { l: 5, v: { a: a, b: b, aux: aux }, n: '<code>b</code> recebe o backup. Troca concluída!' };
          yield { l: 6, v: { a: a, b: b, aux: aux }, p: A.print(a, b) };
        }
      } },
      { tip: '<p>Atalho do Python: <code>a, b = b, a</code></p>' }
    ],
    quiz: [
      { q: 'Qual é o tipo de <code>x</code>?', code: 'x = 7.0', options: ['int', 'float', 'str', 'bool'], answer: 1, explain: 'Tem ponto decimal, então é float, mesmo que a parte decimal seja zero.' },
      { q: 'Qual é o tipo de <code>y</code>?', code: 'y = "123"', options: ['int', 'float', 'str', 'bool'], answer: 2, explain: 'As aspas fazem dele um texto. Para virar número: int(y).' },
      { q: 'Qual o valor final de <code>n</code>?', code: 'n = 10\nn = n * 2\nn = n - 5', options: ['10', '20', '15', '5'], answer: 2, explain: '10 → 20 → 15. Cada atribuição substitui o valor anterior.' },
      { q: 'Qual nome de variável é <b>inválido</b>?', options: ['nota_final', '_total', '2lugar', 'mediaGeral'], answer: 2, explain: 'Nomes não podem começar com número.' },
      { q: 'O que <code>int(9.8)</code> retorna?', options: ['10', '9', '9.8', 'Erro'], answer: 1, explain: 'int() corta (trunca) a parte decimal, não arredonda. Para arredondar use round(9.8).' }
    ]
  });
})(window.ALG);
