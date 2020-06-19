import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as reviews from '../../../bussinessLogic/reviews'
import { createLogger } from '../../../utils/logger'
import { getUserId } from '../../utils'

const logger = createLogger('getReviews')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const userId = getUserId(event)
  const bookId = event.pathParameters.bookId

  try {
    const result = await reviews.getAllReviewsForBook(userId, bookId)
    logger.info('Result: ', result );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "reviews": result })
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
