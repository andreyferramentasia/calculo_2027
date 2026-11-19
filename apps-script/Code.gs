/**
 * API dos desafios — Google Apps Script (Web App).
 * Veja apps-script/LEIAME.md para publicar.
 *
 * Segredos ficam SÓ aqui no Google (nunca no site / F12):
 *   - Propriedade do script SENHA_PROFESSOR  (senha da página secreta)
 *   - Questoes.gs                             (matérias, seções, perguntas + respostas)
 *
 * Dados (JSON nas Propriedades do script):
 *   liberados                              {"calculo": ["fundamentos", ...], ...}
 *   r|<materia>|<secao>|<ano>|<nome-chave> {nome, ano, materia, secao, acertos, total, pontos, ...}
 * Sessões em andamento ficam no Cache (até 6 h); o aluno que fecha o
 * navegador recomeça do zero.
 *
 * Fila: toda escrita compartilhada usa LockService (um por vez).
 * Se a fila demorar, devolve status 503 e o site tenta de novo sozinho.
 */
const PROPS = PropertiesService.getScriptProperties();
const CACHE = CacheService.getScriptCache();
const TOLERANCIA_S = 4;      // atraso de rede aceito no cronômetro
const SESSAO_S = 21600;      // 6 h (máximo do CacheService)
const PARTICULAS = ['da', 'de', 'do', 'das', 'dos', 'e'];

/* Matérias que aparecem no painel (mesmos ids de js/hub.js).
   As perguntas de cada uma ficam em Questoes.gs. */
const MATERIAS = [
  { id: 'calculo', titulo: 'Cálculo Diferencial e Integral I' },
  { id: 'discreta', titulo: 'Matemática Discreta' },
  { id: 'probabilidade', titulo: 'Probabilidade e Estatística' },
  { id: 'requisitos', titulo: 'Engenharia de Requisitos' },
  { id: 'agro', titulo: 'Computação Aplicada ao Agronegócio e Sustentabilidade' }
];

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
    admin_apagar: admin_(adminApagar),
    admin_limpar: admin_(adminLimpar)
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

function liberados(d) {
  const materia = String(d.materia || '');
  return {
    liberados: liberadosDe_(materia).map(function (id) {
      const s = secao_(materia, id);
      return { id: id, titulo: s.titulo, total: s.perguntas.length };
    })
  };
}

