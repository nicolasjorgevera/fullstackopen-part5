const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

const initialUsers = [
  {
    _id: '634e8c1820e3b9d92920c014',
    username: 'Nico',
    name: 'Nicolas',
    passwordHash: '$2b$10$yFg.MumSY.vutTSaadg9ReqkoBignMg3G3msv3bVDhLE/mXqEkLje',
    __v: 0
  },
  {
    _id: '634e8c4203da13458a1e3759',
    username: 'Fede',
    name: 'Federico',
    passwordHash: '$2b$10$pawei8ni1QbAmFNgMwL4UOKmZ8vv6OJ9RD2lXkNByF3v4WGUkVwtO',
    __v: 0
  },
  {
    _id: '634f19f71d9afd6e3cc3c729',
    username: 'Luciana',
    name: 'Federico',
    passwordHash: '$2b$10$cYvjmwi0NBlg7BKm49glLOBFuQYzHgraO6yJDogzvjoWWPg6Zecxq',
    __v: 0
  },
  {
    _id: '6364f0348f7b58f25bd7f5bf',
    username: 'Fredy',
    name: 'Castañeda',
    passwordHash: '$2b$10$iIzjAPk6s.4czdw/R8Gef.a2oXwScc4MO5ZA1GltNIN6EGIpEoC2q',
    blogs:[],
    __v: 0
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}


const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  initialUsers,
  usersInDb
}