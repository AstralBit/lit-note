import { defineConfig, loadEnv, type Plugin } from 'vite';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { loadPosts, escapeHtml as e } from './scripts/content.mjs';
import { generateFeeds } from './scripts/feeds.mjs';
import { site } from './src/site';

function blogPlugin(origin: string): Plugin {
  let isBuild = false;
  const contentDirectory = resolve('content/posts');
  const virtualId = '\0virtual:blog-content';
  const getPosts = () => {
    const posts = loadPosts(contentDirectory);
    for (const post of posts) if (!existsSync(resolve('public', `.${post.cover}`))) throw new Error(`封面文件不存在: ${post.cover}`);
    return posts;
  };
  return {
    name: 'moment-markdown',
    configResolved(config) { isBuild = config.command === 'build'; },
    resolveId(id) { if (id === 'virtual:blog-content') return virtualId; },
    load(id) { if (id === virtualId) return `export const posts = ${JSON.stringify(getPosts())};`; },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url || '/', origin).pathname;
        if (!['/rss.xml', '/sitemap.xml', '/robots.txt'].includes(pathname)) return next();
        const feeds = generateFeeds(getPosts(), site, origin);
        response.setHeader('Content-Type', pathname.endsWith('.xml') ? 'application/xml; charset=utf-8' : 'text/plain; charset=utf-8');
        response.end(feeds[pathname as keyof typeof feeds]);
      });
      server.watcher.add(contentDirectory);
      server.watcher.on('all', (_event, file) => {
        if (file.startsWith(contentDirectory) && file.endsWith('.md')) {
          const module = server.moduleGraph.getModuleById(virtualId);
          if (module) server.moduleGraph.invalidateModule(module);
          server.ws.send({ type: 'full-reload' });
        }
      });
    },
    configurePreviewServer(server) {
      const routes = new Set(['/', '/archive', '/about', ...getPosts().map((post) => `/posts/${post.slug}`)]);
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url || '/', origin).pathname.replace(/\/+$/, '') || '/';
        if (routes.has(pathname) || /\.[a-z0-9]+$/i.test(pathname)) return next();
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.end(readFileSync(resolve('dist/404.html')));
      });
    },
    closeBundle() {
      if (!isBuild) return;
      const posts = getPosts();
      const template = readFileSync(resolve('dist/index.html'), 'utf8');
      const navigation = `<header class="static-header"><a href="/">✳ 片刻</a><nav><a href="/">文章</a><a href="/archive">归档</a><a href="/about">关于</a></nav></header>`;
      const links = posts.map((post) => `<article><p>${e(post.date)} · ${e(post.category)}</p><h2><a href="/posts/${post.slug}">${e(post.title)}</a></h2><p>${e(post.description)}</p></article>`).join('');
      const writePage = (path: string, title: string, description: string, body: string, extra = '') => {
        const url = `${origin}${path === '/' ? '/' : path}`;
        const html = template.replace(/<title>.*?<\/title>/, `<title>${e(title)}</title>`).replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${e(description)}" />`).replace('</head>', `<link rel="canonical" href="${e(url)}" /><meta property="og:title" content="${e(title)}" /><meta property="og:description" content="${e(description)}" /><meta property="og:url" content="${e(url)}" /><meta property="og:locale" content="zh_CN" />${extra}</head>`).replace('<blog-app></blog-app>', `<blog-app>${navigation}<main class="static-content">${body}</main><footer class="static-footer">© ${new Date().getFullYear()} 片刻 · 用文字收藏生活。<a href="/rss.xml">RSS</a></footer></blog-app>`);
        const destination = resolve('dist', path === '/' ? 'index.html' : `${path.slice(1)}.html`);
        mkdirSync(dirname(destination), { recursive: true });
        writeFileSync(destination, html);
      };
      writePage('/', `${site.name} · ${site.tagline.replace('。', '')}`, site.description, `<h1>写下此刻，留给以后。</h1><p>${e(site.description)}</p>${links}`);
      writePage('/archive', '文章归档 · 片刻', '沿着时间，回看写下的每一个片刻。', `<h1>文字的时间线</h1>${links}`);
      writePage('/about', '关于 · 片刻', site.intro.replace('\n', ''), `<h1>你好，我是${e(site.author)}。</h1><p>${e(site.intro)}</p><h2>关于这个小小的角落</h2><p>记录技术、设计与日常，留下一些认真生活的痕迹。</p>`);
      writePage('/404', '页面未找到 · 片刻', '这一页，暂时走丢了。', '<h1>这一页，暂时走丢了。</h1><a href="/">回到首页</a>', '<meta name="robots" content="noindex" />');
      for (const post of posts) {
        const structured = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.description, datePublished: post.date, author: { '@type': 'Person', name: site.author }, image: `${origin}${post.cover}`, mainEntityOfPage: `${origin}/posts/${post.slug}` };
        writePage(`/posts/${post.slug}`, `${post.title} · 片刻`, post.description, `<article><p>${e(post.category)} · ${e(post.date)}</p><h1>${e(post.title)}</h1><p>${e(post.description)}</p><img src="${e(post.cover)}" alt="${e(post.coverAlt)}" />${post.html}</article>`, `<meta property="og:type" content="article" /><meta property="og:image" content="${origin}${e(post.cover)}" /><script type="application/ld+json">${JSON.stringify(structured).replace(/</g, '\\u003c')}</script>`);
      }
      for (const [path, content] of Object.entries(generateFeeds(posts, site, origin))) writeFileSync(resolve('dist', path.slice(1)), content);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'SITE_');
  const origin = (process.env.SITE_URL || env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173')).replace(/\/$/, '');
  if (!/^https?:$/.test(new URL(origin).protocol)) throw new Error('SITE_URL 必须是 http 或 https 地址');
  return { plugins: [blogPlugin(origin)], build: { target: 'es2022' } };
});