function iniciar(d) {
  const materia = String(d.materia || '');
  const secao = String(d.secao || '');
  if (!secao_(materia, secao) || liberadosDe_(materia).indexOf(secao) < 0) falha_(403, 'Este desafio não está liberado.');
  const token = tokenValido_(d.token);
  const ja = lerSessao_(token);
  if (ja) return publico_(ja);                       // repetição do pedido

  const nome = nomeValido_(d.nome);
  if (!nome) falha_(400, 'Digite nome e sobrenome (só letras).');
  const ano = anoValido_(d.ano);
  if (!ano) falha_(400, 'Escolha o ano de ingresso.');
  const chave = chaveNome_(nome);
  const rk = recKey_(materia, secao, ano, chave);
  const nk = 'n:' + rk;

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) falha_(503, 'Servidor ocupado.');
  try {
    if (PROPS.getProperty(rk)) falha_(409, 'Esse nome já fez este desafio. Fale com o professor.');
    // sessão antiga do mesmo aluno (fechou o navegador): descarta e recomeça do zero
    const dono = CACHE.get(nk);
    if (dono && dono !== token) {
      const antiga = lerSessao_(dono);
      if (antiga && antiga.fim) {
        if (!antiga.salvo) PROPS.setProperty(rk, registro_(dono, antiga));   // terminou mas fechou antes de salvar
        falha_(409, 'Esse nome já fez este desafio. Fale com o professor.');
      }
      CACHE.remove('s:' + dono);
    }
    CACHE.put(nk, token, SESSAO_S);
    const s = {
      materia: materia, secao: secao, ano: ano, nome: nome, chave: chave,
      ordem: embaralha_(secao_(materia, secao).perguntas.length),
      atual: 0, servido: null, perm: null, acertos: 0, pontos: 0, saidas: 0,
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
  const q = secao_(s.materia, s.secao);
  const total = s.ordem.length;
  saidas_(s, d.saidas);
  if (s.atual < total && s.servido) {                // pergunta abandonada: conta como errada
    const p0 = q.perguntas[s.ordem[s.atual]];
    if ((Date.now() - s.servido) / 1000 > (p0.tempo || 20) + TOLERANCIA_S) registra_(s, p0, null, Date.now() - s.servido);
  }
  if (s.atual >= total) {
    gravarSessao_(token, s);
    return Object.assign({ fim: true }, publico_(s));
  }
  const p = q.perguntas[s.ordem[s.atual]];
  const lim = p.tempo || 20;
  if (!s.servido) { s.servido = Date.now(); s.perm = permServir_(p); }
  if (!s.perm && permServir_(p)) s.perm = permServir_(p);
  gravarSessao_(token, s);
  return Object.assign({
    i: s.atual, total: total, nome: s.nome, titulo: q.titulo,
    q: p.q, code: p.code || null,
    tempo: lim, restante: Math.max(0, lim - (Date.now() - s.servido) / 1000),
    acertos: s.acertos, pontos: s.pontos
  }, publicaPergunta_(p, s.perm));
}

function responder(d) {
  const token = tokenValido_(d.token);
  const s = sessao_(token);
  const i = Number(d.i);
  if (s.ultimo && s.ultimo.i === i && s.atual === i + 1) return resposta_(s);   // repetição: mesma resposta
  if (i !== s.atual || !s.servido || s.atual >= s.ordem.length) falha_(409, 'Pergunta já respondida.');
  saidas_(s, d.saidas);
  const p = secao_(s.materia, s.secao).perguntas[s.ordem[s.atual]];
  // "resposta" (formatos novos); "escolha" é do site antigo (só múltipla escolha)
  const resp = d.resposta !== undefined ? d.resposta : (Number.isInteger(d.escolha) && d.escolha >= 0 ? d.escolha : null);
  registra_(s, p, resp, Date.now() - s.servido);
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
      const k = recKey_(s.materia, s.secao, s.ano, s.chave);
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
  const lib = liberadosMapa_();
  return {
    materias: MATERIAS.map(function (mat) {
      const m = mat.id;
      const secs = secoesDe_(m);
      return {
        id: m,
        titulo: mat.titulo,
        secoes: Object.keys(secs).map(function (id) {
          return { id: id, titulo: secs[id].titulo, total: secs[id].perguntas.length, liberado: (lib[m] || []).indexOf(id) >= 0 };
        })
      };
    })
  };
}

function adminLiberar(d) {
  const materia = String(d.materia || '');
  const secao = String(d.secao || '');
  if (!secao_(materia, secao)) falha_(404, 'Seção inexistente.');
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) falha_(503, 'Servidor ocupado.');
  try {
    const lib = liberadosMapa_();
    const lista = (lib[materia] || []).filter(function (x) { return x !== secao; });
    if (d.liberado) lista.push(secao);
    lib[materia] = lista;
    PROPS.setProperty('liberados', JSON.stringify(lib));
  } finally {
    lock.releaseLock();
  }
  return adminEstado();
}

function adminResultados() {
  const linhas = registros_().map(function (x) { return x.r; });
  return Object.assign({ linhas: linhas }, adminEstado());
}

/* apaga um aluno: { materia, ano, nome, secao: id | 'todas' } */
function adminApagar(d) {
  const materia = String(d.materia || '');
  const ano = String(d.ano || '');
  const chave = chaveNome_(String(d.nome || ''));
  const secao = String(d.secao || '');
  const secoes = secao === 'todas' ? Object.keys(secoesDe_(materia)) : [secao];
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) falha_(503, 'Servidor ocupado.');
  try {
    secoes.forEach(function (sec) {
      const k = recKey_(materia, sec, ano, chave);
      PROPS.deleteProperty(k);
      PROPS.deleteProperty('r|' + sec + '|' + chave);   // formato antigo
      CACHE.remove('n:' + k);
    });
  } finally {
    lock.releaseLock();
  }
  return { ok: true };
}

/* apaga todos os resultados que batem com o filtro do painel
   { materia (obrigatório), secao: 'geral' | id, ano: 'todos' | 2026 } */
function adminLimpar(d) {
  const materia = String(d.materia || '');
  if (!MATERIAS.some(function (m) { return m.id === materia; })) falha_(404, 'Matéria inexistente.');
  const secao = String(d.secao || 'geral');
  const ano = String(d.ano || 'todos');
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(25000)) falha_(503, 'Servidor ocupado.');
  let n = 0;
  try {
    registros_().forEach(function (x) {
      const r = x.r;
      if (r.materia !== materia) return;
      if (secao !== 'geral' && r.secao !== secao) return;
      if (ano !== 'todos' && String(r.ano) !== ano) return;
      PROPS.deleteProperty(x.k);
      CACHE.remove('n:' + x.k);
      n++;
    });
  } finally {
    lock.releaseLock();
  }
  return { apagados: n };
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

