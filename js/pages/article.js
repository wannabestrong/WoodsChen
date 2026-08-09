import { store } from '../store.js?v=13';
import { navigate, state } from '../router.js?v=13';
import { renderMarkdown } from '../utils/markdown.js?v=13';
import { icon } from '../components/nav.js?v=13';

const DEMO_ESSAYS = {
  loneliness: { title: '关于孤独的十个片段', date: '2026.08.01' },
  'future-self': { title: '写给未来的自己', date: '2026.07.25' },
  'unfinished-thoughts': { title: '一些不成文的想法', date: '2026.07.12' },
};

const PLACEHOLDER = `有些感受并不急着抵达结论。它们停留在日常的缝隙里，随着光线、天气和一次短暂的停顿，慢慢显出轮廓。

这里暂时使用排版占位内容。正式发布时，正文将从 Supabase 中读取，并保留原有 Markdown 结构、段落节奏和图片位置。

记录并不是为了给每件事命名，而是保存那些尚未完成的理解。`;

export function renderArticle(articleId) {
  const articles = store.getArticles();
  const cloudArticle = articles.find(article => String(article.id) === String(articleId));
  const demo = DEMO_ESSAYS[articleId];
  const article = cloudArticle || demo || { title: '文章标题', date: '2026.08.01' };
  const body = cloudArticle?.content || PLACEHOLDER;
  const adjacent = getAdjacentArticles(articleId, articles);
  const cover = cloudArticle?.cover_url || 'assets/archive/rain-city-cover.png';

  return `<article class="detail-page">
    <button class="detail-back" id="back-to-home" type="button">${icon('arrow-left')}<span>返回${state.returnFilter === 'essay' ? 'Notes' : '归档'}</span></button>
    <header>
      <div class="detail-meta"><span class="detail-type">Essay</span><span>｜</span><time>${escapeHtml((article.date || '').replaceAll('-', '.'))}</time></div>
      <h1 class="detail-title">${escapeHtml(article.title)}</h1>
    </header>
    <hr class="detail-rule">
    <div class="markdown-body">${renderMarkdown(body)}</div>
    <figure class="article-image"><img src="${escapeHtml(cover)}" alt="${escapeHtml(article.title)}"></figure>
    ${cloudArticle?.cover_url ? '' : '<p class="article-caption">生成的视觉占位素材，待真实作品替换。</p>'}
    <nav class="detail-pagination" aria-label="文章导航">
      ${renderAdjacentButton(adjacent.previous, 'previous')}
      <button class="archive-return" type="button" data-home>${icon('layout-grid')}<span>回到${state.returnFilter === 'essay' ? 'Notes' : '归档'}</span></button>
      ${renderAdjacentButton(adjacent.next, 'next')}
    </nav>
  </article>`;
}

function getAdjacentArticles(articleId, cloudArticles) {
  const cloudIds = new Set(cloudArticles.map(article => String(article.id)));
  const demos = Object.entries(DEMO_ESSAYS).filter(([id]) => !cloudIds.has(id)).map(([id, article]) => ({ id, ...article }));
  const list = [...cloudArticles, ...demos].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
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
