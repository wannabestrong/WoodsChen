/* =========================================
   app.js — 主入口：初始化 + 全局事件 + 底部翻页箭头
   ========================================= */

import { state, render, arrowNext, arrowPrev } from './router.js';

/* ---- 初始化 ---- */
document.addEventListener('DOMContentLoaded', () => {
  render();
  setupScrollArrow();
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

  /* 移动端双击切换 */
  let tapTimer = null;
  arrow.addEventListener('click', () => {
    if (tapTimer) {
      clearTimeout(tapTimer);
      tapTimer = null;
      arrowNext();
    } else {
      tapTimer = setTimeout(() => { tapTimer = null; }, 300);
    }
  });
}
