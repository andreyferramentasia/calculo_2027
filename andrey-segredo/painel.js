/* =========================================================
   PAINEL DO PROFESSOR — por matéria: liberar desafios,
   ranking (filtro por seção e ano de ingresso), CSV e limpeza.
   A senha é enviada ao Apps Script, que confere lá; aqui só
   fica um token temporário em sessionStorage (some ao fechar).
   ========================================================= */
(function (A) {
  var TOP = 10;
  var tok = null, dados = null, mostrarTudo = false, timer = null;
  try { tok = sessionStorage.getItem('painel:tok'); } catch (e) { /* sem storage */ }

  var login = A.$('#login'), painel = A.$('#painel');
  var selMateria = A.$('#materia'), filtro = A.$('#filtro'), selAno = A.$('#ano');
  var thead = A.$('#thead'), tbody = A.$('#tbody'), info = A.$('#info'), mais = A.$('#mais');

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
      var aviso = A.$('#aviso');
      if (!d.materias) {                       // Code.gs antigo publicado no Google
        aviso.hidden = false;
        aviso.innerHTML = '⚠ O script no Google está desatualizado. Cole o <code>Code.gs</code> e o <code>Questoes.gs</code> novos e publique uma <b>Nova versão</b> (Implantar → Gerenciar implantações).';
        return;
      }
      aviso.hidden = true;
      dados = d;
      renderMaterias();
      renderSecoes();
      renderFiltros();
      renderRanking();
    }).catch(function (e) { if (e.status !== 401) A.toast(e.message); });
  }
  A.$('#atualizar').onclick = function () { carregar().then(function () { A.toast('Atualizado'); }); };

  /* ---------- matéria ---------- */
  function materia() {
    return dados.materias.filter(function (m) { return m.id === selMateria.value; })[0] || dados.materias[0];
  }
  function renderMaterias() {
    var atual = selMateria.value || A.store.get('painel:materia', '');
    selMateria.innerHTML = '';
    dados.materias.forEach(function (m) {
      var n = dados.linhas.filter(function (r) { return r.materia === m.id; }).length;
      var o = A.el('option'); o.value = m.id;
      o.textContent = m.titulo + (n ? ' (' + n + ')' : '');
      selMateria.appendChild(o);
    });
    if (atual && dados.materias.some(function (m) { return m.id === atual; })) selMateria.value = atual;
  }
  selMateria.onchange = function () {
    A.store.set('painel:materia', selMateria.value);
    filtro.value = 'geral';
    selAno.value = 'todos';
    mostrarTudo = false;
    renderSecoes(); renderFiltros(); renderRanking();
  };

  /* ---------- seções: liberar / bloquear ---------- */
  function renderSecoes() {
    var box = A.$('#secoes'), m = materia();
    box.innerHTML = '';
    if (!m.secoes.length) {
      box.innerHTML = '<p class="muted prof-vazio-sec">Nenhuma pergunta cadastrada para esta matéria ainda (adicione em <code>Questoes.gs</code>).</p>';
      return;
    }
    m.secoes.forEach(function (s) {
      var n = dados.linhas.filter(function (r) { return r.materia === m.id && r.secao === s.id; }).length;
      var c = A.el('div', 'prof-secao' + (s.liberado ? ' on' : ''));
      c.innerHTML = '<div><b></b><span class="muted">' + n + ' resultado' + (n === 1 ? '' : 's') + ' · ' + s.total + ' perguntas</span></div>' +
        '<button class="btn sm" type="button"></button>';
      A.$('b', c).textContent = s.titulo;
      var b = A.$('button', c);
      b.textContent = s.liberado ? '🔓 Liberado · bloquear' : '🔒 Bloqueado · liberar';
      b.onclick = function () {
        b.disabled = true;
        api('admin_liberar', { materia: m.id, secao: s.id, liberado: !s.liberado }).then(function () {
          A.toast(s.liberado ? 'Desafio bloqueado' : 'Desafio liberado: já aparece no menu dos alunos');
          return carregar();
        }).catch(function (e) { A.toast(e.message); b.disabled = false; });
      };
      box.appendChild(c);
    });
  }

  /* ---------- filtros do ranking ---------- */
  function renderFiltros() {
    var m = materia();
    var sec = filtro.value || 'geral';
    filtro.innerHTML = '<option value="geral">Geral (soma das seções)</option>';
    m.secoes.forEach(function (s) {
      var o = A.el('option'); o.value = s.id; o.textContent = s.titulo; filtro.appendChild(o);
    });
    filtro.value = m.secoes.some(function (s) { return s.id === sec; }) ? sec : 'geral';

    var ano = selAno.value || 'todos';
    var anos = {};
    dados.linhas.forEach(function (r) { if (r.materia === m.id && r.ano) anos[r.ano] = 1; });
    selAno.innerHTML = '<option value="todos">Todos os anos</option>';
    Object.keys(anos).sort().reverse().forEach(function (a) {
      var o = A.el('option'); o.value = a; o.textContent = 'Ingresso ' + a; selAno.appendChild(o);
    });
    selAno.value = anos[ano] ? ano : 'todos';
  }
  filtro.onchange = selAno.onchange = function () { mostrarTudo = false; renderRanking(); };
  mais.onclick = function () { mostrarTudo = !mostrarTudo; renderRanking(); };

  function tituloSecao(id) {
    var s = materia().secoes.filter(function (x) { return x.id === id; })[0];
    return s ? s.titulo : id;
  }

  /* resultados que batem com matéria + seção + ano */
  function filtrados() {
    var m = materia().id, sec = filtro.value, ano = selAno.value;
    return dados.linhas.filter(function (r) {
      return r.materia === m && (sec === 'geral' || r.secao === sec) && (ano === 'todos' || String(r.ano) === ano);
    });
  }

  /* linhas da visão atual, já ordenadas (geral = soma por aluno + ano) */
  function linhas() {
    var F = filtrados();
    if (filtro.value === 'geral') {
      var por = {};
      F.forEach(function (r) {
        var k = r.ano + '|' + r.chave;
        var g = por[k] || (por[k] = { nome: r.nome, ano: r.ano, pontos: 0, acertos: 0, total: 0, saidas: 0, secoes: [] });
        g.pontos += r.pontos; g.acertos += r.acertos; g.total += r.total; g.saidas += r.saidas;
        g.secoes.push(tituloSecao(r.secao));
      });
      return Object.keys(por).map(function (k) { por[k].secoes.sort(); return por[k]; })
        .sort(function (a, b) { return b.pontos - a.pontos || b.acertos - a.acertos || a.nome.localeCompare(b.nome); });
    }
    return F.sort(function (a, b) { return b.pontos - a.pontos || b.acertos - a.acertos || a.fim - b.fim; });
  }

  /* busca por nome (ignora acentos e maiúsculas) */
  var busca = A.$('#busca');
  function normaliza(t) {
    return String(t || '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim();
  }
  busca.addEventListener('input', function () { if (dados) renderRanking(); });

  function hora(t) { return t ? new Date(t).toLocaleString('pt-BR') : ''; }

  function renderRanking() {
    var geral = filtro.value === 'geral';
    var termo = normaliza(busca.value);
    // posição real no ranking é guardada antes de filtrar pela busca
    var L = linhas().map(function (r, i) { r.pos = i; return r; })
      .filter(function (r) { return !termo || normaliza(r.nome).indexOf(termo) >= 0; });
    var vis = mostrarTudo || termo ? L : L.slice(0, TOP);
    thead.innerHTML = geral
      ? '<tr><th>#</th><th>Nome</th><th>Ingresso</th><th>Pontos</th><th>Acertos</th><th>Seções</th><th>Saiu da tela</th><th></th></tr>'
      : '<tr><th>#</th><th>Nome</th><th>Ingresso</th><th>Pontos</th><th>Acertos</th><th>Terminou</th><th>Saiu da tela</th><th></th></tr>';
    tbody.innerHTML = '';
    if (!L.length) tbody.innerHTML = '<tr><td colspan="8" class="prof-vazio">' + (termo ? 'Nenhum aluno com esse nome.' : 'Nenhum resultado com este filtro.') + '</td></tr>';
    vis.forEach(function (r) {
      var i = r.pos;
      var tr = A.el('tr', i < 3 ? 'podio p' + (i + 1) : '');
      var medalha = ['🥇', '🥈', '🥉'][i] || (i + 1);
      tr.innerHTML = '<td class="n">' + medalha + '</td><td class="nome"></td><td class="n">' + A.esc(r.ano || '—') + '</td><td class="n">' + r.pontos + '</td><td class="n">' + r.acertos + '/' + r.total + '</td>' +
        (geral ? '<td class="secs"></td>' : '<td>' + hora(r.fim) + '</td>') +
        '<td class="n' + (r.saidas ? ' warn' : '') + '">' + r.saidas + '</td>' +
        '<td><button class="btn sm ghost" type="button" title="Apagar este aluno">🗑 Apagar</button></td>';
      A.$('.nome', tr).textContent = r.nome;
      if (geral) A.$('.secs', tr).textContent = r.secoes.length + ' · ' + r.secoes.join(', ');
      A.$('button', tr).onclick = function () { apagar(r, geral); };
      tbody.appendChild(tr);
    });
    mais.hidden = !!termo || L.length <= TOP;
    mais.textContent = mostrarTudo ? 'Mostrar só os ' + TOP + ' primeiros' : 'Mostrar mais (' + (L.length - TOP) + ')';
    var n = filtrados().length;
    info.textContent = n + ' resultado' + (n === 1 ? '' : 's') + ' neste filtro · atualiza a cada 20 s';
    var lb = A.$('#limpar');
    lb.disabled = !n;
    lb.textContent = '🗑 Limpar ' + (selAno.value === 'todos' ? 'todos os anos' : 'ingresso ' + selAno.value) +
      (filtro.value === 'geral' ? '' : ' · só esta seção') + ' (' + n + ')';
  }

  /* geral = apaga o aluno em todas as seções desta matéria (mesmo ano) */
  function apagar(r, geral) {
    var onde = geral
      ? 'todos os resultados dele em <b>' + A.esc(materia().titulo) + '</b> (' + A.esc(r.secoes.join(', ')) + ')'
      : 'o resultado em <b>' + A.esc(tituloSecao(r.secao)) + '</b>';
    A.confirm({
      icon: '🗑', danger: true, title: 'Apagar ' + r.nome + (r.ano ? ' (' + r.ano + ')' : '') + '?',
      msg: 'Remove ' + onde + '. O aluno poderá fazer de novo.',
      ok: 'Apagar', cancel: 'Cancelar'
    }).then(function (sim) {
      if (!sim) return;
      api('admin_apagar', { materia: materia().id, secao: geral ? 'todas' : r.secao, ano: r.ano, nome: r.nome })
        .then(function () { A.toast('Apagado'); carregar(); })
        .catch(function (e) { A.toast(e.message); });
    });
  }

  /* ---------- limpar tudo do filtro atual ---------- */
  A.$('#limpar').onclick = function () {
    var n = filtrados().length;
    if (!n) return;
    var m = materia();
    var alvo = '<b>' + A.esc(m.titulo) + '</b> · ' +
      (filtro.value === 'geral' ? 'todas as seções' : '<b>' + A.esc(tituloSecao(filtro.value)) + '</b>') + ' · ' +
      (selAno.value === 'todos' ? 'todos os anos' : 'ingresso <b>' + A.esc(selAno.value) + '</b>');
    A.confirm({
      icon: '🗑', danger: true,
      title: 'Zerar ' + n + ' resultado' + (n === 1 ? '' : 's') + '?',
      msg: alvo + '<br><br>Isso <b>não pode ser desfeito</b>. Baixe o CSV antes, se precisar.',
      ok: 'Sim, apagar tudo', cancel: 'Cancelar'
    }).then(function (sim) {
      if (!sim) return;
      api('admin_limpar', { materia: m.id, secao: filtro.value, ano: selAno.value })
        .then(function (d) { A.toast(d.apagados + ' resultado(s) apagados'); mostrarTudo = false; carregar(); })
        .catch(function (e) { A.toast(e.message); });
    });
  };

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
  function nomeArquivo(ext) {
    return ['ranking', materia().id, filtro.value, selAno.value === 'todos' ? 'todos-anos' : selAno.value].join('_') + '.' + ext;
  }
  A.$('#csv').onclick = function () {
    if (!dados) return;
    var geral = filtro.value === 'geral';
    var rows = [geral ? ['posicao', 'nome', 'ano_ingresso', 'pontos', 'acertos', 'total', 'secoes', 'saiu_da_tela']
                      : ['posicao', 'nome', 'ano_ingresso', 'pontos', 'acertos', 'total', 'inicio', 'fim', 'saiu_da_tela']];
    linhas().forEach(function (r, i) {
      rows.push(geral ? [i + 1, r.nome, r.ano, r.pontos, r.acertos, r.total, r.secoes.join(' | '), r.saidas]
                      : [i + 1, r.nome, r.ano, r.pontos, r.acertos, r.total, hora(r.inicio), hora(r.fim), r.saidas]);
    });
    var csv = '﻿' + rows.map(function (l) { return l.map(cel).join(';'); }).join('\r\n');
    baixar(nomeArquivo('csv'), csv, 'text/csv;charset=utf-8');
  };
  A.$('#json').onclick = function () {
    if (dados) baixar(nomeArquivo('json'), JSON.stringify(filtrados(), null, 2), 'application/json');
  };

  document.documentElement.setAttribute('data-theme', A.store.get('tema', 'light'));
  if (tok) abrir();
})(window.ALG);