/* seções (com perguntas) de uma matéria. Aceita os dois formatos de Questoes.gs:
   novo:   QUESTOES = { calculo: { secoes: { fundamentos: {...} } } }
   antigo: QUESTOES = { fundamentos: {...} }   (vale como Cálculo) */
function secoesDe_(materia) {
  const Q = typeof QUESTOES === 'object' && QUESTOES ? QUESTOES : {};
  const antigo = Object.keys(Q).some(function (k) { return Q[k] && Q[k].perguntas; });
  if (antigo) return materia === 'calculo' ? Q : {};
  return (Q[materia] && Q[materia].secoes) || {};
}

function secao_(materia, secao) {
  const secs = secoesDe_(materia);
  return Object.prototype.hasOwnProperty.call(secs, secao) && secs[secao].perguntas ? secs[secao] : null;
}

function liberadosMapa_() {
  try {
    const v = JSON.parse(PROPS.getProperty('liberados') || '{}');
    return Array.isArray(v) ? { calculo: v } : v;      // formato antigo (só cálculo)
  } catch (e) {
    return {};
  }
}

function liberadosDe_(materia) {
  return (liberadosMapa_()[materia] || []).filter(function (id) { return secao_(materia, id); });
}

/* todos os resultados salvos: [{k, r}] (aceita chaves do formato antigo r|secao|nome) */
function registros_() {
  const todos = PROPS.getProperties();
  const out = [];
  Object.keys(todos).forEach(function (k) {
    if (k.indexOf('r|') !== 0) return;
    const p = k.split('|');
    const r = JSON.parse(todos[k]);
    delete r.sessao;
    if (p.length === 3) { r.materia = r.materia || 'calculo'; r.ano = r.ano || ''; }
    r.chave = p[p.length - 1];
    out.push({ k: k, r: r });
  });
  return out;
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
    nome: s.nome, ano: s.ano, titulo: secao_(s.materia, s.secao).titulo, total: s.ordem.length,
    atual: s.atual, acertos: s.acertos, pontos: s.pontos, fim: !!s.fim, salvo: !!s.salvo
  };
}

function registro_(token, s) {
  return JSON.stringify({
    nome: s.nome, ano: s.ano, materia: s.materia, secao: s.secao,
    acertos: s.acertos, total: s.ordem.length, pontos: s.pontos,
    saidas: s.saidas, inicio: s.inicio, fim: s.fim, sessao: sha_(token).slice(0, 16)
  });
}

function resposta_(s) {
  return Object.assign({}, s.ultimo, { acertos: s.acertos, pontos: s.pontos, fim: !!s.fim });
}

/* corrige a resposta conforme o formato e soma os pontos.
   Acerto total: 500 a 1000 pts (mais rápido = mais).
   Ordenar/associar/tabela com pelo menos metade certa: metade dos pontos, proporcional. */
function registra_(s, p, resp, msReal) {
  const lim = p.tempo || 20;
  const noTempo = msReal <= (lim + TOLERANCIA_S) * 1000;
  const c = corrige_(p, s.perm, noTempo ? resp : null);
  const certo = c.fracao === 1;
  const ms = Math.min(msReal, lim * 1000);
  const base = Math.round(1000 * (1 - ms / (lim * 1000) / 2));   // 500 a 1000
  const multi = ['ordenar', 'associar', 'tabela'].indexOf(tipo_(p)) >= 0;
  const pts = certo ? base : (multi && c.fracao >= 0.5 ? Math.round(base * c.fracao / 2) : 0);   // parcial só a partir da metade
  s.atual++;
  s.servido = null;
  s.perm = null;
  if (certo) s.acertos++;
  s.pontos += pts;
  if (s.atual >= s.ordem.length) s.fim = Date.now();
  s.ultimo = {
    i: s.atual - 1, certo: certo, fracao: c.fracao, correta: c.correta, ganhou: pts,
    tempo_esgotado: !noTempo, explica: p.explica || null
  };
}

