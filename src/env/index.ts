import { config } from 'dotenv'
import { envSchema } from '../../schema'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config({ path: '.env' })
}

export const env = envSchema.parse(process.env)
