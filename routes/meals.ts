import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/meals', () => {
    console.log('entrou em meals')
  })

  app.post('/meals', () => {
    const createMealsBodySchema = z.object({
      id: z.string().uuid(),
      Name: z.string(),
      description: z.string(),
      Datetime: z.date(),
      isDiet: z.boolean(),
    })
  })
}
