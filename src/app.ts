import fastify from 'fastify'
import { userRoutes } from '../routes/user'
import { mealsRoutes } from '../routes/meals'

const app = fastify()

app.register(mealsRoutes)
app.register(userRoutes)

export default app
