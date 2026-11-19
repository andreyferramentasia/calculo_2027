/* =========================================================
   MÓDULOS de Matemática Discreta (ordem de exibição)
   Base: aulas do semestre (Gersting, Fundamentos Matemáticos
   para a Ciência da Computação). `desafio` = id da seção em
   apps-script/Questoes.gs → QUESTOES.discreta.secoes.
   ========================================================= */
(function (A) {
  A.module({ id: 'd1', desafio: 'logica', title: 'Lógica e demonstração', desc: 'Proposições, conectivos, tabelas-verdade, técnicas de prova, quantificadores e indução.', icon: 'img/mod-logica.svg', color: '#8fb8ff' });
  A.module({ id: 'd2', desafio: 'conjuntos', title: 'Conjuntos e contagem', desc: 'Operações com conjuntos, produto cartesiano e os princípios da multiplicação e da adição.', icon: 'img/mod-conjuntos.svg', color: 'var(--acc)' });
  A.module({ id: 'd3', desafio: 'criptografia', title: 'Teoria dos números e RSA', desc: 'Divisores, primos, MDC, aritmética modular, fi de Euler e a receita do RSA.', icon: 'img/mod-numeros.svg', color: 'var(--lime)' });
  A.module({ id: 'd4', desafio: 'complexidade', title: 'Complexidade', desc: 'Big O: como prever se o código aguenta 1 milhão de usuários.', icon: 'img/mod-complexidade.svg', color: '#c4a8ff' });
})(window.ALG);
