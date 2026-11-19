# API dos desafios (Google Apps Script)

O site fica no GitHub Pages (só arquivos). Quem guarda **notas, senha e respostas**
é este script, rodando na sua conta Google — nada disso aparece no site nem no F12.

## Publicar (uma vez, ~5 min)
1. Abra <https://script.google.com> → **Novo projeto**.
2. Apague o conteúdo do `Código.gs` e cole o `Code.gs` desta pasta.
3. **+ (Adicionar arquivo) → Script** chamado `Questoes` e cole o `Questoes.gs`.
4. ⚙ **Configurações do projeto → Propriedades do script → Adicionar**
   - Propriedade: `SENHA_PROFESSOR`  ·  Valor: *sua senha do painel*
5. **Implantar → Nova implantação → ⚙ Tipo: App da Web**
   - Executar como: **Eu** · Quem pode acessar: **Qualquer pessoa**
   - Autorize quando o Google pedir.
6. Copie a **URL do app da Web** (termina em `/exec`) e cole em
   `calculo/js/desafio/config.js` → `DESAFIO_API`. Faça commit/push.

## Atualizar perguntas ou código
Edite no editor do Apps Script → **Implantar → Gerenciar implantações → ✏ →
Versão: Nova versão → Implantar**. A URL continua a mesma.

## Usar
- Painel: `https://<seu-usuario>.github.io/calculo_2027/andrey-segredo/`
- Libere uma seção → ela aparece no menu dos alunos (em até 1 min, ou ao recarregar).

## Matérias e perguntas
`Questoes.gs` → `QUESTOES[<matéria>].secoes[<seção>]`. O id da matéria é o mesmo de
`js/hub.js` e de `MATERIA` em `<matéria>/js/desafio/config.js`.

### Formatos de pergunta
Além da múltipla escolha, cada pergunta pode ter `tipo`: `vf` (verdadeiro/falso),
`numero` (digitar a resposta), `ordenar` (pôr passos em ordem), `associar` (ligar
colunas) e `tabela` (completar tabela-verdade). O campo `explica` aparece para o aluno
depois que ele responde. Formato completo no topo de `Questoes.gs`.
Ordenar, associar e tabela dão metade dos pontos (proporcional) quando o aluno acerta pelo menos metade.

## Onde ficam os dados
Propriedades do script (JSON): `liberados` (por matéria) e uma chave
`r|<matéria>|<seção>|<ano>|<nome>` por resultado.
Limite do Google: ~500 KB no total (≈ 3.000 resultados). Exporte o CSV/JSON pelo painel.

⚠ `Questoes.gs` **não vai para o git** (tem as respostas). Guarde uma cópia.
