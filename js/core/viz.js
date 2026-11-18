/* =========================================================
   VISUALIZAÇÕES do LAB
   Cada função: A.viz.nome(elemento, dados, ctx)
   Os elementos são persistentes entre passos para que as
   transições CSS (ponteiros deslizando, barras trocando de
   lugar, células piscando) aconteçam de verdade.
   ========================================================= */
(function (A) {
  function idxIn(list, i) { return !!list && list.indexOf(i) >= 0; }
  function pairIn(list, i, j) {
    if (!list) return false;
    for (var k = 0; k < list.length; k++) if (list[k][0] === i && list[k][1] === j) return true;
    return false;
  }
  function show(v) { return typeof v === 'string' ? v : A.repr(v); }

  /* ---------------------------------------------------------
     ARRAY — vetor com índices e ponteiros deslizantes
     { arr, ptr:{i:2}, hl:[], ok:[], bad:[], dim:[], label, idx:[...] }
     --------------------------------------------------------- */
  var GAP = 6;
  A.viz.array = function (el, d) {
    if (!d) { el.innerHTML = ''; el._st = null; return; }
    var st = el._st;
    if (!st) {
      el.innerHTML = '';
      var root = A.el('div', 'va');
      root.innerHTML = '<div class="va-row"></div><div class="va-label"></div>';
      el.appendChild(root);
      st = el._st = { root: root, row: A.$('.va-row', root), lab: A.$('.va-label', root), cells: [], ptrs: {}, init: false };
    }
    var n = d.arr.length;
    var narrow = window.innerWidth < 860;
    var cw = n > 12 ? 30 : n > 9 ? 36 : (narrow ? 40 : 48);
    st.root.style.setProperty('--cw', cw + 'px');

    while (st.cells.length < n) {
      var c = A.el('div', 'va-cell');
      c.innerHTML = '<div class="cv"></div><div class="ci"></div>';
      A.autoClean(c);
      if (st.init) c.classList.add('new');
      st.row.appendChild(c);
      st.cells.push(c);
    }
    while (st.cells.length > n) st.cells.pop().remove();

    st.cells.forEach(function (c, i) {
      var cv = c.firstChild;
      var txt = show(d.arr[i]);
      if (cv.textContent !== txt) {
        if (st.init && cv.textContent !== '' && !c.classList.contains('new')) A.retrigger(c, 'flash');
        cv.textContent = txt;
      }
      c.lastChild.textContent = d.idx ? d.idx[i] : i;
      c.classList.toggle('hl', idxIn(d.hl, i));
      c.classList.toggle('ok', idxIn(d.ok, i));
      c.classList.toggle('bad', idxIn(d.bad, i));
      c.classList.toggle('dim', idxIn(d.dim, i));
    });
    st.init = true;
    st.lab.textContent = d.label || '';

    // ponteiros
    var ptr = d.ptr || {};
    Object.keys(st.ptrs).forEach(function (k) {
      if (!(k in ptr)) { st.ptrs[k].remove(); delete st.ptrs[k]; }
    });
    var rankAt = {}, ranks = {}, maxRank = 0;
    Object.keys(ptr).forEach(function (k, order) {
      if (!st.ptrs[k]) {
        var p = A.el('div', 'va-ptr p' + (order % 4));
        var lbl = A.el('span');
        lbl.textContent = k;
        p.appendChild(lbl);
        st.root.appendChild(p);
        st.ptrs[k] = p;
      }
      var pos = ptr[k];
      if (pos === null || pos === undefined) return;
      var r = rankAt[pos] || 0;
      rankAt[pos] = r + 1;
      ranks[k] = r;
      maxRank = Math.max(maxRank, r);
    });
    st.root.style.paddingTop = (42 + maxRank * 24) + 'px';
    Object.keys(ptr).forEach(function (k) {
      var p = st.ptrs[k], pos = ptr[k];
      if (pos === null || pos === undefined) { p.style.opacity = 0; return; }
      p.style.opacity = 1;
      p.style.transform = 'translate(' + (pos * (cw + GAP)) + 'px,' + ((maxRank - ranks[k]) * 24) + 'px)';
    });
  };

  /* ---------------------------------------------------------
     BARS — barras que trocam de lugar (ordenação, histograma)
     { arr, ids, cmp:[], swap:[], ok:[], labels:[], max }
     --------------------------------------------------------- */
  A.viz.bars = function (el, d) {
    if (!d) { el.innerHTML = ''; el._st = null; return; }
    var st = el._st;
    if (!st) {
      el.innerHTML = '';
      var root = A.el('div', 'vb');
      el.appendChild(root);
      st = el._st = { root: root, bars: {} };
    }
    var n = d.arr.length;
    var max = d.max || Math.max.apply(null, d.arr.concat([1]));
    var ids = d.ids || d.arr.map(function (_, i) { return i; });
    var seen = {};
    ids.forEach(function (id, pos) {
      seen[id] = 1;
      var b = st.bars[id];
      if (!b) {
        b = A.el('div', 'vb-bar');
        b.innerHTML = '<span class="bv"></span><div class="bf"></div><span class="bl"></span>';
        A.autoClean(b);
        st.root.appendChild(b);
        st.bars[id] = b;
      }
      var v = d.arr[pos];
      b.style.left = 'calc(' + pos + ' * 100% / ' + n + ' + 3px)';
      b.style.width = 'calc(100% / ' + n + ' - 6px)';
      b.style.height = Math.max(2, v / max * 82) + '%';
      var bv = b.firstChild;
      if (bv.textContent !== String(v)) {
        if (bv.textContent !== '') A.retrigger(b, 'flash');
        bv.textContent = v;
      }
      b.lastChild.textContent = d.labels ? d.labels[pos] : pos;
      b.classList.toggle('cmp', idxIn(d.cmp, pos));
      b.classList.toggle('swap', idxIn(d.swap, pos));
      b.classList.toggle('ok', idxIn(d.ok, pos));
    });
    Object.keys(st.bars).forEach(function (id) {
      if (!seen[id]) { st.bars[id].remove(); delete st.bars[id]; }
    });
  };

  /* ---------------------------------------------------------
     MATRIX — uma ou mais matrizes lado a lado
     { mats:[{ name, m, hl:[[i,j]], ok:[[i,j]], row, col }], ops:['+','='] }
     --------------------------------------------------------- */
  A.viz.matrix = function (el, d) {
    if (!d) { el.innerHTML = ''; el._st = null; return; }
    var mats = d.mats || [d];
    var key = mats.map(function (M) { return (M.name || '') + M.m.length + 'x' + (M.m[0] || []).length; }).join('|');
    var st = el._st;
    if (!st || st.key !== key) {
      el.innerHTML = '';
      var root = A.el('div', 'vm');
      st = el._st = { key: key, grids: [] };
      mats.forEach(function (M, mi) {
        if (mi > 0 && d.ops && d.ops[mi - 1]) root.appendChild(A.el('div', 'vm-op', A.esc(d.ops[mi - 1])));
        var wrap = A.el('div', 'vm-mat');
        var rows = M.m.length, cols = (M.m[0] || []).length;
        var grid = A.el('div', 'vm-grid');
        grid.style.gridTemplateColumns = '16px repeat(' + cols + ', 42px)';
        grid.appendChild(A.el('div', 'vm-idx', ''));
        for (var j = 0; j < cols; j++) grid.appendChild(A.el('div', 'vm-idx', j));
        var cells = [];
        for (var i = 0; i < rows; i++) {
          grid.appendChild(A.el('div', 'vm-idx', i));
          cells.push([]);
          for (j = 0; j < cols; j++) {
            var c = A.el('div', 'vm-cell');
            A.autoClean(c);
            grid.appendChild(c);
            cells[i].push(c);
          }
        }
        wrap.appendChild(A.el('div', 'vm-name', A.esc(M.name || '')));
        wrap.appendChild(grid);
        root.appendChild(wrap);
        st.grids.push({ cells: cells, first: true });
      });
      el.appendChild(root);
    }
    mats.forEach(function (M, mi) {
      var g = st.grids[mi];
      M.m.forEach(function (row, i) {
        row.forEach(function (v, j) {
          var c = g.cells[i][j];
          var txt = v === null || v === undefined ? '·' : show(v);
          if (c.textContent !== txt) {
            if (!g.first) A.retrigger(c, 'flash');
            c.textContent = txt;
          }
          c.classList.toggle('empty', v === null || v === undefined);
          c.classList.toggle('hl', pairIn(M.hl, i, j));
          c.classList.toggle('ok', pairIn(M.ok, i, j));
          c.classList.toggle('row', M.row === i);
          c.classList.toggle('col', M.col === j);
          c.classList.toggle('dim', !!M.dimOthers && !pairIn(M.hl, i, j) && M.row !== i && M.col !== j);
        });
      });
      g.first = false;
    });
  };

  /* ---------------------------------------------------------
     RING — o "circuito" de um loop: condição → corpo → atualização
     { stage:'init'|'cond'|'body'|'upd'|'out', it, val, labels:{cond,body,upd}, stations:[...] }
     --------------------------------------------------------- */
  var CX = 100, CY = 95, R = 66;
  A.viz.ring = function (el, d) {
    if (!d) d = { stage: 'init' };
    var stations = d.stations || ['cond', 'body', 'upd'];
    var N = stations.length;
    var step = 360 / N;
    var st = el._st;
    var key = stations.join(',');
    if (!st || st.key !== key) {
      el.innerHTML = '';
      var root = A.el('div', 'vr');
      var svg = '<svg viewBox="0 0 200 190" aria-hidden="true">' +
        '<circle class="track" cx="' + CX + '" cy="' + CY + '" r="' + R + '"/>' +
        '<circle class="track-glow" cx="' + CX + '" cy="' + CY + '" r="' + R + '"/>';
      var names = { cond: 'cond?', body: 'corpo', upd: 'atualiza' };
      stations.forEach(function (s, i) {
        var a = (-90 + step * i) * Math.PI / 180;
        var x = CX + R * Math.cos(a), y = CY + R * Math.sin(a);
        svg += '<g class="st st-' + s + '"><circle cx="' + x + '" cy="' + y + '" r="25"/>' +
          '<text x="' + x + '" y="' + (y + 3.5) + '">' + names[s] + '</text></g>';
      });
      svg += '<text class="center-l" x="' + CX + '" y="' + (CY - 14) + '">VOLTA</text>' +
        '<text class="center-n" x="' + CX + '" y="' + (CY + 16) + '">–</text>' +
        '<g class="dotg"><circle class="dot" cx="' + (CX + R - 33) + '" cy="' + CY + '" r="7"/></g></svg>';
      root.innerHTML = svg + '<div><div class="legend"></div><div class="exit" style="margin-top:10px">sai do loop ➜</div></div>';
      el.appendChild(root);
      st = el._st = { key: key, root: root };
    }
    var root2 = st.root;
    var it = d.it || 1;
    var idx = stations.indexOf(d.stage);
    A.$$('.st', root2).forEach(function (g) {
      var name = g.getAttribute('class').match(/st-(\w+)/)[1];
      var on = name === d.stage;
      g.classList.toggle('on', on);
      g.classList.toggle('t', on && name === 'cond' && d.val === true);
      g.classList.toggle('f', on && name === 'cond' && d.val === false);
    });
    var dotg = A.$('.dotg', root2);
    var dot = A.$('.dot', root2);
    if (idx >= 0) {
      var ang = -90 + step * (N * (it - 1) + idx);
      dotg.style.transform = 'rotate(' + ang + 'deg)';
      dot.style.opacity = 1;
    } else {
      dot.style.opacity = d.stage === 'out' ? 0 : .25;
      if (d.stage === 'init') dotg.style.transform = 'rotate(-90deg)';
    }
    A.$('.center-n', root2).textContent = d.stage === 'init' ? '–' : (d.stage === 'out' ? '✓' : it);
    var L = d.labels || {};
    var leg = '';
    if (L.cond) leg += 'condição: <b>' + A.esc(L.cond) + '</b><br>';
    if (L.body) leg += 'corpo: <b>' + A.esc(L.body) + '</b><br>';
    if (L.upd) leg += 'atualização: <b>' + A.esc(L.upd) + '</b>';
    A.$('.legend', root2).innerHTML = leg;
    A.$('.exit', root2).classList.toggle('on', d.stage === 'out');
  };

  /* ---------------------------------------------------------
     TRAIL — histórico de valores (chips)
     { label, items:[...] }
     --------------------------------------------------------- */
  A.viz.trail = function (el, d) {
    if (!d) d = { items: [] };
    var st = el._st;
    if (!st) {
      el.innerHTML = '';
      var root = A.el('div', 'vt');
      root.innerHTML = '<span class="vt-label"></span>';
      el.appendChild(root);
      st = el._st = { root: root, chips: [] };
    }
    A.$('.vt-label', st.root).textContent = d.label || 'histórico:';
    while (st.chips.length < d.items.length) {
      var c = A.el('span', 'vt-chip');
      st.root.appendChild(c);
      st.chips.push(c);
    }
    while (st.chips.length > d.items.length) st.chips.pop().remove();
    st.chips.forEach(function (c, i) {
      c.textContent = show(d.items[i]);
      c.classList.toggle('cur', i === d.items.length - 1);
    });
  };

  /* ---------------------------------------------------------
     BRANCH — if / elif / else
     { rows:[{ k:'if', e:'nota >= 7', b:'print(...)', val:true|false|null, run:bool }] }
     --------------------------------------------------------- */
  A.viz.branch = function (el, d) {
    if (!d) { el.innerHTML = ''; return; }
    var decided = false;
    el.innerHTML = '<div class="vbr">' + d.rows.map(function (r) {
      var cls = 'vbr-row';
      if (r.val === true) cls += ' t';
      if (r.val === false) cls += ' f';
      if (r.run) cls += ' run';
      if (decided && r.val === null) cls += ' skip';
      if (r.val === true) decided = true;
      var res = r.val === true ? (r.k === 'else' ? 'entra' : 'True') : r.val === false ? 'False' : '';
      return '<div class="' + cls + '"><span class="kw">' + r.k + '</span><span>' + A.esc(r.e || '(senão)') +
        ' <span class="muted">→ ' + A.esc(r.b) + '</span></span><span class="res">' + res + '</span></div>';
    }).join('') + '</div>';
  };

  /* ---------------------------------------------------------
     STACK — pilha de chamadas de função
     { frames:[{ name, vars:{}, ret }] }
     --------------------------------------------------------- */
  A.viz.stack = function (el, d, ctx) {
    if (!d) { el.innerHTML = ''; return; }
    var prevN = ctx.prev && ctx.prev.frames ? ctx.prev.frames.length : 0;
    var html = '<div class="vs">';
    d.frames.forEach(function (f, i) {
      var cls = 'vs-frame';
      if (i === d.frames.length - 1) cls += ' top';
      if (i >= prevN) cls += ' new';
      var vars = Object.keys(f.vars || {}).map(function (k) { return k + '=' + A.repr(f.vars[k]); }).join('  ');
      html += '<div class="' + cls + '">' +
        (f.ret !== undefined ? '<span class="ret">return ' + A.esc(A.repr(f.ret)) + '</span>' : '') +
        '<b>' + A.esc(f.name) + '</b><br><span class="fv">' + A.esc(vars || '—') + '</span></div>';
    });
    el.innerHTML = html + '</div>';
  };

  /* ---------------------------------------------------------
     VEC — vetores numpy (operações elemento a elemento)
     { rows:[{ name, arr, fresh }] }
     --------------------------------------------------------- */
  A.viz.vec = function (el, d) {
    if (!d) { el.innerHTML = ''; return; }
    el.innerHTML = '<div class="vv">' + d.rows.map(function (r) {
      return '<div class="vv-row' + (r.fresh ? ' fresh' : '') + '"><span class="vv-name">' + A.esc(r.name) + '</span><div class="vv-cells">' +
        r.arr.map(function (v, i) {
          return '<div class="vv-cell" style="animation-delay:' + (i * 70) + 'ms">' + A.esc(show(v)) + '</div>';
        }).join('') + '</div></div>';
    }).join('') + '</div>';
  };

  /* ---------------------------------------------------------
     PLOT — gráfico de função (usa ex.plot para a função)
     { pts:[[x,y]], cur:[x,y], line:[[x1,y1],[x2,y2]], rects:[[x0,w,h]] }
     --------------------------------------------------------- */
  A.viz.plot = function (el, d, ctx) {
    var st = el._st;
    if (!st) {
      el.innerHTML = '';
      var wrap = A.el('div', 'vp');
      var cv = A.el('canvas');
      wrap.appendChild(cv);
      el.appendChild(wrap);
      st = el._st = { cv: cv };
    }
    var cfg = typeof ctx.ex.plot === 'function' ? ctx.ex.plot(ctx.params) : ctx.ex.plot;
    A.drawPlot(st.cv, cfg, d || {});
  };

  /* desenho de gráfico compartilhado (lab + widgets) */
  A.cssVar = function (name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#888';
  };
  A.drawPlot = function (canvas, cfg, d) {
    var dpr = window.devicePixelRatio || 1;
    var W = canvas.clientWidth || 400, H = canvas.clientHeight || 230;
    if (canvas.width !== W * dpr || canvas.height !== H * dpr) { canvas.width = W * dpr; canvas.height = H * dpr; }
    var g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    var x0 = cfg.xmin, x1 = cfg.xmax, y0 = cfg.ymin, y1 = cfg.ymax;
    var pad = 26;
    function X(x) { return pad + (x - x0) / (x1 - x0) * (W - pad - 10); }
    function Y(y) { return H - pad - (y - y0) / (y1 - y0) * (H - pad - 10); }
    var cLine = A.cssVar('--line'), cMuted = A.cssVar('--faint'), cAcc = A.cssVar('--acc'), cBlue = A.cssVar('--acc2'),
      cPink = A.cssVar('--pink'), cOk = A.cssVar('--ok'), cVio = A.cssVar('--vio');

    // grade
    g.lineWidth = 1;
    g.font = '10px ' + A.cssVar('--mono');
    g.fillStyle = cMuted;
    var sx = cfg.gx || niceStep(x1 - x0), sy = cfg.gy || niceStep(y1 - y0);
    g.strokeStyle = cLine;
    g.globalAlpha = .5;
    for (var gx = Math.ceil(x0 / sx) * sx; gx <= x1 + 1e-9; gx += sx) {
      g.beginPath(); g.moveTo(X(gx), 10); g.lineTo(X(gx), H - pad); g.stroke();
    }
    for (var gy = Math.ceil(y0 / sy) * sy; gy <= y1 + 1e-9; gy += sy) {
      g.beginPath(); g.moveTo(pad, Y(gy)); g.lineTo(W - 10, Y(gy)); g.stroke();
    }
    g.globalAlpha = 1;
    for (gx = Math.ceil(x0 / sx) * sx; gx <= x1 + 1e-9; gx += sx) g.fillText(+gx.toFixed(4), X(gx) - 6, H - pad + 14);
    for (gy = Math.ceil(y0 / sy) * sy; gy <= y1 + 1e-9; gy += sy) g.fillText(+gy.toFixed(4), 2, Y(gy) + 3);
    // eixos
    g.strokeStyle = cMuted;
    g.lineWidth = 1.4;
    if (y0 <= 0 && y1 >= 0) { g.beginPath(); g.moveTo(pad, Y(0)); g.lineTo(W - 10, Y(0)); g.stroke(); }
    if (x0 <= 0 && x1 >= 0) { g.beginPath(); g.moveTo(X(0), 10); g.lineTo(X(0), H - pad); g.stroke(); }

    g.save();
    g.beginPath();
    g.rect(pad, 10, W - pad - 10, H - pad - 10);
    g.clip();

    // retângulos (Riemann)
    if (d.rects) {
      d.rects.forEach(function (r) {
        var top = Y(Math.max(0, r[2])), bot = Y(Math.min(0, r[2]));
        g.fillStyle = cVio; g.globalAlpha = .28;
        g.fillRect(X(r[0]), top, X(r[0] + r[1]) - X(r[0]), bot - top);
        g.globalAlpha = .9; g.strokeStyle = cVio; g.lineWidth = 1;
        g.strokeRect(X(r[0]), top, X(r[0] + r[1]) - X(r[0]), bot - top);
      });
      g.globalAlpha = 1;
    }
    // função
    if (cfg.f) {
      g.strokeStyle = cBlue; g.lineWidth = 2.5; g.beginPath();
      var started = false;
      for (var px = 0; px <= W; px += 1.5) {
        var x = x0 + (px - pad) / (W - pad - 10) * (x1 - x0);
        var y = cfg.f(x);
        if (!isFinite(y) || Math.abs(y) > 1e6) { started = false; continue; }
        if (!started) { g.moveTo(X(x), Y(y)); started = true; } else g.lineTo(X(x), Y(y));
      }
      g.stroke();
    }
    // reta (secante / tangente)
    if (d.line) {
      var a = d.line[0], b = d.line[1];
      var m = (b[1] - a[1]) / (b[0] - a[0]);
      g.strokeStyle = d.lineColor === 'ok' ? cOk : cPink; g.lineWidth = 2; g.setLineDash([6, 4]);
      g.beginPath(); g.moveTo(X(x0), Y(a[1] + m * (x0 - a[0]))); g.lineTo(X(x1), Y(a[1] + m * (x1 - a[0]))); g.stroke();
      g.setLineDash([]);
    }
    // pontos
    if (d.pts) {
      d.pts.forEach(function (p, i) {
        g.fillStyle = cAcc; g.globalAlpha = .35 + .65 * (i + 1) / d.pts.length;
        g.beginPath(); g.arc(X(p[0]), Y(p[1]), 4, 0, 7); g.fill();
      });
      g.globalAlpha = 1;
    }
    if (cfg.hole) {
      g.strokeStyle = cBlue; g.fillStyle = A.cssVar('--bg2'); g.lineWidth = 2;
      g.beginPath(); g.arc(X(cfg.hole[0]), Y(cfg.hole[1]), 5, 0, 7); g.fill(); g.stroke();
    }
    if (d.cur) {
      g.fillStyle = cPink;
      g.beginPath(); g.arc(X(d.cur[0]), Y(d.cur[1]), 6, 0, 7); g.fill();
      g.strokeStyle = cPink; g.globalAlpha = .4; g.setLineDash([3, 3]);
      g.beginPath(); g.moveTo(X(d.cur[0]), Y(d.cur[1])); g.lineTo(X(d.cur[0]), H - pad); g.stroke();
      g.setLineDash([]); g.globalAlpha = 1;
    }
    if (d.marks) {
      d.marks.forEach(function (p) {
        g.fillStyle = cOk;
        g.beginPath(); g.arc(X(p[0]), Y(p[1]), 5, 0, 7); g.fill();
      });
    }
    g.restore();
    return { X: X, Y: Y };
  };

  function niceStep(range) {
    var raw = range / 6;
    var p = Math.pow(10, Math.floor(Math.log10(raw)));
    var n = raw / p;
    return (n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10) * p;
  }
})(window.ALG);
