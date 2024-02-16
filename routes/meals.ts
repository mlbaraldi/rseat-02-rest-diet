import { FastifyInstance } from 'fastify'
import { checkUserId } from '../middlewares/check-user-id'
import { createMealsBodySchema } from '../schema'
import { knex } from '../db/database'
import { randomUUID } from 'crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', (req, res) => checkUserId(req, res))

  app.post('/meals', async (req) => {
    const userId = req.cookies.userId

    const { name, description, datetime, isDiet } = createMealsBodySchema.parse(
      req.body,
    )

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      datetime,
      isDiet,
      userId,
    })
  })

  app.get('/meals', async (req, res) => {
    const userId = req.cookies.userId
    console.log(userId)

    const response = await knex('meals').where('userId', userId)

    res.status(200).send(response)
  })
}
