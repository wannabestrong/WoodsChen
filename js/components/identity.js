import { icon } from './nav.js?v=20';

export function renderIdentityPanel({ activePage = 'home', activeFilter = 'all' } = {}) {
  const isHome = activePage === 'home';

  return `<aside class="identity-panel" aria-label="Identity">
    <h2 class="identity-title">OPEN</h2>
    <div class="identity-avatar"><img src="assets/avatar/avatar.webp" alt="Forest Chen 的个人头像"></div>
    <div>
      <p class="identity-statement">记录文字<br>保存瞬间</p>
      <p class="identity-note">生活是自己的感受，<br>而不是别人的看法。</p>
    </div>
    <nav class="identity-nav" aria-label="内容分类">
      <button class="${isHome && activeFilter === 'all' ? 'active' : ''}" type="button" data-filter="all">${icon('archive')}<span>首页</span></button>
      <button class="${isHome && activeFilter === 'essay' ? 'active' : ''}" type="button" data-filter="essay">${icon('file-text')}<span>文章</span></button>
      <button class="${activePage === 'photos' ? 'active' : ''}" type="button" data-page="photos">${icon('image')}<span>照片</span></button>
      <button class="${activePage === 'about' ? 'active' : ''}" type="button" data-page="about">${icon('user-round')}<span>关于</span></button>
    </nav>
    <footer class="identity-footer">
      <div class="social-row">
        <a class="social-link" href="https://github.com/wannabestrong" target="_blank" rel="noreferrer" aria-label="访问 wannabestrong 的 GitHub 主页">${icon('github')}</a>
        <a class="social-link" href="mailto:2908462935@qq.com" aria-label="发送邮件至 2908462935@qq.com">${icon('mail')}</a>
      </div>
      <p class="copyright">© 2026 OPEN<br>Made with care</p>
    </footer>
  </aside>`;
}

export function bindIdentityNavigation(navigate) {
  document.querySelectorAll('.identity-nav [data-filter]').forEach(button => {
    button.addEventListener('click', () => navigate('home', button.dataset.filter));
  });
  document.querySelectorAll('.identity-nav [data-page]').forEach(button => {
    button.addEventListener('click', () => navigate(button.dataset.page));
  });
}
