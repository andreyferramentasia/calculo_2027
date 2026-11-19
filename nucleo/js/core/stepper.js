/* =========================================================
   STEPPER — executa um programa linha a linha com animação
   ---------------------------------------------------------
   Cada exemplo é descrito por:
   {
     title: 'Somando com for',
     code:  `...código python...`,
     params: { n: 5 },             // entradas editáveis (opcional)
     viz: 'array' | ['ring','trail'] | null,
     gen: function* (P) {          // espelha o código em JS
        yield { l: 1, v: {x}, n: 'nota', p: 'print', c: ['x < 3', true], viz: {...} }
     }
   }
   Campos de cada passo (yield):
     l   linha executada (1 = primeira)
     v   variáveis visíveis {nome: valor}   (undefined = ainda não existe)
     n   explicação do passo (HTML)
     p   texto impresso (print)   e: final da linha (padrão '\n')
     inp texto "digitado" no input()
     c   [expressão, resultado]  -> selo de condição
     it  número da volta do loop
     viz dados para a visualização
   ========================================================= */
(function (A) {
  var SPEEDS = [0.5, 1, 2, 4];
  var BASE_MS = 1100;

  function clone(o) { return o === undefined ? undefined : JSON.parse(JSON.stringify(o)); }

  function parseParam(def, raw) {
    if (Array.isArray(def)) {
      return String(raw).split(',').map(function (s) { return s.trim(); }).filter(Boolean)
        .map(function (s) { var n = Number(s); return isNaN(n) ? s : n; });
    }
    if (typeof def === 'number') { var n = Number(String(raw).replace(',', '.')); return isNaN(n) ? def : n; }
    return String(raw);
  }

  function Stepper(host, ex) {
    this.host = host;
    this.ex = ex;
    this.params = clone(ex.params || {});
    this.i = 0;
    this.speedIdx = 1;
    this.playing = false;
    this.timer = null;
    this.memBoxes = {};
    this.vizNames = ex.viz ? (Array.isArray(ex.viz) ? ex.viz : [ex.viz]) : [];
    this.build();
    this.compute();
    this.render();
  }

  Stepper.prototype.build = function () {
    var self = this, ex = this.ex;
    var root = A.el('div', 'lab');
    root.innerHTML =
      '<div class="lab-head"><span class="tag">LAB</span><b></b><div class="lab-params"></div></div>' +
      '<div class="lab-body">' +
      '  <div class="lab-code"></div>' +
      '  <div class="lab-side">' +
      '    <div class="lab-status"></div>' +
      '    <div class="lab-panel lab-vizp"><h5>Visualização</h5><div class="lab-viz"></div></div>' +
      '    <div class="lab-panel"><h5>Memória (variáveis)</h5><div class="mem"></div></div>' +
      '    <div class="lab-panel"><h5>Saída do programa</h5><pre class="console"></pre></div>' +
      '  </div>' +
      '</div>' +
      '<div class="lab-note"><span class="ni">i</span><span class="nt"></span></div>' +
      '<div class="lab-controls">' +
      '  <button class="btn icon" data-a="first" title="Voltar ao início">⏮</button>' +
      '  <button class="btn icon" data-a="back" title="Passo anterior (←)">◀</button>' +
      '  <button class="btn primary play" data-a="play">▶ Executar</button>' +
      '  <button class="btn icon" data-a="next" title="Próximo passo (→)">▶|</button>' +
      '  <button class="btn icon" data-a="last" title="Ir para o fim">⏭</button>' +
      '  <div class="speed"></div>' +
      '  <input type="range" class="scrub" min="0" value="0" aria-label="Linha do tempo">' +
      '  <span class="count"></span>' +
      '</div>';
    A.$('.lab-head b', root).textContent = ex.title || 'Execução passo a passo';

    // código
    this.codeEl = A.$('.lab-code', root);
    this.renderCode();

    // parâmetros
    var pBox = A.$('.lab-params', root);
    Object.keys(this.params).forEach(function (k) {
      var def = ex.params[k];
      var lab = A.el('label');
      lab.innerHTML = '<span>' + A.esc(k) + ' =</span>';
      var inp = A.el('input');
      inp.type = 'text';
      if (Array.isArray(def) || (typeof def === 'string' && def.length > 8)) inp.className = 'wide';
      inp.value = Array.isArray(def) ? def.join(', ') : def;
      inp.title = 'Mude o valor e veja o programa recalcular';
      inp.addEventListener('change', function () {
        self.params[k] = parseParam(def, inp.value);
        self.stop();
        self.renderCode();
        self.compute();
        self.i = 0;
        self.resetVisuals();
        self.render();
        A.toast('Programa recalculado com ' + k + ' = ' + inp.value);
      });
      lab.appendChild(inp);
      pBox.appendChild(lab);
    });
    if (!Object.keys(this.params).length) pBox.remove();
    var pg = A.el('button', 'btn sm', '🐍 Rodar de verdade');
    pg.title = 'Abrir este código no Playground (Python real no navegador)';
    pg.onclick = function () { A.openInPlayground(self.codeText()); };
    A.$('.lab-head', root).appendChild(pg);

    // visualização
    if (!this.vizNames.length) A.$('.lab-vizp', root).remove();
    else {
      var vz = A.$('.lab-viz', root);
      this.vizEls = this.vizNames.map(function () { var d = A.el('div'); vz.appendChild(d); return d; });
    }

    // velocidade
    var sp = A.$('.speed', root);
    SPEEDS.forEach(function (s, idx) {
      var b = A.el('button', idx === self.speedIdx ? 'on' : '', s + '×');
      b.onclick = function () {
        self.speedIdx = idx;
        A.$$('button', sp).forEach(function (x, j) { x.classList.toggle('on', j === idx); });
      };
      sp.appendChild(b);
    });

    // ações
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-a]');
      if (!b) return;
      var a = b.dataset.a;
      if (a === 'play') self.toggle();
      else { self.stop(); self.go(a); }
    });
    this.scrub = A.$('.scrub', root);
    this.scrub.addEventListener('input', function () {
      self.stop();
      self.i = +self.scrub.value;
      self.render();
    });
    root.tabIndex = 0;
    root.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight') { self.stop(); self.go('next'); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { self.stop(); self.go('back'); e.preventDefault(); }
      if (e.key === ' ') { self.toggle(); e.preventDefault(); }
    });

    this.root = root;
    this.memEl = A.$('.mem', root);
    this.outEl = A.$('.console', root);
    this.noteEl = A.$('.nt', root);
    this.statusEl = A.$('.lab-status', root);
    this.playBtn = A.$('.play', root);
    this.countEl = A.$('.count', root);
    this.host.appendChild(root);
  };

  /* o código pode ser texto fixo ou função dos parâmetros */
  Stepper.prototype.codeText = function () {
    var c = this.ex.code;
    return typeof c === 'function' ? c(this.params, A.repr) : c;
  };
  Stepper.prototype.renderCode = function () {
    var self = this;
    this.codeEl.innerHTML = '';
    this.lineEls = [];
    A.highlightLines(this.codeText()).forEach(function (html, i) {
      var ln = A.el('span', 'ln');
      ln.dataset.n = i + 1;
      ln.innerHTML = (html || ' ') + '<span class="hits hidden"></span>';
      self.codeEl.appendChild(ln);
      self.lineEls.push(ln);
    });
  };

  /* roda o gerador inteiro e guarda cada "foto" do estado */
  Stepper.prototype.compute = function () {
    var steps = [];
    var out = '';
    steps.push({ l: 0, v: {}, out: '', fresh: '', n: 'Pronto. Clique em <b>▶ Executar</b> ou avance com <b>▶|</b> para ver cada linha rodando.', viz: null });
    var it, r, guard = 0, err = null;
    try {
      it = this.ex.gen(clone(this.params));
      while (!(r = it.next()).done && guard++ < 4000) {
        var s = r.value || {};
        var fresh = '';
        if (s.p !== undefined || s.inp !== undefined) {
          var pieces = Array.isArray(s.p) ? s.p : [s.p === undefined ? '' : s.p];
          var end = s.e === undefined ? '\n' : s.e;
          pieces.forEach(function (txt, idx) {
            fresh += A.esc(txt);
            if (idx === pieces.length - 1 && s.inp !== undefined) fresh += '<span class="inp">' + A.esc(s.inp) + '</span>';
            fresh += idx === pieces.length - 1 ? A.esc(end) : '\n';
          });
          out += fresh;
        }
        steps.push({
          l: s.l || 0,
          v: clone(s.v || {}),
          n: s.n || '',
          c: s.c ? clone(s.c) : null,
          it: s.it,
          viz: clone(s.viz),
          out: out,
          fresh: fresh
        });
      }
    } catch (e) {
      err = e;
      console.error(e);
    }
    var last = steps[steps.length - 1];
    steps.push({
      l: -1,
      v: last.v,
      out: last.out,
      fresh: '',
      viz: last.viz,
      n: err ? 'Erro na simulação: ' + A.esc(err.message) : (this.ex.endNote || '<b>Fim do programa.</b> Use ◀ para voltar e rever qualquer passo.')
    });
    this.steps = steps;
    // contagem de execuções por linha (acumulada)
    var hits = [], acc = {};
    steps.forEach(function (st) {
      if (st.l > 0) acc[st.l] = (acc[st.l] || 0) + 1;
      hits.push(Object.assign({}, acc));
    });
    this.hits = hits;
    this.scrub.max = steps.length - 1;
  };

  Stepper.prototype.resetVisuals = function () {
    this.memEl.innerHTML = '';
    this.memBoxes = {};
    if (this.vizEls) this.vizEls.forEach(function (e) { e.innerHTML = ''; e._st = null; });
  };

  Stepper.prototype.go = function (a) {
    var n = this.steps.length - 1;
    if (a === 'first') this.i = 0;
    if (a === 'back') this.i = Math.max(0, this.i - 1);
    if (a === 'next') this.i = Math.min(n, this.i + 1);
    if (a === 'last') this.i = n;
    this.render();
  };

  Stepper.prototype.toggle = function () {
    if (this.playing) this.stop();
    else {
      if (this.i >= this.steps.length - 1) { this.i = 0; this.render(); }
      this.playing = true;
      this.playBtn.textContent = '⏸ Pausar';
      this.tick();
    }
  };
  Stepper.prototype.tick = function () {
    var self = this;
    clearTimeout(this.timer);
    this.timer = setTimeout(function () {
      if (!self.playing) return;
      if (!document.body.contains(self.root)) { self.stop(); return; }
      if (self.i >= self.steps.length - 1) { self.stop(); return; }
      self.i++;
      self.render();
      self.tick();
    }, BASE_MS / SPEEDS[this.speedIdx]);
  };
  Stepper.prototype.stop = function () {
    this.playing = false;
    clearTimeout(this.timer);
    if (this.playBtn) this.playBtn.textContent = this.i >= this.steps.length - 1 ? '↻ De novo' : '▶ Executar';
  };

  Stepper.prototype.render = function () {
    var st = this.steps[this.i];
    var prev = this.steps[this.i - 1] || null;
    var self = this;

    // linhas
    var hits = this.hits[this.i];
    var prevL = prev ? prev.l : 0;
    this.lineEls.forEach(function (ln, idx) {
      var n = idx + 1;
      ln.classList.toggle('active', st.l === n);
      ln.classList.toggle('prev', st.l !== n && prevL === n);
      ln.classList.toggle('ran', !!hits[n]);
      var h = ln.lastChild;
      if (hits[n] > 1) { h.classList.remove('hidden'); h.textContent = hits[n] + '×'; }
      else h.classList.add('hidden');
    });
    var act = this.lineEls[st.l - 1];
    if (act && this.playing) {
      var box = act.parentNode;
      var top = act.offsetTop - box.clientHeight / 2;
      if (act.offsetTop < box.scrollTop || act.offsetTop > box.scrollTop + box.clientHeight - 30) box.scrollTop = top;
    }

    // status
    var html = '<span class="pill">passo ' + this.i + '/' + (this.steps.length - 1) + '</span>';
    if (st.l > 0) html += '<span class="pill">linha ' + st.l + '</span>';
    if (st.it !== undefined && st.it !== null) html += '<span class="pill it">volta ' + st.it + '</span>';
    if (st.c) html += '<span class="pill cond ' + (st.c[1] ? 'true' : 'false') + '">' + A.esc(st.c[0]) + ' → ' + (st.c[1] ? 'True' : 'False') + '</span>';
    if (st.l === -1) html += '<span class="pill cond true">✔ terminou</span>';
    this.statusEl.innerHTML = html;

    // memória
    this.renderMem(st.v, prev ? prev.v : {});

    // saída
    if (st.fresh) {
      this.outEl.innerHTML = st.out.slice(0, st.out.length - st.fresh.length) + '<span class="fresh">' + st.fresh + '</span>';
    } else {
      this.outEl.innerHTML = st.out;
    }
    if (st.l !== -1) this.outEl.innerHTML += '<span class="cursor"></span>';
    this.outEl.scrollTop = this.outEl.scrollHeight;

    // nota
    var note = st.n || (st.l > 0 ? 'Executando a linha ' + st.l + '.' : '');
    if (this.noteEl.innerHTML !== note) {
      this.noteEl.innerHTML = note;
      A.retrigger(this.noteEl, 'nt');
    }

    // visualização
    if (this.vizEls) {
      this.vizNames.forEach(function (name, idx) {
        var data = st.viz;
        if (data && self.vizNames.length > 1) data = data[name];
        var pdata = prev && prev.viz ? (self.vizNames.length > 1 ? prev.viz[name] : prev.viz) : null;
        var fn = A.viz[name];
        if (fn) fn(self.vizEls[idx], data || null, { prev: pdata, ex: self.ex, step: st, params: self.params });
      });
    }

    // controles
    this.scrub.value = this.i;
    this.countEl.textContent = this.i + ' / ' + (this.steps.length - 1);
    if (!this.playing) this.playBtn.textContent = this.i >= this.steps.length - 1 ? '↻ De novo' : '▶ Executar';
  };

  Stepper.prototype.renderMem = function (vars, prevVars) {
    var self = this;
    var names = Object.keys(vars);
    if (!names.length) {
      this.memEl.innerHTML = '<span class="empty">nenhuma variável ainda</span>';
      this.memBoxes = {};
      return;
    }
    var empty = A.$('.empty', this.memEl);
    if (empty) empty.remove();
    Object.keys(this.memBoxes).forEach(function (k) {
      if (!(k in vars)) { self.memBoxes[k].remove(); delete self.memBoxes[k]; }
    });
    names.forEach(function (k) {
      var v = vars[k];
      var t = A.type(v);
      var r = A.repr(v);
      var box = self.memBoxes[k];
      if (!box) {
        box = A.el('div', 'mbox new');
        box.innerHTML = '<span class="mtype"></span><span class="mname"></span><span class="mval"></span>';
        A.$('.mname', box).textContent = k;
        A.autoClean(box);
        self.memEl.appendChild(box);
        self.memBoxes[k] = box;
      }
      if (box.dataset.t !== t) {
        if (box.dataset.t) box.classList.remove('t-' + box.dataset.t);
        box.classList.add('t-' + t);
        box.dataset.t = t;
      }
      A.$('.mtype', box).textContent = t;
      var mv = A.$('.mval', box);
      if (mv.textContent !== r) {
        mv.textContent = r;
        mv.title = r;
        if (prevVars && k in prevVars) A.retrigger(box, 'flash');
      }
    });
    // mantém a ordem de criação
    names.forEach(function (k) { self.memEl.appendChild(self.memBoxes[k]); });
  };

  A.Stepper = Stepper;
})(window.ALG);
