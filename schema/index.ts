import { z } from 'zod'

const createMealsBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  datetime: z.string(),
  isDiet: z.boolean(),
})

const createUserSchema = z.object({
  name: z.string(),
})

export { createUserSchema, createMealsBodySchema }
