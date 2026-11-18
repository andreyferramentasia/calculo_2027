/* Aula 12 — Funções e recursão */
(function (A) {
  var FN = A.FN;
  A.lesson({
    id: 'funcoes', module: 'm3', num: 12, minutes: 25,
    title: 'Funções e recursão',
    goals: ['def · return', 'Pilha de chamadas', 'Recursão'],
    body: [
      { code: 'def soma(a, b):      # parâmetros\n    return a + b     # devolve o resultado\n\nx = soma(3, 4)       # x recebe 7', playground: false },
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
      { h2: 'Recursão' },
      { html: '<p>Função que chama a si mesma. Precisa de um <b>caso base</b> para parar.</p>' },
      { lab: {
        title: 'Fatorial recursivo',
        params: { n: 4 },
        viz: 'stack',
        code: function (P) { return 'def fatorial(n):\n    if n <= 1:\n        return 1\n    return n * fatorial(n - 1)\n\nprint(fatorial(' + Math.max(1, Math.min(7, Math.trunc(P.n))) + '))'; },
        gen: function* (P) {
          var N = Math.max(1, Math.min(7, Math.trunc(P.n)));
          var G = { fatorial: FN('fatorial') };
          var frames = [{ name: '<módulo principal>', vars: {} }];
          function S() { return { frames: frames }; }
          yield { l: 1, v: G, viz: S(), n: 'Definição da função.' };
          yield { l: 6, v: G, viz: S(), n: 'Chamamos <code>fatorial(' + N + ')</code>.' };
          function* fat(n) {
            frames.push({ name: 'fatorial(' + n + ')', vars: { n: n } });
            yield { l: 1, v: G, viz: S(), n: 'Novo quadro: <code>fatorial(' + n + ')</code>. Pilha com ' + (frames.length - 1) + ' chamada(s) ativa(s).' };
            var c = n <= 1;
            yield { l: 2, v: G, c: ['n <= 1', c], viz: S(), n: c ? '<b>Caso base!</b> Aqui a recursão para de descer.' : 'Ainda não é o caso base: precisa de fatorial(' + (n - 1) + ').' };
            if (c) {
              frames[frames.length - 1].ret = 1;
              yield { l: 3, v: G, viz: S(), n: 'Retorna <b>1</b>. Agora a pilha começa a <b>desmontar</b>.' };
              frames.pop();
              return 1;
            }
            yield { l: 4, v: G, viz: S(), n: 'Para calcular ' + n + ' × fatorial(' + (n - 1) + '), a função <b>pausa</b> e chama a si mesma.' };
            var sub = yield* fat(n - 1);
            frames[frames.length - 1].ret = n * sub;
            yield { l: 4, v: G, viz: S(), n: 'fatorial(' + (n - 1) + ') devolveu ' + sub + '. Então ' + n + ' × ' + sub + ' = <b>' + (n * sub) + '</b>.' };
            frames.pop();
            return n * sub;
          }
          var r = yield* fat(N);
          yield { l: 6, v: G, viz: S(), p: String(r), n: N + '! = <b>' + r + '</b>' };
        }
      } },
      { warn: '<p>Sem caso base → <code>RecursionError</code>.</p>' },
    ],
    quiz: [
      { q: 'O que imprime?', code: 'def dobro(x):\n    return 2 * x\n\nprint(dobro(dobro(3)))', options: ['6', '12', '9', 'Erro'], answer: 1, explain: 'dobro(3) = 6, dobro(6) = 12.' },
      { q: 'O que imprime?', code: 'def f(x):\n    print(x + 1)\n\ny = f(4)\nprint(y)', options: ['5 e 5', '5 e None', 'None', '4 e 5'], answer: 1, explain: 'f imprime 5, mas não tem return, então devolve None.' },
      { q: 'Em uma função recursiva, o caso base serve para…', options: ['Acelerar a função', 'Parar a recursão', 'Criar variáveis globais', 'Imprimir o resultado'], answer: 1 },
      { q: 'Uma variável criada dentro de uma função…', options: ['Existe no programa todo', 'É local: some quando a função termina', 'Vira global automaticamente', 'Não pode ser usada'], answer: 1 }
    ]
  });
})(window.ALG);
