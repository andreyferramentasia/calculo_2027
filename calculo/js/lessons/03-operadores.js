/* Aula 03 — Operadores e expressões */
(function (A) {
  A.lesson({
    id: 'operadores', module: 'm1', num: 3, minutes: 20,
    title: 'Operadores e expressões',
    goals: ['+ − * / // % **', 'Comparações', 'and · or · not'],
    body: [
      { h2: 'Aritméticos' },
      { html: '<table><thead><tr><th>Operador</th><th>Nome</th><th>Exemplo</th><th>Resultado</th></tr></thead><tbody>' +
        '<tr><td><code>+ - *</code></td><td>soma, subtração, multiplicação</td><td><code>7 * 3</code></td><td>21</td></tr>' +
        '<tr><td><code>/</code></td><td>divisão real</td><td><code>7 / 2</code></td><td>3.5</td></tr>' +
        '<tr><td><code>//</code></td><td>divisão inteira</td><td><code>7 // 2</code></td><td>3</td></tr>' +
        '<tr><td><code>%</code></td><td>resto (módulo)</td><td><code>7 % 2</code></td><td>1</td></tr>' +
        '<tr><td><code>**</code></td><td>potência</td><td><code>2 ** 10</code></td><td>1024</td></tr>' +
        '</tbody></table>' },
      { widget: 'ops' },
      { h2: 'Separando dígitos com // e %' },
      { lab: {
        title: 'Decompondo um número',
        params: { n: 357 },
        code: function (P, r) {
          return 'n = ' + r(Math.abs(Math.trunc(P.n))) + '\ncentena = n // 100\ndezena = (n // 10) % 10\nunidade = n % 10\nsoma = centena + dezena + unidade\nprint("Soma dos dígitos:", soma)\npar = soma % 2 == 0\nprint("É par?", par)';
        },
        gen: function* (P) {
          var n = Math.abs(Math.trunc(P.n)), centena, dezena, unidade, soma, par;
          function V() { return { n: n, centena: centena, dezena: dezena, unidade: unidade, soma: soma, par: par }; }
          yield { l: 1, v: V() };
          centena = Math.floor(n / 100);
          yield { l: 2, v: V(), n: '<code>' + n + ' // 100</code> = <b>' + centena + '</b>: quantas centenas cabem inteiras em ' + n + '.' };
          dezena = Math.floor(n / 10) % 10;
          yield { l: 3, v: V(), n: 'Passo a passo: <code>' + n + ' // 10</code> = ' + Math.floor(n / 10) + ', e <code>' + Math.floor(n / 10) + ' % 10</code> = <b>' + dezena + '</b> (o último dígito do que sobrou).' };
          unidade = n % 10;
          yield { l: 4, v: V(), n: 'O resto da divisão por 10 é sempre o <b>último dígito</b>: <code>' + n + ' % 10</code> = <b>' + unidade + '</b>.' };
          soma = centena + dezena + unidade;
          yield { l: 5, v: V(), n: centena + ' + ' + dezena + ' + ' + unidade + ' = <b>' + soma + '</b>' };
          yield { l: 6, v: V(), p: A.print('Soma dos dígitos:', soma) };
          par = soma % 2 === 0;
          yield { l: 7, v: V(), c: ['soma % 2 == 0', par], n: '<code>' + soma + ' % 2</code> = ' + (soma % 2) + '. Comparar com <code>==</code> gera um <b>bool</b>.' };
          yield { l: 8, v: V(), p: A.print('É par?', par) };
        }
      } },
      { h2: 'Comparação' },
      { html: '<p><code>==</code> &nbsp; <code>!=</code> &nbsp; <code>&gt;</code> &nbsp; <code>&lt;</code> &nbsp; <code>&gt;=</code> &nbsp; <code>&lt;=</code> &nbsp;→ sempre dão <code>True</code> ou <code>False</code></p>' },
      { warn: '<p><code>=</code> guarda &nbsp;·&nbsp; <code>==</code> compara</p>' },
      { h2: 'Lógicos: and, or, not' },
      { widget: 'logic' },
      { h2: 'Precedência' },
      { html: '<p><code>**</code> → <code>* / // %</code> → <code>+ -</code> → comparações → <code>not</code> → <code>and</code> → <code>or</code>. Na dúvida, <b>parênteses</b>.</p>' },
    ],
    quiz: [
      { q: 'Quanto vale <code>17 // 5</code>?', options: ['3.4', '3', '2', '4'], answer: 1, explain: 'Divisão inteira: 5 cabe 3 vezes em 17.' },
      { q: 'Quanto vale <code>17 % 5</code>?', options: ['3', '2', '3.4', '0'], answer: 1, explain: '17 = 5·3 + 2, o resto é 2.' },
      { q: 'Como testar se <code>n</code> é múltiplo de 3?', options: ['n / 3 == 0', 'n // 3 == 0', 'n % 3 == 0', 'n % 3 == 1'], answer: 2, explain: 'Se o resto da divisão por 3 é zero, n é múltiplo de 3.' },
      { q: 'Resultado de <code>True and not False</code>?', options: ['True', 'False', 'Erro', 'None'], answer: 0, explain: 'not False = True; True and True = True.' },
      { q: 'Quanto vale <code>2 + 3 * 2 ** 2</code>?', options: ['100', '14', '20', '36'], answer: 1, explain: '2**2 = 4 → 3*4 = 12 → 2+12 = 14.' }
    ]
  });
})(window.ALG);
