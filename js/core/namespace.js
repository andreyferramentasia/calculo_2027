/* =========================================================
   ALG — namespace global e utilitários
   Os scripts são clássicos (sem ES modules) para o site
   funcionar abrindo o index.html direto (file://).
   ========================================================= */
window.ALG = window.ALG || {};

(function (A) {
  A.lessons = [];   // aulas registradas por js/lessons/*.js
  A.modules = [];   // módulos (ordem + metadados)
  A.widgets = {};   // widgets interativos  (js/widgets/*.js)
  A.viz = {};       // visualizações do lab  (js/core/viz.js)

  /* ---------- registro ---------- */
  A.module = function (def) { A.modules.push(def); };
  A.lesson = function (def) { A.lessons.push(def); };

  /* ---------- Valores "Python" ----------
     Representamos tipos que o JS não distingue:
       A.F(2)        -> float 2.0
       A.T([1,2])    -> tupla (1, 2)
       A.D({a:1})    -> dict {'a': 1}
       A.NP([1,2])   -> numpy.ndarray
       A.FN('nome')  -> <function nome>
       A.MOD('math') -> <module 'math'>
  */
  A.F = function (x) { return { $f: x }; };
  A.T = function (arr) { return { $t: arr }; };
  A.D = function (obj) { return { $d: obj }; };
  A.NP = function (arr) { return { $np: arr }; };
  A.FN = function (name) { return { $fn: name }; };
  A.MOD = function (name) { return { $mod: name }; };

  function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v); }

  A.fmtFloat = function (x) {
    if (Number.isNaN(x)) return 'nan';
    if (!isFinite(x)) return x > 0 ? 'inf' : '-inf';
    if (Number.isInteger(x) && Math.abs(x) < 1e16) return x.toFixed(1);
    var s = String(x);
    if (s.indexOf('e') >= 0) {           // 1e-05 no Python
      s = s.replace(/e([+-])(\d)$/, 'e$10$2');
    }
    return s;
  };

  A.type = function (v) {
    if (v === null || v === undefined) return 'NoneType';
    if (typeof v === 'boolean') return 'bool';
    if (typeof v === 'number') return Number.isInteger(v) ? 'int' : 'float';
    if (typeof v === 'string') return 'str';
    if (Array.isArray(v)) return 'list';
    if (isObj(v)) {
      if ('$f' in v) return 'float';
      if ('$t' in v) return 'tuple';
      if ('$d' in v) return 'dict';
      if ('$np' in v) return 'ndarray';
      if ('$fn' in v) return 'function';
      if ('$mod' in v) return 'module';
    }
    return 'object';
  };

  /* repr() — como o Python mostra o valor dentro de listas / no REPL */
  A.repr = function (v) {
    var t = A.type(v);
    switch (t) {
      case 'NoneType': return 'None';
      case 'bool': return v ? 'True' : 'False';
      case 'int': return String(v);
      case 'float': return A.fmtFloat(isObj(v) ? v.$f : v);
      case 'str': return v.indexOf("'") >= 0 && v.indexOf('"') < 0 ? '"' + v + '"' : "'" + v.replace(/'/g, "\\'") + "'";
      case 'list': return '[' + v.map(A.repr).join(', ') + ']';
      case 'tuple': return '(' + v.$t.map(A.repr).join(', ') + (v.$t.length === 1 ? ',' : '') + ')';
      case 'dict': return '{' + Object.keys(v.$d).map(function (k) {
        var key = /^-?\d+$/.test(k) ? k : "'" + k + "'";
        return key + ': ' + A.repr(v.$d[k]);
      }).join(', ') + '}';
      case 'ndarray': return 'array(' + A.npStr(v.$np, ', ') + ')';
      case 'function': return '<function ' + v.$fn + '>';
      case 'module': return "<module '" + v.$mod + "'>";
    }
    return String(v);
  };

  /* str() — como o print mostra */
  A.str = function (v) {
    var t = A.type(v);
    if (t === 'str') return v;
    if (t === 'ndarray') return A.npStr(v.$np, ' ', true);
    return A.repr(v);
  };

  /* formatação estilo numpy: [ 2  6 12 20] */
  A.npStr = function (arr, sep, pad, width) {
    if (Array.isArray(arr[0])) {
      if (pad && width === undefined) {
        width = 0;
        arr.forEach(function (r) { r.forEach(function (x) { width = Math.max(width, String(x).length); }); });
      }
      return '[' + arr.map(function (r) { return A.npStr(r, sep, pad, width); }).join(sep === ' ' ? '\n ' : ',\n       ') + ']';
    }
    var strs = arr.map(function (x) { return typeof x === 'number' ? String(x) : A.repr(x); });
    if (pad) {
      var w = width || Math.max.apply(null, strs.map(function (s) { return s.length; }));
      strs = strs.map(function (s) { return (' '.repeat(w) + s).slice(-w); });
    }
    return '[' + strs.join(sep) + ']';
  };

  /* print(a, b, c) */
  A.print = function () {
    return Array.prototype.map.call(arguments, A.str).join(' ');
  };

  /* ---------- DOM ---------- */
  A.esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };
  A.$ = function (sel, root) { return (root || document).querySelector(sel); };
  A.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  A.el = function (tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  };
  /* reinicia uma animação CSS adicionando a classe de novo */
  A.retrigger = function (el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  };

  /* remove classes de animação "one-shot" quando terminam,
     para não reiniciarem sozinhas quando outra classe mudar */
  A.autoClean = function (el) {
    el.addEventListener('animationend', function (e) {
      if (e.target !== el) return;
      el.classList.remove('new', 'flash');
    });
    return el;
  };

  /* moldura padrão dos widgets interativos */
  A.widgetBox = function (host, title, tag) {
    var w = A.el('div', 'widget');
    w.innerHTML = '<div class="widget-head"><span class="tag">' + (tag || 'INTERATIVO') + '</span><b></b></div><div class="widget-body"></div>';
    A.$('b', w).textContent = title;
    host.appendChild(w);
    return A.$('.widget-body', w);
  };

  /* lê um literal numérico python: retorna {v, float} ou null */
  A.parseNum = function (s) {
    s = String(s).trim().replace(/_/g, '');
    if (/^[+-]?\d+$/.test(s)) return { v: parseInt(s, 10), float: false };
    if (/^[+-]?(\d+\.\d*|\.\d+|\d+)([eE][+-]?\d+)?$/.test(s)) return { v: parseFloat(s), float: true };
    return null;
  };

  /* ---------- armazenamento seguro ---------- */
  A.store = {
    get: function (k, def) {
      try { var v = localStorage.getItem('alg:' + k); return v === null ? def : JSON.parse(v); }
      catch (e) { return def; }
    },
    set: function (k, v) {
      try { localStorage.setItem('alg:' + k, JSON.stringify(v)); } catch (e) { /* sem storage */ }
    }
  };

  A.toast = function (msg) {
    var t = A.$('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(A._toastT);
    A._toastT = setTimeout(function () { t.classList.remove('show'); }, 2200);
  };

  /* gerador pseudoaleatório determinístico (simulações reprodutíveis) */
  A.rng = function (seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
})(window.ALG);
