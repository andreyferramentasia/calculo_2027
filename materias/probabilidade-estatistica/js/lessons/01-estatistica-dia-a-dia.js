/* Aula 01 — A Estatística no dia a dia: números que contam histórias */
(function (A) {
  A.lesson({
    id: 'estatistica-dia-a-dia', module: 'p1', num: 1, minutes: 30,
    title: 'Números que contam histórias',
    goals: ['O que é Estatística', 'Percentual', 'Contagem x taxa', 'Amostra e viés'],
    body: [
      { h2: '1. A Estatística está em toda parte' },
      { html: '<p><b>Estatística</b> = perguntar, coletar, analisar e concluir com dados. O perigo é o número pronto, sem dizer de onde veio.</p>' },
      { html: A.ilus('jornal', 'Número pronto, sem base: sempre pergunte "de quê?".') },
      { html: '<p class="formula">Percentual (%) = parte ÷ todo × 100</p>' },
      { warn: '<p>Número sem base de comparação merece <b>uma pergunta</b> antes de acreditar.</p>' },

      { h2: '2. Contagens x taxas' },
      { html: '<div class="ideias">' +
        '<div class="ideia"><h4>Contagem</h4><p>Número bruto: "18 travamentos".</p></div>' +
        '<div class="ideia"><h4>Taxa</h4><p>Contagem sobre uma base: "1,5 travamento a cada mil sessões".</p><p class="resumo">Taxa = ocorrências ÷ base × constante</p></div>' +
        '</div><p>A taxa é a forma <b>justa</b> de comparar grupos de tamanhos diferentes. Veja a contagem apontar o culpado errado:</p>' },
      { widget: 'taxa' },
      { code: 'def taxa_por_mil_sessoes(travamentos, sessoes):\n    return (travamentos / sessoes) * 1000\n\ntaxa = taxa_por_mil_sessoes(18, 12000)\nprint(f"Taxa de travamentos: {taxa:.1f} por mil sessões")', out: 'Taxa de travamentos: 1.5 por mil sessões' },
      { tip: '<p>O 1,5 sozinho só <b>descreve</b>. Ele ganha sentido quando comparado: com outro app, com a versão anterior ou com um limite da equipe.</p>' },

      { h2: '3. Amostras, populações e o cuidado com os números' },
      { html: '<p>Quase nunca dá para ouvir a <b>população</b> inteira; estuda-se uma <b>amostra</b>. Amostra pequena ou formada só por quem quis responder (enquete no story, por exemplo) gera <b>viés de amostragem</b>.</p>' },
      { warn: '<p><b>Confira a conta:</b> "2.800 de 2.200 médicos = 18%" é impossível. A parte é maior que o todo: daria 127%. Percentual de uma parte fica sempre entre 0% e 100%.</p>' },
      { code: 'curtidas = 42\nespectadores_ate_o_fim = 50\npercentual = (curtidas / espectadores_ate_o_fim) * 100\nprint(f"Percentual de curtidas: {percentual:.1f}%")', out: 'Percentual de curtidas: 84.0%' },
      { code: 'quedas = 34\nacessos = 8500\nlimite = 5\ntaxa = (quedas / acessos) * 1000\nprint(f"Taxa: {taxa:.1f} quedas por mil acessos")\nif taxa <= limite:\n    print("Dentro do limite aceitável.")\nelse:\n    print("Acima do limite aceitável.")', out: 'Taxa: 4.0 quedas por mil acessos\nDentro do limite aceitável.' }
    ],
    quiz: [
      { q: 'O App A teve 18 travamentos em 12.000 sessões; o App B, 12 em 3.000. Qual trava mais <b>proporcionalmente</b>?', options: ['App A, porque 18 &gt; 12', 'App B: 4 por mil contra 1,5 por mil', 'Empate', 'Não dá para saber'], answer: 1, explain: 'Taxa A = 18/12000·1000 = 1,5; taxa B = 12/3000·1000 = 4.' },
      { q: 'Uma notícia diz "35% de 200 entrevistados". Quantas pessoas são?', options: ['35', '70', '135', '165'], answer: 1, explain: '0,35 × 200 = 70.' },
      { q: 'Uma enquete só com quem quis responder tende a ter:', options: ['margem de erro zero', 'viés de amostragem', 'resultado sempre correto', 'população menor'], answer: 1, explain: 'Quem se oferece para responder costuma ter opinião mais forte: a amostra não representa todos.' },
      { q: 'Qual destes percentuais denuncia um erro de conta?', options: ['0%', '45,5%', '100%', '127%'], answer: 3, explain: 'A parte não pode ser maior que o todo: percentual de uma parte fica entre 0% e 100%.' }
    ]
  });
})(window.ALG);
