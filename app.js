(function () {
  'use strict';

  var STORAGE_KEY = 'treino-done';
  var ORDER_KEY = 'treino-order';
  var SELECTED_CLASS = 'selected';
  var draggedCard = null;
  var lastSelectionByTreino = { A: null, B: null, C: null, cardio: null };
  var congratsCloseTimer = null;
  var CONGRATS_MS = 3000;
  var headerTimerInterval = null;
  var headerTimerStartedAt = Date.now();
  var headerTimerAccumulatedMs = 0;
  var headerClockInterval = null;

  function formatElapsed(ms) {
    var totalSec = Math.max(0, Math.floor(ms / 1000));
    var h = Math.floor(totalSec / 3600);
    var m = Math.floor((totalSec % 3600) / 60);
    var s = totalSec % 60;
    if (h > 0) return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function updateHeaderTimer() {
    var el = document.getElementById('header-timer');
    if (!el) return;
    var runningMs = Date.now() - headerTimerStartedAt;
    el.textContent = formatElapsed(headerTimerAccumulatedMs + runningMs);
  }

  function startHeaderTimer() {
    if (headerTimerInterval) return;
    headerTimerStartedAt = Date.now();
    updateHeaderTimer();
    headerTimerInterval = setInterval(updateHeaderTimer, 1000);
  }

  function pauseHeaderTimer() {
    if (!headerTimerInterval) return;
    clearInterval(headerTimerInterval);
    headerTimerInterval = null;
    headerTimerAccumulatedMs += (Date.now() - headerTimerStartedAt);
    updateHeaderTimer();
  }

  function updateHeaderClock() {
    var el = document.getElementById('header-clock');
    if (!el) return;
    var now = new Date();
    var hh = String(now.getHours()).padStart(2, '0');
    var mm = String(now.getMinutes()).padStart(2, '0');
    var ss = String(now.getSeconds()).padStart(2, '0');
    el.textContent = hh + ':' + mm + ':' + ss;
  }

  function startHeaderClock() {
    if (headerClockInterval) return;
    updateHeaderClock();
    headerClockInterval = setInterval(updateHeaderClock, 1000);
  }

  function pauseHeaderClock() {
    if (!headerClockInterval) return;
    clearInterval(headerClockInterval);
    headerClockInterval = null;
  }

  function resetHeaderTimer() {
    headerTimerAccumulatedMs = 0;
    headerTimerStartedAt = Date.now();
    updateHeaderTimer();
  }

  function dismissTips() {
    var tips = document.getElementById('videos-legais');
    if (tips) tips.classList.add('is-dismissed');
  }

  function showTips() {
    var tips = document.getElementById('videos-legais');
    if (tips) tips.classList.remove('is-dismissed');
  }

  function updateTipsToggleUi() {
    var btn = document.getElementById('tips-toggle');
    var tips = document.getElementById('videos-legais');
    if (!btn || !tips) return;
    var dismissed = tips.classList.contains('is-dismissed');
    btn.textContent = dismissed ? 'Mostrar dicas' : 'Ocultar dicas';
    btn.setAttribute('aria-expanded', dismissed ? 'false' : 'true');
  }

  function restoreTipsState() {
    var tips = document.getElementById('videos-legais');
    // Por padrão, as Dicas sempre começam abertas ao carregar a página.
    if (tips) tips.classList.remove('is-dismissed');
  }

  function shouldDismissTipsOnEnter() {
    var tips = document.getElementById('videos-legais');
    if (!tips) return false;
    return !tips.classList.contains('is-dismissed');
  }

  function getDateKey() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function getTreinoFromId(id) {
    var i = id.indexOf('-');
    return i >= 0 ? id.slice(0, i) : id;
  }

  function loadOrder() {
    try {
      var raw = localStorage.getItem(ORDER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function saveOrder(data) {
    try {
      localStorage.setItem(ORDER_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function getOrderedList(treinoKey, list) {
    var data = loadOrder() || {};
    var order = Array.isArray(data[treinoKey]) ? data[treinoKey] : null;
    if (!order || order.length === 0) return list.slice();

    var map = {};
    list.forEach(function (ex) { map[ex.id] = ex; });

    var out = [];
    order.forEach(function (id) { if (map[id]) out.push(map[id]); });
    list.forEach(function (ex) { if (!order.includes(ex.id)) out.push(ex); });
    // Itens "pinnedFirst" devem ficar sempre no topo (mesmo com ordem salva antiga).
    var pinned = [];
    var rest = [];
    out.forEach(function (ex) {
      if (ex && ex.pinnedFirst) pinned.push(ex);
      else rest.push(ex);
    });
    pinned.sort(function (a, b) {
      var ra = typeof a.pinnedRank === 'number' ? a.pinnedRank : 999;
      var rb = typeof b.pinnedRank === 'number' ? b.pinnedRank : 999;
      return ra - rb;
    });
    return pinned.concat(rest);
  }

  function loadDoneState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (data.date !== getDateKey()) return null;
      return data.done || null;
    } catch (e) { return null; }
  }

  function saveDoneState() {
    var done = { A: [], B: [], C: [], cardio: [] };
    document.querySelectorAll('.exercise-card.done').forEach(function (card) {
      var id = card.dataset.id;
      if (!id) return;
      var t = getTreinoFromId(id);
      if (done[t]) done[t].push(id);
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: getDateKey(), done: done }));
  }

  function applySavedState() {
    var saved = loadDoneState();
    if (!saved) return;
    for (var treino in saved) {
      (saved[treino] || []).forEach(function (id) {
        var card = document.querySelector('.exercise-card[data-id="' + id + '"]');
        if (card) {
          var cb = card.querySelector('input[type="checkbox"]');
          if (cb) { cb.checked = true; card.classList.add('done'); }
        }
      });
    }
  }

  function renderExercise(treino, ex) {
    const imgSrc = ex.imagem
      ? (ex.imagem.startsWith('http') ? ex.imagem : ex.imagem)
      : ('data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="90" viewBox="0 0 120 90"><rect fill="%2322222c" width="120" height="90"/><text x="60" y="48" fill="%239a9691" font-size="12" font-family="sans-serif" text-anchor="middle">Sem imagem</text></svg>'));
    const youtubeSearchUrl = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(ex.exercicio);
    const hasVideo = ex.video && String(ex.video).trim();

    const card = document.createElement('article');
    card.className = 'exercise-card';
    card.dataset.id = ex.id;
    card.dataset.treino = treino;
    card.draggable = !ex.pinnedFirst;
    card.innerHTML =
      '<div class="exercise-card-header">' +
        (ex.pinnedFirst
          ? '<div class="drag-handle drag-handle-disabled" aria-hidden="true" title="Fixado no topo">📌</div>'
          : '<div class="drag-handle" draggable="false" role="button" tabindex="0" aria-label="Reordenar exercício" title="Arraste para reordenar">⋮⋮</div>') +
        '<div class="exercise-thumb-wrap"><img class="exercise-thumb" src="' + imgSrc + '" alt="' + escapeHtml(ex.exercicio) + '" loading="lazy" draggable="false"></div>' +
        '<div class="exercise-info">' +
          '<p class="exercise-grupo">' + escapeHtml(ex.grupo) + '</p>' +
          '<div class="exercise-nome-wrap">' +
            '<h3 class="exercise-nome">' + escapeHtml(ex.exercicio) + '</h3>' +
            '<a class="btn-youtube btn-youtube-icon" href="' + youtubeSearchUrl + '" target="_blank" rel="noopener noreferrer" aria-label="Buscar no YouTube" title="Buscar no YouTube"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></a>' +
          '</div>' +
          '<p class="equipamento">' + escapeHtml(ex.equipamento) + '</p>' +
          (ex.observacoes ? '<p class="observacoes">' + escapeHtml(ex.observacoes) + '</p>' : '') +
        '</div>' +
        '<div class="check-wrap" title="Enter">' +
          '<label><input type="checkbox" data-id="' + escapeHtml(ex.id) + '"> Feito</label>' +
        '</div>' +
        (hasVideo
          ? '<div class="video-dica-wrap video-dica-wrap-inline">' +
              '<button type="button" class="video-dica-thumb" aria-label="Assistir vídeo de correção">' +
                '<video class="video-dica-thumb-preview" preload="metadata" muted playsinline></video>' +
                '<span class="video-dica-play-icon" aria-hidden="true">▶</span>' +
              '</button>' +
              '<p class="video-dica-title">Vídeo</p>' +
            '</div>'
          : '') +
      '</div>';

    const cb = card.querySelector('input[type="checkbox"]');
    if (cb) {
      cb.addEventListener('change', function () {
        card.classList.toggle('done', this.checked);
        saveDoneState();
        if (this.checked) {
          // se marcou, move seleção para o próximo disponível
          if (card.classList.contains(SELECTED_CLASS)) {
            selectNextAvailableInActivePanel();
          }
        }
        showCongratsIfDone();
      });
    }

    // Seleção por clique
    card.addEventListener('click', function (e) {
      // evita selecionar ao clicar no checkbox/links/botões
      var t = e.target;
      if (t && (t.closest('a') || t.closest('button') || t.closest('label') || t.closest('.drag-handle'))) return;
      selectCard(card);
    });

    // Drag & drop: só inicia pelo handle
    card.addEventListener('dragstart', function (e) {
      var handle = e.target && e.target.closest && e.target.closest('.drag-handle');
      if (!handle) {
        e.preventDefault();
        return;
      }
      draggedCard = card;
      try { e.dataTransfer.setData('text/plain', card.dataset.id || ''); } catch (err) {}
      e.dataTransfer.effectAllowed = 'move';
      card.classList.add('dragging');
    });
    card.addEventListener('dragend', function () {
      card.classList.remove('dragging');
      draggedCard = null;
    });
    card.addEventListener('dragover', function (e) {
      if (!draggedCard || draggedCard === card) return;
      if (card.classList.contains('done') || draggedCard.classList.contains('done')) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });
    card.addEventListener('drop', function (e) {
      if (!draggedCard || draggedCard === card) return;
      if (card.classList.contains('done') || draggedCard.classList.contains('done')) return;
      e.preventDefault();
      var parent = card.parentElement;
      if (!parent) return;
      // insere o dragged antes/depois baseado no mouse
      var rect = card.getBoundingClientRect();
      var before = e.clientY < rect.top + rect.height / 2;
      parent.insertBefore(draggedCard, before ? card : card.nextSibling);
      persistOrderForTreino(draggedCard.dataset.treino, parent);
    });

    var wrap = card.querySelector('.exercise-thumb-wrap');
    var thumb = wrap && wrap.querySelector('.exercise-thumb');
    if (wrap && thumb && imgSrc) {
      wrap.addEventListener('click', function (e) {
        e.preventDefault();
        var overlay = document.getElementById('image-zoom-overlay');
        var overlayImg = overlay && overlay.querySelector('.image-zoom-img');
        if (overlay && overlayImg) {
          overlayImg.src = thumb.src;
          overlayImg.alt = thumb.alt;
          overlay.classList.add('visible');
          overlay.setAttribute('aria-hidden', 'false');
        }
      });
    }

    if (hasVideo) {
      var videoDicaWrap = card.querySelector('.video-dica-wrap');
      if (videoDicaWrap) {
        var thumbBtn = videoDicaWrap.querySelector('.video-dica-thumb');
        var thumbVideo = videoDicaWrap.querySelector('.video-dica-thumb-preview');
        if (thumbVideo) {
          var webmSrc = getWebmPath(ex.video);
          if (webmSrc) {
            var src = document.createElement('source');
            src.src = webmSrc;
            src.type = 'video/webm';
            thumbVideo.appendChild(src);
            thumbVideo.addEventListener('loadedmetadata', function () {
              if (thumbVideo.duration && isFinite(thumbVideo.duration)) {
                thumbVideo.currentTime = Math.min(1, thumbVideo.duration * 0.1);
              }
            });
          }
        }
        if (thumbBtn) {
          thumbBtn.addEventListener('click', function () {
            openVideoOverlay(ex.exercicio + ' — Correção', ex.video);
          });
        }
      }
    }

    return card;
  }

  function getYoutubeEmbedUrl(url) {
    var m = url.match(/youtube\.com\/watch\?.*v=([^&\s]+)/) || url.match(/youtu\.be\/([^\s?]+)/) || url.match(/youtube\.com\/embed\/([^\s?]+)/);
    return m ? 'https://www.youtube.com/embed/' + m[1] : null;
  }

  function getWebmPath(path) {
    if (!path || typeof path !== 'string') return null;
    return path.endsWith('.webm') ? path : path.replace(/\.mp4$/i, '.webm');
  }

  function createVideoElementWithSources(videoPath, className) {
    var video = document.createElement('video');
    video.controls = true;
    video.className = className || '';
    var webm = getWebmPath(videoPath);
    if (webm) {
      var s = document.createElement('source');
      s.src = webm;
      s.type = 'video/webm';
      video.appendChild(s);
    }
    return video;
  }

  function openVideoOverlay(exercicioNome, videoSrc) {
    var overlay = document.getElementById('video-overlay');
    var titleEl = document.getElementById('video-overlay-title');
    var playerEl = document.getElementById('video-overlay-player');
    if (!overlay || !playerEl) return;
    playerEl.innerHTML = '';
    var embedUrl = getYoutubeEmbedUrl(videoSrc);
    if (embedUrl) {
      var iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.title = 'Vídeo: ' + exercicioNome;
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.className = 'video-overlay-iframe';
      playerEl.appendChild(iframe);
    } else {
      var video = createVideoElementWithSources(videoSrc, 'video-overlay-html5');
      playerEl.appendChild(video);
    }
    if (titleEl) titleEl.textContent = exercicioNome;
    overlay.classList.add('visible');
    overlay.setAttribute('aria-hidden', 'false');
  }

  function renderVideosLegais() {
    if (typeof VIDEOS_LEGAIS === 'undefined' || !VIDEOS_LEGAIS.length) return;
    var container = document.getElementById('videos-legais-grid');
    if (!container) return;
    container.innerHTML = '';
    VIDEOS_LEGAIS.forEach(function (item) {
      if (!item.video) return;
      var wrap = document.createElement('div');
      wrap.className = 'video-legal-card';
      var thumbBtn = document.createElement('button');
      thumbBtn.type = 'button';
      thumbBtn.className = 'video-dica-thumb video-legal-thumb';
      thumbBtn.setAttribute('aria-label', 'Assistir: ' + item.titulo);
      var thumbVideo = document.createElement('video');
      thumbVideo.className = 'video-dica-thumb-preview';
      thumbVideo.preload = 'metadata';
      thumbVideo.muted = true;
      thumbVideo.playsInline = true;
      var webmSrc = getWebmPath(item.video);
      if (webmSrc) {
        var src = document.createElement('source');
        src.src = webmSrc;
        src.type = 'video/webm';
        thumbVideo.appendChild(src);
        thumbVideo.addEventListener('loadedmetadata', function () {
          if (thumbVideo.duration && isFinite(thumbVideo.duration)) {
            thumbVideo.currentTime = Math.min(1, thumbVideo.duration * 0.1);
          }
        });
      }
      var playIcon = document.createElement('span');
      playIcon.className = 'video-dica-play-icon';
      playIcon.setAttribute('aria-hidden', 'true');
      playIcon.textContent = '▶';
      thumbBtn.appendChild(thumbVideo);
      thumbBtn.appendChild(playIcon);
      var title = document.createElement('p');
      title.className = 'video-dica-title video-legal-thumb-title';
      title.textContent = item.titulo;
      thumbBtn.addEventListener('click', function () {
        openVideoOverlay(item.titulo, item.video);
      });
      wrap.appendChild(thumbBtn);
      wrap.appendChild(title);
      container.appendChild(wrap);
    });
  }

  function closeVideoOverlay() {
    var overlay = document.getElementById('video-overlay');
    var playerEl = document.getElementById('video-overlay-player');
    if (!overlay || !playerEl) return;
    var video = playerEl.querySelector('video');
    if (video) {
      video.pause();
      video.removeAttribute('src');
    }
    playerEl.innerHTML = '';
    overlay.classList.remove('visible');
    overlay.setAttribute('aria-hidden', 'true');
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function clearSelection(panel) {
    if (!panel) return;
    panel.querySelectorAll('.exercise-card.' + SELECTED_CLASS).forEach(function (c) {
      c.classList.remove(SELECTED_CLASS);
    });
  }

  function getActiveTreinoKey() {
    var panel = document.querySelector('.treino-panel.active');
    if (!panel) return null;
    var id = panel.id;
    return id === 'treino-cardio' ? 'cardio' : id.replace('treino-', '');
  }

  function getSelectableCards(panel) {
    return Array.prototype.slice.call(panel.querySelectorAll('.exercise-card:not(.done)'));
  }

  function ensureSelectionInActivePanel() {
    var panel = document.querySelector('.treino-panel.active');
    if (!panel) return;
    var treinoKey = getActiveTreinoKey();
    var cards = getSelectableCards(panel);
    if (cards.length === 0) {
      clearSelection(panel);
      return;
    }
    var wantedId = treinoKey && lastSelectionByTreino[treinoKey];
    var chosen = wantedId ? panel.querySelector('.exercise-card[data-id="' + wantedId + '"]:not(.done)') : null;
    if (!chosen) chosen = cards[0];
    selectCard(chosen);
  }

  function selectCard(card) {
    if (!card || card.classList.contains('done')) return;
    var panel = card.closest('.treino-panel');
    if (!panel) return;
    clearSelection(panel);
    card.classList.add(SELECTED_CLASS);
    var treinoKey = getActiveTreinoKey();
    if (treinoKey) lastSelectionByTreino[treinoKey] = card.dataset.id || null;
    try { card.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {}
  }

  function moveSelection(delta) {
    var panel = document.querySelector('.treino-panel.active');
    if (!panel) return;
    var cards = getSelectableCards(panel);
    if (cards.length === 0) return;
    var current = panel.querySelector('.exercise-card.' + SELECTED_CLASS);
    var idx = current ? cards.indexOf(current) : -1;
    var next = idx < 0 ? cards[0] : cards[Math.max(0, Math.min(cards.length - 1, idx + delta))];
    selectCard(next);
  }

  function selectNextAvailableInActivePanel() {
    var panel = document.querySelector('.treino-panel.active');
    if (!panel) return;
    var cards = getSelectableCards(panel);
    if (cards.length === 0) return;
    selectCard(cards[0]);
  }

  function markSelectedDone() {
    var panel = document.querySelector('.treino-panel.active');
    if (!panel) return;
    var current = panel.querySelector('.exercise-card.' + SELECTED_CLASS);
    if (!current) {
      ensureSelectionInActivePanel();
      current = panel.querySelector('.exercise-card.' + SELECTED_CLASS);
    }
    if (!current) return;
    var cb = current.querySelector('input[type="checkbox"]');
    if (cb) {
      cb.checked = true;
      current.classList.add('done');
      saveDoneState();
      showCongratsIfDone();
      selectNextAvailableInActivePanel();
    }
  }

  function persistOrderForTreino(treinoKey, container) {
    if (!treinoKey || !container) return;
    var ids = [];
    container.querySelectorAll('.exercise-card').forEach(function (card) {
      if (card.dataset && card.dataset.id) ids.push(card.dataset.id);
    });
    var data = loadOrder() || {};
    data[treinoKey] = ids;
    saveOrder(data);
  }

  /** Permite soltar no grid (áreas vazias) e mantém dragover válido em toda a lista. */
  function bindGridDragZone(container, treinoKey) {
    if (!container) return;
    container.addEventListener('dragover', function (e) {
      if (!draggedCard || draggedCard.dataset.treino !== treinoKey) return;
      if (draggedCard.classList.contains('done')) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });
    container.addEventListener('drop', function (e) {
      if (!draggedCard || draggedCard.dataset.treino !== treinoKey) return;
      if (draggedCard.classList.contains('done')) return;
      if (e.target !== container) return;
      e.preventDefault();
      container.appendChild(draggedCard);
      persistOrderForTreino(treinoKey, container);
    });
  }

  function renderTreino(treinoKey) {
    const list = ROTINA[treinoKey];
    const container = document.getElementById('exercises-' + treinoKey);
    if (!list || !container) return;
    container.innerHTML = '';
    var ordered = getOrderedList(treinoKey, list);
    ordered.forEach(function (ex) {
      container.appendChild(renderExercise(treinoKey, ex));
    });
    bindGridDragZone(container, treinoKey);
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

  function isAllDoneInActivePanel() {
    var panel = document.querySelector('.treino-panel.active');
    if (!panel) return false;
    var cards = panel.querySelectorAll('.exercise-card');
    if (!cards.length) return false;
    for (var i = 0; i < cards.length; i++) {
      if (!cards[i].classList.contains('done')) return false;
    }
    return true;
  }

  function showCongratsIfDone() {
    if (!isAllDoneInActivePanel()) return;
    var overlay = document.getElementById('congrats-overlay');
    var ring = document.querySelector('.congrats-timer-progress');
    if (!overlay) return;
    if (congratsCloseTimer) {
      clearTimeout(congratsCloseTimer);
      congratsCloseTimer = null;
    }
    overlay.classList.add('visible');
    overlay.setAttribute('aria-hidden', 'false');
    if (ring) {
      ring.style.setProperty('--congrats-dur', CONGRATS_MS + 'ms');
      ring.classList.remove('congrats-timer-animate');
      void ring.offsetWidth;
      ring.classList.add('congrats-timer-animate');
    }
    congratsCloseTimer = setTimeout(function () {
      congratsCloseTimer = null;
      closeCongrats();
    }, CONGRATS_MS);
  }

  function closeCongrats() {
    if (congratsCloseTimer) {
      clearTimeout(congratsCloseTimer);
      congratsCloseTimer = null;
    }
    var overlay = document.getElementById('congrats-overlay');
    var ring = document.querySelector('.congrats-timer-progress');
    if (ring) ring.classList.remove('congrats-timer-animate');
    if (overlay) {
      overlay.classList.remove('visible');
      overlay.setAttribute('aria-hidden', 'true');
    }
  }

  function init() {
    ['A', 'B', 'C', 'cardio'].forEach(renderTreino);
    switchPanel(getTreinoDoDia());
    applySavedState();
    renderVideosLegais();
    restoreTipsState();
    updateTipsToggleUi();
    ensureSelectionInActivePanel();
    startHeaderTimer();
    startHeaderClock();

    var overlay = document.getElementById('image-zoom-overlay');
    if (overlay) {
      overlay.addEventListener('click', function () {
        overlay.classList.remove('visible');
        overlay.setAttribute('aria-hidden', 'true');
      });
    }

    var videoOverlay = document.getElementById('video-overlay');
    var videoOverlayClose = document.getElementById('video-overlay-close');
    if (videoOverlay) {
      videoOverlay.addEventListener('click', function (e) {
        if (e.target === videoOverlay) closeVideoOverlay();
      });
    }
    if (videoOverlayClose) {
      videoOverlayClose.addEventListener('click', closeVideoOverlay);
    }

    var congratsOverlay = document.getElementById('congrats-overlay');
    if (congratsOverlay) {
      congratsOverlay.addEventListener('click', function (e) {
        if (e.target === congratsOverlay) closeCongrats();
      });
    }

    document.querySelectorAll('.tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        switchPanel(this.getAttribute('data-treino'));
        ensureSelectionInActivePanel();
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
        saveDoneState();
      });
    }

    document.addEventListener('keydown', function (e) {
      var tag = document.activeElement && document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      var panel = document.querySelector('.treino-panel.active');
      if (!panel) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        moveSelection(1);
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        moveSelection(-1);
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (shouldDismissTipsOnEnter()) {
          dismissTips();
          updateTipsToggleUi();
          return;
        }
        markSelectedDone();
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetHeaderTimer();
        return;
      }

      if (e.key === 'Backspace' || e.key === 'z' || e.key === 'Z') {
        var doneCards = panel.querySelectorAll('.exercise-card.done');
        if (doneCards.length === 0) return;
        var last = doneCards[doneCards.length - 1];
        var lastCb = last.querySelector('input[type="checkbox"]');
        if (lastCb) {
          e.preventDefault();
          lastCb.checked = false;
          last.classList.remove('done');
          saveDoneState();
          // ao desfazer, seleciona o item reaberto
          selectCard(last);
        }
      }
    });

    var tipsClose = document.getElementById('videos-legais-close');
    if (tipsClose) {
      tipsClose.addEventListener('click', function () {
        dismissTips();
        updateTipsToggleUi();
      });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        pauseHeaderTimer();
        pauseHeaderClock();
      } else {
        startHeaderTimer();
        startHeaderClock();
      }
    });

    var headerTimerReset = document.getElementById('header-timer-reset');
    if (headerTimerReset) {
      headerTimerReset.addEventListener('click', function () {
        resetHeaderTimer();
      });
    }
    }

    var tipsToggle = document.getElementById('tips-toggle');
    if (tipsToggle) {
      tipsToggle.addEventListener('click', function () {
        var tips = document.getElementById('videos-legais');
        if (!tips) return;
        if (tips.classList.contains('is-dismissed')) showTips();
        else dismissTips();
        updateTipsToggleUi();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
