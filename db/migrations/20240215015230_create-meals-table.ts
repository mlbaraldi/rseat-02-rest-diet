import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary().unique()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.timestamp('Datetime').notNullable()
    table.boolean('isDiet')
    table.text('userId').references('users.id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
