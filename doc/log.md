# Directory Update Log

## 2026-09-23
* **Creation**: Criacao da Variante V3 (`v3_acessibilidade`) com foco 100% em acessibilidade universal e pontuacao maxima WCAG 2.2 Nivel AAA (contraste >= 7:1, marcos semanticos HTML5, skip links, barra assistiva com ajuste de fonte e fonte para dislexia, guia de leitura e regioes aria-live).
* **Update**: Atualizacao do GitHub Pages com inclusao da Variante V3 no mostruario, barra de alternancia tripartite (V1/V2/V3) e deploy publicado no branch `gh-pages`.
* **Update**: Adicao do validador automatizado `validate_wcag.py` (100% de conformidade técnica) e novos testes unitarios em `test_offline_setup.py`.
* **Update**: Criacao do fork publico `Jhefferson15/unb-sigaa-remix` e publicacao isolada das variantes visuais no GitHub Pages atraves do branch `gh-pages` com portal responsivo de demonstracao e alternancia de variantes.
* **Update**: Sanitizacao estrita de 100% dos arquivos HTML contra dicionario de dados sensiveis (nomes reais, matriculas, e-mails, dados de terceiros) e substituicao de avatar por foto neutra de estudante baixada da internet (`img/foto_aluno.jpg`).
* **Update**: Implementacao da suite automatizada de sanitizacao e auditoria (`offline_pages/sanitize_htmls.py`) com novos testes de regressao em `test_offline_setup.py`.
* **Update**: Substituicao da tipografia de pixacao por MostWasted (pixacao/tag urbana de tracos retos e angulados), garantindo legibilidade imediata de codigos de turmas, semestres, datas e matriculas, preservando a autenticidade conceitual de rua e mantendo embutimento 100% offline em Base64.
* **Update**: Incorporacao de fontes de pixacao autentica (PixoReto e MuroSP) para todos os textos nao-titulares e embutimento integral das fontes em Base64 (fonts_embedded.css), garantindo zero requisicoes externas de rede e eliminacao de qualquer fallback para Arial.
* **Update**: Auditoria visual automatizada via subagente especialista em UI/UX (`ui_visual_reviewer`) com inspecao de screenshots em desktop e mobile, eliminando espaco vazio no CSS Grid, garantindo alto contraste e legibilidade funcional de micro-textos e tabelas.
* **Update**: Instalacao de fontes autenticas locais de grafite na variante V1 (`Bombing.ttf`, `ThrowUpFont.ttf`, `DonGraffiti.otf`, `SedgwickAve.ttf`, `DrippingMarker.ttf` em `fonts/`) eliminando qualquer risco de fallback para bold generico e garantindo letras gordas e tags curvas 100% offline.
* **Update**: Eliminacao completa de icones e GIFs legados na variante V1 (`ajuda.gif`, `flag_grey.png`, `avaliacao.jpg` e icones de menu), substituidos por badges e tags neon de grafite.
* **Update**: Correcao estrutural de layout na variante V1 com remocao do menu dropdown interno legado em `#portal-docente` e implementacao de CSS Grid imune a desalinhamentos.
* **Update**: Aprimoramento da variante V1 (Grafite de Rua) com tipografia especializada de grafite e sistema de banner com rolamento lateral (letreiro continuo + carrossel horizontal de cards interativos).
* **Update**: Adicao de testes unitarios em `test_offline_setup.py` validando determinismo tipografico local, ausencia de icones antigos e protecao contra quebras de layout.
* **Update**: Estabilizacao e correcao completa de `home.html` com estilos locais unificados (`sigaa_offline_complete.css`), menus interativos e remocao total de Dart em favor de extratores exclusivamente em Python.
* **Update**: Regeneracao das variantes V1 (Grafite) e V2 (Acessibilidade) com estilizacoes e ativos autonomos.
* **Creation**: Criacao do conceito [Ambiente de HTMLs Offline e Variantes Visuais](/concepts/offline_html_workbench_and_variants.md).
* **Creation**: Configuracao da pasta isolada offline_pages, ferramentas de extracao desacopladas e integracao com regras do .gitignore.
