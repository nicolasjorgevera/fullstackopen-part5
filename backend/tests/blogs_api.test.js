const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeAll (async () => {
  await User.deleteMany({})
  for (let user of helper.initialUsers) {
    let userObject = new User (user)
    await userObject.save()
  }
})

beforeEach (async () => {
  await Blog.deleteMany({})
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog (blog)
    await blogObject.save()
  }
})

describe('Get section', () => {
  test('blogs are reruned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('correct id property', async () => {
    const response =  await api.get('/api/blogs')
    for (let blog of response.body) {
      expect(blog.id).toBeDefined()
    }
  })
})

describe('Adding section of blogs', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'New blog',
      author: 'New Author',
      url: 'https://newblog.com/',
      likes: 10,
    }
    const user = {
      username: 'Fredy',
      password: '1234'
    }
    let token = ''
    await api
      .post('/api/login')
      .send(user)
      .set('Content-Type', 'application/json')
      .then( (res) => {
        token = res.body.token
      })
    await api
      .post('/api/blogs')
      .send(newBlog)
      .auth(token, { type: 'bearer' })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(blog => blog.url)
    expect(contents).toContain('https://newblog.com/')
  })


  test('a blog without propertie likes can be added', async () => {
    const newBlog = {
      title: 'New blog',
      author: 'New Author',
      url: 'https://newblog.com/',
    }
    const user = {
      username: 'Fredy',
      password: '1234'
    }
    let token = ''
    await api
      .post('/api/login')
      .send(user)
      .set('Content-Type', 'application/json')
      .then( (res) => {
        token = res.body.token
      })
    await api
      .post('/api/blogs')
      .send(newBlog)
      .auth(token, { type: 'bearer' })
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)

  })

  test('a blog without propertie title is not added', async () => {
    const newBlog = {
      author: 'New Author',
      url: 'https://newblog.com/',
    }
    const user = {
      username: 'Fredy',
      password: '1234'
    }
    let token = ''
    await api
      .post('/api/login')
      .send(user)
      .set('Content-Type', 'application/json')
      .then( (res) => {
        token = res.body.token
      })
    await api
      .post('/api/blogs')
      .send(newBlog)
      .auth(token, { type: 'bearer' })
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

  })

  test('a blog without propertie url is not added', async () => {
    const newBlog = {
      title: 'New blog',
      author: 'New Author',
    }
    const user = {
      username: 'Fredy',
      password: '1234'
    }
    let token = ''
    await api
      .post('/api/login')
      .send(user)
      .set('Content-Type', 'application/json')
      .then( (res) => {
        token = res.body.token
      })
    await api
      .post('/api/blogs')
      .send(newBlog)
      .auth(token, { type: 'bearer' })
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

  })

  test('a blog with out token is not added', async () => {
    const newBlog = {
      title: 'New blog',
      author: 'New Author',
      url: 'https://newblog.com/',
      likes: 10,
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

  })
})

describe('Delete section of blogs', () => {
  test('A specific blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map (blog => blog.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('Update Section of blogs', () => {
  test('A specific blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    blogToUpdate.likes = 50
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd[0].likes).toBe(50)
  })
})

afterAll(() => {
  mongoose.connection.close()
})