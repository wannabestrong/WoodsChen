import { navigate, state } from '../router.js?v=14';
import { icon } from '../components/nav.js?v=14';
import { store } from '../store.js?v=14';
import { isLegacyContent } from '../content.js?v=14';

function stories() {
  return store.getPhotoStories().filter(item => !isLegacyContent(item.id)).map(item => ({
    id: item.id, title: item.title, place: item.place || '', date: item.date || '',
    cover: item.cover_url || '',
    gallery: (item.images || []).map(image => [image.url || image.src, image.alt || item.title, image.orientation || 'landscape']),
    note: item.description || item.summary || '',
  })).sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

export function renderPhotos(storyId = null) {
  if (!storyId) return renderPhotoIndex();
  const cloudStory = store.getPhotoStories().find(item => String(item.id) === String(storyId));
  const story = cloudStory ? {
    title: cloudStory.title,
    place: cloudStory.place || '',
    date: cloudStory.date || '',
    cover: cloudStory.cover_url || '',
    gallery: (cloudStory.images || []).map(image => [image.url || image.src, image.alt || cloudStory.title, image.orientation || 'landscape']),
    note: cloudStory.description || cloudStory.summary || '',
  } : null;
  if (!story) return renderPhotoIndex();
  return `<article class="photo-story">
    <button class="detail-back" id="back-to-home" type="button">${icon('arrow-left')}<span>返回${state.returnPage === 'photos' ? '摄影集' : '归档'}</span></button>
    <header class="photo-story-header"><span class="detail-type">Photo</span><h1 class="photo-story-title">${escapeHtml(story.title)}</h1><p class="photo-story-meta">${escapeHtml(story.place)} · ${escapeHtml(story.date)}</p></header>
    ${story.cover ? `<figure class="photo-cover"><img src="${escapeHtml(story.cover)}" alt="${escapeHtml(story.title)}" decoding="async"></figure>` : ''}
    <section class="story-section"><h2>序列预览</h2><div class="photo-sequence">
      ${story.gallery.map(([src, alt, orientation]) => `<figure class="photo-frame ${orientation === 'portrait' ? 'portrait' : 'landscape'}" tabindex="0"><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async"></figure>`).join('')}
    </div></section>
    <section class="story-section"><h2>创作说明</h2><p class="creation-note">${escapeHtml(story.note)}</p></section>
  </article>`;
}

function renderPhotoIndex() {
  const photoStories = stories();
  return `<section class="photo-index" aria-labelledby="photo-index-title">
    <header class="photo-index-header"><span class="detail-type">Photo Archive</span><h1 id="photo-index-title">Photos</h1><p>摄影集</p></header>
    <div class="photo-index-grid">${photoStories.length ? photoStories.map(story => `<article class="photo-index-card" tabindex="0" data-story="${escapeHtml(story.id)}">
      <div class="photo-index-cover"><img src="${escapeHtml(story.cover)}" alt="${escapeHtml(story.title)}" loading="lazy"></div>
      <div class="photo-index-copy"><h2>${escapeHtml(story.title)}</h2><p>${escapeHtml(story.place)} · ${escapeHtml(story.date)}</p></div>
    </article>`).join('') : '<p class="photo-index-empty">还没有摄影集。</p>'}</div>
  </section>`;
}

function escapeHtml(value = '') { return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }

export function bindPhotosEvents() {
  document.getElementById('back-to-home')?.addEventListener('click', () => navigate(state.returnPage === 'photos' ? 'photos' : 'home', state.returnPage === 'photos' ? null : 'all'));
  document.querySelectorAll('[data-story]').forEach(card => {
    const open = () => navigate('photos', card.dataset.story);
    card.addEventListener('click', open);
    card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
  });
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
  const image = document.createElement('img');
  image.src = url;
  image.alt = alt;
  overlay.appendChild(image);
  const close = () => { overlay.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = event => { if (event.key === 'Escape') close(); };
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', onKey);
  document.body.appendChild(overlay);
}
