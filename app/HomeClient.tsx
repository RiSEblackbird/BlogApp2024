'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { Post } from '@/types'
import { FaGithub } from 'react-icons/fa'

export default function HomeClient({ initialPosts }: { initialPosts: Post[] }) {
  // 元データ
  const [rawPosts] = useState(initialPosts)

  // ソート状態
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  // 検索入力状態（フォームの入力値）
  const [searchMethod, setSearchMethod] = useState<'contains' | 'startsWith' | 'endsWith'>('contains')
  const [searchText, setSearchText] = useState('')

  // 適用済みの検索条件（ボタン押下で更新）
  const [appliedMethod, setAppliedMethod] = useState<'contains' | 'startsWith' | 'endsWith'>('contains')
  const [appliedText, setAppliedText] = useState('')

  const handleSearch = () => {
    setAppliedMethod(searchMethod)
    setAppliedText(searchText)
  }

  // 表示用配列（検索→ソートの順で派生）
  const displayPosts = useMemo(() => {
    const text = appliedText.trim().toLowerCase()
    const filtered = text
      ? rawPosts.filter((post) => {
          const target = (post.title || '').toLowerCase()
          if (appliedMethod === 'startsWith') return target.startsWith(text)
          if (appliedMethod === 'endsWith') return target.endsWith(text)
          return target.includes(text)
        })
      : rawPosts

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a[sortBy as keyof Post] as string).getTime()
      const dateB = new Date(b[sortBy as keyof Post] as string).getTime()
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
    })
    return sorted
  }, [rawPosts, appliedText, appliedMethod, sortBy, sortOrder])

  return (
    <main className="container mx-auto px-4 py-8 relative">
      <Link href="https://github.com/RiSEblackbird/BlogApp2024" className="absolute top-4 right-4" target="_blank" rel="noopener noreferrer">
        <FaGithub className="text-3xl text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200" />
      </Link>
      
      <h1 className="text-4xl font-bold mb-4 text-center">あれこれ</h1>
      
      <div className="text-center mb-8">
        <Link href="https://github.com/RiSEblackbird/BlogApp2024/issues" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          サイト更新予定（GitHubのIssue）
        </Link>
      </div>

      <div className="flex justify-end items-center mb-4">
        <div className="flex items-center mr-2">
          <select
            value={searchMethod}
            onChange={(e) => setSearchMethod(e.target.value as 'contains' | 'startsWith' | 'endsWith')}
            className="mr-2 p-2 border rounded text-black"
          >
            <option value="contains">部分一致</option>
            <option value="startsWith">前方一致</option>
            <option value="endsWith">後方一致</option>
          </select>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="タイトルを検索"
            className="mr-2 p-2 border rounded text-black"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            検索
          </button>
        </div>

        <div className="flex items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="mr-2 p-2 border rounded text-black"
          >
            <option value="createdAt">作成日時</option>
            <option value="updatedAt">更新日時</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="mr-2 p-2 border rounded text-black"
          >
            <option value="desc">降順</option>
            <option value="asc">昇順</option>
          </select>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayPosts.map((post) => (
          <Link key={post.slug} href={`/posts/${post.slug}`} className="block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{post.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  作成日: {new Date(post.createdAt).toLocaleString()} • 
                  更新日: {new Date(post.updatedAt).toLocaleString()} • 
                  {post.author}
                </p>
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