/**
 * API dos desafios — Google Apps Script (Web App).
 * Veja apps-script/LEIAME.md para publicar.
 *
 * Segredos ficam SÓ aqui no Google (nunca no site / F12):
 *   - Propriedade do script SENHA_PROFESSOR  (senha da página secreta)
 *   - Questoes.gs                             (perguntas + respostas)
 *
 * Dados (JSON nas Propriedades do script):
 *   liberados               ["fundamentos", ...]
 *   r|<secao>|<nome-chave>  {nome, secao, acertos, total, pontos, ...}
 * Sessões em andamento ficam no Cache (até 6 h).
 *
 * Fila: toda escrita compartilhada usa LockService (um por vez).
 * Se a fila demorar, devolve status 503 e o site tenta de novo sozinho.
 */
const PROPS = PropertiesService.getScriptProperties();
const CACHE = CacheService.getScriptCache();
const TOLERANCIA_S = 4;      // atraso de rede aceito no cronômetro
const SESSAO_S = 21600;      // 6 h (máximo do CacheService)
const PARTICULAS = ['da', 'de', 'do', 'das', 'dos', 'e'];

function doGet() {
  return json_({ ok: true });
}

function doPost(e) {
  let d;
  try {
    d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ erro: 'Pedido inválido.', status: 400 });
  }
  const rotas = {
    liberados: liberados,
    iniciar: iniciar,
    pergunta: pergunta,
    responder: responder,
    salvar: salvar,
    login: login,
    admin_estado: admin_(adminEstado),
    admin_liberar: admin_(adminLiberar),
    admin_resultados: admin_(adminResultados),
    admin_apagar: admin_(adminApagar)
  };
  const fn = rotas[String(d.acao || '')];
  if (!fn) return json_({ erro: 'Ação inexistente.', status: 404 });
  try {
    return json_(fn(d));
  } catch (err) {
    if (err && err.status) return json_({ erro: err.message, status: err.status });
    return json_({ erro: 'Erro no servidor.', status: 500 });
  }
}

/* ======================= aluno ======================= */

function liberados() {
  return {
    liberados: liberadosLista_().map(function (id) {
      return { id: id, titulo: QUESTOES[id].titulo, total: QUESTOES[id].perguntas.length };
    })
  };
}

function iniciar(d) {
  const secao = String(d.secao || '');
  if (!QUESTOES[secao] || liberadosLista_().indexOf(secao) < 0) falha_(403, 'Este desafio não está liberado.');
  const token = tokenValido_(d.token);
  const ja = lerSessao_(token);
  if (ja) return publico_(ja);                       // retomada ou repetição do pedido

  const nome = nomeValido_(d.nome);
  if (!nome) falha_(400, 'Digite nome e sobrenome (só letras).');
  const chave = chaveNome_(nome);

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) falha_(503, 'Servidor ocupado.');
  try {
    if (PROPS.getProperty(recKey_(secao, chave))) falha_(409, 'Esse nome já fez este desafio. Fale com o professor.');
    // sessão antiga do mesmo nome (aluno fechou o navegador): descarta e recomeça do zero
    const dono = CACHE.get(nomeKey_(secao, chave));
    if (dono && dono !== token) {
      const antiga = lerSessao_(dono);
      if (antiga && antiga.fim) {
        if (!antiga.salvo) PROPS.setProperty(recKey_(secao, chave), registro_(dono, antiga));   // terminou mas fechou antes de salvar
        falha_(409, 'Esse nome já fez este desafio. Fale com o professor.');
      }
      CACHE.remove('s:' + dono);
    }
    CACHE.put(nomeKey_(secao, chave), token, SESSAO_S);
    const s = {
      secao: secao, nome: nome, chave: chave, ordem: embaralha_(QUESTOES[secao].perguntas.length),
      atual: 0, servido: null, acertos: 0, pontos: 0, saidas: 0,
      inicio: Date.now(), fim: null, ultimo: null, salvo: false
    };
    gravarSessao_(token, s);
    return publico_(s);
  } finally {
    lock.releaseLock();
  }
}

