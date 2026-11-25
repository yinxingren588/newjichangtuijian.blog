import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';

const ROUTE_SEO_RULES = [
  { match: (path) => path === '/', changefreq: ChangeFreqEnum.DAILY, priority: 1.0 },
  { match: (path) => path === '/ranking/' || path === '/comparison/', changefreq: ChangeFreqEnum.DAILY, priority: 0.9 },
  { match: (path) => path === '/isp-guide/', changefreq: ChangeFreqEnum.WEEKLY, priority: 0.9 },
  { match: (path) => path === '/posts/', changefreq: ChangeFreqEnum.DAILY, priority: 0.8 },
  { match: (path) => path.startsWith('/posts/'), changefreq: ChangeFreqEnum.WEEKLY, priority: 0.8 },
  { match: (path) => path === '/about/', changefreq: ChangeFreqEnum.MONTHLY, priority: 0.6 },
  { match: (path) => path === '/sitemap/', changefreq: ChangeFreqEnum.WEEKLY, priority: 0.5 },
];

// https://astro.build/config
export default defineConfig({
  site: 'https://newjichangtuijian.blog',
  trailingSlash: 'always',
  integrations: [
    tailwind(),
    sitemap({
      changefreq: ChangeFreqEnum.WEEKLY,
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        const pathname = new URL(item.url).pathname;
        const rule = ROUTE_SEO_RULES.find((r) => r.match(pathname));
        if (rule) {
          item.changefreq = rule.changefreq;
          item.priority = rule.priority;
        }
        return item;
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
