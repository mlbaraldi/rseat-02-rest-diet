import fastify from 'fastify'
import { userRoutes } from '../routes/user'
import { mealsRoutes } from '../routes/meals'
import fastifyCookie from '@fastify/cookie'

const app = fastify()

app.addHook('preHandler', async (req) => {
  console.log(`[${req.method}] ${req.url}`)
})

app.register(fastifyCookie)
app.register(userRoutes)
app.register(mealsRoutes)

export default app
