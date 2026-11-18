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
    var html =
      '<section class="hero">' +
      '  <div>' +
      '    <span class="eyebrow">algoritmos · python · do zero às matrizes</span>' +
      '    <h1>Veja o código <span>rodando</span>, linha por linha.</h1>' +
      '    <p>Aulas de algoritmos em Python com animações passo a passo: acompanhe a memória, os loops dando voltas, ponteiros andando em vetores e matrizes sendo multiplicadas.</p>' +
      '    <div class="actions">' +
      '      <a class="btn primary" href="#/aula/' + first.id + '">Começar agora →</a>' +
      '      <a class="btn" href="#/playground">Abrir o Playground</a>' +
      '    </div>' +
      '  </div>' +
      '  <img src="img/hero-loop.svg" alt="Ilustração de um loop: condição, corpo e atualização girando em círculo">' +
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
    document.title = 'Algoritmos em Python';
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

    var prev = list[idx - 1], next = list[idx + 1];
    var nav = A.el('nav', 'lesson-nav');
    nav.innerHTML =
      (prev ? '<a href="#/aula/' + prev.id + '"><small>← anterior</small>' + A.esc(prev.title) + '</a>' : '<span></span>') +
      '<a class="mid btn ghost" href="#/" style="padding:9px 16px">Início</a>' +
      (next ? '<a class="next" href="#/aula/' + next.id + '"><small>próxima →</small>' + A.esc(next.title) + '</a>' : '<a class="next" href="#/playground"><small>próximo →</small>Playground</a>');
    view.appendChild(nav);
    document.title = 'Aula ' + L.num + ' · ' + L.title;
  }

  function route() {
    var h = location.hash || '#/';
    var m;
    document.body.classList.remove('nav-open');
    if ((m = /^#\/aula\/([\w-]+)/.exec(h))) renderLesson(m[1]);
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

  /* ---------- trilha sequencial do aluno ---------- */
  function lessonLabel(lesson, list) {
    var moduleIndex = A.modules.map(function (m) { return m.id; }).indexOf(lesson.module);
    var lessonIndex = list.filter(function (item) { return item.module === lesson.module; }).indexOf(lesson);
    return (moduleIndex + 1) + '.' + (lessonIndex + 1);
  }
  function isUnlocked(list, index) {
    return list.slice(0, index).every(function (item) { return A.progress.isComplete(item.id); });
  }
  function firstIncomplete(list) {
    return list.filter(function (item) { return !A.progress.isComplete(item.id); })[0] || list[list.length - 1];
  }
  function allComplete(list) {
    return list.length > 0 && list.every(function (item) { return A.progress.isComplete(item.id); });
  }
  function lockedAttrs(locked) {
    return locked ? ' data-locked="true" aria-disabled="true"' : '';
  }

  buildNav = function () {
    var nav = A.$('#nav');
    var list = sorted();
    var html = '<div class="nav-progress"><span>TRILHA</span><b>' + list.filter(function (l) { return A.progress.isComplete(l.id); }).length + '/' + list.length + '</b></div>';
    A.modules.forEach(function (m, i) {
      html += '<div class="nav-mod"><span>' + (i + 1) + '. ' + A.esc(m.title) + '</span>';
      list.filter(function (l) { return l.module === m.id; }).forEach(function (l) {
        var index = list.indexOf(l);
        var locked = !isUnlocked(list, index);
        var complete = A.progress.isComplete(l.id);
        var classes = (locked ? ' locked' : '') + (complete ? ' completed' : '');
        html += '<a class="nav-lesson' + classes + '" href="#/aula/' + l.id + '"' + lockedAttrs(locked) + ' data-id="' + l.id + '"><span class="num">' + lessonLabel(l, list) + '</span><span class="nav-title">' + A.esc(l.title) + '</span><span class="nav-state">' + (complete ? '&#10003;' : (locked ? '<i class="bi bi-lock-fill"></i>' : '')) + '</span></a>';
      });
      html += '</div>';
    });
    var practiceLocked = !allComplete(list);
    html += '<div class="nav-mod"><span>Pratica</span><a href="#/playground" data-id="playground" class="special' + (practiceLocked ? ' locked' : '') + '"' + lockedAttrs(practiceLocked) + '><span class="num">&#9654;</span>Playground Python<span class="nav-state">' + (practiceLocked ? '<i class="bi bi-lock-fill"></i>' : '') + '</span></a></div>';
    nav.innerHTML = html;
    updateNav();
  };

  renderHome = function () {
    var list = sorted();
    var labs = 0, widgets = 0;
    A.lessons.forEach(function (l) { l.body.forEach(function (s) { if (s.lab) labs++; if (s.widget) widgets++; }); });
    var done = list.filter(function (l) { return A.progress.isComplete(l.id); }).length;
    var next = firstIncomplete(list);
    var html =
      '<section class="hero">' +
      '  <div>' +
      '    <span class="eyebrow">algoritmos / python / do zero as matrizes</span>' +
      '    <h1>Veja o codigo <span>rodando</span>, linha por linha.</h1>' +
      '    <p>Aulas de algoritmos em Python com animacoes passo a passo: acompanhe a memoria, os loops, os vetores e as matrizes.</p>' +
      '    <div class="actions">' +
      '      <a class="btn primary" href="#/aula/' + next.id + '">' + (done ? 'Continuar em ' + lessonLabel(next, list) : 'Comecar em 1.1') + ' -></a>' +
      '      <a class="btn' + (allComplete(list) ? '' : ' locked') + '" href="#/playground"' + lockedAttrs(!allComplete(list)) + '>Abrir o Playground</a>' +
      '    </div>' +
      '  </div>' +
      '  <img src="img/hero-loop.svg" alt="Ilustracao de um loop: condicao, corpo e atualizacao girando em circulo">' +
      '</section>' +
      '<section class="progress-strip"><div><span class="completion-kicker">PROGRESSO DO ALUNO</span><h2>' + (done === list.length ? 'Curso concluido!' : 'Uma etapa por vez') + '</h2><p>' + (done === list.length ? 'Todas as aulas foram liberadas e concluidas.' : 'Conclua a etapa atual para liberar a proxima. O seu progresso fica salvo neste navegador.') + '</p></div><strong>' + done + '<small>/' + list.length + ' concluidas</small></strong></section>' +
      '<div class="stats">' +
      '  <div class="stat"><b>' + A.lessons.length + '</b><span>aulas</span></div>' +
      '  <div class="stat"><b>' + labs + '</b><span>labs animados</span></div>' +
      '  <div class="stat"><b>' + widgets + '</b><span>widgets interativos</span></div>' +
      '  <div class="stat"><b>' + A.modules.length + '</b><span>modulos</span></div>' +
      '</div>' +
      '<div class="modules">';
    A.modules.forEach(function (m, i) {
      html += '<div class="module-card" style="--mc:' + m.color + '"><header><img src="' + m.icon + '" alt=""><div><h3>Modulo ' + (i + 1) + ' / ' + A.esc(m.title) + '</h3><p>' + A.esc(m.desc) + '</p></div></header><div class="lesson-grid">';
      list.filter(function (l) { return l.module === m.id; }).forEach(function (l) {
        var index = list.indexOf(l);
        var locked = !isUnlocked(list, index);
        var complete = A.progress.isComplete(l.id);
        html += '<a class="lesson-chip' + (locked ? ' locked' : '') + (complete ? ' completed' : '') + '" href="#/aula/' + l.id + '"' + lockedAttrs(locked) + '><span class="num">' + lessonLabel(l, list) + '</span><span>' + A.esc(l.title) + '</span><span class="lesson-state">' + (complete ? '&#10003; concluida' : (locked ? '<i class="bi bi-lock-fill"></i> bloqueada' : 'aberta')) + '</span></a>';
      });
      html += '</div></div>';
    });
    html += '</div>';
    view.className = 'content';
    view.innerHTML = html;
    document.title = 'Algoritmos em Python';
  };

  renderLesson = function (id) {
    var list = sorted();
    var idx = list.map(function (l) { return l.id; }).indexOf(id);
    if (idx < 0) { location.hash = '#/'; return; }
    if (!isUnlocked(list, idx)) {
      var available = firstIncomplete(list);
      if (available && available.id !== id) {
        A.toast('Esta etapa esta bloqueada. Conclua ' + lessonLabel(available, list) + ' primeiro.');
        location.hash = '#/aula/' + available.id;
      }
      return;
    }
    var L = list[idx], M = moduleOf(L);
    view.className = 'content';
    view.innerHTML = '';
    var head = A.el('header', 'lesson-head');
    head.innerHTML =
      '<div class="crumb">Modulo ' + (A.modules.indexOf(M) + 1) + ' / <b>Etapa ' + lessonLabel(L, list) + '</b></div>' +
      '<h1>' + A.esc(L.title) + '</h1>' +
      '<div class="meta"><span>~' + L.minutes + ' min</span><span>' + L.body.filter(function (s) { return s.lab; }).length + ' labs animados</span><span>' + (A.progress.isComplete(L.id) ? 'Concluida' : 'Em andamento') + '</span></div>' +
      '<div class="goal-chips">' + L.goals.map(function (g) { return '<span>' + g + '</span>'; }).join('') + '</div>';
    view.appendChild(head);
    L.body.forEach(function (s) {
      var type = Object.keys(SECTION).filter(function (k) { return k in s; })[0];
      if (type) view.appendChild(SECTION[type](s));
    });
    var checkpoint;
    if (L.quiz && L.quiz.length) {
      A.renderQuiz(view, L, L.quiz, function () { if (checkpoint && checkpoint.refresh) checkpoint.refresh(); });
    }
    checkpoint = A.renderCompletion(view, L, function () {
      buildNav();
      renderLesson(id);
      A.toast('Etapa ' + lessonLabel(L, list) + ' concluida! Proxima etapa liberada.');
    });
    var prev = list[idx - 1], nextLesson = list[idx + 1];
    var nav = A.el('nav', 'lesson-nav');
    var nextMarkup;
    if (nextLesson && A.progress.isComplete(L.id)) {
      nextMarkup = '<a class="next" href="#/aula/' + nextLesson.id + '"><small>proxima -></small>' + lessonLabel(nextLesson, list) + ' / ' + A.esc(nextLesson.title) + '</a>';
    } else if (nextLesson) {
      nextMarkup = '<span class="next locked-nav"><small>proxima etapa</small>Conclua o checkpoint acima</span>';
    } else if (A.progress.isComplete(L.id)) {
      nextMarkup = '<a class="next" href="#/playground"><small>proximo -></small>Playground Python</a>';
    } else {
      nextMarkup = '<span class="next locked-nav"><small>proximo</small>Conclua todas as aulas</span>';
    }
    nav.innerHTML =
      (prev ? '<a href="#/aula/' + prev.id + '"><small>&lt;- anterior</small>' + lessonLabel(prev, list) + ' / ' + A.esc(prev.title) + '</a>' : '<span></span>') +
      '<a class="mid btn ghost" href="#/" style="padding:9px 16px">Inicio</a>' + nextMarkup;
    view.appendChild(nav);
    document.title = 'Etapa ' + lessonLabel(L, list) + ' / ' + L.title;
  };

  route = function () {
    var h = location.hash || '#/';
    var m;
    document.body.classList.remove('nav-open');
    var list = sorted();
    if ((m = /^#\/aula\/([\w-]+)/.exec(h))) renderLesson(m[1]);
    else if (h.indexOf('#/playground') === 0) {
      if (!allComplete(list)) {
        var available = firstIncomplete(list);
        location.hash = '#/aula/' + available.id;
        A.toast('Conclua as etapas em ordem para liberar o Playground.');
        return;
      }
      A.renderPlayground(view);
    } else renderHome();
    var y = A.restoreY || 0;
    A.restoreY = null;
    window.scrollTo({ top: y, behavior: 'instant' });
    if (h.indexOf('#/playground') !== 0) A.store.set('pg:return', null);
    updateNav();
  };

  document.addEventListener('click', function (event) {
    var target = event.target.closest ? event.target.closest('[data-locked="true"]') : null;
    if (!target) return;
    event.preventDefault();
    A.toast('Item bloqueado. Conclua a etapa atual para continuar.');
  });

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
  });
})(window.ALG);
