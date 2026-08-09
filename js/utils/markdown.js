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
    return sanitizeHtml(marked.parse(text));
  } catch (e) {
    console.error('Markdown parse error:', e);
    return `<pre>${escapeHtml(text)}</pre>`;
  }
}

function sanitizeHtml(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  template.content.querySelectorAll('script, style, iframe, object, embed, form, input, button, meta, link, svg, math').forEach(node => node.remove());
  template.content.querySelectorAll('*').forEach(node => {
    [...node.attributes].forEach(attribute => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim();
      if (name.startsWith('on') || name === 'style' || name === 'srcdoc') node.removeAttribute(attribute.name);
      if ((name === 'href' || name === 'src') && !isSafeUrl(value)) node.removeAttribute(attribute.name);
    });
  });
  return template.innerHTML;
}

function isSafeUrl(value) {
  return /^(https?:|mailto:|\/|\.\/|\.\.\/|#)/i.test(value) || !/^[a-z][a-z0-9+.-]*:/i.test(value);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
