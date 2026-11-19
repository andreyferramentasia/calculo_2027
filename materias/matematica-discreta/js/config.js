/* =========================================================
   Configuração da matéria Matemática Discreta.
   O motor (aulas, labs, quiz, desafio, playground) é o mesmo
   de todas as matérias, em ../../nucleo. Aqui ficam só os textos e o id.
   ========================================================= */
window.ALG = window.ALG || {};
window.ALG.MATERIA = 'discreta';                     // mesmo id de js/hub.js e de Questoes.gs
window.ALG.PARTIALS_BASE = '../../nucleo/partials/';

window.ALG.SITE = {
  titulo: 'Matemática Discreta',
  eyebrow: 'lógica · conjuntos · criptografia · big o',
  h1: 'A matemática que <span>roda</span> por trás do código.',
  intro: 'Lógica proposicional, demonstrações, indução, conjuntos, contagem, RSA e Big O, sempre com Python ao lado, tabelas que você monta e exemplos que você mexe.',
  hero: 'img/hero.svg',
  heroAlt: 'Ilustração de um grafo com os símbolos ∀, ∃, V/F e %'
};

window.ALG.PG_EXAMPLES = {
  'Tabela-verdade': 'from itertools import product\n\nprint("A     B     A -> B")\nfor A, B in product([True, False], repeat=2):\n    implica = (not A) or B\n    print(f"{A!s:5} {B!s:5} {implica}")',
  'Conjuntos': 'A = {1, 3, 5, 7, 9}\nB = {3, 5, 6, 10}\nprint("A ∪ B =", A | B)\nprint("A ∩ B =", A & B)\nprint("A − B =", A - B)\nprint("B ⊆ A?", B <= A)',
  'Contagem': 'from itertools import product, permutations, combinations\n\ndigitos = "0123456789"\nprint(len(list(product(digitos, repeat=4))))   # com repetição\nprint(len(list(permutations(digitos, 4))))     # sem repetição, ordem importa\nprint(len(list(combinations(digitos, 4))))     # sem repetição, ordem não importa',
  'Euclides (MDC)': 'def mdc(a, b):\n    while b != 0:\n        print(f"mdc({a}, {b})")\n        a, b = b, a % b\n    return a\n\nprint(mdc(420, 66))',
  'RSA completo': 'from math import gcd\n\np, q = 11, 13\nn = p * q\nfi = (p - 1) * (q - 1)\ne = [x for x in range(2, fi) if gcd(x, fi) == 1][0]\nd = pow(e, -1, fi)\nprint("pública", (e, n), "privada", (d, n))\n\nm = 42\nc = pow(m, e, n)\nprint("cifra:", c, "decifrada:", pow(c, d, n))',
  'Big O na prática': 'import time\n\nfor n in [1000, 2000, 4000]:\n    t = time.perf_counter()\n    passos = 0\n    for a in range(n):\n        for b in range(n):\n            passos += 1\n    print(n, passos, round(time.perf_counter() - t, 3), "s")'
};
