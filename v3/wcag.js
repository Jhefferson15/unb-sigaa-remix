// -*- coding: utf-8 -*-
/**
 * SIGAA REMIX - CONTROLADOR ASSISTIVO WCAG 2.2 AAA (VARIANTE V3)
 * Gerencia aumento de fonte, modos de contraste, leitura guiada,
 * atalhos de teclado acessiveis e anuncios ARIA para leitores de tela.
 */

(function () {
  'use strict';

  var currentScaleIndex = 0;
  var scales = ['1rem', '1.15rem', '1.3rem', '1.5rem'];
  var scaleLabels = ['100%', '115%', '130%', '150%'];

  function announce(message) {
    var announcer = document.getElementById('wcagLiveAnnouncer');
    if (announcer) {
      announcer.textContent = '';
      setTimeout(function () {
        announcer.textContent = message;
      }, 50);
    }
  }

  function setFontSize(delta) {
    if (delta === 0) {
      currentScaleIndex = 0;
    } else {
      currentScaleIndex = Math.max(0, Math.min(scales.length - 1, currentScaleIndex + delta));
    }
    document.documentElement.style.setProperty('--wcag-font-scale', scales[currentScaleIndex]);
    var btnVal = document.getElementById('wcagFontSizeDisplay');
    if (btnVal) {
      btnVal.textContent = scaleLabels[currentScaleIndex];
    }
    announce('Tamanho da fonte ajustado para ' + scaleLabels[currentScaleIndex]);
  }

  function setTheme(theme) {
    document.body.classList.remove('wcag-theme-yellow-black', 'wcag-theme-dark-aaa');
    
    var btnDark = document.getElementById('btnThemeDark');
    var btnYellow = document.getElementById('btnThemeYellow');
    var btnLight = document.getElementById('btnThemeLight');

    if (btnDark) btnDark.setAttribute('aria-pressed', 'false');
    if (btnYellow) btnYellow.setAttribute('aria-pressed', 'false');
    if (btnLight) btnLight.setAttribute('aria-pressed', 'false');

    if (theme === 'yellow-black') {
      document.body.classList.add('wcag-theme-yellow-black');
      if (btnYellow) btnYellow.setAttribute('aria-pressed', 'true');
      announce('Tema alterado para Alto Contraste Amarelo sobre Preto.');
    } else if (theme === 'dark-aaa') {
      document.body.classList.add('wcag-theme-dark-aaa');
      if (btnDark) btnDark.setAttribute('aria-pressed', 'true');
      announce('Tema alterado para Modo Escuro AAA.');
    } else {
      if (btnLight) btnLight.setAttribute('aria-pressed', 'true');
      announce('Tema alterado para Modo Claro Padrão AAA.');
    }
  }

  function toggleDyslexicFont() {
    var isDyslexic = document.body.classList.toggle('wcag-font-dyslexic');
    var btn = document.getElementById('btnDyslexicFont');
    if (btn) {
      btn.setAttribute('aria-pressed', isDyslexic ? 'true' : 'false');
    }
    announce(isDyslexic ? 'Fonte de fácil leitura ativada.' : 'Fonte padrão restaurada.');
  }

  function toggleReadingRuler() {
    var ruler = document.getElementById('wcagReadingRuler');
    var btn = document.getElementById('btnReadingRuler');
    if (!ruler) return;

    var isActive = ruler.style.display === 'block';
    if (isActive) {
      ruler.style.display = 'none';
      if (btn) btn.setAttribute('aria-pressed', 'false');
      window.removeEventListener('mousemove', onMouseMoveRuler);
      announce('Guia de leitura desativada.');
    } else {
      ruler.style.display = 'block';
      if (btn) btn.setAttribute('aria-pressed', 'true');
      window.addEventListener('mousemove', onMouseMoveRuler);
      announce('Guia de leitura ativada. Mova o mouse ou use setas.');
    }
  }

  function onMouseMoveRuler(e) {
    var ruler = document.getElementById('wcagReadingRuler');
    if (ruler) {
      ruler.style.top = (e.clientY - 18) + 'px';
    }
  }

  // Filtragem acessivel instantanea de disciplinas
  function setupSearchFilter() {
    var searchInput = document.getElementById('busca-academica-input');
    var courseRows = document.querySelectorAll('.wcag-course-row');
    if (!searchInput || !courseRows.length) return;

    searchInput.addEventListener('input', function (e) {
      var query = e.target.value.toLowerCase().trim();
      var count = 0;
      courseRows.forEach(function (row) {
        var text = row.textContent.toLowerCase();
        if (!query || text.indexOf(query) !== -1) {
          row.style.display = '';
          count++;
        } else {
          row.style.display = 'none';
        }
      });
      if (query.length > 2) {
        announce(count + ' turmas ou itens encontrados para a busca.');
      }
    });
  }

  // Atalhos de teclado universais (Alt+1, Alt+2, Alt+3, Alt+4)
  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', function (e) {
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        if (e.key === '1') {
          e.preventDefault();
          var main = document.getElementById('conteudo');
          if (main) {
            main.setAttribute('tabindex', '-1');
            main.focus();
            announce('Foco direcionado para o Conteúdo Principal.');
          }
        } else if (e.key === '2') {
          e.preventDefault();
          var search = document.getElementById('busca-academica-input');
          if (search) {
            search.focus();
            announce('Foco direcionado para o Campo de Busca.');
          }
        } else if (e.key === '3') {
          e.preventDefault();
          var nav = document.getElementById('menu-principal-nav');
          if (nav) {
            nav.setAttribute('tabindex', '-1');
            nav.focus();
            announce('Foco direcionado para o Menu Principal.');
          }
        } else if (e.key === '4') {
          e.preventDefault();
          var toolbar = document.getElementById('barra-acessibilidade');
          if (toolbar) {
            var firstBtn = toolbar.querySelector('button');
            if (firstBtn) firstBtn.focus();
            announce('Foco direcionado para a Barra de Ferramentas de Acessibilidade.');
          }
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Event listeners dos botoes de fonte
    var btnFontPlus = document.getElementById('btnFontPlus');
    var btnFontMinus = document.getElementById('btnFontMinus');
    var btnFontReset = document.getElementById('btnFontReset');
    if (btnFontPlus) btnFontPlus.addEventListener('click', function () { setFontSize(1); });
    if (btnFontMinus) btnFontMinus.addEventListener('click', function () { setFontSize(-1); });
    if (btnFontReset) btnFontReset.addEventListener('click', function () { setFontSize(0); });

    // Event listeners dos temas
    var btnLight = document.getElementById('btnThemeLight');
    var btnDark = document.getElementById('btnThemeDark');
    var btnYellow = document.getElementById('btnThemeYellow');
    if (btnLight) btnLight.addEventListener('click', function () { setTheme('light-aaa'); });
    if (btnDark) btnDark.addEventListener('click', function () { setTheme('dark-aaa'); });
    if (btnYellow) btnYellow.addEventListener('click', function () { setTheme('yellow-black'); });

    // Modos adicionais
    var btnDyslexic = document.getElementById('btnDyslexicFont');
    if (btnDyslexic) btnDyslexic.addEventListener('click', toggleDyslexicFont);

    var btnRuler = document.getElementById('btnReadingRuler');
    if (btnRuler) btnRuler.addEventListener('click', toggleReadingRuler);

    setupSearchFilter();
    setupKeyboardShortcuts();
  });
})();
