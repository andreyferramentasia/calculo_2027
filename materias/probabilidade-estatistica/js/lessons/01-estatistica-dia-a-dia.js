/* Aula 01 — A Estatística no dia a dia: números que contam histórias */
(function (A) {
  A.lesson({
    id: 'estatistica-dia-a-dia', module: 'p1', num: 1, minutes: 30,
    title: 'Números que contam histórias',
    goals: ['O que é Estatística', 'Percentual', 'Contagem x taxa', 'Amostra e viés'],
    body: [
      { h2: '1. A Estatística está em toda parte' },
      { html: '<p><b>Estatística</b> é a área que estuda como <b>perguntar</b>, <b>coletar</b> dados, <b>analisar</b> e chegar a <b>conclusões</b> sobre o mundo. Não é só "mexer com números": é um processo completo, da pergunta à interpretação.</p>' +
        '<p>Um jornal de domingo traz dezenas de estatísticas, mas quase sempre mostra o número pronto, sem dizer como foi calculado. É aí que mora o risco.</p>' },
      { img: 'img/aulas/secao1-jornal-estatisticas.jpg', alt: 'Pilha de jornais impressos', caption: 'Jornais: fonte clássica de estatísticas do dia a dia.', fonte: 'Daniel R. Blume, Wikimedia Commons (CC BY-SA 2.0).' },
      { html: '<table><thead><tr><th>Onde aparece</th><th>Exemplo</th></tr></thead><tbody>' +
        '<tr><td>mídia / jornal</td><td>taxas de doenças, pesquisas, previsão do tempo</td></tr>' +
        '<tr><td>esportes</td><td>percentual de vitórias, estatísticas de jogadores</td></tr>' +
        '<tr><td>saúde</td><td>pesquisas de satisfação de pacientes</td></tr>' +
        '<tr><td>redes sociais e apps</td><td>curtidas, visualizações, seguidores, travamentos</td></tr></tbody></table>' +
        '<p class="formula">Percentual (%) = parte ÷ todo × 100</p>' },
      { warn: '<p>Número sem origem, sem cálculo ou sem base de comparação merece <b>uma pergunta antes de acreditar</b>. Não é desconfiar de tudo, é pedir o contexto.</p>' },

      { h2: '2. Contagens x taxas' },
      { html: '<div class="ideias">' +
        '<div class="ideia"><h4>Contagem</h4><p>Número <b>absoluto</b> de ocorrências: quantos casos, quantos erros. "18 travamentos."</p></div>' +
        '<div class="ideia"><h4>Taxa</h4><p>Contagem <b>relativa a uma base</b>: por mil, por 100 mil. "1,5 travamento a cada mil sessões."</p><p class="resumo">Taxa = ocorrências ÷ base × constante</p></div>' +
        '</div>' +
        '<table><thead><tr><th>Situação</th><th>Contagem</th><th>Taxa equivalente</th></tr></thead><tbody>' +
        '<tr><td>acidentes de moto</td><td>"350 mortes no ano"</td><td>"12 mortes/100 mil veículos"</td></tr>' +
        '<tr><td>videochamadas com falha</td><td>"18 chamadas com falha"</td><td>"1,5 falha/mil chamadas"</td></tr>' +
        '<tr><td>cancelamentos de streaming</td><td>"900 no mês"</td><td>"3 a cada 100 assinantes"</td></tr></tbody></table>' +
        '<p>A taxa é mais <b>justa</b> para comparar grupos de tamanhos diferentes. Veja como a contagem pode apontar o culpado errado:</p>' },
      { widget: 'taxa' },
      { warn: '<p>Nunca compare contagens absolutas de grupos de tamanhos diferentes. Compare <b>taxas</b>, calculadas sobre a <b>mesma base</b>.</p>' },
      { code: 'def taxa_por_mil_sessoes(travamentos, sessoes):\n    return (travamentos / sessoes) * 1000\n\ntaxa = taxa_por_mil_sessoes(18, 12000)\nprint(f"Taxa de travamentos: {taxa:.1f} por mil sessões")', out: 'Taxa de travamentos: 1.5 por mil sessões' },
      { tip: '<p>O valor 1,5 sozinho apenas <b>descreve</b>. Ele só ganha sentido quando comparado: com outro app, com a versão anterior, ou com um limite aceitável definido pela equipe.</p>' },

      { h2: '3. Amostras, populações e o cuidado com os números' },
      { html: '<p>Para estudar um grupo muito grande (a <b>população</b>), quase nunca dá para ouvir todo mundo. Coleta-se uma parte menor, a <b>amostra</b>. Uma amostra mal escolhida, pequena ou formada só por quem "quis responder", gera <b>viés de amostragem</b>.</p>' +
        '<ul><li>Uma pesquisa diz que "67% dos gestores de RH" pensam algo, mas ouviu só 210 pessoas. Isso representa o país todo?</li>' +
        '<li>Uma enquete no story chega a milhares de pessoas, mas só responde quem tem opinião forte. Decidir só com essas respostas é arriscado.</li></ul>' },
      { warn: '<p><b>Erro clássico de percentual:</b> uma reportagem disse que, de 2.200 médicos, 2.800 parariam um procedimento: "18% da amostra". Impossível antes de qualquer conta: a parte (2.800) é maior que o todo (2.200). Conferindo: 2.800 ÷ 2.200 × 100 = 127%. Percentual de uma parte sempre fica entre 0% e 100%.</p>' },
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
