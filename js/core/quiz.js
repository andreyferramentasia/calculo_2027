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
})(window.ALG);
