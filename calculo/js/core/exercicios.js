/* =========================================================
   EXERCÍCIOS — 5 por aula, resposta digitada.
   Acertando 2, o gabarito (com explicação) é liberado.
   Dados em js/lessons/99-exercicios.js:
     A.exercicios[idDaAula] = [{ q, code?, r:[respostas aceitas], sol, ph? }]
   ========================================================= */
(function (A) {
  A.exercicios = A.exercicios || {};
  var LIBERA = 2;

  /* compara ignorando espaços extras, maiúsculas e espaços perto de , [ ] ( ) : */
  function norm(s) {
    return String(s).toLowerCase().replace(/×/g, 'x').replace(/\s+/g, ' ').trim()
      .replace(/\s*([,\[\]\(\):x])\s*/g, '$1');
  }

  A.renderExercicios = function (host, lesson) {
    var list = A.exercicios[lesson.id];
    if (!list || !list.length) return;
    var key = 'ex:' + lesson.id;
    var solved = A.store.get(key, []);

    var box = A.el('section', 'exs');
    box.innerHTML = '<div class="quiz-head"><h2 style="margin:0">Exercícios</h2><span class="head-right"><button class="btn sm ghost reset-btn" type="button">↺ Limpar respostas</button><span class="quiz-score"></span></span></div>' +
      '<p class="muted" style="margin:0 0 6px">Responda digitando. Saída com várias linhas? Separe por espaço.</p>';
    var scoreEl = A.$('.quiz-score', box);
    var gab = A.el('div', 'gabarito');
    A.$('.reset-btn', box).onclick = function () {
      A.confirm({
        icon: '↺', danger: true,
        title: 'Limpar exercícios?',
        msg: 'Suas respostas serão apagadas e o <b>gabarito volta a ficar bloqueado</b> até você acertar 2 de novo.',
        ok: 'Sim, limpar', cancel: 'Cancelar'
      }).then(function (sim) {
        if (!sim) return;
        A.store.set(key, []);
        var tmp = A.el('div');
        A.renderExercicios(tmp, lesson);
        box.replaceWith(tmp.firstChild);
        A.toast('Exercícios limpos');
      });
    };

    list.forEach(function (E, i) {
      var card = A.el('div', 'q ex');
      card.innerHTML = '<div class="qt"><span class="qn">' + (i + 1) + '.</span>' + E.q + '</div>';
      if (E.code) card.appendChild(A.codeBlock(E.code, { title: 'exercício', playground: false }));
      var row = A.el('form', 'ex-row');
      row.innerHTML = '<input type="text" spellcheck="false" autocomplete="off" placeholder="' + A.esc(E.ph || 'sua resposta') + '">' +
        '<button class="btn primary sm" type="submit">Conferir</button><span class="ex-fb"></span>';
      var input = A.$('input', row), fb = A.$('.ex-fb', row), btn = A.$('button', row);
      function markRight() {
        card.classList.add('done');
        input.disabled = true; btn.disabled = true;
        fb.className = 'ex-fb ok';
        fb.textContent = '✔ Certo!';
      }
      if (solved.indexOf(i) >= 0) { input.value = E.r[0]; markRight(); }
      row.onsubmit = function (e) {
        e.preventDefault();
        if (!input.value.trim()) return;
        var ok = E.r.some(function (r) { return norm(r) === norm(input.value); });
        if (ok) {
          if (solved.indexOf(i) < 0) solved.push(i);
          A.store.set(key, solved);
          markRight();
          update();
          if (solved.length === LIBERA) A.toast('Gabarito liberado! 🔓');
        } else {
          fb.className = 'ex-fb err';
          fb.textContent = '✘ Ainda não. Tente de novo.';
          A.retrigger(input, 'shake');
        }
      };
      input.addEventListener('input', function () { if (!card.classList.contains('done')) fb.textContent = ''; });
      card.appendChild(row);
      box.appendChild(card);
    });

    function update() {
      var n = solved.length;
      scoreEl.textContent = n + ' / ' + list.length + ' certos';
      if (n < LIBERA) {
        gab.className = 'gabarito locked';
        gab.innerHTML = '<b>🔒 Gabarito</b><span>Acerte ' + LIBERA + ' exercícios para liberar (faltam ' + (LIBERA - n) + ').</span>';
        return;
      }
      if (!gab.classList.contains('open')) {
        gab.className = 'gabarito open';
        gab.innerHTML = '<div class="gab-head"><b>🔓 Gabarito liberado</b><button class="btn sm" type="button">Ver gabarito</button></div><div class="gab-list" hidden></div>';
        var gl = A.$('.gab-list', gab);
        list.forEach(function (E, i) {
          var it = A.el('article', 'gab-item');
          var isOut = E.o !== undefined;
          it.innerHTML =
            '<header><span class="qn">' + (i + 1) + '</span><span class="gab-q">' + E.q + '</span></header>' +
            (E.code ? '<pre class="gab-code">' + A.highlight(E.code) + '</pre>' : '') +
            '<div class="gab-ans"><span class="gab-label">' + (isOut ? 'saída' : 'resposta') + '</span>' +
            '<pre>' + A.esc(isOut ? E.o : E.r[0]) + '</pre></div>' +
            '<p class="gab-sol"><span>💡</span><span>' + E.sol + '</span></p>';
          gl.appendChild(it);
        });
        var b = A.$('button', gab);
        b.onclick = function () {
          gl.hidden = !gl.hidden;
          b.textContent = gl.hidden ? 'Ver gabarito' : 'Esconder';
        };
      }
    }
    box.appendChild(gab);
    update();
    host.appendChild(box);
  };
})(window.ALG);
