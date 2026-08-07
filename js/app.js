/* =========================================
   app.js — 主入口：初始化 + 全局事件 + 底部翻页箭头
   ========================================= */

import { state, render, renderFromLocation, arrowNext, arrowPrev } from './router.js?v=5';
import { initSupabase } from './supabase.js?v=5';

/* ---- 初始化 ---- */
document.addEventListener('DOMContentLoaded', () => {
  renderFromLocation();
  setupScrollArrow();
  initSupabase();
});

window.addEventListener('popstate', renderFromLocation);

/* ---- 云端文章更新后重新渲染 ---- */
window.addEventListener('fc:articles-updated', () => {
  render();
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
