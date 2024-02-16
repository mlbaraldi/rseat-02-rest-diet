import { FastifyInstance } from 'fastify'
import { checkUserId } from '../middlewares/check-user-id'
import {
  createMealsBodySchema,
  getMealSchema,
  patchMealsBodySchema,
} from '../schema'
import { knex } from '../db/database'
import { randomUUID } from 'crypto'
import { FastifyReply } from 'fastify/types/reply'
import { FastifyRequest } from 'fastify/types/request'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', (req, res) => checkUserId(req, res))

  app.post('/meals', async (req: FastifyRequest, res: FastifyReply) => {
    const userId = req.cookies.userId

    const { name, description, datetime, isDiet } = createMealsBodySchema.parse(
      req.body,
    )

    const newMeal = {
      id: randomUUID(),
      name,
      description,
      datetime,
      isDiet,
      userId,
    }

    await knex('meals').insert(newMeal)

    console.log(`New meal created: ${JSON.stringify(newMeal)}`)

    res.status(200).send(newMeal)
  })

  app.patch('/meals/:id', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const userId = req.cookies.userId
      const { id } = getMealSchema.parse(req.params)

      const { name, description, datetime, isDiet } =
        patchMealsBodySchema.parse(req.body)

      await knex('meals')
        .where('id', id)
        .where('userId', userId)
        .update({ name, description, datetime, isDiet })

      res.status(200).send('Meal updated')
    } catch (error) {
      console.error('Error updating meal:', error)
      res.status(500).send('Internal Server Error')
    }
  })

  app.get('/meals/:id', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const userId = req.cookies.userId
      const { id } = getMealSchema.parse(req.params)

      const meal = await knex('meals').where('id', id).where('userId', userId)

      res.status(200).send(meal)
    } catch (error) {
      console.error('Error getting meal:', error)
      res.status(500).send('Internal Server Error')
    }
  })

  app.delete('/meals/:id', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const userId = req.cookies.userId
      const { id } = getMealSchema.parse(req.params)

      await knex('meals').where('id', id).where('userId', userId).delete()

      res.status(200).send('Meal deleted')
    } catch (error) {
      console.error('Error getting meal:', error)
      res.status(500).send('Internal Server Error')
    }
  })

  app.get('/meals', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const userId = req.cookies.userId

      const meals = await knex('meals').where('userId', userId)

      res.status(200).send(meals)
    } catch (error) {
      console.error('Error getting meal:', error)
      res.status(500).send('Internal Server Error')
    }
  })
}