/* ======================= formatos de pergunta =======================
   escolha  { opcoes: [4 textos], certa: 0-3 }                 (padrão)
   vf       { certa: true | false }
   numero   { aceita: ['5040', ...], mostrar?, dica? }          resposta digitada
   ordenar  { itens: [na ordem CERTA] }                         o servidor embaralha
   associar { pares: [[esquerda, direita], ...] }               o servidor embaralha a direita
   tabela   { cab: ['A','B','A → B'], linhas: [['V','V'],...], certa: [true, false, ...] }
   Todos aceitam: q, code?, tempo, explica? (aparece depois de responder) */
function tipo_(p) {
  return ['vf', 'numero', 'ordenar', 'associar', 'tabela'].indexOf(p.tipo) >= 0 ? p.tipo : 'escolha';
}

function permServir_(p) {
  const t = tipo_(p);
  if (t === 'ordenar') {
    const n = p.itens.length;
    let a, k = 0;
    do { a = embaralha_(n); k++; } while (n > 1 && k < 20 && a.every(function (v, i) { return v === i; }));
    return a;
  }
  if (t === 'associar') return embaralha_(p.pares.length);
  return null;
}

/* o que o aluno recebe (nunca a resposta) */
function publicaPergunta_(p, perm) {
  const t = tipo_(p);
  const o = { tipo: t };
  if (t === 'escolha') o.opcoes = p.opcoes;
  if (t === 'numero') o.dica = p.dica || null;
  if (t === 'ordenar') o.itens = perm.map(function (i) { return p.itens[i]; });
  if (t === 'associar') {
    o.esq = p.pares.map(function (x) { return x[0]; });
    o.dir = perm.map(function (i) { return p.pares[i][1]; });
  }
  if (t === 'tabela') { o.cab = p.cab; o.linhas = p.linhas; }
  return o;
}

function normResp_(v) {
  return String(v).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/\s+/g, '');
}

function listaInt_(v, n) {
  return Array.isArray(v) && v.length === n && v.every(function (x) { return Number.isInteger(x) && x >= -1 && x < n; });
}

/* devolve { fracao: 0..1, correta: gabarito no formato que o site mostra } */
function corrige_(p, perm, v) {
  const t = tipo_(p);
  if (!perm && (t === 'ordenar' || t === 'associar')) perm = (p.itens || p.pares).map(function (_, i) { return i; });
  if (t === 'escolha') return { fracao: v === p.certa ? 1 : 0, correta: p.certa };
  if (t === 'vf') {
    const c = p.certa ? 0 : 1;
    return { fracao: v === c ? 1 : 0, correta: c };
  }
  if (t === 'numero') {
    const ok = [].concat(p.aceita);
    const certo = typeof v === 'string' && v.length <= 40 && ok.some(function (a) { return normResp_(a) === normResp_(v); });
    return { fracao: certo ? 1 : 0, correta: p.mostrar || String(ok[0]) };
  }
  if (t === 'ordenar') {
    const n = p.itens.length;
    const correta = [];
    for (let k = 0; k < n; k++) correta.push(perm.indexOf(k));
    let f = 0;
    if (listaInt_(v, n) && new Set(v).size === n && v.indexOf(-1) < 0) {
      f = v.filter(function (j, pos) { return perm[j] === pos; }).length / n;
    }
    return { fracao: f, correta: correta };
  }
  if (t === 'associar') {
    const n = p.pares.length;
    const correta = [];
    for (let i = 0; i < n; i++) correta.push(perm.indexOf(i));
    const f = listaInt_(v, n) ? v.filter(function (j, i) { return j >= 0 && perm[j] === i; }).length / n : 0;
    return { fracao: f, correta: correta };
  }
  // tabela
  const n = p.certa.length;
  const f = Array.isArray(v) && v.length === n ? v.filter(function (x, i) { return x === p.certa[i]; }).length / n : 0;
  return { fracao: f, correta: p.certa };
}

function saidas_(s, v) {
  const n = parseInt(v, 10);
  if (n > s.saidas && n < 1000) s.saidas = n;
}

function anoValido_(v) {
  const a = parseInt(v, 10);
  const max = new Date().getFullYear() + 1;
  return a >= 2000 && a <= max ? a : null;
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
  return String(nome).normalize('NFD').replace(/\p{M}/gu, '')
    .toLowerCase().replace(/[^a-z' -]/g, '').replace(/\s+/g, ' ').trim();
}

function recKey_(materia, secao, ano, chave) { return 'r|' + materia + '|' + secao + '|' + ano + '|' + chave; }

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
