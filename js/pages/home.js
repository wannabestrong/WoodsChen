import { store } from '../store.js?v=10';
import { navigate, state } from '../router.js?v=10';
import { icon } from '../components/nav.js?v=10';

const DEMO_ITEMS = [
  { id: 'rain-city', type: 'photo', title: '雨后的城市', place: 'Shanghai', date: '2026.08.06', image: 'assets/archive/rain-city-cover.png', size: 'wide' },
  { id: 'loneliness', type: 'essay', title: '关于孤独的十个片段', date: '2026.08.01', image: 'assets/archive/loneliness-cover.png', size: 'wide' },
  { id: 'mountain-lake', type: 'photo', title: '山与湖的对话', place: 'Dali', date: '2026.07.28', image: 'assets/archive/mountain-lake-cover.png', size: 'hero' },
  { id: 'future-self', type: 'essay', title: '写给未来的自己', date: '2026.07.25', image: 'assets/archive/future-self-cover.png', size: 'tall' },
  { id: 'dusk-tram', type: 'photo', title: '黄昏电车', place: 'Chongqing', date: '2026.07.18', image: 'assets/archive/dusk-tram-cover.png', size: 'medium' },
  { id: 'unfinished-thoughts', type: 'essay', title: '一些不成文的想法', date: '2026.07.12', image: 'assets/archive/unfinished-thoughts-cover.png', size: 'medium' },
  { id: 'seaside-evening', type: 'photo', title: '海边的傍晚', place: 'Xiamen', date: '2026.07.05', image: 'assets/archive/seaside-evening-cover.png', size: 'medium' },
  { id: 'window-light', type: 'photo', title: '窗边的光影', place: 'Beijing', date: '2026.06.21', image: 'assets/archive/window-light-cover.png', size: 'wide' },
];

let activeSearchHandler = null;
let cleanupSearchInteractions = () => {};

function cloudItems() {
  return store.getArticles().map((article, index) => ({
    ...article,
    id: article.id,
    type: 'essay',
    image: article.cover_url || DEMO_ITEMS.filter(item => item.type === 'essay')[index % 3].image,
    size: index % 2 ? 'medium' : 'wide',
    date: (article.date || '').replaceAll('-', '.'),
    cloud: true,
  }));
}

function cloudPhotoItems() {
  return store.getPhotoStories().map((story, index) => ({
    id: story.id,
    type: 'photo',
    title: story.title,
    place: story.place || '',
    date: (story.date || '').replaceAll('-', '.'),
    image: story.cover_url || DEMO_ITEMS.filter(item => item.type === 'photo')[index % 5].image,
    size: index === 0 ? 'hero' : index % 3 === 0 ? 'wide' : 'medium',
    cloud: true,
  }));
}

function items() {
  const cloud = [...cloudItems(), ...cloudPhotoItems()].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  if (!cloud.length) return DEMO_ITEMS;
  const ids = new Set(cloud.map(item => item.id));
  return [...cloud, ...DEMO_ITEMS.filter(item => !ids.has(item.id))].slice(0, 8);
}

export function renderHome() {
  const allItems = items();
  const currentFilter = state.filter || 'all';
  const filtered = currentFilter === 'all' ? allItems : allItems.filter(item => item.type === currentFilter);
  return `
    <div class="archive-shell">
      <aside class="identity-panel" aria-label="Identity">
        <h2 class="identity-title">OPEN</h2>
        <div class="identity-avatar"><img src="assets/avatar/avatar-replace-later.png" alt="匿名头像占位图"></div>
        <div>
          <p class="identity-statement">记录文字<br>保存瞬间</p>
          <p class="identity-note">生活是自己的感受，<br>而不是别人的看法。</p>
        </div>
        <nav class="identity-nav" aria-label="Archive 分类">
          <button class="${currentFilter === 'all' ? 'active' : ''}" type="button" data-filter="all">${icon('archive')}<span>Archive</span></button>
          <button class="${currentFilter === 'essay' ? 'active' : ''}" type="button" data-filter="essay">${icon('file-text')}<span>Notes</span></button>
          <button type="button" data-page="photos">${icon('image')}<span>Photos</span></button>
          <button type="button" data-page="about">${icon('user-round')}<span>About</span></button>
        </nav>
        <footer class="identity-footer">
          <div class="social-row">
            <a class="social-link" href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub">${icon('github')}</a>
            <a class="social-link" href="#" aria-label="Instagram">${icon('instagram')}</a>
            <a class="social-link" href="mailto:hello@example.com" aria-label="Email">${icon('mail')}</a>
            <a class="social-link" href="#" aria-label="RSS">${icon('rss')}</a>
          </div>
          <p class="copyright">© 2026 OPEN<br>Made with care</p>
        </footer>
      </aside>

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
        ${renderMusic()}
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
    <div class="archive-media"><img src="${item.image}" alt="${escapeHtml(item.title)}" loading="lazy"></div>
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
  return `<section class="side-widget"><h2>Statistics</h2><div class="stat-list"><div class="stat-row"><span class="stat-icon">${icon('file-text')}</span><span>文章</span><strong class="stat-value">${essayCount}</strong></div><div class="stat-row"><span class="stat-icon">${icon('images')}</span><span>摄影集</span><strong class="stat-value">${photoCount}</strong></div><div class="stat-row"><span class="stat-icon">${icon('clock-3')}</span><span>记录天数</span><strong class="stat-value">542</strong></div></div></section>`;
}

function renderCalendar() {
  const blanks = Array.from({ length: 5 }, () => '<span></span>').join('');
  const days = Array.from({ length: 31 }, (_, index) => `<span class="${index + 1 === 6 ? 'active' : ''}">${index + 1}</span>`).join('');
  return `<section class="side-widget"><div class="calendar-head">August 2026</div><div class="calendar-grid"><span class="weekday">M</span><span class="weekday">T</span><span class="weekday">W</span><span class="weekday">T</span><span class="weekday">F</span><span class="weekday">S</span><span class="weekday">S</span>${blanks}${days}</div></section>`;
}

function renderMusic() {
  return `<section class="side-widget music-widget"><h2>Music</h2><div class="music-row"><img class="music-cover" src="assets/music/music-cover.png" alt="夜海灯塔音乐封面占位图"><div><p class="music-title">Night Train</p><p class="music-artist">Audio pending</p><div class="music-controls"><button type="button" disabled aria-label="上一首">${icon('skip-back')}</button><button class="play" type="button" disabled aria-label="音源暂不可用">${icon('play')}</button><button type="button" disabled aria-label="下一首">${icon('skip-forward')}</button></div></div></div><p class="music-unavailable">音源将在获得授权后启用</p></section>`;
}

export function bindHomeEvents() {
  cleanupSearchInteractions();
  const applyFilter = filter => { state.filter = filter; navigate('home', filter); };
  document.querySelectorAll('.identity-nav [data-filter], .view-all[data-filter]').forEach(button => {
    button.addEventListener('click', () => applyFilter(button.dataset.filter));
  });
  document.querySelectorAll('.identity-nav [data-page]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.page)));
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
  const closeSearch = () => { if (overlay) overlay.hidden = true; };
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
