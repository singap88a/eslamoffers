// Server layout for dynamic category metadata (title, description, keywords)

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  const API_BASE = "https://api.eslamoffers.com/api";

  let title = "Eslam Offers";
  let description = "أفضل العروض والخصومات على الإنترنت";
  let keywords = [];

  if (!slug) {
    return { title, description, keywords };
  }

  try {
    // Get all categories and find the one with matching slug
    const categoriesRes = await fetch(`${API_BASE}/Category/GetAllCategories`, {
      cache: "no-store",
      next: { revalidate: 60 },
    });
    
    if (categoriesRes.ok) {
      const categories = await categoriesRes.json();
      const category = categories.find(cat => 
        cat.slug === slug || cat.id === slug
      );
      
      if (category) {
        title = `${category.name} | Eslam Offers`;
        if (category.altText && typeof category.altText === "string") {
          description = category.altText;
        } else {
          description = `جميع الكوبونات والعروض الخاصة بفئة ${category.name}`;
        }

        // Attempt to load tags to append to keywords
        try {
          if (category.id) {
            const tagsRes = await fetch(`${API_BASE}/Category/GetCategoryTags/${category.id}`, {
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
        } catch (error) {
          console.error('Error fetching category tags:', error);
        }
      }
    }
  } catch (error) {
    console.error('Error fetching category data:', error);
  }

  // Support both string and array; Next.js accepts either
  return {
    title,
    description,
    keywords,
  };
}

export default function CategoryLayout({ children }) {
  return children;
}
