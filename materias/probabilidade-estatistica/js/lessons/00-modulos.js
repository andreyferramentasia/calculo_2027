/* =========================================================
   MÓDULOS de Probabilidade e Estatística (ordem de exibição)
   Base: Guia de Estudos CEAD/UNIGRAN, aulas 1 a 8.
   `desafio` = id da seção em apps-script/Questoes.gs →
   QUESTOES.probabilidade.secoes.
   ========================================================= */
(function (A) {
  A.module({ id: 'p1', desafio: 'processo_estatistico', title: 'Estatística e dados', desc: 'Números do dia a dia, contagens x taxas, amostras, tipos de dados e margem de erro.', icon: 'img/mod-processo.svg', color: '#ff7aa6' });
  A.module({ id: 'p2', desafio: 'medidas_graficos', title: 'Resumindo dados', desc: 'Média, mediana, desvio padrão e gráficos de pizza e de barras.', icon: 'img/mod-medidas.svg', color: 'var(--acc)' });
  A.module({ id: 'p3', desafio: 'distribuicao_normal', title: 'A forma dos dados', desc: 'Histograma, boxplot, linha do tempo e a distribuição normal.', icon: 'img/mod-normal.svg', color: 'var(--lime)' });
  A.module({ id: 'p4', desafio: 'correlacao_regressao', title: 'Relações entre variáveis', desc: 'Diagrama de dispersão, correlação e regressão linear.', icon: 'img/mod-relacoes.svg', color: '#8fb8ff' });
})(window.ALG);
