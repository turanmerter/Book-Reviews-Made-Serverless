import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateBookRequest } from '../../../requests/CreateBookRequest'
import { getUserId } from '../../utils'

import * as books from '../../../bussinessLogic/books'
import { createLogger } from '../../../utils/logger'

const logger = createLogger('createBook')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const userId = getUserId(event)
  const newBookRequest: CreateBookRequest = JSON.parse(event.body)

  try {
    const newBook = await books.createBook(userId, newBookRequest)
    logger.info('new book created: ', newBook)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        "book": newBook
      })
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
