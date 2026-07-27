/* =========================================
   markdown.js — Markdown 渲染封装
   ========================================= */

export function renderMarkdown(text) {
  if (typeof marked === 'undefined') {
    return '<p style="color:red">Markdown 渲染组件未加载，请检查网络连接。</p>';
  }

  if (!text || typeof text !== 'string') {
    return '';
  }

  try {
    return marked.parse(text);
  } catch (e) {
    console.error('Markdown parse error:', e);
    return `<pre>${escapeHtml(text)}</pre>`;
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
