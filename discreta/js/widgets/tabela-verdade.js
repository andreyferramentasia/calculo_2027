/* =========================================================
   WIDGET: tabela-verdade de qualquer expressão
   Aceita: letras A–E, ′ ' ¬ ~ not, ∧ & and, ∨ | or, ⊕ xor,
           → -> =>, ↔ <-> <=>, parênteses.
   Precedência (como na aula): ( ), ′, ∧ ∨ ⊕ (mesmo nível,
   da esquerda p/ direita), →, ↔.
   Também exporta A.ttHtml(cabecalhos, linhas, opts) para as aulas.
   ========================================================= */
(function (A) {
  /* ---------- tabela estática para as aulas ----------
     A.ttHtml(['A','B','A ∧ B'], ['VVV','VFF',...])  ou linhas como arrays
     opts.res: índice da coluna de resultado (padrão: a última) */
  A.ttHtml = function (cab, linhas, opts) {
    opts = opts || {};
    var res = opts.res === undefined ? cab.length - 1 : opts.res;
    var h = '<div class="tt-wrap"><table class="tt"><thead><tr>' + cab.map(function (c, i) {
      return '<th' + (i === res ? ' class="res"' : '') + '>' + c + '</th>';
    }).join('') + '</tr></thead><tbody>';
    linhas.forEach(function (l) {
      var cel = typeof l === 'string' ? l.split('') : l;
      h += '<tr>' + cel.map(function (v, i) {
        var cls = v === 'V' ? 'v' : v === 'F' ? 'f' : v === '✓' ? 'ok' : v === '✗' ? 'no' : '';
        if (i === res) cls += ' res';
        return '<td class="' + cls.trim() + '">' + v + '</td>';
      }).join('') + '</tr>';
    });
    return h + '</tbody></table></div>';
  };

  /* ---------- analisador ---------- */
  function tokens(s) {
    var out = [], i = 0, m;
    var R = [
      [/^\s+/, null],
      [/^(<->|<=>|↔)/, 'IFF'], [/^(->|=>|→)/, 'IMP'],
      [/^(∧|&&?|and\b)/, 'AND'], [/^(∨|\|\|?|or\b)/, 'OR'], [/^(⊕|xor\b)/, 'XOR'],
      [/^(¬|~|!|not\b)/, 'NOT'], [/^['′’]/, 'POST'],
      [/^\(/, '('], [/^\)/, ')'], [/^[A-E]/, 'VAR']
    ];
    while (i < s.length) {
      var rest = s.slice(i), ok = false;
      for (var k = 0; k < R.length; k++) {
        if ((m = R[k][0].exec(rest))) {
          if (R[k][1]) out.push({ t: R[k][1], v: m[0] });
          i += m[0].length; ok = true; break;
        }
      }
      if (!ok) throw new Error('Não entendi "' + rest[0] + '". Use letras de A a E e os conectivos dos botões.');
    }
    return out;
  }

  function parse(s) {
    var tk = tokens(s), p = 0;
    function peek(t) { return tk[p] && tk[p].t === t; }
    function iff() {
      var l = imp();
      while (peek('IFF')) { p++; l = { op: '↔', a: l, b: imp() }; }
      return l;
    }
    function imp() {
      var l = bin();
      if (peek('IMP')) { p++; return { op: '→', a: l, b: imp() }; }
      return l;
    }
    function bin() {
      var l = un();
      while (peek('AND') || peek('OR') || peek('XOR')) {
        var t = tk[p++].t;
        l = { op: t === 'AND' ? '∧' : t === 'OR' ? '∨' : '⊕', a: l, b: un() };
      }
      return l;
    }
    function un() {
      if (peek('NOT')) { p++; return { op: '′', a: un() }; }
      var x = atom();
      while (peek('POST')) { p++; x = { op: '′', a: x }; }
      return x;
    }
    function atom() {
      if (peek('VAR')) return { v: tk[p++].v };
      if (peek('(')) {
        p++;
        var x = iff();
        if (!peek(')')) throw new Error('Falta fechar um parêntese.');
        p++;
        return x;
      }
      throw new Error(tk[p] ? 'Esperava uma letra ou "(" antes de "' + tk[p].v + '".' : 'A expressão terminou no meio.');
    }
    if (!tk.length) throw new Error('Digite uma expressão.');
    var r = iff();
    if (p < tk.length) throw new Error('Sobrou "' + tk[p].v + '" no fim. Faltou um conectivo?');
    return r;
  }

  function txt(n, top) {
    if (n.v) return n.v;
    if (n.op === '′') return (n.a.v || n.a.op === '′' ? txt(n.a) : '(' + txt(n.a, true) + ')') + '′';
    var s = txt(n.a) + ' ' + n.op + ' ' + txt(n.b);
    return top ? s : '(' + s + ')';
  }
  function py(n) {
    if (n.v) return n.v;
    if (n.op === '′') return 'not ' + (n.a.v ? n.a.v : '(' + py(n.a) + ')');
    var a = py(n.a), b = py(n.b);
    if (n.op === '∧') return '(' + a + ' and ' + b + ')';
    if (n.op === '∨') return '(' + a + ' or ' + b + ')';
    if (n.op === '⊕') return '(' + a + ' != ' + b + ')';
    if (n.op === '→') return '((not ' + a + ') or ' + b + ')';
    return '(' + a + ' == ' + b + ')';
  }
  function ev(n, env) {
    if (n.v) return env[n.v];
    var a = ev(n.a, env);
    if (n.op === '′') return !a;
    var b = ev(n.b, env);
    switch (n.op) {
      case '∧': return a && b;
      case '∨': return a || b;
      case '⊕': return a !== b;
      case '→': return !a || b;
      default: return a === b;
    }
  }
  function vars(n, acc) {
    if (n.v) { if (acc.indexOf(n.v) < 0) acc.push(n.v); }
    else { vars(n.a, acc); if (n.b) vars(n.b, acc); }
    return acc;
  }
  function subs(n, acc) {                 // subexpressões em ordem de cálculo
    if (n.v) return acc;
    subs(n.a, acc); if (n.b) subs(n.b, acc);
    var k = txt(n, true);
    if (!acc.some(function (x) { return x.k === k; })) acc.push({ k: k, n: n });
    return acc;
  }

  A.ttParse = parse;

  A.widgets.tabelaVerdade = function (host, opts) {
    opts = opts || {};
    var body = A.widgetBox(host, 'Monte a sua tabela-verdade');
    var teclas = ['A', 'B', 'C', '′', '∧', '∨', '⊕', '→', '↔', '(', ')'];
    var presets = opts.presets || ['A ∧ B', 'A → B', '(A ∧ B)′', 'A′ ∨ B′', 'A ∨ A′', '(A ∧ B) → (A ∨ B)', 'A ∨ B′ → C'];
    body.innerHTML =
      '<label class="field">expressão <input class="wtt-in" type="text" spellcheck="false" autocomplete="off"></label>' +
      '<div class="wtt-teclas"></div>' +
      '<div class="widget-row" style="margin-bottom:8px"><label class="field">exemplos <select class="wtt-pre"><option value="">escolha…</option></select></label></div>' +
      '<div class="result-line wtt-leitura"></div>' +
      '<div class="pycall wtt-py"></div>' +
      '<div class="wtt-tab"></div>' +
      '<p class="wtt-selo"></p>';
    var inp = A.$('.wtt-in', body), tk = A.$('.wtt-teclas', body), pre = A.$('.wtt-pre', body);
    var leit = A.$('.wtt-leitura', body), pyl = A.$('.wtt-py', body), tab = A.$('.wtt-tab', body), selo = A.$('.wtt-selo', body);
    teclas.forEach(function (t) {
      var b = A.el('button', '', t);
      b.type = 'button';
      b.onclick = function () {
        var s = inp.selectionStart || inp.value.length, e = inp.selectionEnd || s;
        var ins = /[A-E()′]/.test(t) ? t : ' ' + t + ' ';
        inp.value = inp.value.slice(0, s) + ins + inp.value.slice(e);
        inp.focus();
        inp.selectionStart = inp.selectionEnd = s + ins.length;
        upd();
      };
      tk.appendChild(b);
    });
    var lb = A.el('button', '', '⌫'); lb.type = 'button';
    lb.onclick = function () { inp.value = ''; inp.focus(); upd(); };
    tk.appendChild(lb);
    presets.forEach(function (p) { var o = A.el('option'); o.value = p; o.textContent = p; pre.appendChild(o); });
    pre.onchange = function () { if (pre.value) { inp.value = pre.value; upd(); } };

    function upd() {
      var arv;
      try { arv = parse(inp.value); }
      catch (err) {
        leit.textContent = ''; pyl.textContent = ''; tab.innerHTML = '';
        selo.innerHTML = inp.value.trim() ? '<span class="selo erro">⚠ ' + A.esc(err.message) + '</span>' : '';
        return;
      }
      var vs = vars(arv, []).sort();
      if (vs.length > 4) { selo.innerHTML = '<span class="selo erro">Use no máximo 4 letras (16 linhas).</span>'; tab.innerHTML = ''; return; }
      var cols = subs(arv, []);
      leit.innerHTML = '<span class="lbl">o computador lê como →</span> <b>' + A.esc(txt(arv, true)) + '</b>';
      pyl.innerHTML = A.highlight('print(' + py(arv) + ')');
      var linhas = [], todasV = true, todasF = true, n = vs.length;
      for (var r = 0; r < (1 << n); r++) {
        var env = {}, l = [];
        vs.forEach(function (v, i) { env[v] = !((r >> (n - 1 - i)) & 1); l.push(env[v] ? 'V' : 'F'); });
        cols.forEach(function (c) { l.push(ev(c.n, env) ? 'V' : 'F'); });
        var fim = ev(arv, env);
        if (fim) todasF = false; else todasV = false;
        linhas.push(l);
      }
      tab.innerHTML = A.ttHtml(vs.concat(cols.map(function (c) { return A.esc(c.k); })), linhas);
      selo.innerHTML = todasV ? '<span class="selo tauto">TAUTOLOGIA: sempre V</span>' :
        todasF ? '<span class="selo contra">CONTRADIÇÃO: sempre F</span>' :
        '<span class="selo conting">CONTINGÊNCIA: depende dos valores</span>';
      selo.innerHTML += ' <span class="muted" style="font-size:.88rem">' + n + ' letra' + (n > 1 ? 's' : '') + ' → 2<sup>' + n + '</sup> = ' + (1 << n) + ' linhas</span>';
    }
    inp.addEventListener('input', upd);
    inp.value = opts.expr || 'A → B';
    upd();
  };
})(window.ALG);