function pergunta(d) {
  const token = tokenValido_(d.token);
  const s = sessao_(token);
  const q = QUESTOES[s.secao];
  const total = s.ordem.length;
  saidas_(s, d.saidas);
  if (s.atual < total && s.servido) {                // pergunta abandonada: conta como errada
    const p0 = q.perguntas[s.ordem[s.atual]];
    if ((Date.now() - s.servido) / 1000 > (p0.tempo || 20) + TOLERANCIA_S) registra_(s, p0, -1, Date.now() - s.servido);
  }
  if (s.atual >= total) {
    gravarSessao_(token, s);
    return Object.assign({ fim: true }, publico_(s));
  }
  const p = q.perguntas[s.ordem[s.atual]];
  const lim = p.tempo || 20;
  if (!s.servido) s.servido = Date.now();
  gravarSessao_(token, s);
  return {
    i: s.atual, total: total, nome: s.nome, titulo: q.titulo,
    q: p.q, code: p.code || null, opcoes: p.opcoes,
    tempo: lim, restante: Math.max(0, lim - (Date.now() - s.servido) / 1000),
    acertos: s.acertos, pontos: s.pontos
  };
}

function responder(d) {
  const token = tokenValido_(d.token);
  const s = sessao_(token);
  const i = Number(d.i);
  if (s.ultimo && s.ultimo.i === i && s.atual === i + 1) return resposta_(s);   // repetição: mesma resposta
  if (i !== s.atual || !s.servido || s.atual >= s.ordem.length) falha_(409, 'Pergunta já respondida.');
  saidas_(s, d.saidas);
  const p = QUESTOES[s.secao].perguntas[s.ordem[s.atual]];
  const escolha = Number.isInteger(d.escolha) ? d.escolha : -1;
  registra_(s, p, escolha, Date.now() - s.servido);
  gravarSessao_(token, s);
  return resposta_(s);
}

/* grava o resultado final — idempotente (pode ser repetido sem duplicar) */
function salvar(d) {
  const token = tokenValido_(d.token);
  const s = sessao_(token);
  if (!s.fim) falha_(409, 'O desafio ainda não terminou.');
  if (!s.salvo) {
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(25000)) falha_(503, 'Servidor ocupado.');
    try {
      const k = recKey_(s.secao, s.chave);
      const existente = PROPS.getProperty(k);
      if (existente) {
        if (JSON.parse(existente).sessao !== sha_(token).slice(0, 16)) falha_(409, 'Esse nome já fez este desafio.');
      } else {
        PROPS.setProperty(k, registro_(token, s));
      }
    } finally {
      lock.releaseLock();
    }
    s.salvo = true;
    gravarSessao_(token, s);
  }
  return Object.assign({ salvo: true }, publico_(s));
}

/* ======================= professor ======================= */

function login(d) {
  const certa = PROPS.getProperty('SENHA_PROFESSOR');
  if (!certa) falha_(500, 'Configure SENHA_PROFESSOR nas propriedades do script.');
  if (!iguais_(sha_(String(d.senha || '')), sha_(certa))) {
    Utilities.sleep(1500);                           // freia tentativas em massa
    falha_(403, 'Senha incorreta.');
  }
  const tok = Utilities.getUuid() + Utilities.getUuid();
  CACHE.put('adm:' + sha_(tok), '1', SESSAO_S);
  return { token: tok };
}

function admin_(fn) {
  return function (d) {
    if (!d.token || !CACHE.get('adm:' + sha_(String(d.token)))) falha_(401, 'Faça login de novo.');
    return fn(d);
  };
}

function adminEstado() {
  const lib = liberadosLista_();
  return {
    secoes: Object.keys(QUESTOES).map(function (id) {
      return { id: id, titulo: QUESTOES[id].titulo, total: QUESTOES[id].perguntas.length, liberado: lib.indexOf(id) >= 0 };
    })
  };
}

function adminLiberar(d) {
  const secao = String(d.secao || '');
  if (!QUESTOES[secao]) falha_(404, 'Seção inexistente.');
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) falha_(503, 'Servidor ocupado.');
  try {
    const lib = liberadosLista_().filter(function (x) { return x !== secao; });
    if (d.liberado) lib.push(secao);
    PROPS.setProperty('liberados', JSON.stringify(lib));
  } finally {
    lock.releaseLock();
  }
  return adminEstado();
}

function adminResultados() {
  const todos = PROPS.getProperties();
  const linhas = [];
  Object.keys(todos).forEach(function (k) {
    if (k.indexOf('r|') !== 0) return;
    const r = JSON.parse(todos[k]);
    delete r.sessao;
    r.chave = k.split('|')[2];
    linhas.push(r);
  });
  return { linhas: linhas, secoes: adminEstado().secoes };
}

