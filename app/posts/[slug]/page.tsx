import { Post } from '@/types'
import { getPostBySlug, getAllPosts } from '@/lib/api'
import { notFound } from 'next/navigation'
import styles from './Post.module.css'

export default async function PostPage({ params }: { params: { slug: string } }) {
  try {
    const post: Post = await getPostBySlug(params.slug)
    
    return (
      <div className={styles.container}>
        <article className={styles.article}>
          <header className={styles.header}>
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles.meta}>
              <span className={styles.date}>作成日: {post.createdAt}</span>
              <span className={styles.date}>更新日: {post.updatedAt}</span>
              <span className={styles.author}>{post.author}</span>
            </div>
            <div className={styles.tags}>
              {post.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </header>
          <div 
            className={styles.content} 
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </article>
      </div>
    )
  } catch {
    notFound()
  }
}

export async function generateStaticParams() {
  const posts: Post[] = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}