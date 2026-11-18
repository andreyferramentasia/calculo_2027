/* =========================================================
   WIDGET: detector de tipos  —  type(x) ao vivo
   ========================================================= */
(function (A) {
  function parseLiteral(src) {
    var s = src.trim();
    if (!s) return { err: 'Digite um valor…' };
    var n = A.parseNum(s);
    if (n) return { v: n.float ? A.F(n.v) : n.v };
    var m = /^(['"])(.*)\1$/.exec(s);
    if (m) return { v: m[2] };
    if (s === 'True') return { v: true };
    if (s === 'False') return { v: false };
    if (s === 'None') return { v: null };
    if (s === 'true' || s === 'false') return { err: "NameError: name '" + s + "' is not defined", hint: 'Em Python os booleanos começam com maiúscula: <code>True</code> e <code>False</code>.' };
    if (/^\[.*\]$/.test(s)) {
      var inner = s.slice(1, -1).trim();
      if (!inner) return { v: [] };
      var parts = splitTop(inner).map(parseLiteral);
      for (var i = 0; i < parts.length; i++) if (parts[i].err) return parts[i];
      return { v: parts.map(function (p) { return p.v; }) };
    }
    if (/^\(.*\)$/.test(s)) {
      var inn = s.slice(1, -1).trim();
      var ps = splitTop(inn).map(parseLiteral);
      for (var k = 0; k < ps.length; k++) if (ps[k].err) return ps[k];
      if (ps.length === 1 && !/,\s*$/.test(inn)) return ps[0];
      return { v: A.T(ps.map(function (p) { return p.v; })) };
    }
    if (/^\d+,\d+$/.test(s)) return { err: 'Vírgula vira tupla!', hint: 'Em Python o separador decimal é o <b>ponto</b>: escreva <code>' + s.replace(',', '.') + '</code>.' };
    if (/^[A-Za-zÀ-ú_]\w*$/.test(s)) return { err: "NameError: name '" + s + "' is not defined", hint: 'Texto sem aspas é tratado como <b>nome de variável</b>. Para string, use aspas: <code>"' + A.esc(s) + '"</code>.' };
    return { err: 'SyntaxError', hint: 'Tente um número (42, 3.14), um texto entre aspas, True/False, None ou uma lista [1, 2].' };
  }

  function splitTop(s) {
    var out = [], depth = 0, cur = '', q = null;
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      if (q) { cur += ch; if (ch === q) q = null; continue; }
      if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
      if (ch === '[' || ch === '(') depth++;
      if (ch === ']' || ch === ')') depth--;
      if (ch === ',' && depth === 0) { out.push(cur); cur = ''; continue; }
      cur += ch;
    }
    if (cur.trim()) out.push(cur);
    return out;
  }

  function num(v) { return v && typeof v === 'object' && '$f' in v ? v.$f : v; }

  function conversions(v) {
    var t = A.type(v), x = num(v), res = {};
    // int()
    if (t === 'int') res.int = A.repr(x);
    else if (t === 'float') res.int = String(Math.trunc(x));
    else if (t === 'bool') res.int = x ? '1' : '0';
    else if (t === 'str' && /^\s*[+-]?\d+\s*$/.test(x)) res.int = String(parseInt(x, 10));
    else res.int = '<span style="color:var(--bad)">' + (t === 'str' ? 'ValueError' : 'TypeError') + '</span>';
    // float()
    if (t === 'int' || t === 'float') res.float = A.fmtFloat(x);
    else if (t === 'bool') res.float = x ? '1.0' : '0.0';
    else if (t === 'str' && A.parseNum(x)) res.float = A.fmtFloat(A.parseNum(x).v);
    else res.float = '<span style="color:var(--bad)">' + (t === 'str' ? 'ValueError' : 'TypeError') + '</span>';
    // str()
    res.str = A.esc(A.repr(A.str(v)));
    // bool()
    var falsy = v === null || x === 0 || x === '' || x === false || (Array.isArray(v) && !v.length) || (t === 'tuple' && !v.$t.length);
    res.bool = falsy ? 'False' : 'True';
    return res;
  }

  var INFO = {
    int: 'Número <b>inteiro</b>, sem parte decimal. Pode ser tão grande quanto a memória deixar.',
    float: 'Número de <b>ponto flutuante</b> (real). Usa ponto como separador decimal.',
    str: '<b>Texto</b> (string). Sempre entre aspas simples ou duplas.',
    bool: 'Valor <b>lógico</b>: só existem <code>True</code> e <code>False</code>.',
    NoneType: '<b>None</b> representa "nenhum valor" / ausência de valor.',
    list: '<b>Lista</b>: sequência mutável de valores, entre colchetes.',
    tuple: '<b>Tupla</b>: sequência imutável, entre parênteses.'
  };

  A.widgets.types = function (host) {
    var body = A.widgetBox(host, 'Descubra o tipo: digite qualquer valor');
    body.innerHTML =
      '<div class="widget-row">' +
      '  <label class="field" style="flex:1;min-width:200px">x = <input type="text" value="3.14" spellcheck="false"></label>' +
      '</div>' +
      '<div class="widget-row ex-btns" style="gap:6px"></div>' +
      '<div class="tw-out" style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:18px;align-items:start"></div>';
    var inp = A.$('input', body);
    var exBox = A.$('.ex-btns', body);
    ['42', '3.14', '"Olá"', '"42"', 'True', 'None', '[1, 2, 3]', '7,5', 'nome'].forEach(function (e) {
      var b = A.el('button', 'btn sm', A.esc(e));
      b.onclick = function () { inp.value = e; upd(); };
      exBox.appendChild(b);
    });
    var out = A.$('.tw-out', body);
    function upd() {
      var r = parseLiteral(inp.value);
      if (r.err) {
        out.innerHTML = '<div class="mbox new" style="--tc:var(--bad)"><span class="mname">x</span><span class="mval">erro</span></div>' +
          '<div><div class="result-line" style="color:var(--bad)">' + A.esc(r.err) + '</div><p class="muted" style="font-size:.9rem">' + (r.hint || '') + '</p></div>';
        return;
      }
      var t = A.type(r.v), c = conversions(r.v);
      out.innerHTML =
        '<div><div class="mbox new t-' + t + '" style="font-size:1.2em;padding:10px 16px"><span class="mtype">' + t + '</span><span class="mname">x</span><span class="mval" style="font-size:1.3rem">' + A.esc(A.repr(r.v)) + '</span></div>' +
        '<p class="muted" style="font-size:.88rem;margin-top:10px">' + (INFO[t] || '') + '</p></div>' +
        '<div>' +
        '<div class="result-line"><span class="lbl">type(x) →</span> <b>&lt;class \'' + t + '\'&gt;</b></div>' +
        '<div class="result-line"><span class="lbl">int(x) →</span> ' + c.int + '</div>' +
        '<div class="result-line"><span class="lbl">float(x) →</span> ' + c.float + '</div>' +
        '<div class="result-line"><span class="lbl">str(x) →</span> ' + c.str + '</div>' +
        '<div class="result-line"><span class="lbl">bool(x) →</span> ' + c.bool + '</div>' +
        '</div>';
    }
    inp.addEventListener('input', upd);
    upd();
  };
})(window.ALG);
