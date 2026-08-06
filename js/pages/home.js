/* =========================================
   home.js — 首页渲染
   ========================================= */

import { store } from '../store.js';
import { navigate } from '../router.js';

export function renderHome() {
  const articles = store.getArticles();
  const likes = store.getLikes();
  const comments = store.getComments();
  const searchTerm = ''; // 搜索词由事件处理接管

  return `
    <!-- 顶部双列 -->
    <div class="home-top-row">
      <div class="card announcement">
        <div class="announce-title">📢 公告栏</div>
        <p>欢迎来到我的个人网站，这里记录生活与思考。<br>愿你在这里有所发现。</p>
      </div>
      <div class="card search-box">
        <input type="text" id="search-input" placeholder="🔍 搜索文章..." autocomplete="off">
        <div class="search-hint" id="search-hint"></div>
      </div>
    </div>

    <!-- 导航卡片 -->
    <div class="card nav-card">
      ${renderNavRows()}
    </div>

    <!-- 个人信息 -->
    <div class="card profile-card">
      <img class="avatar"
           src="img/avatar.png"
           alt="头像"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
           loading="lazy">
      <div class="avatar-placeholder" style="display:none">👤</div>
      <div class="profile-name">ForestChen</div>
      <div class="profile-bio">"抱紧我 再抱紧我"</div>
      <div class="profile-count">共发表了 <strong>${articles.length}</strong> 篇文章</div>
    </div>

    <!-- 文章列表 -->
    <div id="article-list">
      ${articles.length === 0
        ? '<div class="empty-state">还没有文章，敬请期待</div>'
        : articles
            .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
            .map(a => renderArticleCard(a, likes, comments))
            .join('')}
    </div>
  `;
}

function renderNavRows() {
  const pages = [
    { page: 'home',  icon: '🏠', label: '首页' },
    { page: 'home',  icon: '📄', label: '文章列表' },
    { page: 'photos', icon: '🖼️', label: '照片墙' },
  ];

  return pages.map(p => `
    <div class="nav-row active" data-nav="${p.page}">
      <span class="nav-icon">${p.icon}</span> ${p.label}
    </div>
  `).join('');
}

function renderArticleCard(article, likes, comments) {
  const likeCount = likes[article.id] || 0;
  const commentCount = (comments[article.id] || []).length;
  const summary = (article.summary || article.content || '')
    .replace(/[#*`>\[\]!()|~]/g, '')
    .replace(/\n/g, ' ')
    .substring(0, 100);

  return `
    <div class="card article-item animate-in" data-article-id="${article.id}">
      <div class="article-title">${escapeHtml(article.title)}</div>
      <div class="article-meta">
        <span class="article-date">${article.date || ''}</span>
      </div>
      <div class="article-summary">${escapeHtml(summary)}${summary.length >= 100 ? '...' : ''}</div>
      <div class="article-stats">
        <span>❤️ ${likeCount}</span>
        <span>💬 ${commentCount}</span>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ---- 事件绑定（由 router 在渲染后调用） ---- */
export function bindHomeEvents() {
  /* 搜索过滤 */
  const input = document.getElementById('search-input');
  const hint = document.getElementById('search-hint');
  if (input) {
    input.addEventListener('input', () => {
      const term = input.value.toLowerCase().trim();
      const articles = store.getArticles();
      let visible = 0;

      document.querySelectorAll('.article-item').forEach(el => {
        const title = (el.querySelector('.article-title')?.textContent || '').toLowerCase();
        const summary = (el.querySelector('.article-summary')?.textContent || '').toLowerCase();
        const match = !term || title.includes(term) || summary.includes(term);
        el.style.display = match ? '' : 'none';
        if (match) visible++;
      });

      /* 空状态提示 */
      const list = document.getElementById('article-list');
      const existingEmpty = list?.querySelector('.empty-state');
      if (term && visible === 0 && articles.length > 0) {
        if (!existingEmpty) {
          const div = document.createElement('div');
          div.className = 'empty-state';
          div.textContent = '没有匹配的文章';
          list?.appendChild(div);
        }
      } else if (existingEmpty && existingEmpty.textContent === '没有匹配的文章') {
        existingEmpty.remove();
      }

      if (hint) hint.textContent = term ? `找到 ${visible} 篇` : '';
    });
  }

  /* 文章卡片点击 */
  document.querySelectorAll('.article-item').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.articleId;
      if (id) navigate('article', id);
    });
  });

  /* 导航卡片点击 */
  document.querySelectorAll('.nav-card .nav-row').forEach(el => {
    el.addEventListener('click', () => {
      const page = el.dataset.nav;
      if (page) navigate(page);
    });
  });
}
