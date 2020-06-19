import * as uuid from 'uuid'
import { ReviewAccess } from '../dataLayer/reviewAccess'
import { BookAccess } from '../dataLayer/bookAccess'

import { Review } from '../models/Review'

import { CreateReviewRequest } from "../requests/CreateReviewRequest";
import { UpdateReviewRequest } from "../requests/UpdateReviewRequest";

const reviewAccess = new ReviewAccess()
const bookAccess = new BookAccess()

export async function getAllReviewsForBook(userId: string, bookId: string): Promise<Review[]> {
    const reviews = await reviewAccess.getAllReviewsForBook(bookId);

    if (reviews) {
        for (let index = 0; index < reviews.length; index++) {
            const review = reviews[index];
            review.modifiable = review.createdBy === userId
        }
    }

    return reviews
}

export async function createReview(userId: string, bookId: string, newReviewRequest: CreateReviewRequest): Promise<Review> {

    const book = await bookAccess.getBook(bookId);
    console.log("book read ", book)
    if (!book) {
        return null;
    }

    const reviewId = uuid.v4()
    const newReview = {
        reviewId: reviewId,
        bookId: bookId,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        comment: newReviewRequest.comment,
        score: newReviewRequest.score
    } as Review;

    const creationResult = await reviewAccess.createReview(newReview)

    const reviews = await reviewAccess.getAllReviewsForBook(bookId)
    let totalScore = 0;
    if (reviews) {
        for (let index = 0; index < reviews.length; index++) {
            const review = reviews[index];
            totalScore += review.score;
        }
        book.score = totalScore / reviews.length;
    } else {
        book.score = 0
    }
    await bookAccess.updateBookScore(book);

    return creationResult
}

export async function deleteReview(userId: string, reviewId: string) {

    const review = await reviewAccess.getReview(reviewId)
    if (!review)
        return

    if (review.createdBy !== userId) {
        throw Error('You cannot delete somebody else\'s review');
    }

    const bookId = review.bookId;
    const book = await bookAccess.getBook(bookId);
    if (!book) {
        return null;
    }

    const deletionResult = await reviewAccess.deleteReview(reviewId)
    const reviews = await reviewAccess.getAllReviewsForBook(bookId);
    let totalScore = 0;
    if (reviews) {
        for (let index = 0; index < reviews.length; index++) {
            const review = reviews[index];
            totalScore += review.score;
        }
        book.score = totalScore / reviews.length;
    } else {
        book.score = 0
    }
    
    await bookAccess.updateBookScore(book);

    return deletionResult
}

export async function updateReview(userId: string, reviewId: string, updatedReviewRequest: UpdateReviewRequest) {
    const review = await reviewAccess.getReview(reviewId)
    if (review) {

        if (review.createdBy !== userId) {
            throw Error('You cannot update somebody else\'s review');
        }

        const bookId = review.bookId;
        const book = await bookAccess.getBook(bookId);
        if (!book) {
            return null;
        }

        review.comment = updatedReviewRequest.comment;
        review.score = updatedReviewRequest.score;
        const updateResult = await reviewAccess.updateReview(review)

        const reviews = await reviewAccess.getAllReviewsForBook(bookId);
        let totalScore = 0;
        if (reviews) {
            for (let index = 0; index < reviews.length; index++) {
                const review = reviews[index];
                totalScore += review.score;
            }
            book.score = totalScore / reviews.length;
        } else {
            book.score = 0
        }
        await bookAccess.updateBookScore(book);

        return updateResult
    }
}


