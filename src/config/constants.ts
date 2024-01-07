import 'dotenv/config'

export const HOST = process.env.HOST ?? 'localhost'
export const PORT = Number(process.env.PORT) ?? 8000
export const NODE_ENV = process.env.NODE_ENV ?? 'development'

export const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://root:changeme@mongo-monitor:27017'
export const LOGGING_LEVEL = process.env.LOGGING_LEVEL ?? 'info'

export const GATEWAY_URL = process.env.GATEWAY_URL ?? 'http://localhost:8080'
export const NETWORK_TOKEN = process.env.NETWORK_TOKEN ?? 'insecure'

export const KAFKA_HOST = process.env.KAFKA_HOST ?? ''
export const KAFKA_PORT = process.env.KAFKA_PORT ?? 0

