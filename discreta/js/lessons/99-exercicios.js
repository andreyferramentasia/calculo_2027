/* Exercícios das aulas de Matemática Discreta (5 por aula).
   Gerado e conferido rodando cada código em Python. */
(function (A) {
  A.exercicios = A.exercicios || {};
  A.exercicios["logica"] = [
    {
      "q": "Com A = V e B = F, qual o valor de <code>A ∧ B</code>? (V ou F)",
      "r": [
        "F",
        "falso",
        "false"
      ],
      "ph": "V ou F",
      "sol": "A conjunção só é V quando as <b>duas</b> partes são V. Como B é F, o resultado é F."
    },
    {
      "q": "O que aparece na tela?",
      "code": "A = True\nB = False\nprint(A or B, A and B)",
      "sol": "<code>or</code> precisa de pelo menos um True; <code>and</code> precisa dos dois.",
      "o": "True False",
      "r": [
        "True False"
      ]
    },
    {
      "q": "Quantas linhas tem a tabela-verdade de <code>(A ∧ B) ∨ C′</code>?",
      "r": [
        "8"
      ],
      "ph": "número",
      "sol": "São 3 letras diferentes (A, B, C): 2³ = 8 linhas."
    },
    {
      "q": "O condicional A → B em Python é <code>(not A) or B</code>. O que aparece na tela?",
      "code": "A = True\nB = False\nprint((not A) or B)",
      "sol": "É o único caso falso do condicional: A verdadeira levando a B falsa. <code>not True or False</code> = <code>False or False</code> = False.",
      "o": "False",
      "r": [
        "False"
      ]
    },
    {
      "q": "Quantas das 4 linhas confirmam a lei de De Morgan? O que aparece na tela?",
      "code": "cont = 0\nfor A in [True, False]:\n    for B in [True, False]:\n        if (not (A or B)) == ((not A) and (not B)):\n            cont += 1\nprint(cont)",
      "sol": "(A ∨ B)′ ⇔ A′ ∧ B′ vale em <b>todas</b> as linhas: é uma tautologia, então conta 4.",
      "o": "4",
      "r": [
        "4"
      ]
    }
  ];
  A.exercicios["demonstracao"] = [
    {
      "q": "Qual é o menor inteiro positivo n que é <b>contraexemplo</b> de \"n! ≤ n²\"?",
      "r": [
        "4"
      ],
      "ph": "número",
      "sol": "1! = 1 ≤ 1, 2! = 2 ≤ 4, 3! = 6 ≤ 9, mas 4! = 24 &gt; 16."
    },
    {
      "q": "O que aparece na tela?",
      "code": "for n in range(1, 21):\n    if n % 6 == 0:\n        print(n)",
      "sol": "Entre 1 e 20, os múltiplos de 6 são 6, 12 e 18 (é a lista da demonstração por exaustão).",
      "o": "6\n12\n18",
      "r": [
        "6 12 18"
      ]
    },
    {
      "q": "Complete a contrapositiva de \"se chove, então a rua molha\": \"se a rua não molha, então ___\".",
      "r": [
        "não chove",
        "nao chove",
        "não choveu",
        "nao choveu"
      ],
      "ph": "complete a frase",
      "sol": "A contrapositiva de A → B é B′ → A′: se a rua <b>não</b> molha, então <b>não chove</b>."
    },
    {
      "q": "O que aparece na tela?",
      "code": "def eh_par(n):\n    return n % 2 == 0\n\nprint(eh_par(3 * 4), eh_par(3 * 5))",
      "sol": "3 · 4 = 12 é par; 3 · 5 = 15 é ímpar. Se pelo menos um fator é par, o produto é par.",
      "o": "True False",
      "r": [
        "True False"
      ]
    },
    {
      "q": "Testando a contrapositiva \"n não divisível por 3 → n² não divisível por 3\". O que aparece na tela?",
      "code": "cont = 0\nfor n in range(1, 31):\n    if n % 3 != 0 and (n ** 2) % 3 != 0:\n        cont += 1\nprint(cont)",
      "sol": "De 1 a 30 há 20 números não divisíveis por 3, e para <b>todos</b> eles n² também não é. A contrapositiva valeu em todos os casos testados.",
      "o": "20",
      "r": [
        "20"
      ]
    }
  ];
  A.exercicios["quantificadores"] = [
    {
      "q": "O que aparece na tela?",
      "code": "print(all(x > 0 for x in [3, 1, 4]), any(x > 3 for x in [3, 1, 4]))",
      "sol": "Todos são positivos (∀ é True) e existe um maior que 3, o 4 (∃ é True).",
      "o": "True True",
      "r": [
        "True True"
      ]
    },
    {
      "q": "No domínio {1, 2, 3}, a fórmula <code>(∀x)(x &lt; 3)</code> é V ou F?",
      "r": [
        "F",
        "falso",
        "false"
      ],
      "ph": "V ou F",
      "sol": "x = 3 não é menor que 3: basta um elemento falhar para o \"para todo\" ser F."
    },
    {
      "q": "O que aparece na tela?",
      "code": "dominio = [2, 4, 6, 7]\nprint(all(x % 2 == 0 for x in dominio))",
      "sol": "O 7 é ímpar: o <code>all</code> encontra um que falha e devolve False.",
      "o": "False",
      "r": [
        "False"
      ]
    },
    {
      "q": "Complete a negação de \"existe um aluno que faltou\": \"todo aluno ___\".",
      "r": [
        "não faltou",
        "nao faltou"
      ],
      "ph": "complete a frase",
      "sol": "[(∃x)P(x)]′ ⇔ (∀x)[P(x)]′: a negação de \"existe quem faltou\" é \"<b>todo</b> aluno <b>não faltou</b>\"."
    },
    {
      "q": "Quantos x do domínio satisfazem o predicado? O que aparece na tela?",
      "code": "dominio = range(1, 11)\nprint(sum(1 for x in dominio if x % 3 == 0))",
      "sol": "De 1 a 10, os múltiplos de 3 são 3, 6 e 9: três elementos tornam o predicado verdadeiro.",
      "o": "3",
      "r": [
        "3"
      ]
    }
  ];
  A.exercicios["inducao"] = [
    {
      "q": "O que aparece na tela?",
      "code": "def f(n):\n    if n == 1:\n        return 2\n    return 2 * f(n - 1)\n\nprint(f(5))",
      "sol": "f(n) = 2ⁿ (é a árvore genealógica da aula): 2⁵ = 32.",
      "o": "32",
      "r": [
        "32"
      ]
    },
    {
      "q": "Quanto vale 1 + 3 + 5 + … + 19 (os 10 primeiros ímpares)?",
      "r": [
        "100"
      ],
      "ph": "número",
      "sol": "Pela fórmula provada por indução, a soma dos n primeiros ímpares é n² = 10² = 100."
    },
    {
      "q": "Como se chama o caso que faz a recursão parar (e a indução começar)?",
      "r": [
        "caso base",
        "base",
        "base da indução",
        "base da inducao"
      ],
      "ph": "nome",
      "sol": "É o <b>caso base</b>: sem ele, a recursão nunca para e o dominó nunca começa a cair."
    },
    {
      "q": "O que aparece na tela?",
      "code": "def fatorial(n):\n    if n == 1:\n        return 1\n    return n * fatorial(n - 1)\n\nprint(fatorial(5))",
      "sol": "5! = 5 · 4 · 3 · 2 · 1 = 120.",
      "o": "120",
      "r": [
        "120"
      ]
    },
    {
      "q": "O que aparece na tela?",
      "code": "def soma(n):\n    if n == 1:\n        return 1\n    return n + soma(n - 1)\n\nprint(soma(100))",
      "sol": "Soma 1 + 2 + … + 100 = 100 · 101 / 2 = 5050 (outra fórmula que se prova por indução).",
      "o": "5050",
      "r": [
        "5050"
      ]
    }
  ];
  A.exercicios["conjuntos"] = [
    {
      "q": "O que aparece na tela?",
      "code": "A = {1, 2, 3, 4}\nB = {3, 4, 5}\nprint(A & B)",
      "sol": "<code>&amp;</code> é a interseção: só 3 e 4 estão nos dois.",
      "o": "{3, 4}",
      "r": [
        "{3, 4}"
      ]
    },
    {
      "q": "O que aparece na tela?",
      "code": "A = {1, 2, 3, 4}\nB = {3, 4, 5}\nprint(A - B)",
      "sol": "A − B: o que está em A e não está em B.",
      "o": "{1, 2}",
      "r": [
        "{1, 2}"
      ]
    },
    {
      "q": "Quantos elementos tem o conjunto {1, 1, 2, 2, 3}?",
      "r": [
        "3"
      ],
      "ph": "número",
      "sol": "Repetir não muda nada: o conjunto é {1, 2, 3}."
    },
    {
      "q": "O que aparece na tela?",
      "code": "print({1, 2} <= {1, 2, 3}, {1, 4} <= {1, 2, 3})",
      "sol": "<code>&lt;=</code> é ⊆. {1, 2} cabe em {1, 2, 3}; {1, 4} não, porque 4 ∉ {1, 2, 3}.",
      "o": "True False",
      "r": [
        "True False"
      ]
    },
    {
      "q": "O que aparece na tela?",
      "code": "from itertools import product\nprint(len(list(product([1, 2, 3], [\"a\", \"b\"]))))",
      "sol": "Produto cartesiano: |A × B| = |A| · |B| = 3 · 2 = 6 pares.",
      "o": "6",
      "r": [
        "6"
      ]
    }
  ];
  A.exercicios["contagem"] = [
    {
      "q": "Quantas senhas de 3 dígitos (0–9) existem, podendo repetir dígito?",
      "r": [
        "1000",
        "1.000"
      ],
      "ph": "número",
      "sol": "Princípio da multiplicação: 10 · 10 · 10 = 1000."
    },
    {
      "q": "Uma lanchonete tem 4 tipos de pão e 3 recheios. Quantos lanches com 1 pão e 1 recheio?",
      "r": [
        "12"
      ],
      "ph": "número",
      "sol": "Uma escolha e depois outra: 4 · 3 = 12."
    },
    {
      "q": "Você vai ler <b>um</b> livro: há 6 de romance e 5 de terror. Quantas opções?",
      "r": [
        "11"
      ],
      "ph": "número",
      "sol": "Casos disjuntos (romance <b>ou</b> terror): princípio da adição, 6 + 5 = 11."
    },
    {
      "q": "O que aparece na tela?",
      "code": "from itertools import permutations\nprint(len(list(permutations(\"ABCDE\", 2))))",
      "sol": "Sem repetição e com ordem: 5 opções para a 1ª letra e 4 para a 2ª: 5 · 4 = 20.",
      "o": "20",
      "r": [
        "20"
      ]
    },
    {
      "q": "Quantas senhas de 3 dígitos têm <b>pelo menos um</b> dígito repetido?",
      "r": [
        "280"
      ],
      "ph": "número",
      "sol": "Conte o contrário: total 10³ = 1000, sem repetição 10 · 9 · 8 = 720. 1000 − 720 = 280."
    }
  ];
  A.exercicios["rsa-fundamentos"] = [
    {
      "q": "O que aparece na tela?",
      "code": "print(17 % 5, 20 % 4)",
      "sol": "17 = 3 · 5 + <b>2</b> e 20 = 5 · 4 + <b>0</b>.",
      "o": "2 0",
      "r": [
        "2 0"
      ]
    },
    {
      "q": "O que aparece na tela?",
      "code": "print([i for i in range(1, 11) if 10 % i == 0])",
      "sol": "São os divisores de 10: os i que deixam resto 0.",
      "o": "[1, 2, 5, 10]",
      "r": [
        "[1, 2, 5, 10]"
      ]
    },
    {
      "q": "Quanto vale mdc(48, 18)?",
      "r": [
        "6"
      ],
      "ph": "número",
      "sol": "Euclides: (48, 18) → (18, 12) → (12, 6) → (6, 0). O mdc é 6."
    },
    {
      "q": "Quanto vale φ(7)?",
      "r": [
        "6"
      ],
      "ph": "número",
      "sol": "7 é primo, então φ(7) = 7 − 1 = 6 (1, 2, 3, 4, 5 e 6 são coprimos com 7)."
    },
    {
      "q": "O que aparece na tela?",
      "code": "def mdc(a, b):\n    while b != 0:\n        a, b = b, a % b\n    return a\n\nprint(mdc(1071, 462))",
      "sol": "(1071, 462) → (462, 147) → (147, 21) → (21, 0). O mdc é 21.",
      "o": "21",
      "r": [
        "21"
      ]
    }
  ];
  A.exercicios["rsa-receita"] = [
    {
      "q": "Com p = 5 e q = 7, quanto vale n?",
      "r": [
        "35"
      ],
      "ph": "número",
      "sol": "n = p · q = 5 · 7 = 35."
    },
    {
      "q": "Com p = 5 e q = 7, quanto vale φ(n)?",
      "r": [
        "24"
      ],
      "ph": "número",
      "sol": "φ(n) = (p − 1)(q − 1) = 4 · 6 = 24."
    },
    {
      "q": "O que aparece na tela?",
      "code": "print(pow(2, 5, 7))",
      "sol": "2⁵ = 32 e 32 = 4 · 7 + 4. Então 2⁵ mod 7 = 4.",
      "o": "4",
      "r": [
        "4"
      ]
    },
    {
      "q": "Com φ = 24, qual é o <b>menor</b> e válido (1 &lt; e &lt; φ e coprimo com φ)?",
      "r": [
        "5"
      ],
      "ph": "número",
      "sol": "2, 3 e 4 têm fator comum com 24 (24 = 2³ · 3). O primeiro coprimo é 5."
    },
    {
      "q": "O que aparece na tela?",
      "code": "e = 5\nfi = 24\nd = 1\nwhile (e * d) % fi != 1:\n    d = d + 1\nprint(d)",
      "sol": "5 · 5 = 25 e 25 mod 24 = 1. Aqui a chave privada d é igual a e.",
      "o": "5",
      "r": [
        "5"
      ]
    }
  ];
  A.exercicios["big-o"] = [
    {
      "q": "Qual o Big O de um laço que passa <b>uma vez</b> por todos os n itens?",
      "r": [
        "O(n)",
        "n",
        "linear"
      ],
      "ph": "ex.: O(1)",
      "sol": "Um passo por item: dobrou n, dobrou o trabalho. É O(n)."
    },
    {
      "q": "O que aparece na tela?",
      "code": "passos = 0\nfor a in range(5):\n    for b in range(5):\n        passos += 1\nprint(passos)",
      "sol": "Laço dentro de laço: 5 · 5 = 25 passos. É O(n²).",
      "o": "25",
      "r": [
        "25"
      ]
    },
    {
      "q": "Quantas vezes dá para cortar 16 pela metade até chegar em 1?",
      "r": [
        "4"
      ],
      "ph": "número",
      "sol": "16 → 8 → 4 → 2 → 1: 4 cortes. log₂ 16 = 4. É o que a busca binária faz."
    },
    {
      "q": "Um código faz 2n² + 3n + 10 passos. Qual o Big O?",
      "r": [
        "O(n²)",
        "O(n^2)",
        "O(n**2)",
        "n²",
        "n^2",
        "quadrático",
        "quadratico"
      ],
      "ph": "ex.: O(n)",
      "sol": "Fica só a parte que mais cresce, sem a constante: O(n²)."
    },
    {
      "q": "O que aparece na tela?",
      "code": "passos = 0\nn = 8\nwhile n > 1:\n    n = n // 2\n    passos += 1\nprint(passos)",
      "sol": "8 → 4 → 2 → 1: 3 voltas. Um laço que corta n pela metade é O(log n).",
      "o": "3",
      "r": [
        "3"
      ]
    }
  ];
})(window.ALG);
