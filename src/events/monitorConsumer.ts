import { webMonitorRegisterResponse } from 'src/controllers'
import { logger } from 'src/lib'
import { NotImplementedError, validateResponse } from 'src/utils'
import { createConsumer } from '../lib/kafka'

const topic = 'monitor-events'

const handleConsumerReceiveResponse = async (data: any) => {
  try {
    const response: IResponse = await validateResponse(data)
    await webMonitorRegisterResponse(response)
  } catch (error) {
    logger.error('Error handling website response from consumer:', error)
  }
}

const handleMonitorError = async (data: any) => {
  logger.error('Handle Monitor Error not implemented')
  throw new NotImplementedError('Handle monitor error')
}

export const registerMonitorConsumer = async () => {
  createConsumer(topic, 'register-response', handleConsumerReceiveResponse)
  createConsumer(topic, 'error', handleMonitorError)
}
