/* =========================================================
   WIDGET: fatiamento s[start:stop:step]
   Implementa exatamente a regra do Python (slice.indices)
   ========================================================= */
(function (A) {
  function sliceIdx(L, start, stop, step) {
    var res = [];
    if (step > 0) {
      start = start === null ? 0 : (start < 0 ? Math.max(0, start + L) : Math.min(start, L));
      stop = stop === null ? L : (stop < 0 ? Math.max(0, stop + L) : Math.min(stop, L));
      for (var i = start; i < stop; i += step) res.push(i);
    } else {
      start = start === null ? L - 1 : (start < 0 ? Math.max(-1, start + L) : Math.min(start, L - 1));
      stop = stop === null ? -1 : (stop < 0 ? Math.max(-1, stop + L) : Math.min(stop, L - 1));
      for (i = start; i > stop; i += step) res.push(i);
    }
    return res;
  }
  A.sliceIdx = sliceIdx;

  function val(inp) {
    var s = inp.value.trim();
    if (s === '') return null;
    var n = parseInt(s, 10);
    return isNaN(n) ? null : n;
  }

  A.widgets.slice = function (host, opts) {
    var body = A.widgetBox(host, 'Fatiamento de strings: s[início:fim:passo]');
    body.innerHTML =
      '<div class="widget-row">' +
      '  <label class="field" style="flex:1;min-width:180px">s = <input type="text" value="' + A.esc((opts && opts.text) || 'ALGORITMO') + '" maxlength="16" spellcheck="false"></label>' +
      '  <label class="field">início <input type="number" value="1" style="width:76px" placeholder="vazio"></label>' +
      '  <label class="field">fim <input type="number" value="5" style="width:76px" placeholder="vazio"></label>' +
      '  <label class="field">passo <input type="number" value="" style="width:76px" placeholder="vazio"></label>' +
      '</div>' +
      '<div class="widget-row sl-ex" style="gap:6px"></div>' +
      '<div class="pycall"></div>' +
      '<div class="sl-chars" style="overflow-x:auto;padding:4px 0 10px"></div>' +
      '<div class="result-line sl-res"></div>' +
      '<p class="muted" style="font-size:.85rem;margin:8px 0 0">Campos vazios usam o padrão. Índices negativos contam do fim: <code>-1</code> é o último caractere.</p>';
    var ins = A.$$('input', body);
    var call = A.$('.pycall', body), chars = A.$('.sl-chars', body), res = A.$('.sl-res', body), exs = A.$('.sl-ex', body);
    [['s[0]', 0, null, null, 'idx'], ['s[-1]', -1, null, null, 'idx'], ['s[:3]', '', 3, ''], ['s[3:]', 3, '', ''], ['s[::2]', '', '', 2], ['s[::-1]', '', '', -1], ['s[-4:-1]', -4, -1, '']].forEach(function (e) {
      var b = A.el('button', 'btn sm mono', e[0]);
      b.onclick = function () {
        ins[1].value = e[1]; ins[2].value = e[2] === null ? '' : e[2]; ins[3].value = e[3] === null ? '' : e[3];
        mode = e[4] === 'idx' ? 'idx' : 'slice';
        upd();
      };
      exs.appendChild(b);
    });
    var mode = 'slice';
    ins.forEach(function (i, k) { i.addEventListener('input', function () { if (k > 0) mode = 'slice'; upd(); }); });

    function upd() {
      var s = ins[0].value;
      var L = s.length;
      var a = val(ins[1]), b = val(ins[2]), c = val(ins[3]);
      var picked, text, err = null;
      if (mode === 'idx') {
        var i = a === null ? 0 : a;
        var real = i < 0 ? i + L : i;
        call.innerHTML = A.highlight('s[' + i + ']');
        if (real < 0 || real >= L) { err = 'IndexError: string index out of range'; picked = []; }
        else { picked = [real]; text = s[real]; }
      } else {
        if (c === 0) { err = 'ValueError: slice step cannot be zero'; picked = []; }
        else {
          picked = sliceIdx(L, a, b, c === null ? 1 : c);
          text = picked.map(function (k) { return s[k]; }).join('');
        }
        call.innerHTML = A.highlight('s[' + (a === null ? '' : a) + ':' + (b === null ? '' : b) + (c === null ? '' : ':' + c) + ']');
      }
      var html = '<div style="display:flex;gap:4px;min-width:max-content">';
      for (var k = 0; k < L; k++) {
        var ord = picked.indexOf(k);
        var on = ord >= 0;
        html += '<div style="width:40px;text-align:center;font-family:var(--mono)">' +
          '<div style="font-size:.7rem;font-weight:700;color:var(--t-int)">' + k + '</div>' +
          '<div style="height:42px;display:grid;place-items:center;border-radius:9px;font-weight:800;font-size:1.05rem;border:1.5px solid ' + (on ? 'var(--acc)' : 'var(--line)') + ';background:' + (on ? 'color-mix(in srgb,var(--acc) 25%,var(--panel2))' : 'var(--panel2)') + ';' +
          (on ? 'transform:translateY(-4px);animation:boxIn .35s ' + (ord * 70) + 'ms both cubic-bezier(.2,1.4,.4,1)' : 'opacity:.55') + '">' + A.esc(s[k] === ' ' ? '␣' : s[k]) + '</div>' +
          '<div style="font-size:.7rem;font-weight:700;color:var(--t-fn)">' + (k - L) + '</div>' +
          '<div style="font-size:.68rem;font-weight:800;color:var(--t-other);height:14px">' + (on && picked.length > 1 ? (ord + 1) + 'º' : '') + '</div></div>';
      }
      chars.innerHTML = html + '</div>';
      res.innerHTML = err ? '<span style="color:var(--bad)">' + err + '</span>' :
        '<span class="lbl">resultado →</span> <b style="color:var(--ok)">' + A.esc(A.repr(text)) + '</b>';
    }
    upd();
  };
})(window.ALG);
