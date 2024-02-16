import { FastifyRequest, FastifyReply } from 'fastify'
import { knex } from '../db/database'

export async function checkUserId(req: FastifyRequest, res: FastifyReply) {
  const { userId } = req.cookies

  if (!userId) {
    return res.status(401).send({
      error: 'User not logged. Please create a User POST /user',
    })
  }

  const user = await knex('users').where('id', userId)

  if (user.length === 0) {
    return res.status(401).send({
      error: 'User does not exist. Please verify userId',
    })
  }
}
