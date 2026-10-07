import { signIn, signOut, getSession, loadArticlesFromServer, publishArticle, publishPhotoStory, uploadMedia } from '../supabase.js?v=26';
import { store } from '../store.js?v=26';
import { STATIC_ARTICLES, isLegacyContent } from '../content.js?v=26';
import { renderMarkdown } from '../utils/markdown.js?v=26';
import { icon } from '../components/nav.js?v=26';

let photoImages = [];
let articleCover = '';
let photoCover = '';
let articleEditingId = '';
let previewTimer = 0;

export function renderAdmin() {
  window.clearTimeout(previewTimer);
  articleEditingId = '';
  articleCover = '';
  photoImages = [];
  photoCover = '';
  return `<section class="admin-page" aria-labelledby="admin-title">
    <header class="admin-header"><div><p class="admin-kicker">Content Studio</p><h1 id="admin-title">OPEN 编辑后台</h1></div><button class="admin-quiet" id="admin-signout" type="button" hidden>${icon('log-out')}<span>退出</span></button></header>
    <div class="admin-login" id="admin-login">
      <form id="admin-login-form"><h2>登录 Supabase</h2><label>邮箱<input name="email" type="email" autocomplete="username" required></label><label>密码<input name="password" type="password" autocomplete="current-password" required></label><button class="admin-primary" type="submit">登录</button><p class="admin-status" id="login-status"></p></form>
    </div>
    <div class="admin-workspace" id="admin-workspace" hidden>
      <div class="admin-segments" role="tablist" aria-label="内容类型"><button class="active" type="button" data-admin-mode="article">${icon('file-text')}文章</button><button type="button" data-admin-mode="photo">${icon('images')}摄影集</button></div>
      <section class="admin-library" id="admin-article-library" aria-labelledby="admin-library-title">
        <div class="admin-library-header"><h2 id="admin-library-title">已有文章</h2><button class="admin-quiet" id="admin-new-article" type="button">${icon('plus')}新建文章</button></div>
        <div class="admin-article-list" id="admin-article-list"><p class="admin-empty">正在加载文章…</p></div>
      </section>
      <form class="admin-form" id="article-form">
        <div class="admin-fields"><label>标题<input name="title" required></label><label>文章 ID<input name="id" placeholder="例如 night-walk" required></label><label>日期<input name="date" type="date" required></label><label>摘要<input name="summary"></label></div>
        <div class="admin-upload-row"><label class="admin-file">${icon('image-plus')}选择封面<input id="article-cover" type="file" accept="image/*"></label><span id="article-cover-name">尚未选择封面</span></div>
        <div class="admin-editor-grid"><div class="admin-editor"><div class="admin-editor-bar"><strong>Markdown</strong><label class="admin-file compact">${icon('paperclip')}插入图片<input id="article-inline-image" type="file" accept="image/*" multiple></label></div><textarea id="article-content" name="content" placeholder="在这里写作或粘贴 Markdown。也可以直接粘贴剪贴板中的图片。" required></textarea></div><div class="admin-preview markdown-body" id="article-preview"><p>预览会显示在这里。</p></div></div>
        <div class="admin-submit"><select name="status" aria-label="发布状态"><option value="published">立即发布</option><option value="draft">保存草稿</option></select><button class="admin-quiet" id="admin-cancel-edit" type="button" hidden>取消编辑</button><button class="admin-primary" type="submit">${icon('send')}<span id="article-submit-label">保存文章</span></button><p class="admin-status" id="article-status"></p></div>
      </form>
      <form class="admin-form" id="photo-form" hidden>
        <div class="admin-fields"><label>摄影集标题<input name="title" required></label><label>摄影集 ID<input name="id" placeholder="例如 summer-river" required></label><label>地点<input name="place"></label><label>日期<input name="date" type="date" required></label><label class="wide">摘要<input name="summary"></label></div>
        <div class="admin-upload-row"><label class="admin-file">${icon('image-plus')}选择封面<input id="photo-cover" type="file" accept="image/*"></label><span id="photo-cover-name">尚未选择封面</span><label class="admin-file">${icon('images')}添加照片<input id="photo-images" type="file" accept="image/*" multiple></label></div>
        <div class="admin-photo-list" id="admin-photo-list"><p class="admin-empty">尚未添加照片。</p></div>
        <label class="admin-description">摄影集说明<textarea name="description" placeholder="这段文字会显示在摄影集最后。"></textarea></label>
        <div class="admin-submit"><select name="status" aria-label="发布状态"><option value="published">立即发布</option><option value="draft">保存草稿</option></select><button class="admin-primary" type="submit">${icon('send')}保存摄影集</button><p class="admin-status" id="photo-status"></p></div>
      </form>
    </div>
  </section>`;
}

