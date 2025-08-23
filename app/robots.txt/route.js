export async function GET() {
  const robots = `
User-agent: *
Allow: /
Disallow: /tag/
Disallow: /blog/wp-admin/
Disallow: /blog/trackback/
Disallow: /blog/xmlrpc.php
Disallow: /blog/feed/
Disallow: /blog/tag/
Disallow: /blog/search/
Disallow: /blog/*blackhole
Disallow: /blog/?blackhole
Allow: /blog/wp-admin/admin-ajax.php

Sitemap: https://eslamoffers.com/sitemap.xml
Sitemap: https://eslamoffers.com/blog/post-sitemap.xml
  `.trim();

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
} // ← أضف