import { navigate } from '../router.js?v=9';
import { icon } from '../components/nav.js?v=9';
import { store } from '../store.js?v=9';

const PHOTO_STORIES = {
  'mountain-lake': {
    title: '山与湖的对话', place: 'Dali', date: '2026.07.28',
    cover: 'assets/archive/mountain-lake-cover.png',
    gallery: [
      ['assets/archive/mountain-range-gallery.png', '冷水边的雪山山脉', 'landscape'],
      ['assets/archive/forest-path-gallery.png', '雨后森林中的小径', 'portrait'],
    ],
    note: '这些图片目前是经过审核的视觉占位素材，用于确定摄影叙事的比例、节奏与移动端顺序；正式发布前应替换为拥有来源与使用权的真实作品。'
  },
  'rain-city': {
    title: '雨后的城市', place: 'Shanghai', date: '2026.08.06',
    cover: 'assets/archive/rain-city-cover.png', gallery: [],
    note: '摄影集内容尚未补齐，当前先展示封面占位素材。'
  },
  'dusk-tram': {
    title: '黄昏电车', place: 'Chongqing', date: '2026.07.18',
    cover: 'assets/archive/dusk-tram-cover.png', gallery: [],
    note: '摄影集内容尚未补齐，当前先展示封面占位素材。'
  },
  'seaside-evening': {
    title: '海边的傍晚', place: 'Xiamen', date: '2026.07.05',
    cover: 'assets/archive/seaside-evening-cover.png', gallery: [],
    note: '摄影集内容尚未补齐，当前先展示封面占位素材。'
  },
  'window-light': {
    title: '窗边的光影', place: 'Beijing', date: '2026.06.21',
    cover: 'assets/archive/window-light-cover.png', gallery: [],
    note: '摄影集内容尚未补齐，当前先展示封面占位素材。'
  }
};

export function renderPhotos(storyId = 'mountain-lake') {
  const cloudStory = store.getPhotoStories().find(item => String(item.id) === String(storyId));
  const story = cloudStory ? {
    title: cloudStory.title,
    place: cloudStory.place || '',
    date: cloudStory.date || '',
    cover: cloudStory.cover_url || '',
    gallery: (cloudStory.images || []).map(image => [image.url || image.src, image.alt || cloudStory.title, image.orientation || 'landscape']),
    note: cloudStory.description || cloudStory.summary || '',
  } : (PHOTO_STORIES[storyId] || PHOTO_STORIES['mountain-lake']);
  return `<article class="photo-story">
    <button class="detail-back" id="back-to-home" type="button">${icon('arrow-left')}<span>返回归档</span></button>
    <header class="photo-story-header"><span class="detail-type">Photo</span><h1 class="photo-story-title">${escapeHtml(story.title)}</h1><p class="photo-story-meta">${escapeHtml(story.place)} · ${escapeHtml(story.date)}</p></header>
    <figure class="photo-cover"><img src="${story.cover}" alt="${escapeHtml(story.title)}"></figure>
    <section class="story-section"><h2>序列预览</h2><div class="photo-sequence">
      ${story.gallery.map(([src, alt, orientation]) => `<figure class="photo-frame ${orientation}" tabindex="0"><img src="${src}" alt="${escapeHtml(alt)}"></figure>`).join('')}
    </div></section>
    <section class="story-section"><h2>创作说明</h2><p class="creation-note">${escapeHtml(story.note)}</p></section>
  </article>`;
}

function escapeHtml(value = '') { return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }

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
