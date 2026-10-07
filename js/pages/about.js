import { icon } from '../components/nav.js?v=26';

export function renderAbout() {
  return `<section class="about-page" aria-labelledby="about-title">
    <div class="about-profile">
      <div class="about-avatar"><img src="assets/avatar/avatar.webp" alt="Forest Chen 的个人头像"></div>
      <div><h1 class="about-title" id="about-title">OPEN</h1><p class="about-tagline">记录文字，保存瞬间。</p><p class="about-copy">永远年轻，永远热泪盈眶</p></div>
      <nav class="about-links" aria-label="联系链接">
        <a class="about-link" href="https://github.com/wannabestrong" target="_blank" rel="noreferrer">${icon('github')}<span>GitHub</span><span class="arrow">→</span></a>
        <a class="about-link" href="mailto:2908462935@qq.com">${icon('mail')}<span>Email · 2908462935@qq.com</span><span class="arrow">→</span></a>
      </nav>
    </div>
    <aside class="about-index"><h2>Archive Index</h2><div class="index-row"><span class="index-dot"></span>${icon('pen-line')}<span>Writing</span></div><div class="index-row"><span class="index-dot"></span>${icon('camera')}<span>Photography</span></div><p class="index-note">持续记录，持续保存。</p></aside>
  </section>`;
}

export function bindAboutEvents() {}
