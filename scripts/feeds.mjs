import { escapeHtml as e } from './content.mjs';

export function generateFeeds(posts, site, origin) {
  const paths = ['/', '/archive', '/about', ...posts.map((post) => `/posts/${post.slug}`)];
  return {
    '/sitemap.xml': `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${e(origin + path)}</loc></url>`).join('')}</urlset>`,
    '/robots.txt': `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
    '/rss.xml': `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${e(site.name)}</title><link>${e(origin)}</link><description>${e(site.description)}</description><language>zh-cn</language>${posts.map((post) => `<item><title>${e(post.title)}</title><link>${e(origin)}/posts/${post.slug}</link><guid>${e(origin)}/posts/${post.slug}</guid><description>${e(post.description)}</description><pubDate>${new Date(post.date).toUTCString()}</pubDate></item>`).join('')}</channel></rss>`,
  };
}
