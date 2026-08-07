/* =========================================
   supabase.js — 文章云端同步（Supabase）
   让文章在不同浏览器/设备间保持一致。

   使用前先在 Supabase 控制台：
   1. 新建项目，获取 Project URL 和 anon public key
   2. SQL Editor 执行 README 里的建表语句
   3. 把下面的占位符替换为真实值

   说明：Supabase URL 和 anon key 是公开的
   （仅供客户端使用），可直接写在页面里。
   ========================================= */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { store } from './store.js?v=8';

const SUPABASE_URL = 'https://fnexvbfzbqpqwtxlwoza.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__pLRoB-IFitrtRxahCRraQ_r81QMjA2';

const TABLE = 'articles';

let supabase = null;

function isConfigured() {
  return SUPABASE_URL.startsWith('http') && !SUPABASE_ANON_KEY.startsWith('YOUR_');
}

function getClient() {
  if (!supabase && isConfigured()) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabase;
}

/* ---- 从云端拉取全部文章，写入本地缓存并通知页面刷新 ---- */
export async function loadArticlesFromServer() {
  const client = getClient();
  if (!client) return;

  try {
    const { data, error } = await client
      .from(TABLE)
      .select('id, title, date, summary, content')
      .order('date', { ascending: false });

    if (error) throw error;

    store.setArticles(data || []);
    window.dispatchEvent(new CustomEvent('fc:articles-updated'));
  } catch (err) {
    console.error('加载云端文章失败（使用本地缓存）:', err.message || err);
  }
}

/* ---- 登录（发布前必须执行一次，会话会保存在浏览器里） ---- */
export async function signIn(email, password) {
  const client = getClient();
  if (!client) {
    throw new Error('Supabase 尚未配置，请先填写 js/supabase.js 中的 URL 和 key');
  }
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw new Error('登录失败: ' + error.message);
}

/* ---- 登出 ---- */
export async function signOut() {
  const client = getClient();
  if (!client) return;
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

/* ---- 检查是否已登录 ---- */
export async function requireLogin() {
  const client = getClient();
  if (!client) return;
  const { data, error } = await client.auth.getSession();
  if (error) throw error;
  if (!data.session) {
    throw new Error('请先登录再发布文章：await ForestChenAPI.signIn("你的邮箱", "你的密码")');
  }
}

/* ---- 发布文章（写入云端并刷新缓存） ---- */
export async function publishArticle(article) {
  const client = getClient();
  if (!client) {
    throw new Error('Supabase 尚未配置，请先填写 js/supabase.js 中的 URL 和 key');
  }
  await requireLogin();

  const row = {
    id: article.id || Date.now().toString(),
    title: article.title,
    date: article.date || '',
    summary: article.summary || '',
    content: article.content || '',
  };

  const { error } = await client.from(TABLE).insert(row);
  if (error) throw error;

  await loadArticlesFromServer();
}

/* ---- 删除文章（按 id） ---- */
export async function deleteArticle(id) {
  const client = getClient();
  if (!client) return;
  await requireLogin();

  const { error } = await client.from(TABLE).delete().eq('id', id);
  if (error) throw error;

  await loadArticlesFromServer();
}

/* ---- 初始化：配置好后自动拉取一次 ---- */
export function initSupabase() {
  if (isConfigured()) {
    loadArticlesFromServer();
  }
}

/* ---- 暴露到全局，供控制台发布文章使用 ---- */
window.ForestChenAPI = { signIn, signOut, publishArticle, deleteArticle, loadArticlesFromServer };
