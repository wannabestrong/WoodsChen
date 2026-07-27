/* =========================================
   photos.js — 照片墙网格 + 灯箱
   ========================================= */

const PHOTO_URLS = [
  /* 用户替换为实际照片路径，例如 'img/photos/photo01.jpg' */
];

export function renderPhotos() {
  if (PHOTO_URLS.length === 0) {
    return `
      <div class="card photo-grid">
        ${Array.from({ length: 6 }, (_, i) => `
          <div class="photo-item">
            <div class="photo-placeholder">🖼️</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  return `
    <div class="photo-grid">
      ${PHOTO_URLS.map((url, i) => `
        <div class="photo-item" data-photo-url="${url}" data-photo-index="${i}">
          <img src="${url}" alt="照片 ${i + 1}" loading="lazy"
               onerror="this.style.display='none';this.parentElement.querySelector('.photo-placeholder').style.display='flex'">
          <div class="photo-placeholder" style="display:none">🖼️</div>
        </div>
      `).join('')}
    </div>
  `;
}

export function bindPhotosEvents() {
  /* 点击打开灯箱 */
  document.querySelectorAll('.photo-item').forEach(el => {
    el.addEventListener('click', () => {
      const url = el.dataset.photoUrl;
      if (!url) return;
      openLightbox(url);
    });
  });
}

/* ---- 灯箱 ---- */
function openLightbox(url) {
  /* 禁止滚动 */
  document.body.style.overflow = 'hidden';

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = `<img src="${url}" alt="预览">`;

  function close() {
    overlay.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
  }

  function onKey(e) {
    if (e.key === 'Escape') close();
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', onKey);
  document.body.appendChild(overlay);
}
