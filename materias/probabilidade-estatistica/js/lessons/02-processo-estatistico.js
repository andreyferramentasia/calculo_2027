/* Aula 02 — Estatística como processo: conceitos e vocabulário básico */
(function (A) {
  A.lesson({
    id: 'processo-estatistico', module: 'p1', num: 2, minutes: 30,
    title: 'O processo estatístico',
    goals: ['4 etapas', 'Numérico x categórico', 'Parâmetro x estatística', 'Margem de erro'],
    body: [
      { h2: '1. Estatística é um processo, não só números' },
      { html: '<p>Toda pesquisa séria segue <b>quatro etapas</b>. Ex.: para testar um novo algoritmo de recomendação, a população são todos os usuários ativos; coleta-se a nota de quem testou; calcula-se a média; conclui-se se agradou mais que o anterior.</p>' },
      { html: A.ilus('processo') },
      { warn: '<p>Sem ouvir <b>toda</b> a população, nenhuma conclusão tem 100% de certeza: ela vem com uma margem de erro.</p>' },

      { h2: '2. Tipos de dados' },
      { html: '<p><b>Variável</b> é o que se mede em cada indivíduo. Três tipos:</p>' +
        '<div class="ideias">' +
        '<div class="ideia"><h4>Numérico discreto</h4><p>Contagem (0, 1, 2…).</p><p class="resumo">nº de seguidores</p></div>' +
        '<div class="ideia"><h4>Numérico contínuo</h4><p>Medida, qualquer valor.</p><p class="resumo">duração de um vídeo</p></div>' +
        '<div class="ideia"><h4>Categórico</h4><p>Rótulo: não se tira média.</p><p class="resumo">rede social preferida</p></div>' +
        '</div>' },
      { warn: '<p>Código "1" = Android e "2" = iOS é <b>categórico</b>: a "média 1,5" não significa nada.</p>' },

      { h2: '3. População, amostra, parâmetro e estatística' },
      { html: '<table><thead><tr><th></th><th>População (todos)</th><th>Amostra (uma parte)</th></tr></thead><tbody>' +
        '<tr><td>quem</td><td>todas as famílias do país</td><td>as famílias entrevistadas</td></tr>' +
        '<tr><td>o número que resume</td><td><b>parâmetro</b></td><td><b>estatística</b></td></tr></tbody></table>' +
        '<p>Calcula-se a estatística para estimar o parâmetro. Para funcionar, a amostra precisa ser <b>aleatória</b>.</p>' },
      { html: A.ilus('sorteio') },
      { tip: '<p>Amostra grande <b>não compensa</b> amostra tendenciosa.</p>' },
      { h3: 'Margem de erro' },
      { html: '<p class="formula">Margem de erro (%) ≈ 100 ÷ √n</p><p>n = 625 → 100 ÷ 25 = <b>4 pontos</b>: se 70% aprovaram, na população fica entre 66% e 74%.</p>' },
      { widget: 'margem' },
      { code: 'import math\n\ndef margem_de_erro(n):\n    return 100 / math.sqrt(n)\n\nn = 625\npercentual = 70\nmargem = margem_de_erro(n)\nprint(f"Margem: {margem:.1f} pontos percentuais")\nprint(f"Na população: entre {percentual - margem:.1f}% e {percentual + margem:.1f}%")', out: 'Margem: 4.0 pontos percentuais\nNa população: entre 66.0% e 74.0%' },
      { tip: '<p>Para <b>dividir a margem por 2</b>, precisa de <b>4×</b> mais gente.</p>' },
    ],
    quiz: [
      { q: 'Qual é a ordem certa do processo estatístico?', options: ['coletar → definir população → concluir → analisar', 'definir população → coletar → analisar → concluir', 'analisar → coletar → concluir → definir população', 'concluir → analisar → coletar → definir população'], answer: 1, explain: 'Primeiro se decide quem estudar; depois coleta, analisa e conclui.' },
      { q: '"Tempo de carregamento de uma página" é um dado:', options: ['categórico', 'numérico discreto', 'numérico contínuo', 'ordinal'], answer: 2, explain: 'Vem de uma medição e pode ter qualquer valor num intervalo.' },
      { q: 'A média calculada com 500 usuários sorteados é um(a):', options: ['parâmetro', 'estatística', 'população', 'variável categórica'], answer: 1, explain: 'Número que resume a amostra é estatística; o da população inteira é parâmetro.' },
      { q: 'Margem de erro aproximada de uma amostra de 400 pessoas:', options: ['20 pontos', '4 pontos', '5 pontos', '0,25 ponto'], answer: 2, explain: '√400 = 20; 100 ÷ 20 = 5.' }
    ]
  });
})(window.ALG);
