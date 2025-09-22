import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import { Post } from '@/types'

const postsDirectory = path.join(process.cwd(), 'posts')

async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw) // Markdownに含まれる生のHTMLを許可
    .use(rehypeSlug) // 見出しにIDを付与
    .use(rehypeAutolinkHeadings, { behavior: 'append' }) // 見出しにリンク
    .use(rehypeExternalLinks, { target: '_blank', rel: ['nofollow', 'noopener', 'noreferrer'] })
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown)
  return result.toString()
}

export async function getAllPosts(): Promise<Post[]> {
  const fileNames = fs.readdirSync(postsDirectory).filter(fileName => fileName.endsWith('.md'))
  const posts = await Promise.all(fileNames.map(async (fileName) => {
    const slug = fileName.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    const htmlContent = await markdownToHtml(content)



    return {
      slug,
      title: data.title,
      content: htmlContent,
      createdAt: data.createdAt || data.date || '',
      updatedAt: data.updatedAt || data.date || '',
      author: data.author || '',
      tags: data.tags || []
    }
  }))

  return posts
}

export async function getPostBySlug(slug: string): Promise<Post> {
  if (!slug) {
    throw new Error('Slug is undefined')
  }
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: ${slug}`)
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const htmlContent = await markdownToHtml(content)

  // 画像パスを相対パスから絶対パスに変換
  const processedHtmlContent = htmlContent.replace(
    /src="\.\/images\//g,
    `src="/posts/images/`
  )

  return {
    slug,
    title: data.title,
    content: processedHtmlContent,
    createdAt: data.createdAt || data.date || '',
    updatedAt: data.updatedAt || data.date || '',
    author: data.author || '',
    tags: data.tags || []
  }
}