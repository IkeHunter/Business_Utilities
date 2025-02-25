import { isValidObjectId } from 'mongoose'
import { InvalidResponseFieldError } from '../exceptions'
import { isNumeric, isValidDate } from './validators'

const MAX_RESPONSE_TIME = 60 * 100 * 2

export const validateResponse = (data: any): IResponse => {
  if (!data.monitorId || !data.timestamp)
    throw new InvalidResponseFieldError('Must include monitor id and timestamp in response object.')

  if (!isValidObjectId(data.monitorId))
    throw new InvalidResponseFieldError('Monitor id must be a valid ObjectId')
  if (data.responseTime && !isNumeric(data.responseTime))
    throw new InvalidResponseFieldError('Response time must be a number.')
  if (!isValidDate(data.timestamp))
    throw new InvalidResponseFieldError(
      `Timestamp must be a valid date in ms (received ${data.timestamp}).`
    )
  if (
    data.responseTime != null &&
    (data.responseTime <= 1 || data.responseTime >= MAX_RESPONSE_TIME)
  )
    throw new InvalidResponseFieldError(
      `Response time must be between 0 and ${MAX_RESPONSE_TIME}ms`
    )

  return {
    monitorId: data.monitorId,
    responseTime: data.responseTime || null,
    timestamp: data.timestamp
  }
}
