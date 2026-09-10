import { icon } from '../components/nav.js?v=14';

export function renderAbout() {
  return `<section class="about-page" aria-labelledby="about-title">
    <div class="about-profile">
      <div class="about-avatar"><img src="assets/avatar/avatar-replace-later.png" alt="匿名头像占位图"></div>
      <div><h1 class="about-title" id="about-title">OPEN</h1><p class="about-tagline">记录文字，保存瞬间。</p><p class="about-copy">这里暂时保留简短的个人介绍位置。正式内容将由用户提供，不在占位阶段添加年份、地点、经历或身份主张。</p></div>
      <nav class="about-links" aria-label="联系链接">
        <a class="about-link" href="https://github.com/" target="_blank" rel="noreferrer">${icon('github')}<span>GitHub</span><span class="arrow">→</span></a>
        <a class="about-link" href="mailto:hello@example.com">${icon('mail')}<span>Email</span><span class="arrow">→</span></a>
        <a class="about-link" href="#">${icon('instagram')}<span>Instagram</span><span class="arrow">→</span></a>
        <a class="about-link" href="#">${icon('rss')}<span>RSS</span><span class="arrow">→</span></a>
      </nav>
    </div>
    <aside class="about-index"><h2>Archive Index</h2><div class="index-row"><span class="index-dot"></span>${icon('pen-line')}<span>Writing</span></div><div class="index-row"><span class="index-dot"></span>${icon('camera')}<span>Photography</span></div><p class="index-note">持续记录，持续保存。</p></aside>
  </section>`;
}

export function bindAboutEvents() {}
