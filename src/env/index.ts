import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config({ path: '.env' })
}

const envSchema = z.object({
  DB_CLIENT: z.string(),
  DB_URL: z.string(),
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(['test', 'prod', 'dev']).default('prod'),
})

export const env = envSchema.parse(process.env)
