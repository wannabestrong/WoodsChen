import { store } from '../store.js?v=18';
import { navigate, renderFromLocation, state } from '../router.js?v=18';
import { icon } from '../components/nav.js?v=18';
import { bindIdentityNavigation, renderIdentityPanel } from '../components/identity.js?v=18';
import { STATIC_ARTICLES, isLegacyContent } from '../content.js?v=18';

let activeSearchHandler = null;
let cleanupSearchInteractions = () => {};

function cloudItems() {
  return store.getArticles().filter(article => !isLegacyContent(article.id)).map((article, index) => ({
    ...article,
    id: article.id,
    type: 'essay',
    image: article.cover_url || '',
    size: index % 2 ? 'medium' : 'wide',
    date: (article.date || '').replaceAll('-', '.'),
    cloud: true,
  }));
}

function cloudPhotoItems() {
  return store.getPhotoStories().filter(story => !isLegacyContent(story.id)).map((story, index) => ({
    id: story.id,
    type: 'photo',
    title: story.title,
    place: story.place || '',
    date: (story.date || '').replaceAll('-', '.'),
    image: story.cover_url || '',
    size: index === 0 ? 'hero' : index % 3 === 0 ? 'wide' : 'medium',
    cloud: true,
  }));
}

function items() {
  const cloud = [...cloudItems(), ...cloudPhotoItems()];
  const cloudIds = new Set(cloud.map(item => String(item.id)));
  const staticItems = STATIC_ARTICLES
    .filter(article => !cloudIds.has(String(article.id)))
    .map((article, index) => ({
      ...article,
      type: 'essay',
      image: article.cover_url || '',
      size: index % 2 ? 'medium' : 'wide',
      date: (article.date || '').replaceAll('-', '.'),
    }));
  return [...cloud, ...staticItems].sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

export function renderHome() {
  const allItems = items();
  const currentFilter = state.filter || 'all';
  const filtered = currentFilter === 'all' ? allItems : allItems.filter(item => item.type === currentFilter);
  return `
    <div class="archive-shell">
      ${renderIdentityPanel({ activePage: 'home', activeFilter: currentFilter })}

      <section class="archive-main" aria-labelledby="archive-title">
        <header class="archive-heading">
          <h1 id="archive-title">${currentFilter === 'essay' ? 'Notes' : 'Archive'}</h1>
          <span class="archive-count">${filtered.length}</span>
          <div class="archive-actions"><button class="view-all" type="button" data-filter="all">View all →</button></div>
        </header>
        <div class="archive-grid" id="archive-grid">
          ${filtered.map(renderCard).join('')}
        </div>
      </section>

      <aside class="others-column" aria-label="Others">
        ${renderRecent(allItems)}
        ${renderStats(allItems)}
        ${renderCalendar()}
      </aside>
    </div>
    <div class="search-overlay" id="search-overlay" hidden>
      <div class="search-panel" role="search">
        <label class="sr-only" for="archive-search">搜索 Archive</label>
        <input id="archive-search" type="search" placeholder="搜索标题、地点或日期" autocomplete="off">
        <button class="search-close" type="button" aria-label="关闭搜索">${icon('x')}</button>
      </div>
    </div>`;
}

function renderCard(item) {
  return `<article class="archive-card ${item.size || 'medium'}" tabindex="0" data-id="${escapeHtml(item.id)}" data-type="${item.type}" data-search="${escapeHtml(`${item.title} ${item.place || ''} ${item.date || ''}`.toLowerCase())}">
    <div class="archive-media${item.image ? '' : ' archive-media-empty'}">${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async">` : '<span aria-hidden="true"></span>'}</div>
    <span class="archive-kind ${item.type}">${item.type}</span>
    <div class="archive-card-text"><h2>${escapeHtml(item.title)}</h2><div class="archive-meta">${item.place ? `${escapeHtml(item.place)} · ` : ''}${escapeHtml(item.date || '')}</div></div>
  </article>`;
}

function renderRecent(allItems) {
  return `<section class="side-widget"><h2>Recent</h2><div class="recent-list">${allItems.slice(0, 4).map(item => `<div class="recent-item"><span class="recent-date">${item.date.slice(5)}</span><span class="recent-dot"></span><span class="recent-copy">发布${item.type === 'essay' ? '文章' : '摄影集'}<br>《${escapeHtml(item.title)}》</span></div>`).join('')}</div><button class="more-link view-all" type="button" data-filter="all">More →</button></section>`;
}

function renderStats(allItems) {
  const essayCount = allItems.filter(item => item.type === 'essay').length;
  const photoCount = allItems.filter(item => item.type === 'photo').length;
  return `<section class="side-widget"><h2>Statistics</h2><div class="stat-list"><div class="stat-row"><span class="stat-icon">${icon('file-text')}</span><span>文章</span><strong class="stat-value">${essayCount}</strong></div><div class="stat-row"><span class="stat-icon">${icon('images')}</span><span>摄影集</span><strong class="stat-value">${photoCount}</strong></div><div class="stat-row"><span class="stat-icon">${icon('clock-3')}</span><span>记录天数</span><strong class="stat-value">${recordingDays()}</strong></div></div></section>`;
}

function recordingDays(now = new Date()) {
  const start = Date.UTC(2026, 8, 10);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.floor((today - start) / 86400000) + 1);
}

function renderCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const blanks = Array.from({ length: firstDay }, () => '<span></span>').join('');
  const days = Array.from({ length: daysInMonth }, (_, index) => `<span class="${index + 1 === now.getDate() ? 'active' : ''}">${index + 1}</span>`).join('');
  return `<section class="side-widget"><div class="calendar-head">${now.toLocaleString('en-US', { month: 'long' })} ${year}</div><div class="calendar-grid"><span class="weekday">M</span><span class="weekday">T</span><span class="weekday">W</span><span class="weekday">T</span><span class="weekday">F</span><span class="weekday">S</span><span class="weekday">S</span>${blanks}${days}</div></section>`;
}

export function bindHomeEvents() {
  cleanupSearchInteractions();
  const applyFilter = filter => { state.filter = filter; navigate('home', filter); };
  bindIdentityNavigation(navigate);
  document.querySelectorAll('.view-all[data-filter]').forEach(button => {
    button.addEventListener('click', () => applyFilter(button.dataset.filter));
  });
  document.querySelectorAll('.archive-card').forEach(card => {
    const open = () => navigate(card.dataset.type === 'photo' ? 'photos' : 'article', card.dataset.id);
    card.addEventListener('click', open);
    card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
  });

  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('archive-search');
  if (activeSearchHandler) window.removeEventListener('open:search', activeSearchHandler);
  activeSearchHandler = () => {
    if (!overlay) return;
    overlay.hidden = !overlay.hidden;
    if (!overlay.hidden) input?.focus();
  };
  window.addEventListener('open:search', activeSearchHandler);
  const closeSearch = () => {
    if (overlay) overlay.hidden = true;
    let returnHash = null;
    try { returnHash = sessionStorage.getItem('fc_search_return_hash'); sessionStorage.removeItem('fc_search_return_hash'); } catch {}
    if (returnHash) {
      history.pushState(null, '', returnHash);
      renderFromLocation();
    }
  };
  const onOverlayClick = event => { if (event.target === overlay) closeSearch(); };
  const onSearchKeyDown = event => { if (event.key === 'Escape' && !overlay?.hidden) closeSearch(); };
  overlay?.addEventListener('click', onOverlayClick);
  overlay?.querySelector('.search-close')?.addEventListener('click', closeSearch);
  document.addEventListener('keydown', onSearchKeyDown);
  cleanupSearchInteractions = () => {
    if (activeSearchHandler) window.removeEventListener('open:search', activeSearchHandler);
    document.removeEventListener('keydown', onSearchKeyDown);
  };
  input?.addEventListener('input', () => {
    const term = input.value.trim().toLowerCase();
    document.querySelectorAll('.archive-card').forEach(card => { card.hidden = term && !card.dataset.search.includes(term); });
  });
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]);
}
