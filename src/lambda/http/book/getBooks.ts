import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as books from '../../../bussinessLogic/books'
import { createLogger } from '../../../utils/logger'
import { getUserId } from '../../utils'

const logger = createLogger('getBooks')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const userId = getUserId(event)

  try {
    const result = await books.getAllBooks(userId);
    logger.info('Result: ', result );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ "books": result })
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
