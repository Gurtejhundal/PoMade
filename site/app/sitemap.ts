import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    '',
    '/features',
    '/templates',
    '/studio',
    '/install',
    '/docs',
    '/how-it-works',
    '/changelog',
  ].map((path) => ({ url: `https://pomade-swart.vercel.app${path}` }));
}
