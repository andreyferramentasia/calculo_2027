/* =========================================================
   HUB — página inicial: escolha da matéria
   Para adicionar uma matéria: crie a pasta dela (como calculo/)
   e coloque o caminho em `href`. Sem href = "Em breve".
   ========================================================= */
(function () {
  var MATERIAS = [
    {
      id: 'calculo', icon: '∫', color: '#ffcf33',
      title: 'Cálculo Diferencial e Integral I',
      desc: 'Começando por algoritmos em Python: variáveis, loops, listas, matrizes e NumPy, com animações passo a passo.',
      href: 'calculo/index.html'
    },
    {
      id: 'discreta', icon: '∀', color: '#8fb8ff',
      title: 'Matemática Discreta',
      desc: 'Lógica, conjuntos, relações, indução e contagem.'
    },
    {
      id: 'probabilidade', icon: 'σ', color: '#ff5c93', tag: 'CEAD',
      title: 'Probabilidade e Estatística',
      desc: 'Dados, medidas, probabilidade e distribuições.'
    },
    {
      id: 'requisitos', icon: '✓', color: '#c4a8ff',
      title: 'Engenharia de Requisitos',
      desc: 'Levantar, escrever, validar e gerenciar requisitos de software.'
    },
    {
      id: 'agro', icon: '❦', color: '#b6f26b', tag: 'CEAD',
      title: 'Computação Aplicada ao Agronegócio e Sustentabilidade',
      desc: 'Tecnologia no campo: dados, sensores, automação e sustentabilidade.'
    }
  ];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  function render() {
    var html = '';
    MATERIAS.forEach(function (m) {
      var open = !!m.href;
      var tagName = open ? 'a' : 'div';
      html +=
        '<' + tagName + ' class="subject' + (open ? '' : ' soon') + '" style="--sc:' + m.color + '"' +
        (open ? ' href="' + m.href + '"' : ' aria-disabled="true"') + '>' +
        '  <span class="subject-icon" aria-hidden="true">' + m.icon + '</span>' +
        '  <div class="subject-body">' +
        '    <div class="subject-tags">' +
        (m.tag ? '<span class="chip">' + esc(m.tag) + '</span>' : '') +
        '      <span class="chip ' + (open ? 'ok' : 'wait') + '">' + (open ? 'Disponível' : 'Em breve') + '</span>' +
        '    </div>' +
        '    <h2>' + esc(m.title) + '</h2>' +
        '    <p>' + esc(m.desc) + '</p>' +
        '  </div>' +
        (open ? '  <span class="subject-go" aria-hidden="true">→</span>' : '') +
        '</' + tagName + '>';
    });
    document.getElementById('subjects').innerHTML = html;
  }

  /* tema: mesma chave do site da matéria, então a escolha vale nos dois */
  var KEY = 'alg:tema';
  function getTheme() {
    try { return JSON.parse(localStorage.getItem(KEY)) || 'light'; } catch (e) { return 'light'; }
  }
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    document.getElementById('themeBtn').textContent = t === 'light' ? '☾ Escuro' : '☀ Claro';
  }

  document.addEventListener('DOMContentLoaded', function () {
    render();
    applyTheme(getTheme());
    document.getElementById('themeBtn').onclick = function () {
      var t = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      try { localStorage.setItem(KEY, JSON.stringify(t)); } catch (e) { /* sem storage */ }
      applyTheme(t);
    };
  });
})();
