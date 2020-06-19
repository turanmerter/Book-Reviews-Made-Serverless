import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateReviewRequest } from '../../../requests/UpdateReviewRequest'
import * as reviews from '../../../bussinessLogic/reviews'
import { createLogger } from '../../../utils/logger'
import { getUserId } from '../../utils'

const logger = createLogger('updateReview')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const userId = getUserId(event)
  const reviewId = event.pathParameters.reviewId
  const updatedReviewRequest: UpdateReviewRequest = JSON.parse(event.body)

  try {
    await reviews.updateReview(userId, reviewId, updatedReviewRequest)
    logger.info('Update is completed')
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ''
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
