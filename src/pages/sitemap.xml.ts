import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site?.toString() || 'https://newjichangtuijian.blog').replace(/\/$/, '');
  const nowIso = new Date().toISOString();

  const posts = await getCollection('blog');
  const sortedPosts = [...posts].sort(
    (a, b) => (b.data.updatedDate ?? b.data.pubDate).valueOf() - (a.data.updatedDate ?? a.data.pubDate).valueOf()
  );

  const latestPostDate =
    sortedPosts.length > 0
      ? (sortedPosts[0].data.updatedDate ?? sortedPosts[0].data.pubDate).toISOString()
      : nowIso;

  const staticRoutes: SitemapEntry[] = [
    { loc: `${baseUrl}/`, lastmod: nowIso, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/ranking/`, lastmod: nowIso, changefreq: 'daily', priority: '0.9' },
    { loc: `${baseUrl}/comparison/`, lastmod: nowIso, changefreq: 'daily', priority: '0.9' },
    { loc: `${baseUrl}/isp-guide/`, lastmod: nowIso, changefreq: 'weekly', priority: '0.9' },
    { loc: `${baseUrl}/posts/`, lastmod: latestPostDate, changefreq: 'daily', priority: '0.8' },
    { loc: `${baseUrl}/about/`, lastmod: nowIso, changefreq: 'monthly', priority: '0.6' },
    { loc: `${baseUrl}/sitemap/`, lastmod: nowIso, changefreq: 'weekly', priority: '0.5' },
  ];

  const postRoutes: SitemapEntry[] = sortedPosts.map((post) => ({
    loc: `${baseUrl}/posts/${post.slug}/`,
    lastmod: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
    changefreq: 'weekly',
    priority: '0.8',
  }));

  const entries = [...staticRoutes, ...postRoutes];

  const xmlBody = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlBody}
</urlset>
`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
