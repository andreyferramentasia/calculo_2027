/* Exercícios das aulas de Probabilidade e Estatística (5 por aula).
   Gerado e conferido rodando cada código em Python. */
(function (A) {
  A.exercicios = A.exercicios || {};
  A.exercicios["estatistica-dia-a-dia"] = [
    {
      "q": "Em um vídeo, 42 das 50 pessoas que assistiram até o fim deixaram like. Qual o percentual de curtidas?",
      "r": [
        "84",
        "84%",
        "84.0",
        "84,0",
        "84,0%"
      ],
      "ph": "número",
      "sol": "42 ÷ 50 × 100 = 84%."
    },
    {
      "q": "Taxa de quedas de conexão por mil acessos. O que aparece na tela?",
      "code": "print(34 / 8500 * 1000)",
      "sol": "34 ÷ 8.500 = 0,004; × 1.000 = 4 quedas a cada mil acessos.",
      "o": "4.0",
      "r": [
        "4.0"
      ]
    },
    {
      "q": "\"3 cancelamentos a cada 100 assinantes\" é uma contagem ou uma taxa?",
      "r": [
        "taxa",
        "uma taxa"
      ],
      "ph": "contagem ou taxa",
      "sol": "Está relativizado a uma base (100 assinantes): é uma <b>taxa</b>."
    },
    {
      "q": "A reportagem dizia \"18% da amostra\". Refaça a conta. O que aparece na tela?",
      "code": "parte = 2800\ntodo = 2200\nprint(round(parte / todo * 100))",
      "sol": "Dá 127%: impossível, a parte é maior que o todo. A reportagem errou a conta.",
      "o": "127",
      "r": [
        "127"
      ]
    },
    {
      "q": "Qual app trava mais proporcionalmente? O que aparece na tela?",
      "code": "a = 18 / 12000 * 1000\nb = 12 / 3000 * 1000\nif a > b:\n    print(\"A\")\nelse:\n    print(\"B\")",
      "sol": "Taxa A = 1,5 por mil; taxa B = 4 por mil. A contagem (18 &gt; 12) enganava: quem está pior é o B.",
      "o": "B",
      "r": [
        "B"
      ]
    }
  ];
  A.exercicios["processo-estatistico"] = [
    {
      "q": "Qual a margem de erro aproximada (100 ÷ √n) de uma amostra de 400 pessoas, em pontos percentuais?",
      "r": [
        "5",
        "5.0",
        "5,0"
      ],
      "ph": "número",
      "sol": "√400 = 20 e 100 ÷ 20 = 5 pontos percentuais."
    },
    {
      "q": "\"Sistema operacional do celular\" é dado numérico ou categórico?",
      "r": [
        "categórico",
        "categorico"
      ],
      "ph": "numérico ou categórico",
      "sol": "É um rótulo (Android, iOS): <b>categórico</b>. Mesmo com códigos 1 e 2, a média não teria sentido."
    },
    {
      "q": "O que aparece na tela?",
      "code": "import math\nprint(100 / math.sqrt(2500))",
      "sol": "√2500 = 50 e 100 ÷ 50 = 2: com 2.500 pessoas a margem cai para 2 pontos.",
      "o": "2.0",
      "r": [
        "2.0"
      ]
    },
    {
      "q": "A renda média de <b>todas</b> as famílias do país é um parâmetro ou uma estatística?",
      "r": [
        "parâmetro",
        "parametro"
      ],
      "ph": "parâmetro ou estatística",
      "sol": "Número que resume a <b>população inteira</b> é <b>parâmetro</b>; o da amostra é estatística."
    },
    {
      "q": "O que aparece na tela?",
      "code": "import math\nm = 100 / math.sqrt(150)\nprint(round(m, 1), m > 8)",
      "sol": "√150 ≈ 12,2 e 100 ÷ 12,2 ≈ 8,2: acima de 8 pontos, amostra pequena demais para um número exato.",
      "o": "8.2 True",
      "r": [
        "8.2 True"
      ]
    }
  ];
  A.exercicios["medidas"] = [
    {
      "q": "O que aparece na tela?",
      "code": "import statistics\nprint(statistics.mean([2, 2, 3, 3, 5]))",
      "sol": "(2 + 2 + 3 + 3 + 5) ÷ 5 = 15 ÷ 5 = 3.",
      "o": "3",
      "r": [
        "3"
      ]
    },
    {
      "q": "Qual a mediana de 10, 12, 11, 13, 12, 90?",
      "r": [
        "12",
        "12.0",
        "12,0"
      ],
      "ph": "número",
      "sol": "Ordenando: 10, 11, 12, 12, 13, 90. São 6 valores: média dos dois do meio, (12 + 12) ÷ 2 = 12."
    },
    {
      "q": "O que aparece na tela?",
      "code": "import statistics\nprint(statistics.median([40, 45, 50, 52, 58, 60]))",
      "sol": "n par: média dos dois do meio, (50 + 52) ÷ 2 = 51.0.",
      "o": "51.0",
      "r": [
        "51.0"
      ]
    },
    {
      "q": "Qual o desvio padrão de 5, 5, 5, 5?",
      "r": [
        "0",
        "0.0",
        "0,0",
        "zero"
      ],
      "ph": "número",
      "sol": "Todos iguais: nenhum valor se afasta da média, então o desvio padrão é 0."
    },
    {
      "q": "Uma avaliação viralizou. O que aparece na tela?",
      "code": "import statistics\nc = [10, 12, 11, 13, 12, 90]\nprint(round(statistics.mean(c), 1), statistics.median(c))",
      "sol": "O 90 puxa a média para 24,7, mas a mediana continua 12: sinal claro de outlier.",
      "o": "24.7 12.0",
      "r": [
        "24.7 12.0"
      ]
    }
  ];
  A.exercicios["graficos-categoricos"] = [
    {
      "q": "100 de 250 usuários usam mais o Instagram. Qual o percentual da fatia?",
      "r": [
        "40",
        "40%",
        "40.0",
        "40,0"
      ],
      "ph": "número",
      "sol": "100 ÷ 250 × 100 = 40%."
    },
    {
      "q": "Quantos graus tem uma fatia de 40% num gráfico de pizza?",
      "r": [
        "144",
        "144°",
        "144 graus"
      ],
      "ph": "graus",
      "sol": "40 × 3,6° = 144°."
    },
    {
      "q": "O que aparece na tela?",
      "code": "generos = {\"Ação\": 32, \"Comédia\": 24, \"Drama\": 16, \"Terror\": 8}\nprint(generos[\"Ação\"] / sum(generos.values()) * 100)",
      "sol": "Total 80; 32 ÷ 80 × 100 = 40.0%.",
      "o": "40.0",
      "r": [
        "40.0"
      ]
    },
    {
      "q": "Numa pesquisa em que cada pessoa pode marcar várias respostas, qual gráfico usar: pizza ou barras?",
      "r": [
        "barras",
        "barra",
        "gráfico de barras",
        "grafico de barras"
      ],
      "ph": "pizza ou barras",
      "sol": "Os percentuais podem somar mais de 100%: só as <b>barras</b> representam isso corretamente."
    },
    {
      "q": "O que aparece na tela?",
      "code": "print(round(20 / 150 * 100, 1))",
      "sol": "20 avaliações de 3 estrelas em 150: 13,3%.",
      "o": "13.3",
      "r": [
        "13.3"
      ]
    }
  ];
  A.exercicios["graficos-numericos"] = [
    {
      "q": "Com Q1 = 2,5 e Q3 = 5,5, quanto vale o IQR?",
      "r": [
        "3",
        "3.0",
        "3,0"
      ],
      "ph": "número",
      "sol": "IQR = Q3 − Q1 = 5,5 − 2,5 = 3."
    },
    {
      "q": "Com Q3 = 9,5 e IQR = 3,5, a partir de que valor um dado é outlier por cima? (Q3 + 1,5 · IQR)",
      "r": [
        "14.75",
        "14,75"
      ],
      "ph": "número",
      "sol": "9,5 + 1,5 × 3,5 = 9,5 + 5,25 = 14,75."
    },
    {
      "q": "O que aparece na tela?",
      "code": "import statistics\nprint(statistics.median([3, 5, 5, 6, 7, 8, 20]))",
      "sol": "n = 7: o do meio (4º valor) é 6.",
      "o": "6",
      "r": [
        "6"
      ]
    },
    {
      "q": "Histograma com cauda longa à direita: a média fica maior ou menor que a mediana?",
      "r": [
        "maior",
        "maior que a mediana"
      ],
      "ph": "maior ou menor",
      "sol": "Poucos valores altos puxam a média para cima: média <b>maior</b> que a mediana."
    },
    {
      "q": "Tempos de 8 chamados. O que aparece na tela?",
      "code": "import statistics\nd = [5, 6, 6, 7, 8, 9, 10, 40]\nq1 = statistics.median(d[:4])\nq3 = statistics.median(d[4:])\nprint(q1, q3, q3 + 1.5 * (q3 - q1))",
      "sol": "Q1 = 6,0, Q3 = 9,5, IQR = 3,5 e limite 14,75: o chamado de 40 minutos é outlier.",
      "o": "6.0 9.5 14.75",
      "r": [
        "6.0 9.5 14.75"
      ]
    }
  ];
  A.exercicios["distribuicao-normal"] = [
    {
      "q": "μ = 60 e σ = 15. Qual o escore Z de x = 90?",
      "r": [
        "2",
        "2.0",
        "2,0",
        "+2"
      ],
      "ph": "número",
      "sol": "z = (90 − 60) ÷ 15 = 2: dois desvios-padrão acima da média."
    },
    {
      "q": "Pela Regra Empírica, quantos % dos dados ficam entre μ − 1σ e μ + 1σ?",
      "r": [
        "68",
        "68%"
      ],
      "ph": "número",
      "sol": "1σ → 68%; 2σ → 95%; 3σ → 99,7%."
    },
    {
      "q": "O que aparece na tela?",
      "code": "print((45 - 60) / 15)",
      "sol": "z = −1: 45 minutos está um desvio-padrão abaixo da média.",
      "o": "-1.0",
      "r": [
        "-1.0"
      ]
    },
    {
      "q": "p(Z &lt; 2) = 0,9772. Quanto é p(Z &gt; 2)?",
      "r": [
        "0.0228",
        "0,0228"
      ],
      "ph": "número",
      "sol": "\"Maior que\" é 1 − tabela: 1 − 0,9772 = 0,0228."
    },
    {
      "q": "O que aparece na tela?",
      "code": "import statistics\nd = statistics.NormalDist(10, 2)\nprint(round(d.cdf(8), 4))",
      "sol": "8 minutos dá z = −1, e p(Z &lt; −1) = 0,1587.",
      "o": "0.1587",
      "r": [
        "0.1587"
      ]
    }
  ];
  A.exercicios["correlacao"] = [
    {
      "q": "Qual o valor de r numa relação negativa perfeita?",
      "r": [
        "-1",
        "−1",
        "-1.0",
        "-1,0"
      ],
      "ph": "número",
      "sol": "Perfeita = todos os pontos numa reta; negativa = descendo. r = −1."
    },
    {
      "q": "Sorvete e afogamentos sobem juntos no verão. O calor é uma variável de ___.",
      "r": [
        "confusão",
        "confusao"
      ],
      "ph": "complete",
      "sol": "Variável de <b>confusão</b>: mexe nas duas ao mesmo tempo, sem que uma cause a outra."
    },
    {
      "q": "O que aparece na tela?",
      "code": "import statistics\nprint(round(statistics.correlation([1, 2, 3], [2, 4, 6]), 2))",
      "sol": "y = 2x exatamente: os pontos estão numa reta subindo, r = 1.",
      "o": "1.0",
      "r": [
        "1.0"
      ]
    },
    {
      "q": "r = 0,35 é uma relação positiva forte, moderada ou fraca?",
      "r": [
        "fraca",
        "positiva fraca"
      ],
      "ph": "forte, moderada ou fraca",
      "sol": "Entre 0,30 e 0,50: <b>fraca</b>."
    },
    {
      "q": "Trocando x e y de lugar. O que aparece na tela?",
      "code": "import statistics\nv = [10, 20, 30, 50, 80]\nt = [25, 18, 14, 9, 5]\nprint(round(statistics.correlation(v, t), 4), round(statistics.correlation(t, v), 4))",
      "sol": "r = −0,9459 nos dois casos: a correlação é simétrica. Negativa forte: mais velocidade, menos espera.",
      "o": "-0.9459 -0.9459",
      "r": [
        "-0.9459 -0.9459"
      ]
    }
  ];
  A.exercicios["regressao"] = [
    {
      "q": "r = 0,5, s<sub>y</sub> = 1 e s<sub>x</sub> = 2. Quanto vale a inclinação m?",
      "r": [
        "0.25",
        "0,25"
      ],
      "ph": "número",
      "sol": "m = r · s<sub>y</sub> ÷ s<sub>x</sub> = 0,5 · 1 ÷ 2 = 0,25."
    },
    {
      "q": "m = 0,25, x̄ = 4 e ȳ = 4. Quanto vale o intercepto b?",
      "r": [
        "3",
        "3.0",
        "3,0"
      ],
      "ph": "número",
      "sol": "b = ȳ − m · x̄ = 4 − 0,25 · 4 = 3."
    },
    {
      "q": "O que aparece na tela?",
      "code": "m = 2.2\nb = 5.4\nprint(round(m * 4.5 + b, 2))",
      "sol": "y = 2,2 · 4,5 + 5,4 = 9,9 + 5,4 = 15,3 notificações.",
      "o": "15.3",
      "r": [
        "15.3"
      ]
    },
    {
      "q": "Os dados de x vão de 2 a 6. Usar a reta para x = 20 é ___.",
      "r": [
        "extrapolação",
        "extrapolacao"
      ],
      "ph": "uma palavra",
      "sol": "x fora do intervalo observado: <b>extrapolação</b>, previsão não confiável."
    },
    {
      "q": "O que aparece na tela?",
      "code": "import statistics\nreta = statistics.linear_regression([2, 3, 4, 5, 6], [10, 12, 15, 14, 20])\nprint(round(reta.slope, 2), round(reta.intercept, 2))",
      "sol": "m = 2,2 (cada hora a mais, 2,2 notificações a mais) e b = 5,4.",
      "o": "2.2 5.4",
      "r": [
        "2.2 5.4"
      ]
    }
  ];
})(window.ALG);
