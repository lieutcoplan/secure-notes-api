import pino from 'pino'
import pinoHttp from 'pino-http'

const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty'
  },
})

export const httpLogger = pinoHttp({logger})