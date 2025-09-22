import { Post } from '@/types'
import { getPostBySlug, getAllPosts } from '@/lib/api'
import { notFound } from 'next/navigation'
import Link from 'next/link' // Linkコンポーネントをインポート
import styles from './Post.module.css'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const post: Post = await getPostBySlug(params.slug)
    return {
      title: post.title,
      description: post.content.substring(0, 200), // 最初の200文字を説明として使用
      openGraph: {
        title: post.title,
        description: post.content.substring(0, 200),
        url: `https://blog-app2024-areyakoreya.vercel.app/posts/${post.slug}`,
        type: 'article',
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt,
        authors: [post.author],
        tags: post.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.content.substring(0, 200),
      },
    }
  } catch {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
    }
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  try {
    const post: Post = await getPostBySlug(params.slug)
    
    return (
      <div className={styles.container}>
        <div className={styles.topRightLink}>
          <Link href="/">一覧に戻る</Link>
        </div>
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
            className={`${styles.content} prose prose-invert max-w-none`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
        <div className={styles.bottomRightLink}>
          <Link href="/">一覧に戻る</Link>
        </div>
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