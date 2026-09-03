(function () {
  'use strict';

  const TOTAL_FRAMES = 270;
  const PRIMARY_PREFIX = 'images/ezgif-frame-';
  const FALLBACK_PREFIX = 'New folder/ezgif-frame-';
  const FRAME_EXT = '.jpg';

  const animSection = document.getElementById('animation-scroll-section');
  const canvas = document.getElementById('animation-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });

  const images = new Array(TOTAL_FRAMES);
  const loaded = new Array(TOTAL_FRAMES).fill(false);
  let loadedCount = 0;
  let currentFrame = 1;
  let targetFrame = 1;
  let lastDrawnFrame = -1;

  function pad3(n) {
    return String(n).padStart(3, '0');
  }

  // Draw a frame, or fallback to the nearest available loaded frame
  function renderFrame(targetIdx) {
    targetIdx = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(targetIdx)));

    // Find the best frame to display (target, or closest loaded backwards, or forwards)
    let bestImg = null;
    let bestIdx = -1;

    if (loaded[targetIdx - 1] && images[targetIdx - 1]?.naturalWidth > 0) {
      bestImg = images[targetIdx - 1];
      bestIdx = targetIdx;
    } else {
      // Search backwards first
      for (let i = targetIdx - 1; i >= 1; i--) {
        if (loaded[i - 1] && images[i - 1]?.naturalWidth > 0) {
          bestImg = images[i - 1];
          bestIdx = i;
          break;
        }
      }
      // If none found backwards, search forwards
      if (!bestImg) {
        for (let i = targetIdx + 1; i <= TOTAL_FRAMES; i++) {
          if (loaded[i - 1] && images[i - 1]?.naturalWidth > 0) {
            bestImg = images[i - 1];
            bestIdx = i;
            break;
          }
        }
      }
    }

    if (!bestImg) return false;

    const cw = canvas.width;
    const ch = canvas.height;

    // Fill dark background matching Coke studio backdrop
    ctx.fillStyle = '#050203';
    ctx.fillRect(0, 0, cw, ch);

    const imgW = bestImg.naturalWidth || 1280;
    const imgH = bestImg.naturalHeight || 720;
    const imgRatio = imgW / imgH;
    const canvasRatio = cw / ch;

    let drawW, drawH, ox, oy;

    if (canvasRatio > imgRatio) {
      drawW = cw;
      drawH = cw / imgRatio;
      ox = 0;
      oy = (ch - drawH) / 2;
    } else {
      drawH = ch;
      drawW = ch * imgRatio;
      ox = (cw - drawW) / 2;
      oy = 0;
    }

    ctx.drawImage(bestImg, ox, oy, drawW, drawH);
    lastDrawnFrame = bestIdx;
    return true;
  }

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    lastDrawnFrame = -1;
    renderFrame(currentFrame);
  }

  // Preload all frames with smart fallback
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    const frameNum = i;

    img.onload = () => {
      loaded[frameNum - 1] = true;
      loadedCount++;

      // If this is frame 1 or we are waiting for current frame, render immediately
      if (frameNum === 1 || Math.abs(currentFrame - frameNum) < 2 || lastDrawnFrame === -1) {
        renderFrame(currentFrame);
      }
    };

    img.onerror = () => {
      // Try fallback folder
      if (!img.src.includes('New%20folder') && !img.src.includes('New folder')) {
        img.src = FALLBACK_PREFIX + pad3(frameNum) + FRAME_EXT;
      }
    };

    img.src = PRIMARY_PREFIX + pad3(frameNum) + FRAME_EXT;
    images[i - 1] = img;
  }

  // 60FPS animation loop
  function loop() {
    const delta = targetFrame - currentFrame;
    if (Math.abs(delta) > 0.01) {
      currentFrame += delta * 0.22;
    } else {
      currentFrame = targetFrame;
    }

    const frameToDraw = Math.round(currentFrame);
    if (frameToDraw !== lastDrawnFrame) {
      renderFrame(frameToDraw);
    }

    requestAnimationFrame(loop);
  }

  // Scroll handler
  function onScroll() {
    if (!animSection) return;
    const rect = animSection.getBoundingClientRect();
    const scrollableDistance = animSection.offsetHeight - window.innerHeight;
    if (scrollableDistance <= 0) return;

    // rect.top is 0 at top, negative as you scroll down
    const scrolled = -rect.top;
    const progress = Math.min(1, Math.max(0, scrolled / scrollableDistance));

    targetFrame = 1 + progress * (TOTAL_FRAMES - 1);
  }

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('scroll', onScroll, { passive: true });

  // Initial call
  resizeCanvas();
  onScroll();
  requestAnimationFrame(loop);

})();
