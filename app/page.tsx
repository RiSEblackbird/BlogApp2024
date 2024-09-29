import Link from 'next/link'
import { getAllPosts } from '@/lib/api'
import { Post } from '@/types'

export default async function Home() {
  const posts: Post[] = await getAllPosts()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">My Blog</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/posts/${post.slug}`} className="block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{post.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{post.date} • {post.author}</p>
                <div className="mt-4">
                  {post.tags.map((tag) => (
                    <span key={tag} className="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2 mb-2">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}

// import Link from 'next/link'
// import { getAllPosts } from '@/lib/api'
// import { Post } from '@/types'

// export default async function Home() {
//   const posts: Post[] = await getAllPosts()

//   return (
//     <main>
//       <h1>My Blog</h1>
//       <ul>
//         {posts.map((post) => (
//           <li key={post.slug}>
//             <Link href={`/posts/${post.slug}`}>
//               {post.title}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </main>
//   )
// }