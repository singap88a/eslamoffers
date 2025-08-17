// "use client";

// import Link from "next/link";
// import Head from "next/head";

// const API_URL = "https://eslamoffers.com/wp-json/wp/v2/posts?_embed";

// function formatDate(dateStr) {
//   const date = new Date(dateStr);
//   return date.toLocaleDateString("ar-EG", {
//     timeZone: "Africa/Cairo",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });
// }


// import { useState, useEffect } from 'react';
// import { Suspense } from 'react';

// export default function Blog() {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const res = await fetch(API_URL);
//         const data = await res.json();
//         setPosts(data);
//       } catch (error) {
//         console.error('Error fetching posts:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPosts();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto py-10 px-4">
//       <Head>
//         <title>المدونة | إسلام أوفرز</title>
//         <meta name="description" content="اكتشف أحدث المقالات والنصائح في مدونة إسلام أوفرز" />
//       </Head>
//       <h1 className="text-4xl font-bold mb-16 text-center text-teal-800 relative">
//         <span className="relative inline-block">
//           المدونة
//           <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-teal-500"></div>
//         </span>
//       </h1>
      
//       {/* Featured Section */}
//       <div className="grid lg:grid-cols-2 gap-8 mb-16">
//         {/* Main Featured Post */}
//         {posts[0] && (
//           <div className="lg:col-span-1 h-[600px] relative overflow-hidden rounded-2xl shadow-xl group">
//             <Link href={`/blog/${posts[0].slug}`} className="block h-full">
//               <img
//                 src={posts[0]._embedded?.['wp:featuredmedia']?.[0]?.source_url}
//                 alt={posts[0].title.rendered}
//                 className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
//                 width={800}
//                 height={600}
//                 loading="eager"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
//                 <div className="absolute bottom-0 p-8 text-white">
//                   <div className="mb-4 flex gap-2">
//                     {posts[0]._embedded?.['wp:term']?.[0]?.slice(0, 2).map((cat) => (
//                       <span key={cat.id} className="bg-teal-500/80 px-3 py-1 rounded-full text-sm">{cat.name}</span>
//                     ))}
//                   </div>
//                   <h2 className="text-3xl font-bold mb-4 group-hover:text-teal-400 transition">{posts[0].title.rendered}</h2>
//                   <div className="line-clamp-3" dangerouslySetInnerHTML={{ __html: posts[0].excerpt.rendered }} />
//                 </div>
//               </div>
//             </Link>
//           </div>
//         )}
        
//         {/* Secondary Featured Posts */}
//         <div className="lg:col-span-1 grid gap-8">
//           {posts.slice(1, 3).map((post) => (
//             <div key={post.id} className="relative h-[290px] overflow-hidden rounded-xl shadow-lg group">
//               <Link href={`/blog/${post.slug}`} className="block h-full">
//                 <img
//                   src={post._embedded?.['wp:featuredmedia']?.[0]?.source_url}
//                   alt={post.title.rendered}
//                   className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
//                   width={600}
//                   height={290}
//                   loading="eager"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
//                   <div className="absolute bottom-0 p-6 text-white">
//                     <div className="mb-3 flex gap-2">
//                       {post._embedded?.['wp:term']?.[0]?.slice(0, 1).map((cat) => (
//                         <span key={cat.id} className="bg-teal-500/80 px-2 py-0.5 rounded-full text-sm">{cat.name}</span>
//                       ))}
//                     </div>
//                     <h3 className="text-xl font-bold group-hover:text-teal-400 transition">{post.title.rendered}</h3>
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Recent Posts Grid */}
//       <div className="mb-16">
//         <h2 className="text-2xl font-bold mb-8 text-teal-800">أحدث المقالات</h2>
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {posts.slice(3).map((post) => {
//           const author = post._embedded?.author?.[0];
//           const categories = post._embedded?.["wp:term"]?.[0] || [];
//           return (
//             <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//               <div className="relative">
//                 {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
//                   <Link href={`/blog/${post.slug}`} className="block aspect-[16/10] overflow-hidden">
//                     <img
//                       src={post._embedded["wp:featuredmedia"][0].source_url}
//                       alt={post.title.rendered}
//                       className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
//                       width={600}
//                       height={375}
//                       loading="lazy"
//                     />
//                   </Link>
//                 )}
//                 <div className="absolute top-4 right-4 flex gap-2">
//                   {categories.slice(0, 2).map((cat) => (
//                     <Link
//                       key={cat.id}
//                       href={`/blog/category/${cat.id}`}
//                       className="bg-white/90 backdrop-blur-sm text-teal-700 rounded-full px-3 py-1 text-xs font-medium hover:bg-teal-50 transition"
//                     >
//                       {cat.name}
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//               <div className="p-6">
//                 <h2 className="text-xl font-bold mb-3 group-hover:text-teal-600 transition line-clamp-2">
//                   <Link href={`/blog/${post.slug}`}>{post.title.rendered}</Link>
//                 </h2>
//                 <div 
//                   className="text-gray-600 mb-4 line-clamp-2 text-sm" 
//                   dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} 
//                 />
//                 <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                   {author && (
//                     <Link href={`/blog/author/${author.id}`} className="flex items-center gap-2 group/author">
//                       {author.avatar_urls?.[48] && (
//                         <img 
//                           src={author.avatar_urls[48]} 
//                           alt={author.name} 
//                           className="w-8 h-8 rounded-full border-2 border-white group-hover/author:border-teal-200 transition"
//                           width={32}
//                           height={32}
//                         />
//                       )}
//                       <div className="flex flex-col">
//                         <span className="text-sm font-medium group-hover/author:text-teal-600 transition">{author.name}</span>
//                         <span className="text-xs text-gray-500">{formatDate(post.date)}</span>
//                       </div>
//                     </Link>
//                   )}
//                   <Link
//                     href={`/blog/${post.slug}`}
//                     className="flex items-center gap-1 text-teal-600 group/link"
//                   >
//                     <span className="text-sm font-medium group-hover/link:text-teal-700 transition">اقرأ المزيد</span>
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform rotate-180 group-hover/link:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//                     </svg>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//       </div>
      
//       {/* Loading State */}
//       {!posts.length && (
//         <div className="flex flex-col items-center justify-center py-20">
//           <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
//           <p className="text-gray-600">جاري تحميل المقالات...</p>
//         </div>
//       )}
//     </div>
//   );
// } 
import React from 'react'

export default function Blog() {
  return (
    <div>
      Blog
    </div>
  )
}
