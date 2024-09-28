import Link from 'next/link'
import { getAllPosts } from '@/lib/api'
import { Post } from '@/types'

export default async function Home() {
  const posts: Post[] = await getAllPosts()

  return (
    <main>
      <h1>My Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/${post.slug}`}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}