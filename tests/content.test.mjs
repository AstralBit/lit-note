import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { parsePost, loadPosts, escapeHtml } from '../scripts/content.mjs';
import { categoryFromUrl, searchPosts } from '../src/lib/search.mjs';

const source = (body, date = '2026-09-15') => `---\ntitle: '测试文章'\ndescription: '关于网页与生活'\ndate: '${date}'\ncategory: '技术'\ncover: '/images/workspace.jpg'\ncoverAlt: '工作桌'\ntags: ['Lit']\n---\n${body}`;

test('Markdown is sanitized without breaking code, links, or image descriptions', () => {
  const post = parsePost(source('## 安全的标题\n\n<script>alert(1)</script>\n\n<img src="x" onerror="alert(1)" alt="图片">\n\n[危险](javascript:alert(1))\n\n[文档](https://lit.dev)\n\n```js\nconst value = "<hello>";\n```'), 'safe-post');
  assert.doesNotMatch(post.html, /<script|onerror|href="javascript:/);
  assert.match(post.html, /href="https:\/\/lit.dev"/);
  assert.match(post.html, /alt="图片"/);
  assert.match(post.html, /&lt;hello&gt;/);
  assert.deepEqual(post.headings, [{ id: 'section-1', text: '安全的标题' }]);
});

test('All heading IDs are unique and the contents list links to actual sections', () => {
  const post = parsePost(source('# 介绍\n\n## 同名\n\n### 同名\n\n#### 细节\n\n## 最后'), 'headings');
  const ids = [...post.html.matchAll(/id="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, 5);
  assert.deepEqual(post.headings.map((heading) => heading.id), ['section-2', 'section-3', 'section-5']);
});

test('Invalid publication dates, required fields and slugs fail the build', () => {
  for (const date of ['2026-02-30', '2026-13-01', 'yesterday']) assert.throws(() => parsePost(source('正文', date), 'invalid-date'), /日期/);
  assert.throws(() => parsePost(source('正文'), '../invalid'), /文件名/);
  assert.throws(() => parsePost(source('正文').replace("title: '测试文章'", ''), 'missing-title'), /title/);
});

test('Real articles are sorted newest first and have accessible covers', () => {
  const posts = loadPosts(resolve('content/posts'));
  assert.ok(posts.length >= 1);
  assert.deepEqual(posts.map((post) => post.date), posts.map((post) => post.date).sort().reverse());
  assert.ok(posts.every((post) => post.coverAlt && post.html && post.minutes > 0));
});

test('Search supports Chinese body text, multiple terms and normalized Latin text', () => {
  const posts = [parsePost(source('浏览器的 Shadow DOM 让组件样式隔离。'), 'search')];
  assert.equal(searchPosts(posts, '浏览器 隔离').length, 1);
  assert.equal(searchPosts(posts, 'ＳＨＡＤＯＷ lit').length, 1);
  assert.equal(searchPosts(posts, '浏览器 不存在').length, 0);
  assert.equal(searchPosts(posts, '  ').length, 1);
});

test('Unknown categories safely fall back to all posts', () => {
  assert.equal(categoryFromUrl('?category=%E7%94%9F%E6%B4%BB'), '生活');
  assert.equal(categoryFromUrl('?category=unknown'), '全部');
  assert.equal(categoryFromUrl(''), '全部');
});

test('Metadata is escaped for both HTML and XML attributes', () => {
  assert.equal(escapeHtml('<a "x"> & \'y\''), '&lt;a &quot;x&quot;&gt; &amp; &#39;y&#39;');
});
