(function () {
  'use strict';

  var STORAGE_KEY = 'treino-done';

  function getDateKey() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function getTreinoFromId(id) {
    var i = id.indexOf('-');
    return i >= 0 ? id.slice(0, i) : id;
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
    card.innerHTML =
      '<div class="exercise-card-header">' +
        '<div class="exercise-thumb-wrap"><img class="exercise-thumb" src="' + imgSrc + '" alt="' + escapeHtml(ex.exercicio) + '" loading="lazy"></div>' +
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
        showCongratsIfDone();
      });
    }

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
    if (isAllDoneInActivePanel()) {
      var overlay = document.getElementById('congrats-overlay');
      if (overlay) {
        overlay.classList.add('visible');
        overlay.setAttribute('aria-hidden', 'false');
      }
    }
  }

  function closeCongrats() {
    var overlay = document.getElementById('congrats-overlay');
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
    var congratsClose = document.getElementById('congrats-close');
    if (congratsOverlay) {
      congratsOverlay.addEventListener('click', function (e) {
        if (e.target === congratsOverlay) closeCongrats();
      });
    }
    if (congratsClose) {
      congratsClose.addEventListener('click', closeCongrats);
    }

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
        saveDoneState();
      });
    }

    document.addEventListener('keydown', function (e) {
      var tag = document.activeElement && document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      var panel = document.querySelector('.treino-panel.active');
      if (!panel) return;

      if (e.key === 'Enter') {
        var first = panel.querySelector('.exercise-card:not(.done)');
        if (!first) return;
        e.preventDefault();
        var cb = first.querySelector('input[type="checkbox"]');
        if (cb) {
          cb.checked = true;
          first.classList.add('done');
          saveDoneState();
          showCongratsIfDone();
        }
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
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
