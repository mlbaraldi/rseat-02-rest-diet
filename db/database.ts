import { Knex, knex as setupKnex } from 'knex'
import { env } from '../src/env'

export const configDev: Knex.Config = {
  client: env.DB_CLIENT,
  connection: env.DB_URL,
  useNullAsDefault: true,
  migrations: { extension: 'ts', directory: './db/migrations' },
}
export const knex = setupKnex(configDev)
