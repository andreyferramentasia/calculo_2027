/* Exercícios das aulas (5 por aula). Gerado e conferido rodando cada código. */
(function (A) {
  A.exercicios = {
    "introducao": [
      {
        "q": "O que aparece na tela?",
        "code": "print(\"A\")\nprint(\"B\")\nprint(\"C\")",
        "r": [
          "A B C"
        ],
        "sol": "Cada <code>print</code> roda na ordem, de cima para baixo, uma linha por vez.",
        "o": "A\nB\nC"
      },
      {
        "q": "O que aparece na tela?",
        "code": "print(10 - 2 * 3)",
        "r": [
          "4"
        ],
        "sol": "A multiplicação vem antes: 2 * 3 = 6, depois 10 - 6 = 4.",
        "o": "4"
      },
      {
        "q": "O que aparece na tela?",
        "code": "print(\"2 + 3\")",
        "r": [
          "2 + 3"
        ],
        "sol": "Entre aspas é <b>texto</b>: o Python mostra exatamente o que está escrito, sem calcular.",
        "o": "2 + 3"
      },
      {
        "q": "Quantas linhas aparecem na tela?",
        "code": "print(\"1\")\nprint(\"2\", \"3\")\nprint(\"4\")",
        "r": [
          "3"
        ],
        "sol": "São 3 <code>print</code>, e cada um gera uma linha. O segundo mostra <code>2 3</code> na mesma linha."
      },
      {
        "q": "O que aparece na tela?",
        "code": "x = 4\nx = x + 1\nprint(x * 2)",
        "r": [
          "10"
        ],
        "sol": "x começa em 4, vira 5, e 5 * 2 = 10.",
        "o": "10"
      }
    ],
    "variaveis": [
      {
        "q": "Qual o tipo de <code>3.0</code>? (int, float, str ou bool)",
        "r": [
          "float",
          "<class 'float'>"
        ],
        "sol": "Tem ponto decimal, então é <code>float</code>, mesmo sendo um número “redondo”."
      },
      {
        "q": "O que aparece na tela?",
        "code": "a = \"5\"\nb = 2\nprint(a * b)",
        "r": [
          "55"
        ],
        "sol": "<code>a</code> é texto. Texto * 2 repete o texto: <code>\"5\" * 2 = \"55\"</code>.",
        "o": "55"
      },
      {
        "q": "O que aparece na tela?",
        "code": "print(int(\"12\") + 3)",
        "r": [
          "15"
        ],
        "sol": "<code>int(\"12\")</code> converte o texto para o número 12; 12 + 3 = 15.",
        "o": "15"
      },
      {
        "q": "O que aparece na tela?",
        "code": "x = 7\nx = x + 3\nx = x * 2\nprint(x)",
        "r": [
          "20"
        ],
        "sol": "7 → 10 → 20. A variável guarda sempre o último valor atribuído.",
        "o": "20"
      },
      {
        "q": "O que aparece na tela?",
        "code": "print(int(3.9))",
        "r": [
          "3"
        ],
        "sol": "<code>int()</code> <b>corta</b> a parte decimal, não arredonda.",
        "o": "3"
      }
    ],
    "operadores": [
      {
        "q": "O que aparece na tela?",
        "code": "print(17 // 5)",
        "r": [
          "3"
        ],
        "sol": "<code>//</code> é a divisão inteira: 17 ÷ 5 = 3, resto 2.",
        "o": "3"
      },
      {
        "q": "O que aparece na tela?",
        "code": "print(10 > 3 and 2 > 5)",
        "r": [
          "False"
        ],
        "sol": "<code>and</code> só é True se os dois lados forem True. 2 > 5 é False.",
        "o": "False"
      },
      {
        "q": "O que aparece na tela?",
        "code": "print(17 % 5)",
        "r": [
          "2"
        ],
        "sol": "<code>%</code> dá o resto: 17 = 5 · 3 + <b>2</b>.",
        "o": "2"
      },
      {
        "q": "O que aparece na tela?",
        "code": "print(15 % 4 + 15 // 4)",
        "r": [
          "6"
        ],
        "sol": "15 % 4 = 3 e 15 // 4 = 3, então 3 + 3 = 6.",
        "o": "6"
      },
      {
        "q": "O que aparece na tela?",
        "code": "print(7 / 2)",
        "r": [
          "3.5"
        ],
        "sol": "<code>/</code> sempre devolve float: 3.5.",
        "o": "3.5"
      }
    ],
    "entrada-saida": [
      {
        "q": "O usuário digita <code>5</code>. O que aparece?",
        "code": "n = input()\nprint(n + n)",
        "r": [
          "55"
        ],
        "sol": "<code>input()</code> devolve <b>texto</b>. \"5\" + \"5\" junta os textos: 55.",
        "o": "55"
      },
      {
        "q": "O usuário digita <code>5</code>. O que aparece?",
        "code": "n = int(input())\nprint(n + n)",
        "r": [
          "10"
        ],
        "sol": "Com <code>int()</code> o texto vira número, então 5 + 5 = 10.",
        "o": "10"
      },
      {
        "q": "O que aparece na tela?",
        "code": "nome = \"Ana\"\nprint(f\"Oi, {nome}!\")",
        "r": [
          "Oi, Ana!"
        ],
        "sol": "Na f-string, <code>{nome}</code> é trocado pelo valor da variável.",
        "o": "Oi, Ana!"
      },
      {
        "q": "Complete a lacuna para a idade virar um número inteiro:",
        "code": "idade = ___(input(\"Idade: \"))",
        "r": [
          "int",
          "int()"
        ],
        "ph": "o que vai no ___",
        "sol": "<code>int(input(...))</code> lê o texto e converte para inteiro."
      },
      {
        "q": "O que aparece na tela?",
        "code": "preco = 4.5\nprint(f\"R$ {preco:.2f}\")",
        "r": [
          "R$ 4.50"
        ],
        "sol": "<code>:.2f</code> mostra o número com 2 casas decimais.",
        "o": "R$ 4.50"
      }
    ],
    "condicionais": [
      {
        "q": "O que aparece na tela?",
        "code": "x = 15\nif x > 10:\n    if x > 20:\n        print(\"A\")\n    else:\n        print(\"B\")\nelse:\n    print(\"C\")\nprint(\"D\")",
        "r": [
          "B D"
        ],
        "sol": "15 > 10 entra no if de fora; 15 > 20 é False, cai no else de dentro (B). O print(\"D\") está fora de tudo.",
        "o": "B\nD"
      },
      {
        "q": "O que aparece na tela?",
        "code": "x = 3\nif x > 5:\n    print(\"A\")\nelse:\n    print(\"B\")",
        "r": [
          "B"
        ],
        "sol": "3 > 5 é False, então roda o <code>else</code>.",
        "o": "B"
      },
      {
        "q": "O que aparece na tela?",
        "code": "nota = 7\nif nota >= 7:\n    print(\"Aprovado\")\nelif nota >= 4:\n    print(\"Recuperação\")\nelse:\n    print(\"Reprovado\")",
        "r": [
          "Aprovado"
        ],
        "sol": "7 >= 7 é True (o <b>igual</b> conta). Os outros casos nem são testados.",
        "o": "Aprovado"
      },
      {
        "q": "O que aparece na tela?",
        "code": "n = -4\nif n < 0:\n    n = -n\nif n > 3:\n    print(\"grande\")\nprint(n)",
        "r": [
          "grande 4"
        ],
        "sol": "São dois if separados: o primeiro troca o sinal (n = 4), o segundo testa 4 > 3 → imprime \"grande\". Depois imprime 4.",
        "o": "grande\n4"
      },
      {
        "q": "O que aparece na tela?",
        "code": "x = 12\nif x % 2 == 0 and x > 10:\n    print(\"sim\")\nelse:\n    print(\"não\")",
        "r": [
          "sim"
        ],
        "sol": "12 é par <b>e</b> maior que 10: as duas partes são True.",
        "o": "sim"
      }
    ],
    "while": [
      {
        "q": "O que aparece na tela?",
        "code": "i = 1\nwhile i <= 3:\n    print(i)\n    i = i + 1",
        "r": [
          "1 2 3"
        ],
        "sol": "Imprime e soma 1 até i virar 4, quando a condição fica False.",
        "o": "1\n2\n3"
      },
      {
        "q": "O que aparece na tela?",
        "code": "n = 20\nwhile n > 1:\n    n = n // 2\n    print(n)",
        "r": [
          "10 5 2 1"
        ],
        "sol": "20 → 10 → 5 → 2 → 1. Com n = 1 a condição <code>n > 1</code> fica False e o loop para.",
        "o": "10\n5\n2\n1"
      },
      {
        "q": "Quantas vezes aparece <code>oi</code>?",
        "code": "i = 0\nwhile i < 5:\n    print(\"oi\")\n    i = i + 1",
        "r": [
          "5"
        ],
        "sol": "i vale 0, 1, 2, 3, 4: são 5 voltas."
      },
      {
        "q": "O que aparece na tela?",
        "code": "soma = 0\ni = 1\nwhile i <= 4:\n    soma = soma + i\n    i = i + 1\nprint(soma)",
        "r": [
          "10"
        ],
        "sol": "Acumulador: 1 + 2 + 3 + 4 = 10.",
        "o": "10"
      },
      {
        "q": "O que aparece na tela?",
        "code": "x = 1\ncont = 0\nwhile x < 100:\n    x = x * 3\n    cont = cont + 1\nprint(cont)",
        "r": [
          "5"
        ],
        "sol": "x passa por 3, 9, 27, 81, 243. Foram 5 voltas até x ficar >= 100.",
        "o": "5"
      }
    ],
    "for-range": [
      {
        "q": "O que aparece na tela?",
        "code": "total = 1\nfor i in range(1, 5):\n    total = total * i\nprint(total)",
        "r": [
          "24"
        ],
        "sol": "range(1, 5) é 1, 2, 3, 4. Produto: 1·2·3·4 = 24.",
        "o": "24"
      },
      {
        "q": "O que aparece na tela?",
        "code": "for i in range(4):\n    print(i)",
        "r": [
          "0 1 2 3"
        ],
        "sol": "<code>range(4)</code> começa em 0 e <b>para antes</b> do 4.",
        "o": "0\n1\n2\n3"
      },
      {
        "q": "Complete para imprimir de 1 até 10:",
        "code": "for i in range(1, ___):\n    print(i)",
        "r": [
          "11"
        ],
        "ph": "o que vai no ___",
        "sol": "O fim do range não entra, então é preciso colocar 11."
      },
      {
        "q": "O que aparece na tela?",
        "code": "for i in range(10, 0, -3):\n    print(i)",
        "r": [
          "10 7 4 1"
        ],
        "sol": "Começa em 10 e anda de -3 enquanto for maior que 0: 10, 7, 4, 1.",
        "o": "10\n7\n4\n1"
      },
      {
        "q": "O que aparece na tela?",
        "code": "soma = 0\nfor x in [4, 1, 6]:\n    soma = soma + x\nprint(soma)",
        "r": [
          "11"
        ],
        "sol": "O for percorre a lista: 4 + 1 + 6 = 11.",
        "o": "11"
      }
    ],
    "loops-aninhados": [
      {
        "q": "Quantos <code>*</code> são impressos?",
        "code": "for i in range(2):\n    for j in range(3):\n        print(\"*\")",
        "r": [
          "6"
        ],
        "sol": "O de dentro dá 3 voltas para <b>cada</b> volta do de fora: 2 × 3 = 6."
      },
      {
        "q": "O que aparece na tela?",
        "code": "for i in range(1, 3):\n    for j in range(1, 3):\n        print(i * j)",
        "r": [
          "1 2 2 4"
        ],
        "sol": "Pares (i, j): (1,1), (1,2), (2,1), (2,2) → 1, 2, 2, 4.",
        "o": "1\n2\n2\n4"
      },
      {
        "q": "O que aparece na tela?",
        "code": "for i in range(1, 6):\n    if i == 3:\n        break\n    print(i)",
        "r": [
          "1 2"
        ],
        "sol": "<code>break</code> encerra o loop inteiro quando i chega em 3.",
        "o": "1\n2"
      },
      {
        "q": "O que aparece na tela?",
        "code": "for i in range(1, 6):\n    if i == 3:\n        continue\n    print(i)",
        "r": [
          "1 2 4 5"
        ],
        "sol": "<code>continue</code> pula só aquela volta; o loop segue com 4 e 5.",
        "o": "1\n2\n4\n5"
      },
      {
        "q": "O que aparece na tela?",
        "code": "cont = 0\nfor i in range(3):\n    for j in range(i):\n        cont = cont + 1\nprint(cont)",
        "r": [
          "3"
        ],
        "sol": "O de dentro roda i vezes: 0 + 1 + 2 = 3.",
        "o": "3"
      }
    ],
    "strings": [
      {
        "q": "O que aparece na tela?",
        "code": "s = \"python\"\nprint(s[0])",
        "r": [
          "p"
        ],
        "sol": "O primeiro índice é <b>0</b>.",
        "o": "p"
      },
      {
        "q": "O que aparece na tela?",
        "code": "palavra = \"banana\"\ncont = 0\nfor c in palavra:\n    if c == \"a\":\n        cont = cont + 1\nprint(cont)",
        "r": [
          "3"
        ],
        "sol": "O for passa letra por letra; \"banana\" tem três letras a.",
        "o": "3"
      },
      {
        "q": "O que aparece na tela?",
        "code": "s = \"python\"\nprint(s[-1])",
        "r": [
          "n"
        ],
        "sol": "Índice <b>-1</b> é o último caractere.",
        "o": "n"
      },
      {
        "q": "O que aparece na tela?",
        "code": "s = \"python\"\nprint(s[1:4])",
        "r": [
          "yth"
        ],
        "sol": "Fatia do índice 1 até o 3 (o 4 não entra): y, t, h.",
        "o": "yth"
      },
      {
        "q": "O que aparece na tela?",
        "code": "s = \"abcdef\"\nprint(s[2:] + s[:2])",
        "r": [
          "cdefab"
        ],
        "sol": "<code>s[2:]</code> = \"cdef\" e <code>s[:2]</code> = \"ab\". Juntando: \"cdefab\".",
        "o": "cdefab"
      }
    ],
    "listas": [
      {
        "q": "O que aparece na tela?",
        "code": "v = [3, 7, 2]\nv.append(5)\nprint(v)",
        "r": [
          "[3, 7, 2, 5]"
        ],
        "sol": "<code>append</code> coloca o novo valor no <b>final</b> da lista.",
        "o": "[3, 7, 2, 5]"
      },
      {
        "q": "O que aparece na tela?",
        "code": "print([x * 2 for x in range(4)])",
        "r": [
          "[0, 2, 4, 6]"
        ],
        "sol": "Para cada x em 0, 1, 2, 3, guarda x * 2.",
        "o": "[0, 2, 4, 6]"
      },
      {
        "q": "O que aparece na tela?",
        "code": "v = [10, 20, 30]\nprint(v[1])",
        "r": [
          "20"
        ],
        "sol": "Índices começam em 0: v[0] = 10, v[1] = 20.",
        "o": "20"
      },
      {
        "q": "O que aparece na tela?",
        "code": "v = [4, 9, 1, 7]\nm = v[0]\nfor x in v:\n    if x > m:\n        m = x\nprint(m)",
        "r": [
          "9"
        ],
        "sol": "Algoritmo do maior: m só é trocado quando aparece alguém maior. O maior é 9.",
        "o": "9"
      },
      {
        "q": "O que aparece na tela?",
        "code": "v = [1, 2, 3, 4, 5, 6]\nprint([x for x in v if x % 3 == 0])",
        "r": [
          "[3, 6]"
        ],
        "sol": "O <code>if</code> da comprehension filtra: só ficam os múltiplos de 3.",
        "o": "[3, 6]"
      }
    ],
    "funcoes": [
      {
        "q": "O que aparece na tela?",
        "code": "def soma(a, b):\n    print(a + b)\n\nr = soma(2, 3)\nprint(r)",
        "r": [
          "5 None"
        ],
        "sol": "A função <b>imprime</b> 5 mas não tem <code>return</code>, então devolve <code>None</code>.",
        "o": "5\nNone"
      },
      {
        "q": "O que aparece na tela?",
        "code": "def dobro(x):\n    return x * 2\n\nprint(dobro(5))",
        "r": [
          "10"
        ],
        "sol": "dobro(5) devolve 5 * 2 = 10.",
        "o": "10"
      },
      {
        "q": "O que aparece na tela?",
        "code": "def f(a, b=10):\n    return a + b\n\nprint(f(5))",
        "r": [
          "15"
        ],
        "sol": "b não foi passado, então usa o valor padrão 10: 5 + 10.",
        "o": "15"
      },
      {
        "q": "O que aparece na tela?",
        "code": "def quad(x):\n    return x * x\n\nprint([quad(i) for i in range(1, 4)])",
        "r": [
          "[1, 4, 9]"
        ],
        "sol": "Chama quad para 1, 2 e 3.",
        "o": "[1, 4, 9]"
      },
      {
        "q": "O que aparece na tela?",
        "code": "def min_max(v):\n    return min(v), max(v)\n\na, b = min_max([4, 1, 9])\nprint(b - a)",
        "r": [
          "8"
        ],
        "sol": "A função devolve (1, 9); a = 1, b = 9, e 9 - 1 = 8.",
        "o": "8"
      }
    ],
    "matrizes": [
      {
        "q": "O que aparece na tela?",
        "code": "m = [[1, 2, 3],\n     [4, 5, 6]]\nprint(m[1][0])",
        "r": [
          "4"
        ],
        "sol": "m[1] é a segunda linha [4, 5, 6]; o índice [0] dela é 4.",
        "o": "4"
      },
      {
        "q": "O que aparece na tela?",
        "code": "m = [[1, 2, 3],\n     [4, 5, 6],\n     [7, 8, 9]]\ns = 0\nfor i in range(3):\n    s = s + m[i][i]\nprint(s)",
        "r": [
          "15"
        ],
        "sol": "Diagonal principal: m[0][0] + m[1][1] + m[2][2] = 1 + 5 + 9.",
        "o": "15"
      },
      {
        "q": "O que aparece na tela?",
        "code": "m = [[1, 2, 3],\n     [4, 5, 6]]\nprint(len(m[0]))",
        "r": [
          "3"
        ],
        "sol": "<code>m[0]</code> é uma linha; o tamanho dela é o número de colunas.",
        "o": "3"
      },
      {
        "q": "O que aparece na tela?",
        "code": "m = [[1, 2, 3],\n     [4, 5, 6]]\ntotal = 0\nfor linha in m:\n    for x in linha:\n        total = total + x\nprint(total)",
        "r": [
          "21"
        ],
        "sol": "Os dois loops passam por todos os elementos: 1+2+3+4+5+6 = 21.",
        "o": "21"
      },
      {
        "q": "O que aparece na tela?",
        "code": "m = [[1, 2, 3],\n     [4, 5, 6]]\nm[0][2] = 9\nprint(m[0])",
        "r": [
          "[1, 2, 9]"
        ],
        "sol": "Linha 0, coluna 2 foi trocada de 3 para 9.",
        "o": "[1, 2, 9]"
      }
    ],
    "operacoes-matrizes": [
      {
        "q": "A = [[1, 2], [3, 4]] e B = [[5, 6], [7, 8]]. Quanto vale <code>(A + B)[0][1]</code>?",
        "r": [
          "8"
        ],
        "sol": "Soma posição por posição: A[0][1] + B[0][1] = 2 + 6 = 8."
      },
      {
        "q": "Com os mesmos A e B, quanto vale o elemento [0][0] de <b>A × B</b>?",
        "r": [
          "19"
        ],
        "sol": "Linha 0 de A · coluna 0 de B: 1·5 + 2·7 = 19."
      },
      {
        "q": "Qual a transposta de <code>[[1, 2], [3, 4]]</code>?",
        "r": [
          "[[1, 3], [2, 4]]"
        ],
        "sol": "Linhas viram colunas: a primeira coluna (1, 3) vira a primeira linha."
      },
      {
        "q": "Uma matriz 2×3 vezes uma 3×4 dá uma matriz de que tamanho?",
        "r": [
          "2x4",
          "2 x 4",
          "2×4"
        ],
        "ph": "ex.: 5x5",
        "sol": "(m×<b>n</b>)·(<b>n</b>×p) = m×p → 2×4."
      },
      {
        "q": "Com os mesmos A e B, quanto vale o elemento [1][1] de <b>A × B</b>?",
        "r": [
          "50"
        ],
        "sol": "Linha 1 de A · coluna 1 de B: 3·6 + 4·8 = 18 + 32 = 50."
      }
    ],
    "math-random": [
      {
        "q": "O que aparece na tela?",
        "code": "import math\nprint(math.sqrt(16))",
        "r": [
          "4.0"
        ],
        "sol": "<code>math.sqrt</code> sempre devolve float: 4.0.",
        "o": "4.0"
      },
      {
        "q": "O que aparece na tela?",
        "code": "import math\nprint(round(math.pi, 2))",
        "r": [
          "3.14"
        ],
        "sol": "<code>round(x, 2)</code> arredonda para 2 casas.",
        "o": "3.14"
      },
      {
        "q": "O que aparece na tela?",
        "code": "import math\nprint(math.floor(3.7))",
        "r": [
          "3"
        ],
        "sol": "floor arredonda para <b>baixo</b>.",
        "o": "3"
      },
      {
        "q": "O que aparece na tela?",
        "code": "import math\nprint(math.ceil(3.2))",
        "r": [
          "4"
        ],
        "sol": "ceil arredonda para <b>cima</b>.",
        "o": "4"
      },
      {
        "q": "Quantos valores diferentes <code>random.randint(1, 6)</code> pode devolver?",
        "r": [
          "6"
        ],
        "sol": "No randint os <b>dois</b> extremos entram: 1, 2, 3, 4, 5, 6."
      }
    ],
    "numpy": [
      {
        "q": "O que aparece na tela?",
        "code": "import numpy as np\na = np.array([1, 2, 3])\nprint(a * 2)",
        "r": [
          "[2 4 6]"
        ],
        "sol": "Vetorização: a conta é feita em cada elemento, sem for.",
        "o": "[2 4 6]"
      },
      {
        "q": "O que aparece na tela?",
        "code": "import numpy as np\na = np.arange(1, 5)\nprint(a.mean())",
        "r": [
          "2.5"
        ],
        "sol": "arange(1, 5) = [1 2 3 4]; média = 10 / 4 = 2.5.",
        "o": "2.5"
      },
      {
        "q": "O que aparece na tela?",
        "code": "import numpy as np\na = np.array([1, 2, 3])\nb = np.array([10, 20, 30])\nprint(a + b)",
        "r": [
          "[11 22 33]"
        ],
        "sol": "Soma elemento a elemento.",
        "o": "[11 22 33]"
      },
      {
        "q": "O que aparece na tela?",
        "code": "import numpy as np\nm = np.arange(6).reshape(2, 3)\nprint(m.shape)",
        "r": [
          "(2, 3)"
        ],
        "sol": "<code>.shape</code> mostra (linhas, colunas).",
        "o": "(2, 3)"
      },
      {
        "q": "O que aparece na tela?",
        "code": "import numpy as np\nprint(np.array([1, 2, 3]) @ np.array([4, 5, 6]))",
        "r": [
          "32"
        ],
        "sol": "Com vetores, @ é o produto escalar: 1·4 + 2·5 + 3·6 = 32.",
        "o": "32"
      }
    ]
  };
})(window.ALG);
