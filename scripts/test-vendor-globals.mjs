/* 校验 vendor/ 下自托管的三个依赖库，在浏览器式全局环境下确实暴露了代码期望的全局变量。
   目的：防止将来替换 vendor 文件时，全局名变了却没人发现（会导致整站白屏）。
   运行：node scripts/test-vendor-globals.mjs */
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

/* 模拟浏览器经典脚本的执行环境：顶层 var 会成为全局属性 */
const ctx = { console };
ctx.globalThis = ctx;
ctx.self = ctx;
ctx.window = ctx;
vm.createContext(ctx);

const load = file => vm.runInContext(readFileSync(file, 'utf8'), ctx, { filename: file });

load('vendor/marked.min.js');
load('vendor/lucide.min.js');
load('vendor/supabase-js.min.js');

/* marked：js/markdown.js 用 marked.parse() */
assert.strictEqual(typeof ctx.marked, 'object', 'marked 未挂到全局');
assert.strictEqual(typeof ctx.marked.parse, 'function', 'marked.parse 不可用');
assert.strictEqual(ctx.marked.parse('# 标题'), '<h1>标题</h1>\n', 'marked 解析结果异常');

/* lucide：各页面用 window.lucide.createIcons() */
assert.strictEqual(typeof ctx.lucide, 'object', 'lucide 未挂到全局');
assert.strictEqual(typeof ctx.lucide.createIcons, 'function', 'lucide.createIcons 不可用');

/* supabase：js/supabase.js 用 window.supabase.createClient() */
assert.strictEqual(typeof ctx.supabase, 'object', 'supabase 未挂到全局');
assert.strictEqual(typeof ctx.supabase.createClient, 'function', 'supabase.createClient 不可用');

console.log('✅ vendor 全局变量测试通过：marked / lucide / supabase 均可用');
