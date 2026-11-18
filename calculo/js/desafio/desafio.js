/* =========================================================
   DESAFIO (estilo quiz-show) — fim de cada seção
   Rota: #/desafio/<id>   (id em A.modules[].desafio)
   Só aparece no menu quando o professor libera no painel.
   Telas em partials/desafio.html; API em js/desafio/api.js.
   Resposta certa, tempo e pontos são conferidos no servidor:
   o navegador só recebe a pergunta.
   ========================================================= */
(function (A) {
  var tpl = null;              // <div> com os <template> do partial
  A.liberados = [];            // ids dos desafios liberados

  /* ---------- quais desafios estão liberados (para o menu) ---------- */
  A.carregarLiberados = function () {
    if (!A.DESAFIO_API) return Promise.resolve([]);
    return A.desafioApi('liberados', {}, {}).then(function (d) {
      A.liberados = d.liberados.map(function (x) { return x.id; });
      return A.liberados;
    }).catch(function () { return A.liberados; });
  };

  function tela(id) {
    return tpl.querySelector('#' + id).content.firstElementChild.cloneNode(true);
  }

  /* ---------- bloqueio de copiar/colar enquanto o desafio está aberto ---------- */
  A.desafioAtivo = false;
  var saidas = 0, emPergunta = false;
  function bloqueia(e) {
    if (!A.desafioAtivo) return;
    e.preventDefault();
    if (e.type === 'paste' || e.type === 'copy' || e.type === 'cut') A.toast('Copiar e colar estão bloqueados no desafio 🚫');
  }
  ['copy', 'cut', 'paste', 'contextmenu', 'dragstart', 'drop'].forEach(function (ev) {
    document.addEventListener(ev, bloqueia, true);
  });
  document.addEventListener('selectstart', function (e) {
    if (A.desafioAtivo && !(e.target.closest && e.target.closest('input'))) e.preventDefault();
  }, true);
  document.addEventListener('keydown', function (e) {
    if (!A.desafioAtivo) return;
    if ((e.ctrlKey || e.metaKey) && /^[cvxaspu]$/i.test(e.key)) bloqueia(e);
    if (e.shiftKey && e.key === 'Insert') bloqueia(e);
  }, true);
  document.addEventListener('visibilitychange', function () {
    if (A.desafioAtivo && emPergunta && document.hidden) saidas++;
  });

  /* ---------- render ---------- */
  A.renderDesafio = function (view, id) {
    var mod = A.modules.filter(function (m) { return m.desafio === id; })[0];
    if (!mod) { location.hash = '#/'; return; }
    A.desafioAtivo = true;
    saidas = 0;
    view.className = 'content desafio';
    view.innerHTML = '<header class="lesson-head"><div class="crumb">Módulo ' + (A.modules.indexOf(mod) + 1) + ' · <b>Desafio</b></div><h1>🏆 Desafio: ' + A.esc(mod.title) + '</h1></header><div class="d-stage"><p class="muted">Carregando…</p></div>';
    document.title = 'Desafio · ' + mod.title;
    var stage = A.$('.d-stage', view);
    var key = 'desafio:' + id;

    function vivo() { return A.desafioAtivo && stage.isConnected; }
    function mostra(el) { stage.innerHTML = ''; stage.appendChild(el); }
    function offline(msg) {
      var o = tela('d-offline');
      if (msg) A.$('.d-off-msg', o).textContent = msg;
      mostra(o);
    }
    function erroTela(err) {
      if (!vivo()) return;
      stage.innerHTML = '<div class="d-card d-center"><p class="d-erro"></p><button class="btn" type="button">Tentar de novo</button></div>';
      A.$('.d-erro', stage).textContent = err.message;
      A.$('button', stage).onclick = function () { A.renderDesafio(view, id); };
    }
    function avisoFila() {
      var p = A.$('.d-fila', stage);
      if (!p) { p = A.el('p', 'd-fila muted'); stage.appendChild(p); }
      p.textContent = 'Muita gente ao mesmo tempo… tentando de novo ⏳';
    }

    (tpl ? Promise.resolve() : A.partial('desafio').then(function (html) { tpl = A.el('div', '', html); }))
      .then(function () {
        if (!A.DESAFIO_API) return offline('Os desafios ainda não foram configurados.');
        var tok = A.store.get(key, null);
        if (tok) return retoma(tok);
        return A.carregarLiberados().then(function (lib) {
          if (lib.indexOf(id) < 0) return offline();
          entrada();
        });
      })
      .catch(function (err) {
        if (!tpl) { stage.innerHTML = '<p class="muted">Não foi possível carregar o desafio.</p>'; return; }
        erroTela(err);
      });

    function entrada() {
      var f = tela('d-entrada');
      A.$('.d-titulo', f).textContent = mod.title;
      A.$('.d-info', f).textContent = 'Responda às perguntas sobre as aulas de ' + mod.title.toLowerCase() + '.';
      var erro = A.$('.d-erro', f), go = A.$('.d-go', f);
      f.onsubmit = function (e) {
        e.preventDefault();
        var nome = f.nome.value.trim().replace(/\s+/g, ' ');
        if (nome.split(' ').length < 2) { erro.textContent = 'Digite nome e sobrenome.'; return; }
        go.disabled = true; erro.textContent = '';
        var tok = A.novoToken();
        A.desafioApi('iniciar', { secao: id, nome: nome, token: tok }, { aoRepetir: function () { erro.textContent = 'Muita gente ao mesmo tempo… tentando de novo ⏳'; } })
          .then(function () {
            A.store.set(key, tok);
            proxima(tok);
          })
          .catch(function (err) {
            erro.textContent = err.message;
            go.disabled = false;
          });
      };
      mostra(f);
      f.nome.focus();
    }

    function retoma(tok) {
      return proxima(tok);
    }

    function proxima(tok) {
      return A.desafioApi('pergunta', { token: tok, saidas: saidas }, { aoRepetir: avisoFila }).then(function (d) {
        if (!vivo()) return;
        if (d.fim) return fim(tok, d);
        pergunta(tok, d);
      }).catch(function (err) {
        if (err.status === 401) { A.store.set(key, null); A.renderDesafio(view, id); }
        else erroTela(err);
      });
    }

    function pergunta(tok, d) {
      var g = tela('d-pergunta');
      A.$('.d-prog', g).textContent = (d.i + 1) + ' / ' + d.total;
      A.$('.d-nome', g).textContent = d.nome;
      A.$('.d-pts', g).textContent = d.pontos + ' pts';
      A.$('.d-qtext', g).innerHTML = d.q;
      if (d.code) { var pre = A.$('.d-code', g); pre.hidden = false; pre.innerHTML = A.highlight(d.code); }
      var ops = A.$('.d-opcoes', g), botoes = [];
      d.opcoes.forEach(function (o, k) {
        var b = A.el('button', 'd-op d-op' + k);
        b.type = 'button';
        b.innerHTML = '<span class="d-letra">' + 'ABCD'[k] + '</span><span class="d-txt"></span>';
        A.$('.d-txt', b).textContent = o;      // texto puro: nunca HTML
        b.onclick = function () { responde(k); };
        ops.appendChild(b);
        botoes.push(b);
      });

      // cronômetro (o servidor também confere o tempo)
      var barra = A.$('.d-timer i', g), seg = A.$('.d-seg', g);
      var fimEm = performance.now() + d.restante * 1000;
      var respondido = false, raf;
      function tick() {
        if (!g.isConnected) return;
        var resta = Math.max(0, fimEm - performance.now());
        barra.style.width = (resta / (d.tempo * 1000) * 100) + '%';
        seg.textContent = Math.ceil(resta / 1000);
        g.classList.toggle('urgente', resta < 5000);
        if (resta <= 0) { responde(-1); return; }
        raf = requestAnimationFrame(tick);
      }

      function responde(k) {
        if (respondido) return;
        respondido = true;
        emPergunta = false;
        cancelAnimationFrame(raf);
        g.classList.remove('urgente');
        botoes.forEach(function (b, j) { b.disabled = true; if (j === k) b.classList.add('escolhida'); });
        A.desafioApi('responder', { token: tok, i: d.i, escolha: k, saidas: saidas }, { aoRepetir: avisoFila }).then(function (r) {
          if (!vivo()) return;
          var fila = A.$('.d-fila', stage); if (fila) fila.remove();
          botoes.forEach(function (b, j) {
            if (j === r.correta) b.classList.add('certa');
            else b.classList.add('apagada');
          });
          var fb = A.$('.d-feedback', g);
          fb.hidden = false;
          fb.classList.add(r.certo ? 'ok' : 'err');
          A.$('.d-fb-title', fb).textContent = r.certo ? '✔ Certo!' : (k < 0 || r.tempo_esgotado ? '⏰ Tempo esgotado' : '✘ Errou');
          A.$('.d-fb-pts', fb).textContent = r.certo ? '+' + r.ganhou + ' pts' : 'resposta: ' + 'ABCD'[r.correta];
          A.$('.d-pts', g).textContent = r.pontos + ' pts';
          var nx = A.$('.d-next', fb);
          nx.textContent = r.fim ? 'Ver resultado →' : 'Próxima →';
          nx.onclick = function () { nx.disabled = true; proxima(tok); };
          nx.focus();
        }).catch(function (err) {
          if (err.status === 409) proxima(tok);       // já respondida (outra aba / repetição)
          else erroTela(err);
        });
      }

      mostra(g);
      emPergunta = true;
      tick();
    }

    function fim(tok, d) {
      emPergunta = false;
      var f = tela('d-fim');
      A.$('.d-fim-nome', f).textContent = d.nome;
      A.$('.d-fim-acertos', f).textContent = d.acertos + '/' + d.total;
      A.$('.d-fim-pontos', f).textContent = d.pontos;
      var st = A.$('.d-salvo', f);
      mostra(f);
      if (d.salvo) { st.textContent = '✔ Resultado registrado.'; return; }
      function salva() {
        st.className = 'd-salvo muted';
        st.textContent = 'Salvando resultado…';
        A.desafioApi('salvar', { token: tok }, { tentativas: 12, aoRepetir: function () { st.textContent = 'Muita gente salvando ao mesmo tempo… na fila ⏳'; } })
          .then(function () { st.textContent = '✔ Resultado registrado.'; })
          .catch(function (err) {
            st.className = 'd-salvo d-erro';
            st.innerHTML = '';
            st.appendChild(document.createTextNode(err.message + ' '));
            var b = A.el('button', 'btn sm', 'Tentar salvar de novo');
            b.type = 'button';
            b.onclick = salva;
            st.appendChild(b);
          });
      }
      salva();
    }
  };
})(window.ALG);
