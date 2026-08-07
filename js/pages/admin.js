import { signIn, signOut, getSession, publishArticle, publishPhotoStory, uploadMedia } from '../supabase.js?v=10';
import { renderMarkdown } from '../utils/markdown.js?v=10';
import { icon } from '../components/nav.js?v=10';

let photoImages = [];
let articleCover = '';
let photoCover = '';

export function renderAdmin() {
  return `<section class="admin-page" aria-labelledby="admin-title">
    <header class="admin-header"><div><p class="admin-kicker">Content Studio</p><h1 id="admin-title">OPEN 编辑后台</h1></div><button class="admin-quiet" id="admin-signout" type="button" hidden>${icon('log-out')}<span>退出</span></button></header>
    <div class="admin-login" id="admin-login">
      <form id="admin-login-form"><h2>登录 Supabase</h2><label>邮箱<input name="email" type="email" autocomplete="username" required></label><label>密码<input name="password" type="password" autocomplete="current-password" required></label><button class="admin-primary" type="submit">登录</button><p class="admin-status" id="login-status"></p></form>
    </div>
    <div class="admin-workspace" id="admin-workspace" hidden>
      <div class="admin-segments" role="tablist" aria-label="内容类型"><button class="active" type="button" data-admin-mode="article">${icon('file-text')}文章</button><button type="button" data-admin-mode="photo">${icon('images')}摄影集</button></div>
      <form class="admin-form" id="article-form">
        <div class="admin-fields"><label>标题<input name="title" required></label><label>文章 ID<input name="id" placeholder="例如 night-walk" required></label><label>日期<input name="date" type="date" required></label><label>摘要<input name="summary"></label></div>
        <div class="admin-upload-row"><label class="admin-file">${icon('image-plus')}选择封面<input id="article-cover" type="file" accept="image/*"></label><span id="article-cover-name">尚未选择封面</span></div>
        <div class="admin-editor-grid"><div class="admin-editor"><div class="admin-editor-bar"><strong>Markdown</strong><label class="admin-file compact">${icon('paperclip')}插入图片<input id="article-inline-image" type="file" accept="image/*" multiple></label></div><textarea id="article-content" name="content" placeholder="在这里写作或粘贴 Markdown。也可以直接粘贴剪贴板中的图片。" required></textarea></div><div class="admin-preview markdown-body" id="article-preview"><p>预览会显示在这里。</p></div></div>
        <div class="admin-submit"><select name="status" aria-label="发布状态"><option value="published">立即发布</option><option value="draft">保存草稿</option></select><button class="admin-primary" type="submit">${icon('send')}保存文章</button><p class="admin-status" id="article-status"></p></div>
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
  const showWorkspace = () => { login.hidden = true; workspace.hidden = false; signout.hidden = false; };
  getSession().then(session => { if (session) showWorkspace(); }).catch(() => {});

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
  }));

  bindSingleUpload('article-cover', 'article-cover-name', url => { articleCover = url; });
  bindSingleUpload('photo-cover', 'photo-cover-name', url => { photoCover = url; });

  const content = document.getElementById('article-content');
  const preview = document.getElementById('article-preview');
  const updatePreview = () => { preview.innerHTML = renderMarkdown(content.value) || '<p>预览会显示在这里。</p>'; };
  content?.addEventListener('input', updatePreview);
  content?.addEventListener('paste', async event => {
    const files = [...(event.clipboardData?.files || [])].filter(file => file.type.startsWith('image/'));
    if (!files.length) return;
    event.preventDefault();
    await insertUploadedImages(content, files);
    updatePreview();
  });
  document.getElementById('article-inline-image')?.addEventListener('change', async event => {
    await insertUploadedImages(content, [...event.target.files]);
    event.target.value = '';
    updatePreview();
  });

  document.getElementById('photo-images')?.addEventListener('change', async event => {
    const files = [...event.target.files];
    const list = document.getElementById('admin-photo-list');
    list.innerHTML = '<p class="admin-empty">正在上传照片…</p>';
    for (const file of files) photoImages.push({ url: await uploadMedia(file, 'photo-stories'), alt: file.name.replace(/\.[^.]+$/, ''), orientation: 'landscape' });
    event.target.value = '';
    renderPhotoList();
  });

  document.getElementById('article-form')?.addEventListener('submit', async event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const status = document.getElementById('article-status');
    await run(status, '正在保存文章…', async () => {
      const id = slug(data.get('id'));
      if (!id) throw new Error('文章 ID 只能包含英文、数字和短横线');
      await publishArticle({ id, title: data.get('title'), date: data.get('date'), summary: data.get('summary'), content: data.get('content'), cover_url: articleCover, status: data.get('status') });
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

async function run(node, pending, task) {
  node.textContent = pending; node.classList.remove('error');
  try { node.textContent = await task(); } catch (error) { node.textContent = error.message || String(error); node.classList.add('error'); }
}

function slug(value) { return String(value || '').trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''); }
function escapeHtml(value = '') { return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }
