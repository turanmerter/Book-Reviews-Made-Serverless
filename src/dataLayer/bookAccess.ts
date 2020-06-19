import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { Book } from '../models/Book'

const XAWS = AWSXRay.captureAWS(AWS)

export class BookAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly s3: AWS.S3 = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly booksTable = process.env.BOOKS_TABLE,
        private readonly bucketName = process.env.BOOK_COVERS_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
        ) {
    }

    async getAllBooks(): Promise<Book[]> {

        const result = await this.docClient.scan({
            TableName: this.booksTable
        }).promise()

        if (result.Count === 0)
            return [] as Book[]
        else {
            const items = result.Items
            return items as Book[]
        }
    }

    async getBook(bookId: string): Promise<Book> {

        const result = await this.docClient.query({
            TableName: this.booksTable,
            KeyConditionExpression: 'bookId = :bookId',
            ExpressionAttributeValues: {
                ':bookId': bookId
            }
        }).promise()

        if (result.Count !== 0)
            return result.Items[0] as Book
        else
            return null
    }

    async createBook(newBook: Book): Promise<Book> {
        await this.docClient.put({
            TableName: this.booksTable,
            Item: newBook
        }).promise()

        return newBook
    }

    async deleteBook(bookId: string) {
        await this.docClient.delete({
            TableName: this.booksTable,
            Key: {
                bookId: bookId
            }
        }).promise()
    }

    async getBookCoverUploadUrl(userId: string, bookId: string): Promise<string> {

        const book = await this.getBook(bookId);
        if (book) {

            if (book.createdBy !== userId) {
                throw Error('You cannot upload cover for somebody else\'s book');
            }

            const url = this.s3.getSignedUrl('putObject', {
                Bucket: this.bucketName,
                Key: bookId,
                Expires: parseInt(this.urlExpiration)
            })

            return url
        } else {
            return null
        }

    }

    async getBookCoverUrl(bookId: string): Promise<string> {
        return  this.s3.getSignedUrl('getObject', {
            Bucket: this.bucketName,
            Key: bookId,
            Expires: parseInt(this.urlExpiration)
        });
    }

    async updateBook(updatedBook: Book) {

        await this.docClient.update({
            TableName: this.booksTable,
            Key: {
                bookId: updatedBook.bookId
            },
            UpdateExpression: "set author = :author, #nm=:name, summary=:summary",
            ExpressionAttributeValues: {
                ":author": updatedBook.author,
                ":name": updatedBook.name,
                ":summary": updatedBook.summary
            },
            ExpressionAttributeNames: {
                "#nm": 'name'
            },
            ReturnValues: "UPDATED_NEW"
        }).promise()
    }

    async updateBookScore(updatedBook: Book) {
        await this.docClient.update({
            TableName: this.booksTable,
            Key: {
                bookId: updatedBook.bookId
            },
            UpdateExpression: "set score = :score",
            ExpressionAttributeValues: {
                ":score": updatedBook.score ? updatedBook.score : 0
            },
            ReturnValues: "UPDATED_NEW"
        }).promise()
    }
}



