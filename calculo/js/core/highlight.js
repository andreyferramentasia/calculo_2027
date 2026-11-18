/* =========================================================
   Realce de sintaxe Python (tokenizador simples)
   A.highlightLines(code) -> array de linhas em HTML
   ========================================================= */
(function (A) {
  var KW = ('False None True and as assert break class continue def del elif else except ' +
    'finally for from global if import in is lambda nonlocal not or pass raise return try while with yield').split(' ');
  var BI = ('print input int float str bool len range type list dict tuple set sum min max abs round ' +
    'sorted enumerate zip map filter reversed').split(' ');
  var kwSet = {}, biSet = {};
  KW.forEach(function (k) { kwSet[k] = 1; });
  BI.forEach(function (k) { biSet[k] = 1; });

  var RE = /(#.*$)|([rfbRFB]?"(?:[^"\\\n]|\\.)*"?|[rfbRFB]?'(?:[^'\\\n]|\\.)*'?)|(\b\d+\.?\d*(?:[eE][+-]?\d+)?\b)|([A-Za-z_À-ſ][\wÀ-ſ]*)|([+\-*/%=<>!&|^~@]+)|(\s+)|([\s\S])/gm;

  function line(src) {
    var out = '', m, prevWord = '';
    RE.lastIndex = 0;
    while ((m = RE.exec(src)) !== null) {
      if (m[0] === '') { RE.lastIndex++; continue; }
      var t = A.esc(m[0]);
      if (m[1]) out += '<span class="c">' + t + '</span>';
      else if (m[2]) out += '<span class="s">' + t + '</span>';
      else if (m[3]) out += '<span class="n">' + t + '</span>';
      else if (m[4]) {
        var w = m[4];
        var next = src.slice(RE.lastIndex).match(/^\s*\(/);
        if (kwSet[w]) out += '<span class="k">' + t + '</span>';
        else if (prevWord === 'def') out += '<span class="f">' + t + '</span>';
        else if (biSet[w] && next) out += '<span class="b">' + t + '</span>';
        else if (next) out += '<span class="f">' + t + '</span>';
        else out += t;
        prevWord = w;
        continue;
      }
      else if (m[5]) out += '<span class="o">' + t + '</span>';
      else out += t;
      if (!m[6]) prevWord = '';
    }
    return out;
  }

  A.highlightLines = function (code) {
    return code.replace(/\s+$/, '').split('\n').map(line);
  };
  A.highlight = function (code) { return A.highlightLines(code).join('\n'); };

  /* bloco de código estático com cabeçalho, copiar e "abrir no playground" */
  A.codeBlock = function (code, opts) {
    opts = opts || {};
    var wrap = A.el('div', 'codeblock');
    var head = A.el('div', 'cb-head');
    head.innerHTML = '<span>' + A.esc(opts.title || 'python') + '</span>';
    var acts = A.el('div', 'acts');
    var copy = A.el('button', 'btn sm ghost', 'Copiar');
    copy.onclick = function () {
      try {
        navigator.clipboard.writeText(code.trim()).then(function () { A.toast('Código copiado!'); });
      } catch (e) { A.toast('Não foi possível copiar'); }
    };
    acts.appendChild(copy);
    if (opts.playground !== false) {
      var run = A.el('button', 'btn sm', '▶ Rodar');
      run.title = 'Abrir no Playground e executar com Python de verdade';
      run.onclick = function () { A.openInPlayground(code.trim()); };
      acts.appendChild(run);
    }
    head.appendChild(acts);
    wrap.appendChild(head);
    var pre = A.el('pre');
    pre.innerHTML = A.highlightLines(code.trim()).map(function (l, i) {
      return '<span class="ln" data-n="' + (i + 1) + '">' + (l || ' ') + '</span>';
    }).join('');
    wrap.appendChild(pre);
    if (opts.out) {
      var o = A.el('div', 'cb-out');
      o.textContent = opts.out;
      wrap.appendChild(o);
    }
    return wrap;
  };

  A.openInPlayground = function (code) {
    A.store.set('pg:pending', code);
    // lembra de onde o aluno veio para o botão "voltar para a aula"
    if (/^#\/aula\//.test(location.hash)) {
      A.store.set('pg:return', { hash: location.hash, y: window.scrollY, title: document.title });
    }
    location.hash = '#/playground';
  };
})(window.ALG);
