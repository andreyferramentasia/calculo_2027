/* =========================================================
   PAINEL DO PROFESSOR — liberar desafios, ranking e CSV
   A senha é enviada ao Apps Script, que confere lá; aqui só
   fica um token temporário em sessionStorage (some ao fechar).
   ========================================================= */
(function (A) {
  var TOP = 10;
  var tok = null, dados = null, mostrarTudo = false, timer = null;
  try { tok = sessionStorage.getItem('painel:tok'); } catch (e) { /* sem storage */ }

  var login = A.$('#login'), painel = A.$('#painel');
  var filtro = A.$('#filtro'), thead = A.$('#thead'), tbody = A.$('#tbody'), info = A.$('#info'), mais = A.$('#mais');

  function api(acao, d) {
    return A.desafioApi(acao, Object.assign({ token: tok }, d || {})).catch(function (e) {
      if (e.status === 401) sair();
      throw e;
    });
  }

  function sair() {
    tok = null;
    try { sessionStorage.removeItem('painel:tok'); } catch (e) { /* */ }
    clearInterval(timer);
    painel.hidden = true;
    login.hidden = false;
  }

  login.onsubmit = function (e) {
    e.preventDefault();
    var erro = A.$('.d-erro', login), btn = A.$('button', login);
    erro.textContent = '';
    btn.disabled = true;
    A.desafioApi('login', { senha: login.senha.value })
      .then(function (d) {
        tok = d.token;
        try { sessionStorage.setItem('painel:tok', tok); } catch (e) { /* */ }
        abrir();
      })
      .catch(function (err) { erro.textContent = err.message; })
      .then(function () { login.senha.value = ''; btn.disabled = false; });
  };
  A.$('#sair').onclick = sair;

  function abrir() {
    login.hidden = true;
    painel.hidden = false;
    carregar();
    clearInterval(timer);
    timer = setInterval(carregar, 20000);
  }

  function carregar() {
    return api('admin_resultados').then(function (d) {
      dados = d;
      renderSecoes();
      renderFiltro();
      renderRanking();
    }).catch(function (e) { if (e.status !== 401) A.toast(e.message); });
  }
  A.$('#atualizar').onclick = function () { carregar().then(function () { A.toast('Atualizado'); }); };

  /* ---------- seções: liberar / bloquear ---------- */
  function renderSecoes() {
    var box = A.$('#secoes');
    box.innerHTML = '';
    dados.secoes.forEach(function (s) {
      var n = dados.linhas.filter(function (r) { return r.secao === s.id; }).length;
      var c = A.el('div', 'prof-secao' + (s.liberado ? ' on' : ''));
      c.innerHTML = '<div><b></b><span class="muted">' + n + ' participante' + (n === 1 ? '' : 's') + ' · ' + s.total + ' perguntas</span></div>' +
        '<button class="btn sm" type="button"></button>';
      A.$('b', c).textContent = s.titulo;
      var b = A.$('button', c);
      b.textContent = s.liberado ? '🔓 Liberado · bloquear' : '🔒 Bloqueado · liberar';
      b.onclick = function () {
        b.disabled = true;
        api('admin_liberar', { secao: s.id, liberado: !s.liberado }).then(function () {
          A.toast(s.liberado ? 'Desafio bloqueado' : 'Desafio liberado: já aparece no menu dos alunos');
          return carregar();
        }).catch(function (e) { A.toast(e.message); b.disabled = false; });
      };
      box.appendChild(c);
    });
  }

  /* ---------- ranking ---------- */
  function renderFiltro() {
    var atual = filtro.value || 'geral';
    filtro.innerHTML = '<option value="geral">Geral (soma das seções)</option>';
    dados.secoes.forEach(function (s) {
      var o = A.el('option'); o.value = s.id; o.textContent = s.titulo; filtro.appendChild(o);
    });
    filtro.value = atual;
  }
  filtro.onchange = function () { mostrarTudo = false; renderRanking(); };
  mais.onclick = function () { mostrarTudo = !mostrarTudo; renderRanking(); };

  function titulo(id) {
    var s = dados.secoes.filter(function (x) { return x.id === id; })[0];
    return s ? s.titulo : id;
  }

  /* linhas da visão atual, já ordenadas */
  function linhas() {
    if (filtro.value === 'geral') {
      var por = {};
      dados.linhas.forEach(function (r) {
        var g = por[r.chave] || (por[r.chave] = { nome: r.nome, pontos: 0, acertos: 0, total: 0, saidas: 0, secoes: [] });
        g.pontos += r.pontos; g.acertos += r.acertos; g.total += r.total; g.saidas += r.saidas;
        g.secoes.push(titulo(r.secao));
      });
      return Object.keys(por).map(function (k) { por[k].secoes.sort(); return por[k]; })
        .sort(function (a, b) { return b.pontos - a.pontos || b.acertos - a.acertos || a.nome.localeCompare(b.nome); });
    }
    return dados.linhas.filter(function (r) { return r.secao === filtro.value; })
      .sort(function (a, b) { return b.pontos - a.pontos || b.acertos - a.acertos || a.fim - b.fim; });
  }

  function hora(t) { return t ? new Date(t).toLocaleString('pt-BR') : ''; }

  function renderRanking() {
    var geral = filtro.value === 'geral';
    var L = linhas();
    var vis = mostrarTudo ? L : L.slice(0, TOP);
    thead.innerHTML = geral
      ? '<tr><th>#</th><th>Nome</th><th>Pontos</th><th>Acertos</th><th>Seções</th><th>Saiu da tela</th></tr>'
      : '<tr><th>#</th><th>Nome</th><th>Pontos</th><th>Acertos</th><th>Terminou</th><th>Saiu da tela</th><th></th></tr>';
    tbody.innerHTML = '';
    if (!L.length) tbody.innerHTML = '<tr><td colspan="7" class="prof-vazio">Ninguém terminou ainda.</td></tr>';
    vis.forEach(function (r, i) {
      var tr = A.el('tr', i < 3 ? 'podio p' + (i + 1) : '');
      var medalha = ['🥇', '🥈', '🥉'][i] || (i + 1);
      tr.innerHTML = '<td class="n">' + medalha + '</td><td class="nome"></td><td class="n">' + r.pontos + '</td><td class="n">' + r.acertos + '/' + r.total + '</td>' +
        (geral ? '<td class="secs"></td>' : '<td>' + hora(r.fim) + '</td>') +
        '<td class="n' + (r.saidas ? ' warn' : '') + '">' + r.saidas + '</td>' +
        (geral ? '' : '<td><button class="btn sm ghost" type="button">Apagar</button></td>');
      A.$('.nome', tr).textContent = r.nome;
      if (geral) A.$('.secs', tr).textContent = r.secoes.length + ' · ' + r.secoes.join(', ');
      else A.$('button', tr).onclick = function () { apagar(r); };
      tbody.appendChild(tr);
    });
    mais.hidden = L.length <= TOP;
    mais.textContent = mostrarTudo ? 'Mostrar só os ' + TOP + ' primeiros' : 'Mostrar mais (' + (L.length - TOP) + ')';
    var n = dados.linhas.length;
    info.textContent = n + ' resultado' + (n === 1 ? '' : 's') + ' salvos · atualiza a cada 20 s';
  }

  function apagar(r) {
    A.confirm({
      icon: '🗑', danger: true, title: 'Apagar ' + r.nome + '?',
      msg: 'Remove o resultado em <b>' + A.esc(titulo(r.secao)) + '</b>. O aluno poderá fazer este desafio de novo.',
      ok: 'Apagar', cancel: 'Cancelar'
    }).then(function (sim) {
      if (!sim) return;
      api('admin_apagar', { secao: r.secao, nome: r.nome }).then(function () { A.toast('Apagado'); carregar(); })
        .catch(function (e) { A.toast(e.message); });
    });
  }

  /* ---------- exportar ---------- */
  function baixar(nome, conteudo, tipo) {
    var a = A.el('a');
    a.href = URL.createObjectURL(new Blob([conteudo], { type: tipo }));
    a.download = nome;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  function cel(v) {
    v = String(v == null ? '' : v);
    if (/^[=+\-@]/.test(v)) v = "'" + v;                       // evita fórmula no Excel
    return /[";\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  }
  A.$('#csv').onclick = function () {
    if (!dados) return;
    var geral = filtro.value === 'geral';
    var rows = [geral ? ['posicao', 'nome', 'pontos', 'acertos', 'total', 'secoes', 'saiu_da_tela']
                      : ['posicao', 'nome', 'pontos', 'acertos', 'total', 'inicio', 'fim', 'saiu_da_tela']];
    linhas().forEach(function (r, i) {
      rows.push(geral ? [i + 1, r.nome, r.pontos, r.acertos, r.total, r.secoes.join(' | '), r.saidas]
                      : [i + 1, r.nome, r.pontos, r.acertos, r.total, hora(r.inicio), hora(r.fim), r.saidas]);
    });
    var csv = '﻿' + rows.map(function (l) { return l.map(cel).join(';'); }).join('\r\n');
    baixar('ranking_' + filtro.value + '.csv', csv, 'text/csv;charset=utf-8');
  };
  A.$('#json').onclick = function () {
    if (dados) baixar('resultados.json', JSON.stringify(dados.linhas, null, 2), 'application/json');
  };

  document.documentElement.setAttribute('data-theme', A.store.get('tema', 'light'));
  if (tok) abrir();
})(window.ALG);
