import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path: imagePath } = req.query

  // 画像パスの検証（セキュリティ対策）
  if (typeof imagePath !== 'string' && !Array.isArray(imagePath)) {
    return res.status(400).json({ error: 'Invalid image path' })
  }

  const filePath = path.join(process.cwd(), 'posts', 'images', Array.isArray(imagePath) ? imagePath.join('/') : imagePath)

  // ファイルの存在確認
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Image not found' })
  }

  // Content-Typeの設定
  const ext = path.extname(filePath).toLowerCase()
  let contentType = 'application/octet-stream'
  if (ext === '.png') contentType = 'image/png'
  else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
  else if (ext === '.gif') contentType = 'image/gif'

  // 画像の読み込みと送信
  const imageBuffer = fs.readFileSync(filePath)
  res.setHeader('Content-Type', contentType)
  res.send(imageBuffer)
}