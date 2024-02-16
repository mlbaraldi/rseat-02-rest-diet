import { z } from 'zod'

const createMealsBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  datetime: z.string(),
  isDiet: z.boolean(),
})

const patchMealsBodySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  datetime: z.string().optional(),
  isDiet: z.boolean().optional(),
})

const createUserSchema = z.object({
  name: z.string(),
})

const getMealSchema = z.object({
  id: z.string().uuid(),
})

const envSchema = z.object({
  DB_CLIENT: z.string(),
  DB_URL: z.string(),
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(['test', 'prod', 'dev']).default('prod'),
})

export {
  createUserSchema,
  createMealsBodySchema,
  envSchema,
  getMealSchema,
  patchMealsBodySchema,
}
