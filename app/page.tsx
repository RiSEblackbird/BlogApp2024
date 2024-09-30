import { getAllPosts } from '@/lib/api'
import { Post } from '@/types'
import HomeClient from './HomeClient'

export default async function Home() {
  const posts = await getAllPosts()

  return <HomeClient initialPosts={posts} />
}