/* =========================================
   guestbook.js — 留言板表单 + 留言列表
   ========================================= */

import { store } from '../store.js';

export function renderGuestbook() {
  const messages = store.getMessages();

  return `
    <!-- 留言表单 -->
    <div class="card">
      <h3 style="margin-bottom:16px;">✉️ 留言板</h3>
      <div class="guestbook-form">
        <div>
          <label>昵称 <span style="color:#d44">*</span></label>
          <input type="text" id="msg-nickname" placeholder="你的昵称" maxlength="30" autocomplete="off">
          <div class="field-error" id="msg-nickname-error">请输入昵称</div>
        </div>
        <div>
          <label>邮箱 <span class="optional">（选填）</span></label>
          <input type="email" id="msg-email" placeholder="your@email.com" autocomplete="off">
          <div class="field-error" id="msg-email-error">邮箱格式不正确</div>
        </div>
        <div>
          <label>内容 <span style="color:#d44">*</span></label>
          <textarea id="msg-content" placeholder="想说点什么..." maxlength="500"></textarea>
          <div class="field-error" id="msg-content-error">请输入留言内容</div>
        </div>
        <div class="submit-row">
          <button class="btn" id="msg-submit">发送留言</button>
        </div>
      </div>
    </div>

    <!-- 留言列表 -->
    <div class="card">
      <h3 style="margin-bottom:16px;">最新留言</h3>
      ${messages.length === 0
        ? '<p style="text-align:center;color:var(--text-muted);font-size:14px;">还没有留言，来做第一个留言的人吧</p>'
        : [...messages]
            .reverse()
            .map(m => `
              <div class="message-item">
                <div class="msg-header">
                  <span class="msg-nickname">${escapeHtml(m.nickname)}</span>
                  <span class="msg-date">${m.date || ''}</span>
                </div>
                ${m.email ? `<div class="msg-email">📧 ${escapeHtml(m.email)}</div>` : ''}
                <div class="msg-content">${escapeHtml(m.content)}</div>
              </div>
            `).join('')}
    </div>
  `;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ---- 事件绑定 ---- */
export function bindGuestbookEvents() {
  const submitBtn = document.getElementById('msg-submit');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', () => {
    const nickname = document.getElementById('msg-nickname').value.trim();
    const email = document.getElementById('msg-email').value.trim();
    const content = document.getElementById('msg-content').value.trim();

    /* 验证 */
    let valid = true;
    document.getElementById('msg-nickname-error').style.display = 'none';
    document.getElementById('msg-email-error').style.display = 'none';
    document.getElementById('msg-content-error').style.display = 'none';

    if (!nickname) {
      document.getElementById('msg-nickname-error').style.display = '';
      valid = false;
    }
    if (email && (!email.includes('@') || !email.includes('.'))) {
      document.getElementById('msg-email-error').style.display = '';
      valid = false;
    }
    if (!content) {
      document.getElementById('msg-content-error').style.display = '';
      valid = false;
    }
    if (!valid) return;

    /* 保存 */
    const messages = store.getMessages();
    messages.push({
      nickname,
      email,
      content,
      date: new Date().toLocaleString('zh-CN'),
    });
    store.setMessages(messages);

    /* 重新渲染留言列表 */
    const listCard = document.querySelectorAll('.card')[1]; // 第二张卡片是留言列表
    if (listCard) {
      const updatedMessages = store.getMessages();
      listCard.innerHTML = `
        <h3 style="margin-bottom:16px;">最新留言</h3>
        ${updatedMessages.length === 0
          ? '<p style="text-align:center;color:var(--text-muted);font-size:14px;">还没有留言，来做第一个留言的人吧</p>'
          : [...updatedMessages]
              .reverse()
              .map(m => `
                <div class="message-item">
                  <div class="msg-header">
                    <span class="msg-nickname">${escapeHtml(m.nickname)}</span>
                    <span class="msg-date">${m.date || ''}</span>
                  </div>
                  ${m.email ? `<div class="msg-email">📧 ${escapeHtml(m.email)}</div>` : ''}
                  <div class="msg-content">${escapeHtml(m.content)}</div>
                </div>
              `).join('')}
      `;
    }

    /* 清空表单 */
    document.getElementById('msg-nickname').value = '';
    document.getElementById('msg-email').value = '';
    document.getElementById('msg-content').value = '';
  });
}
