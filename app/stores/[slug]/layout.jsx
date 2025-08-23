// Server layout for dynamic store metadata (title, description, keywords)

function cleanDescription(desc) {
  if (!desc || typeof desc !== "string") return "";
  const cleaned = desc.trim();

  // شيل النصوص التجريبية أو الغير مفيدة
  if (cleaned.toLowerCase().includes("string")) return "";
  if (/^\d+(\.\d+)?$/.test(cleaned)) return "";
  if (cleaned.length < 5) return ""; // نص قصير جدا غير مفيد

  return cleaned;
}

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  const API_BASE = "https://api.eslamoffers.com/api";

  let title = "Eslam Offers";
  let description = "أفضل العروض والخصومات على الإنترنت";
  let keywords = [];

  if (!slug) {
    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        url: "https://eslamoffers.com",
        siteName: "Eslam Offers",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  }

  try {
    const storeRes = await fetch(`${API_BASE}/Store/GetStoreBySlug/${slug}`, {
      cache: "no-store",
      next: { revalidate: 60 },
    });
    if (storeRes.ok) {
      const storeJson = await storeRes.json();
      const store = Array.isArray(storeJson) ? storeJson[0] : storeJson;

      if (store) {
        title = `${store.name} | Eslam Offers`;

        let desc = cleanDescription(store.headerDescription) 
                || cleanDescription(store.description);

        if (!desc) {
          desc = `جميع الكوبونات والعروض الخاصة بـ ${store.name}`;
        }
        description = desc;

        // Attempt to load tags to append to keywords
        try {
          if (store.id) {
            const tagsRes = await fetch(`${API_BASE}/Store/GetStoreTags/${store.id}`, {
              cache: "no-store",
              next: { revalidate: 60 },
            });
            if (tagsRes.ok) {
              const tags = await tagsRes.json();
              if (Array.isArray(tags)) {
                const tagStrings = tags
                  .map((t) => (t?.slug || t?.name || "").toString().trim())
                  .filter(Boolean);
                if (tagStrings.length > 0) {
                  keywords = Array.from(new Set([...keywords, ...tagStrings]));
                }
              }
            }
          }
        } catch {}
      }
    }
  } catch {}

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `https://eslamoffers.com/store/${slug}`,
      siteName: "Eslam Offers",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function StoreLayout({ children }) {
  return children;
}
