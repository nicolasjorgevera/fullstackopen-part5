const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

beforeEach (async () => {
  await User.deleteMany({})
  for (let user of helper.initialUsers) {
    let userObject = new User (user)
    await userObject.save()
  }
})

describe ('Get section of users', () => {
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-type', /application\/json/)
  })

  test('all users are returned', async () => {
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(helper.initialUsers.length)
  })
})

describe ('Adding section of users', () => {
  test('a valid user can be added', async () => {
    const newUser = {
      username: 'pepito',
      name: 'Pepiro Juarez',
      password: 'pepito22'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1)

    const contents = usersAtEnd.map(user => user.username)
    expect(contents).toContain('pepito')
  })

  test('a user without username is not added', async () => {
    const newUser = {
      name: 'Pepiro Juarez',
      password: 'pepito22'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect({ error : 'User validation failed: username: Path `username` is required.' })

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
  })

  test('a user without password is not added', async () => {
    const newUser = {
      username: 'pepito',
      name: 'Pepiro Juarez'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect({ error : 'password missing' })

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
  })


  test('a user with user length < 3 is not added', async () => {
    const newUser = {
      username: 'pe',
      name: 'Pepiro Juarez',
      password: 'aaaaaaa'
    }
    const error = 'User validation failed: username: Path `username` (`' + newUser.username + '`) is shorter than the minimum allowed length (3).'
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect({ error : error })

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
  })

  test('a user with password length < 3 is not added', async () => {
    const newUser = {
      username: 'pepito',
      name: 'Pepiro Juarez',
      password: 'aa'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect({ error : 'password minimun length is 3' })

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
  })
})





afterAll(() => {
  mongoose.connection.close()
})