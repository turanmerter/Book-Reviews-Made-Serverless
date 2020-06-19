import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import * as reviews from '../../../bussinessLogic/reviews'
import { createLogger } from '../../../utils/logger'
import { getUserId } from '../../utils'

const logger = createLogger('deleteReview')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const userId = getUserId(event)
  const reviewId = event.pathParameters.reviewId

  try {
    const deleted = await reviews.deleteReview(userId, reviewId)
    logger.info('review deleted: ', deleted)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ''
    }
  } catch (e) {
    logger.error('Error occured: ', event)
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
