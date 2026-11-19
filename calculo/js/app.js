/* =========================================================
   APP — roteador (hash), navegação e renderização das páginas
   Rotas:  #/            início
           #/aula/<id>   aula
           #/playground  Python real no navegador
   ========================================================= */
(function (A) {
  var view;

  function sorted() {
    var order = A.modules.map(function (m) { return m.id; });
    return A.lessons.slice().sort(function (a, b) {
      return (order.indexOf(a.module) - order.indexOf(b.module)) || (a.num - b.num);
    });
  }
  function moduleOf(l) { return A.modules.filter(function (m) { return m.id === l.module; })[0]; }

  /* ---------- sidebar ---------- */
  function buildNav() {
    var nav = A.$('#nav');
    var html = '';
    A.modules.forEach(function (m, i) {
      html += '<div class="nav-mod"><span>' + (i + 1) + '. ' + A.esc(m.title) + '</span>';
      sorted().filter(function (l) { return l.module === m.id; }).forEach(function (l) {
        html += '<a href="#/aula/' + l.id + '" data-id="' + l.id + '"><span class="num">' + String(l.num).padStart(2, '0') + '</span>' + A.esc(l.title) + '</a>';
      });
      if (m.desafio && A.liberados.indexOf(m.desafio) >= 0) html += '<a href="#/desafio/' + m.desafio + '" class="desafio-link"><span class="num">🏆</span>Desafio da seção</a>';
      html += '</div>';
    });
    html += '<div class="nav-mod"><span>Prática</span><a href="#/playground" data-id="playground" class="special"><span class="num">▶</span>Playground Python</a></div>';
    nav.innerHTML = html;
    updateNav();
  }
  function updateNav() {
    A.$$('#nav a').forEach(function (a) {
      a.classList.toggle('active', location.hash === a.getAttribute('href'));
    });
  }

  /* ---------- páginas ---------- */
  function renderHome() {
    var labs = 0, widgets = 0;
    A.lessons.forEach(function (l) { l.body.forEach(function (s) { if (s.lab) labs++; if (s.widget) widgets++; }); });
    var first = sorted()[0];
    var S = A.SITE || {};
    var html =
      '<section class="hero">' +
      '  <div>' +
      '    <span class="eyebrow">' + (S.eyebrow || 'algoritmos · python · do zero às matrizes') + '</span>' +
      '    <h1>' + (S.h1 || 'Veja o código <span>rodando</span>, linha por linha.') + '</h1>' +
      '    <p>' + (S.intro || 'Aulas de algoritmos em Python com animações passo a passo: acompanhe a memória, os loops dando voltas, ponteiros andando em vetores e matrizes sendo multiplicadas.') + '</p>' +
      '    <div class="actions">' +
      '      <a class="btn primary" href="#/aula/' + first.id + '">Começar agora →</a>' +
      '      <a class="btn" href="#/playground">Abrir o Playground</a>' +
      '    </div>' +
      '  </div>' +
      '  <img src="' + (S.hero || 'img/hero-loop.svg') + '" alt="' + A.esc(S.heroAlt || 'Ilustração de um loop: condição, corpo e atualização girando em círculo') + '">' +
      '</section>' +
      '<div class="stats">' +
      '  <div class="stat"><b>' + A.lessons.length + '</b><span>aulas</span></div>' +
      '  <div class="stat"><b>' + labs + '</b><span>labs animados</span></div>' +
      '  <div class="stat"><b>' + widgets + '</b><span>widgets interativos</span></div>' +
      '  <div class="stat"><b>' + A.modules.length + '</b><span>módulos</span></div>' +
      '</div>' +
      '<div class="modules">';
    A.modules.forEach(function (m, i) {
      html += '<div class="module-card" style="--mc:' + m.color + '"><header><img src="' + m.icon + '" alt=""><div><h3>Módulo ' + (i + 1) + ' · ' + A.esc(m.title) + '</h3><p>' + A.esc(m.desc) + '</p></div></header><div class="lesson-grid">';
      sorted().filter(function (l) { return l.module === m.id; }).forEach(function (l) {
        html += '<a class="lesson-chip" href="#/aula/' + l.id + '"><span class="num">' + String(l.num).padStart(2, '0') + '</span>' + A.esc(l.title) + '</a>';
      });
      html += '</div></div>';
    });
    html += '</div>';
    view.className = 'content';
    view.innerHTML = html;
    document.title = S.titulo || 'Algoritmos em Python';
  }

  var SECTION = {
    h2: function (s) { return A.el('h2', '', s.h2); },
    h3: function (s) { return A.el('h3', '', s.h3); },
    html: function (s) { return A.el('div', 'section', s.html); },
    code: function (s) { return A.codeBlock(s.code, { out: s.out, title: s.title, playground: s.playground }); },
    lab: function (s) { var d = A.el('div'); new A.Stepper(d, s.lab); return d; },
    widget: function (s) {
      var d = A.el('div');
      if (A.widgets[s.widget]) A.widgets[s.widget](d, s.opts);
      else d.innerHTML = '<p class="muted">Widget "' + A.esc(s.widget) + '" não encontrado.</p>';
      return d;
    },
    tip: function (s) { return callout('tip', 'DICA', s.tip); },
    warn: function (s) { return callout('warn', 'ATENÇÃO', s.warn); },
    calc: function (s) { return callout('calc', 'CÁLCULO', s.calc); },
    compare: function (s) {
      var d = A.el('div', 'compare');
      s.compare.forEach(function (c) {
        var b = A.el('div');
        b.innerHTML = '<h5>' + A.esc(c.title) + '</h5><pre>' + A.highlight(c.code) + '</pre>';
        d.appendChild(b);
      });
      return d;
    },
    img: function (s) {
      var f = A.el('figure');
      f.style.margin = '18px 0';
      f.innerHTML = '<img src="' + s.img + '" alt="' + A.esc(s.alt || '') + '" style="border-radius:12px;border:1px solid var(--line)">' +
        (s.caption ? '<figcaption class="muted" style="font-size:.85rem;margin-top:6px">' + A.esc(s.caption) + '</figcaption>' : '');
      return f;
    }
  };
  function callout(kind, label, html) {
    return A.el('div', 'callout ' + kind, '<span class="ci">' + label + '</span><div>' + html + '</div>');
  }

  function renderLesson(id) {
    var list = sorted();
    var idx = -1;
    list.forEach(function (l, i) { if (l.id === id) idx = i; });
    if (idx < 0) { location.hash = '#/'; return; }
    var L = list[idx], M = moduleOf(L);
    view.className = 'content';
    view.innerHTML = '';
    var head = A.el('header', 'lesson-head');
    head.innerHTML =
      '<div class="crumb">Módulo ' + (A.modules.indexOf(M) + 1) + ' · ' + A.esc(M.title) + ' / <b>Aula ' + String(L.num).padStart(2, '0') + '</b></div>' +
      '<h1>' + A.esc(L.title) + '</h1>' +
      '<div class="meta"><span>⏱ ~' + L.minutes + ' min</span><span>' + L.body.filter(function (s) { return s.lab; }).length + ' labs animados</span></div>' +
      '<div class="goal-chips">' + L.goals.map(function (g) { return '<span>' + g + '</span>'; }).join('') + '</div>';
    view.appendChild(head);
    L.body.forEach(function (s) {
      var type = Object.keys(SECTION).filter(function (k) { return k in s; })[0];
      if (type) view.appendChild(SECTION[type](s));
    });
    if (L.quiz && L.quiz.length) A.renderQuiz(view, L, L.quiz);
    A.renderExercicios(view, L);

    var prev = list[idx - 1], next = list[idx + 1];
    var nav = A.el('nav', 'lesson-nav');
    nav.innerHTML =
      (prev ? '<a href="#/aula/' + prev.id + '"><small>← anterior</small>' + A.esc(prev.title) + '</a>' : '<span></span>') +
      '<a class="mid btn ghost" href="#/" style="padding:9px 16px">Início</a>' +
      (M.desafio && A.liberados.indexOf(M.desafio) >= 0 && (!next || next.module !== L.module)
        ? '<a class="next" href="#/desafio/' + M.desafio + '"><small>próximo →</small>🏆 Desafio da seção</a>'
        : next ? '<a class="next" href="#/aula/' + next.id + '"><small>próxima →</small>' + A.esc(next.title) + '</a>' : '<a class="next" href="#/playground"><small>próximo →</small>Playground</a>');
    view.appendChild(nav);
    document.title = 'Aula ' + L.num + ' · ' + L.title;
  }

  function route() {
    var h = location.hash || '#/';
    var m;
    document.body.classList.remove('nav-open');
    A.desafioAtivo = false;
    if ((m = /^#\/aula\/([\w-]+)/.exec(h))) renderLesson(m[1]);
    else if ((m = /^#\/desafio\/(\w+)/.exec(h))) A.renderDesafio(view, m[1]);
    else if (h.indexOf('#/playground') === 0) A.renderPlayground(view);
    else renderHome();
    var y = A.restoreY || 0;
    A.restoreY = null;
    window.scrollTo({ top: y, behavior: 'instant' });
    // fora do playground, esquece a aula de origem (o botão só vale para a ida pelo "Rodar de verdade")
    if (h.indexOf('#/playground') !== 0) A.store.set('pg:return', null);
    updateNav();
  }

  /* ---------- tema ---------- */
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    A.$('#themeBtn').textContent = t === 'light' ? '☾ Escuro' : '☀ Claro';
  }


  document.addEventListener('DOMContentLoaded', function () {
    view = A.$('#view');
    applyTheme(A.store.get('tema', 'light'));
    A.$('#themeBtn').onclick = function () {
      var t = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      A.store.set('tema', t);
      applyTheme(t);
    };
    A.$('#menuBtn').onclick = function () { document.body.classList.toggle('nav-open'); };
    A.$('#scrim').onclick = function () { document.body.classList.remove('nav-open'); };
    buildNav();
    window.addEventListener('hashchange', route);
    route();
    // desafios liberados pelo professor aparecem no menu (e é conferido de novo a cada 60 s)
    function atualizaDesafios() {
      var antes = A.liberados.join();
      A.carregarLiberados().then(function () { if (A.liberados.join() !== antes) buildNav(); });
    }
    atualizaDesafios();
    setInterval(atualizaDesafios, 60000);
  });
})(window.ALG);
