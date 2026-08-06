/* =========================================
   router.js — SPA 路由：页面状态管理 + 渲染调度
   ========================================= */

import { renderHome, bindHomeEvents } from './pages/home.js';
import { renderArticle, bindArticleEvents } from './pages/article.js';
import { renderPhotos, bindPhotosEvents } from './pages/photos.js';
import { renderNav } from './components/nav.js';

/* ---- 状态 ---- */
export const TOP_PAGES = ['home', 'photos']; // 首页 → 照片墙 → 首页

export let state = {
  page: 'home',      // 当前顶层页面
  articleId: null,   // 文章详情 ID（null = 非详情视图）
};

/* ---- 页面切换 ---- */
export function navigate(page, data = null) {
  if (page === 'article') {
    state.page = 'article';
    state.articleId = data;
  } else {
    state.page = page;
    state.articleId = null;
  }
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
    default:
      container.innerHTML = renderHome();
      bindHomeEvents();
  }

  /* 卡片渐入动画 */
  requestAnimationFrame(() => {
    container.querySelectorAll('.card').forEach((el, i) => {
      el.style.animationDelay = `${i * 0.05}s`;
      el.classList.add('animate-in');
    });
  });

  /* 文章详情页隐藏底部箭头 */
  const arrow = document.getElementById('scroll-arrow');
  if (arrow) {
    arrow.style.display = (state.page === 'article') ? 'none' : '';
  }

  /* 滚动到顶部 */
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
