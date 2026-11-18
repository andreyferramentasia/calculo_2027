/* =========================================================
   PARTIALS — carrega pedaços de HTML da pasta partials/
     A.partial('modal').then(function (html) { ... });
   Cada arquivo é baixado uma vez só (cache em memória).
   Obs.: fetch() precisa de servidor (GitHub Pages, Live Server,
   python -m http.server). Abrindo o index.html direto pelo
   arquivo (file://) o navegador bloqueia — quem usa partials
   deve ter um plano B nesse caso.
   ========================================================= */
(function (A) {
  var cache = {};
  A.partial = function (name) {
    if (!cache[name]) {
      cache[name] = fetch((A.PARTIALS_BASE || 'partials/') + name + '.html')
        .then(function (r) {
          if (!r.ok) throw new Error('partial "' + name + '" não encontrado');
          return r.text();
        })
        .catch(function (e) { delete cache[name]; throw e; });
    }
    return cache[name];
  };
})(window.ALG);
