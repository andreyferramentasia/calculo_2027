# Organização do projeto

```
index.html, css/, js/, img/     página inicial: escolha da matéria
nucleo/                         motor compartilhado por todas as matérias
  css/                          estilos (base, layout, componentes, labs, desafio, conteúdo)
  js/core/                      namespace, labs animados, quiz, exercícios, modal…
  js/desafio/                   desafio de fim de seção (API, formatos de pergunta, telas)
  js/api-config.js              endereço da API do Google (um só para todas)
  js/app.js, js/playground.js   roteador das páginas e Python no navegador
  partials/                     telas em HTML (modal, desafio)
materias/
  calculo-1/                    Cálculo Diferencial e Integral I      (id: calculo)
  matematica-discreta/          Matemática Discreta                   (id: discreta)
  probabilidade-estatistica/    Probabilidade e Estatística · CEAD    (id: probabilidade)
    index.html                  a página da matéria
    js/config.js                id da matéria e textos da página inicial
    js/lessons/                 uma aula por arquivo + 00-modulos.js + 99-exercicios.js
    js/widgets/                 interativos desta matéria
    css/, img/                  estilos e imagens desta matéria
andrey-segredo/                 painel do professor
apps-script/                    API no Google (Code.gs) e perguntas (Questoes.gs, fora do git)
```

Nova matéria: copie uma pasta de `materias/`, troque o id em `js/config.js`,
apague as aulas e coloque o link em `js/hub.js`.
