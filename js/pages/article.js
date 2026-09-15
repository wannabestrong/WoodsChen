import { store } from '../store.js?v=18';
import { navigate, state } from '../router.js?v=18';
import { renderMarkdown } from '../utils/markdown.js?v=18';
import { icon } from '../components/nav.js?v=18';
import { STATIC_ARTICLES, isLegacyContent } from '../content.js?v=18';

export function renderArticle(articleId) {
  const articles = store.getArticles().filter(article => !isLegacyContent(article.id));
  const cloudArticle = articles.find(article => String(article.id) === String(articleId));
  const staticArticle = STATIC_ARTICLES.find(article => String(article.id) === String(articleId));
  const article = cloudArticle || staticArticle || { title: '文章不存在', date: '' };
  const body = article.content || '';
  const adjacent = getAdjacentArticles(articleId, articles);
  const cover = article.cover_url || '';

  return `<article class="detail-page">
    <button class="detail-back" id="back-to-home" type="button">${icon('arrow-left')}<span>返回${state.returnFilter === 'essay' ? 'Notes' : '归档'}</span></button>
    <header>
      <div class="detail-meta"><span class="detail-type">Essay</span><span>｜</span><time>${escapeHtml((article.date || '').replaceAll('-', '.'))}</time></div>
      <h1 class="detail-title">${escapeHtml(article.title)}</h1>
    </header>
    <hr class="detail-rule">
    <div class="markdown-body">${renderMarkdown(body)}</div>
    ${cover ? `<figure class="article-image"><img src="${escapeHtml(cover)}" alt="${escapeHtml(article.title)}" decoding="async"></figure>` : ''}
    <nav class="detail-pagination" aria-label="文章导航">
      ${renderAdjacentButton(adjacent.previous, 'previous')}
      <button class="archive-return" type="button" data-home>${icon('layout-grid')}<span>回到${state.returnFilter === 'essay' ? 'Notes' : '归档'}</span></button>
      ${renderAdjacentButton(adjacent.next, 'next')}
    </nav>
  </article>`;
}

function getAdjacentArticles(articleId, cloudArticles) {
  const cloudIds = new Set(cloudArticles.map(article => String(article.id)));
  const statics = STATIC_ARTICLES.filter(article => !cloudIds.has(String(article.id)));
  const list = [...cloudArticles, ...statics].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  const index = list.findIndex(article => String(article.id) === String(articleId));
  if (index < 0) return { previous: null, next: null };
  return { previous: list[index - 1] || null, next: list[index + 1] || null };
}

function renderAdjacentButton(article, direction) {
  const className = direction === 'next' ? ' class="next"' : '';
  const label = direction === 'next' ? '下一篇 ›' : '‹ 上一篇';
  if (!article) return `<span class="pagination-spacer" aria-hidden="true"></span>`;
  return `<button${className} type="button" data-open="${escapeHtml(article.id)}"><small>${label}</small>${escapeHtml(article.title)}</button>`;
}

export function bindArticleEvents() {
  const returnTo = () => navigate('home', state.returnFilter || 'all');
  document.getElementById('back-to-home')?.addEventListener('click', returnTo);
  document.querySelector('[data-home]')?.addEventListener('click', returnTo);
  document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => navigate('article', button.dataset.open)));
}

function escapeHtml(value = '') { return String(value).replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]); }
