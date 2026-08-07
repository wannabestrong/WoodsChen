import { state, navigate } from '../router.js?v=6';

const LINKS = [
  { page: 'home', label: 'Archive', filter: 'all' },
  { page: 'home', label: 'Notes', filter: 'essay' },
  { page: 'photos', label: 'Photos' },
  { page: 'about', label: 'About' },
];

export function icon(name, label = '') {
  const hidden = label ? '' : ' aria-hidden="true"';
  return `<i data-lucide="${name}"${hidden}></i>`;
}

export function renderNav() {
  const nav = document.getElementById('top-nav');
  if (!nav) return;

  const activeLabel = state.page === 'article' ? 'Archive' : state.page === 'home' ? (state.filter === 'essay' ? 'Notes' : 'Archive') : state.page === 'photos' ? 'Photos' : 'About';
  nav.innerHTML = `
    <div class="nav-inner">
      <button class="nav-brand" type="button" data-page="home" aria-label="返回 Archive">OPEN</button>
      <div class="nav-links" aria-label="主导航">
        ${LINKS.map(link => `<button class="nav-link${activeLabel === link.label ? ' active' : ''}" type="button" data-page="${link.page}" data-filter="${link.filter || ''}">${link.label}</button>`).join('')}
      </div>
      <div class="nav-tools">
        <button class="icon-button" id="global-search" type="button" aria-label="搜索" title="搜索">${icon('search')}</button>
        <button class="icon-button" id="display-settings" type="button" aria-label="显示设置" title="显示设置">${icon('settings')}</button>
      </div>
    </div>`;

  nav.querySelectorAll('[data-page]').forEach(button => {
    button.addEventListener('click', () => navigate(button.dataset.page, button.dataset.filter || null));
  });
  nav.querySelector('#global-search')?.addEventListener('click', () => window.dispatchEvent(new CustomEvent('open:search')));
  nav.querySelector('#display-settings')?.addEventListener('click', () => {
    document.documentElement.classList.toggle('high-contrast');
  });
}
