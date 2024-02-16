import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkUserId(req: FastifyRequest, res: FastifyReply) {
  const { userId } = req.cookies
  if (!userId) {
    return res.status(401).send({
      error: 'User not logged',
    })
  }
}
