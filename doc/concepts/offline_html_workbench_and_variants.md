---
type: Reference
title: Ambiente de HTMLs Offline e Variantes Visuais
description: Estrutura isolada de paginas HTML prontas, ferramentas de extracao em Python e variantes para apresentacoes sem afetar a extensao Chrome.
tags:
  - offline
  - extraction
  - python
  - html
  - variants
  - sigaa
  - presentation
  - graffiti
timestamp: 2026-09-23T10:26:00Z
---

O ambiente de HTMLs offline permite o desenvolvimento de testes deterministicos, extracao de dados em Python e estilizacao de prototipos visuais do SIGAA UnB desvinculados de credenciais ou instabilidades do servidor.

# Schema

A organizacao do diretorio isolado `offline_pages` estrutura os ativos estaticos e ferramentas em tres divisoes principais:

| Componente | Caminho Relativo | Finalidade |
|---|---|---|
| Paginas Prontas | `ready_html/` | Colecao de 35 copias estaticas integrais de telas do SIGAA com `home.html` corrigida |
| Extratores | `extractors/` | Ferramentas desacopladas de parsing e extracao exclusivamente em Python |
| Variantes | `variants/` | Prototipos visuais autonomos para apresentacao (V1 Grafite, V2 Acessibilidade, V3 WCAG AAA) |

## Estabilizacao da Home

A pagina `home.html` foi desacoplada de dependencias remotas:
- Inclusao do arquivo de estilos unificado `sigaa_offline_complete.css`.
- Vinculacao de icones e ativos locais no diretorio `img/`.
- Substituicao de chamadas dependentes de servidor por navegacao HTML estruturada.
- Isolamento total de Dart, padronizando os extratores no ecossistema Python com BeautifulSoup.

## Variante V1: Fontes Autenticas de Grafite, Banner Lateral e Layout em Grid

A variante visual V1 implementa uma experiencia imersiva inspirada na cultura urbana do grafite:
- **Tipografia Geral em Pixacao Urbana Legivel**: Fonte `MostWasted.ttf` (com fallback para `SedgwickAve.ttf`), combinando a expressividade angular, cortes retos e geometria incisiva da pixacao de rua com legibilidade operacional imediata de codigos de turmas (ex: `45N12`), semestres (`2026.1`), matriculas e dados de tabelas.
- **Embutimento Integral em Base64 (100% Offline)**: Fontes integradas como Data URIs em `fonts_embedded.css`, garantindo zero requisicoes de rede externas ao recarregar a pagina.
- **Sistema de Banner com Rolamento Lateral**: Integracao de letreiro continuo de avisos (*ticker tape/marquee*) e carrossel horizontal de cards informativos com botoes de rolagem lateral (`<` e `>`), suporte a toque e arraste via mouse.
- **Correcao Definitiva de Layout**: Grid CSS estruturado de duas colunas (`#main-docente` e `#perfil-docente`), com remocao do menu dropdown interno duplicado em `#portal-docente`.
- **Eliminacao de Icones Legados**: Substituicao de `ajuda.gif`, `flag_grey.png`, `avaliacao.jpg` e icones GIF de menu por tags e badges neon de grafite.

## Variante V3: Foco 100% em Acessibilidade e Conformidade WCAG 2.2 AAA

A variante visual V3 foi concebida para alcancar a pontuacao maxima de acessibilidade digital:
- **Contraste Aprimorado (>= 7:1)**: Tres esquemas de cores de alto contraste nativos (Escuro Padrao AAA a 15.8:1, Amarelo sobre Preto a 19.5:1 e Modo Claro Reforcado a 21:1).
- **Barra de Ferramentas Assistivas**: Ajuste dinamico de escala tipografica (100% a 150%), modo de fonte para dislexia e regua guia de leitura acionada por mouse ou teclado.
- **Navegacao por Teclado e Saltos**: Links de salto rapido (*skip links*) para conteudo principal, busca, menu e ferramentas de acessibilidade, com indicadores de foco ultralegiveis (`outline` solido de 4px).
- **Semantica HTML5 e Regioes Vivas**: Uso estrito de marcos (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`), titulos ordenados sem saltos, rotulos `<label>` e regioes `aria-live="polite"` para feedback em tempo real aos leitores de tela.

## Sanitizacao Estrita e Dicionario de Dados Pessoais

Para garantir conformidade com privacidade e impedir vazamento de dados reais de discentes e servidores da UnB ao publicar prototipos, o ambiente conta com uma suite de sanitizacao automatizada (`offline_pages/sanitize_htmls.py`):
- **Dicionario de Saneamento**: Varredura e substituicao de nomes completos reais, sufixos, matriculas reais e emails institucionais por dados genericos (`JOAO DA SILVA`, matricula `123456789`, `joao.silva@aluno.unb.br`).
- **Avatar Local da Internet**: Eliminacao de chamadas para `https://arquivos.unb.br/...` em favor de uma foto neutra de estudante baixada da internet (`img/foto_aluno.jpg`).
- **Auditoria Rigorosa**: Bloqueio de deploy caso qualquer termo do dicionario proibido ou URL interna persista nos arquivos.

## Publicacao de Variantes no GitHub Pages

O branch dedicado `gh-pages` disponibiliza exclusivamente a apresentacao das variantes visuais sem expor o restante da base de codigo:
- **Portal de Demonstracao (`index.html`)**: Landing page responsiva com cards de navegacao direta para a Variante 1 (Grafite) e Variante 2 (Acessibilidade).
- **Barra de Alternancia Rápida**: Header flutuante em cada variante que permite transitar diretamente entre as interfaces ou retornar ao portal.

# Examples

## Execucao da Extracao Offline (Python)

O script de extracao processa os arquivos locais e exibe os dados estruturados de perfil, turmas e notas:

```bash
python offline_pages/extractors/extract_offline.py
```

## Sanitizacao e Auditoria de Dados

```bash
python offline_pages/sanitize_htmls.py
```

## Montagem e Publicacao no GitHub Pages

```bash
python offline_pages/build_gh_pages.py
```

## Validacao de Conformidade WCAG 2.2 AAA (Variante V3)

```bash
python offline_pages/variants/v3_acessibilidade/validate_wcag.py
```

## Execucao dos Testes de Integridade

```bash
python -m unittest test_offline_setup.py
```

## Regeneracao das Variantes Autonomas

```bash
python offline_pages/variants/generate_variants.py
```

# Citations

[1] [Repositorio SIGAA API](https://github.com/Jhefferson15/hub_academico)
[2] [SIGAA Remix Chrome Extension](https://chrome.google.com/webstore/detail/sigaa-remix/plpmdkigbdddlaihbfbpjgcknmefjijf)
[3] [DaFont Graffiti Fonts Theme](https://www.dafont.com/theme.php?cat=606)
[4] [Google Fonts Sedgwick Ave Repository](https://github.com/google/fonts/tree/main/ofl/sedgwickave)
