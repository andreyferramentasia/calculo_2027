/* Aula 11 — Funções */
(function (A) {
  var FN = A.FN, F = A.F;
  A.lesson({
    id: 'funcoes', module: 'm3', num: 11, minutes: 30,
    title: 'Funções',
    goals: ['def · return', 'Pilha de chamadas', 'Valor padrão', 'Vários retornos', 'Funções + list comprehension'],
    body: [
      { code: 'def soma(a, b):      # parâmetros\n    return a + b     # devolve o resultado\n\nx = soma(3, 4)       # x recebe 7', playground: false },

      /* ---------- pilha de chamadas ---------- */
      { h2: 'A pilha de chamadas' },
      { lab: {
        title: 'Chamando uma função duas vezes',
        viz: 'stack',
        code: 'def area_retangulo(base, altura):\n    a = base * altura\n    return a\n\nr1 = area_retangulo(3, 4)\nr2 = area_retangulo(5, 2)\nprint(r1 + r2)',
        gen: function* () {
          var G = {};
          function S(extra) { var f = [{ name: '<módulo principal>', vars: Object.assign({}, G, { area_retangulo: undefined }) }]; return { frames: extra ? f.concat(extra) : f }; }
          G.area_retangulo = FN('area_retangulo');
          yield { l: 1, v: G, viz: S(), n: '<code>def</code> apenas <b>define</b> a função (cria a "receita"). O corpo <b>não é executado</b> agora.' };
          var calls = [[3, 4, 'r1'], [5, 2, 'r2']];
          for (var k = 0; k < 2; k++) {
            var b = calls[k][0], h = calls[k][1], nm = calls[k][2];
            var name = 'area_retangulo(' + b + ', ' + h + ')';
            yield { l: 5 + k, v: G, viz: S(), n: 'Chamada! O Python pula para dentro da função com <code>base = ' + b + '</code> e <code>altura = ' + h + '</code>.' };
            yield { l: 1, v: G, viz: S([{ name: name, vars: { base: b, altura: h } }]), n: 'Um novo quadro aparece no <b>topo da pilha</b>. <code>base</code> e <code>altura</code> são variáveis <b>locais</b>: só existem aqui dentro.' };
            yield { l: 2, v: G, viz: S([{ name: name, vars: { base: b, altura: h, a: b * h } }]), n: 'a = ' + b + ' × ' + h + ' = <b>' + (b * h) + '</b> (também local).' };
            yield { l: 3, v: G, viz: S([{ name: name, vars: { base: b, altura: h, a: b * h }, ret: b * h }]), n: '<code>return</code> devolve <b>' + (b * h) + '</b> e encerra a função.' };
            G[nm] = b * h;
            yield { l: 5 + k, v: G, viz: S(), n: 'O quadro foi <b>destruído</b> (as locais sumiram!) e o valor retornado foi guardado em <code>' + nm + '</code>.' };
          }
          yield { l: 7, v: G, viz: S(), p: String(G.r1 + G.r2) };
        }
      } },
      { tip: '<p><code>print</code> mostra &nbsp;·&nbsp; <code>return</code> devolve. Sem return → <code>None</code>.</p>' },

      /* ---------- valor padrão ---------- */
      { h2: 'Parâmetro com valor padrão' },
      { html: '<p>Se o argumento não for passado, a função usa o <b>valor padrão</b>.</p>' },
      { code: 'def saudacao(nome, msg="Olá"):\n    return f"{msg}, {nome}!"\n\nprint(saudacao("Ana"))           # usa o padrão\nprint(saudacao("Bia", "E aí"))   # troca o padrão\nprint(saudacao(msg="Oi", nome="Cris"))  # pelo nome', out: 'Olá, Ana!\nE aí, Bia!\nOi, Cris!' },

      /* ---------- vários retornos ---------- */
      { h2: 'Devolvendo vários valores' },
      { lab: {
        title: 'return com dois valores',
        params: { v: [7, 2, 9, 4] },
        viz: 'stack',
        code: function (P) { return 'def min_max(v):\n    menor = min(v)\n    maior = max(v)\n    return menor, maior\n\na, b = min_max(' + A.repr(P.v) + ')\nprint(a, b)'; },
        gen: function* (P) {
          var v = P.v.filter(function (x) { return typeof x === 'number'; });
          if (!v.length) v = [0];
          var G = { min_max: FN('min_max') };
          var main = { name: '<módulo principal>', vars: {} };
          var mn = Math.min.apply(null, v), mx = Math.max.apply(null, v);
          var fname = 'min_max(' + A.repr(v) + ')';
          yield { l: 1, v: G, viz: { frames: [main] }, n: 'Define a função.' };
          yield { l: 6, v: G, viz: { frames: [main] }, n: 'Chama <code>min_max</code> passando a lista.' };
          yield { l: 1, v: G, viz: { frames: [main, { name: fname, vars: { v: v } }] } };
          yield { l: 2, v: G, viz: { frames: [main, { name: fname, vars: { v: v, menor: mn } }] }, n: '<code>min(v)</code> = <b>' + mn + '</b>' };
          yield { l: 3, v: G, viz: { frames: [main, { name: fname, vars: { v: v, menor: mn, maior: mx } }] }, n: '<code>max(v)</code> = <b>' + mx + '</b>' };
          yield { l: 4, v: G, viz: { frames: [main, { name: fname, vars: { v: v, menor: mn, maior: mx }, ret: A.T([mn, mx]) }] }, n: '<code>return menor, maior</code> devolve os dois juntos numa <b>tupla</b> <code>(' + mn + ', ' + mx + ')</code>.' };
          G.a = mn; G.b = mx;
          yield { l: 6, v: G, viz: { frames: [{ name: '<módulo principal>', vars: { a: mn, b: mx } }] }, n: '<b>Desempacotamento</b>: o 1º valor vai para <code>a</code>, o 2º para <code>b</code>.' };
          yield { l: 7, v: G, viz: { frames: [{ name: '<módulo principal>', vars: { a: mn, b: mx } }] }, p: A.print(mn, mx) };
        }
      } },

      /* ---------- funções + list comprehension ---------- */
      { h2: 'Funções dentro de list comprehension' },
      { html: '<p>Lembra da list comprehension (aula 10)? Dá para chamar uma função para <b>cada elemento</b>:</p>' },
      { lab: {
        title: 'Convertendo uma lista inteira',
        params: { temps: [0, 20, 30, 100] },
        viz: ['array', 'trail', 'stack'],
        code: function (P) { return 'def para_f(c):\n    return c * 9 / 5 + 32\n\ntemps = ' + A.repr(P.temps) + '\nfahr = [para_f(t) for t in temps]\nprint(fahr)'; },
        gen: function* (P) {
          var temps = P.temps.filter(function (x) { return typeof x === 'number'; }).slice(0, 8);
          var G = { para_f: FN('para_f') };
          var main = { name: '<módulo principal>', vars: {} };
          var res = [], done = [];
          function Z(pos, extra) {
            return {
              array: { arr: temps, ptr: { t: pos }, hl: pos === null ? [] : [pos], ok: done.slice(), label: 'temps' },
              trail: { label: 'fahr sendo montada:', items: res.map(function (x) { return F(x); }) },
              stack: { frames: extra ? [main, extra] : [main] }
            };
          }
          yield { l: 1, v: G, viz: Z(null), n: 'Define a função de conversão.' };
          G.temps = temps;
          yield { l: 4, v: G, viz: Z(null) };
          for (var k = 0; k < temps.length; k++) {
            var t = temps[k], f = t * 9 / 5 + 32;
            yield { l: 5, v: G, it: k + 1, viz: Z(k), n: 'A list comprehension pega <code>t = ' + t + '</code> e chama <code>para_f(' + t + ')</code>.' };
            yield { l: 1, v: G, it: k + 1, viz: Z(k, { name: 'para_f(' + t + ')', vars: { c: t } }) };
            yield { l: 2, v: G, it: k + 1, viz: Z(k, { name: 'para_f(' + t + ')', vars: { c: t }, ret: F(f) }), n: t + ' × 9 / 5 + 32 = <b>' + A.fmtFloat(f) + '</b>' };
            res.push(f); done.push(k);
            yield { l: 5, v: G, it: k + 1, viz: Z(k), n: 'O valor devolvido entra no fim da nova lista.' };
          }
          G.fahr = res.map(function (x) { return F(x); });
          yield { l: 5, v: G, viz: Z(null), n: 'Pronto: <code>fahr</code> recebe a lista completa.' };
          yield { l: 6, v: G, viz: Z(null), p: A.repr(G.fahr) };
        }
      } },
      { h3: 'Usando função como filtro' },
      { code: 'def eh_par(n):\n    return n % 2 == 0\n\nv = [3, 8, 5, 12, 7, 10]\npares = [n for n in v if eh_par(n)]\nprint(pares)', out: '[8, 12, 10]' },

      /* ---------- função como argumento ---------- */
      { h2: 'Função como argumento e lambda' },
      { html: '<p>Uma função pode ser <b>passada para outra</b>. <code>lambda</code> cria uma função de uma linha.</p>' },
      { code: 'nomes = ["Ana", "Bernardo", "Cris"]\nprint(sorted(nomes, key=len))   # ordena pelo tamanho\nprint(max(nomes, key=len))      # o nome mais longo\n\ndobro = lambda x: 2 * x         # função de uma linha\nprint([dobro(x) for x in [1, 2, 3]])', out: "['Ana', 'Cris', 'Bernardo']\nBernardo\n[2, 4, 6]" },
      { warn: '<p>Variáveis criadas <b>dentro</b> da função são locais: somem quando ela termina.</p>' }
    ],
    quiz: [
      { q: 'O que imprime?', code: 'def dobro(x):\n    return 2 * x\n\nprint(dobro(dobro(3)))', options: ['6', '12', '9', 'Erro'], answer: 1, explain: 'dobro(3) = 6, dobro(6) = 12.' },
      { q: 'O que imprime?', code: 'def f(x):\n    print(x + 1)\n\ny = f(4)\nprint(y)', options: ['5 e 5', '5 e None', 'None', '4 e 5'], answer: 1, explain: 'f imprime 5, mas não tem return, então devolve None.' },
      { q: 'O que imprime?', code: 'def f(a, b=10):\n    return a + b\n\nprint(f(5))', options: ['5', '15', 'Erro: falta b', '10'], answer: 1, explain: 'b não foi passado, então usa o padrão 10.' },
      { q: 'O que imprime?', code: 'def quad(x):\n    return x * x\n\nprint([quad(x) for x in range(4)])', options: ['[1, 4, 9, 16]', '[0, 1, 4, 9]', '[0, 2, 4, 6]', '16'], answer: 1, explain: 'range(4) = 0, 1, 2, 3 → quadrados 0, 1, 4, 9.' },
      { q: 'Depois de <code>a, b = min_max([5, 1, 8])</code>, quanto vale <code>b</code>?', options: ['1', '5', '8', '(1, 8)'], answer: 2, explain: 'A função devolve (1, 8): a recebe 1 e b recebe 8.' },
      { q: 'Uma variável criada dentro de uma função…', options: ['Existe no programa todo', 'É local: some quando a função termina', 'Vira global automaticamente', 'Não pode ser usada'], answer: 1 }
    ]
  });
})(window.ALG);
