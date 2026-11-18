/* =========================================================
   QUIZ + PROGRESSO
   ========================================================= */
(function (A) {
  /* ---------- quiz ----------
     questions: [{ q, code?, options:[...], answer: idx, explain }]
  */
  A.renderQuiz = function (host, lesson, questions) {
    var box = A.el('div', 'quiz');
    box.innerHTML = '<div class="quiz-head"><h2 style="margin:0">Teste rápido</h2><span class="quiz-score"></span></div>' +
      '';
    var scoreEl = A.$('.quiz-score', box);
    var right = 0, answered = 0;

    function update() {
      scoreEl.textContent = right + ' / ' + questions.length + ' certas';
      if (right === questions.length) A.toast('Mandou bem! 🎉');
    }

    questions.forEach(function (Q, qi) {
      var q = A.el('div', 'q');
      q.innerHTML = '<div class="qt"><span class="qn">' + (qi + 1) + '.</span>' + Q.q + '</div>';
      if (Q.code) q.appendChild(A.codeBlock(Q.code, { title: 'o que acontece?', playground: false }));
      var opts = A.el('div', 'opts');
      var solved = false;
      Q.options.forEach(function (o, oi) {
        var b = A.el('button', 'opt');
        b.innerHTML = o;
        b.onclick = function () {
          if (solved) return;
          if (oi === Q.answer) {
            solved = true;
            b.classList.add('right');
            A.$$('.opt', opts).forEach(function (x) { x.disabled = true; });
            right++;
            var ex = A.el('div', 'explain', '✔ ' + (Q.explain || 'Correto!'));
            q.appendChild(ex);
          } else {
            b.classList.add('wrong');
            b.disabled = true;
          }
          answered++;
          update();
        };
        opts.appendChild(b);
      });
      q.appendChild(opts);
      box.appendChild(q);
    });
    update();
    host.appendChild(box);
  };
  /* O quiz tambem participa do checkpoint final da aula. */
  A.quizPassed = function (lesson) {
    return !lesson.quiz || !lesson.quiz.length || !!A.store.get('quiz:' + lesson.id, false);
  };

  A.renderQuiz = function (host, lesson, questions, onComplete) {
    var box = A.el('div', 'quiz');
    box.innerHTML = '<div class="quiz-head"><h2 style="margin:0">Teste rapido</h2><span class="quiz-score"></span></div>';
    var scoreEl = A.$('.quiz-score', box);
    var right = 0;

    function update() {
      scoreEl.textContent = right + ' / ' + questions.length + ' certas';
      if (right === questions.length) {
        A.store.set('quiz:' + lesson.id, true);
        A.toast('Teste concluido! Agora escreva a logica aprendida.');
        if (onComplete) onComplete();
      }
    }

    questions.forEach(function (Q, qi) {
      var q = A.el('div', 'q');
      q.innerHTML = '<div class="qt"><span class="qn">' + (qi + 1) + '.</span>' + Q.q + '</div>';
      if (Q.code) q.appendChild(A.codeBlock(Q.code, { title: 'o que acontece?', playground: false }));
      var opts = A.el('div', 'opts');
      var solved = false;
      Q.options.forEach(function (o, oi) {
        var b = A.el('button', 'opt');
        b.innerHTML = o;
        b.onclick = function () {
          if (solved) return;
          if (oi === Q.answer) {
            solved = true;
            b.classList.add('right');
            A.$$('.opt', opts).forEach(function (x) { x.disabled = true; });
            right++;
            q.appendChild(A.el('div', 'explain', '&#10003; ' + (Q.explain || 'Correto!')));
          } else {
            b.classList.add('wrong');
            b.disabled = true;
          }
          update();
        };
        opts.appendChild(b);
      });
      q.appendChild(opts);
      box.appendChild(q);
    });
    if (A.quizPassed(lesson)) {
      right = questions.length;
      box.classList.add('passed');
    }
    update();
    host.appendChild(box);
  };

  A.renderCompletion = function (host, lesson, onComplete) {
    var box = A.el('section', 'lesson-completion');
    var saved = A.progress.answer(lesson.id);
    box.innerHTML =
      '<div class="completion-head"><div><span class="completion-kicker">CHECKPOINT DA ETAPA</span><h2>Explique a logica que voce aprendeu</h2></div><span class="completion-check" aria-hidden="true">&#10003;</span></div>' +
      '<p class="completion-copy">Escreva com suas palavras o que acontece nesta aula. Use os conceitos e exemplos que acabou de estudar.</p>' +
      '<textarea class="completion-input" rows="5" placeholder="Ex.: Um algoritmo ...">' + A.esc(saved) + '</textarea>' +
      '<div class="completion-foot"><span class="completion-status"></span><button class="btn primary completion-submit" type="button">Conferir e concluir etapa</button></div>';
    var input = A.$('.completion-input', box);
    var status = A.$('.completion-status', box);
    var submit = A.$('.completion-submit', box);

    function refresh() {
      var complete = A.progress.isComplete(lesson.id);
      var quizReady = A.quizPassed(lesson);
      if (complete) {
        input.value = A.progress.answer(lesson.id) || input.value;
        input.disabled = true;
        submit.disabled = true;
        status.className = 'completion-status ok';
        status.textContent = 'Etapa concluida';
      } else if (!quizReady) {
        submit.disabled = true;
        status.className = 'completion-status pending';
        status.textContent = 'Acerte o teste acima para liberar o check.';
      } else {
        submit.disabled = false;
        status.className = 'completion-status ready';
        status.textContent = 'Pronto para conferir';
      }
    }

    input.addEventListener('input', function () {
      status.textContent = '';
      status.className = 'completion-status';
    });
    submit.onclick = function () {
      var result = A.progress.validate(lesson, input.value);
      if (!result.ok) {
        status.className = 'completion-status error';
        status.textContent = result.message;
        input.focus();
        return;
      }
      A.progress.complete(lesson.id, input.value);
      refresh();
      if (onComplete) onComplete(input.value);
    };
    box.refresh = refresh;
    host.appendChild(box);
    refresh();
    return box;
  };
})(window.ALG);