export function bindAdminEvents() {
  const login = document.getElementById('admin-login');
  const workspace = document.getElementById('admin-workspace');
  const signout = document.getElementById('admin-signout');
  const showWorkspace = () => {
    login.hidden = true;
    workspace.hidden = false;
    signout.hidden = false;
    renderArticleLibrary();
    void loadArticlesFromServer({ force: true }).then(renderArticleLibrary);
  };
  getSession().then(session => { if (session) void showWorkspace(); }).catch(() => {});

  document.getElementById('admin-login-form')?.addEventListener('submit', async event => {
    event.preventDefault();
    const status = document.getElementById('login-status');
    const data = new FormData(event.currentTarget);
    await run(status, '正在登录…', async () => { await signIn(data.get('email'), data.get('password')); showWorkspace(); return '登录成功'; });
  });
  signout?.addEventListener('click', async () => { await signOut(); location.reload(); });

  document.querySelectorAll('[data-admin-mode]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-admin-mode]').forEach(item => item.classList.toggle('active', item === button));
    document.getElementById('article-form').hidden = button.dataset.adminMode !== 'article';
    document.getElementById('photo-form').hidden = button.dataset.adminMode !== 'photo';
    document.getElementById('admin-article-library').hidden = button.dataset.adminMode !== 'article';
  }));
  document.getElementById('admin-new-article')?.addEventListener('click', () => { resetArticleForm(); scrollToArticleForm(); });
  document.getElementById('admin-cancel-edit')?.addEventListener('click', () => { resetArticleForm(); scrollToArticleForm(); });
  document.getElementById('admin-article-list')?.addEventListener('click', event => {
    const button = event.target.closest('[data-edit-article]');
    if (!button) return;
    const article = findAdminArticle(button.dataset.editArticle);
    if (article) { fillArticleForm(article); scrollToArticleForm(); }
  });

  bindSingleUpload('article-cover', 'article-cover-name', url => { articleCover = url; });
  bindSingleUpload('photo-cover', 'photo-cover-name', url => { photoCover = url; });

  const content = document.getElementById('article-content');
  const updatePreview = () => {
    window.clearTimeout(previewTimer);
    previewTimer = window.setTimeout(renderArticlePreview, 180);
  };
  content?.addEventListener('input', updatePreview);
  content?.addEventListener('paste', async event => {
    const files = [...(event.clipboardData?.files || [])].filter(file => file.type.startsWith('image/'));
    if (!files.length) return;
    event.preventDefault();
    const status = document.getElementById('article-status');
    await run(status, '正在上传粘贴的图片…', async () => { await insertUploadedImages(content, files); return '图片已插入'; });
    updatePreview();
  });
  document.getElementById('article-inline-image')?.addEventListener('change', async event => {
    if (!event.target.files.length) return;
    const status = document.getElementById('article-status');
    await run(status, '正在上传插图…', async () => { await insertUploadedImages(content, [...event.target.files]); return '插图已插入'; });
    event.target.value = '';
    updatePreview();
  });

  document.getElementById('photo-images')?.addEventListener('change', async event => {
    const files = [...event.target.files];
    if (!files.length) return;
    const list = document.getElementById('admin-photo-list');
    const status = document.getElementById('photo-status');
    await run(status, '正在上传照片…', async () => {
      for (const file of files) photoImages.push({ url: await uploadMedia(file, 'photo-stories'), alt: file.name.replace(/\.[^.]+$/, ''), orientation: 'landscape' });
      return `已上传 ${files.length} 张照片`;
    });
    event.target.value = '';
    renderPhotoList();
  });

  document.getElementById('article-form')?.addEventListener('submit', async event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const status = document.getElementById('article-status');
    await run(status, '正在保存文章…', async () => {
      const id = articleEditingId || slug(data.get('id'));
      if (!id) throw new Error('文章 ID 只能包含英文、数字和短横线');
      await publishArticle({ id, title: data.get('title'), date: data.get('date'), summary: data.get('summary'), content: data.get('content'), cover_url: articleCover, status: data.get('status') });
      renderArticleLibrary();
      return data.get('status') === 'draft' ? '草稿已保存' : '文章已发布';
    });
  });
  document.getElementById('photo-form')?.addEventListener('submit', async event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const status = document.getElementById('photo-status');
    await run(status, '正在保存摄影集…', async () => {
      const id = slug(data.get('id'));
      if (!id) throw new Error('摄影集 ID 只能包含英文、数字和短横线');
      if (!photoCover) throw new Error('请先上传摄影集封面');
      await publishPhotoStory({ id, title: data.get('title'), place: data.get('place'), date: data.get('date'), summary: data.get('summary'), description: data.get('description'), cover_url: photoCover, images: photoImages, status: data.get('status') });
      return data.get('status') === 'draft' ? '草稿已保存' : '摄影集已发布';
    });
  });
}

function bindSingleUpload(inputId, labelId, onDone) {
  document.getElementById(inputId)?.addEventListener('change', async event => {
    const file = event.target.files[0];
    if (!file) return;
    const label = document.getElementById(labelId);
    await run(label, '正在上传…', async () => { const url = await uploadMedia(file, 'covers'); onDone(url); return file.name; });
  });
}

