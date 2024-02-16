import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { knex } from '../db/database'
import { createUserSchema } from '../schema'

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

    res.status(201).send(`User ID: ${userId} created successfully`)
  })

  app.get('/user', async (req, res) => {
    const id = req.cookies.userId
    if (!id) {
      res.status(401).send('User not authorized. Please create with /POST')
    }
    const user = await knex('users').where({ id }).first()
    return { user }
  })
}
