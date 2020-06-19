export interface Book {
  bookId: string
  createdBy: string
  createdAt: string
  name: string
  author: string
  summary: string
  modifiable: boolean
  score?: number
  coverUrl?: string
}
