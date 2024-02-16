import { afterAll, beforeAll, beforeEach, test, describe, expect } from 'vitest'
import app from '../src/app'
import request from 'supertest'
import { execSync } from 'node:child_process'

describe('meals routes', () => {
  let cookies
  let user
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => await app.close())

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')

    user = await request(app.server).post('/user').send({
      name: 'John Doe',
    })
    cookies = user.get('Set-Cookie')
  })

  test('should be able to post a new meal', async () => {
    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Salad',
        description: 'lettuce!',
        datetime: '2024-01-02',
        isDiet: true,
      })
      .expect(200)
  })

  test.only('should be able patch existing meal', async () => {
    const meal = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Salad',
        description: 'lettuce!',
        datetime: '2024-01-02',
        isDiet: true,
      })

    await request(app.server)
      .patch(`/meals/${meal.body.id}`)
      .set('Cookie', cookies)
      .send({
        name: 'Bacon',
        description: 'changed',
        isDiet: false,
      })
      .expect(200)

    const patchedMeal = await request(app.server)
      .get(`/meals/${meal.body.id}`)
      .set('Cookie', cookies)

    expect(patchedMeal.body[0]).toEqual(
      expect.objectContaining({
        name: 'Bacon',
        description: 'changed',
        Datetime: '2024-01-02',
      }),
    )
  })
})
