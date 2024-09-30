import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import { Post } from '@/types'

const postsDirectory = path.join(process.cwd(), 'posts')

async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown)
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

  return {
    slug,
    title: data.title,
    content: htmlContent,
    createdAt: data.createdAt || data.date || '',
    updatedAt: data.updatedAt || data.date || '',
    author: data.author || '',
    tags: data.tags || []
  }
}