function adminApagar(d) {
  const secao = String(d.secao || '');
  const chave = chaveNome_(String(d.nome || ''));
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) falha_(503, 'Servidor ocupado.');
  try {
    PROPS.deleteProperty(recKey_(secao, chave));
    CACHE.remove(nomeKey_(secao, chave));
  } finally {
    lock.releaseLock();
  }
  return { ok: true };
}

/* ======================= utilitários ======================= */

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function falha_(status, msg) {
  const e = new Error(msg);
  e.status = status;
  throw e;
}

function liberadosLista_() {
  try {
    return JSON.parse(PROPS.getProperty('liberados') || '[]').filter(function (id) { return QUESTOES[id]; });
  } catch (e) {
    return [];
  }
}

function tokenValido_(t) {
  t = String(t || '');
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(t)) falha_(400, 'Sessão inválida.');
  return t;
}

function lerSessao_(token) {
  const v = CACHE.get('s:' + token);
  return v ? JSON.parse(v) : null;
}

function sessao_(token) {
  const s = lerSessao_(token);
  if (!s) falha_(401, 'Sessão expirada.');
  return s;
}

function gravarSessao_(token, s) {
  CACHE.put('s:' + token, JSON.stringify(s), SESSAO_S);
}

function publico_(s) {
  return {
    nome: s.nome, titulo: QUESTOES[s.secao].titulo, total: s.ordem.length,
    atual: s.atual, acertos: s.acertos, pontos: s.pontos, fim: !!s.fim, salvo: !!s.salvo
  };
}

function registro_(token, s) {
  return JSON.stringify({
    nome: s.nome, secao: s.secao, acertos: s.acertos, total: s.ordem.length, pontos: s.pontos,
    saidas: s.saidas, inicio: s.inicio, fim: s.fim, sessao: sha_(token).slice(0, 16)
  });
}

function resposta_(s) {
  return Object.assign({}, s.ultimo, { acertos: s.acertos, pontos: s.pontos, fim: !!s.fim });
}

function registra_(s, p, escolha, msReal) {
  const lim = p.tempo || 20;
  const noTempo = msReal <= (lim + TOLERANCIA_S) * 1000;
  const certo = noTempo && escolha === p.certa;
  const ms = Math.min(msReal, lim * 1000);
  const pts = certo ? Math.round(1000 * (1 - ms / (lim * 1000) / 2)) : 0;   // 500 a 1000
  s.atual++;
  s.servido = null;
  if (certo) { s.acertos++; s.pontos += pts; }
  if (s.atual >= s.ordem.length) s.fim = Date.now();
  s.ultimo = { i: s.atual - 1, certo: certo, correta: p.certa, ganhou: pts, tempo_esgotado: !noTempo };
}

function saidas_(s, v) {
  const n = parseInt(v, 10);
  if (n > s.saidas && n < 1000) s.saidas = n;
}

function nomeValido_(nome) {
  nome = String(nome || '').replace(/\s+/g, ' ').trim();
  const partes = nome.split(' ');
  if (nome.length > 80 || partes.length < 2) return null;
  if (!partes.every(function (p) { return /^[A-Za-zÀ-ÿ'\-]{1,}$/.test(p); })) return null;
  if (partes.filter(function (p) { return p.length >= 2; }).length < 2) return null;
  return partes.map(function (p, i) {
    p = p.toLowerCase();
    return i > 0 && PARTICULAS.indexOf(p) >= 0 ? p : p.charAt(0).toUpperCase() + p.slice(1);
  }).join(' ');
}

function chaveNome_(nome) {
  return String(nome).normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z' -]/g, '').replace(/\s+/g, ' ').trim();
}

function recKey_(secao, chave) { return 'r|' + secao + '|' + chave; }
function nomeKey_(secao, chave) { return 'n:' + secao + ':' + chave; }

function embaralha_(n) {
  const a = [];
  for (let i = 0; i < n; i++) a.push(i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

function sha_(s) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8)
    .map(function (b) { return ((b + 256) % 256).toString(16).padStart(2, '0'); }).join('');
}

function iguais_(a, b) {
  if (a.length !== b.length) return false;
  let x = 0;
  for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return x === 0;
}
