import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import z from 'zod'
export async function userRoutes(app: FastifyInstance) {
  app.get('/user', (req) => {
    const createUserSchema = z.object({
      id: randomUUID(),
      name: z.string(),
    })
    const data = req.body

    console.log('entrou em user')
  })

  app.post('/user', () => {
    console.log('postou em user')
  })
}
