import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateReviewRequest } from '../../../requests/CreateReviewRequest'
import { getUserId } from '../../utils'

import * as reviews from '../../../bussinessLogic/reviews'
import { createLogger } from '../../../utils/logger'

const logger = createLogger('createReview')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const userId = getUserId(event)
  const newReviewRequest: CreateReviewRequest = JSON.parse(event.body)

  try {
    const newReview = await reviews.createReview(userId, newReviewRequest.bookId, newReviewRequest)
    logger.info('new review created: ', newReview)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        "review": newReview
      })
    }
  } catch (e) {
    logger.error('Error occured: ', e)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        e
      })
    }
  }

}
