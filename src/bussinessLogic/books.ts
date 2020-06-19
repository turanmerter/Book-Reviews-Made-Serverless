import * as uuid from 'uuid'
import { BookAccess } from '../dataLayer/bookAccess'
import { ReviewAccess } from '../dataLayer/reviewAccess'

import { Book } from '../models/Book'

import { CreateBookRequest } from "../requests/CreateBookRequest";
import { UpdateBookRequest } from "../requests/UpdateBookRequest";

const bookAccess = new BookAccess()
const reviewAccess = new ReviewAccess()

export async function getAllBooks(userId: string): Promise<Book[]> {

    const books = await bookAccess.getAllBooks();
    if (books) {
        for (let index = 0; index < books.length; index++) {
            const book = books[index];
            book.modifiable = book.createdBy === userId
            book.coverUrl = await bookAccess.getBookCoverUrl(book.bookId);
        }
    }
    return books
}

export async function createBook(userId: string, newBookRequest: CreateBookRequest): Promise<Book> {
    const bookId = uuid.v4()

    const newBook = {
        bookId: bookId,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        name: newBookRequest.name,
        author: newBookRequest.author,
        summary: newBookRequest.summary,
        score: 0
    } as Book;

    return await bookAccess.createBook(newBook)
}

export async function deleteBook(userId: string, bookId: string) {

    const book = await bookAccess.getBook(bookId)

    if (book.createdBy !== userId) {
        throw Error('You cannot delete somebody else\'s book');
    }

    const deletionResult = await bookAccess.deleteBook(bookId)
    const reviews = await reviewAccess.getAllReviewsForBook(bookId)
    if (reviews) {
        for (let index = 0; index < reviews.length; index++) {
            const review = reviews[index];
            await reviewAccess.deleteReview(review.reviewId);
        }
    }
    return deletionResult
}

export async function getBookCoverUploadUrl(userId: string, todoId: string): Promise<string> {
    return bookAccess.getBookCoverUploadUrl(userId, todoId)
}

export async function updateBook(userId: string, bookId: string, updatedBookRequest: UpdateBookRequest) {
    const book = await bookAccess.getBook(bookId)
    if (book) {

        if (book.createdBy !== userId) {
            throw Error('You cannot update somebody else\'s book');
        }

        book.name = updatedBookRequest.name;
        book.author = updatedBookRequest.author;
        book.summary = updatedBookRequest.summary;
        console.log("update object", {
            book
        });
        await bookAccess.updateBook(book)
    }
}