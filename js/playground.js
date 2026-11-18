/* =========================================================
   PLAYGROUND — Python de verdade no navegador (Pyodide)
   O Pyodide (~10 MB) só é baixado quando o aluno clica em
   "Executar" pela primeira vez. Requer internet.
   ========================================================= */
(function (A) {
  var PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
  var pyodide = null, loading = null;

  var EXAMPLES = {
    'Olá, mundo': 'nome = "Python"\nprint(f"Olá, {nome}!")\nfor i in range(3):\n    print("volta", i)',
    'Tabuada': 'n = 7\nfor i in range(1, 11):\n    print(f"{n} x {i:2} = {n * i:3}")',
    'Bubble Sort': 'v = [5, 2, 8, 1, 9, 3]\nn = len(v)\nfor i in range(n - 1):\n    for j in range(n - 1 - i):\n        if v[j] > v[j + 1]:\n            v[j], v[j + 1] = v[j + 1], v[j]\n    print(f"passada {i + 1}: {v}")',
    'Matriz × matriz': 'A = [[1, 2], [3, 4]]\nB = [[5, 6], [7, 8]]\nC = [[0, 0], [0, 0]]\nfor i in range(2):\n    for j in range(2):\n        for k in range(2):\n            C[i][j] += A[i][k] * B[k][j]\nfor linha in C:\n    print(linha)',
    'NumPy': 'import numpy as np\n\nA = np.array([[1, 2], [3, 4]])\nB = np.array([[5, 6], [7, 8]])\nprint("A @ B =\\n", A @ B)\nprint("det(A) =", round(np.linalg.det(A), 3))\nprint(np.arange(12).reshape(3, 4))',
    'Gráfico (matplotlib)': 'import numpy as np\nimport matplotlib.pyplot as plt\n\nx = np.linspace(0, 10, 200)\nplt.plot(x, np.sin(x), label="sen(x)")\nplt.plot(x, np.cos(x), "--", label="cos(x)")\nplt.legend()\nplt.grid(True)\nplt.show()'
  };

  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = res;
      s.onerror = function () { rej(new Error('Não foi possível baixar o Pyodide. Verifique sua conexão com a internet.')); };
      document.head.appendChild(s);
    });
  }

  function getPyodide(status) {
    if (pyodide) return Promise.resolve(pyodide);
    if (loading) return loading;
    status('Baixando o Python (só na primeira vez, ~10 MB)…');
    loading = loadScript(PYODIDE_URL + 'pyodide.js')
      .then(function () { return window.loadPyodide({ indexURL: PYODIDE_URL }); })
      .then(function (py) { pyodide = py; return py; })
      .catch(function (e) { loading = null; throw e; });
    return loading;
  }

  A.renderPlayground = function (view) {
    view.className = 'content wide';
    document.title = 'Playground Python';
    var pending = A.store.get('pg:pending', null);
    if (pending) A.store.set('pg:pending', null);
    var code = pending || A.store.get('pg:code', EXAMPLES['Olá, mundo']);

    var back = A.store.get('pg:return', null);
    view.innerHTML =
      '<header class="lesson-head" style="margin-bottom:18px">' +
      (back ? '  <button class="btn pg-back" style="margin-bottom:14px">← Voltar para ' + A.esc(back.title) + '</button>' : '') +
      '  <div class="crumb"><b>Playground</b></div>' +
      '  <h1>Python de verdade, no navegador</h1>' +
      '  <p class="muted" style="margin:0">Escreva e execute Python 3 aqui mesmo (com NumPy e matplotlib). Atalho: <kbd>Ctrl</kbd>+<kbd>Enter</kbd> executa. O <code>input()</code> abre uma caixa de diálogo.</p>' +
      '</header>' +
      '<div class="pg">' +
      '  <div class="pg-editor">' +
      '    <div class="pg-bar"><span class="title">main.py</span>' +
      '      <select class="pg-ex btn sm" style="padding:5px 8px"><option value="">Exemplos…</option></select>' +
      '      <button class="btn sm primary pg-run">▶ Executar</button>' +
      '    </div>' +
      '    <div class="wrap"><div class="gutter"></div><div class="stack"><pre class="hl" aria-hidden="true"></pre><textarea spellcheck="false" autocapitalize="off" autocomplete="off"></textarea></div></div>' +
      '  </div>' +
      '  <div class="pg-output">' +
      '    <div class="pg-bar"><span class="title">saída</span><span class="pg-status">Python ainda não carregado</span><button class="btn sm ghost pg-clear">Limpar</button></div>' +
      '    <pre></pre>' +
      '  </div>' +
      '</div>';

    var ta = A.$('textarea', view), hl = A.$('.hl', view), gutter = A.$('.gutter', view);
    var out = A.$('.pg-output pre', view), status = A.$('.pg-status', view), runBtn = A.$('.pg-run', view);
    var sel = A.$('.pg-ex', view);
    Object.keys(EXAMPLES).forEach(function (k) { var o = A.el('option'); o.value = k; o.textContent = k; sel.appendChild(o); });

    ta.value = code;
    function sync() {
      hl.innerHTML = A.highlight(ta.value) + '\n';
      var n = ta.value.split('\n').length;
      var g = '';
      for (var i = 1; i <= n; i++) g += i + '\n';
      gutter.textContent = g;
      A.store.set('pg:code', ta.value);
    }
    ta.addEventListener('input', sync);
    ta.addEventListener('scroll', function () {
      hl.style.transform = 'translate(' + (-ta.scrollLeft) + 'px,' + (-ta.scrollTop) + 'px)';
      gutter.scrollTop = ta.scrollTop;
    });
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        var s = ta.selectionStart;
        ta.setRangeText('    ', s, ta.selectionEnd, 'end');
        sync();
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        run();
      } else if (e.key === 'Enter') {
        // mantém a indentação e adiciona 4 espaços depois de ":"
        var pos = ta.selectionStart;
        var lineStart = ta.value.lastIndexOf('\n', pos - 1) + 1;
        var line = ta.value.slice(lineStart, pos);
        var indent = /^\s*/.exec(line)[0];
        if (/:\s*$/.test(line)) indent += '    ';
        e.preventDefault();
        ta.setRangeText('\n' + indent, pos, ta.selectionEnd, 'end');
        sync();
      }
    });
    sel.onchange = function () {
      if (!sel.value) return;
      ta.value = EXAMPLES[sel.value];
      sel.value = '';
      sync();
    };
    A.$('.pg-clear', view).onclick = function () { out.innerHTML = ''; };
    var backBtn = A.$('.pg-back', view);
    if (backBtn) backBtn.onclick = function () {
      A.restoreY = back.y;          // app.js rola de volta até o lab
      location.hash = back.hash;
    };
    runBtn.onclick = run;
    sync();

    function write(text, cls) {
      var s = A.el('span', cls || '');
      s.textContent = text;
      out.appendChild(s);
      out.scrollTop = out.scrollHeight;
    }
    function setStatus(t, ready) { status.textContent = t; status.classList.toggle('ready', !!ready); }

    function run() {
      runBtn.disabled = true;
      out.innerHTML = '';
      getPyodide(setStatus).then(function (py) {
        setStatus('Executando…');
        py.setStdout({ batched: function (s) { write(s + '\n'); } });
        py.setStderr({ batched: function (s) { write(s + '\n', 'err'); } });
        py.setStdin({ stdin: function () { var r = window.prompt('input():'); if (r === null) r = ''; write(r + '\n', 'sys'); return r; } });
        var src = ta.value;
        return py.loadPackagesFromImports(src, { messageCallback: function (m) { setStatus(m); } }).then(function () {
          var usesPlt = /matplotlib/.test(src);
          if (usesPlt) {
            py.globals.set('_alg_img', function (b64) {
              var img = A.el('img');
              img.src = 'data:image/png;base64,' + b64;
              img.alt = 'Gráfico gerado pelo matplotlib';
              out.appendChild(img);
              out.appendChild(document.createTextNode('\n'));
            });
            py.runPython(
              'import matplotlib\nmatplotlib.use("AGG")\nimport matplotlib.pyplot as _plt, io as _io, base64 as _b64\n' +
              'def _alg_show(*a, **k):\n    _buf = _io.BytesIO()\n    _plt.savefig(_buf, format="png", dpi=100, bbox_inches="tight")\n    _plt.close("all")\n    _alg_img(_b64.b64encode(_buf.getvalue()).decode())\n' +
              '_plt.show = _alg_show\n');
          }
          var t0 = performance.now();
          return py.runPythonAsync(src).then(function () {
            write('\n[programa terminou em ' + Math.round(performance.now() - t0) + ' ms]', 'sys');
          });
        });
      }).catch(function (e) {
        var msg = String(e && e.message || e);
        // mostra só a parte relevante do traceback
        var i = msg.indexOf('File "<exec>"');
        write(i >= 0 ? 'Traceback:\n  ' + msg.slice(i) : msg, 'err');
      }).then(function () {
        runBtn.disabled = false;
        if (pyodide) setStatus('Python pronto ✓', true);
      });
    }

    if (pending) A.toast('Código carregado da aula. Clique em ▶ Executar');
  };
})(window.ALG);
