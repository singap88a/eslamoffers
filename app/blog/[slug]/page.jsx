// "use client";
// import Head from "next/head";
// import Link from "next/link";
// import { useState, useEffect, Suspense } from "react";
// import { useRouter } from 'next/navigation';
// import dynamic from 'next/dynamic';

// function LoadingSpinner() {
//   return (
//     <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
//       <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600"></div>
//       <p className="text-gray-600 animate-pulse">جاري تحميل المحتوى...</p>
//     </div>
//   );
// }

// function formatDate(dateStr) {
//   const date = new Date(dateStr);
//   return date.toLocaleDateString("ar-EG", {
//     timeZone: "Africa/Cairo",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });
// }

// export default function SinglePost({ params }) {
//   const [post, setPost] = useState(null);
//   const [latestPosts, setLatestPosts] = useState([]);
//   const [allCategories, setAllCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     let isMounted = true;

//     const fetchData = async () => {
//       try {
//         // جلب التدوينة
//         const res = await fetch(
//           `https://eslamoffers.com/wp-json/wp/v2/posts?slug=${params.slug}&_embed`
//         );
//         const data = await res.json();
//         setPost(data[0]);

//         // جلب أحدث المقالات
//         const latestRes = await fetch(
//           `https://eslamoffers.com/wp-json/wp/v2/posts?per_page=5&_embed`
//         );
//         const latestData = await latestRes.json();
//         setLatestPosts(latestData);

//         // جلب التصنيفات
//         const catRes = await fetch(
//           `https://eslamoffers.com/wp-json/wp/v2/categories?per_page=10`
//         );
//         const catData = await catRes.json();
//         setAllCategories(catData);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchData();

//     return () => {
//       isMounted = false;
//     };
//   }, [params.slug]);

//   if (loading) {
//     return <LoadingSpinner />;
//   }
//   if (!post && !loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <div className="text-3xl font-bold text-red-600 mb-4">عذراً</div>
//         <div className="text-xl text-gray-600 mb-8">لم يتم العثور على التدوينة</div>
//         <Link href="/blog" className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition duration-300">
//           العودة إلى المدونة
//         </Link>
//       </div>
//     );
//   }
//   const author = post._embedded?.author?.[0];
//   const categories = post._embedded?.["wp:term"]?.[0] || [];
//   const tags = post._embedded?.["wp:term"]?.[1] || [];

//   // تم نقل عمليات جلب البيانات إلى useEffect

//   // مكون زر نسخ الكود
//   function CopyButton({ code }) {
//     const [copied, setCopied] = React.useState(false);
//     const handleCopy = async () => {
//       await navigator.clipboard.writeText(code);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 1200);
//     };
//     return (
//       <button
//         onClick={handleCopy}
//         className="absolute left-2 top-2 bg-teal-600 text-white px-3 py-1 rounded text-xs hover:bg-teal-700 transition z-10"
//         style={{direction: 'ltr'}}
//       >
//         {copied ? "تم النسخ!" : "نسخ الكود"}
//       </button>
//     );
//   }

//   // مكون لعرض الكود مع زر النسخ
//   function CodeWithCopy({ code, lang }) {
//     return (
//       <div className="relative my-4">
//         <CopyButton code={code} />
//         <pre className="rounded-lg bg-gray-900 text-white p-4 overflow-x-auto text-sm mt-2">
//           <code>{code}</code>
//         </pre>
//       </div>
//     );
//   }

//   // تحويل محتوى المقالة لإضافة زر نسخ للكود
//   function renderContentWithCopy(html) {
//     // استخدم DOMParser فقط في المتصفح
//     if (typeof window === "undefined") return <div dangerouslySetInnerHTML={{ __html: html }} />;
//     const parser = new window.DOMParser();
//     const doc = parser.parseFromString(html, "text/html");
//     const nodes = Array.from(doc.body.childNodes);
//     return nodes.map((node, i) => {
//       if (node.nodeName === "PRE" && node.querySelector("code")) {
//         const code = node.querySelector("code").textContent;
//         const lang = node.querySelector("code").className.replace("language-", "");
//         return <CodeWithCopy key={i} code={code} lang={lang} />;
//       }
//       return <div key={i} dangerouslySetInnerHTML={{ __html: node.outerHTML }} />;
//     });
//   }

