// Server layout for dynamic store metadata (title, description, keywords)

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  const API_BASE = "https://api.eslamoffers.com/api";

  let title = "Eslam Offers";
  let description = "أفضل العروض والخصومات على الإنترنت";
  let keywords = [ ];

  if (!slug) {
    return { title, description, keywords };
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
        if (store.headerDescription && typeof store.headerDescription === "string") {
          description = store.headerDescription;
        } else if (store.description && typeof store.description === "string") {
          description = store.description;
        } else {
          description = `جميع الكوبونات والعروض الخاصة بـ ${store.name}`;
        }

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

  // Support both string and array; Next.js accepts either
  return {
    title,
    description,
    keywords,
  };
}

export default function StoreLayout({ children }) {
  return children;
}


