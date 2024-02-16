import { afterAll, beforeAll, beforeEach, test, describe, expect } from 'vitest'
import app from '../src/app'
import request from 'supertest'
import { execSync } from 'node:child_process'

describe('user routes', () => {
  beforeAll(async () => await app.ready())

  afterAll(async () => await app.close())

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  test('should user be able to create new user', async () => {
    await request(app.server)
      .post('/user')
      .send({
        name: 'John Doe',
      })
      .expect(201)
  })

  test('should be able get user summary', async () => {
    const createUser = await request(app.server)
      .post('/user')
      .send({
        name: 'John Doe',
      })
      .expect(201)

    const cookies = createUser.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal Test1',
        description: 'Any description for the meal',
        datetime: '2024-01-01',
        isDiet: true,
      })
      .expect(200)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal Test2',
        description: 'Any description for the meal 2',
        datetime: '2024-01-02',
        isDiet: false,
      })
      .expect(200)

    const userSummary = await request(app.server)
      .get('/user')
      .set('Cookie', cookies)
      .expect(200)

    expect(userSummary.body).toEqual(
      expect.objectContaining({
        'Diet Streak!': 0,
        'Total meals': 2,
        'Total meals off diet': 1,
        'Total meals on diet': 1,
        User: createUser.body.user,
      }),
    )
  })
})