//   return (
//     <div className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-6 gap-8 animate-fadeIn" dir="rtl">
//       {/* المحتوى الرئيسي */}
//       <div className="lg:col-span-4">
//         <Head>
//           <title>{post.title.rendered}</title>
//           <meta
//             name="description"
//             content={post.excerpt.rendered.replace(/<[^>]+>/g, "")}
//           />
//         </Head>
//         <div className="mb-6">
//           <Link href="/blog" className="text-teal-600 hover:underline">← العودة للمدونة</Link>
//         </div>
//         <h1 className="text-3xl font-bold mb-4">{post.title.rendered}</h1>
//         <div className="flex items-center gap-3 mb-4 text-gray-500 text-sm">
//           {author && (
//             <Link href={`/blog/author/${author.id}`} className="flex items-center gap-1 hover:text-teal-600">
//               {author.avatar_urls?.[48] && (
//                 <img 
//                   src={author.avatar_urls[48]} 
//                   alt={author.name} 
//                   className="w-8 h-8 rounded-full border"
//                   width={32}
//                   height={32}
//                 />
//               )}
//               <span>{author.name}</span>
//             </Link>
//           )}
//           <span>•</span>
//           <span>{formatDate(post.date)}</span>
//         </div>
//         <div className="mb-4">
//           {categories.map((cat) => (
//             <Link
//               key={cat.id}
//               href={`/blog/category/${cat.id}`}
//               className="inline-block bg-teal-100 text-teal-700 rounded px-2 py-0.5 text-xs mr-1 hover:bg-teal-200"
//             >
//               {cat.name}
//             </Link>
//           ))}
//         </div>
//         {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
//           <img
//             src={post._embedded["wp:featuredmedia"][0].source_url}
//             alt={post.title.rendered}
//             className="w-full max-h-96 object-cover rounded-xl mb-8 hover:scale-105 transition duration-300"
//             width={800}
//             height={450}
//             loading="lazy"
//           />
//         )}
//         {/* محتوى المقالة مع زر نسخ للكود */}
//         <div className="prose prose-lg max-w-none text-gray-800" style={{ marginTop: "2rem", lineHeight: "1.7" }}>
//           {renderContentWithCopy(post.content.rendered)}
//         </div>
//         <div className="mt-10">
//           <Link 
//             href="/blog" 
//             className="inline-block px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
//           >
//             ← العودة للمدونة
//           </Link>
//         </div>
//       </div>
//       {/* السايدبار */}
//       <aside className="lg:col-span-2 space-y-8 sticky top-0 pt-4 transition-all duration-300">
// {/* أحدث المقالات */}
// <div className="bg-white/80 backdrop-blur-md rounded-xl   p-6 border border-gray-300 hover:shadow-2xl transition-all duration-300">
//   <div className="flex items-center mb-5">
//     <svg className="w-6 h-6 text-teal-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
//       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
//     </svg>
//     <h3 className="text-2xl font-bold text-gray-800">أحدث المقالات</h3>
//   </div>
  
//   <ul className="space-y-5">
//     {latestPosts.map((item, index) => (
//       <li key={item.id} className="group relative flex items-start">
//         <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-teal-500 rounded-full transition-all group-hover:scale-125"></span>
//         <Link 
//           href={`/blog/${item.slug}`}
//           className="flex-1 text-gray-700 hover:text-teal-700 transition-colors duration-300 font-medium text-[15px] leading-relaxed pl-4"
//         >
//           {item.title.rendered}
//           <span className="block h-[1px] bg-gradient-to-r from-teal-100 to-transparent mt-2 w-full"></span>
//         </Link>
//       </li>
//     ))}
//   </ul>

//   <div className="mt-6 text-center">
//     <Link 
//       href="/blog"
//       className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-800 font-semibold transition-all duration-300"
//     >
//       تصفح المدونة كاملة
//       <svg className="w-4 h-4 rtl:ml-1 rtl:mr-0" fill="currentColor" viewBox="0 0 20 20">
//         <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//       </svg>
//     </Link>
//   </div>
// </div>

 
//       </aside>
//     </div>
//   );
// } 

import React from 'react'

export default function SinglePost() {
  return (
    <div>
      
    </div>
  )
}
