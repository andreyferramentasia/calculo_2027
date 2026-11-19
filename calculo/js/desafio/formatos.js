/* =========================================================
   FORMATOS de pergunta do desafio
   Cada formato monta a área de resposta e, depois que o
   servidor corrige, mostra o gabarito daquela pergunta.

   A.desafioFormatos[tipo] = {
     rotulo: 'texto curto acima da pergunta',
     montar(box, d, enviar) -> { travar(), mostrar(r) }
       box     elemento onde desenhar
       d       pergunta vinda do servidor (sem a resposta certa)
       enviar  função(valor) que envia a resposta
     resposta(r, d) -> texto "resposta: …" no rodapé (opcional)
   }
   Texto vindo do servidor entra sempre como textContent.
   ========================================================= */
(function (A) {
  var F = A.desafioFormatos = {};
  var LETRAS = 'ABCDEFGH';

  function botao(cls, html) {
    var b = A.el('button', cls, html);
    b.type = 'button';
    return b;
  }
  function confirmar(box, enviar, valor, pronto) {
    var b = botao('btn primary d-confirma', 'Confirmar ✔');
    b.onclick = function () { enviar(valor()); };
    if (pronto) {
      b.disabled = !pronto();
      box.addEventListener('d-mudou', function () { b.disabled = !pronto(); });
    }
    box.appendChild(b);
    return b;
  }
  function mudou(box) { box.dispatchEvent(new Event('d-mudou')); }

  /* ---------- múltipla escolha (4 cores) ---------- */
  F.escolha = {
    rotulo: 'ESCOLHA UMA',
    montar: function (box, d, enviar) {
      var bts = d.opcoes.map(function (o, k) {
        var b = botao('d-op d-op' + k, '<span class="d-letra">' + LETRAS[k] + '</span><span class="d-txt"></span>');
        A.$('.d-txt', b).textContent = o;
        b.onclick = function () { enviar(k); };
        box.appendChild(b);
        return b;
      });
      return {
        travar: function (v) { bts.forEach(function (b, j) { b.disabled = true; if (j === v) b.classList.add('escolhida'); }); },
        mostrar: function (r) { bts.forEach(function (b, j) { b.classList.add(j === r.correta ? 'certa' : 'apagada'); }); }
      };
    },
    resposta: function (r) { return 'resposta: ' + LETRAS[r.correta]; }
  };

  /* ---------- verdadeiro ou falso ---------- */
  F.vf = {
    rotulo: 'VERDADEIRO OU FALSO?',
    montar: function (box, d, enviar) {
      var bts = ['Verdadeiro', 'Falso'].map(function (t, k) {
        var b = botao('d-op d-vf d-vf' + k, '<span class="d-letra">' + (k ? '✘' : '✔') + '</span><span class="d-txt">' + t + '</span>');
        b.onclick = function () { enviar(k); };
        box.appendChild(b);
        return b;
      });
      return {
        travar: function (v) { bts.forEach(function (b, j) { b.disabled = true; if (j === v) b.classList.add('escolhida'); }); },
        mostrar: function (r) { bts.forEach(function (b, j) { b.classList.add(j === r.correta ? 'certa' : 'apagada'); }); }
      };
    },
    resposta: function (r) { return 'resposta: ' + (r.correta === 0 ? 'Verdadeiro' : 'Falso'); }
  };

  /* ---------- resposta digitada (número ou palavra curta) ---------- */
  F.numero = {
    rotulo: 'DIGITE A RESPOSTA',
    montar: function (box, d, enviar) {
      var f = A.el('form', 'd-digita');
      f.innerHTML = '<input type="text" inputmode="text" maxlength="40" autocomplete="off" spellcheck="false" aria-label="Sua resposta">';
      var inp = A.$('input', f);
      inp.placeholder = d.dica || 'sua resposta';
      box.appendChild(f);
      var b = confirmar(f, enviar, function () { return inp.value.trim(); }, function () { return !!inp.value.trim(); });
      b.type = 'submit';
      b.onclick = null;
      inp.addEventListener('input', function () { mudou(f); });
      f.onsubmit = function (e) { e.preventDefault(); if (inp.value.trim()) enviar(inp.value.trim()); };
      setTimeout(function () { inp.focus(); }, 50);
      return {
        travar: function () { inp.disabled = true; b.disabled = true; },
        mostrar: function (r) { f.classList.add(r.certo ? 'ok' : 'err'); }
      };
    },
    resposta: function (r) { return 'resposta: ' + r.correta; }
  };

  /* ---------- ordenar passos (↑ ↓) ---------- */
  F.ordenar = {
    rotulo: 'COLOQUE EM ORDEM',
    montar: function (box, d, enviar) {
      var ord = d.itens.map(function (_, j) { return j; });   // índices exibidos, na ordem atual
      var lista = A.el('ol', 'd-ordem');
      box.appendChild(lista);
      var travado = false;
      function desenha(mexeu) {
        lista.innerHTML = '';
        ord.forEach(function (j, pos) {
          var li = A.el('li', 'd-item' + (pos === mexeu ? ' mexeu' : ''));
          li.innerHTML = '<span class="d-pos">' + (pos + 1) + '</span><span class="d-txt"></span><span class="d-setas"></span>';
          A.$('.d-txt', li).textContent = d.itens[j];
          li.dataset.j = j;
          if (!travado) {
            var s = A.$('.d-setas', li);
            var up = botao('d-seta', '↑'), dn = botao('d-seta', '↓');
            up.setAttribute('aria-label', 'subir'); dn.setAttribute('aria-label', 'descer');
            up.disabled = pos === 0; dn.disabled = pos === ord.length - 1;
            up.onclick = function () { troca(pos, pos - 1); };
            dn.onclick = function () { troca(pos, pos + 1); };
            s.appendChild(up); s.appendChild(dn);
          }
          lista.appendChild(li);
        });
      }
      function troca(a, b) { var t = ord[a]; ord[a] = ord[b]; ord[b] = t; desenha(b); }
      desenha(-1);
      var b = confirmar(box, enviar, function () { return ord.slice(); });
      return {
        travar: function () { travado = true; b.disabled = true; desenha(-1); },
        mostrar: function (r) {
          // r.correta = índices exibidos na ordem certa
          A.$$('.d-item', lista).forEach(function (li, pos) {
            li.classList.add(Number(li.dataset.j) === r.correta[pos] ? 'ok' : 'err');
          });
          if (!r.certo) {
            var ol = A.el('ol', 'd-gabarito');
            r.correta.forEach(function (j) { var li = A.el('li'); li.textContent = d.itens[j]; ol.appendChild(li); });
            var t = A.el('p', 'd-gab-tit', 'Ordem certa:');
            box.appendChild(t); box.appendChild(ol);
          }
        }
      };
    }
  };

  /* ---------- associar colunas ---------- */
  F.associar = {
    rotulo: 'ASSOCIE AS COLUNAS',
    montar: function (box, d, enviar) {
      var tab = A.el('div', 'd-assoc');
      var sels = d.esq.map(function (txt) {
        var row = A.el('div', 'd-par');
        row.innerHTML = '<span class="d-esq"></span><select aria-label="par"><option value="-1">escolha…</option></select><span class="d-certo"></span>';
        A.$('.d-esq', row).textContent = txt;
        var sel = A.$('select', row);
        d.dir.forEach(function (t, j) { var o = A.el('option'); o.value = j; o.textContent = t; sel.appendChild(o); });
        sel.addEventListener('change', function () { mudou(box); });
        tab.appendChild(row);
        return sel;
      });
      box.appendChild(tab);
      var b = confirmar(box, enviar, function () { return sels.map(function (s) { return Number(s.value); }); }, function () {
        return sels.every(function (s) { return s.value !== '-1'; });
      });
      return {
        travar: function () { sels.forEach(function (s) { s.disabled = true; }); b.disabled = true; },
        mostrar: function (r) {
          sels.forEach(function (s, i) {
            var row = s.parentNode, ok = Number(s.value) === r.correta[i];
            row.classList.add(ok ? 'ok' : 'err');
            if (!ok) A.$('.d-certo', row).textContent = '→ ' + d.dir[r.correta[i]];
          });
        }
      };
    }
  };

  /* ---------- completar a tabela-verdade ---------- */
  F.tabela = {
    rotulo: 'COMPLETE A TABELA',
    montar: function (box, d, enviar) {
      var val = d.linhas.map(function () { return null; });
      var t = A.el('table', 'tt d-tt');
      var h = '<thead><tr>' + d.cab.map(function () { return '<th></th>'; }).join('') + '</tr></thead><tbody></tbody>';
      t.innerHTML = h;
      A.$$('th', t).forEach(function (th, i) { th.textContent = d.cab[i]; if (i === d.cab.length - 1) th.className = 'res'; });
      var tb = A.$('tbody', t), bts = [];
      d.linhas.forEach(function (l, r) {
        var tr = A.el('tr');
        l.forEach(function (v) { var td = A.el('td', v === 'V' ? 'v' : 'f'); td.textContent = v; tr.appendChild(td); });
        var td = A.el('td', 'res');
        var b = botao('d-vf-cel', '?');
        b.onclick = function () {
          val[r] = val[r] === null ? true : !val[r];
          b.textContent = val[r] ? 'V' : 'F';
          b.className = 'd-vf-cel ' + (val[r] ? 'v' : 'f');
          mudou(box);
        };
        td.appendChild(b); tr.appendChild(td); tb.appendChild(tr);
        bts.push(b);
      });
      var wrap = A.el('div', 'tt-wrap');
      wrap.appendChild(t);
      box.appendChild(wrap);
      var dica = A.el('p', 'muted d-dica', 'Toque em cada <b>?</b> para alternar entre V e F.');
      box.appendChild(dica);
      var b = confirmar(box, enviar, function () { return val.slice(); }, function () { return val.every(function (v) { return v !== null; }); });
      return {
        travar: function () { bts.forEach(function (x) { x.disabled = true; }); b.disabled = true; },
        mostrar: function (r) {
          bts.forEach(function (x, i) {
            var ok = val[i] === r.correta[i];
            x.parentNode.classList.add(ok ? 'ok' : 'err');
            if (!ok) x.textContent = (val[i] === null ? '?' : val[i] ? 'V' : 'F') + ' → ' + (r.correta[i] ? 'V' : 'F');
          });
        }
      };
    }
  };
})(window.ALG);
