/* =========================================
   nav.js — 顶部导航栏组件
   ========================================= */

import { state, navigate, render } from '../router.js';

const LINKS = [
  { page: 'home',  label: '首页', icon: '🏠' },
  { page: 'home',  label: '文章', icon: '📄' },
  { page: 'photos', label: '照片墙', icon: '🖼️' },
  { page: 'guestbook', label: '留言板', icon: '✉️' },
];

export function renderNav() {
  const nav = document.getElementById('top-nav');
  if (!nav) return;

  /* 判断当前激活的导航项 */
  let active = state.page;
  if (state.page === 'article') active = 'home'; // 详情页高亮"首页"

  nav.innerHTML = `
    <div class="nav-inner">
      <span class="nav-brand">ForestChen</span>
      <div class="nav-links">
        ${LINKS.map(l => `
          <span class="nav-link${active === l.page ? ' active' : ''}"
                data-page="${l.page}">
            ${l.icon} ${l.label}
          </span>
        `).join('')}
      </div>
    </div>
  `;

  nav.querySelectorAll('.nav-link').forEach(el => {
    el.addEventListener('click', () => {
      const page = el.dataset.page;
      /* "首页"和"文章"都切到首页，但"文章"滚动到文章列表 */
      if (page === 'home') {
        navigate('home');
        /* 如果点击的是"文章"标签，滚动到文章列表区 */
        if (el.textContent.includes('文章')) {
          setTimeout(() => {
            const list = document.getElementById('article-list');
            if (list) list.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      } else {
        navigate(page);
      }
    });
  });
}

/* ---- 滚动时导航栏底部加线 ---- */
let navHasLine = false;
window.addEventListener('scroll', () => {
  const nav = document.getElementById('top-nav');
  if (!nav) return;
  const scrolled = window.scrollY > 10;
  if (scrolled !== navHasLine) {
    navHasLine = scrolled;
    nav.classList.toggle('scrolled', scrolled);
  }
});
