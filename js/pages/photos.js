import { navigate } from '../router.js?v=6';
import { icon } from '../components/nav.js?v=6';

export function renderPhotos() {
  return `<article class="photo-story">
    <button class="detail-back" id="back-to-home" type="button">${icon('arrow-left')}<span>返回归档</span></button>
    <header class="photo-story-header"><span class="detail-type">Photo</span><h1 class="photo-story-title">山与湖的对话</h1><p class="photo-story-meta">Dali · 2026.07.28</p></header>
    <figure class="photo-cover"><img src="assets/archive/mountain-lake-cover.png" alt="雾中的山与湖"></figure>
    <section class="story-section"><h2>序列预览</h2><div class="photo-sequence">
      <figure class="photo-frame landscape" tabindex="0"><img src="assets/archive/mountain-range-gallery.png" alt="冷水边的雪山山脉"></figure>
      <figure class="photo-frame portrait" tabindex="0"><img src="assets/archive/forest-path-gallery.png" alt="雨后森林中的小径"></figure>
    </div></section>
    <section class="story-section"><h2>创作说明</h2><p class="creation-note">这些图片目前是经过审核的视觉占位素材，用于确定摄影叙事的比例、节奏与移动端顺序；正式发布前应替换为拥有来源与使用权的真实作品。</p></section>
  </article>`;
}

export function bindPhotosEvents() {
  document.getElementById('back-to-home')?.addEventListener('click', () => navigate('home'));
  document.querySelectorAll('.photo-frame').forEach(frame => {
    const open = () => openLightbox(frame.querySelector('img').src, frame.querySelector('img').alt);
    frame.addEventListener('click', open);
    frame.addEventListener('keydown', event => { if (event.key === 'Enter') open(); });
  });
}

function openLightbox(url, alt) {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', '图片预览');
  overlay.innerHTML = `<img src="${url}" alt="${alt}">`;
  const close = () => { overlay.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = event => { if (event.key === 'Escape') close(); };
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', onKey);
  document.body.appendChild(overlay);
}
