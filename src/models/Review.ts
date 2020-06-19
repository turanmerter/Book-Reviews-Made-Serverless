export interface Review {
  reviewId: string
  bookId: string
  createdBy: string
  createdAt: string
  comment: string
  score: number
  modifiable: boolean
}