async function insertUploadedImages(textarea, files) {
  const snippets = [];
  for (const file of files) snippets.push(`![${file.name.replace(/\.[^.]+$/, '')}](${await uploadMedia(file, 'article-images')})`);
  const start = textarea.selectionStart;
  textarea.setRangeText(`\n\n${snippets.join('\n\n')}\n\n`, start, textarea.selectionEnd, 'end');
}

function renderPhotoList() {
  const list = document.getElementById('admin-photo-list');
  if (!photoImages.length) { list.innerHTML = '<p class="admin-empty">尚未添加照片。</p>'; return; }
  list.innerHTML = photoImages.map((image, index) => `<div class="admin-photo-item"><img src="${image.url}" alt=""><input value="${escapeHtml(image.alt)}" aria-label="图片说明"><div><button type="button" data-move="up" data-index="${index}" title="上移">${icon('arrow-up')}</button><button type="button" data-move="down" data-index="${index}" title="下移">${icon('arrow-down')}</button><button type="button" data-remove data-index="${index}" title="移除">${icon('trash-2')}</button></div></div>`).join('');
  list.querySelectorAll('input').forEach((input, index) => input.addEventListener('input', () => { photoImages[index].alt = input.value; }));
  list.querySelectorAll('[data-move]').forEach(button => button.addEventListener('click', () => { const i = Number(button.dataset.index); const j = button.dataset.move === 'up' ? i - 1 : i + 1; if (j < 0 || j >= photoImages.length) return; [photoImages[i], photoImages[j]] = [photoImages[j], photoImages[i]]; renderPhotoList(); }));
  list.querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', () => { photoImages.splice(Number(button.dataset.index), 1); renderPhotoList(); }));
  if (window.lucide) window.lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
}

function renderArticleLibrary() {
  const list = document.getElementById('admin-article-list');
  if (!list) return;
  const cloud = store.getAllArticles().filter(article => !isLegacyContent(article.id));
  const articles = new Map(cloud.map(article => [String(article.id), article]));
  STATIC_ARTICLES.forEach(article => { if (!articles.has(String(article.id))) articles.set(String(article.id), article); });
  const items = [...articles.values()].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  if (!items.length) { list.innerHTML = '<p class="admin-empty">还没有文章。</p>'; return; }
  list.innerHTML = items.map(article => `<button class="admin-article-item" type="button" data-edit-article="${escapeHtml(article.id)}"><span><strong>${escapeHtml(article.title || '未命名文章')}</strong><small>${escapeHtml((article.date || '').replaceAll('-', '.'))}</small></span><span class="admin-article-status ${article.status === 'draft' ? 'draft' : ''}">${article.status === 'draft' ? '草稿' : '已发布'}</span><span aria-hidden="true">编辑 →</span></button>`).join('');
}

function findAdminArticle(id) {
  const cloudArticle = store.getAllArticles().find(article => String(article.id) === String(id));
  return cloudArticle || STATIC_ARTICLES.find(article => String(article.id) === String(id));
}

function fillArticleForm(article) {
  const form = document.getElementById('article-form');
  if (!form) return;
  articleEditingId = String(article.id);
  form.elements.title.value = article.title || '';
  form.elements.id.value = article.id || '';
  form.elements.id.readOnly = true;
  form.elements.date.value = article.date || '';
  form.elements.summary.value = article.summary || '';
  form.elements.content.value = article.content || '';
  form.elements.status.value = article.status === 'draft' ? 'draft' : 'published';
  articleCover = article.cover_url || '';
  document.getElementById('article-cover-name').textContent = articleCover ? '已保留当前封面' : '尚未选择封面';
  document.getElementById('article-submit-label').textContent = '更新文章';
  document.getElementById('admin-cancel-edit').hidden = false;
  document.getElementById('article-status').textContent = '';
  renderArticlePreview();
}

function resetArticleForm() {
  const form = document.getElementById('article-form');
  if (!form) return;
  articleEditingId = '';
  articleCover = '';
  form.reset();
  form.elements.id.readOnly = false;
  document.getElementById('article-cover-name').textContent = '尚未选择封面';
  document.getElementById('article-submit-label').textContent = '保存文章';
  document.getElementById('admin-cancel-edit').hidden = true;
  document.getElementById('article-status').textContent = '';
  renderArticlePreview();
}

function renderArticlePreview() {
  const content = document.getElementById('article-content');
  const preview = document.getElementById('article-preview');
  if (!content || !preview) return;
  preview.innerHTML = renderMarkdown(content.value) || '<p>预览会显示在这里。</p>';
}

function scrollToArticleForm() {
  document.getElementById('article-form')?.scrollIntoView({ behavior: 'auto', block: 'start' });
}

async function run(node, pending, task) {
  node.textContent = pending; node.classList.remove('error');
  try { node.textContent = await task(); } catch (error) { node.textContent = error.message || String(error); node.classList.add('error'); }
}

function slug(value) { return String(value || '').trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''); }
function escapeHtml(value = '') { return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }
