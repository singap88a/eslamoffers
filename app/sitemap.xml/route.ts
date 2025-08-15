// app/sitemap.xml/route.ts
export const revalidate = 86400; 
export const dynamic = "force-static";

type UrlEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

const ISO_DATE = (d = new Date()) => d.toISOString().split("T")[0];

const escapeXml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const buildXml = (urls: UrlEntry[]) => {
  const nodes = urls
    .map((u) => {
      const loc = escapeXml(u.loc);
      const lastmod = u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : "";
      const changefreq = u.changefreq ? `<changefreq>${u.changefreq}</changefreq>` : "";
      const priority =
        typeof u.priority === "number" ? `<priority>${u.priority.toFixed(1)}</priority>` : "";
      return `  <url>
    <loc>${loc}</loc>
    ${lastmod}
    ${changefreq}
    ${priority}
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${nodes}
</urlset>`;
};

async function fetchApiSitemap(): Promise<UrlEntry[]> {
  const SITE_URL = process.env.SITE_URL ?? "https://eslamoffers.com";
  const API_BASE = process.env.API_BASE ?? "https://api.eslamoffers.com";

  try {
    const response = await fetch(`${API_BASE}/sitemap.xml`, {
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const xmlText = await response.text();
    const urls = parseXmlUrls(xmlText);

    return urls.map(url => ({
      ...url,
      loc: url.loc.replace(API_BASE, SITE_URL)
    }));

  } catch (error) {
    console.error('Failed to fetch sitemap from API:', error);
    return [];
  }
}


function parseXmlUrls(xmlText: string): UrlEntry[] {
  const urls: UrlEntry[] = [];
  const locRegex = /<loc>(.*?)<\/loc>/g;
  const lastmodRegex = /<lastmod>(.*?)<\/lastmod>/g;
  const changefreqRegex = /<changefreq>(.*?)<\/changefreq>/g;
  const priorityRegex = /<priority>(.*?)<\/priority>/g;

  const locMatches = xmlText.match(locRegex) || [];
  const lastmodMatches = xmlText.match(lastmodRegex) || [];
  const changefreqMatches = xmlText.match(changefreqRegex) || [];
  const priorityMatches = xmlText.match(priorityRegex) || [];

  for (let i = 0; i < locMatches.length; i++) {
    const loc = locMatches[i].replace(/<\/?loc>/g, '');
    const lastmod = lastmodMatches[i]?.replace(/<\/?lastmod>/g, '');
    const changefreq = changefreqMatches[i]?.replace(/<\/?changefreq>/g, '') as UrlEntry['changefreq'];
    const priority = priorityMatches[i] ? parseFloat(priorityMatches[i].replace(/<\/?priority>/g, '')) : undefined;

    urls.push({
      loc,
      lastmod,
      changefreq,
      priority
    });
  }

  return urls;
}

export async function GET() {
  const urls = await fetchApiSitemap();

  // إضافة الصفحات الأساسية إذا لم تكن موجودة
  const today = ISO_DATE();
  const defaultUrls: UrlEntry[] = [
    { loc: `${process.env.SITE_URL || 'https://eslamoffers.com'}/`, lastmod: today, changefreq: "daily", priority: 0.9 },
    { loc: `${process.env.SITE_URL || 'https://eslamoffers.com'}/about`, lastmod: today, changefreq: "weekly", priority: 0.5 },
    { loc: `${process.env.SITE_URL || 'https://eslamoffers.com'}/contact`, lastmod: today, changefreq: "monthly", priority: 0.4 }
  ];


  // تصفية URLs لإزالة التكرارات
  const filteredUrls = urls.filter(url =>
    !defaultUrls.some(defaultUrl => defaultUrl.loc === url.loc)
  );

  const allUrls = [...defaultUrls, ...filteredUrls] as UrlEntry[];


  const xml = buildXml(allUrls);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}