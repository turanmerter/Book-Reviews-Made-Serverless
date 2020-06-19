import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateBookRequest } from '../../../requests/UpdateBookRequest'
import * as books from '../../../bussinessLogic/books'
import { createLogger } from '../../../utils/logger'
import { getUserId } from '../../utils'

const logger = createLogger('updateBook')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const userId = getUserId(event)

  const bookId = event.pathParameters.bookId
  const updatedBookRequest: UpdateBookRequest = JSON.parse(event.body)

  try {
    await books.updateBook(userId, bookId, updatedBookRequest)
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
