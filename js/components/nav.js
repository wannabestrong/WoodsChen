import { state, navigate } from '../router.js?v=20';
import { getSession } from '../supabase.js?v=20';

const LINKS = [
  { id: 'archive', page: 'home', label: '首页', filter: 'all' },
  { id: 'notes', page: 'home', label: '文章', filter: 'essay' },
  { id: 'photos', page: 'photos', label: '照片' },
  { id: 'about', page: 'about', label: '关于' },
  { id: 'admin', page: 'admin', label: '后台', authOnly: true },
];

const DISPLAY_KEY = 'fc_display_preferences';
let cleanupNavInteractions = () => {};

export function icon(name, label = '') {
  const hidden = label ? '' : ' aria-hidden="true"';
  return `<i data-lucide="${name}"${hidden}></i>`;
}

export function renderNav() {
  const nav = document.getElementById('top-nav');
  if (!nav) return;
  cleanupNavInteractions();

  const preferences = readDisplayPreferences();
  applyDisplayPreferences(preferences);

  const activeId = state.page === 'article' ? (state.returnFilter === 'essay' ? 'notes' : 'archive') : state.page === 'home' ? (state.filter === 'essay' ? 'notes' : 'archive') : state.page === 'photos' ? 'photos' : state.page === 'about' ? 'about' : state.page === 'admin' ? 'admin' : '';
  nav.innerHTML = `
    <div class="nav-inner">
      <button class="nav-brand" type="button" data-page="home" aria-label="返回首页">OPEN</button>
      <div class="nav-links" aria-label="主导航">
        ${LINKS.map(link => `<button class="nav-link${activeId === link.id ? ' active' : ''}" type="button" data-page="${link.page}" data-filter="${link.filter || ''}"${link.authOnly ? ' hidden' : ''}>${link.label}</button>`).join('')}
      </div>
      <div class="nav-tools">
        <button class="icon-button" id="global-search" type="button" aria-label="搜索" title="搜索">${icon('search')}</button>
        <button class="icon-button" id="display-settings" type="button" aria-label="显示设置" title="显示设置" aria-expanded="false" aria-controls="display-settings-panel">${icon('settings')}</button>
        <div class="display-settings-panel" id="display-settings-panel" hidden>
          <div class="settings-heading"><strong>显示设置</strong><button class="settings-close" type="button" aria-label="关闭显示设置">${icon('x')}</button></div>
          <label><span>高对比度</span><input type="checkbox" name="contrast" ${preferences.contrast ? 'checked' : ''}></label>
          <label><span>大号正文</span><input type="checkbox" name="largeText" ${preferences.largeText ? 'checked' : ''}></label>
          <label><span>减少动效</span><input type="checkbox" name="reducedMotion" ${preferences.reducedMotion ? 'checked' : ''}></label>
        </div>
      </div>
    </div>`;

  nav.querySelectorAll('[data-page]').forEach(button => {
    button.addEventListener('click', () => navigate(button.dataset.page, button.dataset.filter || null));
  });

  /* 「后台」入口只对已登录的站长显示，普通访客看不到 */
  const adminEntry = nav.querySelector('[data-page="admin"][hidden]');
  if (adminEntry) {
    getSession().then(session => { if (session) adminEntry.hidden = false; }).catch(() => {});
  }
  nav.querySelector('#global-search')?.addEventListener('click', () => {
    if (state.page !== 'home' || state.filter !== 'all') {
      try { sessionStorage.setItem('fc_search_return_hash', window.location.hash); } catch {}
      navigate('home', 'all');
    }
    setTimeout(() => window.dispatchEvent(new CustomEvent('open:search')), 0);
  });
  const settingsButton = nav.querySelector('#display-settings');
  const settingsPanel = nav.querySelector('#display-settings-panel');
  const closeSettings = () => {
    settingsPanel.hidden = true;
    settingsButton.setAttribute('aria-expanded', 'false');
  };
  settingsButton?.addEventListener('click', event => {
    event.stopPropagation();
    settingsPanel.hidden = !settingsPanel.hidden;
    settingsButton.setAttribute('aria-expanded', String(!settingsPanel.hidden));
  });
  settingsPanel?.querySelector('.settings-close')?.addEventListener('click', closeSettings);
  settingsPanel?.querySelectorAll('input').forEach(input => input.addEventListener('change', () => {
    const next = {
      contrast: settingsPanel.querySelector('[name="contrast"]').checked,
      largeText: settingsPanel.querySelector('[name="largeText"]').checked,
      reducedMotion: settingsPanel.querySelector('[name="reducedMotion"]').checked,
    };
    try { localStorage.setItem(DISPLAY_KEY, JSON.stringify(next)); } catch {}
    applyDisplayPreferences(next);
  }));
  const onPointerDown = event => {
    if (!settingsPanel?.hidden && !settingsPanel.contains(event.target) && event.target !== settingsButton) closeSettings();
  };
  const onKeyDown = event => { if (event.key === 'Escape' && !settingsPanel?.hidden) closeSettings(); };
  document.addEventListener('pointerdown', onPointerDown);
  document.addEventListener('keydown', onKeyDown);
  cleanupNavInteractions = () => {
    document.removeEventListener('pointerdown', onPointerDown);
    document.removeEventListener('keydown', onKeyDown);
  };
}

function readDisplayPreferences() {
  try { return { contrast: false, largeText: false, reducedMotion: false, ...JSON.parse(localStorage.getItem(DISPLAY_KEY) || '{}') }; }
  catch { return { contrast: false, largeText: false, reducedMotion: false }; }
}

function applyDisplayPreferences(preferences) {
  document.documentElement.classList.toggle('high-contrast', preferences.contrast);
  document.documentElement.classList.toggle('large-text', preferences.largeText);
  document.documentElement.classList.toggle('reduce-motion', preferences.reducedMotion);
}
