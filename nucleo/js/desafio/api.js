/* =========================================================
   Cliente da API dos desafios (usado pelo aluno e pelo painel).
   - POST com text/plain (o Apps Script não aceita preflight CORS)
   - Fila de reenvio: se o servidor estiver ocupado (muitos alunos
     ao mesmo tempo) ou a rede falhar, tenta de novo com espera
     crescente + aleatória, para os pedidos não chegarem juntos.
     Todas as ações são seguras para repetir (idempotentes).
   ========================================================= */
(function (A) {
  var TENTATIVAS = 7;

  function espera(n) {
    var base = Math.min(8000, 700 * Math.pow(2, n));
    return base / 2 + Math.random() * base;          // 350ms..1.4s, 700..2.8s, ...
  }

  /* opts.aoRepetir(n) — avisa a tela que está tentando de novo */
  A.desafioApi = function (acao, dados, opts) {
    opts = opts || {};
    if (!A.DESAFIO_API) {
      var off = new Error('Desafios não configurados.');
      off.offline = true;
      return Promise.reject(off);
    }
    var body = JSON.stringify(Object.assign({ acao: acao }, dados || {}));
    var n = 0, max = opts.tentativas || TENTATIVAS;

    function tenta() {
      return fetch(A.DESAFIO_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: body,
        redirect: 'follow',
        cache: 'no-store'
      })
        .then(function (r) { return r.json(); })    // página de erro do Google = falha temporária
        .then(function (d) {
          if (d && d.erro) {
            var e = new Error(d.erro);
            e.status = d.status || 400;
            throw e;
          }
          return d;
        })
        .catch(function (e) {
          var temporario = !e.status || e.status === 503 || e.status === 500;
          if (!temporario || n >= max - 1) {
            if (!e.status) e.message = 'Sem conexão com o servidor. Verifique a internet.';
            throw e;
          }
          n++;
          if (opts.aoRepetir) opts.aoRepetir(n);
          return new Promise(function (ok) { setTimeout(ok, espera(n)); }).then(tenta);
        });
    }
    return tenta();
  };

  /* id aleatório da sessão do aluno (gerado no navegador, 128 bits) */
  A.novoToken = function () {
    var b = new Uint8Array(18);
    crypto.getRandomValues(b);
    return btoa(String.fromCharCode.apply(null, b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };
})(window.ALG);
