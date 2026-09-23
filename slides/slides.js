// ==========================================================================
// MOTOR DE INTERATIVIDADE E NAVEGACAO - APRESENTACAO RETRO SIGAA UNB
// Regras estritas: Zero emojis em todo o codigo, sem paginacao direta,
// navegacao via catalogo de menu com retorno obrigatorio.
// ==========================================================================

(function () {
    "use strict";

    // 1. Dados dos Casos de Acessibilidade 2x (Slide 4)
    var accCasesData = {
        assignment: {
            name: "1. Tarefas (Aprender 3)",
            img1x: "img/acc_assignment_1x.png",
            img2x: "img/acc_assignment_2x.png",
            component: "AssignmentCard / DeadlinesList",
            severity: "ALTA",
            cause: "Uso de Row sem Flexible em textos longos de prazos combinados com botoes de submissao.",
            solution: "Envolver descricao em Expanded e adotar Wrap ou Column quando textScaleFactor >= 1.5x."
        },
        indices: {
            name: "2. Indices (IRA)",
            img1x: "img/acc_indices_1x.png",
            img2x: "img/acc_indices_2x.png",
            component: "AcademicIndicesChart / MetricDisplay",
            severity: "CRITICA",
            cause: "Container de grafico com altura rigida (height: 220). Sob 2.0x, a legenda invade o eixo e gera RenderFlex overflow.",
            solution: "Substituir altura fixa por LayoutBuilder responsivo e permitir rolagem bidirecional em relatorios analiticos."
        },
        calendar: {
            name: "3. Calendario Academico",
            img1x: "img/acc_calendar_1x.png",
            img2x: "img/acc_calendar_2x.png",
            component: "CalendarGrid / DayCellWidget",
            severity: "ALTA",
            cause: "GridView de celulas com relacao de aspecto constante (childAspectRatio: 1.0). Textos de eventos sobrepoem as datas.",
            solution: "Permitir expansao automatica da altura da celula e omitir badges secundarias sob ampliacao extrema."
        },
        edit_course: {
            name: "4. Editar Disciplina",
            img1x: "img/acc_edit_course_1x.png",
            img2x: "img/acc_edit_course_2x.png",
            component: "CourseEditForm / DepartmentSelector",
            severity: "MEDIA",
            cause: "Campos de texto empilhados sem SingleChildScrollView em telas com altura inferior a 600px logicos.",
            solution: "Adicionar SingleChildScrollView com physics ClampingScrollPhysics ao redor do formulario inteiro."
        },
        curriculum: {
            name: "5. Curriculo / PPC",
            img1x: "img/acc_curriculum_1x.png",
            img2x: "img/acc_curriculum_2x.png",
            component: "CurriculumTree / PrerequisiteGraph",
            severity: "CRITICA",
            cause: "Diagrama hierarquico de prerequisitos desenhado em CustomPaint com coordenadas absolutas em pixels.",
            solution: "Reescrever para arvore semantica linear colapsavel (ListView + ExpansionTile) para leitura assistiva."
        },
        permission: {
            name: "6. Permissoes e Solicitacoes",
            img1x: "img/acc_permission_1x.png",
            img2x: "img/acc_permission_2x.png",
            component: "PermissionRequestDialog / ActionButtonsRow",
            severity: "ALTA",
            cause: "Botoes de acao (Deferir / Indeferir / Cancelar) em Row horizontal sem quebra automatica em telas estreitas.",
            solution: "Utilizar Wrap com espacamento uniforme ou ordenar botoes verticalmente em telas acessiveis."
        }
    };

    // 2. Dados dos Dispositivos (Slide 5)
    var deviceSpecsData = {
        desktop: {
            label: "Desktop (1920x1080 / 1440px)",
            img: "img/home_full_desktop.png",
            columns: "3 colunas principais + barra lateral de servicos",
            navType: "Navegacao horizontal expandida com dropdowns inline",
            density: "Visualizacao simultanea de todas as turmas e notas",
            target: "Estudantes em laboratorio, biblioteca ou computadores pessoais"
        },
        tablet: {
            label: "Tablet (1024x768 / 800px)",
            img: "img/home_full_tablet.png",
            columns: "2 colunas adaptativas com paineis reorganizados",
            navType: "Barra superior compacta com recolhimento contextual",
            density: "Equilibrio entre produtividade e navegabilidade tatil",
            target: "Uso em salas de aula, corredores e estudos compartilhados"
        },
        mobile: {
            label: "Mobile (390x844 / 375px)",
            img: "img/home_full_mobile.png",
            columns: "Coluna unica vertical com cartoes colapsaveis",
            navType: "Menu inferior gaveta (bottom navigation sheet)",
            density: "Foco imediato no proximo compromisso e horarios do dia",
            target: "Consulta rapida em transporte publico e trajetos no campus"
        }
    };

    // 3. Imagens de Comparacao da Home (Slide 6)
    var homeCompareImages = {
        desktop: {
            full: "img/home_full_desktop.png",
            simple: "img/home_simple_desktop.png"
        },
        tablet: {
            full: "img/home_full_tablet.png",
            simple: "img/home_simple_tablet.png"
        },
        mobile: {
            full: "img/home_full_mobile.png",
            simple: "img/home_simple_mobile.png"
        }
    };

    // Variaveis de Estado
    var currentSlide = 1;
    var currentAccCase = "assignment";
    var currentAccMode = "compare";
    var currentHomeDevice = "desktop";
    var currentHomeSimpMode = "compare";
    var currentHomeSimpDevice = "mobile";

    // Elementos DOM
    var menuView = document.getElementById("slides-menu-view");
    var detailView = document.getElementById("slide-detail-view");
    var breadcrumbCurrent = document.getElementById("breadcrumb-current-slide");
    var topSlideInfo = document.getElementById("slide-current-info");
    var bottomSlideInfo = document.getElementById("slide-current-info-bottom");

    // Modal
    var modalEl = document.getElementById("image-modal");
    var modalImg = document.getElementById("modal-zoom-img");
    var modalTitle = document.getElementById("modal-zoom-title");
    var modalCloseBtn = document.getElementById("modal-close-btn");

    // ==========================================================================
    // FUNCOES DE NAVEGACAO E CONTROLE DE ESTADO
    // ==========================================================================

    function showSlidesMenu() {
        if (detailView) detailView.style.display = "none";
        if (menuView) menuView.style.display = "block";

        if (breadcrumbCurrent) {
            breadcrumbCurrent.innerHTML = "";
        }

        var navMenuBtn = document.getElementById("nav-item-menu");
        if (navMenuBtn) navMenuBtn.classList.add("active");

        window.scrollTo(0, 0);
    }

    function openSlide(slideNum) {
        var num = parseInt(slideNum, 10);
        if (isNaN(num) || num < 1 || num > 10) num = 1;
        currentSlide = num;

        // Ocultar todas as visoes de slides
        var allSlides = document.querySelectorAll(".slide-card");
        for (var i = 0; i < allSlides.length; i++) {
            allSlides[i].classList.remove("active");
            allSlides[i].style.display = "none";
        }

        // Exibir slide selecionado
        var targetSlide = document.getElementById("slide-" + currentSlide);
        if (targetSlide) {
            targetSlide.classList.add("active");
            targetSlide.style.display = "block";
        }

        // Alternar visoes principais
        if (menuView) menuView.style.display = "none";
        if (detailView) detailView.style.display = "block";

        // Atualizar identificador de slide
        var slideFormatted = (currentSlide < 10 ? "0" : "") + currentSlide;
        var infoText = "Visualizando Modulo [" + slideFormatted + " / 10]";
        if (topSlideInfo) topSlideInfo.textContent = infoText;
        if (bottomSlideInfo) bottomSlideInfo.textContent = infoText;

        // Atualizar breadcrumb
        if (breadcrumbCurrent) {
            breadcrumbCurrent.innerHTML = " &gt; <a href=\"javascript:void(0);\" class=\"link-voltar-menu\">Menu de Slides</a> &gt; Visualizar Modulo " + slideFormatted;
            var subLink = breadcrumbCurrent.querySelector(".link-voltar-menu");
            if (subLink) {
                subLink.addEventListener("click", showSlidesMenu);
            }
        }

        // Renderizar controles internos se necessario
        if (currentSlide === 4) {
            renderAccCase();
        } else if (currentSlide === 5) {
            renderHomeDevice();
        } else if (currentSlide === 6) {
            renderHomeCompare();
        }

        window.scrollTo(0, 0);
    }

    // ==========================================================================
    // RENDERIZADORES DOS SLIDES INTERATIVOS (4, 5 e 6)
    // ==========================================================================

    // Slide 4: Acessibilidade 2x
    function renderAccCase() {
        var data = accCasesData[currentAccCase];
        if (!data) return;

        var tbodyImages = document.getElementById("acc-images-tbody");
        if (tbodyImages) {
            var html = "";
            if (currentAccMode === "compare") {
                html += "<tr>";
                html += "  <th width=\"50%\" style=\"text-align: center;\">Escala Normal (1.0x)</th>";
                html += "  <th width=\"50%\" style=\"text-align: center; color: #A94442;\">Escala Acessibilidade (2.0x) - Falha RenderFlex</th>";
                html += "</tr>";
                html += "<tr>";
                html += "  <td align=\"center\" style=\"background: #FFFFFF; padding: 8px; vertical-align: top;\">";
                html += "    <img src=\"" + data.img1x + "\" alt=\"" + data.name + " 1x\" style=\"max-width: 100%; border: 1px solid #7F9DB9; cursor: pointer;\" onclick=\"window.sigaaModalZoom(this.src, '" + data.name + " (1.0x)')\">";
                html += "    <div style=\"font-size: 10px; color: #555555; margin-top: 4px; font-style: italic;\">Clique para ampliar em alta resolucao</div>";
                html += "  </td>";
                html += "  <td align=\"center\" style=\"background: #FFFFFF; padding: 8px; vertical-align: top;\">";
                html += "    <img src=\"" + data.img2x + "\" alt=\"" + data.name + " 2x\" style=\"max-width: 100%; border: 1px solid #A94442; cursor: pointer;\" onclick=\"window.sigaaModalZoom(this.src, '" + data.name + " (2.0x)')\">";
                html += "    <div style=\"font-size: 10px; color: #A94442; margin-top: 4px; font-weight: bold;\">Faixas de overflow indicam RenderFlex colapsado</div>";
                html += "  </td>";
                html += "</tr>";
            } else if (currentAccMode === "1x") {
                html += "<tr>";
                html += "  <th style=\"text-align: center;\">Apenas Escala Normal (1.0x)</th>";
                html += "</tr>";
                html += "<tr>";
                html += "  <td align=\"center\" style=\"background: #FFFFFF; padding: 8px;\">";
                html += "    <img src=\"" + data.img1x + "\" alt=\"" + data.name + " 1x\" style=\"max-width: 100%; border: 1px solid #7F9DB9; cursor: pointer;\" onclick=\"window.sigaaModalZoom(this.src, '" + data.name + " (1.0x)')\">";
                html += "  </td>";
                html += "</tr>";
            } else {
                html += "<tr>";
                html += "  <th style=\"text-align: center; color: #A94442;\">Apenas Escala de Acessibilidade (2.0x) - Faixas de Erro</th>";
                html += "</tr>";
                html += "<tr>";
                html += "  <td align=\"center\" style=\"background: #FFFFFF; padding: 8px;\">";
                html += "    <img src=\"" + data.img2x + "\" alt=\"" + data.name + " 2x\" style=\"max-width: 100%; border: 1px solid #A94442; cursor: pointer;\" onclick=\"window.sigaaModalZoom(this.src, '" + data.name + " (2.0x)')\">";
                html += "  </td>";
                html += "</tr>";
            }
            tbodyImages.innerHTML = html;
        }

        var tbodyDiag = document.getElementById("acc-diag-table");
        if (tbodyDiag) {
            tbodyDiag.innerHTML =
                "<tr class=\"odd\"><th width=\"22%\">Componente Afetado:</th><td><code>" + data.component + "</code></td></tr>" +
                "<tr class=\"even\"><th>Severidade da Quebra:</th><td><strong style=\"color: #A94442;\">" + data.severity + "</strong></td></tr>" +
                "<tr class=\"odd\"><th>Causa Tecnica:</th><td>" + data.cause + "</td></tr>" +
                "<tr class=\"even\"><th>Correcao Arquitetural:</th><td><strong style=\"color: #003366;\">" + data.solution + "</strong></td></tr>";
        }
    }

    // Slide 5: Responsividade Multi-Dispositivo
    function renderHomeDevice() {
        var spec = deviceSpecsData[currentHomeDevice];
        if (!spec) return;

        var imgEl = document.getElementById("home-device-img");
        var captionEl = document.getElementById("home-device-caption");
        var detailsTbody = document.getElementById("home-device-details");

        if (imgEl) {
            imgEl.src = spec.img;
            imgEl.alt = "Home " + spec.label;
        }
        if (captionEl) {
            captionEl.textContent = "Golden Test Oficial: " + spec.label + " - Clique para ampliar";
        }
        if (detailsTbody) {
            detailsTbody.innerHTML =
                "<tr class=\"odd\"><th width=\"22%\">Resolucao Nominal:</th><td><strong>" + spec.label + "</strong></td></tr>" +
                "<tr class=\"even\"><th>Topologia de Grade:</th><td>" + spec.columns + "</td></tr>" +
                "<tr class=\"odd\"><th>Mecanismo de Menus:</th><td>" + spec.navType + "</td></tr>" +
                "<tr class=\"even\"><th>Estrategia de Densidade:</th><td>" + spec.density + "</td></tr>" +
                "<tr class=\"odd\"><th>Publico Primario:</th><td>" + spec.target + "</td></tr>";
        }
    }

    // Slide 6: Carga Cognitiva
    function renderHomeCompare() {
        var imgs = homeCompareImages[currentHomeSimpDevice];
        if (!imgs) return;

        var tbody = document.getElementById("home-simp-tbody");
        if (!tbody) return;

        var html = "";
        if (currentHomeSimpMode === "compare") {
            html += "<tr>";
            html += "  <th width=\"50%\" style=\"text-align: center;\">Modo Completo (Padrao Institucional)</th>";
            html += "  <th width=\"50%\" style=\"text-align: center; color: #003366;\">Modo Simplificado (Preset Minimalista)</th>";
            html += "</tr>";
            html += "<tr>";
            html += "  <td align=\"center\" style=\"background: #FFFFFF; padding: 8px; vertical-align: top;\">";
            html += "    <img src=\"" + imgs.full + "\" alt=\"Home Completa\" style=\"max-width: 100%; border: 1px solid #7F9DB9; cursor: pointer;\" onclick=\"window.sigaaModalZoom(this.src, 'Home Modo Completo')\">";
            html += "    <div style=\"font-size: 10px; color: #555555; margin-top: 4px; font-style: italic;\">450 elementos no DOM - Alta densidade visual</div>";
            html += "  </td>";
            html += "  <td align=\"center\" style=\"background: #FFFFFF; padding: 8px; vertical-align: top;\">";
            html += "    <img src=\"" + imgs.simple + "\" alt=\"Home Simplificada\" style=\"max-width: 100%; border: 1px solid #005A9C; cursor: pointer;\" onclick=\"window.sigaaModalZoom(this.src, 'Home Modo Simplificado')\">";
            html += "    <div style=\"font-size: 10px; color: #003366; margin-top: 4px; font-weight: bold;\">160 elementos no DOM (-64%) - Foco imediato nas aulas</div>";
            html += "  </td>";
            html += "</tr>";
        } else if (currentHomeSimpMode === "full") {
            html += "<tr><th style=\"text-align: center;\">Apenas Modo Completo (" + currentHomeSimpDevice.toUpperCase() + ")</th></tr>";
            html += "<tr><td align=\"center\" style=\"background: #FFFFFF; padding: 8px;\">";
            html += "  <img src=\"" + imgs.full + "\" alt=\"Home Completa\" style=\"max-width: 100%; border: 1px solid #7F9DB9; cursor: pointer;\" onclick=\"window.sigaaModalZoom(this.src, 'Home Modo Completo')\">";
            html += "</td></tr>";
        } else {
            html += "<tr><th style=\"text-align: center; color: #003366;\">Apenas Modo Simplificado (" + currentHomeSimpDevice.toUpperCase() + ")</th></tr>";
            html += "<tr><td align=\"center\" style=\"background: #FFFFFF; padding: 8px;\">";
            html += "  <img src=\"" + imgs.simple + "\" alt=\"Home Simplificada\" style=\"max-width: 100%; border: 1px solid #005A9C; cursor: pointer;\" onclick=\"window.sigaaModalZoom(this.src, 'Home Modo Simplificado')\">";
            html += "</td></tr>";
        }
        tbody.innerHTML = html;
    }

    // ==========================================================================
    // MODAL DE ZOOM RETRO
    // ==========================================================================

    window.sigaaModalZoom = function (imgSrc, title) {
        if (modalImg) modalImg.src = imgSrc;
        if (modalTitle) modalTitle.textContent = title ? "Inspecao: " + title : "Inspecao em Alta Resolucao";
        if (modalEl) modalEl.classList.add("active");
    };

    function closeModal() {
        if (modalEl) modalEl.classList.remove("active");
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", closeModal);
    }
    if (modalEl) {
        modalEl.addEventListener("click", function (e) {
            if (e.target === modalEl) closeModal();
        });
    }

    // ==========================================================================
    // CONTADOR DE SESSAO DO SERVIDOR (30 MINUTOS)
    // ==========================================================================
    var sessionRemaining = 30 * 60;
    var sessionDisplay = document.getElementById("session-countdown-display");

    setInterval(function () {
        if (sessionRemaining > 0) {
            sessionRemaining--;
            var mins = Math.floor(sessionRemaining / 60);
            var secs = sessionRemaining % 60;
            var str = (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;
            if (sessionDisplay) sessionDisplay.textContent = str;
        } else {
            if (sessionDisplay) sessionDisplay.textContent = "EXPIRADA";
        }
    }, 1000);

    // ==========================================================================
    // INICIALIZACAO DE EVENTOS E OUVINTES DO DOM
    // ==========================================================================

    document.addEventListener("DOMContentLoaded", function () {
        // 1. Links e Botoes da Tabela de Menu Principal
        var menuTable = document.getElementById("tabela-slides-menu");
        if (menuTable) {
            menuTable.addEventListener("click", function (e) {
                var target = e.target;
                var slideBtn = target.closest(".btn-open-slide, .link-open-slide");
                if (slideBtn) {
                    var slideNum = slideBtn.getAttribute("data-slide");
                    if (slideNum) {
                        openSlide(slideNum);
                    }
                }
            });
        }

        // 2. Botoes de Retorno ao Menu de Slides
        var backBtns = document.querySelectorAll(".btn-voltar-menu, .link-voltar-menu, #title-back-menu-link, #breadcrumb-menu-link, #nav-btn-menu-slides");
        for (var i = 0; i < backBtns.length; i++) {
            backBtns[i].addEventListener("click", function (e) {
                e.preventDefault();
                showSlidesMenu();
            });
        }

        // 3. Botao de Reinicio no Slide 10
        var restartBtn = document.getElementById("btn-restart-session");
        if (restartBtn) {
            restartBtn.addEventListener("click", function () {
                sessionRemaining = 30 * 60;
                showSlidesMenu();
            });
        }

        // 4. Filtro por Eixo Tematico na Tabela do Menu
        var filtroEixo = document.getElementById("filtro-eixo");
        var btnFiltrar = document.getElementById("btn-filtrar-slides");
        var btnLimpar = document.getElementById("btn-limpar-filtro");

        function aplicarFiltro() {
            var val = filtroEixo ? filtroEixo.value : "todos";
            var rows = document.querySelectorAll("#tabela-slides-menu tbody tr");
            for (var r = 0; r < rows.length; r++) {
                if (val === "todos") {
                    rows[r].style.display = "";
                } else {
                    var cellText = rows[r].cells[2] ? rows[r].cells[2].textContent : "";
                    if (cellText.indexOf(val) !== -1) {
                        rows[r].style.display = "";
                    } else {
                        rows[r].style.display = "none";
                    }
                }
            }
        }

        if (btnFiltrar) {
            btnFiltrar.addEventListener("click", aplicarFiltro);
        }
        if (filtroEixo) {
            filtroEixo.addEventListener("change", aplicarFiltro);
        }
        if (btnLimpar) {
            btnLimpar.addEventListener("click", function () {
                if (filtroEixo) filtroEixo.value = "todos";
                aplicarFiltro();
            });
        }

        // 5. Controles do Slide 4 (Acessibilidade 2x)
        var accSelect = document.getElementById("acc-case-select");
        if (accSelect) {
            accSelect.addEventListener("change", function () {
                currentAccCase = this.value;
                renderAccCase();
            });
        }

        var accRadios = document.querySelectorAll("input[name=\"acc-view-mode\"]");
        for (var a = 0; a < accRadios.length; a++) {
            accRadios[a].addEventListener("change", function () {
                if (this.checked) {
                    currentAccMode = this.value;
                    renderAccCase();
                }
            });
        }

        // 6. Controles do Slide 5 (Responsividade)
        var homeDevSelect = document.getElementById("home-dev-select");
        if (homeDevSelect) {
            homeDevSelect.addEventListener("change", function () {
                currentHomeDevice = this.value;
                renderHomeDevice();
            });
        }

        // 7. Controles do Slide 6 (Carga Cognitiva)
        var homeSimpRadios = document.querySelectorAll("input[name=\"home-compare-mode\"]");
        for (var h = 0; h < homeSimpRadios.length; h++) {
            homeSimpRadios[h].addEventListener("change", function () {
                if (this.checked) {
                    currentHomeSimpMode = this.value;
                    renderHomeCompare();
                }
            });
        }

        var homeSimpDevSelect = document.getElementById("home-compare-dev-select");
        if (homeSimpDevSelect) {
            homeSimpDevSelect.addEventListener("change", function () {
                currentHomeSimpDevice = this.value;
                renderHomeCompare();
            });
        }

        // 8. Tecla ESC apenas para fechar Modal (SEM mudanca de slide)
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" || e.keyCode === 27) {
                closeModal();
            }
        });

        // Iniciar obrigatoriamente no Menu de Slides
        showSlidesMenu();
    });

})();
