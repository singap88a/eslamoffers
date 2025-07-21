import Link from "next/link";
import Head from "next/head";

const API_URL = "https://eslamoffers.com/wp-json/wp/v2/posts?_embed";

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ar-EG", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function Blog() {
  const res = await fetch(API_URL, { next: { revalidate: 60 } });
  const posts = await res.json();

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <Head>
        <title>المدونة</title>
        <meta name="description" content="مقالات المدونة من وردبريس" />
      </Head>
      <h1 className="text-3xl font-bold mb-8 text-center">المدونة</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {posts.map((post) => {
          const author = post._embedded?.author?.[0];
          const categories = post._embedded?.["wp:term"]?.[0] || [];
          return (
            <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
              {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                <Link href={`/blog/${post.slug}`}>
                  <img
                    src={post._embedded["wp:featuredmedia"][0].source_url}
                    alt={post.title.rendered}
                    className="w-full h-56 object-cover hover:scale-105 transition duration-300 cursor-pointer"
                    width={600}
                    height={336}
                    loading="lazy"
                  />
                </Link>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <h2 className="text-xl font-bold mb-2 hover:text-teal-600 transition">
                  <Link href={`/blog/${post.slug}`}>{post.title.rendered}</Link>
                </h2>
                <div className="flex items-center gap-3 mb-2 text-gray-500 text-xs">
                  {author && (
                    <Link href={`/blog/author/${author.id}`} className="flex items-center gap-1 hover:text-teal-600">
                      {author.avatar_urls?.[48] && (
                        <img 
                          src={author.avatar_urls[48]} 
                          alt={author.name} 
                          className="w-6 h-6 rounded-full border"
                          width={24}
                          height={24}
                        />
                      )}
                      <span>{author.name}</span>
                    </Link>
                  )}
                  <span>•</span>
                  <span>{formatDate(post.date)}</span>
                </div>
                <div className="mb-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/blog/category/${cat.id}`}
                      className="inline-block bg-teal-100 text-teal-700 rounded px-2 py-0.5 text-xs mr-1 hover:bg-teal-200"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
                <div 
                  className="text-gray-700 mb-4 line-clamp-3" 
                  dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} 
                />
                <div className="mt-auto">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-block mt-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
                  >
                    اقرأ المزيد
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}