/* Aula 02 — Estatística como processo: conceitos e vocabulário básico */
(function (A) {
  A.lesson({
    id: 'processo-estatistico', module: 'p1', num: 2, minutes: 30,
    title: 'O processo estatístico',
    goals: ['4 etapas', 'Numérico x categórico', 'Parâmetro x estatística', 'Margem de erro'],
    body: [
      { h2: '1. Estatística é um processo, não só números' },
      { html: '<p>O número final é só a ponta. Toda pesquisa séria segue <b>quatro etapas</b>, sempre nessa ordem:</p>' +
        '<p class="formula">Definir a população → Coletar dados → Organizar/Analisar → Concluir</p>' +
        '<table><thead><tr><th>Etapa</th><th>Eleição (dia a dia)</th><th>Novo algoritmo de streaming (tecnologia)</th></tr></thead><tbody>' +
        '<tr><td>1. definir a população</td><td>eleitores que pretendem votar</td><td>todos os usuários ativos</td></tr>' +
        '<tr><td>2. coletar os dados</td><td>entrevistar uma parte deles</td><td>notas de quem testou o algoritmo</td></tr>' +
        '<tr><td>3. organizar e analisar</td><td>resumir as respostas</td><td>calcular a média das notas</td></tr>' +
        '<tr><td>4. concluir</td><td>projetar o resultado, com margem de erro</td><td>decidir se agrada mais que o anterior</td></tr></tbody></table>' },
      { img: 'img/aulas/secao1-urna-eleitoral.jpg', alt: 'Urna eleitoral eletrônica', caption: 'A eleição mostra o processo completo: população, coleta, apuração e conclusão.', fonte: 'Smithsonian Institution, Wikimedia Commons (domínio público).' },
      { warn: '<p>Nenhuma conclusão estatística tem 100% de certeza, a não ser que <b>toda</b> a população tenha sido consultada. Conclusão séria vem com uma medida de confiança ou de erro.</p>' },

      { h2: '2. Tipos de dados' },
      { html: '<p><b>Variável</b> é a característica medida em cada indivíduo (idade, nota, curso). O conjunto de tudo que foi coletado é o <b>conjunto de dados</b>: D = {x₁, x₂, …, xₙ}.</p>' +
        '<div class="ideias">' +
        '<div class="ideia"><h4>Numérico discreto</h4><p>Contagem: valores que dá para listar (0, 1, 2…).</p><p class="resumo">nº de avaliações de um app</p></div>' +
        '<div class="ideia"><h4>Numérico contínuo</h4><p>Medida: qualquer valor num intervalo.</p><p class="resumo">tempo de carregamento de uma página</p></div>' +
        '<div class="ideia"><h4>Categórico</h4><p>Grupo ou rótulo: não faz sentido somar ou tirar média.</p><p class="resumo">sistema operacional do celular</p></div>' +
        '</div>' +
        '<table><thead><tr><th>Variável</th><th>Tipo</th></tr></thead><tbody>' +
        '<tr><td>número de seguidores de um perfil</td><td>numérico discreto</td></tr>' +
        '<tr><td>duração de um vídeo em segundos</td><td>numérico contínuo</td></tr>' +
        '<tr><td>rede social preferida</td><td>categórico</td></tr>' +
        '<tr><td>nota de 1 a 5 estrelas</td><td>categórico (ordenado)</td></tr></tbody></table>' },
      { warn: '<p>Nem todo número é dado numérico. Código "1" para Android e "2" para iOS é <b>categórico</b>: a "média 1,5" não significa nada.</p>' },

      { h2: '3. População, amostra, parâmetro e estatística' },
      { html: '<table><thead><tr><th>Termo</th><th>Refere-se a</th><th>Exemplo</th></tr></thead><tbody>' +
        '<tr><td><b>população</b></td><td>grupo completo de interesse</td><td>todas as famílias brasileiras</td></tr>' +
        '<tr><td><b>amostra</b></td><td>parte efetivamente estudada</td><td>famílias entrevistadas pelo IBGE</td></tr>' +
        '<tr><td><b>parâmetro</b></td><td>número que resume a população</td><td>renda média de todas as famílias</td></tr>' +
        '<tr><td><b>estatística</b></td><td>número que resume a amostra</td><td>renda média das entrevistadas</td></tr></tbody></table>' +
        '<p>Na prática, calcula-se a <b>estatística</b> e usa-se ela para estimar o <b>parâmetro</b>. Para isso funcionar, a amostra precisa ser <b>aleatória</b>: toda amostra do mesmo tamanho tem a mesma chance de ser escolhida.</p>' },
      { img: 'img/aulas/secao3-dados-aleatorios.jpg', alt: 'Dados de jogar', caption: 'Como num dado, a amostra aleatória depende do acaso: todos têm a mesma chance de ser sorteados.', fonte: 'P2u111, Wikimedia Commons (CC BY 4.0).' },
      { tip: '<p>Amostra grande <b>não compensa</b> amostra tendenciosa. Uma amostra pequena e bem sorteada vale mais que uma grande e viciada.</p>' },
      { h3: 'Margem de erro' },
      { html: '<p class="formula">Margem de erro (%) ≈ 100 ÷ √n</p><p>Com n = 625: √625 = 25 e 100 ÷ 25 = <b>4 pontos percentuais</b>. Se 70% da amostra está satisfeita, na população o valor provavelmente fica entre 66% e 74%. Mexa no tamanho da amostra:</p>' },
      { widget: 'margem' },
      { code: 'import math\n\ndef margem_de_erro(n):\n    return 100 / math.sqrt(n)\n\nn = 625\npercentual = 70\nmargem = margem_de_erro(n)\nprint(f"Margem: {margem:.1f} pontos percentuais")\nprint(f"Na população: entre {percentual - margem:.1f}% e {percentual + margem:.1f}%")', out: 'Margem: 4.0 pontos percentuais\nNa população: entre 66.0% e 74.0%' },
      { tip: '<p>Para <b>dividir a margem por 2</b>, é preciso <b>4 vezes</b> mais gente: 100/√400 = 5, mas 100/√1600 = 2,5. Por isso pesquisas grandes custam caro.</p>' }
    ],
    quiz: [
      { q: 'Qual é a ordem certa do processo estatístico?', options: ['coletar → definir população → concluir → analisar', 'definir população → coletar → analisar → concluir', 'analisar → coletar → concluir → definir população', 'concluir → analisar → coletar → definir população'], answer: 1, explain: 'Primeiro se decide quem estudar; depois coleta, analisa e conclui.' },
      { q: '"Tempo de carregamento de uma página" é um dado:', options: ['categórico', 'numérico discreto', 'numérico contínuo', 'ordinal'], answer: 2, explain: 'Vem de uma medição e pode ter qualquer valor num intervalo.' },
      { q: 'A média calculada com 500 usuários sorteados é um(a):', options: ['parâmetro', 'estatística', 'população', 'variável categórica'], answer: 1, explain: 'Número que resume a amostra é estatística; o da população inteira é parâmetro.' },
      { q: 'Margem de erro aproximada de uma amostra de 400 pessoas:', options: ['20 pontos', '4 pontos', '5 pontos', '0,25 ponto'], answer: 2, explain: '√400 = 20; 100 ÷ 20 = 5.' }
    ]
  });
})(window.ALG);
