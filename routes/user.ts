import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { knex } from '../db/database'
import { createUserSchema } from '../schema'
import { checkUserId } from '../middlewares/check-user-id'

export async function userRoutes(app: FastifyInstance) {
  app.post('/user', async (req, res) => {
    const { name } = createUserSchema.parse(req.body)
    let userId = req.cookies.userId

    if (userId) {
      res.status(401).send(`User ID: ${userId} already created and logged in`)
    }

    userId = randomUUID()
    res.cookie('userId', userId, {
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    })

    await knex('users').insert({
      id: userId,
      name,
    })

    console.log(`User ${userId} created`)

    res.status(201).send({ user: userId, message: 'User created' })
  })

  app.get('/user', { preHandler: checkUserId }, async (req, res) => {
    const id = req.cookies.userId

    const meals = await knex('meals').where('userId', id).orderBy('datetime')

    const totalMeals = meals.length
    const totalMealsOnDiet = meals.filter((meal) => meal.isDiet === 1).length
    const totalMealsOffDiet = totalMeals - totalMealsOnDiet

    let currentStreak = 0
    let maxStreak = 0

    for (let i = 0; i < totalMeals; i++) {
      if (meals[i].isDiet === 1) {
        currentStreak++
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak
        }
      } else {
        currentStreak = 0
      }
    }

    const response = {
      User: id,
      'Total meals': totalMeals,
      'Total meals on diet': totalMealsOnDiet,
      'Total meals off diet': totalMealsOffDiet,
      'Diet Streak!': currentStreak,
    }
    res.status(200).send(response)
  })
}
