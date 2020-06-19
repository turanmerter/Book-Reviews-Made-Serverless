import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { Review } from '../models/Review'

const XAWS = AWSXRay.captureAWS(AWS)

export class ReviewAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly reviewsTable = process.env.REVIEWS_TABLE,
        private readonly reviewsTableIndex = process.env.REVIEWS_TABLE_INDEX
    ) {
    }

    async createReview(newReview: Review): Promise<Review> {
        await this.docClient.put({
            TableName: this.reviewsTable,
            Item: newReview
        }).promise()

        return newReview
    }

    async deleteReview(reviewId: string) {
        await this.docClient.delete({
            TableName: this.reviewsTable,
            Key: {
                reviewId: reviewId
            }
        }).promise()
    }

    async updateReview(updatedReview: Review) {

        await this.docClient.update({
            TableName: this.reviewsTable,
            Key: {
                reviewId: updatedReview.reviewId
            },
            UpdateExpression: "set #cm = :comment, score=:score",
            ExpressionAttributeValues: {
                ":comment": updatedReview.comment,
                ":score": updatedReview.score
            },
            ExpressionAttributeNames: {
                "#cm": "comment"
            },
            ReturnValues: "UPDATED_NEW"
        }).promise()
    }

    async getReview(reviewId: string): Promise<Review> {

        const result = await this.docClient.query({
            TableName: this.reviewsTable,
            KeyConditionExpression: 'reviewId = :reviewId',
            ExpressionAttributeValues: {
                ':reviewId': reviewId
            }
        }).promise()

        if (result.Count !== 0)
            return result.Items[0] as Review
        else
            return null
    }

    async getAllReviewsForBook(bookId: string): Promise<Review[]> {
        const result = await this.docClient.query({
            TableName: this.reviewsTable,
            IndexName: this.reviewsTableIndex,
            KeyConditionExpression: 'bookId = :bookId',
            ExpressionAttributeValues: { ':bookId': bookId }
        }).promise()

        if (result.Count === 0)
            return [] as Review[]
        else {
            const items = result.Items
            return items as Review[]
        }
    }
}



