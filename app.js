(function () {
  'use strict';

  function renderExercise(treino, ex) {
    const imgSrc = ex.imagem
      ? (ex.imagem.startsWith('http') ? ex.imagem : ex.imagem)
      : ('data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="90" viewBox="0 0 120 90"><rect fill="%2322222c" width="120" height="90"/><text x="60" y="48" fill="%239a9691" font-size="12" font-family="sans-serif" text-anchor="middle">Sem imagem</text></svg>'));
    const youtubeSearchUrl = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(ex.exercicio);

    const card = document.createElement('article');
    card.className = 'exercise-card';
    card.dataset.id = ex.id;
    card.innerHTML =
      '<div class="exercise-card-header">' +
        '<div class="exercise-thumb-wrap"><img class="exercise-thumb" src="' + imgSrc + '" alt="' + escapeHtml(ex.exercicio) + '" loading="lazy"></div>' +
        '<div class="exercise-info">' +
          '<p class="exercise-grupo">' + escapeHtml(ex.grupo) + '</p>' +
          '<h3 class="exercise-nome">' + escapeHtml(ex.exercicio) + '</h3>' +
          '<p class="equipamento">' + escapeHtml(ex.equipamento) + '</p>' +
          (ex.observacoes ? '<p class="observacoes">' + escapeHtml(ex.observacoes) + '</p>' : '') +
        '</div>' +
        '<div class="check-wrap">' +
          '<label><input type="checkbox" data-id="' + escapeHtml(ex.id) + '"> Feito</label>' +
        '</div>' +
      '</div>' +
      '<a class="btn-youtube" href="' + youtubeSearchUrl + '" target="_blank" rel="noopener noreferrer">Assistir no YouTube</a>';

    const cb = card.querySelector('input[type="checkbox"]');
    if (cb) {
      cb.addEventListener('change', function () {
        card.classList.toggle('done', this.checked);
      });
    }

    return card;
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function renderTreino(treinoKey) {
    const list = ROTINA[treinoKey];
    const container = document.getElementById('exercises-' + treinoKey);
    if (!list || !container) return;
    container.innerHTML = '';
    list.forEach(function (ex) {
      container.appendChild(renderExercise(treinoKey, ex));
    });
  }

  function switchPanel(activeKey) {
    document.querySelectorAll('.treino-panel').forEach(function (panel) {
      const id = panel.id;
      const key = id === 'treino-cardio' ? 'cardio' : id.replace('treino-', '');
      const isActive = key === activeKey;
      panel.classList.toggle('active', isActive);
      panel.setAttribute('aria-hidden', !isActive);
    });
    document.querySelectorAll('.tab').forEach(function (tab) {
      const key = tab.getAttribute('data-treino');
      const isActive = key === activeKey;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive);
    });
  }

  function getTreinoDoDia() {
    const dia = new Date().getDay();
    if (dia === 0) return 'cardio';
    if (dia === 1 || dia === 4) return 'A';
    if (dia === 2 || dia === 5) return 'B';
    return 'C';
  }

  function init() {
    ['A', 'B', 'C', 'cardio'].forEach(renderTreino);
    switchPanel(getTreinoDoDia());

    document.querySelectorAll('.tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        switchPanel(this.getAttribute('data-treino'));
      });
    });

    var resetBtn = document.getElementById('reset-day');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        document.querySelectorAll('.exercise-card').forEach(function (card) {
          card.classList.remove('done');
          var cb = card.querySelector('input[type="checkbox"]');
          if (cb) cb.checked = false;
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
