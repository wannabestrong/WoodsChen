/* =========================================
   router.js — SPA 路由：页面状态管理 + 渲染调度
   ========================================= */

import { renderHome, bindHomeEvents } from './pages/home.js?v=5';
import { renderArticle, bindArticleEvents } from './pages/article.js?v=5';
import { renderPhotos, bindPhotosEvents } from './pages/photos.js?v=5';
import { renderAbout, bindAboutEvents } from './pages/about.js?v=5';
import { renderNav } from './components/nav.js?v=5';

/* ---- 状态 ---- */
export const TOP_PAGES = ['home', 'photos']; // 首页 → 照片墙 → 首页

export let state = {
  page: 'home',      // 当前顶层页面
  articleId: null,   // 文章详情 ID（null = 非详情视图）
  filter: 'all',
};

export function renderFromLocation() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (!hash || hash === 'archive') {
    state.page = 'home'; state.filter = 'all'; state.articleId = null;
  } else if (hash === 'notes') {
    state.page = 'home'; state.filter = 'essay'; state.articleId = null;
  } else if (hash === 'photos') {
    state.page = 'photos'; state.articleId = null;
  } else if (hash === 'about') {
    state.page = 'about'; state.articleId = null;
  } else if (hash.startsWith('essay/')) {
    state.page = 'article'; state.articleId = decodeURIComponent(hash.slice(6));
  }
  render();
}

/* ---- 页面切换 ---- */
export function navigate(page, data = null) {
  if (page === 'article') {
    state.page = 'article';
    state.articleId = data;
  } else if (page === 'home') {
    state.page = 'home';
    state.articleId = null;
    state.filter = data || 'all';
  } else {
    state.page = page;
    state.articleId = null;
  }
  const hash = state.page === 'home' ? (state.filter === 'essay' ? 'notes' : 'archive') : state.page === 'article' ? `essay/${encodeURIComponent(state.articleId)}` : state.page;
  history.pushState(null, '', `#/${hash}`);
  render();
}

/* ---- 渲染 ---- */
export function render() {
  renderNav();

  const container = document.getElementById('content');
  if (!container) return;

  switch (state.page) {
    case 'home':
      container.innerHTML = renderHome();
      bindHomeEvents();
      break;
    case 'article':
      container.innerHTML = renderArticle(state.articleId);
      bindArticleEvents();
      break;
    case 'photos':
      container.innerHTML = renderPhotos();
      bindPhotosEvents();
      break;
    case 'about':
      container.innerHTML = renderAbout();
      bindAboutEvents();
      break;
    default:
      container.innerHTML = renderHome();
      bindHomeEvents();
  }

  /* 卡片渐入动画 */
  requestAnimationFrame(() => {
    if (window.lucide) window.lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
  });

  /* 文章详情页隐藏底部箭头 */
  const arrow = document.getElementById('scroll-arrow');
  if (arrow) {
    arrow.style.display = (state.page === 'article') ? 'none' : '';
  }

  /* 滚动到顶部 */
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

/* ---- 底部箭头页面切换 ---- */
export function arrowNext() {
  const idx = TOP_PAGES.indexOf(state.page);
  if (idx === -1) return; // 文章详情页不参与
  const next = TOP_PAGES[(idx + 1) % TOP_PAGES.length];
  navigate(next);
}

export function arrowPrev() {
  const idx = TOP_PAGES.indexOf(state.page);
  if (idx === -1) return;
  const prev = TOP_PAGES[(idx - 1 + TOP_PAGES.length) % TOP_PAGES.length];
  navigate(prev);
}
