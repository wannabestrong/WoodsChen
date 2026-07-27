/* =========================================
   article.js — 文章详情 + 点赞 + 评论
   ========================================= */

import { store } from '../store.js';
import { navigate } from '../router.js';
import { renderMarkdown } from '../utils/markdown.js';

export function renderArticle(articleId) {
  const articles = store.getArticles();
  const article = articles.find(a => a.id === articleId);

  if (!article) {
    return `
      <div class="card article-page">
        <p style="text-align:center;color:var(--text-muted);">文章未找到</p>
        <p style="text-align:center;">
          <span class="back-link" id="back-to-home">← 返回首页</span>
        </p>
      </div>
    `;
  }

  const likes = store.getLikes();
  const likedBy = store.getLikedBy();
  const comments = store.getComments();

  const likeCount = likes[articleId] || 0;
  const isLiked = !!likedBy[articleId];
  const articleComments = comments[articleId] || [];

  return `
    <div class="card article-page">
      <span class="back-link" id="back-to-home">← 返回首页</span>
      <h2 style="margin-bottom:4px;">${escapeHtml(article.title)}</h2>
      <div style="font-size:13px;color:var(--text-muted);margin-bottom:20px;">${article.date || ''}</div>
      <div class="markdown-body">
        ${renderMarkdown(article.content || '*（无内容）*')}
      </div>
    </div>

    <!-- 点赞 -->
    <div class="card like-section">
      <button class="like-btn${isLiked ? ' liked' : ''}" id="like-btn" data-article-id="${articleId}">
        <span id="like-icon">${isLiked ? '❤️' : '🤍'}</span> 点赞
      </button>
      <span class="like-count" id="like-count">${likeCount} 次点赞</span>
    </div>

    <!-- 评论 -->
    <div class="card comment-section">
      <h3>💬 评论</h3>
      <div class="comment-form">
        <input type="text" id="comment-nickname" placeholder="昵称 *" maxlength="30" autocomplete="off">
        <div class="field-error" id="comment-nickname-error">请输入昵称</div>
        <textarea id="comment-content" placeholder="写下你的想法..." maxlength="500"></textarea>
        <div class="field-error" id="comment-content-error">请输入评论内容</div>
        <button class="btn" id="comment-submit" data-article-id="${articleId}">提交评论</button>
      </div>
      <div id="comment-list">
        ${articleComments.length === 0
          ? '<p style="text-align:center;color:var(--text-muted);font-size:14px;">暂无评论，来说点什么吧</p>'
          : articleComments.map(c => `
              <div class="comment-item">
                <div class="comment-header">
                  <span class="comment-nickname">${escapeHtml(c.nickname)}</span>
                  <span class="comment-date">${c.date || ''}</span>
                </div>
                <div class="comment-text">${escapeHtml(c.content)}</div>
              </div>
            `).join('')}
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ---- 事件绑定 ---- */
export function bindArticleEvents() {
  /* 返回首页 */
  const backBtn = document.getElementById('back-to-home');
  if (backBtn) {
    backBtn.addEventListener('click', () => navigate('home'));
  }

  /* 点赞 */
  const likeBtn = document.getElementById('like-btn');
  if (likeBtn) {
    likeBtn.addEventListener('click', () => {
      const articleId = likeBtn.dataset.articleId;
      const likes = store.getLikes();
      const likedBy = store.getLikedBy();

      if (likedBy[articleId]) {
        /* 取消点赞 */
        likedBy[articleId] = false;
        likes[articleId] = Math.max(0, (likes[articleId] || 0) - 1);
        likeBtn.classList.remove('liked');
        document.getElementById('like-icon').textContent = '🤍';
      } else {
        /* 点赞 */
        likedBy[articleId] = true;
        likes[articleId] = (likes[articleId] || 0) + 1;
        likeBtn.classList.add('liked');
        document.getElementById('like-icon').textContent = '❤️';
      }

      store.setLikes(likes);
      store.setLikedBy(likedBy);
      document.getElementById('like-count').textContent = `${likes[articleId]} 次点赞`;
    });
  }

  /* 评论提交 */
  const submitBtn = document.getElementById('comment-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const articleId = submitBtn.dataset.articleId;
      const nickname = document.getElementById('comment-nickname').value.trim();
      const content = document.getElementById('comment-content').value.trim();

      /* 验证 */
      let valid = true;
      document.getElementById('comment-nickname-error').style.display = 'none';
      document.getElementById('comment-content-error').style.display = 'none';

      if (!nickname) {
        document.getElementById('comment-nickname-error').style.display = '';
        valid = false;
      }
      if (!content) {
        document.getElementById('comment-content-error').style.display = '';
        valid = false;
      }
      if (!valid) return;

      /* 保存 */
      const comments = store.getComments();
      if (!comments[articleId]) comments[articleId] = [];
      comments[articleId].push({
        nickname,
        content,
        date: new Date().toLocaleString('zh-CN'),
      });
      store.setComments(comments);

      /* 更新列表 */
      const list = document.getElementById('comment-list');
      const newComment = comments[articleId].slice(-1)[0];
      const emptyMsg = list.querySelector('p');
      if (emptyMsg) emptyMsg.remove();

      const item = document.createElement('div');
      item.className = 'comment-item';
      item.innerHTML = `
        <div class="comment-header">
          <span class="comment-nickname">${escapeHtml(newComment.nickname)}</span>
          <span class="comment-date">${newComment.date}</span>
        </div>
        <div class="comment-text">${escapeHtml(newComment.content)}</div>
      `;
      list.insertBefore(item, list.firstChild);

      /* 清空表单 */
      document.getElementById('comment-nickname').value = '';
      document.getElementById('comment-content').value = '';
    });
  }
}
