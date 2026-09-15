/* =========================================
   app.js — 主入口：初始化 + 全局事件 + 底部翻页箭头
   ========================================= */

import { state, render, renderFromLocation, arrowNext, arrowPrev } from './router.js?v=20';
import { initSupabase } from './supabase.js?v=20';

/* ---- 初始化 ---- */
document.addEventListener('DOMContentLoaded', () => {
  renderFromLocation();
  setupScrollArrow();
  // 先完成首屏，再在浏览器空闲时同步云端内容，避免网络请求阻塞首次交互。
  const sync = () => initSupabase();
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(sync, { timeout: 1500 });
  } else {
    window.setTimeout(sync, 0);
  }
});

window.addEventListener('popstate', renderFromLocation);

/* ---- 云端文章更新后重新渲染 ---- */
window.addEventListener('fc:articles-updated', () => {
  if (state.page !== 'admin') render();
});

/* ---- 底部翻页箭头 ---- */
function setupScrollArrow() {
  const arrow = document.getElementById('scroll-arrow');
  if (!arrow) return;

  /* hover + 滚轮切换 */
  arrow.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      arrowNext();
    } else {
      arrowPrev();
    }
  });

  arrow.addEventListener('click', arrowNext);

  arrow.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') arrowNext();
    if (event.key === 'ArrowUp') arrowPrev();
  });
}
